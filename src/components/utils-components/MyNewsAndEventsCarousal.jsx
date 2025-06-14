import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { customColors } from '@/styles/MuiThemeRegistry/theme';
import './newsEvents.css';
import { Pagination, Navigation } from 'swiper/modules';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { decodeHtml } from '@/utils/convertHtmltoArray';
import { useRouter } from 'next/navigation';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Link from 'next/link';
export default function MyNewsAndEventsCarousal({ newsEvents }) {
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const isLargeScreen = useMediaQuery('(max-width: 1700px)');
  const isMediumScreen = useMediaQuery('(max-width: 1100px)');
  const isTabletScreen = useMediaQuery('(max-width: 800px)');
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const lastClickedIndex = useRef(0);
  const [swiper, setSwiper] = useState(null);





  const handleSlideChange = (swiper) => {
    let doc = document.querySelectorAll('.news-events-slide');
    //console.log('doc leave', doc);

    setTimeout(() => {
      doc.forEach((d) => {
        d.classList.remove('news-events-active');
        //console.log(d.classList.contains('swiper-slide-active'));
        if (d.classList.contains('swiper-slide-active')) {
          if (!isSmallScreen) {

            d.classList.add('news-events-active');
          }
        }
      });
    }, 100);
  };

  useEffect(() => {
    if (swiper) {
      //console.log('I AM SWIPER', swiper, swiper.slides);
      setTimeout(() => {
        const initialActiveSlide = swiper.slides[0];
        //console.log('initialActiveSlide', initialActiveSlide);

        let newArrivalSlides = swiper.slides;
        newArrivalSlides.forEach((slide) => {
          slide?.classList.add('news-events-slide');
          if (!isSmallScreen) {

            slide?.classList.remove('news-events-active');
          }

        });
      }, 2000);
    }
  }, [swiper]);

  const handleActiveSlideEnter = (i) => {
    let doc = document.querySelectorAll('.news-events-slide');
    doc.forEach((d) => {
      d.classList.remove('news-events-active');
    });
    let activeSlide = document.getElementById(`news-events-slide-${i}`);
    if (!isSmallScreen) {

      activeSlide.classList.add('news-events-active');
    }

  };

  const handleActiveSlideLeave = (i) => {
    let doc = document.querySelectorAll('.news-events-slide');
    doc.forEach((d) => {
      d.classList.remove('news-events-active');
      // if (d.classList.contains('swiper-slide-active')) {
      //   d.classList.add('news-events-active');
      // }
    });
  };

  return (
    <div>
      <Swiper
        onSwiper={(swiper) => {
          setSwiper(swiper);
        }}
        slidesPerView={isSmallScreen ? 1 : isTabletScreen ? 2 : isMediumScreen ? 3 : isLargeScreen ? 4 : 4}
        spaceBetween={30}
        loop={true}
        pagination={{ clickable: true }}
        slideToClickedSlide={false}
        speed={700}
        watchslidesvisibility="true"
        navigation={{ nextEl: ".arrow-right-news", prevEl: ".arrow-left-news" }}
        modules={[Pagination, Navigation]}
        className="news-events-swiper"
        onSlideChange={handleSlideChange}
      >
        {newsEvents.map((item, i) => (
          <SwiperSlide key={item.id}
            id={`news-events-slide-${i}`}
            className='news-events-slide'
          >
            <Link  prefetch={false}
              href={`/news-and-events/${item.slug}`}
              passHref
              key={i}
              target="_blank"
              rel="noopener noreferrer"
              className='w-100'
            >

              <Box
                sx={{ width: '100% !important', height: '100%' }}

                className="custom_slide custom_news_slide news-events"
                // onClick={(e) => handleClick(item, i, e)}
                onMouseOver={() => handleActiveSlideEnter(i)}
                onMouseLeave={() => handleActiveSlideLeave(i)}
              >
                <Box
                  className="bg-center custom_news_slide_image"
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Image src={item?.featured_media_src_url} style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    zIndex: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                    className='news_events_image'
                    alt={item?.title?.rendered}
                    width={900} height={900}
                  />
                  <Image src={(item?.acf?.image_gallery && item?.acf?.image_gallery.length > 1 && item?.acf?.image_gallery[1]) ? item?.acf?.image_gallery[1] : item?.featured_media_src_url} style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    zIndex: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                    className='news_events_image'
                    alt={item?.title?.rendered}
                    width={900} height={900}
                  />
                  <Box className="news_events_content">
                    <Typography sx={{ color: customColors.whiteEbco, fontFamily: 'Uniform Bold', zIndex: 10 }} className="news_title">
                      {decodeHtml(item?.title?.rendered)}
                    </Typography>
                  </Box>
                </Box>
                <Box className="news_events_description column-space-around">
                  <Typography sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco, fontSize: '24px' }} className="news_events_place single-line">
                    {decodeHtml(item?.title?.rendered)}
                  </Typography>
                </Box>
              </Box>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <Box className="row-space-between w-100 custom-news-arrows">
        <button className="arrow-left-news arrow" aria-label='Previous'>
          {/* <Image src="/images/prev_icon.svg" alt="Previous icon" width={24} height={18} /> */}
          <WestIcon className='arrow' color='#5b5b5b' />

        </button>
        <button className="arrow-right-news arrow" aria-label='Next'>
          {/* <Image src="/images/next_icon.svg" alt="Next icon" width={24} height={18} /> */}
          <EastIcon className='arrow' color='#5b5b5b' />

        </button>
      </Box>
      <Box className="row-center news-view-all w-100" onClick={() => router.push('/news-and-events')} sx={{
        marginTop: '0.4rem'
      }}>
        <Button variant='outlined' className='view-all-discovery' >View All</Button>
      </Box>
    </div>
  );
}
