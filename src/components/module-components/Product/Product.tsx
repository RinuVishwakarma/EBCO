'use client'
import dynamic from 'next/dynamic'
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
import './Product.css'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import SearchIcon from '@mui/icons-material/Search'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
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

const Product = ({ type }: ProductProps) => {
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
  const useAddWishlistMutation = useAddWishlist()
  const useRemoveWishlistMutation = useRemoveWishlist()
  const useAddBookmarkMutation = useAddBookmark()
  const useRemoveBookmarkMutation = useRemoveBookmark()
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [activeFiltersString, setActiveFiltersString] = useState<string>('')
  const initialRender = useRef(true)
  const auth = useAppSelector(state => state.auth).isLoggedIn
  const [shopPageBanner, setShopPageBanner] = useState<string>('')
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
    if (data.is_bookmark) {
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
    console.log(
      '🚀 ~ handleBookmarkBorder ~ data:',
      data,
      !isShopNow(data),
      !data.is_bookmark,
    )

    if (!data.is_bookmark) {
      return customColors.orangeEbco
    } else if (data.is_bookmark) {
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
      const response = await apiClient.get<NewProductDetails>(
        ` ${API_ENDPOINT.GET.get_pinned_products}?${param}=${
          param === 'category' ? checkedIds : id
        }&per_page=${per_page}&page=${page}${queryString}&status=publish&tag=${filtersString}&search=${searchValueDebounce}`,
      )
      setIsLoading(false)
      setApiCompleted(true)
      document.body.classList.remove('loading')
      if (!response) {
        throw new Error('No data found')
      }
      let totalPages = response.data.pagination?.total_pages
      let totalProducts = response.headers['x-wp-total'] || response.data.pagination?.total_products || 0
      if (totalPages) {
        setTotalPages(totalPages)
        setTotalProducts(totalProducts)
      }
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
    setProductDataAPi([])
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
        }&status=publish&category=${checkedIds}&search=${searchValue}`,
      )
      setIsLoading(false)
      setApiCompleted(true)
      document.body.classList.remove('loading')
      if (!response) {
        throw new Error('No data found')
      }
      let totalPages = response.data.pagination?.total_pages
      let totalProducts = response.headers['x-wp-total'] || response.data.pagination?.total_products || 0
      if (totalPages) {
        setTotalPages(totalPages)
        setTotalProducts(totalProducts)
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
    if (type === 'shop-now') {
      setOptions([...optionss, ...extraOptions])
    } else {
      setOptions([...optionss])
    }
  }, [])
  useEffect(() => {
    ////console.log("Callled useFfect");
    const getPage = query.get('page')
    if (getPage) {
      setPage(Number(getPage))
    }
    const item = query.get('selectedItem')?.replace(/_/g, ' ')
    if (item) {
      setSelectedItem(item.replace(/-/g, ''))
    }
    console.log(type, 'TYPE')
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    setSearchValue(value)
  }
  useEffect(() => {
    if (type !== 'shop-now') {
      let selectedType = menuuuu.find(
        item => item.name.toLowerCase() === type.toLowerCase(),
      )
      //console.log("selected type", selectedType);
      setBannerImage(selectedType?.image?.src! || '')
    } else {
      shopPageQuery.refetch()
    }
    // if (initialMenu.current) {
    //   initialMenu.current = false;
    //   return;
    // }
    if (menuuuu.length > 0) {
      setMainMenuProdData(menuuuu)
      if (type === 'shop-now') {
        fetchInitialShopNowData()
      } else {
        fetchData()
      }
    }
  }, [menuuuu])
  const handleDelete = (index: number) => {
    setActiveFilters(activeFilters.splice(index))
  }

  const fetchData = async () => {
    // setIsLoading(true);
    // document.body.classList.add("loading");

    // console.log("I AM CALLED");
    const { categories, subCategories } = transformDataForEbco(mainMenuData)!
    setCategoryData(categories)
    setSubCategoryData(subCategories)
    const item = query.get('selectedItem')?.replace(/_/g, ' ')
    let id = ''
    let decodedItem = ''
    let param = ''
    let menuData = mainMenuProdData

    if (item) {
      decodedItem = decodeURIComponent(item)
      id = menuData
        .filter(
          (menu: MenuData) =>
            menu.name?.toLowerCase() === decodedItem.toLowerCase(),
        )[0]
        ?.id.toString()
      param = 'category'
    } else if (!item && type.toLowerCase() !== 'shop-now') {
      id = menuData
        .filter(
          (menu: MenuData) => menu.name?.toLowerCase() === type.toLowerCase(),
        )[0]
        ?.id.toString()
      param = 'category'
    } else if (
      (!item && type.toLowerCase() === 'shop-now') ||
      productType === 'SHOP NOW'
    ) {
      id = '723'
      param = 'tag'
    }
    // console.log("id:", id, "param:", param, "CheckedsubCategory", checkedSubCategoryIdsString, categories, subCategories);
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
    // setIsLoading(true);
    // document.body.classList.add("loading");

    //console.log("I AM CALLED");
    const { categories, subCategories } = transformDataForEbco(mainMenuData)!
    setCategoryData(categories)
    setSubCategoryData(subCategories)
    ////console.log("Categories:", categories, "subCategories:", subCategories);
    const item = query.get('selectedItem')?.replace(/_/g, ' ')
    let id = ''
    let decodedItem = ''
    let param = ''
    let menuData = mainMenuProdData
    if (item) {
      decodedItem = decodeURIComponent(item)
      id = menuData
        .filter(
          (menu: MenuData) =>
            menu.name?.toLowerCase() === decodedItem.toLowerCase(),
        )[0]
        ?.id.toString()
      param = 'category'
    } else if (!item && type.toLowerCase() !== 'shop-now') {
      id = menuData
        .filter(
          (menu: MenuData) => menu.name?.toLowerCase() === type.toLowerCase(),
        )[0]
        ?.id.toString()
      param = 'category'
    } else if (
      (!item && type.toLowerCase() === 'shop-now') ||
      productType === 'SHOP NOW'
    ) {
      id = '723'
      param = 'tag'
    }
    //console.log("id:", id, "param:", param, checkedSubCategoryIdsString);
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
  const fetchShopNowData = async (
    checkedStrings: string = checkedSubCategoryIdsStringApi ||
      checkedSubCategoryIdsString,
    activeFiltersString: string = '',
  ) => {
    const item = query.get('selectedItem')?.replace(/_/g, ' ')
    let id = ''
    let decodedItem = ''
    let param = ''
    let menuData = mainMenuProdData
    if (item) {
      decodedItem = decodeURIComponent(item)
      id = menuData
        .filter(
          (menu: MenuData) =>
            menu.name?.toLowerCase() === decodedItem.toLowerCase(),
        )[0]
        ?.id.toString()
      param = 'category'
    } else if (!item && type.toLowerCase() !== 'shop-now') {
      id = menuData
        .filter(
          (menu: MenuData) => menu.name?.toLowerCase() === type.toLowerCase(),
        )[0]
        ?.id.toString()
      param = 'category'
    } else if (
      (!item && type.toLowerCase() === 'shop-now') ||
      productType === 'SHOP NOW'
    ) {
      id = '723'
      param = 'tag'
    }
    console.log('id:', id, 'param:', param, checkedSubCategoryIdsString)

    if (
      (param === 'category' && checkedStrings.length !== 0) ||
      (param === 'tag' && id.length !== 0)
    ) {
      const productData = await fetchShopNowProductData(
        param,
        id,
        checkedStrings,
        activeFiltersString,
      )
      setProductDataAPi(productData)
    }
  }
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    } else {
      // console.log(getActiveFiltersString(), "active filters", checkedSubCategoryIdsStringApi);
      setActiveFiltersString(getActiveFiltersString())
      // return;
      let ids = checkedSubCategoryIdsStringApi || checkedSubCategoryIdsString

      if (productType === 'ALL PRODUCTS' && type !== 'shop-now') {
        // console.log("Product type")
        fetchDataChange(ids, getActiveFiltersString())
      } else {
        fetchShopNowData(ids, getActiveFiltersString())
      }
    }
  }, [
    page,
    activeFilters,
    searchValueDebounce,
    type,
    query,
    queryString,
    checkedSubCategoryIdsString,
  ])
  const getActiveFiltersString = () => {
    if (activeFilters.length === 0) {
      return ''
    }
    return activeFilters.map(filter => filter.id).join(', ')
  }
  const handleBreadcrumbClick = (category: string, index: number) => {
    if (index === 0) {
      window.location.href = `/${type.toLocaleLowerCase()}`
    } else {
      let encodedCategory = encodeURIComponent(category)
      window.location.href = `/${type.toLocaleLowerCase()}?selectedItem=${encodedCategory}`
    }
  }
  const fetchDataChange = async (
    checkedStrings: string = checkedSubCategoryIdsStringApi ||
      checkedSubCategoryIdsString,
    activeFiltersString: string = '',
  ) => {
    ////console.log("I AM CALLED inside fetch Data change function");
    // setIsLoading(true);
    document.body.classList.add('loading')

    const { categories, subCategories } = transformDataForEbco(mainMenuData)!
    // setCategoryData(categories);
    // // setSubCategoryData(subCategories);
    // ////console.log("Categories:", categories, "subCategories:", subCategories);
    ////console.log(type, "checking type");
    const item = query.get('selectedItem')?.replace(/_/g, ' ')
    let id = ''
    let decodedItem = ''
    let param = ''
    let menuData = mainMenuProdData
    if (item) {
      decodedItem = decodeURIComponent(item)
      id = menuData
        .filter(
          (menu: MenuData) =>
            menu.name?.toLowerCase() === decodedItem.toLowerCase(),
        )[0]
        ?.id.toString()
      param = 'category'
    } else if (!item && type.toLowerCase() !== 'shop-now') {
      id = menuData
        .filter(
          (menu: MenuData) => menu.name?.toLowerCase() === type.toLowerCase(),
        )[0]
        ?.id.toString()
      param = 'category'
    } else if (
      (!item && type.toLowerCase() === 'shop-now') ||
      productType === 'SHOP NOW'
    ) {
      id = '723'
      param = 'tag'
    }
    console.log(
      checkedStrings,
      '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-',
      id,
      param,
    )
    if (
      (param === 'category' && checkedStrings.length !== 0) ||
      (param === 'tag' && id.length !== 0)
    ) {
      const productData = await fetchProductData(
        param,
        id,
        checkedStrings,
        activeFiltersString,
      )

      setProductDataAPi(productData)
    }
  }

  useEffect(() => {
    const { categories, subCategories } = transformDataForEbco(mainMenuData)!
    setCategoryData(categories)
    setSubCategoryData(subCategories)
    const item = query.get('selectedItem')?.replace(/_/g, ' ')

    let decodedItem = ''
    if (item) {
      decodedItem = decodeURIComponent(item)
    } else {
      decodedItem = type
    }

    const breadcrumb = buildBreadcrumbByName(decodedItem)
    setBreadcrumbs(breadcrumb)
  }, [selectedItem, menuuuu, window.location.pathname])

  // Function to get item by name
  function getItemByName(name: string) {
    //console.log(menuuuu, "menuuuu");
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
    //console.log(currentItem, "currentItem in making", name);
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
    //console.log(breadcrumb, "breadcrumb in making");
    return breadcrumb
  }
  const getSelectedItemChecked = (
    categories: Category[],
    subCategories: SubCategory[],
  ) => {
    const item = query.get('selectedItem')?.replace(/_/g, ' ')
    // console.log(item, "ITTTtttttteeeemmmmmm")
    if (item) {
      // Decode the item from URI encoding
      const decodedItem = decodeURIComponent(item)

      // Find the corresponding category based on the decoded item label
      const selectedCategory = categories.find(
        category => category.label === decodedItem,
      )
      //console.log(selectedCategory);
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
    //console.log(categories, subCategories);
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
    // setCheckedSubCategoryIdsStringApi(checkedSubCategoryIdsString)
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
    //////console.log(type, "type", data);
    if (type === 'shop-now') {
      const ebcoDataFilter = updatedData.filter(item =>
        ['ebco', 'livsmart', 'worksmart'].includes(item.label.toLowerCase()),
      )

      //console.log(ebcoDataFilter, "ebcoDataFilter");

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
    } else {
      const ebcoData = updatedData.find(
        item => item.label.toLowerCase() === type.toLowerCase(),
      )
      const item = query.get('selectedItem')?.replace(/_/g, ' ')

      const foundItem = findItemByLabel([ebcoData!], decodeURIComponent(item!))
      const parentId = foundItem?.id
      // //console.log(item, "-=-=-==-===-");
      if (ebcoData && ebcoData.children) {
        ebcoData.children.forEach(child => {
          const category: Category = {
            id: child.id,
            label: child.label,
            route: `/${ebcoData.route}`,
            children: [],
            isChecked: item ? false : true,
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
                    isChecked:
                      subChild.label === item || subSubChild.label === item
                        ? true
                        : false,
                  }

                  category.children.push(subCategory)
                  subCategories.push(subCategory)
                })
              } else {
                const subCategory: SubCategory = {
                  id: subChild.id,
                  parentId: child.id, // Set parentId
                  label: subChild.label,
                  route: `/${subChild.route}`,
                  isChecked: subChild.label === item ? true : false,
                }
                // //console.log(subChild.label, item, subCategory, "subCategory");
                category.children.push(subCategory)
                subCategories.push(subCategory)
              }
            })
          }
          categories.push(category)
        })
      }
    }
    categories.forEach(category => {
      if (category.children.length === 0) {
        subCategories.push(category)
      }
    })
    categories.forEach(category => {
      if (category.isChecked) {
        subCategories.forEach(subCategory => {
          if (subCategory.parentId === category.id) {
            subCategory.isChecked = true
          }
        })
      }
    })
    // console.log(categories, subCategories, "categories, subCategories");
    getSelectedItemChecked(categories, subCategories)
    return { categories, subCategories }
  }
  const updateCheckedSubCategoryIds = (
    updatedSubCategoryData: SubCategory[],
  ) => {
    const updatedCheckedSubCategoryIds = updatedSubCategoryData
      .filter(d => d.isChecked)
      .map(d => d.id)

    // Generate a comma-separated string by joining each ID
    const idsString = updatedCheckedSubCategoryIds.join(',')
    // console.log(idsString, "idsString");
    setCheckedSubCategoryIdsString(idsString)
    setCheckedSubCategoryIdsStringApi(idsString)
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
      //console.log(updatedSubCategoryData, "updatedSubCategoryData");
      updateCheckedSubCategoryIds(updatedSubCategoryData)
      setSubCategoryData(updatedSubCategoryData)
    }
    //console.log("updatedCategoryData:", updatedCategoryData);

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
    console.log('🚀 ~ handleProductClick ~ item:', item)
    const category = getCategoryByName(item.categories)
    ////console.log(category, "category");
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
        {type !== 'shop-now' && (
          <Box className='product-types row-center'>
            <Box
              onClick={() => {
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
        )}
        {type !== 'shop-now' && <Divider width='90%' color='#D9D9D9' />}
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
                onClick={() => {
                  setPage(1)
                  handleCategoryChange(item)
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
                  className='filter-label'
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </Typography>
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
        {!isLoading && (
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
              {type !== 'shop-now' ? (
                breadcrumbs.map((item, index) => (
                  <Box className='row-space-between' key={index}>
                    <ChevronRightIcon
                      className='chevron-right'
                      sx={{
                        color: customColors.lightGreyEbco,
                      }}
                    />
                    <Typography
                      className='breadcrumb'
                      onClick={() => handleBreadcrumbClick(item, index)}
                      sx={{
                        color:
                          index !== breadcrumbs.length - 1
                            ? customColors.lightGreyEbco
                            : 'white',

                        pointerEvents:
                          index !== breadcrumbs.length - 1 ? 'auto' : 'none',

                        '&:hover': {
                          textDecoration:
                            index !== breadcrumbs.length - 1
                              ? 'underline'
                              : 'none',
                          cursor:
                            index !== breadcrumbs.length - 1
                              ? 'pointer'
                              : 'default',
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))
              ) : (
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
                    Shop Now
                  </Typography>
                </Box>
              )}
            </Box>
            <Box className='prodcutsCount'>
              <Typography sx={{ color: 'white', padding: '0rem 2rem' }}>
                {totalProducts} Products
              </Typography>
            </Box>
          </Box>
        )}
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
              backgroundImage: `url(${
                type === 'shop-now' ? shopPageBanner : bannerImage
              })`,
            }}
          ></Box>
          <iframe
            id='content-to-print'
            className='w-100'
            style={{ display: 'none', height: '1px' }}
          ></iframe>

          <Box className='product-filter-section row-space-between'>
            <Box className='filter-section'>
              {type !== 'shop-now' && (
                <Box className='product-types row-center'>
                  <Box
                    onClick={() => {
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
                      setPage(1)
                      setProductType('SHOP NOW')
                      fetchShopNowData()
                    }}
                    className={`product-type ${
                      productType === 'SHOP NOW' ? 'active-product' : ''
                    }`}
                  >
                    <Typography>SHOP PRODUCTS</Typography>
                  </Box>
                </Box>
              )}
              {type !== 'shop-now' && <Divider width='90%' color='#D9D9D9' />}
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
                        onClick={() => {
                          setPage(1)
                          handleCategoryChange(item)
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
                          sx={{
                            cursor: 'pointer',
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
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
                        {/* <Tooltip
                          id={item.label}
                          place="bottom"
                          variant="dark"
                        /> */}
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
                      console.log('Type', productType, type)
                      setView('grid')
                      setProductDataAPi([])
                      if (productType === 'SHOP NOW') {
                        fetchShopNowData()
                      } else {
                        fetchDataChange()
                      }
                    }}
                    color={
                      view === 'grid' ? customColors.darkBlueEbco : '#8D8D8D'
                    }
                    className='icon'
                  />
                  <MdTableRows
                    onClick={() => {
                      console.log('View clicked', type, productType)
                      setView('rows')
                      setProductDataAPi([])

                      if (productType === 'SHOP NOW') {
                        fetchShopNowData()
                      } else {
                        fetchDataChange()
                      }
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
                      onDelete={() => handleDelete(index)}
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
            {/* <CgMenuGridO color={customColors.darkBlueEbco} className="icon" /> */}
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

// Export the component with dynamic import and ssr disabled
export default dynamic(() => Promise.resolve(Product), {
  ssr: false
})
