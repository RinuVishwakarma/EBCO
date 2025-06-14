'use client'
import {customColors} from '@/styles/MuiThemeRegistry/theme'
import {
  // MainMenuDataApi,
  MenuData,
  secondaryMenuData,
} from '@/utils/menuData/MainMenuData'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import {
  Badge,
  Box,
  Modal,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import Drawer from '@mui/material/Drawer'
import Image from 'next/image'
import {useEffect,useRef,useState} from 'react'
import darkLogo from '../../../public/images/ebco-blue-logo.webp'
import lightLogo from '../../../public/images/ebco-logo.webp'
import './Header.css'
// import { MenuProp } from "@/interface/MenuData";
import {API_ENDPOINT} from '@/apiClient/apiEndpoint'
import {apiClient} from '@/apiClient/apiService'
import useDebounce from '@/hooks/useDebounce'
import {
  Cart as CartProduct
} from '@/interface/Cart'
import {DiscoveryCenterIndia} from '@/interface/discoveryCenterIndia'
import {ProductDetails} from '@/interface/productDetails'
import {VisitDiscoveryCenter} from '@/interface/VisitDiscoveryCenter'
import {setCartProductsCount} from '@/store/cartCount'
import {setCartDrawerOpen} from '@/store/cartDrawer'
import {setDrawerOpen} from '@/store/drawerReducer'
import {setMainMenu,setMainMenuAll} from '@/store/mainMenu'
import {useAppDispatch,useAppSelector} from '@/store/reduxHooks'
import {setUrl} from '@/store/routeUrl'
import {inputError,useEbcoOrangeButtonStyle} from '@/utils/CommonStyling'
import {convertHtmltoArray,decodeHtml} from '@/utils/convertHtmltoArray'
import {getCategoryByName} from '@/utils/getCategoryByName'
import {extraMenuDefault} from '@/utils/menuData/ExtraMenu'
import getTransition from '@/utils/transitionDelay'
import {useDropdown} from '@mui/base/useDropdown'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import {useMutation,useQuery} from '@tanstack/react-query'
import {motion} from 'framer-motion'
import {E164Number} from 'libphonenumber-js'
import Link from 'next/link'
import {usePathname,useRouter} from 'next/navigation'
import {SubmitHandler,useForm} from 'react-hook-form'
import PhoneInputWithCountrySelect from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {toast,ToastContainer} from 'react-toastify'
import DarkCrossMenu from '../../../public/images/darkCrossMenu.svg'
import LightCrossMenu from '../../../public/images/LightCrossMenu.svg'
import Cart from './cart/Cart'
import UseMenu from './CustomDropdown'
import DrawerAnchor from './DrawerNavigation'
import MenuMotionWrapper from './MenuMotionWrapper'
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

interface MenuProp {
  id: number
  label: string
  route: string
  children?: MenuProp[] | undefined
  name?: string
  image?: string
  parent?: number
  count?: number
  menuOrder?: number
  description?: string
}

// Function to build the category tree
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
    children: category.children ? transformToMenuProps(category.children) : [],
  }))
}

interface DiscoveryCenters {
  id: string
  title: {
    rendered: string
  }
  acf: {
    email: string
  }
}
interface ResponseDiscoveryCenters {
  id: string
  title: string
  email: string
}
const fetchDiscoveryCenters = async (): Promise<DiscoveryCenterIndia[]> => {
  // //console.log("fetchDiscoveryCenters called");
  try {
    const response = await apiClient.get<DiscoveryCenterIndia[]>(
      ` ${API_ENDPOINT.GET.getDiscoveryCenter}?discovery-center-category=757,758,789,760&page=1&per_page=100&_fields=id,title,acf&orderby=title&order=asc`,
    )
    // //console.log(response.data, "-=-=-=-=-=-=-=-=-=-=-");
    if (!response) {
      throw new Error('No data found')
    }

    return response.data
  } catch (error) {
    console.error('Failed to fetch new arrival data', error)
    return [] // Return an empty array if an error occurs
  }
}

