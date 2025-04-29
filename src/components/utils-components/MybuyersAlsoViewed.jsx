'use client'
import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import { customColors } from '@/styles/MuiThemeRegistry/theme'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import CloseIcon from '@mui/icons-material/Close'
import './ShopNow.css'
import './Also-buy.css'

// import required modules
import { Pagination, Navigation } from 'swiper/modules'
import formatPrice from '@/utils/formatPrice'
import { getCategoryByName } from '@/utils/getCategoryByName'
import { useRouter } from 'next/navigation'
import WestIcon from '@mui/icons-material/West'
import EastIcon from '@mui/icons-material/East'
import Link from 'next/link'

export default function MyBuyersAlsoViewed({ relatedProducts }) {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const router = useRouter()

  const handleProductClick = item => {
    const category = getCategoryByName(item.categories)
    const baseUrl = window.location.origin
    const newUrl = `/${category?.name.toLowerCase()}/${item.slug}`

    router.push(newUrl)
  }

  const preventSaveImage = e => {
    e.preventDefault() // Prevents the context menu from opening
  }

  const getURL = item => {
    const category = getCategoryByName(item.categories)

    if (category) {
      const baseUrl = window.location.origin
      const newUrl = `${baseUrl}/${category.name.toLowerCase()}/${item.slug}`

      return newUrl
    }
  }

  return (
    <Box
      className='swiper-container'
      sx={{
        width: '100%',
      }}
    >
      <Swiper
        slidesPerView={isSmallScreen ? 1 : 3}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        slideToClickedSlide={false}
        watchslidesvisibility='true'
        navigation={{
          nextEl: '.arrow-right-discovery',
          prevEl: '.arrow-left-discovery',
        }}
        // navigation={{ nextEl: ".arrow-right", prevEl: ".arrow-left" }}
        // navigation={true}
        modules={[Pagination, Navigation]}
        className='also-buy-swiper'
      >
        {relatedProducts.map((item, i) => {
          return (
            <SwiperSlide key={item.id} className='buyer-slide'>
              <Link
                prefetch={false}
                href={getURL(item) ?? ''}
                passHref
                key={i}
              >
                <Box
                  className='also-buy-product'
                  sx={{
                    background: 'transparent',
                    borderRadius: '4px',
                    position: 'relative',
                  }}
                  key={i}
                >
                  <Box
                    className='also-buy-image'
                    style={{ height: '400px', position: 'relative' }}
                    onClick={() => handleProductClick(item)}
                  >
                    <Image
                      // onContextMenu={preventSaveImage}
                      src={item.images[0].src}
                      alt={item.name}
                      width={300}
                      height={310}
                      className='shop_now_image_swiper'
                    />
                  </Box>
                  <Box
                    className='description_shop_now_container column-space-around'
                    sx={{
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography
                      className='also-buy-title single-line'
                      sx={{
                        color: customColors.darkBlueEbco,
                        fontFamily: 'Uniform Medium',
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Box className='pricing'>
                      {item.tags.some(tag => tag.id === 723) && (
                        <Typography
                          className='also-buy-discount'
                          sx={{
                            color: customColors.darkBlueEbco,
                            fontFamily: 'Uniform Bold',
                          }}
                        >
                          {formatPrice(
                            item.sale_price ? item.sale_price : item.price,
                          )}{' '}
                        </Typography>
                      )}
                      {Number(item.regular_price) > 0 && (
                        <Typography
                          className='also-buy-ogprice'
                          sx={{ color: customColors.lightGreyEbco }}
                        >
                          MRP {formatPrice(item.regular_price)}{' '}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <Box
        className='row-space-between w-100 custom-arrows '
        sx={{
          padding: '0 2rem',
          zIndex: '1',
          position: 'relative',
        }}
      >
        <button className='arrow-left-discovery arrow buy-arrows'>
          {/* <Image src='/images/prev_icon.svg' alt="Previous icon" width={24} height={18}/> */}
          <WestIcon className='arrow' color='#5b5b5b' />
        </button>
        <button className='arrow-right-discovery arrow buy-arrows'>
          {/* <Image src='/images/next_icon.svg' alt="Next icon" width={24} height={18}/> */}
          <EastIcon className='arrow' color='#5b5b5b' />
        </button>
      </Box>
    </Box>
  )
}
