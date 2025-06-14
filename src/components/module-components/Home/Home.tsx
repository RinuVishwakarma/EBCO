'use client'
import React, { useEffect, useState, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  FormControlLabel,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Image from 'next/image'
import './Home.css'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import {
  useLightTextHeading,
  useLightTextSubHeading,
  useBoldTextSubHeading,
  useBoldTextHeading,
} from '@/utils/CommonStyling'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useAppSelector } from '@/store/reduxHooks'
import dynamic from 'next/dynamic'
import { apiClient } from '@/apiClient/apiService'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { ebcoApiData } from '@/utils/ebcoApiData'
import { BannerCarousel, WordPressPage } from '@/interface/PageLink'
import Head from 'next/head'
import Switch from '@mui/material/Switch'
import SmartSolutionCard, { featuredPages } from '@/utils/SmartSolution'

const label = { inputProps: { 'aria-label': 'Size switch demo' } }
// Dynamic Imports
const MyProductRangeCarousal = dynamic(
  () => import('@/components/utils-components/MyProductRangeCarousal'),
)
const MyNewArrivalCarousal = dynamic(
  () => import('@/components/utils-components/MyNewArrivalCarousal'),
)
const MyDiscoveryCenterCarousal = dynamic(
  () => import('@/components/utils-components/MyDiscoveryCenterCarousal'),
)
const MyNewsEvenetsCarousal = dynamic(
  () => import('@/components/utils-components/MyNewsAndEventsCarousal'),
)
const MyShopNowCarousal = dynamic(
  () => import('@/components/utils-components/MyShopNowCarousal'),
)
const MyDiscoveryCenterInternational = dynamic(
  () => import('@/components/utils-components/MyDiscoveryCenterInternational'),
)

// Data Imports
import { Arrivals } from '@/interface/newArrivals'
import { SmartSolutions } from '@/interface/smartSolutions'
import { ShopNow } from '@/interface/shopNow'
import { NewsEvent } from '@/interface/newsAndEvents'
import { DiscoveryCenter } from '@/interface/discoveryCenter'
import { ProductDetails } from '@/interface/productDetails'
import { getCategoryByName } from '@/utils/getCategoryByName'
import { DiscoveryCenterIndia } from '@/interface/discoveryCenterIndia'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import getTransition from '@/utils/transitionDelay'
import ErrorBoundaryWrapper from '@/components/utils-components/ErrorBoundaryWrapper'
import HomeVideoCarousal from '@/components/utils-components/HomeVideoCarousal'
import AdModal from '@/components/utils-components/AdModal'
import { isIOSorSafari } from '@/utils/checkIOS'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

