'use client'
import {
  ImageProp,
  MetaDataProp,
  ProductDetails,
} from '@/interface/productDetails'
import {useEffect,useRef,useState} from 'react'
// import { useRouter } from "next/router"
import Divider from '@/components/utils-components/Divider'
import MyBuyersAlsoViewed from '@/components/utils-components/MybuyersAlsoViewed'
import {customColors} from '@/styles/MuiThemeRegistry/theme'
import '@/styles/productDetails.css'
import AddIcon from '@mui/icons-material/Add'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EastIcon from '@mui/icons-material/East'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FmdGoodIcon from '@mui/icons-material/FmdGood'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import RemoveIcon from '@mui/icons-material/Remove'
import ShareIcon from '@mui/icons-material/Share'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Modal,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import Image from 'next/image'
import {
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation'
import {Swiper,SwiperSlide} from 'swiper/react'
// Import Swiper styles
import {API_ENDPOINT} from '@/apiClient/apiEndpoint'
import {apiClient} from '@/apiClient/apiService'
import {CartItemApi,Cart as CartProduct} from '@/interface/Cart'
import {Enquiry} from '@/interface/Enquiry'
import {
  addProduct,
  addProductToCheckout,
  clearCheckout,
  setCheckoutSource,
} from '@/store/cart'
import {useAppSelector} from '@/store/reduxHooks'
import {
  inputError,
  useEbcoBorderBlueButtonStyle,
  useEbcoOrangeButtonStyle,
} from '@/utils/CommonStyling'
import {convertHtmltoArray,decodeHtml} from '@/utils/convertHtmltoArray'
import {extractPath} from '@/utils/ExtractURL'
import formatPrice from '@/utils/formatPrice'
import {getLocalCart} from '@/utils/localStorageCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import {useMutation,useQuery} from '@tanstack/react-query'
import {SubmitHandler,useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import {RWebShare} from 'react-web-share'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {Navigation} from 'swiper/modules'

import {getCategoryByName} from '@/utils/getCategoryByName'
// import { setUrl } from "@/store/routeUrl";
import {PostalCodeResponse} from '@/interface/PostalCode'
import {ProductVideo} from '@/interface/ProductVideo'
import {setUrl} from '@/store/routeUrl'
import {
  containsScreenReaderText,
  extractRegularPrice,
  extractSalePrice,
} from '@/utils/extractPrice'

import {useAddBookmark} from '@/hooks/useBookmarkAdd'
import {useRemoveBookmark} from '@/hooks/useBookmarkRemove'
import {useAddWishlist} from '@/hooks/useWishListAdd'
import {useRemoveWishlist} from '@/hooks/useWishlistRemove'
import {CartResponse} from '@/interface/Cart'
import {setCartProductsCount} from '@/store/cartCount'
import {setPincode} from '@/store/pincodeSlice'
import {trackAddToCart,trackProductView} from '@/utils/analyticsTracking'
import Head from 'next/head'
import {toast,ToastContainer} from 'react-toastify'
import ImageGallery from './ProductDetailsImageGallery'
import SpecificationsTabs from './SpecificationTabs'
import VideoGallery from './VideoGallery'
// import '@google/model-viewer'
import {DownloadCAD} from '@/interface/DownloadCAD'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {E164Number} from 'libphonenumber-js'
import PhoneInputWithCountrySelect from 'react-phone-number-input'
import Loader from './Loader'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
interface SpecificationValue {
  valueText: string | string[]
  valueImage?: string
}

interface Specification {
  header: string
  value: SpecificationValue[]
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
interface Cad {
  cad_files: string[]
  file: string
  title: string
  show_3d: boolean
  show_ar: boolean
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  p: 4,
}
const style2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
}

const downloadCadFile = async (fileUrl: any, fileName: any) => {
  try {
    const response = await fetch(fileUrl)
    if (!response.ok) throw new Error('File download failed')

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)

    a.click()
    document.body.removeChild(a)

    // Clean up the URL object
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

const ProductDetailsPage = ({ slug }: { slug: string }) => {
  const ebcoBorderBlueButtonStyle = useEbcoBorderBlueButtonStyle()
  const [open, setOpen] = useState<boolean>(false)
  const [remainingImages, setRemainingImages] = useState<number>(0)
  const [openModal, setOpenModal] = useState(false)
  const [quantity, setQuantity] = useState<number>(1)
  const [isSpecificationOpen, setIsSpecificationOpen] = useState<boolean>(false)
  const [isFittingInstructionsOpen, setIsFittingInstructionsOpen] =
    useState<boolean>(false)
  const [isWarrantyOpen, setIsWarrantyOpen] = useState<boolean>(false)
  const [postalCodeInput, setPostalCodeInput] = useState<number | null>(null)
  const router = useRouter()
  const [itemId, setItemId] = useState<number>()
  const [variations, setVariations] = useState<number[]>([])
  const [productDetail, setProductDetails] = useState<ProductDetails | null>(
    null,
  )
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null,
  )
  const orangeEbcoButton = useEbcoOrangeButtonStyle()
  const [relatedProducts, setRelatedProducts] = useState<ProductDetails[]>([])
  const [videoId, setVideoId] = useState<string>('')
  const [videoLink, setVideoLink] = useState<string>('')
  // const productsArray: ProductDetails[] = [];
  const [productsArray, setProductsArray] = useState<ProductDetails[]>([])
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string
  }>({})
  const auth = useAppSelector(state => state.auth).isLoggedIn
  // Initialize opening state for each attribute
  const [isSelectOpen, setIsSelectOpen] = useState<{ [key: string]: boolean }>(
    {},
  )
  const [value, setValue] = useState(0)
  const [openSliderModal, setOpenSliderModal] = useState(false)
  const [initialSlideGallery, setInitialSlideGallery] = useState<number>(0)
  const [meta_data, setMeta_data] = useState<MetaDataProp[]>([])
  const [download_meta_data, setDownload_meta_data] = useState<MetaDataProp[]>(
    [],
  )

  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()
  const query = useSearchParams()
  const pathname = usePathname()

  const [discountedPrice, setDiscountedPrice] = useState<string>('')
  const [mrp, setMrp] = useState<string>('')
  const [productImages, setProductImages] = useState<ImageProp[]>([])
  const [productName, setProductName] = useState<string>('')
  const [isVariationError, setIsVariationError] = useState<boolean>(false)
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false)
  const [isInBookmark, setIsInBookmark] = useState<boolean>(false)
  const [metaData, setMetaData] = useState<MetaDataProp | null>(null)
  const [relatedIds, setRelatedIds] = useState<number[]>([])
  const [fetchedIds, setFetchedIds] = useState<Set<number>>(new Set())
  const [fetchRelatedId, setFetchRelatedId] = useState<boolean>(true)
  const isInitialRender = useRef(true)
  const [openEnquiryModal, setOpenEnquiryModal] = useState<boolean>(false)
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [selectedProductImage, setSelectedProductImage] = useState<string>('')
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
  const menuuuu = useAppSelector(state => state.mainMenu).mainMenu
  const [isPostalCodeAvailable, setIsPostalCodeAvailable] =
    useState<boolean>(false)
  const theme = useTheme()
  const [isPostalCodeChecked, setIsPostalCodeChecked] = useState<boolean>(false)
  const [enquiryOPtions, setEnquiryOptions] = useState<string[]>([
    'End User',
    'Architect or Interior Designer',
    'Dealer',
    'Carpenter',
    'Contractor',
    'Others',
  ])
  const [cadFile, setCadFile] = useState<string>('')

  const useAddWishlistMutation = useAddWishlist()
  const useRemoveWishlistMutation = useRemoveWishlist()
  const useAddBookmarkMutation = useAddBookmark()
  const useRemoveBookmarkMutation = useRemoveBookmark()
  const [selectedEnquiry, setSelectedEnquiry] = useState<string>('Who Am I')
  const [enquiryError, setEnquiryError] = useState<string>('')
  const [postalError, setPostalError] = useState<string>('')
  const [isSearchedProduct, setIsSearchedProduct] = useState<boolean>(false)
  const [isYtVideo, setIsYtVideo] = useState<boolean>(false)
  const [ytLink, setYtLink] = useState<string>('')
  const [isOptionsNotProperlySelected, setIsOptionsNotProperlySelected] =
    useState<boolean>(false)
  const [modelSelected, setModelSelected] = useState<Cad>()
  const [isMobile, setIsMobile] = useState(false)
  const [modelData, setModelData] = useState<Cad[]>([])
  const [showCadTab, setShowCadTab] = useState(true)

  // MODAL MODEL FORM
  const [contact, setContact] = useState<E164Number | undefined>(undefined)
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [contactError, setContactError] = useState(false)
  const [openCadMenu, setopenCadMenu] = useState<null | HTMLElement>(null)
  const openCad = Boolean(openCadMenu)

  // DROP MENU
  const handleMenuDropClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event.currentTarget, modelSelected)
    setopenCadMenu(event.currentTarget)
  }
  const handleCloseCadMenu = () => {
    setopenCadMenu(null)
  }
  const handleChangeContact = (value: any) => {
    setContact(value)
  }
  //
  const getTitle = (model: string) => {
    let title = modelData?.filter(data => data.file === model)
    if (title) return title[0]?.title
    else return ''
  }
  const handleModelData = (
    event: React.ChangeEvent<HTMLSelectElement> | any,
  ) => {
    let model: Cad | undefined = {
      cad_files: [],
      file: '',
      title: '',
      show_3d: false,
      show_ar: false,
    }
    if (event.target.value !== '') {
      model = modelData?.find(data => data.file === event.target.value)
      setModelSelected(prev => (prev = model))
    }
  }
  function getSortedTabs(data: MetaDataProp[]): MetaDataProp[] {
    console.log(data, 'Meta Data')
    const dat = data
      .filter(item => /tab-\d+/.test(item.key)) // Filter keys with a number after "tab-"
      .sort((a, b) => {
        const numA = parseInt(a.key.match(/tab-(\d+)/)?.[1] || '0', 20)
        const numB = parseInt(b.key.match(/tab-(\d+)/)?.[1] || '0', 20)
        return numA - numB // Ascending order
      })
    console.log(dat, 'DATATATATATA')
    return dat.map(item => ({
      ...item,
      key: item.key.replace(/tab-\d+-/, '').replace(/_/g, ' '), // Remove the "tab-{number}-" part
    }))
  }

  const handleClose = () => {
    //// ////;
    setOpenSliderModal(false)
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Enquiry>()
  const {
    register: registerCAD,
    handleSubmit: handleSubmitCAD,
    reset: resetCAD,
    formState: { errors: errorsCAD },
  } = useForm<DownloadCAD>()
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  function getCategoryFromUrl(url: string) {
    // List of categories to check for
    const categories = ['worksmart', 'livsmart', 'ebco']

    // Create a URL object to easily parse the URL
    const urlObj = new URL(url)

    // Get the pathname from the URL
    const pathname = urlObj.pathname.toLowerCase()

    // Check if the pathname contains any of the categories
    for (const category of categories) {
      if (pathname.includes(`/${category}/`)) {
        return category
      }
    }
  }
  const modelViewerRef = useRef<HTMLDivElement & { addEventListener: any }>(
    null,
  )
  const [isModelLoading, setIsModelLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      const modelViewer = modelViewerRef.current

      if (modelViewer) {
        const handleModelLoaded = () => {
          console.log('Model Loaded')
          setIsModelLoading(false)
        }

        modelViewer.addEventListener('load', handleModelLoaded)

        clearInterval(interval)

        return () => {
          modelViewer.removeEventListener('load', handleModelLoaded)
        }
      }
    }, 100)
    return () => clearInterval(interval)
  }, [modelSelected])

  const handleARMode = () => {
    if (modelViewerRef.current) {
      // Trigger AR mode programmatically
      modelViewerRef.current.setAttribute('ar', 'true') // Enable AR
      modelViewerRef.current.setAttribute('ar-modes', 'scene-viewer quick-look') // Set AR modes
      modelViewerRef.current.requestFullscreen() // Request fullscreen (optional for better UX)
    }
  }

  useEffect(() => {
    const loadModelViewer = async () => {
      try {
        await import('@google/model-viewer/lib/model-viewer')
      } catch (error) {
        console.error('Error loading model-viewer:', error)
      }
    }
    loadModelViewer()
    return () => {}
  }, [])

  useEffect(() => {
    // Detect if the device is Android or iOS
    const isAndroidOrIOS = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      return (
        /android/.test(userAgent) || // Android devices
        /iphone|ipad|ipod/.test(userAgent) // iOS devices
      )
    }
    // Check the condition and update the state
    if (isAndroidOrIOS()) {
      setIsMobile(true)
    }
  }, [])

  useEffect(() => {
    const cadDataEntry = meta_data.find(entry => entry.key === 'cad data') as
      | { value: Cad[] }
      | undefined

    const cadData = cadDataEntry ? cadDataEntry.value : []
    setModelData(prev => (prev = cadData))
    if (cadData.length > 0) {
      let defaultModelValue = cadData[0]
      setModelSelected(prev => (prev = defaultModelValue))
    }
    const allShow3DFalse =
      cadData.length > 0 && cadData.every(item => item.show_3d === false)
    console.log(allShow3DFalse, 'False')
    if (allShow3DFalse) {
      setShowCadTab(false)
    }
  }, [meta_data])

  useEffect(() => {
    const item = query.get('selectedItem')

    let decodedItem = ''
    if (item) {
      decodedItem = decodeURIComponent(item)
    } else {
      decodedItem = getCategoryFromUrl(window.location.href)!
    }
    const search = query.get('search')
    if (search) {
      setIsSearchedProduct(true)
    }

    const breadcrumb = buildBreadcrumbByName(decodedItem)
    setBreadcrumbs(breadcrumb)
  }, [menuuuu])
  // const isShopNow
  const isShopNowProduct = (data: ProductDetails) => {
    return data.tags.some(tag => tag.id === 723)
  }

  function getItemByName(name: string) {
    return menuuuu.find(item => item.name.toLowerCase() === name.toLowerCase())
  }

  // Function to get item by ID
  function getItemById(id: number) {
    return menuuuu.find(item => item.id === id)
  }

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

  const handleSpecification = (bool: boolean) => {
    //// ////console.log("here");
    setIsSpecificationOpen(bool)
  }
  const handleFitting = (bool: boolean) => {
    setIsFittingInstructionsOpen(bool)
  }

  // Handle click to toggle select option
  const toggleSelect = (attributeSlug: string) => {
    // ////console.log(isSelectOpen, selectedOptions);
    setIsSelectOpen(prevState => ({
      ...prevState,
      [attributeSlug]: !prevState[attributeSlug],
    }))
  }
  const handleCheckoutSingleProduct = () => {
    const areAllOptionsSelected = Object.values(selectedOptions).every(
      value => value !== 'SELECT OPTION',
    )
    if (!auth) {
      // const currentUrl = window.location.pathname + window.location.search;

      // dispatch(
      //   setUrl({
      //     url: currentUrl,
      //   })
      // );
      // router.push("/login");
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
    if (!isPostalCodeChecked) {
      toggleDrawer(true)()
      return
    }
    if (isPostalCodeAvailable === false) {
      return
    }
    if (!areAllOptionsSelected) {
      setIsVariationError(true)
      return
    }
    const url = extractPath()
    const encodedURL = encodeURIComponent(url!).replace(/%20/g, '_')

    const updatedProduct: ProductDetails = {
      ...selectedProduct!,
      selectedQuantity: quantity,
      // name: productName,
      itemId: itemId!,
      selectedOptions: selectedOptions,
      itemURL: encodedURL,
      selectedMrp: mrp,
      selectedDiscountedPrice: discountedPrice,
      selectedImage: selectedProductImage,
      parent_slug: productDetail?.slug ?? '',
      categories: productDetail?.categories ?? [],
    }
    dispatch(clearCheckout())
    dispatch(addProductToCheckout(updatedProduct))
    dispatch(setCheckoutSource('buyNow'))

    router.push('/checkout')
  }
  interface UserDetails {
    whoAmI: string
    fullname: string
    email: string
    mobile: string | number
    companyName: string
    address: string
    requirement: string
    _wpcf7_unit_tag?: string
    product_name: string
  }

  const sendQuery = async (data: UserDetails) => {
    const decodedProductName = decodeHtml(productDetail?.name!)
    try {
      const response = await apiClient.post<UserDetails, any>(
        `${API_ENDPOINT.POST.sendQuery}/22178/feedback`,
        {
          // whoAmI: data.whoAmI,
          // password: data.password,
          whoAmI: data.whoAmI,
          address: data.address,
          companyName: data.companyName,
          email: data.email,
          fullname: data.fullname,
          mobile: data.mobile,
          requirement: data.requirement,
          product_name: decodedProductName,
          _wpcf7_unit_tag: 'send enquiry',
        },
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      )
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response
    } catch {}
  }
  const extractVideoUrl = (url: string): string => {
    const urlObj = new URL(url)
    const videoId = urlObj.searchParams.get('v')
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0`
      : url
  }

  const mutation = useMutation({
    mutationFn: sendQuery,
    onSuccess: data => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove('loading')
      // //console.log(data);
      toast.success('Enquiry sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      handleCloseEnquiryModal()
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })
  const sendCADQuery = async (data: DownloadCAD) => {
    try {
      const response = await apiClient.post<
        DownloadCAD,
        ContactFormResponse | any
      >(
        `${API_ENDPOINT.POST.sendQuery}/25254/feedback`,
        {
          _wpcf7_unit_tag: 'cad_form_data',
          fullname: data.fullname,
          product_name: productName,
          mobile: contact!,
          company: data.company,
          designation: data.designation,
        },
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      )
      return response
    } catch {
      return {} as ContactFormResponse
    }
  }

  const getLastPartCAD = (url: string, isDownload?: boolean) => {
    if (isDownload) {
      const filename = url.split('/').pop()
      return filename
    }

    const fileExtension = url.split('/').pop()?.split('.') || []

    return fileExtension.length > 1
      ? fileExtension[fileExtension.length - 1].toUpperCase()
      : ''
  }

  const mutationCAD = useMutation({
    mutationFn: sendCADQuery,
    onSuccess: data => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      if (data.status === 'mail_sent') {
        // //console.log(data);
        setContact(undefined)

        setOpenForm(false)
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

        downloadCadFile(cadFile, getLastPartCAD(cadFile, true))
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
  const handleWhoAmI = (value: string) => {
    if (value !== 'Who Am I') {
      setEnquiryError('')
    }
    setSelectedEnquiry(value)
  }
  const onSubmit: SubmitHandler<Enquiry> = data => {
    if (data.whoAmI === 'Who Am I') {
      setEnquiryError('Please select who am I')
    } else {
      mutation.mutate(data)
    }
    // //console.log(data);
  }

  const onCADSubmit: SubmitHandler<DownloadCAD> = data => {
    mutationCAD.mutate(data)
    // //console.log(data);
  }

  const checkPostalApi = async (data: number) => {
    try {
      const response = await apiClient.get<PostalCodeResponse>(
        `${API_ENDPOINT.GET.sendPostalCode}/${data}`,
      )
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response
    } catch {}
  }
  const preventSaveImage = (e: React.MouseEvent) => {
    // e.preventDefault() // Prevents the context menu from opening
  }
  const mutationPostal = useMutation({
    mutationFn: checkPostalApi,
    onSuccess: async data => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove('loading')
      if (data?.data.is_deliverable === '1') {
        dispatch(setPincode(data.data.pincode))
        setIsPostalCodeAvailable(true)
      } else {
        setIsPostalCodeAvailable(false)
      }
      if (data?.data.is_deliverable === '0') {
        setPostalError('Sorry, we do not deliver on this postal code')
      }
      setTimeout(() => {
        if (Boolean(data?.data.is_deliverable) === true) {
          toggleDrawer(false)()
        }
      }, 1000)
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })
  interface Variation {
    [key: string]: string
  }

  interface ProductPayload {
    product_id: number
    quantity: number
    variation_id: number
    variation: Variation
  }
  interface OriginalObject {
    [key: string]: string
  }

  const convertToPayload = (input: OriginalObject): Record<string, string> => {
    const variation: Record<string, string> = {}

    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        const newKey = `attribute_${key.toLowerCase()}`
        variation[newKey] = input[key]
      }
    }

    return variation
  }

  const addToCartApi = async (product: ProductDetails) => {
    let obj = {
      product_id: product.id,
      quantity: product.selectedQuantity! || 1,
      variation_id: product.itemId,
      variation: convertToPayload(product.selectedOptions),
    }
    try {
      const response = await apiClient.post<ProductPayload, CartResponse>(
        `${API_ENDPOINT.POST.addCart}`,
        obj,
      )
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response
    } catch {}
  }
  const mutationAddTOCart = useMutation({
    mutationFn: addToCartApi,
    onSuccess: async data => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove('loading')
      toast.success('Product added to cart successfully!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      })
      await getCart.refetch()
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })
  const handleWarranty = (bool: boolean) => {
    setIsWarrantyOpen(bool)
  }
  const toggleDrawer = (newOpen: boolean) => () => {
    setPostalError('')
    setOpen(newOpen)
  }
  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setPostalCodeInput(null)
    } else {
      setPostalCodeInput(Number(value))
    }
    // if (value.length === 6) {
    //   mutationPostal.mutate(Number(value));
    // }
  }
  const handleImageGallery = (index: number) => {
    // ////console.log("here");
    setInitialSlideGallery(index)
    setOpenSliderModal(true)
  }
  const handleOpenEnquiryModal = () => {
    setOpenEnquiryModal(true)
  }
  const handleCloseEnquiryModal = () => {
    reset()
    setSelectedEnquiry('Who Am I')
    setOpenEnquiryModal(false)
  }
  const checkPostal = () => {
    if (JSON.stringify(postalCodeInput).length < 6) {
      setPostalError('Enter a valid postal code')
    } else {
      setIsPostalCodeChecked(true)
      setPostalError('')
      // setPostalError("Sorry, we do not deliver to this postal code");
      mutationPostal.mutate(postalCodeInput!)
    }
  }
  useEffect(() => {
    if (postalCodeInput?.toString().length! < 6) {
      setIsPostalCodeAvailable(false)
    }
  }, [postalCodeInput])
  useEffect(() => {
    if (productsArray.length > 0) {
      // //console.log("productsArray", productsArray);
      let minPrice = Infinity
      let maxPrice = -Infinity

      productsArray.forEach(product => {
        const price = parseFloat(product.price)
        if (!isNaN(price)) {
          if (price < minPrice) {
            minPrice = price
          }
          if (price > maxPrice) {
            maxPrice = price
          }
        }
      })
    }
  }, [productsArray])
  const getTabLabel = (key: string) => {
    if (key.includes('tab-')) {
      return key.replace('tab-', '').replace(/_/g, ' ')
    }
    return key
  }
  const DrawerList = (
    <Box className='postal-drawer-container'>
      <Box className='title-close'>
        <Typography className='postal-title'>Postal Code</Typography>
        <Image
          src={'/images/close.svg'}
          alt='close'
          className='close-modal'
          width={20}
          height={20}
          unoptimized
          onClick={toggleDrawer(false)}
        />
      </Box>
      <Box className='postal-container column-space-between'>
        <Box className='postal-check-container'>
          <Typography className='postal-text'>
            Enter pin code to check availability
          </Typography>
          <input
            type='number'
            name='postal'
            id='postal'
            className='postal-code'
            placeholder='Enter pin code'
            onChange={handlePostalChange}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                checkPostal()
              }
            }}
            // If postalCodeInput is null, set value to an empty string
            value={postalCodeInput !== null ? postalCodeInput : ''}
          />
          <Typography className='delivery-text'>
            (Delivery within India will be around 2-10 working days)
          </Typography>

          {postalError && (
            <Typography
              className='input-error'
              sx={{
                fontSize: '12px',
                color: '#FF0000',
              }}
            >
              {postalError}
            </Typography>
          )}
          {isPostalCodeAvailable &&
            postalCodeInput?.toString().length === 6 && (
              <Typography
                className='delivery-text'
                sx={{
                  fontSize: '14px',
                  color: 'green',
                  fontFamily: 'Uniform Medium !important',
                }}
              >
                Delivery Available
              </Typography>
            )}
        </Box>
        <Box className='orange-button-container' mt={2}>
          <button
            className='orange-button check-btn'
            onClick={checkPostal}
            style={{
              margin: '0 !important',
              cursor: 'pointer',
            }}
          >
            check
          </button>
        </Box>
      </Box>
    </Box>
  )
  const fetchData = async (
    itemId: string | number,
    toSetVariations: boolean = false,
  ) => {
    try {
      const response = await apiClient.get<ProductDetails>(
        ` ${API_ENDPOINT.GET.get_prod_products}/${itemId}?acf_format=standard`,
      )
      if (!response) {
        throw new Error('No data found')
      }

      setIsYtVideo(false)
      if (toSetVariations) {
        setVariations(response.data.variations)
        setProductDetails(response.data)
        setIsOptionsNotProperlySelected(true)

        const filteredMetaData = response.data.meta_data.filter(
          meta =>
            meta.key.includes('tab-') &&
            !meta.key.includes('_tab-') &&
            meta.value.length > 0,
        )
        const downloadFilteredMetaData = response.data.meta_data.filter(
          meta =>
            meta.key.includes('tab-') &&
            !meta.key.includes('_tab-') &&
            meta.value.length > 0 &&
            (meta.key.includes('tab-specification') ||
              meta.key.includes('tab-fitting_instructions')),
        )
        const videoMetaData = response.data.meta_data.filter(
          meta => meta.key === 'product_video',
        )
        const videoLinkData = response.data.meta_data.filter(
          meta => meta.key === 'youtube_link',
        )
        //console.log("-=-=-=--=-=--=-=-");
        if (videoLinkData.length > 0) {
          //console.log(videoLinkData, "videoLinkData");
          setIsYtVideo(true)
          setYtLink(videoLinkData[0].value)
        }
        //console.log(videoMetaData, "videoMetaData");
        if (videoMetaData.length > 0) {
          setVideoId(videoMetaData[0].value)
        }
        let remainingImagesCount = 0
        if (
          videoLinkData.length > 1 &&
          videoLinkData[0].value.length === 0 &&
          videoMetaData.length > 1 &&
          videoMetaData[0].value.length === 0
        ) {
          remainingImagesCount = response?.data?.images?.length - 3
          console.log(remainingImagesCount, 'remainingImagesCount')
          setRemainingImages(remainingImagesCount)
        } else {
          remainingImagesCount = response?.data?.images?.length - 1
          console.log(remainingImagesCount, 'remainingImagesCount')
          setRemainingImages(remainingImagesCount)
        }
        ////console.log("filteredMetaData", filteredMetaData);
        // setFilteredMataData(filteredMetaData);
        setMeta_data(getSortedTabs(filteredMetaData))
        setDownload_meta_data(downloadFilteredMetaData)
        // setRelatedIds(response.data.related_ids);
        if (response.data?.attributes?.length > 0) {
          // Filter attributes where variation is true
          const variationAttributes = response.data.attributes.filter(
            attribute => attribute.variation === true,
          )
          // ////console.log("variationAttributes", variationAttributes);
          // Initialize selected options for each attribute
          const initialSelectedOptions: { [key: string]: string } = {}
          variationAttributes.forEach(attribute => {
            initialSelectedOptions[attribute.name] = 'SELECT OPTION'
          })
          setSelectedOptions(initialSelectedOptions)
          // Initialize opening state for each attribute
          const initialIsSelectOpen: { [key: string]: boolean } = {}
          variationAttributes.forEach(attribute => {
            initialIsSelectOpen[attribute.name] = false
          })
          setIsSelectOpen(initialIsSelectOpen)
        }

        setProductImages(response.data.images)
        setProductName(response.data.name)
        // setProductDescription(response.data.description);
        setItemId(response.data.id)
        // if (isShopNowProduct(response.data)) {
        setIsInWishlist(response.data.is_wishlist)
        // } else {

        setIsInBookmark(response.data.is_bookmark)
        // }
        console.log(
          '🚀 ~ ProductDetailsPage ~ response.data.is_bookmark:',
          response.data.is_bookmark,
        )
      } else {
        setProductsArray(prev => {
          if (!prev.some(product => product.id === response.data.id)) {
            return [...prev, response.data]
          }
          return prev
        })
      }
      return response.data
    } catch (error) {
      // //console.logerror("Failed to fetch new arrival data", error);
      return [] // Return an empty array if an error occurs
    }
  }
  useEffect(() => {
    //console.log("VIDEO ID", videoId);
    if (videoId) {
      fetchMedia(videoId)
    }
  }, [videoId])
  const fetchInitialData = async (toSetVariations: boolean = false) => {
    try {
      const response = await apiClient.get<ProductDetails[]>(
        ` ${API_ENDPOINT.GET.get_prod_products}?slug=${slug}&acf_format=standard`,
      )
      let path = pathname.split('/')[1]
      let categories = response.data[0].categories
      const truePath = categories.some(category =>
        category.slug.toLowerCase().includes(path.toLowerCase()),
      )
      if (!truePath) {
        router.push('/')
      }

      if (!response) {
        throw new Error('No data found')
      }

      setIsLoading(false)

      const productData = response.data[0]

      setIsYtVideo(false)
      if (toSetVariations) {
        setVariations(productData.variations)
        setProductDetails(productData)
        setIsOptionsNotProperlySelected(true)

        const filteredMetaData = productData.meta_data.filter(
          meta =>
            meta.key.includes('tab-') &&
            !meta.key.includes('_tab-') &&
            meta.value.length > 0,
        )
        const downloadFilteredMetaData = productData.meta_data.filter(
          meta =>
            meta.key.includes('tab-') &&
            !meta.key.includes('_tab-') &&
            meta.value.length > 0 &&
            (meta.key.includes('tab-specification') ||
              meta.key.includes('tab-fitting_instructions')),
        )
        const videoLinkData = productData.meta_data.filter(
          meta => meta.key === 'product_video',
        )
        const videoMetaData = productData.meta_data.filter(
          meta => meta.key === 'youtube_link',
        )
        //console.log("-=-=-=--=-=--=-=-");
        if (videoLinkData.length > 0) {
          //console.log(videoLinkData, "videoLinkData");
          setVideoId(videoLinkData[0].value)
        }
        //console.log(videoMetaData, "videoMetaData");
        if (videoMetaData.length > 0) {
          setIsYtVideo(true)
          setYtLink(videoMetaData[0].value)
        }

        let remainingImagesCount = 0
        if (
          videoLinkData.length > 0 &&
          videoLinkData[0].value.length === 0 &&
          videoMetaData.length > 0 &&
          videoMetaData[0].value.length === 0
        ) {
          remainingImagesCount = productData?.images?.length - 3
          console.log(remainingImagesCount, 'remainingImagesCount')

          setRemainingImages(remainingImagesCount)
        } else {
          remainingImagesCount = productData?.images?.length - 1
          console.log(remainingImagesCount, 'remainingImagesCount')
          setRemainingImages(remainingImagesCount)
        }

        setMeta_data(getSortedTabs(filteredMetaData))
        setDownload_meta_data(downloadFilteredMetaData)
        setRelatedIds(productData.related_ids)

        if (productData?.attributes?.length > 0) {
          // Filter attributes where variation is true
          const variationAttributes = productData.attributes.filter(
            attribute => attribute.variation === true,
          )
          // ////console.log("variationAttributes", variationAttributes);
          // Initialize selected options for each attribute
          const initialSelectedOptions: { [key: string]: string } = {}
          variationAttributes.forEach(attribute => {
            initialSelectedOptions[attribute.name] = 'SELECT OPTION'
          })
          setSelectedOptions(initialSelectedOptions)
          // Initialize opening state for each attribute
          const initialIsSelectOpen: { [key: string]: boolean } = {}
          variationAttributes.forEach(attribute => {
            initialIsSelectOpen[attribute.name] = false
          })
          setIsSelectOpen(initialIsSelectOpen)
        }

        setProductImages(productData.images)
        setProductName(productData.name)
        // setProductDescription(productData.description);
        setItemId(productData.id)
        // if (isShopNowProduct(productData)) {
        setIsInWishlist(productData.is_wishlist)
        // } else {
        setIsInBookmark(productData.is_bookmark)
        // }
      } else {
        setProductsArray(prev => {
          if (!prev.some(product => product.id === productData.id)) {
            return [...prev, productData]
          }
          return prev
        })
      }
      return productData
    } catch (error) {
      setIsLoading(false)
      // //console.logerror("Failed to fetch new arrival data", error);
      return [] // Return an empty array if an error occurs
    }
  }

  useEffect(() => {
    if (slug) {
      fetchInitialData(true)
    }
    if (query.get('selectedItem')) {
      const cleanPath = pathname
      router.replace(cleanPath)
    }
  }, [])

  const fetchMedia = async (id: string) => {
    try {
      const response = await apiClient.get<ProductVideo>(
        ` ${API_ENDPOINT.GET.getMediaById}/${id}`,
      )
      if (!response) {
        throw new Error('No data found')
      }
      ////console.log(toSetVariations, "toSetVariations");
      //console.log(response.data, "response.data");
      setVideoLink(response.data.source_url)
      return response.data
    } catch (error) {
      // //console.logerror("Failed to fetch new arrival data", error);
      return [] // Return an empty array if an error occurs
    }
  }
  const fetchRelatedProductsData = async (
    itemId: string | number,
  ): Promise<ProductDetails | null | undefined> => {
    try {
      if (fetchRelatedId) {
        ////console.log(fetchRelatedId, "fetchRelatedId");
        const response = await apiClient.get<ProductDetails>(
          `${API_ENDPOINT.GET.get_prod_products}/${itemId}?acf_format=standard`,
        )
        if (!response) {
          throw new Error('No data found')
        }
        return response.data
      }
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return null // Return null if an error occurs
    }
  }

  useEffect(() => {
    const fetchRelatedIdData = async () => {
      if (relatedIds.length > 0) {
        try {
          setRelatedProducts([])
          const responses = await Promise.all(
            relatedIds.map(id => fetchRelatedProductsData(id)),
          )
          setFetchRelatedId(false)

          // Filter out any null responses (failed fetches)
          const validResponses = responses.filter(
            response => response !== null,
          ) as ProductDetails[]
          // Update state with the new related products if the ID is unique
          setRelatedProducts(prevProducts => {
            const newProducts = validResponses.filter(
              product => !fetchedIds.has(product.id),
            )

            setFetchedIds(prevFetchedIds => {
              newProducts.forEach(product => prevFetchedIds.add(product.id))
              return prevFetchedIds
            })
            return [...prevProducts, ...newProducts]
          })

          isInitialRender.current = false
          // All fetchData calls are complete
          // ////console.log(relatedProducts, "relatedProducts");
        } catch (error) {
          console.error('Error in fetching variations', error)
        }
      }
    }
    if (relatedIds.length > 0) {
      fetchRelatedIdData()
    }
  }, [relatedIds])

  useEffect(() => {
    // Check if productDetail is available and update the document title
    if (productDetail) {
      document.title =
        productDetail.name || 'Ebco - Furniture Fittings and Accessories'

      // Track product view for analytics
      trackProductView({
        id: productDetail.id,
        name: productDetail.name,
        price: productDetail.price
      });
    } else {
      document.title = 'Ebco - Furniture Fittings and Accessories' // Fallback during loading
    }
  }, [productDetail])

  const handleVariations = async () => {
    if (variations.length > 0) {
      try {
        await Promise.all(
          variations.map(variation => fetchData(variation, false)),
        )
        // All fetchData calls are complete
        // finalFunction(); // Call the function you want to execute after all API calls
      } catch (error) {
        // //console.logerror("Error in fetching variations", error);
      }
    }
  }

  const handleHeartClick = () => {
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
    if (productDetail && productDetail?.id !== null) {
      let updatedProduct: ProductDetails = {
        ...productDetail,
        is_wishlist: !productDetail.is_wishlist,
      }

      if (updatedProduct.is_wishlist) {
        useAddWishlistMutation.mutate(updatedProduct.id!)
      } else {
        useRemoveWishlistMutation.mutate(updatedProduct.id!)
      }
      setIsInWishlist(updatedProduct.is_wishlist)
      setProductDetails(updatedProduct)
    }
  }

  const handleBookmarkClick = () => {
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
    if (productDetail && productDetail?.id !== null) {
      let updatedProduct: ProductDetails = {
        ...productDetail,
        is_bookmark: !productDetail.is_bookmark,
      }

      if (updatedProduct.is_bookmark) {
        useAddBookmarkMutation.mutate(updatedProduct.id!)
      } else {
        useRemoveBookmarkMutation.mutate(updatedProduct.id!)
      }
      setIsInBookmark(updatedProduct.is_bookmark)
      setProductDetails(updatedProduct)
    }
  }
  const handleDownloadCAD = (item: string) => {
    console.log(item)
    console.log(modelSelected?.file)
    setCadFile(item)
    if (!auth) {
      const currentUrl = window.location.pathname + window.location.search

      dispatch(
        setUrl({
          url: currentUrl,
        }),
      )
      // let url = `${window.location.origin}/my-profile?tab=wishlist`
      localStorage.setItem('url', currentUrl)
      router.push('/login')
    } else {
      console.log('Show form')
      setOpenForm(prev => (prev = true))
    }
  }
  const handleBreadcrumbClick = (category: string, index: number) => {
    const categoryFromUrl = getCategoryFromUrl(window.location.href)
    if (index === 0) {
      window.location.href = `/${categoryFromUrl!.toLocaleLowerCase()}`
    } else {
      let encodedCategory = encodeURIComponent(category)
      window.location.href = `/${categoryFromUrl!.toLocaleLowerCase()}?selectedItem=${encodedCategory}`
    }
  }

  const finalFunction = () => {
    if (productsArray.length > 0) {
      // console.log("ARRAY", productsArray, selectedOptions)
      const selectedProduct = productsArray.find((product: ProductDetails) => {
        // Check if the product matches all selected options
        return Object.keys(selectedOptions).every(key => {
          const attribute = product.attributes.find(
            (attr: any) => attr.name === key,
          )
          return attribute && attribute.option === selectedOptions[key]
        })
      })

      // console.log("Selected Product:", selectedProduct, "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
      if (selectedProduct) {
        setSelectedProduct(selectedProduct)
        // //console.log("Selected Product:", selectedProduct);
        // Update state with the selected product details
        setDiscountedPrice(selectedProduct.price)
        setMrp(selectedProduct.regular_price)
        setSelectedProductImage(selectedProduct.images[0].src)
        // setProductImages(selectedProduct.images);
        // setProductName(selectedProduct.name);
        setItemId(selectedProduct.id)
        // setProductDescription(selectedProduct.description);
      } else {
        // ////console.log("No product matches the selected options");
        setIsOptionsNotProperlySelected(false)

        toast.error('Please select proper combination')
      }
    }
  }

  useEffect(() => {
    const areAllOptionsSelected = Object.values(selectedOptions).every(
      value => value !== 'SELECT OPTION',
    )

    if (areAllOptionsSelected) {
      // ////console.log("All options are selected");
      // All options are selected, do the task
      // For example, call a function or update state
      // Task to be performed when all options are selected
      // ////console.log(productsArray, selectedOptions);
      finalFunction()
    }
  }, [selectedOptions])

  useEffect(() => {
    if (variations.length > 0) {
      handleVariations()
    }
    // //console.log(variations, productsArray, "variationAttributes");
    if (variations.length === 0 && productsArray.length === 0) {
      // //console.log("NO VARIATIONS", productDetail);
      setMrp(productDetail?.regular_price!)
      setDiscountedPrice(productDetail?.price!)
    }
  }, [variations])

  const addToLocalCart = (product: ProductDetails) => {
    const url = extractPath()
    const encodedURL = encodeURIComponent(url!).replace(/%20/g, '_')

    const updatedProduct: ProductDetails = {
      ...product,
      selectedQuantity: quantity,
      name: productName,
      itemId: itemId!,
      selectedOptions: selectedOptions,
      itemURL: encodedURL,
      selectedMrp: mrp,
      selectedDiscountedPrice: discountedPrice,
      selectedImage: selectedProductImage,
      type: product.type === 'variation' ? 'variable' : product.type,
    }

    // Create a CartItemApi object from the ProductDetails
    const cartItem: CartItemApi = {
      cart_item_key: `local_${product.id}_${itemId}_${Date.now()}`,
      product_id: product.id!,
      name: productName,
      slug: product.slug,
      parent_slug: product.parent_slug || '',
      image: selectedProductImage || (product.images[0]?.src || ''),
      quantity: quantity,
      price: discountedPrice || product.price,
      total: Number(discountedPrice || product.price) * quantity,
      variation_id: itemId!,
      variation: convertToPayload(selectedOptions),
      categories: product.categories,
      sale_price: Number(discountedPrice) || 0,
      regular_price: Number(mrp) || 0,
      discount_price: Number(mrp) - Number(discountedPrice) || 0,
      type: product.type,
      selectedOptions: selectedOptions
    }

    // Add to localStorage cart
    import('@/utils/localStorageCart').then(({ addItemToLocalCart }) => {
      addItemToLocalCart(cartItem);
      // Update cart count in the header
      dispatch(setCartProductsCount(getLocalCart().items.length));

      // Track add to cart event for analytics
      trackAddToCart({
        id: product.id!,
        name: productName,
        price: discountedPrice || product.price,
        quantity: quantity
      });

      // Show success message
      toast.success('Product added to cart successfully!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    });

    // Also add to Redux store for consistency
    dispatch(addProduct(updatedProduct));
  };

  const addToCart = async (product: ProductDetails) => {
    const areAllOptionsSelected = Object.values(selectedOptions).every(
      value => value !== 'SELECT OPTION',
    )

    // Check if all options are selected
    if (!areAllOptionsSelected) {
      setIsVariationError(true)
      return
    }

    // For logged in users, continue with the existing flow
    if (!isPostalCodeChecked) {
      toggleDrawer(true)()
      return
    }
    if (isPostalCodeAvailable === false) {
      return
    }

    if (!auth) {
      // If user is not logged in, add to localStorage cart
      addToLocalCart(product);
      return;
    }


    const url = extractPath()
    const encodedURL = encodeURIComponent(url!).replace(/%20/g, '_')

    const updatedProduct: ProductDetails = {
      ...product,
      selectedQuantity: quantity,
      name: productName,
      itemId: itemId!,
      selectedOptions: selectedOptions,
      itemURL: encodedURL,
      selectedMrp: mrp,
      selectedDiscountedPrice: discountedPrice,
      selectedImage: selectedProductImage,
      type: product.type === 'variation' ? 'variable' : product.type,
    }
    mutationAddTOCart.mutate(updatedProduct)

    // Track add to cart event for analytics
    trackAddToCart({
      id: product.id!,
      name: productName,
      price: discountedPrice || product.price,
      quantity: quantity
    });

    dispatch(addProduct(updatedProduct))
  }
  const fetchCartProducts = async (): Promise<CartProduct | []> => {
    if (!auth) {
      // If user is not logged in, get cart from localStorage
      const localCart = getLocalCart();
      dispatch(setCartProductsCount(localCart.items.length));
      return localCart;
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
      console.error('Failed to fetch cart data', error)
      return [] // Return an empty array if an error occurs
    }
  }
  interface pdfUrl {
    pdf_url: string
  }

  const downloadBrochure = async (id: number) => {
    try {
      const response = await apiClient.get<pdfUrl>(
        `${API_ENDPOINT.GET.downloadPdf}/${id}`,
      )

      if (!response) {
        throw new Error('No data found')
      }

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

  const getCart = useQuery({
    queryKey: ['product-cart'],
    queryFn: () => fetchCartProducts(),
  })
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1)
    }
  }
  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1)
  }
  const absoluteImageUrl = new URL(
    'https://dashboard.ebco.in/wp-content/uploads/nc/catalog/heavy-duty-cabinet-support/dp-img-1.jpg',
    'https://dashboard.ebco.in',
  ).toString()

  const getSpecifications = (item: ProductDetails): JSX.Element => {
    const specification = meta_data[0]
    const care_instructions = meta_data[2]
    // Calculate the maximum number of rows based on the maximum length of each value array
    return (
      <>
        <Modal
          open={openForm}
          onClose={() => setOpenForm(false)}
          aria-labelledby='parent-modal-title'
          aria-describedby='parent-modal-description'
        >
          <Box
            sx={{
              ...style2,
              width: '80vw',
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
              onClick={() => setOpenForm(false)}
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
              Fill in Your Details
            </Typography>
            <form
              onSubmit={handleSubmitCAD(onCADSubmit)}
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
                      fontSize: 2,
                    }}
                    {...registerCAD('fullname', {
                      required: true,
                      validate: value =>
                        (value && value.trim().length > 0) || 'Enter full name',
                    })}
                  />

                  {errorsCAD.fullname?.type === 'required' && (
                    <p role='alert' style={inputError}>
                      Full name is required
                    </p>
                  )}
                </Box>
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
                  style={{ RxFontSize: '8px' }}
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
                  className='phone-input-custom-form-cad'
                />

                {contactError && (
                  <p role='alert' style={inputError}>
                    Enter Valid Contact Number
                  </p>
                )}
              </Box>
              <Box
                className='input-section-query column-space-between w-100'
                sx={{
                  alignItems: 'flex-start',
                  // margin: '0 !important',
                }}
              >
                <input
                  id='company'
                  type='text'
                  className='contact-us-input'
                  placeholder='Enter company*'
                  style={{
                    color: customColors.lightGreyEbco,
                    border: `1px solid ${customColors.selectBox}`,
                    fontSize: 2,
                  }}
                  {...registerCAD('company', {
                    required: true,
                    validate: value =>
                      (value && value.trim().length > 0) || 'Enter company',
                  })}
                />

                {errorsCAD.company?.type === 'required' && (
                  <p role='alert' style={inputError}>
                    Company is required
                  </p>
                )}
              </Box>

              <Box
                className='input-section-query column-space-between w-100'
                sx={{
                  alignItems: 'flex-start',
                  margin: '0 !important',
                }}
              >
                <input
                  id='designation'
                  type='text'
                  className='contact-us-input'
                  placeholder='Enter designation*'
                  style={{
                    color: customColors.lightGreyEbco,
                    border: `1px solid ${customColors.selectBox}`,
                    fontSize: 2,
                  }}
                  {...registerCAD('designation', {
                    required: true,
                    validate: value =>
                      (value && value.trim().length > 0) || 'Enter designation',
                  })}
                />

                {errorsCAD.designation?.type === 'required' && (
                  <p role='alert' style={inputError}>
                    Designation is required
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
        <Box className='specifications-care-container'>
          <Box
            className='specifications-container'
            sx={{
              mt: 6,
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <Box
              sx={{
                minHeight: '100vh',
                pointerEvents: 'auto',
              }}
            >
              {/* {metaData?.value && (
              <div
                className='styled-images'
                dangerouslySetInnerHTML={{ __html: metaData?.value }}
              />
            )} */}
              {metaData?.key &&
              !getTabLabel(metaData?.key).toLowerCase().includes('cad') ? (
                <>
                  <Box className='title-close'>
                    <Typography
                      className='specifications-title'
                      textTransform={'uppercase'}
                    >
                      {metaData?.key && getTabLabel(metaData?.key)}
                    </Typography>
                    {/* Handle the close button as needed */}
                  </Box>
                  <div
                    dangerouslySetInnerHTML={{ __html: metaData?.value }}
                    className='styled-images content-container'
                  />
                </>
              ) : metaData?.key &&
                getTabLabel(metaData?.key).toLowerCase().includes('cad') &&
                showCadTab ? (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 6,
                    }}
                  >
                    <Typography
                      onClick={() => {
                        handleSpecification(false)
                      }}
                      className='product-details-title'
                      sx={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {metaData?.key &&
                        `${getTabLabel(metaData.key)
                          .split(' ')[0]
                          .toLocaleUpperCase()}
                      ${getTabLabel(metaData.key).split(' ')[1]}`}
                    </Typography>
                    <Box id='ar-image-container'>
                      <Box className='row-center'>
                        <Button
                          className='add-to-cart-button blue-border-button'
                          onClick={handleMenuDropClick}
                          sx={{
                            lineHeight: '1.2 !important',
                            width: 'auto',
                            fontSize: '0.8rem',
                            p: '10px !important',
                          }}
                        >
                          {' '}
                          <Image
                            src={'/images/download-pdf.svg'}
                            alt='cart'
                            width={20}
                            height={20}
                            className='cart-icon'
                          />{' '}
                          Download CAD
                        </Button>
                        <Menu
                          id='demo-positioned-menu'
                          aria-labelledby='demo-positioned-button'
                          anchorEl={openCadMenu}
                          open={openCad}
                          onClose={handleCloseCadMenu}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                          sx={{
                            // Remove the backdrop blur
                            '& .MuiBackdrop-root': {
                              backdropFilter: 'none',
                              backgroundColor: 'transparent', // Ensure background color is transparent if you don't want any backdrop effect.
                            },
                          }}
                        >
                          {modelSelected &&
                            modelSelected.cad_files &&
                            modelSelected.cad_files.map(item => (
                              <MenuItem
                                key={item}
                                onClick={() => {
                                  handleCloseCadMenu()
                                  handleDownloadCAD(item)
                                }}
                              >
                                {getLastPartCAD(item)}
                              </MenuItem>
                            ))}
                        </Menu>
                      </Box>
                    </Box>
                  </Box>
                  {
                    <Box
                      id='ar-container'
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        // justifyContent: 'space-between',
                      }}
                    >
                      <Typography
                        className='product-details-title'
                        sx={{
                          textTransform: 'capitalize',
                        }}
                      >
                        {modelSelected && getTitle(modelSelected?.title)}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          py: 1,
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            // width: '15%',
                          }}
                          className=''
                        >
                          <Typography
                            sx={{
                              pt: 0.5,
                              // width: '30%',
                              color: '#8D8D8D',
                            }}
                          >
                            Select
                          </Typography>
                          <select
                            id='sort-by-select'
                            style={{
                              padding: '0.5rem 1.3rem',
                              width: 'auto',
                              height: 'max-content',
                              border: '1px solid',
                              borderColor: customColors.darkBlueEbco,
                              fontSize: '12px',
                              fontFamily: 'Uniform Medium',
                              color: customColors.darkBlueEbco,
                              borderRadius: '100px',
                              WebkitAppearance: 'none', // Ensures compatibility with iOS
                              MozAppearance: 'none',
                              appearance: 'none',
                            }}
                            value={modelSelected?.file}
                            onChange={handleModelData}
                          >
                            {modelData &&
                              modelData
                                .filter(opt => opt.show_3d)
                                .map(option => (
                                  <option
                                    className='option-product'
                                    key={option.title}
                                    value={option.file}
                                  >
                                    {option.title}
                                  </option>
                                ))}
                          </select>
                        </Box>
                      </Box>
                    </Box>
                  }

                  {/* REAL LIB CODE */}
                  {isModelLoading && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10, // Ensure the loader is on top
                      }}
                    >
                      <Loader />
                    </div>
                  )}
                  {modelSelected ? (
                    <Box>
                      <model-viewer
                        ref={modelViewerRef}
                        id='first'
                        src={modelSelected.file}
                        // ios-src={modelSelected}
                        // seamless-poster
                        // environment-image='neutral'
                        // exposure='2'
                        // interaction-prompt-threshold='0'
                        shadow-intensity='1'
                        loading='eager'
                        camera-controls
                        // disable-zoom
                        ar={
                          isMobile && modelSelected.show_ar ? true : undefined
                        }
                        // ar={undefined}
                        // camera-orbit='0deg 90deg 0deg 8.37364m'
                        alt='3D model'
                        style={{
                          width: '100%',
                          height: '400px',
                        }}
                      ></model-viewer>
                    </Box>
                  ) : (
                    <>
                      <Box
                        sx={{
                          height: '30vh',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='h6' align='center'>
                          No Model Selected
                        </Typography>
                      </Box>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </Box>
            {/* {
            <Box
              sx={{
                position: 'sticky',
                minHeight: '10vh',
                bottom: 1,
                width: '100%',
                // marginBottom: 3,
                justifyContent: 'center',
              }}
            >
              {isMobile && (
                <button
                  style={{
                    ...ebcoBorderBlueButtonStyle,
                    margin: '0 auto',
                    fontSize: '12px',
                    height: '28px',
                  }}
                  onClick={handleARMode}
                >
                  Open AR
                </button>
              )}
            </Box>
          } */}

            <Box
              sx={{
                position: 'sticky',
                minHeight: '20vh',
                bottom: 0,
                backgroundColor: 'white',
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
              className='w-100 new-close-btn'
            >
              <Typography
                className='close-specifications-modal'
                onClick={() => {
                  handleSpecification(false)
                }}
                sx={{
                  color: customColors.darkgrey,
                  cursor: 'pointer',
                }}
              >
                {' '}
                &#8592; Close{' '}
              </Typography>
            </Box>
          </Box>
        </Box>
      </>
    )
  }
  function getFittingInstructions(item: ProductDetails) {
    const fittingInstructions = meta_data[1]
    return (
      <Box className='fitting-container h-100'>
        <Typography className='fitting-title'>Fitting Instructions</Typography>
        <Box className='title-close'>
          <Image
            src={'/images/close.svg'}
            alt='close'
            className='close-modal mobile-view'
            width={20}
            height={20}
            onClick={() => handleFitting(false)}
          />
        </Box>
        <Box className='fitting-instructions-container'>
          <div
            className='styled-images'
            dangerouslySetInnerHTML={{ __html: fittingInstructions?.value }}
          />
        </Box>
      </Box>
    )
  }
  function getWarrantyReturns(item: ProductDetails) {
    const warranty = meta_data[3]
    const returns = meta_data[4]

    return (
      <Box className='warranty-returns-container'>
        <Box className='title-close'>
          <Image
            src={'/images/close.svg'}
            alt='close'
            className='close-modal mobile-view'
            width={20}
            height={20}
            onClick={() => handleWarranty(false)}
          />
        </Box>
        <Box
          className='warranty-container row-space-between'
          sx={{
            alignItems: 'flex-start',
          }}
        >
          <Box className='warranty-instructions-title'>
            <Typography className='warranty-instructions-title-text'>
              Warranty Instructions
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: warranty?.value }} />
          </Box>
          <Box className='warranty-instructions-image'>
            <Image
              width={200}
              height={200}
              src={'/images/product-details/warranty.png'}
              className='warranty-image'
              alt=''
            />
          </Box>
        </Box>
        <Box
          className='warranty-container return-container row-space-between'
          sx={{
            alignItems: 'flex-start',
          }}
        >
          <Box className='warranty-instructions-image'>
            <Image
              width={200}
              height={200}
              src={'/images/product-details/return.png'}
              className='warranty-image'
              alt=''
            />
          </Box>
          <Box className='warranty-instructions-title'>
            <Typography className='warranty-instructions-title-text'>
              Return Instructions
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: returns?.value }} />
          </Box>
        </Box>
      </Box>
    )
  }
  // useEffect(() => {
  //   const script = document.createElement('script')
  //   script.type = 'module'
  //   script.src =
  //     'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js'
  //   document.body.appendChild(script)
  // }, [])

  return (
    <>
      <Head>
        <title>
          {!productDetail
            ? 'Loading...'
            : productDetail?.name
            ? `${productDetail.name} - Ebco`
            : 'Ebco - Furniture Fittings and Accessories'}
        </title>
      </Head>

      <Box
        sx={{
          minHeight: '100vh !important',
        }}
      >
        {isLoading && (
          <Box className='loader-container'>
            <Box className='loader'></Box>
          </Box>
        )}
        {productDetail?.status === 'publish' && (
          <Box className='product-details'>
            <Box
              className='breadcrumbs-products-container desktop-view row-space-between'
              sx={{
                backgroundColor: customColors.darkBlueEbco,
                padding: '0.5rem 0 0.5rem 3rem',
              }}
            >
              <Box className='breadcrumbs-container row-space-between '>
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

                {!isSearchedProduct &&
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
                          color: customColors.lightGreyEbco,
                          pointerEvents: 'auto',
                          '&:hover': {
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          },
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                {isSearchedProduct && (
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
                        color: customColors.lightGreyEbco,
                        pointerEvents: 'auto',
                        '&:hover': {
                          cursor: 'default',
                        },
                      }}
                    >
                      Search
                    </Typography>
                  </Box>
                )}
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
                      color: customColors.whiteEbco,
                      pointerEvents: 'none',
                      '&:hover': {
                        textDecoration: 'none',
                        cursor: 'default',
                      },
                    }}
                  >
                    {productDetail?.name}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className='product-details-container'>
              <Box className='image-gallery-container desktop-block'>
                <VideoGallery
                  extractVideoUrl={extractVideoUrl}
                  videoId={videoId}
                  videoLink={videoLink}
                  ytLink={ytLink}
                />
                <ImageGallery
                  handleImageGallery={handleImageGallery}
                  productImages={productImages}
                  remainingImages={remainingImages}
                  videoLink={videoLink}
                  ytLink={ytLink}
                />
              </Box>
              <Box className='product-detail-info-container'>
                <Box
                  className='product-title-container row-space-between w-100'
                  sx={{
                    alignItems: 'flex-start',
                  }}
                >
                  {/* <Typography
                    className='product-details-title'
                    sx={{
                      display: 'inline-block !important',
                    }}
                  >
                    {decodeHtml(productName)}
                  </Typography> */}
                   <Typography
                    className='product-details-title'
                    component="h1"
                    variant="h1"
                    sx={{
                      display: 'inline-block !important',
                    }}
                  >
                    {decodeHtml(productName)}
                  </Typography>

                  <Box
                    className='row-space-between'
                    sx={{
                      marginTop: '0.7rem !important',
                    }}
                  >
                    {/* START OF UNUSED CODE FOR CUSTOM CLIPBOARD COPY */}
                    {/* <IconButton>
                    <ShareIcon
                         onClick={() => {
                          console.log("Content Copied")
                          const clipboardContent = `
                    ${decodeHtml(productName)}
                    [Click here to view the product](${window.location.href})
                    ![Product Image](${productDetail.images[0].src})
                          `;
                          console.log('Clipboard Content', clipboardContent);
                          copyTextToClipBoard(
                            `I thought you might be interested in this resources :  ${clipboardContent}`,
                          )
                      }
                    }
                      className='share-icon'
                      sx={{
                        color: customColors.darkBlueEbco,
                        margin: '0 1rem !important',
                        cursor: 'pointer',
                      }}
                    />
                    </IconButton> */}
                    {/* END OF UNUSED CODE FOR CUSTOM CLIPBOARD COPY */}
                    <RWebShare
                      data={{
                        text: `Check out this product: ${decodeHtml(
                          productName,
                        )}`,
                        url: window.location.href,
                        title: decodeHtml(productName),
                      }}
                    >
                      <ShareIcon
                        className='share-icon'
                        sx={{
                          color: customColors.darkBlueEbco,
                          margin: '0 0.5rem',
                          cursor: 'pointer',
                        }}
                      />
                    </RWebShare>
                    {isShopNowProduct(productDetail) && (
                      <>
                        {!isInWishlist ? (
                          <FavoriteBorderIcon
                            className='favorite-icon'
                            sx={{
                              color: customColors.darkBlueEbco,
                              margin: '0 0.5rem',
                              cursor: 'pointer',
                            }}
                            onClick={handleHeartClick}
                          />
                        ) : (
                          <FavoriteIcon
                            className='favorite-icon'
                            sx={{
                              color: customColors.darkBlueEbco,
                              margin: '0 0.5rem',
                              cursor: 'pointer',
                            }}
                            onClick={handleHeartClick}
                          />
                        )}
                      </>
                    )}

                    <>
                      <Tooltip title={'Add in Collection'}>
                        {!isInBookmark ? (
                          <BookmarkBorderOutlinedIcon
                            className='bookmark-icon'
                            sx={{
                              color: customColors.darkBlueEbco,
                              margin: '0 0.5rem',
                              cursor: 'pointer',
                            }}
                            onClick={handleBookmarkClick}
                          />
                        ) : (
                          <BookmarkIcon
                            className='bookmark-icon'
                            sx={{
                              color: customColors.darkBlueEbco,
                              margin: '0 0.5rem',
                              cursor: 'pointer',
                            }}
                            onClick={handleBookmarkClick}
                          />
                        )}
                      </Tooltip>
                    </>
                  </Box>
                </Box>
                <Box className='image-gallery-container mobile-block'>
                  {videoLink.length > 0 && (
                    <Box
                      className='product-video-container'
                      sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: ' 57%',
                        overflow: 'hidden',
                        height: '0',
                        marginBottom: '1rem',
                      }}
                    >
                      <video
                        className='product-video product-image'
                        autoPlay
                        muted
                        loop
                        controlsList='nodownload'
                        style={{
                          width: '100%',
                          height: '100% !important',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          objectFit: 'fill',
                        }}
                      >
                        <source src={videoLink} type='video/mp4' />
                      </video>
                    </Box>
                  )}
                  {ytLink.length > 0 && videoId.length === 0 && (
                    <Box
                      className='product-video-container'
                      sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: ' 57%',
                        overflow: 'hidden',
                        height: '0',
                        marginBottom: '1rem',
                      }}
                    >
                      <iframe
                        width='853'
                        height='480'
                        src={extractVideoUrl(ytLink)}
                        frameBorder='0'
                        allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        title='Embedded youtube'
                        className='product-video product-image'
                        style={{
                          width: '100%',
                          height: '100% !important',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          objectFit: 'fill',
                          border: 'none',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#000',
                          opacity: 0,
                          zIndex: 1,
                        }}
                      ></Box>
                    </Box>
                  )}
                  {videoLink.length === 0 && ytLink.length === 0 ? (
                    <>
                      <Box
                        className={`image-gallery-many ${
                          productImages.length === 1
                            ? `single-image-gallery`
                            : ``
                        }`}
                      >
                        {productImages[0] && (
                          <Box
                            component='img'
                            className='product-image'
                            src={productImages[0].src}
                            alt='Image 2'
                            sx={{ width: '100%', height: 'auto' }}
                            onClick={() => handleImageGallery(0)}
                          />
                        )}
                        {productImages[1] && (
                          <Box
                            component='img'
                            className='product-image'
                            src={productImages[1].src}
                            alt='Image 3'
                            sx={{ width: '100% !important', height: 'auto' }}
                            onClick={() => handleImageGallery(1)}
                          />
                        )}
                        {productImages[2] && (
                          <Box
                            component='img'
                            className='product-image'
                            src={productImages[2].src}
                            alt='Image 4'
                            sx={{ width: '100%', height: 'auto' }}
                            onClick={() => handleImageGallery(2)}
                          />
                        )}
                        {productImages && productImages.length > 4 ? (
                          <Box
                            className='product-image more-images'
                            sx={{
                              width: '100%',
                              height: 'auto',
                              backgroundImage: `url(${
                                productImages[3] && productImages[3]?.src
                              })`,

                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                            onClick={() => handleImageGallery(3)}
                          >
                            <Box className='layer'>
                              <Box className='view-all-container column-center'>
                                <EastIcon className='view-all-icon' />
                                <Typography className='view-all-text'>
                                  View all
                                </Typography>
                              </Box>
                              <Box className='remaining-count'>
                                <Typography className='remaining-text'>
                                  +{remainingImages} more
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ) : productImages && productImages[3] ? (
                          <Box
                            component='img'
                            className='product-image'
                            src={productImages[3]?.src}
                            alt='Image 4'
                            sx={{ width: '100%', height: 'auto' }}
                            onClick={() => handleImageGallery(3)}
                          />
                        ) : (
                          <Box></Box>
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        className={`image-gallery-many ${
                          productImages.length === 1
                            ? `single-image-gallery`
                            : ``
                        }`}
                      >
                        {productImages[0] && (
                          <Box
                            component='img'
                            className='product-image'
                            src={productImages[0].src}
                            alt='Image 2'
                            sx={{ width: '100%', height: 'auto' }}
                            onClick={() => handleImageGallery(0)}
                          />
                        )}
                        {productImages && productImages.length > 2 ? (
                          <Box
                            className='product-image'
                            sx={{
                              width: '100%',
                              height: 'auto',
                              backgroundImage: `url(${
                                productImages[1] && productImages[1]?.src
                              })`,

                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                            onClick={() => handleImageGallery(1)}
                          >
                            <Box className='layer'>
                              <Box className='view-all-container column-center'>
                                <EastIcon className='view-all-icon' />
                                <Typography className='view-all-text'>
                                  View all
                                </Typography>
                              </Box>
                              <Box className='remaining-count'>
                                <Typography className='remaining-text'>
                                  +{remainingImages} more
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ) : productImages && productImages[1] ? (
                          <Box
                            component='img'
                            className='product-image'
                            src={productImages[1]?.src}
                            alt='Image 1'
                            sx={{ width: '100%', height: 'auto' }}
                            onClick={() => handleImageGallery(1)}
                          />
                        ) : (
                          <Box></Box>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
                <Box className='product-description-container desktop-view-column'>
                  {productDetail?.description &&
                    convertHtmltoArray(productDetail?.description).map(
                      (item, i) => {
                        return (
                          <Typography
                            key={i}
                            className='product-description'
                            sx={{
                              color: customColors.greyEbco,
                            }}
                          >
                            {item}
                          </Typography>
                        )
                      },
                    )}
                </Box>
                {(discountedPrice || mrp) &&
                  isShopNowProduct(productDetail) && (
                    <Divider width='100%' color='#A8A8A8' margin='2rem auto' />
                  )}
                {/* {(discountedPrice || mrp) && isShopNowProduct(productDetail) && ( */}
                <Box
                  className='price-container column-space-between'
                  sx={{
                    alignItems: 'flex-start',
                  }}
                >
                  {!discountedPrice &&
                    minPrice &&
                    isShopNowProduct(productDetail) &&
                    !containsScreenReaderText(productDetail.price_html) && (
                      <>
                        <Typography className='revised-price-text'>
                          Price Range{' '}
                        </Typography>
                        <div
                          className='product-price-mrp-html-shop'
                          style={{
                            fontSize: '32px !important',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: productDetail.price_html,
                          }}
                        ></div>
                      </>
                    )}
                  {!discountedPrice &&
                    minPrice &&
                    isShopNowProduct(productDetail) &&
                    containsScreenReaderText(productDetail.price_html) && (
                      <>
                        <Typography className='revised-price-text'>
                          Revised Price{' '}
                          <span className='tax-text'>(Incl. of all taxes)</span>
                        </Typography>
                        <Typography className='price-text'>
                          ₹
                          {(
                            Number(extractSalePrice(productDetail.price_html)) *
                            Number(quantity)
                          ).toFixed(2)}
                        </Typography>

                        <Typography className='og-price-text'>
                          MRP (Incl. of all taxes) :{' '}
                          <span
                            style={{
                              textDecoration: 'line-through',
                            }}
                          >
                            ₹
                            {(
                              Number(
                                extractRegularPrice(productDetail.price_html),
                              ) * Number(quantity)
                            ).toFixed(2)}
                          </span>
                        </Typography>
                      </>
                    )}
                  {discountedPrice && isShopNowProduct(productDetail) && (
                    <Typography className='revised-price-text'>
                      Revised Price{' '}
                      <span className='tax-text'>(Incl. of all taxes)</span>
                    </Typography>
                  )}
                  <Typography className='price-text'>
                    {discountedPrice &&
                      isShopNowProduct(productDetail) &&
                      formatPrice(Number(discountedPrice) * Number(quantity))}
                  </Typography>
                  {mrp && isShopNowProduct(productDetail) && (
                    <Typography className='og-price-text'>
                      MRP (Incl. of all taxes) :{' '}
                      <span
                        style={{
                          textDecoration: 'line-through',
                        }}
                      >
                        {mrp && formatPrice(Number(mrp) * Number(quantity))}
                      </span>
                    </Typography>
                  )}
                </Box>
                {/* )} */}
                {(discountedPrice || mrp) &&
                  isShopNowProduct(productDetail) && (
                    <Divider width='100%' color='#A8A8A8' margin='1.5rem 0' />
                  )}
                {/* <Divider width="100%" color="#5B5B5B" /> */}
                {isShopNowProduct(productDetail) ? (
                  <>
                    <Box
                      className='size-quantity-container column-space-between desktop-view'
                      sx={{
                        alignItems: 'flex-start',
                        marginBottom: '1rem !important',
                      }}
                    >
                      <>
                        {productDetail?.attributes
                          .filter(attribute => attribute.variation)
                          .map(attribute => (
                            <Box
                              key={attribute.id}
                              className='size-container row-space-between w-100'
                            >
                              <Typography className='size-text'>
                                {attribute.name}
                              </Typography>
                              <Box
                                className='custom-select w-100 row-space-between'
                                onClick={() => toggleSelect(attribute.name)}
                                sx={{
                                  borderColor: isVariationError
                                    ? '#FF0000'
                                    : '#C3C3C3',
                                }}
                              >
                                <Box className='row-space-between w-100'>
                                  <Typography className='size-text option-text'>
                                    {selectedOptions[attribute.name] ||
                                      'SELECT OPTION'}
                                  </Typography>
                                  {!isSelectOpen[attribute.name] ? (
                                    <KeyboardArrowDownIcon
                                      sx={{ color: customColors.orangeEbco }}
                                      className='arrow-icon'
                                    />
                                  ) : (
                                    <KeyboardArrowUpIcon
                                      sx={{ color: customColors.orangeEbco }}
                                      className='arrow-icon'
                                    />
                                  )}
                                </Box>
                                {isSelectOpen[attribute.name] && (
                                  <Box className='custom-select-options'>
                                    {attribute.options.map((option, index) => (
                                      <Typography
                                        key={index}
                                        className='custom-select-option'
                                        onClick={() => {
                                          setIsVariationError(false)
                                          setSelectedOptions(prevState => ({
                                            ...prevState,
                                            [attribute.name]: option,
                                          }))
                                        }}
                                      >
                                        {option}
                                      </Typography>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          ))}
                        {isVariationError && (
                          <Typography
                            sx={{
                              color: '#FF0000',
                              fontFamily: 'Uniform Medium !important',
                              fontSize: '12px',
                            }}
                          >
                            *Select All Option(s)
                          </Typography>
                        )}
                      </>
                      <Box
                        className='quantity-container row-space-between w-100'
                        sx={{
                          justifyContent: 'flex-start',
                        }}
                      >
                        <Typography
                          className='size-text quantity-text'
                          sx={{
                            marginRight: '1rem',
                          }}
                        >
                          Quantity
                        </Typography>
                        <Box
                          className='row-space-between w-100 quantity-input'
                          sx={{
                            width: '20% !important',
                          }}
                        >
                          <IconButton
                            aria-label='decrement'
                            disabled={quantity === 1}
                            className='quantity-icon-container'
                            onClick={() => decrementQuantity()}
                          >
                            <RemoveIcon
                              sx={{ color: customColors.orangeEbco }}
                              className='quantity-icon'
                            />
                          </IconButton>
                          <Typography>{quantity}</Typography>
                          <IconButton
                            aria-label='increment'
                            className='quantity-icon-container'
                            onClick={() => incrementQuantity()}
                          >
                            <AddIcon
                              sx={{ color: customColors.orangeEbco }}
                              className='quantity-icon'
                            />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    <Box className='desktop-view'>
                      <Divider width='100%' color='#A8A8A8' />
                    </Box>

                    <Button
                      className='postal-code-btn'
                      onClick={toggleDrawer(true)}
                    >
                      <Image
                        alt='postal-icon'
                        src={'/images/postal-dark.svg'}
                        className='postal-icon'
                        width={16}
                        height={16}
                      />
                      Enter postal code
                    </Button>
                    {!isPostalCodeAvailable &&
                      isPostalCodeChecked &&
                      postalCodeInput?.toString().length === 6 &&
                      !open && (
                        <p className='postal-error' style={inputError}>
                          Sorry, we do not deliver to {postalCodeInput}
                        </p>
                      )}
                    {isPostalCodeAvailable && isPostalCodeChecked && (
                      <p
                        className='postal-available'
                        style={{ ...inputError, color: 'green !important' }}
                      >
                        Delivery Available at {postalCodeInput}
                      </p>
                    )}
                    {postalCodeInput?.toString().length! < 6 && !open && (
                      <p className='postal-error' style={inputError}>
                        Enter a valid postal code
                      </p>
                    )}
                    <Divider width='100%' color='#A8A8A8' />

                    <Box className='button-container row-space-between w-100'>
                      <Button
                        className='buy-now-button orange-button w-50'
                        onClick={() => {
                          handleCheckoutSingleProduct()
                        }}
                        disabled={
                          (!isPostalCodeAvailable && isPostalCodeChecked) ||
                          !isOptionsNotProperlySelected
                        }
                      >
                        Buy Now
                      </Button>
                      <Button
                        className='add-to-cart-button blue-border-button w-50'
                        onClick={() => {
                          addToCart(productDetail!)
                        }}
                        disabled={
                          (!isPostalCodeAvailable && isPostalCodeChecked) ||
                          !isOptionsNotProperlySelected
                        }
                      >
                        {' '}
                        <Image
                          src={'/images/cart.svg'}
                          alt='cart'
                          width={20}
                          height={20}
                          className='cart-icon'
                        />{' '}
                        Add to Cart
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box className='non-shop-buttons'>
                    <Box className='desktop-view'>
                      <Divider width='100%' color='#A8A8A8' />
                    </Box>
                    <Button
                      className='postal-code-btn desktop-view'
                      onClick={() => router.push('/distribution-network')}
                    >
                      <FmdGoodIcon
                        sx={{
                          height: '20px',
                          width: '20px',
                          marginRight: '10px',
                          color: '#092853',
                        }}
                      />
                      Explore this Product Nearby
                    </Button>
                    <Box className='desktop-view'>
                      <Divider width='100%' color='#A8A8A8' />
                    </Box>
                    <Box className='button-container row-space-between w-100'>
                      <Button
                        className='buy-now-button orange-button send-enquiry w-50'
                        sx={{
                          width: '50% !important',
                        }}
                        onClick={() => {
                          handleOpenEnquiryModal()
                        }}
                      >
                        Send Enquiry
                      </Button>
                      <Button
                        className='add-to-cart-button blue-border-button download-brochure-button-hide w-50'
                        onClick={() => {
                          downloadBrochureAndOpen(
                            productDetail.id!,
                            productDetail.name,
                          )
                          // printDiv("content-to-print");
                        }}
                        style={{
                          lineHeight: '1.2 !important',
                        }}
                      >
                        {' '}
                        <Image
                          src={'/images/download-pdf.svg'}
                          alt='cart'
                          width={20}
                          height={20}
                          className='cart-icon'
                        />{' '}
                        Download Brochure
                      </Button>
                    </Box>
                  </Box>
                )}
                {isShopNowProduct(productDetail) && (
                  <Box className='w-100 download-button-container desktop-view row-center'>
                    <Button
                      className='add-to-cart-button blue-border-button download-brochure-button w-50'
                      onClick={() => {
                        // downloadBrochure(productDetail!);
                        downloadBrochureAndOpen(
                          productDetail.id!,
                          productDetail.name,
                        )
                        // printDiv("content-to-print");
                      }}
                      style={{
                        lineHeight: '1.2 !important',
                      }}
                    >
                      {' '}
                      <Image
                        src={'/images/download-pdf.svg'}
                        alt='cart'
                        width={20}
                        height={20}
                        className='cart-icon'
                      />{' '}
                      Download Brochure
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            <Box className='mobile-view-column mobile-info-container'>
              {isShopNowProduct(productDetail) && (
                <Box className='size-quantity-container row-center'>
                  <>
                    {productDetail?.attributes
                      .filter(attribute => attribute.variation)
                      .map(attribute => (
                        <Box
                          key={attribute.id}
                          className='size-container column-center w-50'
                        >
                          <Typography className='size-text'>
                            {attribute.name}
                          </Typography>
                          <Box
                            className='custom-select w-100 row-space-between'
                            onClick={() => toggleSelect(attribute.name)}
                            sx={{
                              borderColor: isVariationError
                                ? '#FF0000'
                                : '#C3C3C3',
                            }}
                          >
                            <Box className='row-space-between w-100'>
                              <Typography className='size-text option-text'>
                                {selectedOptions[attribute.name] ||
                                  'SELECT OPTION'}
                              </Typography>
                              {!isSelectOpen[attribute.name] ? (
                                <KeyboardArrowDownIcon
                                  sx={{ color: customColors.orangeEbco }}
                                  className='arrow-icon'
                                />
                              ) : (
                                <KeyboardArrowUpIcon
                                  sx={{ color: customColors.orangeEbco }}
                                  className='arrow-icon'
                                />
                              )}
                            </Box>
                            {isSelectOpen[attribute.name] && (
                              <Box className='custom-select-options'>
                                {attribute.options.map((option, index) => (
                                  <Typography
                                    key={index}
                                    className='custom-select-option'
                                    onClick={() => {
                                      setSelectedOptions(prevState => ({
                                        ...prevState,
                                        [attribute.name]: option,
                                      }))
                                    }}
                                  >
                                    {option}
                                  </Typography>
                                ))}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                    {isVariationError && (
                      <Typography
                        sx={{
                          color: '#FF0000',
                          fontFamily: 'Uniform Medium !important',
                          fontSize: '12px',
                        }}
                      >
                        *Select All Option(s)
                      </Typography>
                    )}
                  </>
                  <Box className='quantity-container column-cente w-50'>
                    <Typography className='size-text'>Quantity</Typography>
                    <Box className='row-space-between w-100 quantity-input'>
                      <IconButton
                        aria-label='decrement'
                        disabled={quantity === 1}
                        className='quantity-icon-container'
                        onClick={() => decrementQuantity()}
                      >
                        <RemoveIcon
                          sx={{ color: customColors.orangeEbco }}
                          className='quantity-icon'
                        />
                      </IconButton>
                      <Typography>{quantity}</Typography>
                      <IconButton
                        aria-label='increment'
                        className='quantity-icon-container'
                        onClick={() => incrementQuantity()}
                      >
                        <AddIcon
                          sx={{ color: customColors.orangeEbco }}
                          className='quantity-icon'
                        />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              )}
              <Box className='product-description-container mobile-block'>
                {productDetail?.description &&
                  convertHtmltoArray(productDetail?.description).map(
                    (item, i) => {
                      return (
                        <Typography
                          key={i}
                          className='product-description'
                          sx={{
                            color: customColors.greyEbco,
                          }}
                        >
                          {item}
                        </Typography>
                      )
                    },
                  )}
              </Box>
              <Box
                className='w-100 download-button-container column-center'
                gap={2}
              >
                <>
                  <Box className='desktop-view'>
                    <Divider width='100%' color='#A8A8A8' />
                  </Box>
                  <Button
                    className='postal-code-btn'
                    onClick={() => router.push('/distribution-network')}
                  >
                    <FmdGoodIcon
                      sx={{
                        height: '20px',
                        width: '20px',
                        marginRight: '10px',
                        color: '#092853',
                      }}
                    />
                    Explore this Product Nearby
                  </Button>
                  <Box className='desktop-view'>
                    <Divider width='100%' color='#A8A8A8' />
                  </Box>
                </>
                <Button
                  className='add-to-cart-button blue-border-button download-brochure-button w-50'
                  onClick={() => {
                    // downloadBrochure(productDetail!);
                    downloadBrochureAndOpen(
                      productDetail.id!,
                      productDetail.name,
                    )
                    // printDiv("content-to-print");
                  }}
                  style={{
                    lineHeight: '1.2 !important',
                  }}
                >
                  {' '}
                  <Image
                    src={'/images/download-pdf.svg'}
                    alt='cart'
                    width={20}
                    height={20}
                    className='cart-icon'
                  />{' '}
                  Download Brochure
                </Button>
              </Box>
            </Box>
            {meta_data.length > 0 && (
              <SpecificationsTabs
                router={router}
                getTabLabel={getTabLabel}
                handleChange={handleChange}
                meta_data={meta_data}
                productName={productName}
                value={value}
              />
            )}
            <Box className='mobile-view-column specification-container'>
              {meta_data.map((item, index) => (
                <Box
                  className='row-space-between specifications-box-container'
                  onClick={() => {
                    handleSpecification(true)
                    // setOpenModal(true)
                    setMetaData(item)
                  }}
                  sx={{
                    cursor: 'pointer',
                    display:
                      getTabLabel(item.key).toLowerCase().includes('cad') &&
                      showCadTab
                        ? 'flex'
                        : !getTabLabel(item.key).toLowerCase().includes('cad')
                        ? 'flex'
                        : 'none',
                  }}
                  key={item.id}
                >
                  <Typography
                    className='specifications-text'
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {getTabLabel(item.key).toLowerCase().includes('cad') &&
                    showCadTab ? (
                      `${getTabLabel(item.key)
                        .split(' ')[0]
                        .toLocaleUpperCase()} ${
                        getTabLabel(item.key).split(' ')[1]
                      }`
                    ) : !getTabLabel(item.key).toLowerCase().includes('cad') ? (
                      getTabLabel(item.key)
                    ) : (
                      <></>
                    )}
                  </Typography>
                  <Image
                    src={'/images/right.svg'}
                    alt='cart'
                    width={20}
                    height={20}
                    className='specifications-icon'
                  />
                </Box>
              ))}
            </Box>

            <iframe
              id='content-to-print'
              className='w-100'
              style={{
                position: 'relative',
                padding: '0rem',
                height: '1px',
                display: 'none',
              }}
            >
              <div
                className='product-details-container'
                style={{
                  width: '100vw',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <p
                  className='product-details-title'
                  // variant="h1"
                  style={{
                    fontSize: '1.5rem',
                    fontFamily: 'Uniform Bold !important',
                    color: '#092853',
                  }}
                >
                  {productDetail?.name}
                </p>{' '}
                <div
                  className='product-details-logo'
                  style={{
                    padding: '0 1rem',
                  }}
                >
                  <img
                    src={`/images/banner/${
                      getCategoryByName(productDetail.categories)?.name
                    }-logo.png`}
                    style={{
                      width: '200px',
                      height: 'auto',
                    }}
                  />{' '}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: productDetail?.description,
                  }}
                  className='custom-panel-description'
                ></div>
                {productImages[0]?.src && (
                  <div className='product-Images-pdf'>
                    <Image
                      src={productImages[0]?.src}
                      alt='cart'
                      width={200}
                      height={200}
                      style={{
                        margin: '0.5rem',
                      }}
                    />
                  </div>
                )}
              </div>

              <br />
              {download_meta_data.map((item, index) => (
                <>
                  <p
                    className='custom-panel-title'
                    style={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {getTabLabel(item.key)}
                  </p>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.value }}
                    className='custom-panel-content'
                  />
                </>
              ))}
            </iframe>
            <Box className='buyers-also-viewed-container row-space-between'>
              <Image
                src='/images/abstract.svg'
                alt='cart'
                width={300}
                height={300}
                className='buyers-also-viewed-image'
              />
              <Box
                className='buyers-also-viewed-text-container column-center w-25'
                sx={{
                  alignItems: 'flex-start',
                }}
              >
                <Typography className='buyers-text'>Related</Typography>
                <Typography className='also-viewed-text'>Products</Typography>
              </Box>
              {relatedProducts.length > 0 && (
                <Box
                  className='similar-products-container row-space-between'
                  sx={{}}
                >
                  <MyBuyersAlsoViewed relatedProducts={relatedProducts} />
                </Box>
              )}
            </Box>

            <Drawer open={open} anchor='right' onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>

            <Drawer
              sx={{
                width: '100vw',
                '& .MuiDrawer-paper': {
                  width: '100vw',
                  height: '100vh', // Ensures the Drawer takes up the full height
                  boxSizing: 'border-box',
                },
              }}
              open={isSpecificationOpen}
              anchor='right'
              onClose={() => handleSpecification(false)}
              // disableEnforceFocus
            >
              {productDetail && getSpecifications(productDetail)}
            </Drawer>
            <Drawer
              open={isFittingInstructionsOpen}
              anchor='bottom'
              onClose={() => handleFitting(false)}
            >
              {productDetail && getFittingInstructions(productDetail)}
            </Drawer>
            <Drawer
              open={isWarrantyOpen}
              anchor='right'
              onClose={() => handleWarranty(false)}
            >
              {productDetail && getWarrantyReturns(productDetail)}
            </Drawer>
            <Modal
              open={openSliderModal}
              onClose={handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={style} className='Gallery-modal'>
                <Box
                  className='swiper-container gallery-container'
                  sx={{
                    width: '100%',
                  }}
                >
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    initialSlide={initialSlideGallery}
                    loop={true}
                    slideToClickedSlide={true}
                    navigation={{
                      nextEl: '.arrow-right-gallery',
                      prevEl: '.arrow-left-gallery',
                    }}
                    modules={[Navigation]}
                    className='image-gallery-swiper'
                  >
                    {productImages.map((item, i) => {
                      return (
                        <SwiperSlide key={item.id}>
                          <Box className='row-center product-image-gallery-container'>
                            <Box
                              component='img'
                              className='product-image-slider'
                              src={item.src}
                              alt={item.name}
                              // onContextMenu={preventSaveImage}
                            />
                          </Box>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                  <Typography
                    className='close-gallery-modal'
                    onClick={() => handleClose()}
                  >
                    {' '}
                    Close{' '}
                  </Typography>
                  <Box
                    className='row-space-between w-100 custom-arrows custom-swiper-arrows'
                    sx={{
                      padding: '0 2rem',
                      zIndex: '1',
                      position: 'absolute',
                    }}
                  >
                    <button
                      className='arrow-left-gallery arrow'
                      style={{
                        borderColor: 'white',
                      }}
                    >
                      <Image
                        src='/images/left-white.svg'
                        alt='Previous icon'
                        width={24}
                        height={18}
                      />
                    </button>
                    <button
                      className='arrow-right-gallery arrow'
                      style={{
                        borderColor: 'white',
                      }}
                    >
                      <Image
                        src='/images/right-white.svg'
                        alt='Next icon'
                        width={24}
                        height={18}
                      />
                    </button>
                  </Box>
                </Box>
              </Box>
            </Modal>
            <Modal
              open={openEnquiryModal}
              onClose={handleCloseEnquiryModal}
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
                className='column-center enquiry-modal'
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
                  onClick={handleCloseEnquiryModal}
                />
                <Image
                  src={'/images/darkLogoEbco.png'}
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
                  Send Enquiry
                </Typography>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='row-space-between w-100'
                  style={{
                    flexWrap: 'wrap',
                  }}
                >
                  <Box
                    className='input-section-query column-space-between w-50'
                    sx={{
                      alignItems: 'flex-start',
                      margin: '0 !important',
                    }}
                  >
                    <select
                      id='discoveryCenter'
                      className='querySelect'
                      {...register('whoAmI', {
                        required: 'Please select ',
                      })}
                      value={selectedEnquiry}
                      onChange={e => {
                        handleWhoAmI(e.target.value)
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
                      <option value='Who Am I' disabled selected>
                        Who Am I ?
                      </option>

                      {/* Options */}
                      {enquiryOPtions.map((option, index) => {
                        return (
                          <option key={index} value={option}>
                            {decodeHtml(option)}
                          </option>
                        )
                      })}
                    </select>
                    {enquiryError.length > 0 && (
                      <p role='alert' style={inputError}>
                        {enquiryError}
                      </p>
                    )}
                    {errors.whoAmI?.type === 'required' && (
                      <p role='alert' style={inputError}>
                        Select who am I
                      </p>
                    )}
                  </Box>
                  <Box className='row-space-between input-row w-50'>
                    <Box
                      className='input-section column-space-between w-100'
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
                            (value && value.trim().length > 0) ||
                            'Enter full name',
                        })}
                      />

                      {errors.fullname?.type === 'required' && (
                        <p role='alert' style={inputError}>
                          Full name is required
                        </p>
                      )}
                    </Box>
                  </Box>

                  <Box className='row-space-between input-row w-50'>
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
                        placeholder='Enter email'
                        style={{
                          color: customColors.lightGreyEbco,
                          border: `1px solid ${customColors.selectBox}`,
                        }}
                        {...register('email', {
                          required: true,
                          validate: value =>
                            (value && value.trim().length > 0) ||
                            'Enter full name',
                        })}
                      />

                      {errors.email?.type === 'required' && (
                        <p role='alert' style={inputError}>
                          Full name is required
                        </p>
                      )}
                    </Box>
                  </Box>
                  <Box className='row-space-between input-row w-50'>
                    <Box
                      className='input-section column-space-between'
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
                    </Box>
                  </Box>
                  <Box className='row-space-between input-row w-100'>
                    <Box
                      className='input-section column-space-between w-100'
                      sx={{
                        alignItems: 'flex-start',
                      }}
                    >
                      <input
                        id='name'
                        type='text'
                        className='contact-us-input'
                        placeholder='Company Name'
                        style={{
                          color: customColors.lightGreyEbco,
                          border: `1px solid ${customColors.selectBox}`,
                        }}
                        {...register('companyName', {
                          required: true,
                          validate: value =>
                            (value && value.trim().length > 0) ||
                            'Enter full name',
                        })}
                      />

                      {errors.companyName?.type === 'required' && (
                        <p role='alert' style={inputError}>
                          Company name is required
                        </p>
                      )}
                    </Box>
                  </Box>
                  <Box className='row-space-between input-row w-100'>
                    <Box
                      className='input-section column-space-between w-100'
                      sx={{
                        alignItems: 'flex-start',
                      }}
                    >
                      <input
                        id='name'
                        type='text'
                        className='contact-us-input'
                        placeholder='Address with pincode'
                        style={{
                          color: customColors.lightGreyEbco,
                          border: `1px solid ${customColors.selectBox}`,
                        }}
                        {...register('address', {
                          required: true,
                          validate: value =>
                            (value && value.trim().length > 0) ||
                            'Enter Address',
                        })}
                      />

                      {errors.address?.type === 'required' && (
                        <p role='alert' style={inputError}>
                          Address is required
                        </p>
                      )}
                    </Box>
                  </Box>
                  <Box className='row-space-between input-row w-100'>
                    <Box
                      className='input-section column-space-between w-100'
                      sx={{
                        alignItems: 'flex-start',
                      }}
                    >
                      <input
                        id='name'
                        type='text'
                        className='contact-us-input'
                        placeholder='Requirements'
                        style={{
                          color: customColors.lightGreyEbco,
                          border: `1px solid ${customColors.selectBox}`,
                        }}
                        {...register('requirement', {
                          required: true,
                          validate: value =>
                            (value && value.trim().length > 0) ||
                            'Enter Requirements',
                        })}
                      />

                      {errors.requirement?.type === 'required' && (
                        <p role='alert' style={inputError}>
                          Requirements is required
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
                    style={{ ...orangeEbcoButton, marginTop: '2rem' }}
                  >
                    Submit
                  </button>
                </form>
              </Box>
            </Modal>
          </Box>
        )}

        {!isLoading &&
          (!productDetail || productDetail?.status === 'draft') && (
            <Box
              sx={{
                minHeight: '80vh',
                justifyContent: 'flex-start !important',
              }}
              className='column-center'
            >
              <Typography
                sx={{
                  color: customColors.darkBlueEbco,
                  fontFamily: 'Uniform Bold',
                  fontSize: '32px',
                  lineHeight: '40px',
                  textAlign: 'center',
                  marginTop: '2rem',
                }}
              >
                No Product Found.
              </Typography>
              <Button
                variant='contained'
                onClick={() => router.back()}
                sx={{
                  marginTop: '1rem',
                  color: customColors.whiteEbco,
                }}
              >
                Go Back
              </Button>
            </Box>
          )}
      </Box>
      <ToastContainer />
    </>
  )
}

export default ProductDetailsPage
