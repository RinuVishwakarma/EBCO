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
import { useParams, useRouter } from 'next/navigation'
import Loader from '@/components/utils-components/Loader'
import BlogFour from './BlogFour'
import { Blogs } from '@/interface/Blog'
import MyBlogsCarousal from '@/components/utils-components/MyBlogsCarousel'
import ShareIcon from '@mui/icons-material/Share'
import { RWebShare } from 'react-web-share'
import { convertHtmltoArray, decodeHtml } from '@/utils/convertHtmltoArray'

interface MainBlogProps {
  initialBlogData?: BlogDetails;
}

const MainBlog = ({ initialBlogData }: MainBlogProps) => {
  const params = useParams()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState<string>('')
  const [blogsCarouselData, setBlogsCarouselData] = useState<Blogs[]>([])
  const [blogValue, setBlogValue] = useState('')
  const [blogData, setBlogData] = useState<BlogDetails | undefined>(initialBlogData)
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

      // Filter out the current blog from the carousel data
      const filteredData = featuredResponse.data.filter(blog => blog.id !== blogData?.id)
      console.log(filteredData, 'BLOG MORE DATA')
      setBlogsCarouselData(prev => (prev = filteredData))
      return filteredData
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
      // Get the slug from the URL path
      const pathParts = window.location.pathname.split('/');
      const urlParam = pathParts[pathParts.length - 1];
      
      console.log('Client-side fetching for:', urlParam);
      
      // Check if the URL parameter is a numeric ID (with optional suffix)
      const isNumericId = /^\d+(-\d+)?$/.test(urlParam);
      
      let blogResponse;
      
      if (isNumericId) {
        // If it's a numeric ID, fetch by ID
        // Extract the base ID without the suffix for the API call
        const baseId = urlParam.split('-')[0];
        const url = `${API_ENDPOINT.GET.getBlogs}/${baseId}`;
        console.log(`Client fetching by ID: ${url}`);
        
        blogResponse = await apiClient.get<BlogDetails>(
          url,
          { acf_format: 'standard' }
        );
      } else {
        // Otherwise, fetch by slug
        const url = `${API_ENDPOINT.GET.getBlogs}`;
        console.log(`Client fetching by slug: ${url} with slug=${urlParam}`);
        
        blogResponse = await apiClient.get<BlogDetails[]>(
          url,
          { slug: urlParam, acf_format: 'standard' }
        );
      }

      console.log('Client API Response:', blogResponse);

      if (!blogResponse?.data || (Array.isArray(blogResponse.data) && blogResponse.data.length === 0)) {
        console.log('No blog details found on client side');
        router.push('/blogs-articles');
        throw new Error('No blog details found');
      }

      // Extract the blog details from the response
      const blogDetails = Array.isArray(blogResponse.data) 
        ? blogResponse.data[0] 
        : blogResponse.data;
      
      // If we fetched by ID and the URL doesn't match the slug, redirect to the proper URL
      if (isNumericId && blogDetails.slug && urlParam !== blogDetails.slug) {
        console.log(`Client redirecting from ${urlParam} to ${blogDetails.slug}`);
        // Use router.push instead of window.location.replace for better Next.js integration
        router.push(`/blogs-articles/${blogDetails.slug}`);
        return blogDetails;
      }

      setBlogData(blogDetails);
      setBlogValue(blogDetails.acf.layout_type);

      return blogDetails;
    } catch (error) {
      console.error('Failed to fetch blog details on client side:', error);
      router.push('/blogs-articles');
      throw new Error('Failed to fetch blog details');
    }
  }

  const fetchBlogsDetailsQuery = useQuery({
    queryKey: ['blogs-details', window.location.pathname],
    queryFn: () => fetchBlogDetailsData(),
    enabled: !initialBlogData, // Only fetch if we don't have initial data
  })

  const { isLoading, isFetching, data, error } = fetchBlogsDetailsQuery

  useEffect(() => {
    // If we have initial data, set it up
    if (initialBlogData) {
      console.log('Using initial blog data:', initialBlogData.id, initialBlogData.slug);
      setBlogData(initialBlogData);
      setBlogValue(initialBlogData.acf.layout_type);
    }
    
    const fetchData = async () => {
      const aboutUsData = await fetchMoreBlogsQuery.refetch()
      if (!aboutUsData.data) return
      setBlogsCarouselData(aboutUsData.data)
    }

    fetchData()
  }, [initialBlogData])

  if (error) {
    return (
      <Box sx={{ marginX: 'auto', maxWidth: 1366, padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Blog not found or an error occurred while loading the blog.
        </Typography>
      </Box>
    )
  }

  if ((isLoading || isFetching) && !initialBlogData) {
    return <Loader />
  }

  if (!blogData) {
    return (
      <Box sx={{ marginX: 'auto', maxWidth: 1366, padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h5">
          No blog content available.
        </Typography>
      </Box>
    )
  }

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
      {(isLoading || isFetching) && !initialBlogData && <Loader />}
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
              }}
            >
              <Typography
                className='blog-center-title'
                fontWeight='bold'
                sx={{ color: '#EAF0F5' }}
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
