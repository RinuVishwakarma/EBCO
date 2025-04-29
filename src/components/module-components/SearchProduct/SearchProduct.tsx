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
  useTheme,
} from '@mui/material'
import './SearchProduct.css'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import SearchIcon from '@mui/icons-material/Search'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import React, { useEffect, useState, Suspense, useRef } from 'react'
import { CgMenuGridO } from 'react-icons/cg'
import { MdTableRows } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import EastIcon from '@mui/icons-material/East'
import WestIcon from '@mui/icons-material/West'
import { MenuProp } from '@/interface/MenuData'
import Divider from '../../utils-components/Divider'
import { MenuData } from '@/utils/menuData/MainMenuData'
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks'
import { setDrawerOpen } from '@/store/drawerReducer'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useRouter as useNextRouterNav, useSearchParams } from 'next/navigation'
import { apiClient } from '@/apiClient/apiService'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { ebcoApiData } from '@/utils/ebcoApiData'
import useDebounce from '@/hooks/useDebounce'
import { RootState } from '@/store/store'

import { getCategoryByName } from '@/utils/getCategoryByName'
import { setUrl } from '@/store/routeUrl'
import { useAddWishlist } from '@/hooks/useWishListAdd'
import { useRemoveWishlist } from '@/hooks/useWishlistRemove'
import { useAddBookmark } from '@/hooks/useBookmarkAdd'
import { useRemoveBookmark } from '@/hooks/useBookmarkRemove'
import { ShopPage } from '@/interface/ShopnowPage'
import { useQuery } from '@tanstack/react-query'
import ProductCard from '@/utils/ProductCard/ProductCard'
import ProductCardColumn from '@/utils/ProductCard/ProductCardColumn'
import ProductCardMobile from '@/utils/ProductCard/ProductCardMobile'
import { NewProduct, NewProductDetails } from '@/interface/NewProductDetails'

interface ProductProps {
  type?: string
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

const SearchProduct = ({ type = 'shop-now' }: ProductProps) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const searchValueDebounce = useDebounce<string>(searchValue, 100)
  const optionss = ['Newly Added', 'Name : A to Z', 'Name : Z to A']
  const [options, setOptions] = useState<string[]>(optionss)
  const extraOptions = ['Price: Low to High', 'Price: High to Low']
  const [selectedOption, setSelectedOption] = useState<string>('Newly Added')
  const [queryString, setQueryString] = useState<string>(
    '&order=desc&orderby=date',
  )
  const [view, setView] = useState<string>('grid')
  const [productType, setProductType] = useState<string>('ALL PRODUCTS')
  const [productDataAPi, setProductDataAPi] = useState<NewProduct[]>([])
  const [checkedSubCategoryIdsString, setCheckedSubCategoryIdsString] =
    useState<string>('')
  const per_page = 12
  const [categoryData, setCategoryData] = useState<Category[]>([])
  const [subCategoryData, setSubCategoryData] = useState<SubCategory[]>([])
  const router = useNextRouterNav()
  const query = useSearchParams()
  const dispatch = useAppDispatch()
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const RestrictedFilterIds = [755, 756, 743, 723]
  const [filters, setFilters] = useState<filter[] | []>([])
  const [activeFilters, setActiveFilters] = useState<filter[]>([])
  const [mobileActiveFilters, setMobileActiveFilters] = useState<filter[]>([])
  const [shopPageBanner, setShopPageBanner] = useState<string>('')

  const theme = useTheme()
  const menuuuu = useAppSelector(state => state.mainMenu).mainMenu
  const [sort, setSort] = useState('Most Popular')
  const [open, setOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const mainMenuData = useAppSelector(state => state.mainMenu).menu
  const [totalPages, setTotalPages] = useState(0)
  const [apiCompleted, setApiCompleted] = useState(false)
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [searchedProducts, setSearchedProducts] = useState<NewProduct[] | []>(
    [],
  )
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [activeFiltersString, setActiveFiltersString] = useState<string>('')
  const auth = useAppSelector(state => state.auth).isLoggedIn
  const [isInitialApiCalled, setIsInitialApiCalled] = useState(false)
  const useAddWishlistMutation = useAddWishlist()
  const useRemoveWishlistMutation = useRemoveWishlist()
  const useAddBookmarkMutation = useAddBookmark()
  const useRemoveBookmarkMutation = useRemoveBookmark()
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const currentUrl = new URL(window.location.href)
    const searchParams = new URLSearchParams(currentUrl.search)

    searchParams.set('page', value.toString())

    // If selectedItem is null or undefined, remove the selectedItem query parameter
    if (selectedItem) {
      searchParams.set(
        'selectedItem',
        selectedItem.toString().replace(/_/g, ' '),
      )
    } else {
      searchParams.delete('selectedItem')
    }

    currentUrl.search = searchParams.toString()
    window.history.pushState(null, '', currentUrl.toString())

    setPage(value)
  }

