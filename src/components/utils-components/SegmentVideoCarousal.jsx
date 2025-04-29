import React, { useEffect, useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box, Typography, useMediaQuery, useTheme, Chip } from '@mui/material'
import { SegmentCarousal } from '../../interface/SegmentFocus'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import './NewArrival.css'
import './HomeVideoCarousal.css'

// Import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import { useRouter } from 'next/navigation'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import Image from 'next/image'

export default function SegmentVideoCarousal({ bannerCarousal }) {
  const swiperRef = useRef(null)
  const [activeChip, setActiveChip] = useState('') // Active chip state
  const observerRef = useRef(null) // Reference for IntersectionObserver
  const isInitialMount = useRef(true) // Flag to skip initial playback
  const [carousal, setCarousal] = useState([])
  const router = useRouter()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const isLargeScreen = useMediaQuery(theme.breakpoints.down('xl'))

  const handleIntersection = entries => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video')
      if (video) {
        if (entry.isIntersecting) {
          video.play().catch(error => {
            console.error('Autoplay error:', error)
          })
        } else {
          video.pause()
          video.currentTime = 0 // Reset video to the start
        }
      }
    })
  }

  useEffect(() => {
    setCarousal(bannerCarousal)

    // Initialize IntersectionObserver
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.9, // 80% of the slide should be visible to trigger playback
    })

    const swiper = swiperRef.current?.swiper
    if (swiper) {
      swiperRef.current.swiper.slideTo(0)
      // Observe all slides
      swiper.slides.forEach(slide => {
        observerRef.current.observe(slide)
      })

      // Ensure new slides are observed on slide change
      swiper.on('slideChange', () => {
        swiper.slides.forEach(slide => {
          observerRef.current.observe(slide)
        })
      })
    }

    return () => {
      // Cleanup observers and Swiper listeners
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (swiper) {
        swiper.off('slideChange')
      }
    }
  }, [bannerCarousal])
  const handleChipClick = title => {
    setActiveChip(title)
    // Find the index of the video that matches the clicked chip title
    const index = carousal.findIndex(item => item.title === title)
    if (swiperRef.current && index !== -1) {
      swiperRef.current.swiper.slideToLoop(index)
      // swiperRef.current.swiper.slideTo(index) // Scroll to the corresponding slide
    }
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <Box className='dynamic-chip-mobile'>
        {carousal.map((item, index) => (
          <Chip
            key={index}
            label={item.title}
            clickable
            onClick={() => handleChipClick(item.title)}
            color={'default'} // Highlight active chip
            sx={{ marginBottom: '1rem' }}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          gap: 2,
          mb: 2,
        }}
        className='dynamic-chip-desktop'
      >
        {carousal.map((item, index) => (
          <Chip
            key={index}
            label={item.title}
            clickable
            onClick={() => handleChipClick(item.title)}
          />
        ))}
      </Box>
      <Swiper
        ref={swiperRef}
        slidesPerView={1} // Adjust this to show part of the next slide
        spaceBetween={20}
        navigation={true}
        loop={true}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        // autoplay={{ delay: 15000, disableOnInteraction: false }}
        modules={[Pagination, Navigation, Autoplay]}
        speed={1000}
        className='mySwiper home-video-swiper segment-video-swiper'
        onSwiper={swiper => {
          swiperRef.current = { swiper }
        }}
      >
        <Box>
          {carousal.length > 0 &&
            carousal.map((item, index) => (
              <SwiperSlide key={index}>
                <div className='slide-content'>
                  {item.video ? (
                    <video
                      loop
                      muted
                      playsInline
                      className='hero-video'
                      controls={false}
                      controlsList='nodownload'
                      preload='metadata'
                      poster={item.poster || ''}
                      style={{ display: 'block' }}
                    >
                      <source src={item.video} type='video/mp4' />
                    </video>
                  ) : (
                    <Image
                      src={item.image}
                      className='hero-video'
                      alt=''
                      width={'700'}
                      height={'500'}
                      style={{
                        width: '100%',
                        height: 'auto',
                      }}
                    />
                  )}
                  <div
                    className='overlay-container'
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                    }}
                  >
                    <div className='overlay-content'>
                      {item.centered_image ? (
                        <Image
                          src={item.image.url}
                          alt=''
                          className='gif-image'
                          style={{
                            width: '33%',
                            height: 'auto',
                          }}
                        />
                      ) : (
                        <div></div>
                      )}

                      <div className='w-100 video-text-position'>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            className='global-title'
                            sx={{
                              color: customColors.whiteEbco,
                              ml: '1rem !important',
                              [theme.breakpoints.down('sm')]: {
                                fontSize: '20px !important',
                                ml: '0.5rem !important',
                              },
                            }}
                          >
                            {item.title}
                          </Typography>
                        </Box>
                        <Box sx={{ gap: 1 }}>
                          <Typography
                            className='segment-slider-description description-width'
                            sx={{
                              color: customColors.whiteEbco,
                              ml: '1.1rem !important',
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Box>
        {/* Uncomment and customize navigation arrows if needed */}
        {/* 
        <Box className='row-space-between w-100  custom-segment-arrows hide-mobile'>
          <button className='arrow-left-home arrow' aria-label='Previous'>
            <ChevronLeftIcon
              sx={{ color: customColors.whiteEbco, fontSize: 40 }}
              className='arrow'
            />
          </button>
          <button className='arrow-right-home arrow' aria-label='Next'>
            <ChevronRightIcon
              sx={{ color: customColors.whiteEbco, fontSize: 40 }}
              className='arrow'
            />
          </button>
        </Box> 
        */}
      </Swiper>
    </div>
  )
}