const fetchAllProducts = async (
  searchedValue: string,
): Promise<ProductDetails[]> => {
  if (searchedValue === '') return []
  try {
    const response = await apiClient.get<ProductDetails[]>(
      ` ${API_ENDPOINT.GET.get_prod_products}?page=1&per_page=100&search=${searchedValue}&status=publish`,
    )
    // //console.log(response, "new arrival data");
    if (!response) {
      throw new Error('No data found')
    }

    return response.data
  } catch (error) {
    console.error('Failed to fetch new arrival data', error)
    return [] // Return an empty array if an error occurs
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
  // return { data: [], totalP}
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

export const Header = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VisitDiscoveryCenter>()
  const orangeEbcoButton = useEbcoOrangeButtonStyle()
  const { contextValue: dropdownContextValue } = useDropdown()

  const [useBlueHeader, setUseBlueHeader] = useState<boolean>(true)
  const [toggleMenu, setToggleMenu] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(true)
  const [mainMenuData, setMainMenuData] = useState<MenuProp[] | []>([])
  const [ogMenu, setOgMenu] = useState<MenuProp[] | []>([])
  const [subMenuData, setSubMenuData] = useState<MenuProp[] | []>([])
  const cartDrawer = useAppSelector((state: any) => state.cartDrawer)
  const auth = useAppSelector(state => state.auth).token
  const cartCount = useAppSelector(state => state.cartCount).count
  const [secondSubMenu, setSecondSubMenu] = useState<MenuProp[] | []>([])
  const [thirdSubMenu, setThirdSubMenu] = useState<MenuProp[] | []>([])
  const [showLoginContainer, setShowLoginContainer] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [openDiscoveryCenterModal, setOpenDiscoveryCenterModal] =
    useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const searchValueDebounce = useDebounce<string>(searchValue, 300)

  const router = useRouter()
  const [headerColor, setHeaderColor] = useState<string>(
    customColors.darkBlueEbco,
  )
  const pathname = usePathname()
  const maincategories = ['ebco', 'livsmart', 'worksmart']
  const [open, setOpen] = useState<boolean>(false)
  const [activeParent, setActiveParent] = useState<string>('')
  const [menuImage, setMenuImage] = useState<string>('')
  const [contact, setContact] = useState<E164Number | undefined>(undefined)
  const [selectedDiscoveryCenter, setSelectedDiscoveryCenter] =
    useState<string>('')
  const [selectedDiscoveryEmail, setSelectedDiscoveryEmail] =
    useState<string>('')
  const cartProducts = useAppSelector(state => state.cart).products
  // const [contact, setContact] = useState<number | null>(null);
  const inputRef = useRef<boolean>(true)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  // const mainProductTypes = []
  const [extraMenu, setExtraMenu] = useState<MenuProp[]>(extraMenuDefault)
  const [menu, setMenu] = useState<MenuProp[] | any[]>(secondaryMenuData)
  const options = ['option1', 'option2', 'option3']
  const [isLoading, setIsLoading] = useState(false)
  const toggleMenuRef = useRef<HTMLDivElement | null>(null) // Ref for the toggle menu
  const searchRef = useRef<HTMLDivElement | null>(null)
  const inputSearchRef = useRef<HTMLInputElement | null>(null) // New ref for the input field

  const dropdownRef = useRef<HTMLDivElement>(null)
  const [contactError, setContectError] = useState(false)

  const [discoveryOptions, setDiscoveryOptions] = useState<
    DiscoveryCenterIndia[]
  >([])
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  }
  const [mainMenuProdData, setMainMenuProdData] = useState<MenuData[]>([])
  const [loading, setLoading] = useState(true)
  const fetchData = async () => {
    const allData = await fetchAllCategories()
    const updatedMenu = removeMenuItems(extraMenu)

    setExtraMenu(updatedMenu)
    setMainMenuProdData(allData)

    setLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      // Always fetch cart data, regardless of auth status
      await getCart.refetch()
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

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
  useEffect(() => {
    // localStorage.setItem("menuData", JSON.stringify(MainMenuDataApi));
    if (mainMenuProdData.length > 0) {
      localStorage.setItem('menuData', JSON.stringify(mainMenuProdData))
      const categoryTree = buildCategoryTree(mainMenuProdData)
      const menuPropsData = transformToMenuProps(categoryTree)
      const filteredMenu = menuPropsData.filter(menu =>
        maincategories.includes(menu.label.toLowerCase()),
      )
      const sortedMenu = sortChildrenByMenuOrder(filteredMenu)
      const extendedMenu = [...sortedMenu, ...extraMenu]
      setOgMenu(extendedMenu)
      setMainMenuData(extendedMenu)
      dispatch(setMainMenuAll(mainMenuProdData))
      dispatch(setMainMenu(extendedMenu))
    }
  }, [mainMenuProdData])
  interface SearchedProductProd {
    id: number
    image: string
    title: string
    description: string
  }
  const handleChangeContact = (value: any) => {
    setContact(value)
  }

  const getCustomMenuStyles = () => {
    return {
      borderBottom: `1px solid ${
        useBlueHeader
          ? customColors.menuBorderLight
          : customColors.menuBorderDark
      }`,
      width: '70%',
      marginBottom: '1rem',
      cursor: 'pointer',
      color: useBlueHeader ? customColors.whiteEbco : customColors.darkBlueEbco,
    }
  }

  const handleProductClick = (item: ProductDetails) => {
    const category = getCategoryByName(item.categories)

    if (category) {
      const baseUrl = window.location.origin
      const newUrl = `${baseUrl}/${category.name.toLowerCase()}/${item.slug}`

      router.push(newUrl)
      setSearchValue('')
      setIsSearchOpen(false)
      dispatch(
        setDrawerOpen({
          isOpen: false,
        }),
      )
    } else {
      return ''
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

  const handleParentMouseOver = (item: MenuProp, className: string) => {
    resetSubMenuData()
    if (item?.children && item?.children?.length > 0) {
      activeMenu(item.label, 'menu__link_parent', item.route)
      setSubMenuData(item?.children)
    } else {
      deactiveMenu('menu__link_parent')
    }
    if (item?.image) {
      setMenuImage(item?.image)
    }
  }
  interface ContactFormResponse {
    contact_form_id: number
    status: string
    message: string
    posted_data_hash: string
    into: string
    invalid_fields: InvalidField[] // Since it's an empty array, you can use `any[]`. If there are specific types for invalid fields, adjust accordingly.
  }
  interface InvalidField {
    field: string
    message: string
    idref: string | null
    error_id: string
  }

  const sendQuery = async (data: VisitDiscoveryCenter) => {
    setIsLoading(true)
    const decodeCenter = decodeHtml(selectedDiscoveryCenter)
    // console.log(decodeCenter)
    try {
      const response = await apiClient.post<
        VisitDiscoveryCenter,
        ContactFormResponse | any
      >(
        `${API_ENDPOINT.POST.sendQuery}/22193/feedback`,
        {
          // whoAmI: data.whoAmI,
          // password: data.password,
          discoveryCenter: decodeCenter,
          discoveryCenterEmail: selectedDiscoveryEmail.split(' / ')[0],
          // discoveryCenterEmail: "prathamesh.polsane@unicoconnect.com",
          _wpcf7_unit_tag: 'visit discovery center',
          email: data.email,
          fullname: data.fullname,
          mobile: contact!,
        },
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      )
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      setIsLoading(false)
      return response
    } catch {
      setIsLoading(false)
      return {} as ContactFormResponse
    }
  }
  const mutation = useMutation({
    mutationFn: sendQuery,
    onSuccess: (data: ContactFormResponse) => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      if (data.status === 'mail_sent') {
        // //console.log(data);
        setContact(undefined)

        handleCloseDiscoveryCenterModal()
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
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })

  const onSubmit: SubmitHandler<VisitDiscoveryCenter> = data => {
    if (!contact) {
      setContectError(true)
      return
    }
    mutation.mutate(data)
  }
  const toggleDrawer = (newOpen: boolean) => () => {
    ////console.log("called dispatch");
    dispatch(
      setCartDrawerOpen({
        isOpen: newOpen,
      }),
    )
    // setOpen(newOpen);
  }
  const [searchedProducts, setSearchedProducts] = useState<
    ProductDetails[] | []
  >([])
  const resetSubMenuData = () => {
    resetColors('menu__link_subparent')
    setSubMenuData([])
    setSecondSubMenu([])
    setThirdSubMenu([])
  }
  const handleOpenDiscoveryCenterModal = () => {
    setOpenDiscoveryCenterModal(true)
    getDiscoveryCenters()
  }
  const handleCloseDiscoveryCenterModal = () => {
    reset()
    setSelectedDiscoveryCenter('')
    setSelectedDiscoveryEmail('')
    setOpenDiscoveryCenterModal(false)
  }

  const resetColors = (className: string) => {
    const docs = document.querySelectorAll(`.${className}`)

    docs.forEach(doc => {
      const htmlDoc = doc as HTMLElement
      if (htmlDoc) {
        htmlDoc.style.color = customColors.darkBlueEbco
      }
    })
  }
  const DiscoveryCenters = useQuery({
    queryKey: ['discovery-centers'],
    queryFn: () => fetchDiscoveryCenters(),
  })
  const ProductSearch = useQuery({
    queryKey: ['product-search'],
    queryFn: () => fetchAllProducts(searchValueDebounce),
  })
  const resetSecondSubMenuData = () => {
    ////console.log("reset second sub menu data called");
    resetColors('menu__link_secondparent')
    setSecondSubMenu([])
    setThirdSubMenu([])
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toggleMenuRef.current &&
        !(toggleMenuRef.current as Node).contains(event.target as Node)
      ) {
        closeMenu() // Close the menu if clicked outside
        dispatch(
          setDrawerOpen({
            isOpen: false,
          }),
        )
      }
    }

    // Add event listener when component mounts
    document.addEventListener('click', handleClickOutside)

    // Clean up: Remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [toggleMenu]) // Re-run effect when toggleMenu changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click was outside of search container and not on the input field
      if (
        searchRef.current &&
        inputSearchRef.current &&
        !(searchRef.current as Node).contains(event.target as Node) &&
        !(inputSearchRef.current as Node).contains(event.target as Node)
      ) {
        setIsSearchOpen(false) // Close the menu if clicked outside
        setSearchValue('')
        dispatch(
          setDrawerOpen({
            isOpen: false,
          }),
        )
      }
    }

    // Add event listener when component mounts
    document.addEventListener('click', handleClickOutside)

    // Clean up: Remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isSearchOpen])

  const resetThirdSubMenuData = () => {
    resetColors('menu__link_child')
    setThirdSubMenu([])
  }
  // Function to build the category tree from flat data

  const activeMenu = (label: string, className: string, route: string) => {
    if (route.length > 0) {
      setActiveParent(route.toLowerCase())
    }
    let docs = document.querySelectorAll(
      `.${className}`,
    ) as NodeListOf<HTMLElement>
    docs.forEach(doc => {
      doc.style.color = useBlueHeader
        ? customColors.whiteEbco
        : customColors.orangeEbco
      if (doc.id !== label) {
        doc.style.color = customColors.darkBlueEbco
      }
    })
  }
  const activeMenuSecondary = (label: string, className: string) => {
    // //console.log(label, "label", className);
    let docs = document.querySelectorAll(
      `.${className}`,
    ) as NodeListOf<HTMLElement>
    docs.forEach(doc => {
      doc.style.display = 'none'
    })

    let border = document.getElementById(`${label}border`) as HTMLElement
    if (border) {
      border.style.display = 'block'
    }
  }
  const deactiveMenu = (className: string) => {
    let docs = document.querySelectorAll(
      `.${className}`,
    ) as NodeListOf<HTMLElement>
    docs.forEach(doc => {
      doc.style.color = useBlueHeader
        ? customColors.whiteEbco
        : customColors.darkBlueEbco
    })
  }
  const routeToPage = (path: string) => {
    router.push(`/my-profile?tab=${path}`)
  }

  const handleMouseOver = (
    item: MenuProp,
    className: string,
    setFunction: (children: MenuProp[]) => void,
  ) => {
    activeMenu(item.label, className, '')
    if (item?.children && item?.children?.length > 0) {
      setFunction(item?.children)
    }
  }
  const handleDiscoveryCenterChange = (value: string) => {
    let findValue = discoveryOptions.find(item => item.title.rendered === value)
    if (findValue) {
      // //console.log("find value", findValue);
      setSelectedDiscoveryEmail(findValue.acf.email)
    }
    setSelectedDiscoveryCenter(value)
  }
  const closeMenu = () => {
    resetSubMenuData()
    setToggleMenu(false)
    setShowMenu(true)
    setUseBlueHeader(true)
    let docs = document.querySelectorAll(
      `.Menu__border`,
    ) as NodeListOf<HTMLElement>
    docs.forEach(doc => {
      doc.style.display = 'none'
    })
    setMainMenuData(ogMenu)
    dispatch(
      setDrawerOpen({
        isOpen: false,
      }),
    )
  }
  const openMenu = () => {
    setToggleMenu(prev => !prev)
    setUseBlueHeader(false) // Toggle the value of useBlueHeader
    setShowMenu(prev => !prev) // Toggle the value of showMenu
    if (!useBlueHeader) {
      closeMenu()
    }
  }
  useEffect(() => {
    fetchData()
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
        setIsSearchOpen(false)
        dispatch(
          setDrawerOpen({
            isOpen: false,
          }),
        )
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
    // //console.log(mainMenuData);
  }, []) // Empty dependency array to ensure the effect runs only once

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
    // //console.log(discoveryCenters.data);
    setDiscoveryOptions(discoveryCenters.data!)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    setSearchValue(value)
  }

  const fetchCartProducts = async (): Promise<CartProduct | []> => {
    if (!auth) {
      // For non-logged in users, get cart from localStorage
      try {
        const { getLocalCart } = await import('@/utils/localStorageCart');
        const localCart = getLocalCart();

        // Update cart count in Redux store
        if (localCart && localCart.items) {
          dispatch(setCartProductsCount(localCart.items.length));
        }

        return localCart;
      } catch (error) {
        console.error('Failed to get local cart data', error);
        return [];
      }
    }

    // For logged-in users, fetch from API
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
      console.error('Failed to fetch cart data from API', error)
      return [] // Return an empty array if an error occurs
    }
  }
  const getCart = useQuery({
    queryKey: ['header-cart'],
    queryFn: () => fetchCartProducts(),
  })

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
        // //console.log("inside true condition", data);
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
  const handleRoute = (
    parentLink: string,
    selectedItem: string = '',
    item_label: string = '',
  ) => {
    closeMenu()
  }
  // Function to construct the URL based on the logic in handleRoute
  const getHref = (
    parentLink: string,
    selectedItem: string = '',
    item_label: string = '',
  ) => {
    if (parentLink === 'Distributor Login') {
      return 'https://www.ebco.co.in/login.php'
    }
    if (maincategories.includes(parentLink.toLowerCase())) {
      const encodedSelectedItem = encodeURIComponent(selectedItem)
      return selectedItem
        ? `/${parentLink}?selectedItem=${encodedSelectedItem.replace(
            /%20/g,
            '_',
          )}`
        : `/${parentLink.toLowerCase()}`
    } else {
      let joinedUrl = ''
      if (selectedItem) {
        joinedUrl = selectedItem.toLowerCase().split(' ').join('-')
      } else {
        joinedUrl = item_label.toLowerCase().split(' ').join('-')
      }
      return `/${joinedUrl}`
    }
  }
  return (
    <>
      {isLoading && (
        <Box className='loader-container'>
          <Box className='loader'></Box>
        </Box>
      )}
      <Box
        className='header'
        sx={{
          backgroundColor: '#092853',
          background: useBlueHeader
            ? headerColor
            : customColors.whiteHeaderEbco,
          minHeight: '60px',
        }}
      >
        <Box className=' row-space-between header-section'>
          <Box
            className='_ebco-logo'
            sx={{
              // alignSelf: "flex-start",
              height: '55px',
              cursor: 'pointer',
            }}
          >
            <Link
              prefetch={false}
              href='/'
              passHref
              className='w-100 h-100'
              rel='noopener noreferrer'
              style={{
                display: 'block',
              }}
            >
              <Image
                src={useBlueHeader ? lightLogo : darkLogo}
                alt='Ebco logo'
                width={100}
                height={isSmallScreen ? 58 : 73}
                className='header-logo'
                onClick={() => setSearchValue('')}
              />
            </Link>
          </Box>
          <Box className='header-content column-space-between'>
            <Box className='header-upper-section row-space-between w-100'>
              <MenuIcon
                sx={{
                  color: useBlueHeader
                    ? customColors.whiteEbco
                    : customColors.darkBlueEbco,
                  cursor: 'pointer',
                  width: '35px',
                  height: '35px',
                }}
                className='menu-hamburger'
                onClick={() => {
                  openMenu()
                  setShowLoginContainer(false)
                }}
              />
              <Box
                className='header-search row-center'
                sx={{
                  flex: 1,
                  margin: '0 1rem',
                  border: `1px solid ${customColors.lightGreyEbco}`,
                  padding: '0.5rem',
                  borderRadius: '50px',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* {!useBlueHeader ? ( */}
                {!searchValue && (
                  <Image
                    src={'/images/search-icon-blue.svg'}
                    alt='search'
                    width={18}
                    height={18}
                  />
                )}

                <input
                  type='text'
                  name='search'
                  value={searchValue}
                  ref={inputSearchRef}
                  placeholder='Search'
                  id='search'
                  className='w-100 custom-search-header'
                  onChange={e => {
                    handleInputChange(e)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      closeMenu()
                      setIsSearchOpen(false)
                      dispatch(
                        setDrawerOpen({
                          isOpen: false,
                        }),
                      )
                      router.push(
                        `/search?search=${searchValue.replace(/ /g, '_')}`,
                      )
                    }
                  }}
                  autoComplete='off'
                  style={{
                    color: customColors.darkBlueEbco,
                    border: 'none',
                  }}
                />
                {searchValue && (
                  <>
                    {/* {searchValue && ( */}
                    <Image
                      src={'/images/search-icon-blue.svg'}
                      alt='search'
                      width={18}
                      height={18}
                      style={{
                        color: customColors.darkBlueEbco,
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '2.25rem',
                        height: '16px',
                        width: '16px',
                        pointerEvents: 'all',
                      }}
                      onClick={() => {
                        router.push(
                          `/search?search=${searchValue.replace(/%20/g, '_')}`,
                        )
                        setSearchValue('')
                        closeMenu()
                        dispatch(
                          setDrawerOpen({
                            isOpen: false,
                          }),
                        )
                      }}
                    />
                    {/* )} */}
                    <CloseOutlinedIcon
                      sx={{
                        color: customColors.darkBlueEbco,
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '1rem',
                        height: '16px',
                        width: '16px',
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
                      height: 'auto',
                      maxHeight: '50vh',
                      backgroundColor: customColors.whiteEbco,
                      borderRadius: '16px',
                      boxShadow: '1px 1px 10px 1px #00000010',
                      padding: '1rem 2rem',
                      overflow: 'auto',
                    }}
                    ref={searchRef}
                  >
                    <Box
                      className='searched-products-container'
                      sx={{
                        padding: '1rem',
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
                                key={index}
                                onClick={() => {
                                  handleProductClick(item)
                                }}
                              >
                                <Image
                                  src={item?.images[0]?.src}
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
                                    className='search-product-title single-line'
                                    sx={{ color: customColors.darkBlueEbco }}
                                  >
                                    {decodeHtml(item.name)}
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
                            }}
                          >
                            End of the list
                          </Typography>
                        )}
                        {searchedProducts?.length === 0 &&
                          !ProductSearch.isFetching && (
                            <Typography
                              sx={{ color: customColors.lightGreyEbco }}
                            >
                              No Products Found
                            </Typography>
                          )}
                        {ProductSearch.isFetching && (
                          <Typography
                            sx={{ color: customColors.lightGreyEbco }}
                          >
                            Loading...
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
              <Typography
                sx={{
                  color: useBlueHeader
                    ? customColors.whiteEbco
                    : customColors.darkBlueEbco,
                  margin: '0 1rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
                className='other__menu'
                onClick={handleOpenDiscoveryCenterModal}
              >
                Visit Discovery Centers
              </Typography>
              <Typography
                sx={{
                  color: useBlueHeader
                    ? customColors.whiteEbco
                    : customColors.darkBlueEbco,
                  margin: '0 1rem',
                  marginRight: '0.5rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
                className='other__menu'
                onClick={() => {
                  router.push('/careers')
                }}
              >
                Careers
              </Typography>
            </Box>
          </Box>
          <Box
            className='header-shopping-icons row-space-between'
            sx={{
              background: customColors.whiteEbco,
              padding: '0.48rem 1rem',
              borderRadius: '50px',
              paddingRight: `${cartCount > 0 ? '1.3rem' : '1rem'}`,
            }}
          >
            <>
              <UseMenu />
            </>
            <Tooltip title='Wishlist' arrow>
              <FavoriteBorderOutlinedIcon
                className='header-icon fav-icon'
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
                    let url = `${window.location.origin}/my-profile?tab=wishlist`
                    // //console.log(url, "-=-=-=-");
                    // return;
                    localStorage.setItem('url', url)
                    router.push('/login')
                  } else {
                    routeToPage('wishlist')
                  }
                }}
              />
            </Tooltip>
            <Tooltip title='Collection' arrow>
              <BookmarkBorderOutlinedIcon
                className='header-icon fav-icon'
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

                    let url = `${window.location.origin}/my-profile?tab=collection`
                    console.log(url, '-=-=-=-')
                    // return;
                    localStorage.setItem('url', url)
                    router.push('/login')
                  } else {
                    routeToPage('collection')
                  }
                }}
              />
            </Tooltip>
            <Badge
              className='cart-count'
              badgeContent={cartCount}
              color='primary'
              invisible={cartCount <= 0}
            >
              <Tooltip title='Cart' arrow>
                <ShoppingCartOutlinedIcon
                  className='header-icon'
                  sx={{
                    color: customColors.darkBlueEbco,
                  }}
                  aria-label='cart'
                  onClick={() => {
                    toggleDrawer(true)()
                  }}
                />
              </Tooltip>
            </Badge>
          </Box>
        </Box>
        {toggleMenu && (
          <motion.div
            initial='hidden'
            whileInView='visible'
            transition={{ duration: getTransition(1, 0.2), ease: 'easeInOut' }}
            variants={{
              visible: { opacity: 1, transform: 'translateY(0px)' },
              hidden: { opacity: 0.2, transform: 'translateY(-50px)' },
            }}
            ref={toggleMenuRef}
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform, opacity',
            }}
          >
            {mainMenuData.length > 0 ? (
              <Box
                className='extended__menu row-space-between'
                sx={{
                  background: useBlueHeader
                    ? customColors.buleHeaderEbcoo
                    : customColors.whiteHeaderEbco,
                  padding: useBlueHeader ? '1rem 3rem' : '1rem 11rem',
                }}
              >
                <Box className='menu-data column-space-between w-25 child-submenu'>
                  {mainMenuData.map((item, index) => {
                    const href = getHref(item.label, '', item.route)
                    return (
                      <Link
                        prefetch={false}
                        href={href}
                        passHref
                        key={index}
                        className='menu__link_parent-link'
                      >
                        <Box
                          sx={getCustomMenuStyles()}
                          onClick={() => {
                            handleRoute(item.label, '', item.route)
                            setMenuImage('')
                          }}
                          onMouseOver={() => {
                            ////console.log(item);
                            handleParentMouseOver(item, 'menu__link_profile')
                          }}
                          onMouseLeave={() => {
                            setMenuImage('')
                          }}
                          id={item.label}
                          className='row-space-between menu__link_parent'
                        >
                          <Typography
                            sx={{ color: 'inherit' }}
                            className={`menu__link ${
                              item.label === 'Shop Now' ? 'shop-now-btn' : ''
                            }`}
                          >
                            {item.label}
                          </Typography>
                          {item?.children && item?.children?.length > 0 && (
                            <ChevronRightIcon sx={{ color: 'inherit' }} />
                          )}
                        </Box>
                      </Link>
                    )
                  })}
                </Box>
                {subMenuData.length > 0 && (
                  <Box className='sub-menu-data column-space-between w-25 child-submenu'>
                    {subMenuData.map((item, index) => {
                      const href = getHref(activeParent, item.label)

                      return (
                        <Link
                          prefetch={false}
                          href={href}
                          passHref
                          className='menu__link_subparent-link'
                          key={index}
                        >
                          <MenuMotionWrapper
                            index={index}
                            style={getCustomMenuStyles()}
                            id={item.label}
                            onClick={() => {
                              handleRoute(activeParent, item.label)
                            }}
                            onMouseOver={() => {
                              resetSecondSubMenuData()

                              handleMouseOver(
                                item,
                                'menu__link_subparent',
                                setSecondSubMenu,
                              )
                            }}
                            className='row-space-between menu__link_subparent'
                          >
                            <Typography
                              sx={{ color: 'inherit' }}
                              className='menu__link'
                            >
                              {item.label}
                            </Typography>
                            {item?.children && item?.children?.length > 0 && (
                              <ChevronRightIcon sx={{ color: 'inherit' }} />
                            )}
                          </MenuMotionWrapper>
                        </Link>
                      )
                    })}
                  </Box>
                )}
                {secondSubMenu.length > 0 && (
                  <Box className='second-submenu-data column-space-between w-25 child-submenu'>
                    {secondSubMenu.map((item, index) => {
                      const href = getHref(activeParent, item.label)

                      return (
                        <Link
                          prefetch={false}
                          href={href}
                          passHref
                          className='menu__link_secondparent-link'
                          key={index}
                        >
                          <MenuMotionWrapper
                            index={index}
                            style={getCustomMenuStyles()}
                            id={item.label}
                            onClick={() => {
                              handleRoute(activeParent, item.label)
                            }}
                            onMouseOver={() => {
                              resetThirdSubMenuData()

                              handleMouseOver(
                                item,
                                'menu__link_secondparent',
                                setThirdSubMenu,
                              )
                            }}
                            className='row-space-between menu__link_secondparent'
                          >
                            <Typography
                              sx={{ color: 'inherit' }}
                              className='menu__link'
                            >
                              {item.label}
                            </Typography>
                            {item?.children && item?.children?.length > 0 && (
                              <ChevronRightIcon sx={{ color: 'inherit' }} />
                            )}
                          </MenuMotionWrapper>
                        </Link>
                      )
                    })}
                  </Box>
                )}
                {thirdSubMenu.length > 0 && (
                  <Box className='third-submenu-data column-space-between w-25 child-submenu'>
                    {thirdSubMenu.map((item, index) => {
                      const href = getHref(activeParent, item.label)

                      return (
                        <Link
                          prefetch={false}
                          href={href}
                          passHref
                          className='menu__link_child-link'
                          key={index}
                        >
                          {' '}
                          <MenuMotionWrapper
                            index={index}
                            style={getCustomMenuStyles()}
                            id={item.label}
                            onMouseOver={() => {
                              activeMenu(item.label, 'menu__link_child', '')
                            }}
                            className='row-space-between menu__link_child'
                          >
                            <Typography
                              sx={{ color: 'inherit' }}
                              className='menu__link'
                              onClick={() => {
                                handleRoute(activeParent, item.label)
                              }}
                            >
                              {item.label}
                            </Typography>
                            {item?.children && item?.children?.length > 0 && (
                              <ChevronRightIcon sx={{ color: 'inherit' }} />
                            )}
                          </MenuMotionWrapper>
                        </Link>
                      )
                    })}
                  </Box>
                )}

                <Box
                  sx={{
                    position: 'absolute',
                    top: '0',
                    right: '4%',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    closeMenu()
                  }}
                >
                  <Image
                    src={useBlueHeader ? LightCrossMenu : DarkCrossMenu}
                    alt='Exit Menu'
                    width={40}
                    height={40}
                  />
                </Box>
              </Box>
            ) : (
              <Box
                className='extended__menu row-space-between'
                sx={{
                  background: useBlueHeader
                    ? customColors.buleHeaderEbcoo
                    : customColors.whiteHeaderEbco,
                  padding: useBlueHeader ? '1rem 3rem' : '1rem 11rem',
                }}
              >
                <Box className='menu-data column-space-between w-25 child-submenu'>
                  {extraMenu.map((item, index) => {
                    const href = getHref(item.label, '', item.route)
                    return (
                      <Link
                        prefetch={false}
                        href={href}
                        passHref
                        key={index}
                        className='menu__link_parent-link'
                        style={{
                          height: '45px !important',
                        }}
                      >
                        <Box
                          sx={{ ...getCustomMenuStyles(), height: '41px' }}
                          onClick={() => {
                            handleRoute(item.label, '', item.route)
                            setMenuImage('')
                          }}
                          onMouseOver={() => {
                            ////console.log(item);
                            handleParentMouseOver(item, 'menu__link_profile')
                          }}
                          onMouseLeave={() => {
                            setMenuImage('')
                          }}
                          id={item.label}
                          className='row-space-between menu__link_parent'
                        >
                          <Typography
                            sx={{ color: 'inherit' }}
                            className={`menu__link ${
                              item.label === 'Shop Now' ? 'shop-now-btn' : ''
                            }`}
                          >
                            {item.label}
                          </Typography>
                          {item?.children && item?.children?.length > 0 && (
                            <ChevronRightIcon sx={{ color: 'inherit' }} />
                          )}
                        </Box>
                      </Link>
                    )
                  })}
                </Box>
                {subMenuData.length > 0 && (
                  <Box className='sub-menu-data column-space-between w-25 child-submenu'>
                    {subMenuData.map((item, index) => {
                      const href = getHref(activeParent, item.label)

                      return (
                        <Link
                          prefetch={false}
                          href={href}
                          passHref
                          className='menu__link_subparent-link'
                          key={index}
                        >
                          <MenuMotionWrapper
                            index={index}
                            style={getCustomMenuStyles()}
                            id={item.label}
                            onClick={() => {
                              handleRoute(activeParent, item.label)
                            }}
                            onMouseOver={() => {
                              resetSecondSubMenuData()

                              handleMouseOver(
                                item,
                                'menu__link_subparent',
                                setSecondSubMenu,
                              )
                            }}
                            className='row-space-between menu__link_subparent'
                          >
                            <Typography
                              sx={{ color: 'inherit' }}
                              className='menu__link'
                            >
                              {item.label}
                            </Typography>
                            {item?.children && item?.children?.length > 0 && (
                              <ChevronRightIcon sx={{ color: 'inherit' }} />
                            )}
                          </MenuMotionWrapper>
                        </Link>
                      )
                    })}
                  </Box>
                )}
              </Box>
            )}
          </motion.div>
        )}
      </Box>
      <DrawerAnchor />
      <Modal
        open={openDiscoveryCenterModal}
        onClose={handleCloseDiscoveryCenterModal}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box
          sx={{
            ...style,
            width: '50vw',
            background: customColors.whiteEbco,
            outline: 'none',
            position: 'relative',
            borderRadius: '8px',
          }}
          className='column-center'
        >
          <CancelOutlinedIcon
            sx={{
              color: customColors.darkBlueEbco,
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
            }}
            className='visit-center-close'
            onClick={handleCloseDiscoveryCenterModal}
          />
          <Image
            src={'/images/darkLogoEbco.webp'}
            alt='Ebco Logo'
            width={100}
            height={70}
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
            className='column-center w-100'
            style={{}}
          >
            <Box className='row-space-between input-row w-100'>
              <Box
                className='input-section column-space-between w-100'
                sx={{
                  alignItems: 'flex-start',
                  margin: '0 !important',
                  marginRight: '1rem !important',
                }}
              >
                <input
                  id='name'
                  type='text'
                  className='contact-us-input'
                  placeholder='Full Name*'
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
              </Box>
            </Box>

            <Box className='row-space-between input-row w-100'>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                <input
                  id='email'
                  type='text'
                  className='contact-us-input'
                  placeholder='Enter email*'
                  style={{
                    color: customColors.lightGreyEbco,
                    border: `1px solid ${customColors.selectBox}`,
                  }}
                  {...register('email', {
                    required: true,
                    validate: value =>
                      (value && value.trim().length > 0) || 'Enter email',
                  })}
                />

                {errors.email?.type === 'required' && (
                  <p role='alert' style={inputError}>
                    Email is required
                  </p>
                )}
              </Box>
              <Box
                className='input-section column-space-between'
                sx={{
                  alignItems: 'flex-start',
                  flex: '1',
                }}
              >
                <PhoneInputWithCountrySelect
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry='IN'
                  value={contact}
                  {...(register('mobile'),
                  {
                    required: true,
                    validate: (value: any) => {
                      return (
                        (value && value.toString().trim().length > 0) ||
                        'Enter Contact Number'
                      )
                    },
                  })}
                  onChange={handleChangeContact}
                  className='phone-input-custom-form'
                />

                {contactError && (
                  <p role='alert' style={inputError}>
                    Enter Valid Contact Number
                  </p>
                )}
              </Box>
            </Box>
            <Box
              className='input-section-query column-space-between w-100'
              sx={{
                alignItems: 'flex-start',
                margin: '0 !important',
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
                }}
              >
                {/* Placeholder option */}
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
                  Select a discovery center*
                </p>
              )}
            </Box>

            <button
              className='submit-btn'
              type='submit'
              style={{ ...orangeEbcoButton, marginTop: '2rem' }}
            >
              Submit
            </button>
          </form>
        </Box>
      </Modal>
      <Drawer
        open={cartDrawer.isOpen}
        anchor='right'
        onClose={toggleDrawer(false)}
        className='cartDrawer'
      >
        <Cart />
      </Drawer>
      <ToastContainer />
    </>
  )
}
