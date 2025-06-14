import React, { useEffect, useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { customColors } from '@/styles/MuiThemeRegistry/theme'

import './NewArrival.css'
import { motion } from 'framer-motion'

import getTransition from '@/utils/transitionDelay'

// import required modules
import { Pagination, Navigation } from 'swiper/modules'
import { Box, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { convertHtmltoArray } from '@/utils/convertHtmltoArray'
import { getCategoryByName } from '@/utils/getCategoryByName'
import { useRouter } from 'next/navigation'
import WestIcon from '@mui/icons-material/West'
import EastIcon from '@mui/icons-material/East'
import Link from 'next/link'

export default function MyNewArrivalCarousal({ newArrivals }) {
  const [swiper, setSwiper] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const isLargeScreen = useMediaQuery('(max-width: 1800px)')
  const swiperRef = useRef(null)
  const lastClickedIndex = useRef(0)
  const router = useRouter()

  const handleSlideChange = swiper => {
    let doc = document.querySelectorAll('.new_arrival_slide')
    // console.log('doc leave', doc);

    setTimeout(() => {
      doc.forEach(d => {
        d.classList.remove('newArrival-slide-active')
        // console.log(d.classList.contains('swiper-slide-active'));
        if (d.classList.contains('swiper-slide-active')) {
          d.classList.add('newArrival-slide-active')
        }
      })
    }, 100)
  }

  useEffect(() => {
    if (swiper) {
      // console.log('I AM SWIPER', swiper, swiper.slides);
      setTimeout(() => {
        const initialActiveSlide = swiper.slides[0]
        // console.log('initialActiveSlide', initialActiveSlide);
        initialActiveSlide?.classList.add('newArrival-slide-active')
        let newArrivalSlides = swiper.slides
        newArrivalSlides.forEach(slide => {
          slide?.classList.add('newArrival-slide')
        })
      }, 2000)
    }
  }, [swiper])

  const handleActiveSlideEnter = i => {
    let doc = document.querySelectorAll('.new_arrival_slide ')
    doc.forEach(d => {
      d.classList.remove('newArrival-slide-active')
    })
    let activeSlide = document.getElementById(`custom_new_arrival_slide_${i}`)
    activeSlide.classList.add('newArrival-slide-active')
  }

  const handleActiveSlideLeave = i => {
    let doc = document.querySelectorAll('.new_arrival_slide')
    doc.forEach(d => {
      d.classList.remove('newArrival-slide-active')
      if (d.classList.contains('swiper-slide-active')) {
        d.classList.add('newArrival-slide-active')
      }
    })
  }

  const getHref = (item, index, event) => {
    const category = getCategoryByName(item?.categories)
    let encoded = encodeURIComponent(item?.name).replace(/%20/g, '_')
    let url = `/${category.name.toLowerCase()}/${item?.slug}`
    lastClickedIndex.current = index

    return url
  }

  return (
    <div>
      <motion.div
        initial='hidden'
        whileInView='visible'
        transition={{ duration: getTransition(1, 0.5), ease: 'easeInOut' }}
        variants={{
          visible: { opacity: 1, transform: 'translateY(0px)' },
          hidden: { opacity: 0, transform: 'translateY(20px)' },
        }}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        <Swiper
          onSwiper={swiper => {
            setSwiper(swiper)
          }}
          slidesPerView={isSmallScreen ? 2 : isLargeScreen ? 4 : 5}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          speed={500}
          slideToClickedSlide={false}
          initialSlide={0}
          navigation={{
            nextEl: '.arrow-right-arrival',
            prevEl: '.arrow-left-arrival',
          }}
          modules={[Pagination, Navigation]}
          className='product-range-swiper new-arrival-swiper'
          ref={swiperRef}
          onSlideChange={handleSlideChange}
        >
          {newArrivals.map((item, i) => {
            const href = getHref(item, i)
            return (
              <SwiperSlide
                onMouseOver={() => handleActiveSlideEnter(i)}
                onMouseLeave={() => handleActiveSlideLeave(i)}
                className={`new_arrival_slide`}
                id={`custom_new_arrival_slide_${i}`}
                key={item.id}
              >
                <Link
                  prefetch={false}
                  href={href}
                  passHref
                  key={i}
                  className='w-100'
                  rel='noopener noreferrer'
                >
                  <Box
                    key={i}
                    sx={{
                      width: '100% !important',
                      cursor: 'pointer',
                    }}
                    className='new-arrival-product'
                  >
                    <Box
                      className='bg-center arrival-image'
                      sx={{
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        width={400}
                        height={400}
                        className='new-Arrival-image'
                        priority={true} // This ensures the image is prioritized
                        loading='eager' // Ensures the image is loaded eagerly
                      />
                      <Image
                        src={item?.Image2}
                        alt={item?.name}
                        width={400}
                        height={400}
                        className='new-Arrival-image'
                        priority={true} // This ensures the image is prioritized
                        loading='eager' // Ensures the image is loaded eagerly
                        fetchPriority='high' // Fetch priority set to high
                      />
                    </Box>
                    <Box className='section_description new_arrival_description'>
                      <Typography
                        sx={{
                          fontFamily: 'Uniform Bold',
                          color: customColors.darkBlueEbco,
                        }}
                        className='custom_new_arrival_title single-line w-100'
                      >
                        {item?.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Uniform Light',
                          color: customColors.darkBlueEbco,
                          textAlign: 'left',
                        }}
                        className='custom_new_arrival_description w-100'
                      >
                        {convertHtmltoArray(item?.description)[0]}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </motion.div>

      <Box
        className='row-space-between w-100 custom-arrows-newArrival'
        sx={{
          padding: '0 2rem',
          zIndex: '2',
          position: 'relative',
        }}
      >
        <button className='arrow-left-arrival arrow' aria-label='Previous'>
          <WestIcon className='arrow' color='#5b5b5b' />
        </button>
        <button className='arrow-right-arrival arrow' aria-label='Next'>
          <EastIcon className='arrow' color='#5b5b5b' />
        </button>
      </Box>
    </div>
  )
}
