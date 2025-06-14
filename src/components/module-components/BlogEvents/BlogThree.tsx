import { Layout3 } from '@/interface/BlogDetails'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import '../Initiative/Initiative.css'
import './BlogEvents.css'
interface BlogThreeProps {
  content: Layout3
}
const BlogThree: React.FC<BlogThreeProps> = ({ content }) => {
  useEffect(() => {
    console.log(content)
  }, [])
  return (
    <>
      <Box
        className={`discovery-center-banner w-100 row-reverse-center mt-20 `}
      >
        <Box
          className={`discovery-center-image-shadow-reverse row-center bg-center feature-image mt-32`}
          sx={{
            backgroundImage: `url(${content.image})`,
          }}
        ></Box>
        <Box
          className='discovery-center-tabsection column-center '
          sx={{
            background: customColors.whiteEbco,
            // height: '75vh',
            px: 3,
          }}
        >
          <Box className='toggle-container-tab'>
            <Box>
              <Typography
                sx={{
                  color: customColors.darkBlueEbco,
                  fontFamily: 'Uniform Bold',
                }}
                className='blog-internal-title  mt-32'
              >
                {content.title}
              </Typography>
              <Typography className='blog-text-container'>
                {content.description}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{ px: 2 }}
        className='blog-text-container-html'
        dangerouslySetInnerHTML={{
          __html: content.additional_content,
        }}
      ></Box>
    </>
  )
}

export default BlogThree
