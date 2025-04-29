import { customColors } from '@/styles/MuiThemeRegistry/theme'
import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import '../Initiative/Initiative.css'
import './BlogEvents.css'
import { FeaturesData } from '@/interface/BlogDetails'

interface BlogOneProps {
  featureData: FeaturesData[]
}

const BlogOne: React.FC<BlogOneProps> = ({ featureData }) => {
  useEffect(() => {
    console.log(featureData)
  }, [])
  return (
    <Box>
      <Box>
        {featureData.map((feature, index) => (
          <Box
            key={index}
            className={`discovery-center-banner w-100 mt-20  ${
              index % 2 === 0 ? 'row-reverse-center' : 'row-center'
            }`}
          >
            <Box
              className={`${
                index % 2 !== 0
                  ? 'discovery-center-image-shadow'
                  : 'discovery-center-image-shadow-reverse'
              } row-center bg-center feature-image mt-32`}
              sx={{
                backgroundImage: `url(${feature.feature_image})`,
              }}
            ></Box>
            <Box
              className='discovery-center-tabsection column-center '
              sx={{
                background: customColors.whiteEbco,
                // height: '75vh',
                px: index % 2 !== 0 ? 3 : 0,
              }}
            >
              <Box
                className='toggle-container-tab'
                sx={{
                  marginLeft: index % 2 === 0 ? '0rem !important' : '1rem',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: customColors.darkBlueEbco,
                      fontFamily: 'Uniform Bold',
                      fontSize: 30,
                    }}
                    className='blog-internal-title mt-32'
                  >
                    {feature.feature_title}
                  </Typography>
                  <Box
                    sx={{ py: 2 }}
                    className='blog-text-container '
                    dangerouslySetInnerHTML={{
                      __html: feature.feature_description,
                    }}
                  ></Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default BlogOne
