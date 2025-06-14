import {customColors} from '@/styles/MuiThemeRegistry/theme'
import EastIcon from '@mui/icons-material/East'
import WestIcon from '@mui/icons-material/West'
import {Box,Typography,useMediaQuery} from '@mui/material'
import {useRouter} from 'next/navigation'
import {useEffect,useState} from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {Navigation,Pagination} from 'swiper/modules'
import {Swiper as SwiperComponent,SwiperSlide} from 'swiper/react'
import './Initiative.css'

// Import SwiperCore type
import {Blogs} from '@/interface/Blog'
import SwiperCore from 'swiper'

interface MyBlogsCarousalProps {
  initiatives: Blogs[]
}

export default function MyBlogsCarousal({ initiatives }: MyBlogsCarousalProps) {
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const router = useRouter()
  const [swiper, setSwiper] = useState<SwiperCore | null>(null)

  const handleSlideChange = (swiper: SwiperCore) => {
    const slides = document.querySelectorAll('.initiatives-slide')

    setTimeout(() => {
      slides.forEach(slide => {
        slide.classList.remove('initiatives-active')

        if (slide.classList.contains('swiper-slide-active') && !isSmallScreen) {
          slide.classList.add('initiatives-active')
        }
      })
    }, 100)
  }

  useEffect(() => {
    console.log('More Data', initiatives)
  }, [initiatives])
  useEffect(() => {
    if (swiper) {
      setTimeout(() => {
        swiper.slides.forEach(slide => {
          slide.classList.add('initiatives-slide')
          // if (slide.classList.contains("swiper-slide-active")) {
          //   slide.classList.add("initiatives-active");
          // }
          if (isSmallScreen) {
            slide.classList.remove('initiatives-active')
          }
        })
      }, 2000)
    }
  }, [swiper, isSmallScreen])

  const handleActiveSlideEnter = (index: number) => {
    const slides = document.querySelectorAll('.initiatives-slide')
    slides.forEach(slide => slide.classList.remove('initiatives-active'))

    const activeSlide = document.getElementById(`initiatives-slide-${index}`)
    if (activeSlide && !isSmallScreen) {
      activeSlide.classList.add('initiatives-active')
    }
  }

  const handleActiveSlideLeave = (index: number) => {
    const slides = document.querySelectorAll('.initiatives-slide')
    slides.forEach(slide => {
      slide.classList.remove('initiatives-active')
      // if (slide.classList.contains("swiper-slide-active") && !isSmallScreen) {
      //   slide.classList.add("initiatives-active");
      // }
    })
  }

  return (
    <div>
      <SwiperComponent
        slidesPerView={isSmallScreen ? 1 : 3}
        spaceBetween={10}
        loop={true}
        pagination={{ clickable: true }}
        navigation={{ nextEl: '.arrow-right-news', prevEl: '.arrow-left-news' }}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        modules={[Pagination, Navigation]}
        className='initiative-swiper'
      >
        {initiatives.map((item, index) => (
          <>
            <Typography>{item.title.rendered}</Typography>
            <SwiperSlide
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => router.push(`/blogs-articles/${item.slug}`)}
              className='custom_slide custom_initiative_slide initiatives-slide'
              id={`initiatives-slide-${index}`}
              onMouseEnter={() => handleActiveSlideEnter(index)}
              onMouseLeave={() => handleActiveSlideLeave(index)}
            >
              <Box
                sx={{
                  width: '100% !important',
                  height: '100%',
                }}
                // className="custom_slide custom_initiative_slide initiatives-slide"
                // id={`initiatives-slide-${index}`}
                // onMouseEnter={() => handleActiveSlideEnter(index)}
                // onMouseLeave={() => handleActiveSlideLeave(index)}
              >
                <Box
                  className='bg-center custom_initiative_slide_image'
                  sx={{
                    backgroundImage: `url(${item.featured_media_src_url}), linear-gradient(358.13deg, rgba(2, 2, 2, 0.6) 22.63%, rgba(0, 0, 0, 0) 40.71%)`,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Box className='initiative_events_content'>
                    <Typography
                      sx={{
                        color: customColors.whiteEbco,
                        fontFamily: 'Uniform Bold',
                      }}
                      className='initiative_title'
                    >
                      {item.title.rendered}
                    </Typography>
                    {/* <Box
            className='blog-text-container '
            dangerouslySetInnerHTML={{
              __html: item.content.rendered,
            }}
          ></Box> */}
                    {/* <Typography
                    sx={{
                      color: customColors.whiteEbco,
                      fontFamily: "Uniform Medium",
                    }}
                    className="initiative_place"
                  >
                    {item.content.rendered}
                  </Typography> */}
                  </Box>
                </Box>
                <Box className='initiative_events_description column-space-around'>
                  <Typography
                    sx={{
                      fontFamily: 'Uniform Bold',
                      color: customColors.darkBlueEbco,
                      fontSize: '24px',
                    }}
                    className='discovery_center_place_about single-line w-100'
                  >
                    {item.title.rendered}
                  </Typography>
                  {/* <Box
            className='blog-text-container '
            dangerouslySetInnerHTML={{
              __html: item.content.rendered,
            }}
          ></Box> */}
                </Box>
              </Box>
            </SwiperSlide>
          </>
        ))}
      </SwiperComponent>

      <Box className='row-space-between w-100 custom-initiatives-arrows'>
        <button className='arrow-left-news arrow initiative-arrow'>
          <WestIcon className='arrow' color='disabled' />
        </button>

        <button className='arrow-right-news arrow initiative-arrow'>
          <EastIcon className='arrow' color='disabled' />
        </button>
      </Box>
      <Box className='w-100 row-center'>
        <button
          className='view-all'
          onClick={() => router.push('/blogs-articles')}
          style={{
            marginTop: '1rem ',
          }}
        >
          View All Blogs
        </button>
      </Box>
    </div>
  )
}
