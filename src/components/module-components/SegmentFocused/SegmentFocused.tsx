import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { apiClient } from '@/apiClient/apiService'
import SegmentVideoCarousal from '@/components/utils-components/SegmentVideoCarousal'
import { BannerCarousel, WordPressPage } from '@/interface/PageLink'
import { ebcoApiData } from '@/utils/ebcoApiData'
import {
  Box,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'
import './SegmentFocused.css'
import '../../utils-components/ProductRange.css'
import { Arrivals } from '@/interface/manufacturing'
import { ProductDetails } from '@/interface/productDetails'
import MyNewSegmentProductsCarousal from '@/components/utils-components/MyNewSegmentProductsCarousal'
import {
  BottomCard,
  SegmentCarousal,
  SegmentFocus,
} from '@/interface/SegmentFocus'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import { Blogs } from '@/interface/Blog'
import MyBlogsCarousal from '@/components/utils-components/MyBlogsCarousel'

interface typeInterface {
  slug: string
}

const SegmentFocused: React.FC<typeInterface> = ({ slug }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [bannerCarousal, setBannerCarousal] = useState<SegmentCarousal[]>([])
  const [arrivals, setArrivals] = useState<BottomCard[]>([])
  const [segment, setSegment] = useState<SegmentFocus>()
  const [sectionSequence, setSectionSequence] = useState<string[]>([])
  const [blogsCarouselData, setBlogsCarouselData] = useState<Blogs[]>([])

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

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
    } catch (error) {
      console.error('Failed to fetch new arrival data:', error)
      return {} // Return an empty object if an error occurs
    }
  }
  const formattedText = (text: string) => {
    return text
      .split('-') // Split the text on hyphen
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' ') // Join with a space
  }
  const homePageQuery = useQuery({
    queryKey: ['home-page'],
    queryFn: fetchHomePageData,
  })
  const isWordPressPage = (data: any): data is WordPressPage => {
    return data && typeof data === 'object' && 'acf' in data
  }
  // const fetchInitialData = async () => {
  //   const dataHome = await homePageQuery.refetch()
  //   console.log('Segemnt,focused', dataHome)
  //   if (dataHome && isWordPressPage(dataHome.data)) {
  //     //console.log("Successsssss", dataHome.data.acf.banner_carousel)
  //     setBannerCarousal(dataHome?.data?.acf?.banner_carousel)
  //   }
  // }
  const fetchNewArrivalData = async (): Promise<Arrivals[]> => {
    try {
      const response = await apiClient.get<ProductDetails[]>(
        ` ${API_ENDPOINT.GET.get_prod_products}?tag=${ebcoApiData.NEW_ARRIVAL_CODE}`,
      )
      // console.log(response, "new arrival data");
      if (!response) {
        throw new Error('No data found')
      }

      let newData = response.data.map((item: any) => ({
        ...item,
        image: item.images.length > 0 ? item.images[0].src : '',
        Image2:
          item.images.length > 1 ? item.images[1].src : item.images[0].src,
      }))
      // setArrivals(prev=>prev=newData)
      return newData
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return [] // Return an empty array if an error occurs
    }
  }
  const newArrivalQuery = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchNewArrivalData,
  })
  // SEGMENT FOCUS API
  const fetchSegmentFocusPageData = async (): Promise<SegmentFocus[] | {}> => {
    try {
      const response = await apiClient.get<SegmentFocus[]>(
        `${API_ENDPOINT.GET.getSegmentFocus}?acf_format=standard&slug=${slug}`,
      )

      if (!response || !response.data) {
        throw new Error('No data found')
      }
      console.log('SEGMENT FOCUS', response.data)
      setSegment(response.data[0])
      setBannerCarousal(response.data[0].acf.carousel)
      setArrivals(response.data[0].acf.bottom_cards)

      const orderedSections = Object.entries(response.data[0].acf.sequencing)
        .sort(([, a], [, b]) => a - b)
        .map(([key]) => key)

      setSectionSequence(orderedSections)

      // const { acf } = response.data

      // if (!acf || !acf.carousel || !acf.banner_video) {
      //   throw new Error('Incomplete ACF data')
      // }

      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data:', error)
      return {} // Return an empty object if an error occurs
    }
  }
  const SegmentFocusPageQuery = useQuery({
    queryKey: ['segment-focus-page'],
    queryFn: fetchSegmentFocusPageData,
  })
  // MORE BLOGS API
  const fetchBlogData = async (): Promise<Blogs[] | []> => {
    try {
      const featuredResponse = await apiClient.get<Blogs[]>(
        `${API_ENDPOINT.GET.getBlogs}?&acf_format=standard&tags=${ebcoApiData.MORE_BLOGS_CODE}`,
      )
      if (!featuredResponse || !featuredResponse.data) {
        throw new Error('No data found')
      }

      console.log(featuredResponse.data, 'BLOG MORE DATA')
      setBlogsCarouselData(prev => (prev = featuredResponse.data))
      return featuredResponse.data
    } catch (error) {
      console.error('Failed to fetch new arrival data:', error)
      return []
    }
  }

  const fetchMoreBlogsQuery = useQuery({
    queryKey: ['blogs-query'],
    queryFn: () => fetchBlogData(),
  })
  useEffect(() => {
    console.log('Use Effect', slug)
    // fetchInitialData()
    newArrivalQuery.refetch()
    SegmentFocusPageQuery.refetch()
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      const video = videoRef.current

      if (video) {
        // Calculate the scroll position as a fraction of the total scrollable height
        const scrollTop = window.scrollY
        const scrollHeight = document.body.scrollHeight - window.innerHeight

        const scrollFraction = scrollTop / scrollHeight

        // Set the video's currentTime based on scrollFraction
        const videoDuration = video.duration || 0 // Handle case where duration is not yet available
        const scrubTime = scrollFraction * videoDuration

        if (!isNaN(scrubTime)) {
          video.currentTime = scrubTime
        }
      }
    }
    let throttleTimeout: NodeJS.Timeout | null = null
    const throttledHandleScroll = () => {
      if (throttleTimeout) clearTimeout(throttleTimeout)
      throttleTimeout = setTimeout(handleScroll, 50) // Execute every 50ms
    }

    // Add a scroll listener
    window.addEventListener('scroll', throttledHandleScroll)

    // Cleanup listener on component unmount
    return () => {
      if (throttleTimeout) clearTimeout(throttleTimeout)
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const blogsData = await fetchMoreBlogsQuery.refetch()
      console.log(blogsData, 'ABOUT')
      if (!blogsData.data) return
      setBlogsCarouselData(blogsData.data)
    }

    fetchData()
  }, [])
  return (
    <Box className='segment-container'>
      {sectionSequence.map(sectionKey => {
        return (
          <React.Fragment key={sectionKey}>
            {sectionKey === 'sequence_banner' && (
              <Box className='scrollable-container'>
                <div
                  style={{
                    position: 'sticky',
                    top: 82,
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100vh',
                  }}
                >
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    preload='metadata'
                    style={{
                      width: '100%',
                      height: 'auto',
                      position: 'relative',
                      top: '0',
                      left: '0',
                      objectFit: 'fill',
                    }}
                  >
                    {segment &&
                      (isSmallScreen ? (
                        <source
                          src={segment.acf.banner_video_mobile}
                          type='video/mp4'
                        />
                      ) : (
                        <source
                          src={segment.acf.banner_video}
                          type='video/mp4'
                        />
                      ))}
                  </video>
                </div>
              </Box>
            )}

            {sectionKey === 'sequence_carousel' && (
              <Box id='carousel' className='segment-focus-content-container'>
                <Box className='segment-title'>
                  <Typography
                    className='global-title'
                    sx={{ color: customColors.buleHeaderEbcoo }}
                  >
                    {formattedText(slug).toUpperCase()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: '20px',
                    [theme.breakpoints.down('sm')]: {
                      mt: 3,
                    },
                  }}
                >
                  {bannerCarousal.length > 0 && (
                    <SegmentVideoCarousal bannerCarousal={bannerCarousal} />
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
                </Box>
              </Box>
            )}

            {sectionKey === 'sequence_mid_content' && (
              <Box
                id='mid-content'
                className='product-base segment-focus-content-container'
              >
                {segment && (
                  <Image
                    src={segment.acf.content_section_3.image}
                    alt='product image'
                    className='product-image-item'
                    width='400'
                    height='400'
                  />
                )}

                <Box
                  className='prod-content'
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <Typography
                    sx={{ color: customColors.darkBlueEbco }}
                    className='global-title'
                  >
                    {segment?.acf.content_section_3.title}
                  </Typography>
                  <Typography
                    sx={{ lineHeight: '30px' }}
                    className='global-description'
                  >
                    {segment?.acf.content_section_3.description}
                  </Typography>
                </Box>
              </Box>
            )}

            {sectionKey === 'sequence_cards_carousel' && (
              <Box
                id='cards-carousel'
                className='product-carousal segment-focus-content-container'
              >
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
                  <Box>
                    <Box
                      sx={{
                        mb: 4,
                        [theme.breakpoints.down('sm')]: {
                          mb: 3,
                        },
                      }}
                    >
                      <Typography
                        sx={{ color: customColors.buleHeaderEbcoo }}
                        className='global-title'
                      >
                        {`Get to know more on ${
                          slug.includes('-') ? formattedText(slug) : slug
                        }`}
                      </Typography>
                    </Box>
                    <MyNewSegmentProductsCarousal newArrivals={arrivals} />
                  </Box>
                )}
              </Box>
            )}
          </React.Fragment>
        )
      })}
      <Box className='segment-focus-content-container'>
        <Typography
          sx={{
            fontFamily: 'Uniform Light',
            fontSize: isSmallScreen ? '21px' : '24px',
            color: customColors.darkBlueEbco,
            margin: '1rem 0',
            // marginLeft: "0.5rem !important",
          }}
        >
          <span
            style={{
              fontFamily: 'Uniform Light',
              fontSize: isSmallScreen ? '21px' : '24px',
              color: customColors.darkBlueEbco,
              margin: '1rem 0',
              marginRight: '0.25rem',
            }}
            className='About-us-title'
          >
            EXPLORE OUR{' '}
          </span>
          <span
            style={{
              fontFamily: 'Uniform Bold',
              fontSize: isSmallScreen ? '21px' : '24px',
              color: customColors.darkBlueEbco,
            }}
            className='About-us-title'
          >
            BLOGS
          </span>
        </Typography>
        {blogsCarouselData.length === 0 ? (
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
          <MyBlogsCarousal initiatives={blogsCarouselData} />
        )}
      </Box>
    </Box>
  )
}

export default SegmentFocused
