'use client'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Drawer,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import '../Product/Product.css'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import React, { useEffect, useState, Suspense, useRef } from 'react'
import { CgMenuGridO } from 'react-icons/cg'
import { MdTableRows } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import EastIcon from '@mui/icons-material/East'
import WestIcon from '@mui/icons-material/West'
import { MenuData } from '@/utils/menuData/MainMenuData'
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks'
import { setDrawerOpen } from '@/store/drawerReducer'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useRouter as useNextRouterNav, useSearchParams } from 'next/navigation'
// import { Tooltip } from "react-tooltip";

import Head from 'next/head'
import { apiClient } from '@/apiClient/apiService'
// import { ProductDetails } from '@/interface/productDetails'
import { NewProduct, NewProductDetails } from '@/interface/NewProductDetails'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { ebcoApiData } from '@/utils/ebcoApiData'
import { convertHtmltoArray, decodeHtml } from '@/utils/convertHtmltoArray'
import formatPrice from '@/utils/formatPrice'
import useDebounce from '@/hooks/useDebounce'
import { getCategoryByName } from '@/utils/getCategoryByName'
import Link from 'next/link'
import { setUrl } from '@/store/routeUrl'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAddWishlist } from '@/hooks/useWishListAdd'
import { useRemoveWishlist } from '@/hooks/useWishlistRemove'
import { useAddBookmark } from '@/hooks/useBookmarkAdd'
import { useRemoveBookmark } from '@/hooks/useBookmarkRemove'
import { ShopPage } from '@/interface/ShopnowPage'
import ProductCard from '@/utils/ProductCard/ProductCard'
import ProductCardColumn from '@/utils/ProductCard/ProductCardColumn'
import ProductCardMobile from '@/utils/ProductCard/ProductCardMobile'
import { ProductDetails } from '@/interface/productDetails'
import ProductCollectionCard from '@/utils/ProductCard/ProductCollectionCard'
import ProductCollectionCardMobile from '@/utils/ProductCard/ProductCollectionMobile'
import ProductCollectionCardColumn from '@/utils/ProductCard/ProductCollectionColumn'
import { useTheme } from '@mui/material/styles'

interface ProductProps {
  type: string
}

interface Category {
  id: number
  label: string
  route: string
  children: SubCategory[]
  isChecked: boolean
}

interface SubCategory {
  id: number
  label: string
  route: string
  isChecked: boolean
  parentId?: number
  children?: SubCategory[]
}
interface filter {
  name: string
  id: number
}

