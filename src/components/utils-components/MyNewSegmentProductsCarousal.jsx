import React, { useEffect, useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import '../../components/utils-components/Segment.css'

import './Focus.css'
import { motion } from 'framer-motion'
import AddIcon from '@mui/icons-material/Add'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import getTransition from '@/utils/transitionDelay'

// import required modules
import { Pagination, Navigation } from 'swiper/modules'
import { Box, Typography, useMediaQuery, Modal } from '@mui/material'
import Image from 'next/image'

import { useRouter } from 'next/navigation'
import WestIcon from '@mui/icons-material/West'
import EastIcon from '@mui/icons-material/East'
import Link from 'next/link'
import { useTheme } from '@emotion/react'

export default function MyNewSegmentProductsCarousal({ newArrivals }) {
  const [openModal, setOpenModal] = useState(false)
  const [swiperData, setSwiperData] = useState()
  const [swiper, setSwiper] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const isLargeScreen = useMediaQuery('(max-width: 1800px)')

  const swiperRef = useRef(null)
  const lastClickedIndex = useRef(0)
  const router = useRouter()
  const theme = useTheme()

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
      swiper.navigation.update()
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

  // const getHref = (item, index, event) => {
  //   const category = getCategoryByName(item?.categories)
  //   let encoded = encodeURIComponent(item?.name).replace(/%20/g, '_')
  //   // let url = `/${category.name.toLowerCase()}/${item?.slug}`
  //   lastClickedIndex.current = index

  //   return ''
  // }

  return (
    <div>
      {/* <motion.div
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
      > */}

      <Swiper
        onSwiper={swiper => {
          setSwiper(swiper)
        }}
        // centeredSlides={true}
        slidesPerView={isSmallScreen ? 1 : isLargeScreen ? 4 : 5}
        spaceBetween={isSmallScreen ? 0 : isLargeScreen ? 30 : 10}
        loop={true}
        pagination={{
          clickable: true,
        }}
        style={{
          width: '100%', // Ensure the tile width is fixed
          height: 'auto', // Allow height to adjust based on content
          overflow: 'hidden', // Prevent image overflow during zoom
        }}
        speed={500}
        slideToClickedSlide={false}
        initialSlide={0}
        navigation={{
          nextEl: '.arrow-right-arrival',
          prevEl: '.arrow-left-arrival',
        }}
        modules={[Pagination, Navigation]}
        className='product-range-swiper focus-swiper'
        ref={swiperRef}
        onSlideChange={handleSlideChange}
      >
        {newArrivals.map((item, i) => {
          return (
            <SwiperSlide
              onMouseOver={() => handleActiveSlideEnter(i)}
              onMouseLeave={() => handleActiveSlideLeave(i)}
              className={`new_arrival_slide`}
              id={`custom_new_arrival_slide_${i}`}
              key={item.id}
            >
              {/* <Link
                  prefetch={false}
                  href={href}
                  passHref
                  key={i}
                  className='w-100'
                  rel='noopener noreferrer'
                > */}
              <Box
                key={i}
                sx={{
                  width: '100% !important',
                  cursor: 'pointer',
                }}
                className='focus-product'
                onClick={() => {
                  setSwiperData(item)
                  setOpenModal(true)
                }}
              >
                <Box
                  className='bg-center segment-bottom-carousal-image'
                  sx={{
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '8px !important',
                  }}
                >
                  <Image
                    src={item?.image}
                    alt={item?.name}
                    width={400}
                    height={400}
                    style={{ borderRadius: '8px' }}
                    className='focus-image'
                    priority={true}
                    loading='eager'
                  />

                  <Box
                    className='section_description new_arrival_description'
                    sx={{
                      position: 'relative',
                      top: 0,
                      p: 2,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Uniform Bold',
                        color: customColors.whiteEbco,
                      }}
                      className='global-title'
                    >
                      {item?.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1,
                        color: customColors.whiteEbco,
                        textAlign: 'left',
                      }}
                      className='global-description-med'
                    >
                      {item.sub_title}
                    </Typography>
                  </Box>

                  <Box
                    // className='segment-carousel-icon-position'
                    sx={{
                      position: 'absolute',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bottom: '10%',
                      right: '10%',
                      width: 15,
                      height: 15,
                      p: 1,
                      borderRadius: '50%',
                      backgroundColor: customColors.whiteEbco,
                    }}
                    onClick={() => {
                      console.log(item, 'SWIPER ITEM')
                      setSwiperData(item)
                      setOpenModal(true)
                    }}
                  >
                    <ChevronRightIcon
                      sx={{
                        color: customColors.darkBlueEbco,
                        transition: 'all 0.3s ease-in-out', // Smooth transition for hover effect
                        '&:hover': {
                          color: customColors.orangeEbco, // Change color on hover (optional)
                          boxShadow: `0 0 10px 5px ${customColors.primary}`, // Glow effect
                          transform: 'scale(1.2)', // Slight scaling on hover (optional)
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              {/* </Link> */}
            </SwiperSlide>
          )
        })}
      </Swiper>
      {/* </motion.div> */}

      <Box
        className='row-space-between w-100 custom-arrows-focus'
        sx={{
          padding: '0 2rem',
          zIndex: '2',
          position: 'relative',
          mt: '2rem !important',
        }}
      >
        <button className='arrow-left-arrival arrow' aria-label='Previous'>
          <WestIcon className='arrow' color='#5b5b5b' />
        </button>
        <button className='arrow-right-arrival arrow' aria-label='Next'>
          <EastIcon className='arrow' color='#5b5b5b' />
        </button>
      </Box>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          className='segment-modal'
          sx={{
            position: 'absolute',
            display: 'flex',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            maxWidth: 1200,
            height: 'auto',
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            border: 'none',
            outline: 'none',
          }}
        >
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: 2,
              }}
            >
              {/* <Typography
                className='product-details-title'
                sx={{
                  textTransform: 'capitalize',
                  mb: '1rem !important',
                }}
              >
                {'Title'}
              </Typography> */}
              <Typography
                sx={{ cursor: 'pointer', mt: 1, textWrap: 'nowrap' }}
                onClick={() => setOpenModal(false)}
              >
                &#8592; Close
              </Typography>
            </Box>
            <Box className='focused-modal-content'>
              <Box className='focused-product-container'>
                <Typography className='global-title'>
                  {swiperData?.popup_content.main_title}
                </Typography>
                <Box
                  className='segment-text-container'
                  dangerouslySetInnerHTML={{
                    __html: swiperData?.popup_content.main_description,
                  }}
                ></Box>
              </Box>

              <Box
                className='focused-product-content-container'
                sx={{
                  mb: 2,
                  [theme.breakpoints.down('sm')]: {
                    mb: 0,
                  },
                }}
              >
                <Image
                  src={swiperData?.popup_content.middle_content.image.url}
                  alt={'image'}
                  width={380}
                  height={380}
                  className='focused-product-content-image'
                  priority={true} // This ensures the image is prioritized
                  loading='eager' // Ensures the image is loaded eagerly
                />
                <Box className='segment-primary-title'>
                  <Typography className='global-title'>
                    {swiperData?.popup_content.middle_content.title}
                  </Typography>
                  <Box
                    className='segment-text-container'
                    sx={{ pt: 1 }}
                    dangerouslySetInnerHTML={{
                      __html:
                        swiperData?.popup_content.middle_content.description,
                    }}
                  ></Box>
                </Box>
              </Box>

              <Box
                className='focused-product-secondary-container'
                sx={{
                  mt: 2,
                  [theme.breakpoints.down('sm')]: {
                    mb: 0,
                  },
                }}
              >
                {swiperData?.popup_content.repeater_content &&
                  swiperData?.popup_content.repeater_content.length > 0 &&
                  swiperData?.popup_content.repeater_content.map(prod => {
                    return (
                      <Box key={prod.content_image}>
                        <Box
                          className='segment-text-container'
                          dangerouslySetInnerHTML={{
                            __html: prod.content_para,
                          }}
                        ></Box>

                        <Image
                          src={prod.content_image}
                          alt={'image'}
                          width={800}
                          height={380}
                          className='segment-product-focus-image'
                          priority={true} // This ensures the image is prioritized
                          loading='eager' // Ensures the image is loaded eagerly
                        />
                      </Box>
                    )
                  })}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <button
                  className='know-more-segment action-button'
                  onClick={() => {
                    router.push(swiperData?.popup_content.know_more_url)
                  }}
                >
                  <Typography
                    sx={{ fontSize: '14px', fontFamily: 'Uniform Medium' }}
                  >
                    Know More
                  </Typography>
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
