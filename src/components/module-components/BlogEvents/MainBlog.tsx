'use client'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import { Box, useMediaQuery } from '@mui/material'
import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../../utils-components/ProductRange.css'
import BlogOne from './BlogOne'
import { CarouselItem } from '@/interface/Sustainability'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { InitiativePage } from '@/interface/Initiative'
import { ebcoApiData } from '@/utils/ebcoApiData'
import { apiClient } from '@/apiClient/apiService'
import { useQuery } from '@tanstack/react-query'
import BlogTwo from './BlogTwo'
import BlogThree from './BlogThree'
import { BlogDetails, FeaturesData, Layout3 } from '@/interface/BlogDetails'
import { useParams } from 'next/navigation'
import Loader from '@/components/utils-components/Loader'
import BlogFour from './BlogFour'
import { Blogs } from '@/interface/Blog'
import MyBlogsCarousal from '@/components/utils-components/MyBlogsCarousel'
import ShareIcon from '@mui/icons-material/Share'
import { RWebShare } from 'react-web-share'
import { convertHtmltoArray, decodeHtml } from '@/utils/convertHtmltoArray'

const MainBlog = () => {
  const params = useParams()
  const [searchValue, setSearchValue] = useState<string>('')
  const [blogsCarouselData, setBlogsCarouselData] = useState<Blogs[]>([])
  const [blogValue, setBlogValue] = useState('')
  const [blogData, setBlogData] = useState<BlogDetails>()
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('md'),
  )

  const fetchBlogData = async (searchString: string): Promise<Blogs[] | []> => {
    try {
      const featuredResponse = await apiClient.get<Blogs[]>(
        `${API_ENDPOINT.GET.getBlogs}?&acf_format=standard&tags=${ebcoApiData.MORE_BLOGS_CODE}`,
      )
      if (!featuredResponse || !featuredResponse.data) {
        throw new Error('No data found')
      }
      // console.log(featuredResponse.data, 'BLOG MORE DATA')
      // setBlogsCarouselData(prev => (prev = featuredResponse.data))
      // return featuredResponse.data
      //---- Filter out the current blog from the carousel data
      const filteredBlogs = featuredResponse.data.filter(blog => blog.slug !== params.slug)
      console.log(filteredBlogs, 'BLOG MORE DATA')
      setBlogsCarouselData(prev => (prev = filteredBlogs))
      return filteredBlogs
    } catch (error) {
      console.error('Failed to fetch new arrival data:', error)
      return []
    }
  }

  const fetchMoreBlogsQuery = useQuery({
    queryKey: ['blogs-query', searchValue],
    queryFn: () => fetchBlogData(searchValue),
  })

  const fetchBlogDetailsData = async (): Promise<BlogDetails> => {
    try {
      const response = await apiClient.get<BlogDetails[]>(
        `${API_ENDPOINT.GET.getBlogs}?slug=${params.slug}&acf_format=standard`,
      )

      if (!response || !response.data || response.data.length === 0) {
        throw new Error('No data found')
      }
      let data = response.data[0] // WordPress returns an array, we want the first item

      setBlogData(data)
      setBlogValue(data.acf.layout_type)

      return data
    } catch (error) {
      console.error('Failed to fetch new arrival data:', error)
      throw new Error('Failed to fetch blog details')
    }
  }

  const fetchBlogsDetailsQuery = useQuery({
    queryKey: ['blogs-details'],
    queryFn: () => fetchBlogDetailsData(),
  })

  const { isLoading, isFetching, data, error } = fetchBlogsDetailsQuery

  useEffect(() => {
    const fetchData = async () => {
      const aboutUsData = await fetchMoreBlogsQuery.refetch()
      console.log(aboutUsData, 'ABOUT')
      if (!aboutUsData.data) return
      setBlogsCarouselData(aboutUsData.data)
    }

    fetchData()
    fetchBlogDetailsData()
  }, [])

  useEffect(() => {
    fetchBlogDetailsData()
  }, [params])

  //share icon function
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blogData?.title.rendered || "Blog",
          text: "Check out this amazing blog!",
          url: window.location.href,
        })
        .then(() => console.log("Blog shared successfully"))
        .catch((error) => console.error("Error sharing blog:", error));
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      {!isFetching && (
        <Box sx={{ marginX: 'auto', maxWidth: 1366 }}>
          {/* Blog Section */}
          <Box
            className='main-blog-banner'
            sx={{
              backgroundImage: `url(${
                blogData?.acf.banner_video
                  ? blogData?.acf.banner_video
                  : blogData?.acf.banner_image
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mt: '10px',
               position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                pointerEvents: 'none',
                '@media (max-width: 900px)': {
                  display: 'none'
                }
              }
            }}
          >
           {/* Share icon for both desktop and mobile views */}
           <ShareIcon
              style={{
                cursor: 'pointer',
                color: '#ffff',
                // backgroundColor: '#FFFFFF',
                padding: isSmallScreen ? '6px' : '10px',
                borderRadius: '20%',
                position: 'absolute',
                bottom: isSmallScreen ? '15px' : '20px',
                right: isSmallScreen ? '15px' : '50px',
                // boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                zIndex: 10,
                fontSize: isSmallScreen ? '18px' : '24px',
                width: isSmallScreen ? '32px' : '48px',
                height: isSmallScreen ? '32px' : '48px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={handleShare}
            />
            <Box
              className='mobile-view desktop-view'
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'start',
                flexDirection: 'column',
                 position: 'relative',
                zIndex: 2
              }}
            >
              <Typography
                className='blog-center-title'
                fontWeight='bold'
               sx={{ 
                  color: '#FFFFFF',
                  textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {blogData?.title.rendered}
              </Typography>

              {blogData && (
                <Box
                  className='main-blog-text'
                  dangerouslySetInnerHTML={{
                    __html: blogData?.content.rendered,
                  }}
                ></Box>
              )}
            </Box>
          </Box>

          <Box className='mobile-view' sx={{ padding: '20px 16px 0 16px' }}>
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'start',
                flexDirection: 'column',
              }}
            >
              <Typography
                className='blog-center-title'
                fontWeight='bold'
                sx={{ color: '#000' }}
              >
                {blogData?.title.rendered}
              </Typography>

              {blogData && (
                <Box
                  className='main-blog-text-mobile'
                  dangerouslySetInnerHTML={{
                    __html: blogData?.content.rendered,
                  }}
                ></Box>
              )}
            </Box>
          </Box>

          {/* Features Section */}
          {blogValue == 'layout_1' && blogData && (
            <BlogOne featureData={blogData.acf.features_data} />
          )}
          {blogValue === 'layout_2' && blogData && (
            <BlogTwo featureData={blogData.acf.features_data} />
          )}
          {blogValue == 'layout_3' && blogData && (
            <BlogThree content={blogData.acf.layout_3_contents} />
          )}
          {blogValue == 'layout_4' && blogData && (
            <BlogFour content={blogData.acf.html_content} />
          )}

          <Box
            className='more-blogs-section'
            sx={{ margin: '1rem 0', padding: '2rem 0rem' }}
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
                MORE{' '}
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
              </span>{' '}
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
      )}
    </>
  )
}

export default MainBlog

// pages/index.js
