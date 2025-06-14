'use client'
import {customColors} from '@/styles/MuiThemeRegistry/theme'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import React,{useEffect,useRef,useState} from 'react'
import lightLogo from '../../../public/images/ebco-logo.webp'

import {API_ENDPOINT} from '@/apiClient/apiEndpoint'
import {apiClient} from '@/apiClient/apiService'
import useDebounce from '@/hooks/useDebounce'
import {
  Cart as CartProduct
} from '@/interface/Cart'
import {DiscoveryCenterIndia} from '@/interface/discoveryCenterIndia'
import {MenuMobileProp} from '@/interface/MenuData'
import {ProductDetails} from '@/interface/productDetails'
import {VisitDiscoveryCenter} from '@/interface/VisitDiscoveryCenter'
import {logout} from '@/store/authReducer'
import {setCartProductsCount} from '@/store/cartCount'
import {setCartDrawerOpen} from '@/store/cartDrawer'
import {setDrawerOpen} from '@/store/drawerReducer'
import {
  setMainMenuAll,
  setMobileMainMenu
} from '@/store/mainMenu'
import {useAppDispatch,useAppSelector} from '@/store/reduxHooks'
import {setUrl} from '@/store/routeUrl'
import {removeAuthToken} from '@/utils/authToken'
import {inputError,useEbcoOrangeButtonStyle} from '@/utils/CommonStyling'
import {convertHtmltoArray,decodeHtml} from '@/utils/convertHtmltoArray'
import {getCategoryByName} from '@/utils/getCategoryByName'
import {mobileExtraMenu} from '@/utils/menuData/ExtraMenuMobile'
import {MenuData} from '@/utils/menuData/MainMenuData'
import AddIcon from '@mui/icons-material/Add'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import CloseIcon from '@mui/icons-material/Close'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveIcon from '@mui/icons-material/Remove'
import SearchIcon from '@mui/icons-material/Search'
import {Badge,Typography} from '@mui/material'
import {useMutation,useQuery} from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {SubmitHandler,useForm} from 'react-hook-form'
import {toast,ToastContainer} from 'react-toastify'
import Cart from './cart/Cart'
import './Header.css'
type Anchor = 'top' | 'left' | 'bottom' | 'right'

interface Category {
  [x: string]: any
  id: number
  name: string
  parent: number
  count: number
  menuOrder: number
  description: string
  image: {
    src: string
  }
}
const removeMenuItems = (menu: MenuProp[]) => {
  return menu.filter(
    item =>
      item.label !== 'Worksmart' &&
      item.label !== 'Ebco' &&
      item.label !== 'Livsmart',
  )
}

const fetchCategories = async (
  page: number,
): Promise<{ data: MenuData[]; totalPages: number }> => {
  try {
    const response = await apiClient.get<MenuData[]>(
      `${API_ENDPOINT.GET.get_categories}?page=${page}&per_page=100&orderby=name`,
    )

    if (!response) {
      throw new Error('No data found')
    }

    const totalPages = parseInt(response.headers['x-wp-totalpages'], 10)
    return { data: response.data, totalPages }
  } catch (error) {
    console.error('Failed to fetch new arrival data', error)
    return { data: [], totalPages: 0 } // Return an empty array and 0 total pages if an error occurs
  }
}

const fetchAllCategories = async (
  page: number = 1,
  allData: MenuData[] = [],
): Promise<MenuData[]> => {
  const { data, totalPages } = await fetchCategories(page)

  const combinedData = [...allData, ...data]

  if (page < totalPages) {
    return fetchAllCategories(page + 1, combinedData)
  }

  return combinedData
}

interface MenuProp {
  id: number
  label: string
  route: string
  children?: MenuProp[]
  name?: string
  isOpen?: boolean
  image?: string
  parent?: number
  count?: number
  menuOrder?: number
  description?: string
}
const fetchAllProducts = async (
  searchedValue: string,
): Promise<ProductDetails[]> => {
  if (searchedValue === '') return []
  try {
    // console.log("I AM CALLED");
    const response = await apiClient.get<ProductDetails[]>(
      ` ${API_ENDPOINT.GET.get_prod_products}?page=1&per_page=100&search=${searchedValue}&status=publish`,
    )
    // console.log(response, "new arrival data");
    if (!response) {
      throw new Error('No data found')
    }

    return response.data
  } catch (error) {
    console.error('Failed to fetch new arrival data', error)
    return [] // Return an empty array if an error occurs
  }
}
const getURL = (item: ProductDetails) => {
  const category = getCategoryByName(item.categories)

  if (category) {
    const baseUrl = window.location.origin
    const newUrl = `${baseUrl}/${category.name.toLowerCase()}/${item.slug}`

    return newUrl
  }
}

const fetchDiscoveryCenters = async (): Promise<DiscoveryCenterIndia[]> => {
  // console.log("fetchDiscoveryCenters called");
  try {
    const response = await apiClient.get<DiscoveryCenterIndia[]>(
      ` ${API_ENDPOINT.GET.getDiscoveryCenter}?discovery-center-category=757,758,789,760&page=1&per_page=100&_fields=id,title,acf&orderby=title&order=asc`,
    )
    // console.log(response.data, "-=-=-=-=-=-=-=-=-=-=-");
    if (!response) {
      throw new Error('No data found')
    }

    return response.data
  } catch (error) {
    console.error('Failed to fetch new arrival data', error)
    return [] // Return an empty array if an error occurs
  }
}