  const wishlist = useAppSelector(
    (state: RootState) => state?.wishlist?.products,
  )
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
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
  const fetchShopPageData = async (): Promise<ShopPage | {}> => {
    try {
      const response = await apiClient.get<ShopPage>(
        `${API_ENDPOINT.GET.get_page}/${ebcoApiData.SEARCH_PAGE}?acf_format=standard`,
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
    if (data && data.id !== null) {
      const updatedProducts = productDataAPi.map(product => {
        if (product.id === data.id) {
          const updatedProduct = {
            ...product,
            is_wishlist: !product.is_wishlist,
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
  const fetchProductData = async (
    param: string,
    id: string,
    checkedIds: string,
    filtersString: string = '',
  ): Promise<NewProduct[]> => {
    try {
      //console.log("I AM FETCHING FIRST ======= DATA");
      setIsLoading(true)
      setApiCompleted(false)
      const searchedValue = query.get('search')?.replace(/_/g, ' ')
      let pageQuery = query.get('page')

      const response = await apiClient.get<NewProductDetails>(
        ` ${API_ENDPOINT.GET.get_pinned_products}?${param}=${
          param === 'category' ? checkedIds : id
        }&per_page=${per_page}&page=${
          pageQuery ? pageQuery : 1
        }${queryString}&status=publish&tag=${filtersString}&search=${searchedValue}`,
      )
      // ////console.log(response, "new arrival data");
      setIsLoading(false)
      setApiCompleted(true)
      setIsInitialApiCalled(true)
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
  const fetchProductChangeData = async (
    param: string,
    id: string,
    checkedIds: string,
    filtersString: string = '',
  ): Promise<NewProduct[]> => {
    try {
      setIsLoading(true)
      setApiCompleted(false)
      const searchedValue = query.get('search')
      const response = await apiClient.get<NewProductDetails>(
        ` ${API_ENDPOINT.GET.get_pinned_products}?${param}=${
          param === 'category' ? checkedIds : id
        }&per_page=${per_page}&page=${page}${queryString}&status=publish&tag=${filtersString}&search=${searchValueDebounce}`,
      )
      //console.log(response, "new arrival data");
      setIsLoading(false)
      setApiCompleted(true)
      document.body.classList.remove('loading')
      if (!response) {
        throw new Error('No data found')
      }
      // let totalPages = response.headers['x-wp-totalpages']
      let totalPages = response.data.pagination?.total_pages
      let totalProducts = response.headers['x-wp-total']
      if (totalPages) {
        setTotalPages(totalPages)
        setTotalProducts(response.headers['x-wp-total'])
      }
      // Extract and log each tag's name
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
    return data.tags.some(tag => tag.id === 723)
  }
  const fetchShopNowProductData = async (
    param: string,
    id: string,
    checkedIds: string,
    filtersString: string = '',
  ): Promise<NewProduct[]> => {
    //console.log("I AM FETCHING SHOPNOW DATA");
    try {
      setIsLoading(true)
      setApiCompleted(false)
      const searchedValue = query.get('search')?.replace(/_/g, ' ')
      const response = await apiClient.get<NewProductDetails>(
        ` ${API_ENDPOINT.GET.get_prod_products}?${
          param !== 'tag' ? `${param}=` : ''
        }=${
          param === 'category' ? checkedIds : ''
        }&per_page=${per_page}&page=${page}${queryString}&tag=723${
          filtersString.length > 0 ? `,${activeFilters}` : ''
        }&status=publish&category=${checkedIds}&search=${searchedValue}`,
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
  const fetchShopNowChangeProductData = async (
    param: string,
    id: string,
    checkedIds: string,
    filtersString: string = '',
  ): Promise<NewProduct[]> => {
    //console.log("I AM FETCHING SHOPNOW DATA");
    try {
      setIsLoading(true)
      setApiCompleted(false)
      const response = await apiClient.get<NewProductDetails>(
        ` ${API_ENDPOINT.GET.get_pinned_products}?${
          param !== 'tag' ? `${param}=` : ''
        }=${
          param === 'category' ? checkedIds : ''
        }&per_page=${per_page}&page=${page}${queryString}&tag=723${
          filtersString.length > 0 ? `,${activeFilters}` : ''
        }&status=publish&category=${checkedIds}&search=${searchValueDebounce}`,
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

      let totalProducts = response.headers['x-wp-total']

      if (totalPages) {
        setTotalPages(totalPages)
        setTotalProducts(response.headers['x-wp-total'])
      }
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

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }
  const handleFilterChange = (event: SelectChangeEvent) => {
    setSort(event.target.value)
  }
  const handleFilterClick = (filter: filter) => {
    setActiveFilters(prevActiveFilters =>
      prevActiveFilters.some(f => f.id === filter.id)
        ? prevActiveFilters.filter(f => f.id !== filter.id)
        : [...prevActiveFilters, filter],
    )
  }
  const handleFilterMobileClick = (filter: filter) => {
    setMobileActiveFilters(prevActiveFilters =>
      prevActiveFilters.some(f => f.id === filter.id)
        ? prevActiveFilters.filter(f => f.id !== filter.id)
        : [...prevActiveFilters, filter],
    )
  }

  useEffect(() => {
    ////console.log("Callled useFfect");
    shopPageQuery.refetch()
    const getPage = query.get('page')
    if (getPage) {
      setPage(Number(getPage))
    }
    const item = query.get('selectedItem')
    if (item) {
      setSelectedItem(item)
    }
    const search = query.get('search')
    if (search) {
      let updatedSearch = search.replace(/_/g, ' ')
      setSearchValue(updatedSearch)
    }
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    setSearchValue(value)
  }
  useEffect(() => {
    ////console.log(selectedOption, "option selected");
    if (menuuuu.length > 0) {
      // //console.log("inside menuuuu", menuuuu);
      const search = query.get('search')
      if (search) {
        let updatedSearch = search.replace(/_/g, ' ')
        setSearchValue(updatedSearch)
      }
      if (productType === 'SHOP NOW') {
        fetchInitialShopNowData()
      } else {
        fetchData()
      }
    }
  }, [menuuuu])
  const handleDelete = () => {}
  useEffect(() => {
    //console.log("Callled useFfect", initialRenderPage.current);
    if (isInitialApiCalled) {
      if (productType === 'ALL PRODUCTS') {
        fetchDataChange()
      } else {
        fetchShopNowData()
      }
    }
  }, [type, query, queryString])
  const fetchData = async () => {
    const { categories, subCategories } = transformDataForEbco(mainMenuData)!
    setCategoryData(categories)
    setSubCategoryData(subCategories)
    const item = query.get('selectedItem')
    let id = ''
    let param = ''

    if (type.toLowerCase() === 'shop-now') {
      id = '723'
      param = 'tag'
    }
    if (
      (param === 'category' && checkedSubCategoryIdsString.length !== 0) ||
      (param === 'tag' && id.length !== 0)
    ) {
      const productData = await fetchProductData(
        param,
        id,
        checkedSubCategoryIdsString,
      )

      setProductDataAPi(productData)
    }
  }
  const fetchInitialShopNowData = async () => {
    const { categories, subCategories } = transformDataForEbco(mainMenuData)!
    setCategoryData(categories)
    setSubCategoryData(subCategories)

    let id = ''

    let param = ''

    if (type.toLowerCase() === 'shop-now') {
      id = '723'
      param = 'tag'
    }
    if (
      (param === 'category' && checkedSubCategoryIdsString.length !== 0) ||
      (param === 'tag' && id.length !== 0)
    ) {
      const productData = await fetchShopNowProductData(
        param,
        id,
        checkedSubCategoryIdsString,
      )
      setProductDataAPi(productData)
    }
  }
  const fetchShopNowData = async (activeFiltersString: string = '') => {
    let id = ''

    let param = ''

    if (type.toLowerCase() === 'shop-now') {
      id = '723'
      param = 'tag'
    }

    if (
      (param === 'category' && checkedSubCategoryIdsString.length !== 0) ||
      (param === 'tag' && id.length !== 0)
    ) {
      const productData = await fetchShopNowChangeProductData(
        param,
        id,
        checkedSubCategoryIdsString,
        activeFiltersString,
      )
      setProductDataAPi(productData)
    }
  }
  useEffect(() => {
    if (isInitialApiCalled) {
      // //console.log(getActiveFiltersString(), "active filters");
      setActiveFiltersString(getActiveFiltersString())
      // return;
      if (productType === 'ALL PRODUCTS') {
        //console.log("All products", productType, initialRender.current);
        fetchDataChange(getActiveFiltersString())
      } else {
        fetchShopNowData(getActiveFiltersString())
      }
    }
  }, [page, activeFilters, searchValueDebounce])
  const getActiveFiltersString = () => {
    if (activeFilters.length === 0) {
      return ''
    }
    return activeFilters.map(filter => filter.id).join(', ')
  }
  const fetchDataChange = async (activeFiltersString: string = '') => {
    document.body.classList.add('loading')
    let id = ''
    let param = ''
    if (type.toLowerCase() === 'shop-now') {
      id = '723'
      param = 'tag'
    }
    ////console.log("ID:", id, "param:", param, checkedSubCategoryIdsString);
    if (
      (param === 'category' && checkedSubCategoryIdsString.length !== 0) ||
      (param === 'tag' && id.length !== 0)
    ) {
      const productData = await fetchProductChangeData(
        param,
        id,
        checkedSubCategoryIdsString,
        activeFiltersString,
      )

      setProductDataAPi(productData)
    }
  }
  useEffect(() => {
    if (isInitialApiCalled) {
      if (productType === 'ALL PRODUCTS') {
        fetchDataChange()
      } else {
        fetchShopNowData()
      }
    }
  }, [checkedSubCategoryIdsString])
  useEffect(() => {
    const { categories, subCategories } = transformDataForEbco(mainMenuData)!
    setCategoryData(categories)
    setSubCategoryData(subCategories)
    const item = query.get('selectedItem')

    let decodedItem = ''
    if (item) {
      decodedItem = decodeURIComponent(item)
    } else {
      decodedItem = type
    }

    const breadcrumb = buildBreadcrumbByName(decodedItem)
    setBreadcrumbs(breadcrumb)
  }, [selectedItem, menuuuu, window.location.href])
  // Function to get item by name
  function getItemByName(name: string) {
    return menuuuu.find(item => item.name === name)
  }

  // Function to get item by ID
  function getItemById(id: number) {
    return menuuuu.find(item => item.id === id)
  }

  // Function to build breadcrumb trail by name
  function buildBreadcrumbByName(name: string) {
    const breadcrumb: string[] = []
    let currentItem = getItemByName(name)
    if (!currentItem) {
      return breadcrumb
    }

    while (currentItem && currentItem.parent !== 0) {
      breadcrumb.unshift(currentItem.name)
      currentItem = getItemById(currentItem.parent)
    }

    if (currentItem) {
      breadcrumb.unshift(currentItem.name)
    }
    return breadcrumb
  }
  const getSelectedItemChecked = (
    categories: Category[],
    subCategories: SubCategory[],
  ) => {
    const item = query.get('selectedItem')
    if (item) {
      // Decode the item from URI encoding
      const decodedItem = decodeURIComponent(item)

      // Find the corresponding category based on the decoded item label
      const selectedCategory = categories.find(
        category => category.label === decodedItem,
      )
      // Set the isChecked property of the selected category to true
      if (selectedCategory) {
        // Update the isChecked property of the selected category
        selectedCategory.isChecked = true

        // Find and update isChecked property of all subcategories belonging to the selected category
        const subCategoriesToUpdate = subCategories.filter(
          subCategory => subCategory.parentId === selectedCategory.id,
        )
        subCategoriesToUpdate.forEach(subCategory => {
          subCategory.isChecked = true
        })
      } else {
        // Find the subcategory with the decoded label
        const selectedSubCategory = subCategories.find(subCategory => {
          const splitLabel = subCategory.label.split('→')
          return (
            splitLabel[0]?.trim() === decodedItem.trim() ||
            splitLabel[1]?.trim() === decodedItem.trim()
          )
        })

        if (selectedSubCategory) {
          // Find the parent category of the selected subcategory
          const parentCategory = categories.find(
            category => category.id === selectedSubCategory.parentId,
          )

          if (parentCategory) {
            // Update the isChecked property of the parent category
            parentCategory.isChecked = true

            // Update the isChecked property of the selected subcategory
            selectedSubCategory.isChecked = true
          }
        }
      }
    } else if (item === null) {
      subCategories.forEach(subCategory => {
        subCategory.isChecked = true
      })
    }
    // Construct a comma-separated string of checked subcategory IDs
    let checkedSubCategoryIdsString = subCategories
      .filter(subCategory => subCategory.isChecked)
      .map(subCategory => subCategory.id)
      .join(',')

    let checkedCategoriesIdsString = categories
      .filter(category => category.isChecked)
      .map(category => category.id)
      .join(',')

    // Update the state with the checked subcategory IDs string
    setCheckedSubCategoryIdsString(checkedSubCategoryIdsString)
  }
  interface MenuItem {
    id: number
    label: string
    route: string
    children?: MenuItem[]
  }

  const findItemByLabel = (
    data: MenuItem[],
    label: string,
  ): MenuItem | undefined => {
    for (const item of data) {
      if (item?.label === label) {
        return item
      }
      if (item?.children) {
        const result = findItemByLabel(item?.children, label)
        if (result) {
          return result
        }
      }
    }
    return undefined
  }

  const transformDataForEbco = (data: MenuProp[]) => {
    let updatedData = []
    if (data[0].label === 'CATEGORIES') {
      updatedData = data[0].children!
    } else {
      updatedData = data
    }
    const categories: Category[] = []
    const subCategories: SubCategory[] = []
    if (type === 'shop-now') {
      const ebcoDataFilter = updatedData.filter(item =>
        ['ebco', 'livsmart', 'worksmart'].includes(item.label.toLowerCase()),
      )

      ebcoDataFilter.forEach(ebcoData => {
        if (ebcoData && ebcoData.children) {
          ebcoData.children.forEach(child => {
            const category: Category = {
              id: child.id,
              label: child.label,
              route: `/${ebcoData.route}`,
              children: [],
              isChecked: true,
            }

            if (child.children) {
              child.children.forEach(subChild => {
                if (subChild.children && subChild.children.length > 0) {
                  subChild.children.forEach(subSubChild => {
                    const subCategory: SubCategory = {
                      id: subSubChild.id,
                      parentId: child.id, // Set parentId
                      label: `${subChild.label} → ${subSubChild.label}`,
                      route: `/${subSubChild.route}`,
                      isChecked: true,
                    }
                    // //console.log(subCategory, "subCategory");
                    category.children.push(subCategory)
                    subCategories.push(subCategory)
                  })
                } else {
                  const subCategory: SubCategory = {
                    id: subChild.id,
                    parentId: child.id, // Set parentId
                    label: subChild.label,
                    route: `/${subChild.route}`,
                    isChecked: true,
                  }
                  // //console.log(subCategory, "subCategory");
                  category.children.push(subCategory)
                  subCategories.push(subCategory)
                }
              })
            }

            categories.push(category)
          })
        }
      })
    }
    categories.forEach(category => {
      if (category.children.length === 0) {
        subCategories.push(category)
      }
    })
    getSelectedItemChecked(categories, subCategories)
    const item = query.get('selectedItem')
    // setCategoryByItem(categories, subCategories, item);

    return { categories, subCategories }
  }

  interface pdfUrl {
    pdf_url: string
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

  const updateCheckedSubCategoryIds = (
    updatedSubCategoryData: SubCategory[],
  ) => {
    const updatedCheckedSubCategoryIds = updatedSubCategoryData
      .filter(d => d.isChecked)
      .map(d => d.id)

    // Generate a comma-separated string by joining each ID
    const idsString = updatedCheckedSubCategoryIds.join(',')
    setCheckedSubCategoryIdsString(idsString)
  }

  const handleCategoryChange = (item: Category) => {
    // Count how many categories are currently checked
    const checkedCount = categoryData.filter(d => d.isChecked).length

    // If the clicked category is being deselected and there's only one category checked, return early
    if (item.isChecked && checkedCount === 1) {
      return
    }

    // Toggle the isChecked property of the clicked category
    const updatedCategoryData = categoryData.map(d => {
      if (d.id === item.id) {
        return { ...d, isChecked: !d.isChecked }
      } else {
        return d
      }
    })

    // Find the clicked category in the updated category data
    const clickedCategory = updatedCategoryData.find(d => d.id === item.id)
    // If the clicked category is being deselected, deselect all its subcategories
    if (clickedCategory) {
      // //console.log(subCategoryData, "subCategoryData", item.id, "item.id", item);
      const updatedSubCategoryData = subCategoryData.map(d => {
        if (d.parentId === item.id || d.id === item.id) {
          return { ...d, isChecked: clickedCategory.isChecked }
        } else {
          return d
        }
      })
      updateCheckedSubCategoryIds(updatedSubCategoryData)
      setSubCategoryData(updatedSubCategoryData)
    }

    setCategoryData(updatedCategoryData)
  }

  const handleSubCategoryChange = (item: SubCategory) => {
    // Count how many subcategories are currently checked
    const checkedSubCount = subCategoryData.filter(d => d.isChecked).length

    // If the clicked subcategory is being deselected and there's only one subcategory checked, return early
    if (item.isChecked && checkedSubCount === 1) {
      return
    }

    const updatedSubCategoryData = subCategoryData.map(d => {
      if (d.id === item.id) {
        return { ...d, isChecked: !d.isChecked }
      } else {
        return d
      }
    })

    const parentCategoryId = item.parentId

    // Find all subcategories of the parent category
    const subCategoriesOfParent = updatedSubCategoryData.filter(
      sub => sub.parentId === parentCategoryId,
    )

    // Check if all subcategories of the parent category are unchecked
    const allSubCategoriesUnchecked = subCategoriesOfParent.every(
      sub => !sub.isChecked,
    )

    // Update the parent category's isChecked property based on the subcategory changes
    const updatedCategoryData = categoryData.map(category => {
      if (category.id === parentCategoryId) {
        return { ...category, isChecked: !allSubCategoriesUnchecked }
      } else {
        return category
      }
    })
    updateCheckedSubCategoryIds(updatedSubCategoryData)
    setCategoryData(updatedCategoryData)
    setSubCategoryData(updatedSubCategoryData)
  }

  const handleProductClick = (item: NewProduct) => {
    const category = getCategoryByName(item.categories)
    if (category) {
      let url = `${category.name.toLowerCase()}/${item.slug}`

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
  const DrawerList = (
    <Box sx={{ width: '100%', height: '100%' }} role='presentation'>
      <CloseOutlinedIcon className='close-icon' onClick={toggleDrawer(false)} />
      <Box
        className='filter-section-mobile'
        sx={{
          width: '95%',
          padding: '2rem',
          margin: '1rem',
          marginBottom: '3rem',
        }}
      >
        <Box className='product-types row-center'>
          <Box
            onClick={() => {
              //changeProductData("ALL PRODUCTS");
              setProductType('ALL PRODUCTS')
              setPage(1)
              fetchDataChange()
            }}
            className={`product-type ${
              productType === 'ALL PRODUCTS' ? 'active-product' : ''
            }`}
          >
            <Typography>ALL PRODUCTS</Typography>
          </Box>
          <Box
            onClick={() => {
              //changeProductData("SHOP NOW");
              setProductType('SHOP NOW')
              setPage(1)
              fetchShopNowData()
            }}
            className={`product-type ${
              productType === 'SHOP NOW' ? 'active-product' : ''
            }`}
          >
            <Typography>SHOP PRODUCTS</Typography>
          </Box>
        </Box>
        <Divider width='90%' color='#D9D9D9' />
        <Box>
          <Typography className='filter-title'>Category</Typography>
          {categoryData.map(item => {
            return (
              <Box
                className='row-space-between'
                key={item.label}
                sx={{
                  justifyContent: 'flex-start',
                }}
              >
                <Checkbox
                  checked={item.isChecked}
                  onChange={() => {
                    setPage(1)
                    handleCategoryChange(item)
                  }}
                  sx={{
                    color: customColors.darkBlueEbco,
                    '&.Mui-checked': {
                      color: customColors.darkBlueEbco,
                    },
                  }}
                />
                <Typography className='filter-label'>{item.label}</Typography>
              </Box>
            )
          })}
        </Box>
        {/* <Divider width="90%" color="#D9D9D9" /> */}

        <Box
          sx={{
            display: 'none',
          }}
        >
          <Typography className='filter-title'>Sub Category</Typography>
          {subCategoryData.map(item => {
            return (
              <Box
                className='row-space-between'
                key={item.label}
                sx={{
                  justifyContent: 'flex-start',
                }}
              >
                <Checkbox
                  checked={item.isChecked}
                  onChange={() => handleSubCategoryChange(item)}
                  sx={{
                    color: customColors.darkBlueEbco,
                    '&.Mui-checked': {
                      color: customColors.darkBlueEbco,
                    },
                  }}
                />
                <Typography className='filter-label'>{item.label}</Typography>
              </Box>
            )
          })}
        </Box>
        <Divider width='90%' color='#D9D9D9' />
        <Box className='filters-section-container'>
          <Typography className='filter-title'>Popular filters</Typography>
          <Box className='popular-filters-section'>
            {filters.map((item, index) => (
              <Box
                key={index}
                className={`filter-container ${
                  mobileActiveFilters.some(f => f.id === item.id)
                    ? 'active-filter'
                    : ''
                }`}
                onClick={() => {
                  setPage(1)
                  handleFilterMobileClick(item)
                }}
                style={{
                  cursor: 'pointer', // Make the filter look clickable
                }}
              >
                <Typography
                  className={`filter-label ${
                    activeFilters.some(f => f.id === item.id)
                      ? 'active-filter-text'
                      : ''
                  }`}
                >
                  {item.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        className='filter-mobile-button row-center action-button'
        sx={{
          position: 'fixed',
          bottom: '10px',
          backgroundColor: customColors.orangeEbco,
        }}
        onClick={() => {
          toggleDrawer(false)()
          setActiveFilters(mobileActiveFilters)
        }}
      >
        <Typography>APPLY FILTER</Typography>
      </Box>
    </Box>
  )

  return (
    <>
      {isLoading && (
        <Box className='loader-container'>
          <Box className='loader'></Box>
        </Box>
      )}
      <Box className='product-page'>
        <Box
          className='breadcrumbs-products-container row-space-between'
          sx={{
            backgroundColor: customColors.darkBlueEbco,
            padding: '0.5rem 0 0.5rem 3rem',
          }}
        >
          <Box className='breadcrumbs-container row-space-between'>
            <HomeOutlinedIcon
              width={20}
              height={20}
              className='home-icon'
              onClick={() => router.push('/')}
              sx={{
                cursor: 'pointer',
                opacity: 0.8,
                color: '#8d8d8d',
              }}
            />
            <Box className='row-space-between'>
              <ChevronRightIcon
                className='chevron-right'
                sx={{
                  color: customColors.lightGreyEbco,
                }}
              />
              <Typography
                className='breadcrumb'
                sx={{
                  color: 'white',
                  pointerEvents: 'none',

                  '&:hover': {
                    textDecoration: 'none',
                    cursor: 'default',
                  },
                }}
              >
                Search
              </Typography>
            </Box>
          </Box>
          <Box className='prodcutsCount'>
            <Typography sx={{ color: 'white', padding: '0rem 2rem' }}>
              {totalProducts} Products
            </Typography>
          </Box>
        </Box>
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
            className='hero-image-container'
            sx={{
              backgroundImage: `url(${shopPageBanner})`,
            }}
          ></Box>
          <iframe
            id='content-to-print'
            className='w-100'
            style={{ display: 'none', height: '1px' }}
          ></iframe>
          <Box className='product-filter-section row-space-between'>
            <Box className='filter-section'>
              <Box className='product-types row-center'>
                <Box
                  onClick={() => {
                    //changeProductData("ALL PRODUCTS");
                    setProductType('ALL PRODUCTS')
                    setPage(1)
                    fetchDataChange()
                    setOptions(optionss)
                    setSelectedOption('Newly Added')
                  }}
                  className={`product-type ${
                    productType === 'ALL PRODUCTS' ? 'active-product' : ''
                  }`}
                >
                  <Typography>ALL PRODUCTS</Typography>
                </Box>
                <Box
                  onClick={() => {
                    //changeProductData("SHOP NOW");
                    setPage(1)
                    setProductType('SHOP NOW')
                    fetchShopNowData()
                    setSelectedOption('Newly Added')
                    setOptions([...optionss, ...extraOptions])
                  }}
                  className={`product-type ${
                    productType === 'SHOP NOW' ? 'active-product' : ''
                  }`}
                >
                  <Typography>SHOP PRODUCTS</Typography>
                </Box>
              </Box>
              <Divider width='90%' color='#D9D9D9' />
              <Box>
                <Typography className='filter-title'>Category</Typography>
                <Box className='category-container '>
                  {categoryData.map(item => {
                    return (
                      <Box
                        className='row-space-between'
                        key={item.label}
                        sx={{
                          justifyContent: 'flex-start',
                        }}
                      >
                        <Checkbox
                          checked={item.isChecked}
                          onChange={() => {
                            setPage(1)
                            handleCategoryChange(item)
                          }}
                          sx={{
                            color: customColors.darkBlueEbco,
                            '&.Mui-checked': {
                              color: customColors.darkBlueEbco,
                            },
                          }}
                        />
                        <Typography
                          data-tooltip-id={item.label}
                          data-tooltip-content={item.label}
                          className='filter-label single-line'
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              {/* <Divider width="90%" color="#D9D9D9" /> */}
              <Box
                sx={{
                  display: 'none',
                }}
              >
                <Typography className='filter-title'>Sub Category</Typography>
                <Box className='sub-category-container '>
                  {subCategoryData.map(item => {
                    return (
                      <Box
                        className='row-space-between'
                        key={item.label}
                        sx={{
                          justifyContent: 'flex-start',
                        }}
                      >
                        <Checkbox
                          checked={item.isChecked}
                          onChange={() => handleSubCategoryChange(item)}
                          sx={{
                            color: customColors.darkBlueEbco,
                            '&.Mui-checked': {
                              color: customColors.darkBlueEbco,
                            },
                          }}
                        />
                        <Typography
                          data-tooltip-id={item.label}
                          data-tooltip-content={item.label}
                          className='filter-label single-line'
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <Divider width='100%' color='#D9D9D9' />
              <Box className='filters-section-container'>
                <Typography className='filter-title'>
                  Popular filters
                </Typography>
                <Box className='popular-filters-section'>
                  {filters.map((item, index) => (
                    <Box
                      key={index}
                      className={`filter-container ${
                        activeFilters.some(f => f.id === item.id)
                          ? 'active-filter'
                          : ''
                      }`}
                      onClick={() => {
                        setPage(1)
                        handleFilterClick(item)
                      }}
                      style={{
                        cursor: 'pointer', // Make the filter look clickable
                      }}
                    >
                      <Typography
                        className={`filter-label ${
                          activeFilters.some(f => f.id === item.id)
                            ? 'active-filter-text'
                            : ''
                        }`}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box className='product-section'>
              <Box className='search-filter-section row-space-between'>
                <Box
                  className='header-search-section row-center'
                  sx={{
                    margin: '0',
                    border: `1px solid ${customColors.lightGreyEbco}`,
                    borderRadius: '50px',
                    position: 'relative',
                    justifyContent: 'flex-start',
                  }}
                >
                  <SearchIcon
                    sx={{
                      color: customColors.darkBlueEbco,
                    }}
                  />

                  <input
                    type='text'
                    name='search'
                    value={searchValue}
                    placeholder='Search'
                    id='search'
                    className='w-100 custom-search-header-input'
                    autoComplete='off'
                    onChange={e => {
                      handleInputChange(e)
                    }}
                  />
                  {searchValue && (
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
                        setSearchedProducts([])
                      }}
                    />
                  )}
                  {searchedProducts && searchedProducts.length > 0 && (
                    <Box
                      className='searched-products-section'
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        marginTop: '0.5rem',
                        left: 0,
                        width: '100%',
                        maxHeight: '50vh',
                        height: 'max-content',
                        backgroundColor: customColors.whiteEbco,
                        borderRadius: '16px',
                        boxShadow: '1px 1px 10px 1px #00000010',
                        padding: '1rem 0rem',
                        zIndex: '3',
                        overflow: 'auto',
                      }}
                    >
                      <Box
                        className='searched-products-container'
                        sx={{
                          padding: '0rem',
                          overflow: 'auto',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <Box>
                          {searchedProducts.length > 0 &&
                            searchedProducts?.map((item, index) => {
                              return (
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
                                  <Typography
                                    className='search-product-title'
                                    sx={{
                                      color: customColors.darkBlueEbco,
                                      fontSize: '14px !important',
                                    }}
                                  >
                                    {item.name}
                                  </Typography>
                                </Box>
                              )
                            })}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
                <Box className='row-space-between sort-filter-section'>
                  <Typography
                    sx={{
                      width: '30%',
                      color: '#8D8D8D',
                    }}
                  >
                    Sort by:
                  </Typography>
                  <select
                    id='sort-by-select'
                    style={{
                      padding: '0.5rem 1rem',
                      borderColor: customColors.selectBox,
                      fontSize: '16px !important',
                      fontFamily: 'Uniform Medium',
                      color: customColors.darkBlueEbco,
                      borderRadius: '100px',
                    }}
                    value={selectedOption}
                    onChange={handleSortChange}
                  >
                    {options.map(option => (
                      <option
                        className='option-product'
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </Box>
              </Box>
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
                      setProductDataAPi([])

                      fetchDataChange()
                    }}
                    color={
                      view === 'grid' ? customColors.darkBlueEbco : '#8D8D8D'
                    }
                    className='icon'
                  />
                  <MdTableRows
                    onClick={() => {
                      setView('rows')
                      setProductDataAPi([])

                      fetchDataChange()
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
                  {productDataAPi.map((data, index) => {
                    return (
                      <ProductCard
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
                  {productDataAPi.map((data, index) => {
                    return (
                      <ProductCardColumn
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
              {productDataAPi.length > 0 && (
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
              )}
            </Box>
          </Box>
          <Box className='product-filter-mobile-section bg-center'>
            <Box
              className='mobile mobile-search-results row-space-between'
              sx={{
                margin: '1rem',
              }}
            >
              <Box
                className='header-search-section row-center'
                sx={{
                  margin: '0',
                  border: `1px solid ${customColors.lightGreyEbco}`,
                  borderRadius: '50px',
                  position: 'relative',
                  justifyContent: 'flex-start',
                }}
              >
                <SearchIcon
                  sx={{
                    color: customColors.darkBlueEbco,
                  }}
                />

                <input
                  type='text'
                  name='search'
                  value={searchValue}
                  placeholder='Search'
                  id='search'
                  className='w-100 custom-search-header-input'
                  onChange={e => {
                    handleInputChange(e)
                  }}
                />
                {searchValue && (
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
                )}
                {isSearchOpen && (
                  <Box
                    className='searched-products-section'
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      marginTop: '0.5rem',
                      left: 0,
                      width: '100%',
                      maxHeight: '50vh',
                      height: 'max-content',
                      backgroundColor: customColors.whiteEbco,
                      borderRadius: '16px',
                      boxShadow: '1px 1px 10px 1px #00000010',
                      padding: '1rem 0rem',
                      zIndex: 2,
                      overflowY: 'auto',
                    }}
                  >
                    <Box
                      className='searched-products-container'
                      sx={{
                        padding: '0rem',
                        overflow: 'auto',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Box>
                        {searchedProducts.length > 0 &&
                          searchedProducts?.map((item, index) => {
                            return (
                              <Box
                                className='row-space-between searched-product'
                                sx={{
                                  padding: '0.5rem 1rem',
                                  borderBottom: '1px solid #00000010',
                                  alignItems: 'flex-start',
                                  cursor: 'pointer',
                                }}
                                key={index}
                              >
                                <Typography
                                  className='search-product-title'
                                  sx={{
                                    color: customColors.darkBlueEbco,
                                    fontSize: '14px !important',
                                  }}
                                >
                                  {item.name}
                                </Typography>
                              </Box>
                            )
                          })}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
              <Typography
                sx={{
                  color: customColors.greyEbco,
                  fontFamily: 'Uniform Bold !important',
                  fontSize: '16px',
                }}
              >
                {totalProducts} Products
              </Typography>
            </Box>
            <Box
              className='filters-section-mobile'
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '1rem',
              }}
            >
              <Typography
                sx={{
                  color: '#8D8D8D',
                  marginRight: '1rem',
                }}
              >
                Active filters :
              </Typography>
              <Box className='filters'>
                {activeFilters.map((item, index) => {
                  return (
                    <Chip
                      key={index}
                      label={item.name}
                      variant='outlined'
                      color='warning'
                      className='chip-button'
                      deleteIcon={
                        <RxCross2
                          className='chip-icon'
                          width={16}
                          height={16}
                        />
                      }
                      onDelete={() => handleDelete()}
                      style={{
                        backgroundColor: '#e87b1e1f',
                      }}
                    />
                  )
                })}
              </Box>
            </Box>
            <Box className='products-container-mobile'>
              {productDataAPi.map((data, index) => {
                return (
                  <ProductCardMobile
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
            {productDataAPi.length > 0 && (
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
            )}
          </Box>
          <Box className='mobile-filter-section row-space-around'>
            <Button className='filter-mobile-btn' onClick={toggleDrawer(true)}>
              Filter and Categories
            </Button>
            <Drawer open={open} anchor='bottom' onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
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
export default SearchProduct
