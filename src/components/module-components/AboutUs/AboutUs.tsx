'use client'
import OverlayWrapper from '@/components/utils-components/OverlayWrapper'
import { Typography, Box, Button, useTheme, useMediaQuery } from '@mui/material'
import '@/app/(unprotected-route)/Home.css'
// import AboutUsGif from "../../../../public/gifs/about_us.gif";
import Image from 'next/image'
import { useWhiteParagraphStyle } from '@/utils/CommonStyling'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useEffect, useRef, useState } from 'react'
import '../../utils-components/ProductRange.css'
import './AboutUs.css'
import MyInitiativeCarousal from '@/components/utils-components/MyInitiativeCarousal'
import MyProductRangeCarousal from '@/components/utils-components/MyProductRangeCarousal'
import { CarouselItemAbout, WordPressPage } from '@/interface/PageLink'
import { apiClient } from '@/apiClient/apiService'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { ebcoApiData } from '@/utils/ebcoApiData'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { WordPressAboutUsPage } from '@/interface/AboutUs'
import { InitiativePage } from '@/interface/Initiative'
import { CarouselItem } from '@/interface/Sustainability'

const fetchAboutUsData = async (): Promise<WordPressAboutUsPage | {}> => {
  try {
    const response = await apiClient.get<WordPressAboutUsPage>(
      `${API_ENDPOINT.GET.get_page}/${ebcoApiData.ABOUT_US_CODE}?acf_format=standard`,
    )

    if (!response || !response.data) {
      throw new Error('No data found')
    }

    const { acf } = response.data

    if (!acf || !acf.carousel || !acf.banner_video) {
      throw new Error('Incomplete ACF data')
    }

    // setProductRanges(acf.carousel);
    // setVideo(acf.banner_video);
    // setIsVideoLoading(false);

    return response.data
  } catch (error) {
    console.error('Failed to fetch new arrival data:', error)
    return {} // Return an empty object if an error occurs
  }
}

const fetchInitiativesData = async (): Promise<InitiativePage | {}> => {
  try {
    //console.log("fetchSustainabilityData called");
    const response = await apiClient.get<InitiativePage>(
      `${API_ENDPOINT.GET.get_page}/${ebcoApiData.INITIATIVES}?acf_format=standard`,
    )
    console.log(response)
    if (!response || !response.data) {
      throw new Error('No data found')
    }

    const { acf } = response.data

    if (!acf || !acf.carousel || !acf.banner_image) {
      throw new Error('Incomplete ACF data')
    }

    //console.log(response.data);

    return response.data
  } catch (error) {
    console.error('Failed to fetch new arrival data:', error)
    return {} // Return an empty object if an error occurs
  }
}

const AboutUs = () => {
  const sliderRef = useRef<any>()
  const [bannerMedia, setBannerMedia] = useState<string>('')
  const [bannerText, setBannerText] = useState<string>('')
  const [initiative, setInitiative] = useState<CarouselItem[]>([])
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('md'),
  )

  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          padding: '1rem',
          border: `1px solid ${customColors.darkBlueEbco}`,
          borderRadius: '50%',
          width: '64px',
          height: '64px',
        }}
        onClick={onClick}
      >
        <Image
          src='/images/next_icon.svg'
          alt='Previous icon'
          width={24}
          height={18}
        />
      </div>
    )
  }

  const initiativesQuery = useQuery({
    queryKey: ['initiatives-page'],
    queryFn: fetchInitiativesData,
  })

  const isWordPressPageInitiative = (data: any): data is InitiativePage => {
    return data && typeof data === 'object' && 'acf' in data
  }

  useEffect(() => {
    const fetchData = async () => {
      const aboutUsData = await initiativesQuery.refetch()

      if (aboutUsData && isWordPressPageInitiative(aboutUsData.data)) {
        setInitiative([...aboutUsData.data.acf.carousel])
      }
    }

    fetchData()
  }, [])

  const fetchHomePageData = async (): Promise<WordPressPage | {}> => {
    try {
      const response = await apiClient.get<WordPressPage>(
        ` ${API_ENDPOINT.GET.get_page}/${ebcoApiData.HOME_PAGE_CODE}?acf_format=standard`,
      )
      // //console.log(response, "new arrival data");
      if (!response) {
        throw new Error('No data found')
      }
      //console.log(response.data.acf.carousel, "caroooooooooosal");
      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return {} // Return an empty array if an error occurs
    }
  }

  const homePageQuery = useQuery({
    queryKey: ['home-page'],
    queryFn: fetchHomePageData,
  })
  const aboutUsQuery = useQuery({
    queryKey: ['about-us-page'],
    queryFn: fetchAboutUsData,
  })
  const isWordPressPage = (data: any): data is WordPressAboutUsPage => {
    return data && typeof data === 'object' && 'acf' in data
  }

  useEffect(() => {
    const fetchData = async () => {
      const aboutUsData = await aboutUsQuery.refetch()

      if (aboutUsData && isWordPressPage(aboutUsData.data)) {
        const banner_image = aboutUsData.data.acf
        const bannerText = aboutUsData.data.content.rendered

        // if(banner_image.banner_image?.url){}
        setBannerMedia(banner_image.banner_video?.url)
        setBannerText(bannerText)
      }
    }
    homePageQuery.refetch()
    fetchData()
  }, [])

  return (
    <>
      {aboutUsQuery.isFetching && (
        <Box className='loader-container'>
          <Box className='loader'></Box>
        </Box>
      )}
      <Box
        sx={{
          overflowX: 'hidden',
        }}
      >
        <OverlayWrapper media={bannerMedia} isVideo={true}>
          <Box
            className='overlay-text-container'
            sx={{
              flex: 1,
            }}
            dangerouslySetInnerHTML={{ __html: bannerText }}
          ></Box>
        </OverlayWrapper>

        <Box
          className='vertical_section'
          sx={{
            margin: '0 0 1rem 0',
            marginLeft: isSmallScreen ? '1rem !important' : '0 !important',
            padding: '0  1rem 0 0',
            overflow: 'hidden',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Uniform Light',
              fontSize: isSmallScreen ? '18px' : '24px',
              color: customColors.darkBlueEbco,
              margin: '1rem 0',
              marginLeft: isSmallScreen ? '0 !important' : '2rem !important',
            }}
          >
            <span
              style={{
                fontFamily: 'Uniform Light',
                fontSize: isSmallScreen ? '21px' : '24px',
                color: customColors.darkBlueEbco,
                display: isSmallScreen ? 'none' : 'inline-block',
                margin: '1rem 0',
                marginRight: '0.5rem',
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
              PRODUCT RANGE
            </span>{' '}
          </Typography>
          <MyProductRangeCarousal />
        </Box>
        <Box
          className='manufacturing_section'
          sx={{ margin: '1rem 0', padding: '2rem 1rem' }}
        >
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
              GIVING BACK TO{' '}
            </span>
            <span
              style={{
                fontFamily: 'Uniform Bold',
                fontSize: isSmallScreen ? '21px' : '24px',
                color: customColors.darkBlueEbco,
              }}
              className='About-us-title'
            >
              THE COMMUNITY
            </span>{' '}
          </Typography>
          {initiative.length === 0 ? (
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
            <MyInitiativeCarousal initiatives={initiative} />
          )}
        </Box>
      </Box>
    </>
  )
}

export default AboutUs