const fetchCategories = async (
  page: number,
): Promise<{ data: MenuData[]; totalPages: number }> => {
  try {
    const response = await apiClient.get<MenuData[]>(
      `${API_ENDPOINT.GET.get_categories}?page=${page}&per_page=100&_fields=id,parent,name&orderby=name`,
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

interface pdfUrl {
  pdf_url: string
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

const ProductCollection = ({ slug }: { slug: string }) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const searchValueDebounce = useDebounce<string>(searchValue, 100)
  const optionss = ['Newly Added', 'Name : A to Z', 'Name : Z to A']
  const [options, setOptions] = useState<string[] | []>([])
  const extraOptions = ['Price: Low to High', 'Price: High to Low']
  const [selectedOption, setSelectedOption] = useState<string>('Newly Added')
  const [queryString, setQueryString] = useState<string>(
    '&order=desc&orderby=date',
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [view, setView] = useState<string>('grid')
  const [productType, setProductType] = useState<string>('ALL PRODUCTS')
  const [productDataAPi, setProductDataAPi] = useState<NewProduct[]>([])
  const [checkedSubCategoryIdsString, setCheckedSubCategoryIdsString] =
    useState<string>('')
  const [checkedSubCategoryIdsStringApi, setCheckedSubCategoryIdsStringApi] =
    useState<string>('')
  const per_page = 12
  const RestrictedFilterIds = [755, 756, 743, 723]
  const [categoryData, setCategoryData] = useState<Category[]>([])
  const [subCategoryData, setSubCategoryData] = useState<SubCategory[]>([])
  const router = useNextRouterNav()
  const query = useSearchParams()
  const dispatch = useAppDispatch()
  // const location = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<filter[] | []>([])
  const [activeFilters, setActiveFilters] = useState<filter[]>([])
  const [mobileActiveFilters, setMobileActiveFilters] = useState<filter[]>([])
  const [bannerImage, setBannerImage] = useState<string>('')
  const menuuuu = useAppSelector(state => state.mainMenu).mainMenu
  const [open, setOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const mainMenuData = useAppSelector(state => state.mainMenu).menu
  const [totalPages, setTotalPages] = useState(0)
  const [apiCompleted, setApiCompleted] = useState(false)
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [searchedProducts, setSearchedProducts] = useState<NewProduct[] | []>(
    [],
  )
  const [title, setTitle] = useState('')
  const [sender, setSender] = useState('')

  const useAddWishlistMutation = useAddWishlist()
  const useRemoveWishlistMutation = useRemoveWishlist()
  const useAddBookmarkMutation = useAddBookmark()
  const useRemoveBookmarkMutation = useRemoveBookmark()
  const [page, setPage] = React.useState(1)
  const auth = useAppSelector(state => state.auth).isLoggedIn
  const [shopPageBanner, setShopPageBanner] = useState<string>('')
  const theme = useTheme()

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const currentUrl = new URL(window.location.href)
    const searchParams = new URLSearchParams(currentUrl.search)
    searchParams.set('page', value.toString())
    currentUrl.search = searchParams.toString()
    window.history.pushState(null, '', currentUrl.toString())
    setPage(value)
  }
  const downloadBrochure = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<pdfUrl>(
        `${API_ENDPOINT.GET.downloadPdf}/${id}`,
      )

      if (!response) {
        throw new Error('No data found')
      }
      setIsLoading(false)
      return response.data.pdf_url
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return '' // Return an empty array and 0 total pages if an error occurs
    }
  }

  interface productCollectionReponnse {
    title: string
    sender_name: string
    products: NewProduct
  }
  const getProductCollection = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<productCollectionReponnse>(
        `${API_ENDPOINT.GET.productCollection}/${slug}`,
      )

      if (!response) {
        throw new Error('No data found')
      }
      setIsLoading(false)
      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return '' // Return an empty array and 0 total pages if an error occurs
    }
  }

  // Create a query options object
  const queryOptions = options.reduce((acc, option) => {
    let queryString = ''

    switch (option) {
      case 'Name : A to Z':
        queryString = '&order=asc&orderby=title'
        break
      case 'Name : Z to A':
        queryString = '&order=desc&orderby=title'
        break
      case 'Price: Low to High':
        queryString = '&order=asc&orderby=price'
        break
      case 'Price: High to Low':
        queryString = '&order=desc&orderby=price'
        break
      case 'Newly Added':
        queryString = '&order=desc&orderby=date'
        break
      case 'Default':
      default:
        queryString = ''
        break
    }

    acc[option] = queryString
    return acc
  }, {} as Record<string, string>)

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement> | any,
  ) => {
    const selected = event.target.value
    setSelectedOption(selected)
    setQueryString(queryOptions[selected])
  }
  const handleWishlistIcon = (data: NewProduct) => {
    if (isShopNow(data) && data.is_wishlist) {
      return customColors.darkBlueEbco
    } else if (!isShopNow(data) && data.is_wishlist) {
      return customColors.orangeEbco
    } else {
      return 'transparent'
    }
  }
  const handleBookmarkIcon = (data: NewProduct) => {
    if (isShopNow(data) && data.is_bookmark) {
      return customColors.darkBlueEbco
    } else if (!isShopNow(data) && data.is_bookmark) {
      return customColors.orangeEbco
    } else {
      return 'transparent'
    }
  }
  const handleWishlistBorder = (data: NewProduct) => {
    if (isShopNow(data) && !data.is_wishlist) {
      return customColors.darkBlueEbco
    } else if (!isShopNow(data) && !data.is_wishlist) {
      return customColors.orangeEbco
    } else {
      return 'white'
    }
  }
  const handleBookmarkBorder = (data: NewProduct) => {
    if (!isShopNow(data) && !data.is_bookmark) {
      return customColors.orangeEbco
    } else if (!isShopNow(data) && data.is_bookmark) {
      return customColors.whiteEbco
    }
  }

  const handleWishlistToggle = (data: NewProduct) => {
    if (!auth) {
      const href = window.location.href
      //console.log(href);
      dispatch(
        setUrl({
          url: href,
        }),
      )
      localStorage.setItem('url', href)
      router.push('/login')
      return
    }
    if (data && data.id !== null) {
      const updatedProducts = productDataAPi.map(product => {
        if (product.id === data.id) {
          const updatedProduct = {
            ...product,
            is_wishlist: !product?.is_wishlist,
          }

          // API Call to add/remove from wishlist
          if (updatedProduct.is_wishlist) {
            // API Call to add to wishlist

            useAddWishlistMutation.mutate(updatedProduct.id)
            // Make API call to add to wishlist here
          } else {
            // API Call to remove from wishlist

            useRemoveWishlistMutation.mutate(updatedProduct.id)

            // Make API call to remove from wishlist here
          }

          return updatedProduct
        }
        return product
      })

      setProductDataAPi(updatedProducts)
    }
  }
  const handleBookmarkToggle = (data: NewProduct) => {
    if (!auth) {
      const currentUrl = window.location.pathname + window.location.search
      const href = window.location.href
      //console.log(href);
      dispatch(
        setUrl({
          url: href,
        }),
      )
      localStorage.setItem('url', href)
      router.push('/login')
      return
    }
    ////console.log("wishlist toggle");
    if (data && data.id !== null) {
      const updatedProducts = productDataAPi.map(product => {
        if (product.id === data.id) {
          const updatedProduct = {
            ...product,
            is_bookmark: !product.is_bookmark,
          }

          // API Call to add/remove from wishlist
          if (updatedProduct.is_bookmark) {
            // API Call to add to wishlist

            useAddBookmarkMutation.mutate(updatedProduct.id)
            // Make API call to add to wishlist here
          } else {
            // API Call to remove from wishlist

            useRemoveBookmarkMutation.mutate(updatedProduct.id)

            // Make API call to remove from wishlist here
          }

          return updatedProduct
        }
        return product
      })

      setProductDataAPi(updatedProducts)
    }
  }

  const [mainMenuProdData, setMainMenuProdData] = useState<MenuData[]>([])

  const fetchShopPageData = async (): Promise<ShopPage | {}> => {
    try {
      const response = await apiClient.get<ShopPage>(
        `${API_ENDPOINT.GET.get_page}/${ebcoApiData.SHOP_NOW_PAGE}?acf_format=standard`,
      )

      if (!response || !response.data) {
        throw new Error('No data found')
      }
      setShopPageBanner(response.data.acf.banner_image.url)
      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data:', error)
      return {} // Return an empty object if an error occurs
    }
  }
  const shopPageQuery = useQuery({
    queryKey: ['shop-page'],
    queryFn: fetchShopPageData,
  })
  const downloadBrochureAndOpen = async (id: number, name: string) => {
    try {
      // Fetch the brochure URL or directly fetch the PDF data as Blob
      const url = await downloadBrochure(id)

      if (url) {
        // Fetch the PDF content as a blob
        const response = await fetch(url)
        const blob = await response.blob() // Convert the response into a Blob

        // Create a temporary object URL for the Blob
        const blobUrl = URL.createObjectURL(blob)

        // Create a temporary anchor element
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `${name}.pdf` // Set the desired file name with .pdf extension
        document.body.appendChild(link) // Append the link to the document

        // Trigger the download
        link.click()

        // Clean up the DOM and revoke the Blob URL to free up memory
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      }
    } catch (error) {
      console.error('Error downloading brochure:', error)
    }
  }

  const fetchProductData = async (
    param: string,
    id: string,
    checkedIds: string,
    filtersString: string = '',
  ): Promise<NewProduct[]> => {
    setProductDataAPi([])
    try {
      setIsLoading(true)
      setApiCompleted(false)
      // console.log("I AM CALLED API")
      const response = await apiClient.get<NewProductDetails>(
        ` ${API_ENDPOINT.GET.get_pinned_products}?${param}=${
          param === 'category' ? checkedIds : id
        }&per_page=${per_page}&page=${page}${queryString}&status=publish&tag=${filtersString}&search=${searchValueDebounce}`,
      )
      // ////console.log(response, "new arrival data");
      setIsLoading(false)
      setApiCompleted(true)
      document.body.classList.remove('loading')
      if (!response) {
        throw new Error('No data found')
      }
      // let totalPages = response.headers['x-wp-totalpages']
      let totalPages = response.data.pagination?.total_pages
      if (totalPages) {
        setTotalPages(totalPages)
        setTotalProducts(response.headers['x-wp-total'])
      }
      // Extract and log each tag's name
      // console.log('Products Response', response)
      response.data.products.forEach((item: NewProduct) => {
        item.tags.forEach(tag => {
          setFilters(prevFilters => {
            // Check if the tag is already present
            const tagExists = prevFilters.some(
              existingTag => existingTag.id === tag.id,
            )
            if (!tagExists && RestrictedFilterIds.indexOf(tag.id) === -1) {
              return [...prevFilters, { name: tag.name, id: tag.id }]
            }
            return prevFilters
          })
        })
      })
      return response.data.products.map((item: any) => {
        const hasNewArrivalTag = item.tags.some(
          (tag: { name: string }) => tag.name === 'NEW ARRIVAL',
        )
        return {
          ...item,
          tag: hasNewArrivalTag ? 'NEW ARRIVAL' : '', // Set tag to "NEW ARRIVAL" if it exists
        }
      })
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return [] // Return an empty array if an error occurs
    }
  }

  const isShopNow = (data: NewProduct) => {
    return data.tags && data.tags.some(tag => tag.id === 723)
  }

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      let data = (await getProductCollection()) as productCollectionReponnse
      //@ts-ignore
      setProductDataAPi(data.products)
      setTitle(data.title)
      setSender(data.sender_name)
    }

    fetchData() // Call the async function
  }, []) // Empty dependency array to run once when the component mounts

  useEffect(() => {
    ////console.log("Callled useFfect");
    const getPage = query.get('page')
    if (getPage) {
      setPage(Number(getPage))
    }
  }, [query])

  const handleProductClick = (item: NewProduct) => {
    const category = getCategoryByName(item.categories)
    ////console.log(category, "category");
    if (category) {
      let url = `/${category.name.toLowerCase()}/${item.slug}`

      router.push(url)
      setSearchValue('')
      setIsSearchOpen(false)
      dispatch(
        setDrawerOpen({
          isOpen: false,
        }),
      )
    }
  }

  return (
    <>
      <Head>
        <title>Ebco - Furniture Fittings and Accessories</title>
        <meta
          name='description'
          content="Explore Ebco Home's diverse selection of premium hardware products featuring innovative solutions for drawers, hinges, computer furniture, joinery, wardrobes, locks, and kitchen systems. Elevate your living spaces with our cutting-edge designs and unmatched quality."
        />
      </Head>
      {isLoading && (
        <Box className='loader-container-product'>
          <Box className='loader'></Box>
        </Box>
      )}
      <Box className='product-page'>
        <Suspense
          fallback={
            <div
              className='new-arrival-loader'
              style={{
                height: '80vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            ></div>
          }
        >
          <Box
            className='product-header'
            sx={{
              padding: '1.5rem 3rem',
              [theme.breakpoints.down('sm')]: {
                padding: '1.5rem 1rem',
              },
            }}
          >
            <Typography
              sx={{
                color: customColors.darkBlueEbco,
                fontWeight: 'bold',
                fontSize: '2.5rem !important',
                lineHeight: '1.2',
                fontFamily: 'Uniform Bold !important',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '1.75rem !important', // Smaller font size for small screens
                },
              }}
              className='product-title'
            >
              {title}
            </Typography>
            {sender && (
              <Typography
                sx={{
                  color: customColors.darkBlueEbco,
                  fontWeight: 'bold',
                  fontSize: '1.5rem !important',
                  marginBlock: 1.5,
                  lineHeight: '1',
                  fontFamily: 'Uniform Medium !important',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '1rem !important', // Smaller font size for small screens
                  },
                }}
                className='product-title'
              >
                Created by - {sender}
              </Typography>
            )}
          </Box>
          <Box className='product-filter-section row-center'>
            <Box
              className='product-section'
              sx={{
                width: '100%',
                maxWidth: '1600px',
              }}
            >
              <Box
                className='views-filters row-space-between'
                sx={{
                  margin: '1rem 0',
                }}
              >
                <Box className='views-section'>
                  <CgMenuGridO
                    onClick={() => {
                      setView('grid')
                    }}
                    color={
                      view === 'grid' ? customColors.darkBlueEbco : '#8D8D8D'
                    }
                    className='icon'
                  />
                  <MdTableRows
                    onClick={() => {
                      setView('rows')
                    }}
                    color={
                      view === 'rows' ? customColors.darkBlueEbco : '#8D8D8D'
                    }
                    className='icon'
                  />
                </Box>
              </Box>
              {view === 'grid' ? (
                <Box className='products-container'>
                  {productDataAPi &&
                    productDataAPi.map((data, index) => {
                      return (
                        <ProductCollectionCard
                          key={index}
                          data={data}
                          selectedItem={selectedItem}
                          handleProductClick={handleProductClick}
                          downloadBrochureAndOpen={downloadBrochureAndOpen}
                          isShopNow={isShopNow}
                          handleWishlistIcon={handleWishlistIcon}
                          handleWishlistBorder={handleWishlistBorder}
                          handleBookmarkIcon={handleBookmarkIcon}
                          handleBookmarkBorder={handleBookmarkBorder}
                          handleWishlistToggle={handleWishlistToggle}
                          handleBookmarkToggle={handleBookmarkToggle}
                        />
                      )
                    })}
                  {apiCompleted && productDataAPi.length == 0 && (
                    <Box
                      className='row-center w-100'
                      sx={{
                        margin: '3rem 0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '24px',
                          fontFamily: 'Uniform Bold !important',
                          color: customColors.darkBlueEbco,
                          textAlign: 'center',
                        }}
                      >
                        No Products Found
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box className='products-container-column'>
                  {productDataAPi &&
                    productDataAPi.map((data, index) => {
                      return (
                        <ProductCollectionCardColumn
                          key={index}
                          data={data}
                          selectedItem={selectedItem}
                          handleProductClick={handleProductClick}
                          downloadBrochureAndOpen={downloadBrochureAndOpen}
                          isShopNow={isShopNow}
                          handleWishlistIcon={handleWishlistIcon}
                          handleWishlistBorder={handleWishlistBorder}
                          handleBookmarkIcon={handleBookmarkIcon}
                          handleBookmarkBorder={handleBookmarkBorder}
                          handleWishlistToggle={handleWishlistToggle}
                          handleBookmarkToggle={handleBookmarkToggle}
                        />
                      )
                    })}
                  {apiCompleted && productDataAPi.length == 0 && (
                    <Box
                      className='row-center w-100'
                      sx={{
                        margin: '3rem 0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '24px',
                          fontFamily: 'Uniform Bold !important',
                          color: customColors.darkBlueEbco,
                          textAlign: 'center',
                        }}
                      >
                        No Products Found
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              {/* {productDataAPi && productDataAPi.length > 0 && (
                <Box
                  className='row-center'
                  sx={{
                    margin: '3rem 0',
                  }}
                >
                  <Pagination
                    count={Number(totalPages)}
                    page={page}
                    onChange={handleChange}
                    color='standard'
                    renderItem={item => (
                      <PaginationItem
                        slots={{ previous: WestIcon, next: EastIcon }}
                        {...item}
                      />
                    )}
                  />
                </Box>
              )} */}
            </Box>
          </Box>
          <Box className='product-filter-mobile-section bg-center'>
            <Box
              className='products-container-mobile'
              sx={{ p: '0 1rem !important' }}
            >
              {productDataAPi &&
                productDataAPi.map((data, index) => {
                  return (
                    <ProductCollectionCardMobile
                      key={index}
                      data={data}
                      selectedItem={selectedItem}
                      handleProductClick={handleProductClick}
                      downloadBrochureAndOpen={downloadBrochureAndOpen}
                      isShopNow={isShopNow}
                      handleWishlistIcon={handleWishlistIcon}
                      handleWishlistBorder={handleWishlistBorder}
                      handleBookmarkIcon={handleBookmarkIcon}
                      handleBookmarkBorder={handleBookmarkBorder}
                      handleWishlistToggle={handleWishlistToggle}
                      handleBookmarkToggle={handleBookmarkToggle}
                    />
                  )
                })}
              {apiCompleted && productDataAPi.length == 0 && (
                <Box
                  className='row-center w-100'
                  sx={{
                    margin: '3rem 0',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontFamily: 'Uniform Bold !important',
                      color: customColors.darkBlueEbco,
                      textAlign: 'center',
                    }}
                  >
                    No Products Found
                  </Typography>
                </Box>
              )}
            </Box>
            {/* {productDataAPi && productDataAPi.length > 0 && (
              <Box
                className='row-center'
                sx={{
                  margin: '1rem 0',
                }}
              >
                <Pagination
                  count={Number(totalPages)}
                  page={page}
                  onChange={handleChange}
                  color='standard'
                  renderItem={item => (
                    <PaginationItem
                      slots={{ previous: WestIcon, next: EastIcon }}
                      {...item}
                    />
                  )}
                />
              </Box>
            )} */}
          </Box>
          <Box className='mobile-filter-section row-space-around'>
            {/* <CgMenuGridO color={customColors.darkBlueEbco} className="icon" /> */}
            <Button className='filter-mobile-btn' onClick={toggleDrawer(true)}>
              Filter and Categories
            </Button>

            <Select
              value={selectedOption}
              onChange={handleSortChange}
              displayEmpty
              className='custom-product-select'
              sx={{
                borderRadius: '100px !important',
              }}
            >
              {options.map(option => {
                return (
                  <MenuItem value={option} key={option}>
                    {option}
                  </MenuItem>
                )
              })}
            </Select>
          </Box>
        </Suspense>
      </Box>
    </>
  )
}

export default ProductCollection