export default function AnchorTemporaryDrawer() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })
  const cartDrawer = useAppSelector((state: any) => state.cartDrawer)

  const [menuData, setMenuData] = useState<MenuProp[] | []>([])
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const cartCount = useAppSelector(state => state.cartCount).count

  const orangeEbcoButton = useEbcoOrangeButtonStyle()
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const searchValueDebounce = useDebounce<string>(searchValue, 300)
  const [ogMenu, setOgMenu] = useState<MenuProp[] | []>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedDiscoveryEmail, setSelectedDiscoveryEmail] =
    useState<string>('')
  const maincategories = ['ebco', 'livsmart', 'worksmart']
  const [selectedDiscoveryCenter, setSelectedDiscoveryCenter] =
    useState<string>('')
  const [discoveryOptions, setDiscoveryOptions] = useState<
    DiscoveryCenterIndia[]
  >([])
  const refButton = useRef()
  const auth = useAppSelector(state => state.auth).token
  const handleLogout = () => {
    removeAuthToken()
    dispatch(logout())
  }
  const handleProductClick = (item: ProductDetails) => {
    const category = getCategoryByName(item.categories)

    if (category) {
      router.push(`${category.name.toLowerCase()}/${item.slug}`)
      setSearchValue('')
      setIsSearchOpen(false)

      dispatch(
        setDrawerOpen({
          isOpen: false,
        }),
      )
    }
  }
  const [mainMenuProdData, setMainMenuProdData] = useState<MenuData[]>([])
  const [loading, setLoading] = useState(true)

  const handleDiscoveryCenterChange = (value: string) => {
    let findValue = discoveryOptions.find(item => item.title.rendered === value)
    if (findValue) {
      // console.log("find value", findValue);
      setSelectedDiscoveryEmail(findValue.acf.email)
    }
    setSelectedDiscoveryCenter(value)
  }
  const sendQuery = async (data: VisitDiscoveryCenter) => {
    // console.log(selectedDiscoveryEmail);
    // return;
    setIsLoading(true)
    let decodedCenter = decodeHtml(selectedDiscoveryCenter)
    // console.log(decodedCenter)
    try {
      const response = await apiClient.post<VisitDiscoveryCenter, any>(
        `${API_ENDPOINT.POST.sendQuery}/22193/feedback`,
        {
          // whoAmI: data.whoAmI,
          // password: data.password,
          discoveryCenter: decodedCenter,
          discoveryCenterEmail: selectedDiscoveryEmail.split(' / ')[0],
          // discoveryCenterEmail: "prathamesh.polsane@unicoconnect.com",
          _wpcf7_unit_tag: 'visit discovery center',
          email: data.email,
          fullname: data.fullname,
          mobile: data.mobile,
        },
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      )
      // console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      setIsLoading(false)
      return response
    } catch {}
  }
  const mutation = useMutation({
    mutationFn: sendQuery,
    onSuccess: data => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      // return;
      if (data.status === 'mail_sent') {
        // //console.log(data);

        // handleCloseDiscoveryCenterModal();
        reset()
        toast.success('Query submitted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
        toggleDrawerVisit(false)()
      } else {
        if (data.invalid_fields[0].field)
          toast.error(`Please enter valid  ${data.invalid_fields[0].field}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
      }
      // return;
      document.body.classList.remove('loading')
      document.body.classList.remove('loading')
      // console.log(data);
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })

  const onSubmit: SubmitHandler<VisitDiscoveryCenter> = data => {
    // console.log(data);
    mutation.mutate(data)
  }
  useEffect(() => {
    const fetchData = async () => {
      const allData = await fetchAllCategories()
      const updatedMenu = removeMenuItems(extraMenu)

      // Optionally, you can merge the fetched categories with the updated menu if needed
      // const finalMenu = [...updatedMenu, ...fetchedCategories];

      setExtraMenu(updatedMenu)
      setMainMenuProdData(allData)
      setLoading(false)
    }

    fetchData()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      if (auth) {
        await getCart.refetch()
      }
    }

    fetchData()
  }, [auth])
  const ProductSearch = useQuery({
    queryKey: ['product-search'],
    queryFn: () => fetchAllProducts(searchValueDebounce),
  })
  const [extraMenu, setExtraMenu] = useState<MenuProp[]>(mobileExtraMenu)
  const getDiscoveryCenters = async () => {
    let discoveryCenters = await DiscoveryCenters.refetch()

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords

        const calculateDistance = (
          lat1: any,
          lon1: any,
          lat2: any,
          lon2: any,
        ) => {
          const toRadians = (degree: any) => (degree * Math.PI) / 180
          const R = 6371 // Radius of the Earth in km
          const dLat = toRadians(lat2 - lat1)
          const dLon = toRadians(lon2 - lon1)
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
              Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          return R * c
        }
        const sorted = discoveryCenters?.data
          ?.map(location => ({
            ...location,
            distance: calculateDistance(
              latitude,
              longitude,
              location.acf.latitude,
              location.acf.longitude,
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
        setDiscoveryOptions(sorted!)

        // return;
      })
    }
    // console.log(discoveryCenters.data);
    setDiscoveryOptions(discoveryCenters.data!)
  }

  const DiscoveryCenters = useQuery({
    queryKey: ['discovery-centers'],
    queryFn: () => fetchDiscoveryCenters(),
  })

  const [searchedProducts, setSearchedProducts] = useState<
    ProductDetails[] | []
  >([])

  //console.log(drawer)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VisitDiscoveryCenter>()
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      // console.log("here", anchor, open);
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setState({ ...state, [anchor]: open })
      setMenuData(ogMenu)
    }

  const routeToPage = (
    route: string,
    parent: string,
    selectedItem: string = '',
  ) => {
    // console.log(route, parent, selectedItem);
    toggleDrawer(
      'right',
      false,
    )({
      type: 'click',
    } as React.MouseEvent)
  }

  const getHref = (
    route: string,
    parent: string,
    selectedItem: string = '',
  ): string => {
    if (parent === 'Distributor Login') {
      return 'https://www.ebco.co.in/login.php'
    } else if (maincategories.includes(parent.toLowerCase()) && !selectedItem) {
      return `/${parent.toLowerCase()}`
    } else if (
      !maincategories.includes(parent.toLowerCase()) &&
      !selectedItem
    ) {
      return `/${route}`
    } else if (maincategories.includes(parent.toLowerCase()) && selectedItem) {
      return `/${parent.toLowerCase()}?selectedItem=${encodeURIComponent(
        selectedItem,
      ).replace(/%20/g, '_')}`
    } else if (selectedItem && !maincategories.includes(parent.toLowerCase())) {
      return `/${route.toLowerCase()}`
    }
    return '/'
  }

  const buildCategoryTree = (
    categories: Category[],
    parentId: number = 0,
  ): MenuProp[] => {
    return categories
      .filter(category => category.parent === parentId)
      .map(category => ({
        id: category.id,
        label: category.name,
        route: category.name, // Construct the route as needed
        children: buildCategoryTree(categories, category.id),
        isOpen: false,
        menuOrder: category.menu_order,
        count: category.count,
        description: category.description,
        image: category?.image?.src ? category?.image?.src : '',
        parent: category.parent,
      }))
  }

  const transformToMenuProps = (categoryTree: MenuProp[]): MenuProp[] => {
    return categoryTree.map(category => ({
      ...category,
      children: category.children
        ? transformToMenuProps(category.children)
        : [],
    }))
  }
  const sortChildrenByMenuOrder = (items: MenuProp[]): MenuProp[] => {
    // Sort the children of each item
    const sortedItems = items.map(item => {
      if (item.children && item.children.length > 0) {
        item.children = sortChildrenByMenuOrder(item.children)
      }
      return item
    })

    // Sort the items themselves
    return sortedItems.sort((a, b) => a.menuOrder! - b.menuOrder!)
  }
  const fetchCartProducts = async (): Promise<CartProduct | []> => {
    if (!auth) {
      return []
    }
    try {
      const response = await apiClient.get<CartProduct>(
        ` ${API_ENDPOINT.GET.cart}`,
      )
      // //console.log(response.data, "-=-=-=-=-=-=-=-=-=-=-");
      if (!response) {
        throw new Error('No data found')
      }
      dispatch(setCartProductsCount(response.data.items.length))
      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return [] // Return an empty array if an error occurs
    }
  }
  const getCart = useQuery({
    queryKey: ['drawer-cart'],
    queryFn: () => fetchCartProducts(),
  })
  useEffect(() => {
    localStorage.setItem('menuData', JSON.stringify(mainMenuProdData))
    const categoryTree = buildCategoryTree(mainMenuProdData)
    const menuPropsData = transformToMenuProps(categoryTree)

    const filteredMenu = menuPropsData.filter(menu =>
      maincategories.includes(menu.label.toLowerCase()),
    )
    const sortedMenu = sortChildrenByMenuOrder(filteredMenu)
    let extendedMenuParent = [
      {
        id: 0,
        label: 'CATEGORIES',
        route: '/',
        children: [...sortedMenu, ...extraMenu],
        isOpen: true,
      },
    ]
    const extendedMenu = [...extendedMenuParent]
    setOgMenu(extendedMenu)
    setMenuData(extendedMenu)
    dispatch(setMainMenuAll(mainMenuProdData))
    dispatch(setMobileMainMenu(extendedMenu))
  }, [mainMenuProdData])

  const toggleDrawerVisit = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const toggleDrawerBottom =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setState({ ...state, [anchor]: open })
    }

  useEffect(() => {
    if (searchValue && searchValueDebounce && searchValueDebounce.length > 0) {
      setIsSearchOpen(true)
      dispatch(
        setDrawerOpen({
          isOpen: true,
        }),
      )
      const getAllProducts = async () => {
        let data = await ProductSearch.refetch()
        // console.log("inside true condition", data);
        setSearchedProducts(data.data!)
      }
      getAllProducts()
    } else {
      setIsSearchOpen(false)
      dispatch(
        setDrawerOpen({
          isOpen: false,
        }),
      )
    }
  }, [searchValueDebounce])
  const handleToggle = (item: MenuMobileProp) => {
    //console.log(item);
    // Create a deep copy of the menu data to avoid direct state mutation
    const updatedMenuData = JSON.parse(JSON.stringify(menuData))

    // Function to recursively toggle the isOpen state of the menu items
    function toggleItemState(items: MenuMobileProp[], itemId: number): void {
      items.forEach(menuItem => {
        if (menuItem.id === item.id) {
          // Toggle the isOpen state if the current item's ID matches
          menuItem.isOpen = !menuItem.isOpen
        }

        // If the item has children, recursively toggle their state
        if (menuItem.children) {
          toggleItemState(menuItem.children, itemId)
        }
      })
    }

    // Call the function to toggle the state
    toggleItemState(updatedMenuData, item.id)

    // Update the state with the new menu data
    setMenuData(updatedMenuData)
  }

  const list = (anchor: Anchor) => (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: '1',
          background: customColors.darkBlueEbco,
        }}
      >
        <Box
          className='row-space-between'
          sx={{
            color: customColors.whiteEbco,
            minHeight: '60px',
            padding: '0 2rem',
          }}
        >
          <Typography sx={{ color: 'inherit' }}>Menu</Typography>
          <CloseIcon
            sx={{ color: 'inherit' }}
            onClick={event => {
              //console.log("anchor" , anchor)
              toggleDrawer(anchor, false)(event)
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{ width: '100vw', flex: '1', height: '100vh' }}
        role='presentation'
        //   onClick={toggleDrawer(anchor, false)}
        //   onKeyDown={toggleDrawer(anchor, false)}
        className='drawer_class3'
      >
        <List
          className='h-100'
          sx={{
            background: customColors.blueEbcoText,
            flex: '1',
            padding: '0 !important',
          }}
        >
          {menuData.map((item, index) => {
            return (
              <ListItem
                key={index}
                disablePadding
                className='column-space-between w-100'
                sx={{
                  background: customColors.blueEbcoText,
                }}
              >
                <Box
                  className='w-100'
                  sx={{
                    backgroundColor: '#16335C',
                    padding: '0.5rem 0.5rem 0.5rem 1rem',
                    color: customColors.whiteEbco,
                    fontSize: '20px',
                  }}
                >
                  <ListItemText primary={item.label} className='w-100' />
                </Box>
                {item.isOpen && item.children && item.children?.length > 0 && (
                  <Box>
                    {item.children.map((child, i) => {
                      const href = getHref(child.route, child.label)
                      return (
                        <ListItem
                          key={i}
                          disablePadding
                          className='column-space-between'
                          sx={{
                            width: '100vw',
                          }}
                        >
                          <Box
                            className='w-100 row-space-between'
                            sx={{
                              backgroundColor: customColors.blueEbcoText,
                              color: customColors.whiteEbco,
                              padding: '0.5rem 1rem',
                              paddingLeft: child.isOpen ? '1rem' : '1.25rem',
                            }}
                          >
                            <Link
                              prefetch={false}
                              className={`mobile-nav-link w-100 h-100 ${
                                child.label === 'Shop Now'
                                  ? 'mobile-shop-now-btn'
                                  : ''
                              }`}
                              href={href}
                            >
                              <ListItemText
                                primary={child.label}
                                onClick={() => {
                                  routeToPage(child.route, child.label)
                                }}
                                sx={{
                                  color: child.isOpen
                                    ? customColors.orangeEbco
                                    : customColors.whiteEbco,
                                  fontSize: child.isOpen
                                    ? '20px !important'
                                    : '16px !important',
                                }}
                                id={child.id.toString()}
                                className={`w-100 ${
                                  child.id === 777 ||
                                  child.id === 888 ||
                                  child.id === 999
                                    ? 'disable-menu'
                                    : ''
                                }`}
                              />
                            </Link>
                            {child.isOpen &&
                            child.children &&
                            child.children?.length > 0 ? (
                              <ExpandLessIcon
                                sx={{ color: 'inherit' }}
                                onClick={() => {
                                  handleToggle(child)
                                }}
                              />
                            ) : !child.isOpen &&
                              child.children &&
                              child.children?.length > 0 ? (
                              <ExpandMoreIcon
                                sx={{ color: 'inherit' }}
                                onClick={() => {
                                  handleToggle(child)
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </Box>
                          {child.isOpen &&
                            child.children &&
                            child.children?.length > 0 && (
                              <Box>
                                {child.children.map(
                                  (grandchild, indexGrandChild) => {
                                    const href = getHref(
                                      grandchild.route,
                                      child.label,
                                      grandchild.route,
                                    )

                                    return (
                                      <ListItem
                                        key={indexGrandChild}
                                        disablePadding
                                        className='column-space-between'
                                        sx={{
                                          width: '100vw',
                                        }}
                                      >
                                        <Box
                                          className='w-100 row-space-between'
                                          sx={{
                                            backgroundColor:
                                              customColors.blueEbcoText,
                                            color: customColors.whiteEbco,
                                            padding: '0.5rem 1rem',
                                            paddingLeft: grandchild.isOpen
                                              ? '1rem'
                                              : '1.75rem',
                                          }}
                                        >
                                          <Link
                                            prefetch={false}
                                            href={href}
                                            className='mobile-nav-link w-100 h-100'
                                          >
                                            <ListItemText
                                              primary={grandchild.label}
                                              onClick={() => {
                                                routeToPage(
                                                  grandchild.route,
                                                  child.label,
                                                  grandchild.route,
                                                )
                                              }}
                                              sx={{
                                                color: grandchild.isOpen
                                                  ? customColors.orangeEbco
                                                  : customColors.whiteEbco,
                                              }}
                                            />
                                          </Link>
                                          {grandchild.isOpen &&
                                          grandchild.children &&
                                          grandchild.children?.length > 0 ? (
                                            <RemoveIcon
                                              onClick={() => {
                                                handleToggle(grandchild)
                                              }}
                                              sx={{ color: 'inherit' }}
                                            />
                                          ) : !grandchild.isOpen &&
                                            grandchild.children &&
                                            grandchild.children?.length > 0 ? (
                                            <AddIcon
                                              onClick={() => {
                                                handleToggle(grandchild)
                                              }}
                                              sx={{ color: 'inherit' }}
                                            />
                                          ) : (
                                            <></>
                                          )}
                                        </Box>
                                        {grandchild.isOpen &&
                                          grandchild.children &&
                                          grandchild.children?.length > 0 && (
                                            <Box>
                                              {grandchild.children.map(
                                                (
                                                  greatgrandchild,
                                                  indexLast,
                                                ) => {
                                                  const href = getHref(
                                                    greatgrandchild.route,
                                                    child.label,
                                                    greatgrandchild.route,
                                                  )
                                                  return (
                                                    <ListItem
                                                      key={indexLast}
                                                      disablePadding
                                                      className='column-space-between'
                                                      sx={{
                                                        width: '100vw',
                                                      }}
                                                    >
                                                      <Box
                                                        className='w-100 row-space-between'
                                                        sx={{
                                                          backgroundColor:
                                                            customColors.blueEbcoText,
                                                          color:
                                                            customColors.whiteEbco,
                                                          padding: '0.5rem',
                                                          paddingLeft:
                                                            greatgrandchild.isOpen &&
                                                            greatgrandchild.children &&
                                                            greatgrandchild
                                                              .children
                                                              ?.length > 0
                                                              ? '1.5rem'
                                                              : '2.5rem',
                                                        }}
                                                      >
                                                        <Link
                                                          prefetch={false}
                                                          href={href}
                                                          className='mobile-nav-link w-100 h-100'
                                                        >
                                                          <ListItemText
                                                            primary={
                                                              greatgrandchild.label
                                                            }
                                                            onClick={() => {
                                                              routeToPage(
                                                                greatgrandchild.route,
                                                                child.label,
                                                                greatgrandchild.route,
                                                              )
                                                            }}
                                                            sx={{
                                                              color:
                                                                greatgrandchild.isOpen
                                                                  ? customColors.orangeEbco
                                                                  : customColors.whiteEbco,
                                                              borderBottom:
                                                                greatgrandchild.children &&
                                                                greatgrandchild
                                                                  .children
                                                                  ?.length > 0
                                                                  ? 'none'
                                                                  : `1px solid ${customColors.menuBorderLight}`,
                                                            }}
                                                          />
                                                        </Link>
                                                        {greatgrandchild.isOpen &&
                                                        greatgrandchild.children &&
                                                        greatgrandchild.children
                                                          ?.length > 0 ? (
                                                          <RemoveIcon
                                                            sx={{
                                                              color: 'inherit',
                                                            }}
                                                            onClick={() => {
                                                              handleToggle(
                                                                greatgrandchild,
                                                              )
                                                            }}
                                                          />
                                                        ) : !greatgrandchild.isOpen &&
                                                          greatgrandchild.children &&
                                                          greatgrandchild
                                                            .children?.length >
                                                            0 ? (
                                                          <AddIcon
                                                            sx={{
                                                              color: 'inherit',
                                                            }}
                                                            onClick={() => {
                                                              handleToggle(
                                                                greatgrandchild,
                                                              )
                                                            }}
                                                          />
                                                        ) : (
                                                          <></>
                                                        )}{' '}
                                                      </Box>
                                                      {greatgrandchild.isOpen &&
                                                        greatgrandchild.children &&
                                                        greatgrandchild.children
                                                          ?.length > 0 && (
                                                          <Box>
                                                            {greatgrandchild.children.map(
                                                              (
                                                                greatgreatgrandchild,
                                                                indexLast,
                                                              ) => {
                                                                const href =
                                                                  getHref(
                                                                    greatgreatgrandchild.route,
                                                                    child.label,
                                                                    greatgreatgrandchild.route,
                                                                  )
                                                                return (
                                                                  <ListItem
                                                                    key={
                                                                      indexLast
                                                                    }
                                                                    disablePadding
                                                                    className='column-space-between'
                                                                    sx={{
                                                                      width:
                                                                        '100vw',
                                                                    }}
                                                                  >
                                                                    <Box
                                                                      className='w-100'
                                                                      sx={{
                                                                        backgroundColor:
                                                                          customColors.blueEbcoText,
                                                                        color:
                                                                          customColors.whiteEbco,
                                                                        padding:
                                                                          '0.5rem 0.5rem 0.5rem 2.75rem',
                                                                      }}
                                                                    >
                                                                      <Link
                                                                        prefetch={
                                                                          false
                                                                        }
                                                                        href={
                                                                          href
                                                                        }
                                                                        className='mobile-nav-link w-100 h-100'
                                                                        style={{
                                                                          color:
                                                                            '#fff',
                                                                        }}
                                                                      >
                                                                        <ListItemText
                                                                          primary={
                                                                            greatgreatgrandchild.label
                                                                          }
                                                                          onClick={() => {
                                                                            routeToPage(
                                                                              greatgreatgrandchild.route,
                                                                              child.label,
                                                                              greatgreatgrandchild.route,
                                                                            )
                                                                          }}
                                                                          sx={{
                                                                            padding:
                                                                              '0.5rem',
                                                                            borderBottom: `1px solid ${customColors.menuBorderLight}`,
                                                                          }}
                                                                        />
                                                                      </Link>
                                                                    </Box>
                                                                  </ListItem>
                                                                )
                                                              },
                                                            )}
                                                          </Box>
                                                        )}
                                                    </ListItem>
                                                  )
                                                },
                                              )}
                                            </Box>
                                          )}
                                      </ListItem>
                                    )
                                  },
                                )}
                              </Box>
                            )}
                          {item.children && item.children?.length - 1 !== i && (
                            <Box
                              sx={{
                                width: '90vw',
                                height: '1px',
                                backgroundColor: customColors.menuBorderLight,
                                margin: '0.25rem 2rem',
                              }}
                            ></Box>
                          )}
                        </ListItem>
                      )
                    })}
                  </Box>
                )}
              </ListItem>
            )
          })}
          <Box className='column-space-between'>
            <Box
              sx={{
                background: '#16335C',
                padding: '1rem 0.5rem',
                width: '100%',
              }}
            >
              <Typography
                sx={{
                  color: customColors.whiteEbco,
                  fontSize: '16px',
                  padding: '0.5rem',
                }}
                onClick={() => {
                  getDiscoveryCenters()
                  setOpen(true)
                }}
              >
                VISIT DISCOVERY CENTERS
              </Typography>
              <Typography
                sx={{
                  color: customColors.whiteEbco,
                  fontSize: '16px',
                  padding: '0.5rem',
                }}
                onClick={() => {
                  // setDrawerOpen
                  toggleDrawer(
                    'right',
                    false,
                  )({
                    type: 'click',
                  } as React.MouseEvent)
                  router.push('/careers')
                }}
              >
                CAREERS
              </Typography>
            </Box>
          </Box>
        </List>
        <Divider />
        <List></List>
      </Box>
    </>
  )

  const toggleDrawerCart = (newOpen: boolean) => () => {
    // console.log("called dispatch");
    dispatch(
      setCartDrawerOpen({
        isOpen: newOpen,
      }),
    )
    // setOpen(newOpen);
  }
  const DrawerListVisit = () => {
    return (
      <Box className='visit-drawer'>
        <CancelOutlinedIcon
          sx={{
            color: customColors.darkBlueEbco,
            position: 'absolute',
            top: '1rem !important',
            right: '1rem !important',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
          }}
          className='visit-center-close'
          onClick={() => setOpen(false)}
        />
        <Typography
          sx={{
            color: customColors.darkBlueEbco,
            fontFamily: 'Uniform Bold',
          }}
          className='visit-center-title'
        >
          Plan your visit
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=' w-100'
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '90%',
          }}
        >
          <Box>
            <Box className='row-space-between input-row w-100'>
              <Box
                className='input-section-mobile column-space-between w-100'
                sx={{
                  alignItems: 'flex-start',
                }}
              >
                <input
                  id='name'
                  type='text'
                  className='contact-us-input'
                  placeholder='Full Name'
                  style={{
                    color: customColors.lightGreyEbco,
                    border: `1px solid ${customColors.selectBox}`,
                  }}
                  {...register('fullname', {
                    required: true,
                    validate: value =>
                      (value && value.trim().length > 0) || 'Enter full name',
                  })}
                />

                {errors.fullname?.type === 'required' && (
                  <p role='alert' style={inputError}>
                    Full name is required
                  </p>
                )}

                {/* Display error if the query is not selected */}
                {/* {errors.query && (
                                                            <span style={{ color: 'red' }}>{errors.query.message}</span>
                                                        )} */}
              </Box>
            </Box>
            <Box
              className='input-section-mobile column-space-between'
              sx={{
                alignItems: 'flex-start',
                flex: '1',
              }}
            >
              <input
                id='email'
                type='text'
                className='contact-us-input'
                placeholder='Enter email'
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                }}
                {...register('email', {
                  required: true,
                  validate: value =>
                    (value && value.trim().length > 0) || 'Enter full name',
                })}
              />

              {errors.email?.type === 'required' && (
                <p role='alert' style={inputError}>
                  Full name is required
                </p>
              )}
            </Box>
            <Box
              className='input-section-mobile column-space-between'
              sx={{
                alignItems: 'flex-start',
                flex: '1',
              }}
            >
              <input
                id='number'
                type='number'
                className='contact-us-input'
                placeholder='Enter Contact Number'
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                }}
                {...register('mobile', {
                  required: true,
                  validate: value =>
                    (value && value.toString().trim().length > 0) ||
                    'Enter Contact Number',
                })}
              />

              {errors.mobile?.type === 'required' && (
                <p role='alert' style={inputError}>
                  Contact Number is required
                </p>
              )}

              {/* Display error if the query is not selected */}
              {/* {errors.query && (
                                        <span style={{ color: 'red' }}>{errors.query.message}</span>
                                    )} */}
            </Box>
            <Box
              className='input-section-query column-space-between w-100'
              sx={{
                alignItems: 'flex-start',
                margin: '0 !important',
                marginLeft: '1rem !important',
                width: '96%',
              }}
            >
              <select
                id='discoveryCenter'
                className='querySelect'
                {...register('discoveryCenter', {
                  required: 'Please select a Discovery Center',
                })}
                value={selectedDiscoveryCenter}
                onChange={e => {
                  handleDiscoveryCenterChange(e.target.value)
                }}
                style={{
                  padding: '0.5rem',
                  borderColor: customColors.selectBox,
                  fontFamily: 'Uniform Medium',
                  color: customColors.lightGreyEbco,
                  borderRadius: '4px',
                  width: '96%',
                }}
              >
                <option value='' disabled selected>
                  Select a Discovery Center
                </option>

                {/* Options */}
                {discoveryOptions.map((option, index) => {
                  return (
                    <option key={index} value={option.title.rendered}>
                      {decodeHtml(option.title.rendered)}
                    </option>
                  )
                })}
              </select>
              {errors.discoveryCenter?.type === 'required' && (
                <p role='alert' style={inputError}>
                  Full name is required
                </p>
              )}
              {/* Display error if the query is not selected */}
              {/* {errors.query && (
                                        <span style={{ color: 'red' }}>{errors.query.message}</span>
                                    )} */}
            </Box>
          </Box>

          <button
            className='submit-btn'
            type='submit'
            style={{
              ...orangeEbcoButton,
              marginTop: '2rem',
              width: 'auto',
              margin: '0 1rem',
            }}
          >
            Submit
          </button>
        </form>
      </Box>
    )
  }
  const listBottom = (anchor: Anchor) => (
    <Box
      role='presentation'
      //   onClick={toggleDrawer(anchor, false)}
      //   onKeyDown={toggleDrawer(anchor, false)}
      sx={{
        height: '30vh',
        borderTopLeftRadius: '1rem',
        position: 'relative',
        borderTopRightRadius: '1rem',
      }}
      className=''
    >
      <CloseIcon
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          color: customColors.darkBlueEbco,
          height: '1rem',
          width: '1rem',
          zIndex: '2',
        }}
        onClick={toggleDrawerBottom('bottom', false)}
      />
      <List className='logout_drawer'>
        {!auth && (
          <Box>
            <Typography
              className='logout-text'
              onClick={event => {
                // console.log("CUSTOMER LOGIN CLICKED");
                toggleDrawerBottom('bottom', false)(event)
                router.push('/login')
              }}
            >
              Sign In
            </Typography>
          </Box>
        )}
        <Divider />
        {!auth && (
          <Box>
            <Typography
              className='logout-text'
              onClick={event => {
                // console.log("CUSTOMER LOGIN CLICKED");
                toggleDrawerBottom('bottom', false)(event)
                router.push('/signup')
              }}
            >
              New User
            </Typography>
          </Box>
        )}
        <Divider />
        {/* <Box>
          <Typography className="logout-text">Distributor Login</Typography>
        </Box> */}
        <Divider />
        {auth && (
          <Box>
            <Typography
              className='logout-text'
              onClick={event => {
                // console.log("CUSTOMER LOGIN CLICKED");
                toggleDrawerBottom('bottom', false)(event)
                router.push(`/my-profile?tab=profile`)
              }}
            >
              Profile
            </Typography>
          </Box>
        )}
        {auth && (
          <Box
            onClick={event => {
              handleLogout()

              toggleDrawerBottom('bottom', false)(event)
            }}
          >
            <Typography className='logout-text'>Logout</Typography>
          </Box>
        )}
      </List>
    </Box>
  )
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    setSearchValue(value)
  }
  return (
    <React.Fragment key={'right'}>
      {isLoading && (
        <Box className='loader-container'>
          <Box className='loader'></Box>
        </Box>
      )}
      <Box
        className='mobile-header'
        sx={{
          position: 'sticky',
          top: '0',
          zIndex: '1000',
          padding: '0.35rem 0.5rem',
          backgroundColor: customColors.darkBlueEbco,
        }}
      >
        <Box className='column-space-between'>
          <Box className='row-space-between w-100'>
            <Box className='ebco-logo'>
              <Link
                prefetch={false}
                href='/'
                passHref
                className='w-100'
                rel='noopener noreferrer'
              >
                <Image src={lightLogo} alt='Ebco logo' width={65} height={40} />
              </Link>
            </Box>
            <Box
              className='column-space-between'
              flex={1}
              ml={2}
              alignItems={'flex-end'}
            >
              <Box
                className='row-space-between header-actions'
                sx={{
                  marginBottom: '0.35rem',
                  height: `${
                    cartCount > 0 ? `34px !important` : `32px !important`
                  }`,
                }}
              >
                <MenuIcon
                  onClick={toggleDrawer('right', true)}
                  sx={{
                    color: customColors.whiteEbco,
                    position: 'relative',
                    zIndex: '10',
                    height: '2rem',
                    width: '2rem',
                    marginRight: '0.5rem',
                  }}
                />
                <Box className='row-space-around action-icons'>
                  <PersonOutlineOutlinedIcon
                    onClick={toggleDrawerBottom('bottom', true)}
                    sx={{ color: customColors.darkBlueEbco }}
                    className='action-icon'
                  />

                  <FavoriteBorderOutlinedIcon
                    sx={{ color: customColors.darkBlueEbco }}
                    onClick={() => {
                      if (!auth) {
                        const currentUrl =
                          window.location.pathname + window.location.search

                        dispatch(
                          setUrl({
                            url: currentUrl,
                          }),
                        )
                        router.push('/login')
                      } else {
                        router.push('/my-profile?tab=wishlist')
                      }
                    }}
                    className='action-icon'
                  />

                  <BookmarkBorderOutlinedIcon
                    sx={{
                      color: customColors.darkBlueEbco,
                    }}
                    onClick={() => {
                      if (!auth) {
                        const currentUrl =
                          window.location.pathname + window.location.search

                        dispatch(
                          setUrl({
                            url: currentUrl,
                          }),
                        )
                        // //console.log(window.location);
                        let url = `${window.location.origin}/my-profile?tab=collection`
                        // //console.log(url, "-=-=-=-");
                        // return;
                        localStorage.setItem('url', url)
                        router.push('/login')
                      } else {
                        router.push('/my-profile?tab=collection')
                      }
                    }}
                    className='action-icon'
                  />
                  <Badge
                    className='cart-count'
                    badgeContent={cartCount}
                    color='primary'
                  >
                    <ShoppingCartOutlinedIcon
                      className='header-icon'
                      sx={{
                        color: customColors.darkBlueEbco,
                      }}
                      aria-label='cart'
                      onClick={() => {
                        toggleDrawerCart(true)()
                      }}
                    />
                  </Badge>
                </Box>
              </Box>
              <Box
                className='header-search'
                sx={{
                  flex: 1,
                  margin: '1rem 0.5rem 0.5rem',
                  border: `1px solid ${customColors.lightGreyEbco}`,
                  padding: '0.25rem 0.5rem',
                  borderRadius: '50px',
                  width: '100%',
                  display: 'flex',
                  position: 'relative',
                  backgroundColor: customColors.whiteEbco,
                }}
              >
                {!searchValue && (
                  <SearchIcon
                    sx={{
                      color: customColors.darkBlueEbco,
                    }}
                  />
                )}
                <input
                  type='text'
                  name='search'
                  placeholder='Search'
                  id='search'
                  className='w-100 custom-search-header'
                  value={searchValue}
                  autoComplete='off'
                  onChange={e => {
                    handleInputChange(e)
                  }}
                  style={{
                    color: customColors.darkBlueEbco,
                  }}
                />
                {searchValue && (
                  <>
                    <SearchIcon
                      sx={{
                        color: customColors.darkBlueEbco,
                        marginRight: '1.5rem !important',
                      }}
                      onClick={() => {
                        router.push(`/search?search=${searchValue}`)
                      }}
                    />

                    <CloseOutlinedIcon
                      sx={{
                        color: customColors.darkBlueEbco,
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '1rem',
                        height: '16px',
                        width: '16px',
                        top: '0.5rem',
                      }}
                      onClick={() => {
                        setSearchValue('')
                      }}
                    />
                  </>
                )}
                {isSearchOpen && (
                  <Box
                    className='searched-products-section'
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      marginTop: '1rem',
                      left: 0,
                      width: '100%',
                      maxHeight: '50vh',
                      height: 'auto',
                      backgroundColor: customColors.whiteEbco,
                      borderRadius: '16px',
                      boxShadow: '1px 1px 10px 1px #00000010',
                      padding: '1rem 2rem',
                      overflow: 'auto',
                    }}
                  >
                    <Box
                      className='searched-products-container'
                      sx={{
                        padding: '0.5rem',
                        overflow: 'auto',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Box>
                        {searchedProducts?.map((item, index) => {
                          const url = getURL(item) || ''
                          return (
                            <Link
                              prefetch={false}
                              href={url}
                              passHref
                              key={index}
                              className='w-100'
                            >
                              <Box
                                className='row-space-between searched-product'
                                sx={{
                                  padding: '0.5rem 1rem',
                                  borderBottom: '1px solid #00000010',
                                  alignItems: 'flex-start',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  handleProductClick(item)
                                }}
                                key={index}
                              >
                                <Image
                                  src={item.images[0].src}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                  className='searched-image'
                                />
                                <Box
                                  sx={{
                                    flex: 1,
                                    marginLeft: '1rem',
                                  }}
                                >
                                  <Typography
                                    className='search-product-title'
                                    sx={{ color: customColors.darkBlueEbco }}
                                  >
                                    {item.name}
                                  </Typography>
                                  <Typography
                                    className='search-product-description single-line'
                                    sx={{ color: customColors.lightGreyEbco }}
                                  >
                                    {convertHtmltoArray(item.description)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Link>
                          )
                        })}
                        {searchedProducts?.length > 0 && (
                          <Typography
                            sx={{
                              color: customColors.lightGreyEbco,
                              marginTop: '1rem',
                              padding: '0.5rem',
                              fontSize: '14px',
                            }}
                          >
                            End of the list
                          </Typography>
                        )}
                        {searchedProducts?.length === 0 &&
                          !ProductSearch.isFetching && (
                            <Typography
                              sx={{
                                color: customColors.lightGreyEbco,
                                fontSize: '14px',
                                padding: '0.5rem',
                              }}
                            >
                              No products found
                            </Typography>
                          )}
                        {ProductSearch.isFetching && (
                          <Typography
                            sx={{
                              color: customColors.lightGreyEbco,
                              fontSize: '14px',
                              padding: '0.5rem',
                            }}
                          >
                            Loading...
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Drawer
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
        className='drawer_class2'
        sx={{
          height: '100vh',
          flex: '1',
        }}
      >
        {list('right')}
      </Drawer>
      <Drawer open={open} anchor='bottom' onClose={toggleDrawerVisit(false)}>
        {DrawerListVisit()}
      </Drawer>
      <Drawer
        anchor={'bottom'}
        open={state['bottom']}
        className='logout_drawer_class'
        onClose={toggleDrawerBottom('bottom', false)}
      >
        {listBottom('bottom')}
      </Drawer>
      <Drawer
        open={cartDrawer.isOpen}
        anchor='right'
        onClose={toggleDrawerCart(false)}
        className='cartDrawer'
      >
        <Cart />
      </Drawer>
      <ToastContainer />
    </React.Fragment>
  )
}