const fetchNewArrivalData = async (): Promise<Arrivals[]> => {
  try {
    const response = await apiClient.get<ProductDetails[]>(
      ` ${API_ENDPOINT.GET.get_prod_products}?tag=${ebcoApiData.NEW_ARRIVAL_CODE}`,
    )
    // console.log(response, "new arrival data");
    if (!response) {
      throw new Error('No data found')
    }

    return response.data.map((item: any) => ({
      ...item,
      image: item.images.length > 0 ? item.images[0].src : '',
      Image2: item.images.length > 1 ? item.images[1].src : item.images[0].src,
    }))
  } catch (error) {
    console.error('Failed to fetch new arrival data', error)
    return [] // Return an empty array if an error occurs
  }
}
const fetchNewsEventsData = async (): Promise<NewsEvent[]> => {
  try {
    const response = await apiClient.get<NewsEvent[]>(
      `${API_ENDPOINT.GET.getNewsEvents}?per_page=5&page=1&news-event-category=753&status=publish&acf_format=standard`,
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
const fetchShopNowData = async (): Promise<ShopNow[]> => {
  try {
    const response = await apiClient.get<ShopNow[]>(
      ` ${API_ENDPOINT.GET.get_prod_products}?tag=${ebcoApiData.SHOP_NOW_CODE}`,
    )
    // console.log(response, "new arrival data");
    if (!response) {
      throw new Error('No data found')
    }

    return response.data.map((item: any) => {
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
const fetchsmartSolutionsData = async (): Promise<SmartSolutions[]> => {
  try {
    const response = await apiClient.get<ProductDetails[]>(
      ` ${API_ENDPOINT.GET.get_products}?tag=${ebcoApiData.SMART_SOLUTIONS_CODE}`,
    )
    // console.log(response, "new arrival data");
    if (!response) {
      throw new Error('No data found')
    }

    return response.data.map((item: ProductDetails) => ({
      id: item.id,
      image: item.images,
      title: item.name,
      price: item.regular_price,
      discountedPrice: item.sale_price,
      categories: item.categories,
      has_options: item.has_options,
      priceHtml: item.price_html,
      slug: item.slug,
    }))
  } catch (error) {
    console.error('Failed to fetch new arrival data', error)
    return [] // Return an empty array if an error occurs
  }
}

const fetchDiscoveryCenterIndiaData = async (): Promise<
  DiscoveryCenterIndia[]
> => {
  try {
    const response = await apiClient.get<DiscoveryCenterIndia[]>(
      ` ${API_ENDPOINT.GET.getDiscoveryCenter}?discovery-center-category=${ebcoApiData.DISCOVERY_CENTER_INDIA_HOME}&page=1&per_page=100`,
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

const fetchDiscoveryCenterIndiaDataLocation = async (): Promise<
  DiscoveryCenterIndia[]
> => {
  try {
    const response = await apiClient.get<DiscoveryCenterIndia[]>(
      ` ${API_ENDPOINT.GET.getDiscoveryCenter}?discovery-center-category=${ebcoApiData.DISCOVERY_CENTER_INDIA}&page=1&per_page=100`,
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
const fetchDiscoveryCenterInternationalData = async (): Promise<
  DiscoveryCenter[]
> => {
  try {
    const response = await apiClient.get<DiscoveryCenter[]>(
      ` ${API_ENDPOINT.GET.getDiscoveryCenter}?discovery-center-category=${ebcoApiData.DISCOVERY_CENTER_INTERNATIONAL}&page=1&per_page=7`,
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

const fetchHomePageData = async (): Promise<WordPressPage | {}> => {
  try {
    const response = await apiClient.get<WordPressPage>(
      `${API_ENDPOINT.GET.get_page}/${ebcoApiData.HOME_PAGE_CODE}?acf_format=standard`,
    )

    if (!response || !response.data) {
      throw new Error('No data found')
    }

    const { acf } = response.data

    if (!acf || !acf.carousel || !acf.banner_video) {
      throw new Error('Incomplete ACF data')
    }
    return response.data
  } catch (error: any) {
    const { message } = error.response?.data ?? error

    toast.error(message)

    console.error('Failed to fetch new arrival data:', error)
    return {} // Return an empty object if an error occurs
  }
}
const Home: React.FC = () => {
  const [bannerCarousal, setBannerCarousal] = useState<BannerCarousel[]>([])
  const words = ['CLASS', 'PRECISION', 'PERFECTION', 'PASSION']
  const lightTextHeadingStyle = useLightTextHeading()
  const lightTextSubHeadingStyle = useLightTextSubHeading()
  const boldTextHeadingStyle = useBoldTextHeading()
  const boldTextSubHeadingStyle = useBoldTextSubHeading()
  const [discoveryCenterData, setDiscoveryCenterData] = useState<
    DiscoveryCenterIndia[]
  >([])
  const isSearchOpen = useAppSelector(state => state.drawer)?.isOpen
  const isMediumScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('md'),
  )
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [selectedDiscoveryCenter, setSelectedDiscoveryCenter] = useState<
    'India' | 'International'
  >('India')
  const router = useRouter()

  const [currentIndex1, setCurrentIndex1] = useState(0)
  const [popupContent, setPopupContent] = useState('')
  const [popupContentMobile, setPopupContentMobile] = useState('')
  const [ocassionGif, setOccasionGif] = useState<string>('')
  const [showAd, setShowAd] = useState(false)
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)
  const [showFestive, setShowFestive] = useState(false)
  const [homePageApiData, setHomePageApiData] = useState<WordPressPage | null>(
    null,
  )

  useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 450) // e.g., 768 for tablet
    }

    // Check on initial load
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleToggleLocation = () => {
    const newStatus = !isLocationEnabled
    setIsLocationEnabled(newStatus)
    localStorage.setItem('locationPermission', JSON.stringify(newStatus))
    const fetchData = async () => {
      if (newStatus) {
        checkLocationPermission()
        // console.log(permissionStatus, "permission prompt");
      } else {
        // console.log("I AM CULPRIT")
        setDiscoveryCenterData([])
        getDiscoveryCenterData()
      }
    }
    if (typeof window !== 'undefined') {
      fetchData()
    }
  }
  const newArrivalQuery = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchNewArrivalData,
  })

  const shopNowQuery = useQuery({
    queryKey: ['shop-now'],
    queryFn: fetchShopNowData,
  })

  const smartSolutionsQuery = useQuery({
    queryKey: ['smart-solutions'],
    queryFn: fetchsmartSolutionsData,
  })

  const handleSmartSolution = (item: SmartSolutions) => {
    const category = getCategoryByName(item.categories)
    const name = encodeURIComponent(item.title).replace(/%20/g, '_')
    let url = `/${category?.name.toLowerCase()}/${item.slug}`
    return url
  }
  useEffect(() => {
    if (discoveryCenterData.length > 0 && typeof window !== 'undefined') {
      if (isLocationEnabled) {
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
          const sorted = discoveryCenterData
            .map(location => ({
              ...location,
              distance: calculateDistance(
                latitude,
                longitude,
                location.acf.latitude,
                location.acf.longitude,
              ),
            }))
            .sort((a, b) => a.distance - b.distance)
          // return;
          setDiscoveryCenterData(sorted.slice(0, 6))
        })
      }
    } else if (discoveryCenterData.length > 0) {
      setDiscoveryCenterData(discoveryCenterData.slice(0, 6))
    }
  }, [discoveryCenterData, isLocationEnabled])
  useEffect(() => {
    setShowFestive(true)
    const timer = setTimeout(() => {
      setShowFestive(false) // Hide festive background after 2 seconds
    }, 20000)

    return () => clearTimeout(timer) // Cleanup timer on component unmount
  }, [])
  const homePageQuery = useQuery({
    queryKey: ['home-page'],
    queryFn: fetchHomePageData,
  })
  const isWordPressPage = (data: any): data is WordPressPage => {
    return data && typeof data === 'object' && 'acf' in data
  }

  const fetchInitialData = async () => {
    const dataHome = await homePageQuery.refetch()

    if (dataHome && isWordPressPage(dataHome.data)) {
      //console.log("Successsssss", dataHome.data.acf.banner_carousel)

      setHomePageApiData(dataHome.data)
      setBannerCarousal(dataHome.data.acf.banner_carousel)
      setPopupContent(dataHome.data.acf.popup_content)
      setPopupContentMobile(dataHome.data.acf.popup_content_mobile)
    }
  }

  useEffect(() => {
    homePageApiData &&
      setOccasionGif(
        isSmallScreen
          ? homePageApiData.acf.ocassional_gif_mobile
          : homePageApiData.acf.ocassional_gif,
      )
  }, [isSmallScreen, homePageApiData])

  const NewsEventsQuery = useQuery({
    queryKey: ['news-events'],
    queryFn: fetchNewsEventsData,
  })
  const DiscoveryCenterIndiaQuery = useQuery({
    queryKey: ['discovery-center-india'],
    queryFn: fetchDiscoveryCenterIndiaData,
  })
  const DiscoveryCenterIndiaQueryLocation = useQuery({
    queryKey: ['discovery-center-india-location'],
    queryFn: fetchDiscoveryCenterIndiaDataLocation,
  })
  const DiscoveryCenterInternationalQuery = useQuery({
    queryKey: ['discovery-center-international'],
    queryFn: fetchDiscoveryCenterInternationalData,
  })
  useEffect(() => {
    newArrivalQuery.refetch()
    smartSolutionsQuery.refetch()
    shopNowQuery.refetch()

    const fetchData = async () => {
      const permissionStatus = await navigator.permissions.query({
        name: 'geolocation',
      })
      if (
        permissionStatus.state === 'granted' ||
        permissionStatus.state === 'prompt'
      ) {
        checkLocationPermission()
      } else {
        setDiscoveryCenterData([])
        getDiscoveryCenterData()
      }
    }
    if (isIOSorSafari()) {
      setDiscoveryCenterData([])
      getDiscoveryCenterData()
    } else {
      setDiscoveryCenterData([])
      fetchData()
    }
    const storedBannerVersion = localStorage.getItem('bannerVersion')
    if (storedBannerVersion !== BANNER_VERSION) {
      setShowAd(true)
      localStorage.setItem('bannerVersion', BANNER_VERSION)
    }

    fetchInitialData()
    const storedStatus = localStorage.getItem('locationPermission')
    if (storedStatus === 'true') {
      setIsLocationEnabled(true)
    }
    const interval = setInterval(() => {
      //console.log("called interval")
      setCurrentIndex1(prevIndex => (prevIndex + 1) % words.length)
    }, 2000) // Adjust the delay as needed

    return () => clearInterval(interval)
  }, [])

  const BANNER_VERSION = '1.3'

  const handleClose = () => {
    setShowAd(false)
  }

  async function checkLocationPermission() {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: 'geolocation',
      })

      // Function to handle permission changes
      const handlePermissionChange = async () => {
        if (permissionStatus.state === 'granted') {
          localStorage.setItem('locationPermission', 'true')
          setDiscoveryCenterData([]) // Clear the state
          await getDiscoveryCenterDataLocation() // Fetch new data
        } else {
          localStorage.setItem('locationPermission', 'false')
          setDiscoveryCenterData([]) // Clear the state
          await getDiscoveryCenterData() // Fetch new data
        }
      }

      // Initial permission check
      await handlePermissionChange()

      // Listen for changes to the permission state
      permissionStatus.onchange = handlePermissionChange
    } catch (error) {
      console.error('Error checking location permission:', error)
    }
  }

  const getDiscoveryCenterData = async () => {
    const discoveryData = await DiscoveryCenterIndiaQuery.refetch()
    setDiscoveryCenterData(discoveryData.data!.slice(0, 7))
  }
  const getDiscoveryCenterDataLocation = async () => {
    setDiscoveryCenterData([])
    const discoveryData = await DiscoveryCenterIndiaQueryLocation.refetch()
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      //console.log(latitude, longitude)
      const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
      ) => {
        const toRadians = (degree: number) => (degree * Math.PI) / 180
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

      const sorted = discoveryData
        .data!.map(location => ({
          ...location,
          distance: calculateDistance(
            latitude,
            longitude,
            Number(location?.acf.latitude),
            Number(location?.acf.longitude),
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
      setDiscoveryCenterData([])
      setDiscoveryCenterData(sorted)
    })
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
      <ErrorBoundaryWrapper>
        <Box className='home-page'>
          {showFestive && ocassionGif && (
            <Box
              className='festive-background'
              sx={{ backgroundImage: `url(${ocassionGif})` }}
            ></Box>
          )}
          {homePageQuery.data && (
            <AdModal
              show={showAd}
              onClose={handleClose}
              popupContent={popupContent}
              popupContentMobile={popupContentMobile}
            />
          )}

          {isSearchOpen && <Box className='blur-section'></Box>}
          {bannerCarousal.length > 0 && (
            <HomeVideoCarousal bannerCarousal={bannerCarousal} />
          )}
          {bannerCarousal.length === 0 && (
            <Skeleton
              className='hero-video-skeleton'
              variant='rectangular'
              width={'100%'}
              height={'100%'}
              animation='wave'
              sx={{ bgcolor: 'grey.300' }}
            />
          )}
          {/* Blinking Text */}
          <Box className='banner-tag row-center'>
            <Typography style={lightTextHeadingStyle}>
              WHERE ENGINEERING MEETS
            </Typography>

            <Box
              className='fade-container'
              sx={{
                height: isMediumScreen ? '36px' : '60px',
              }}
            >
              {words.map((word, idx) => (
                <span
                  key={idx}
                  className={`fade ${currentIndex1 === idx ? 'show' : ''}`}
                  style={{
                    ...boldTextHeadingStyle,
                    opacity: currentIndex1 === idx ? 1 : 0,
                  }}
                >
                  {word}
                </span>
              ))}
            </Box>
          </Box>
          {/* Product Range */}
          <Box className='product-range-new-arrivals'>
            <Box className='product-range' sx={{ minHeight: '300px' }}>
              <Typography
                className='product-range-text'
                style={lightTextSubHeadingStyle}
              >
                <span className='desktop-text'>EXPLORE OUR </span>
                <span style={boldTextSubHeadingStyle}>PRODUCT RANGE</span>{' '}
              </Typography>
              <MyProductRangeCarousal />
            </Box>
            <Box
              className='new-arrivals carousal-container'
              sx={{ minHeight: '500px' }}
            >
              <Typography
                className='product-range-text new-arrival-text'
                style={{
                  ...lightTextSubHeadingStyle,
                  marginLeft: '0rem !important',
                }}
              >
                <span style={boldTextSubHeadingStyle} className=''>
                  {' '}
                  DISCOVER{' '}
                </span>
                <span style={boldTextSubHeadingStyle}>NEW</span>{' '}
              </Typography>
              {!newArrivalQuery.data ? (
                <div
                  className='new-arrival-loader'
                  style={{
                    // height: '80vh',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                ></div>
              ) : (
                <MyNewArrivalCarousal newArrivals={newArrivalQuery.data} />
              )}
            </Box>
          </Box>
          {/* Shop Now */}
          <Box
            className='shop-now column-space-around bg-center'
            sx={
              {
                // minHeight: '800px'
              }
            }
          >
            <motion.div
              initial='hidden'
              whileInView='visible'
              transition={{
                duration: getTransition(1, 0.2),
                ease: 'easeInOut',
              }}
              variants={{
                visible: { opacity: 1, transform: 'translateY(0px)' },
                hidden: { opacity: 0, transform: 'translateY(100px)' },
              }}
              style={{
                alignSelf: 'flex-start',
              }}
            >
              <Box
                className='shop-now-title'
                sx={{ padding: '3rem 2rem', paddingBottom: '0rem !important' }}
              >
                <Typography
                  sx={{ fontFamily: 'Uniform Bold !important' }}
                  className='shop_now_title'
                >
                  SHOP
                </Typography>
                <Typography
                  sx={{ fontFamily: 'Uniform Light !important' }}
                  className='shop_now_title'
                >
                  NOW{' '}
                </Typography>
              </Box>
              <Typography
                className='shop_now_description'
                sx={{
                  padding: '0rem 0rem 3rem 1rem',
                  fontFamily: 'Uniform Light !important',
                  color: customColors.whiteEbco,
                  fontSize: '1.9rem',
                }}
              >
                Buy Selected Products Online
              </Typography>
            </motion.div>
            {!shopNowQuery.data ? (
              <div
                className='shop-now-loader'
                style={{
                  height: '80vh',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              ></div>
            ) : (
              <MyShopNowCarousal shopNowData={shopNowQuery.data} />
            )}

            <Box className='view-all-button-container'>
              <Box
                className='view-all'
                sx={{
                  color: customColors.whiteEbco,
                  borderColor: customColors.whiteEbco,
                }}
                onClick={() => {
                  router.push('/shop-now')
                }}
              >
                View All
              </Box>
            </Box>
          </Box>
          {/* Smart Solutions */}
          <Box className='smart-solutions row-space-between'>
            <Box className='smart-solutions-title' sx={{ padding: '1rem' }}>
              <Image
                src='/images/vector.webp'
                alt='background vector'
                width={300}
                height={300}
                className='background-vector'
              />
              <motion.div
                initial='hidden'
                whileInView='visible'
                transition={{
                  duration: getTransition(1, 0.2),
                  ease: 'easeInOut',
                }}
                variants={{
                  visible: { opacity: 1, transform: 'translateX(0px)' },
                  hidden: { opacity: 0.5, transform: 'translateX(-20px)' },
                }}
              >
                <Typography
                  className='smart_solution_title'
                  style={{
                    ...boldTextHeadingStyle,
                    color: customColors.whiteEbco,
                  }}
                >
                  FEATURED
                </Typography>
              </motion.div>
            </Box>
            <Box className='smart-solutions-products row-space-around'>
              {featuredPages.map((item, i) => (
                <SmartSolutionCard
                  item={item}
                  i={i}
                  key={i}
                />
              ))}
            </Box>
          </Box>
          {/* Discovery Center */}
          <Box className='discovery-center'>
            <Box className='discovery-center-banner row-center w-100'>
              <Box
                className='discovery-center-image row-center bg-center'
                sx={{
                  height: '60vh',
                  backgroundImage: "url('/images/discovery_center/bg.webp')",
                }}
              ></Box>
              <Box
                className='discovery-center-tabsection column-center'
                sx={{
                  background: customColors.skyBlueEbco,
                  height: '60vh',
                }}
              >
                <Box className='toggle-container'>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    transition={{
                      duration: getTransition(1, 0.2),
                      ease: 'easeInOut',
                    }}
                    variants={{
                      visible: { opacity: 1, transform: 'translateY(0px)' },
                      hidden: { opacity: 0, transform: 'translateY(20px)' },
                    }}
                    className=''
                  >
                    <Typography
                      sx={{
                        color: customColors.darkBlueEbco,
                        fontFamily: 'Uniform Bold',
                        marginBottom: '0rem !important',
                      }}
                      className='discovery-center-title'
                    >
                      DISCOVERY CENTERS
                    </Typography>
                    <Typography
                      sx={{
                        color: customColors.darkBlueEbco,
                        fontFamily: 'Uniform Medium !important',
                        fontSize: '1.1rem !important',
                      }}
                      className='discovery-center-title'
                    >
                      Visit Experience Centers Near You
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    transition={{
                      duration: getTransition(1, 0.2),
                      ease: 'easeInOut',
                    }}
                    variants={{
                      visible: { opacity: 1, transform: 'translateY(0px)' },
                      hidden: { opacity: 0, transform: 'translateY(20px)' },
                    }}
                    className='discovery-tab-home  row-space-around '
                    style={{
                      borderColor: customColors.lightGreyEbco,
                    }}
                  >
                    <span
                      className={`tab-btn ${
                        selectedDiscoveryCenter === 'India' ? 'active-tab' : ''
                      }`}
                      onClick={() => setSelectedDiscoveryCenter('India')}
                    >
                      India
                    </span>
                    <span
                      className={`tab-btn ${
                        selectedDiscoveryCenter === 'International'
                          ? 'active-tab'
                          : ''
                      }`}
                      onClick={() =>
                        setSelectedDiscoveryCenter('International')
                      }
                    >
                      International
                    </span>
                  </motion.div>
                  {!isIOSorSafari() && (
                    <FormControlLabel
                      sx={{
                        marginTop: '1rem',
                        fontSize: '1rem',
                        color: customColors.darkBlueEbco,
                        fontFamily: 'Uniform Medium !important',
                      }}
                      control={
                        <Switch
                          {...label}
                          checked={isLocationEnabled}
                          onChange={handleToggleLocation}
                        />
                      }
                      label=' Find your nearest discovery center'
                    />
                  )}
                </Box>
              </Box>
            </Box>
            <Box
              className='discovery-centers'
              sx={{
                padding: '2rem 1rem',
                background: customColors.skyBlueEbco,
                minHeight: '600px !important',
              }}
            >
              {selectedDiscoveryCenter === 'India' ? (
                discoveryCenterData.length === 0 ? (
                  <div
                    className='new-arrival-loader'
                    style={{
                      // height: '80vh',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  ></div>
                ) : (
                  <MyDiscoveryCenterCarousal
                    discoveryCenter={discoveryCenterData.slice(0, 6)}
                  />
                )
              ) : !DiscoveryCenterInternationalQuery.data ? (
                <div
                  className='new-arrival-loader'
                  style={{
                    // height: '80vh',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                ></div>
              ) : (
                <MyDiscoveryCenterInternational
                  discoveryCenter={DiscoveryCenterInternationalQuery.data}
                />
              )}
            </Box>
          </Box>
          {/* News and Events */}
          <Box className='news_and_event'>
            <Typography
              sx={{
                fontSize: '28px',
                fontFamily: 'Uniform Bold',
                color: customColors.darkBlueEbco,
              }}
              className='news-events-title'
            >
              NEWS AND EVENTS
            </Typography>
            {!NewsEventsQuery.data ? (
              <div
                className='new-arrival-loader'
                style={{
                  height: '80vh',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '550px',
                }}
              ></div>
            ) : (
              <MyNewsEvenetsCarousal newsEvents={NewsEventsQuery.data} />
            )}
          </Box>
          <style jsx global>{`
            #zsiq_float {
              bottom: 80px !important; /* Adjust according to your button's position */
              left: 20px !important; /* Adjust according to your button's position */
            }
            .zsiq-newtheme.siq_lft {
              left: 5px !important;
            }
            #zsalesiq {
              display: none !important;
            }
          `}</style>
        </Box>
      </ErrorBoundaryWrapper>
    </>
  )
}

export default Home
