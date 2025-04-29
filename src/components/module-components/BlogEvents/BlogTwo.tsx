import { customColors } from '@/styles/MuiThemeRegistry/theme'
import { Box, Typography } from '@mui/material'
import React from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import '../Initiative/Initiative.css'
import './BlogEvents.css'
import { FeaturesData } from '@/interface/BlogDetails'

interface BlogTwoProps {
  featureData: FeaturesData[]
}

const BlogTwo: React.FC<BlogTwoProps> = ({ featureData }) => {
  return (
    <Box>
      <Box>
        <Box>
          {featureData.map((feature, index) => (
            <Box
              key={index}
              className={`discovery-center-banner w-100 row-center mt-20`}
            >
              <Box
                className={`discovery-center-image-shadow row-center bg-center feature-image mt-32`}
                sx={{
                  backgroundImage: `url(${feature.feature_image})`,
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
                      {feature.feature_title}
                    </Typography>
                    <Box
                      sx={{ py: 2 }}
                      className='blog-text-container '
                      dangerouslySetInnerHTML={{
                        __html: feature.feature_description,
                      }}
                    ></Box>
                    {/* <Typography variant='body1'>
                      {feature.feature_description}
                    </Typography> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default BlogTwo
