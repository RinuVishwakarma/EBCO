import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { customColors } from '@/styles/MuiThemeRegistry/theme';

import './DiscoveryCenter.css';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { decodeHtml } from '@/utils/convertHtmltoArray';
import { useRouter } from 'next/navigation';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { discovery } from '@/store/discovery';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import Link from 'next/link';
export default function MyDiscoveryCenterCarousal({ discoveryCenter }) {
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const isLargeScreen = useMediaQuery('(max-width: 1700px)');
  const isMediumScreen = useMediaQuery('(max-width: 1100px)');
  const isTabletScreen = useMediaQuery('(max-width: 800px)');
  const [swiper, setSwiper] = useState(null);

  // console.log(isSmallScreen)
  const openEmail = (emails) => {
    // Construct the mailto link
    const emailList = emails.split("/");

    // Extract the first email address
    const firstEmail = emailList[0];
    const subject = encodeURIComponent(" ");
    const body = encodeURIComponent(" ");
    const mailtoLink = `mailto:${firstEmail}?subject=${subject}&body=${body}`;
    // console.log(firstEmail)
    // return
    // Open the default email client with the mailto link
    window.open(mailtoLink, '_blank');


  }
  const openLocation = (latitude, longitude, location) => {
    console.log(location, latitude, longitude);
    if (location && location.length > 0) {
      window.open(location, '_blank');
    } else {

      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank")
    }
  }

  const handleSlideChange = (swiper) => {
    let doc = document.querySelectorAll('.discovery-slide');
    // console.log('doc leave', doc);

    setTimeout(() => {
      doc.forEach((d) => {
        d.classList.remove('discovery-slide-active');
        // console.log(d.classList.contains('swiper-slide-active'));
        if (d.classList.contains('swiper-slide-active')) {
          d.classList.add('discovery-slide-active');
        }
      });
    }, 100);
  };

  useEffect(() => {
    if (swiper && swiper.slides.length > 0 && swiper.slides[0]) {
      setTimeout(() => {
        const initialActiveSlide = swiper?.slides[0];
        initialActiveSlide?.classList.add('discovery-slide-active');
        let newArrivalSlides = swiper.slides;
        newArrivalSlides.forEach((slide) => {
          slide?.classList.add('discovery-slide');
        });
      }, 2000);
    }
  }, [swiper]);

  const handleActiveSlideEnter = (i) => {
    let doc = document.querySelectorAll('.discovery-slide ');
    doc.forEach((d) => {
      d.classList.remove('discovery-slide-active');
    });
    let activeSlide = document.getElementById(`discovery-slide-${i}`);
    activeSlide.classList.add('discovery-slide-active');
  };

  const handleActiveSlideLeave = (i) => {
    let doc = document.querySelectorAll('.discovery-slide');
    doc.forEach((d) => {
      d.classList.remove('discovery-slide-active');
      if (d.classList.contains('swiper-slide-active')) {
        d.classList.add('discovery-slide-active');
      }
    });
  };

  const getDiscoveryType = (item) => {
    // console.log(item['discovery-center-category'])

    if (item['discovery-center-category'].includes(757)) {
      return "National Display Center"
    } else if (item['discovery-center-category'].includes(758)) {
      return "City Display Center"
    } else {
      return "Discovery Center"
    }
  }
  const router = useRouter()
  return (
    <div>
      <Swiper
        onSwiper={(swiper) => {
          setSwiper(swiper);
        }}
        slidesPerView={isSmallScreen ? 1 : isTabletScreen ? 2 : isMediumScreen ? 3 : isLargeScreen ? 4 : 5}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}

        slideToClickedSlide={false}
        watchslidesvisibility="true"
        navigation={{ nextEl: ".arrow-right-discovery", prevEl: ".arrow-left-discovery" }}
        // navigation={{ nextEl: ".arrow-right", prevEl: ".arrow-left" }}
        // navigation={true}
        modules={[Pagination, Navigation]}
        slidesPerGroup={1}
        className="discovery-center-swiper"
        onSlideChange={handleSlideChange}
      >
        {
          discoveryCenter.map((item, i) => {
            return (
              <SwiperSlide key={item.id}
                className={`discovery-slide`}
                id={`discovery-slide-${i}`}>
              
                  <Box
                    key={i}
                    sx={{
                      width: '100% !important',
                    }}
                    className="custom_slide custom_discovery_slide"
                    onMouseOver={() => handleActiveSlideEnter(i)}
                    onMouseLeave={() => handleActiveSlideLeave(i)}
                  // onClick={() => {
                  //   router.push(``)
                  // }}
                  >
                      <Link  prefetch={false}
                  href={`/discovery-centers/${item.id}`}
                  passHref
                  key={i}

                  rel="noopener noreferrer"
                >

                    <Box
                      className="bg-center custom_discovery_slide_image"
                      sx={{
                        backgroundImage: `url(${item?.featured_media_src_url})`,

                      }}
                    >
                    </Box>
                    </Link>

                    <Typography className="discovery_short_name" sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco, fontSize: '18px', marginTop: '1rem' }}>{item?.acf?.city}</Typography>
                    <Box className="section_description discovery_center_description">
                    <Link  prefetch={false}
                  href={`/discovery-centers/${item.id}`}
                  passHref
                  key={i}

                  rel="noopener noreferrer"
                >
                      <Box className="discovery_center_info">

                        <Typography sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco, fontSize: '20px', textAlign: 'left !important' }} className=' discovery_center_place'>{decodeHtml(item.title.rendered)}</Typography>
                        <Typography sx={{ fontFamily: 'Uniform Medium', color: customColors.darkBlueEbco, fontSize: '14px', textAlign: 'left !important' }} className='discovery_center_name_carousal'>{getDiscoveryType(item)}</Typography>
                        <Typography sx={{ fontFamily: 'Uniform Medium', color: customColors.greyEbco, fontSize: '14px', width: '80%', textAlign: 'left !important' }} className='discovery_center_address'>{item.acf.address}</Typography>
                      </Box>
                      </Link>
                      <Box className="row-space-around discovery_center_contact" sx={{
                        boxShadow: 'none',
                        padding: '0.5rem',
                        border: `1px solid ${customColors.opaqueBlue}`,
                        borderRadius: '50px',
                        margin: '0.25rem 0'
                      }}>
                        <Image src="/images/call.svg" alt='call' onClick={() => window.open(`tel:${item?.acf?.phone}`)} width={20} height={20} className='discovery_center_icon' />
                        <Image src="/images/email.svg" onClick={() => openEmail(item?.acf?.email)} alt='email' width={20} height={20} className='discovery_center_icon' />
                        <FmdGoodOutlinedIcon sx={{
                          color: customColors.darkBlueEbco
                        }} width={26} height={26} onClick={() => openLocation(item?.acf?.latitude, item?.acf?.longitude, item?.acf?.google_maps_link)} className='discovery_center_icon' />

                      </Box>
                    </Box>

                  </Box>
              </SwiperSlide>
            )
          })
        }
      </Swiper>

      <Box className="row-space-between w-100 custom-arrows-discovery" sx={{
        padding: '0 2rem',
        zIndex: '1',
        position: 'relative'
      }}>

        <button className="arrow-left-discovery arrow" aria-label='Previous'>
          {/* <Image src='/images/prev_icon.svg' alt="Previous icon" width={24} height={18}/> */}
          <WestIcon className='arrow' color='#5b5b5b' />


        </button>
        <button className="arrow-right-discovery arrow" aria-label='Next'>
          {/* <Image src='/images/next_icon.svg' alt="Next icon" width={24} height={18}/> */}
          <EastIcon className='arrow' color='#5b5b5b' />
        </button>
      </Box>
      <Box className="row-center w-100 custom-view-all" sx={{ position: 'relative', zIndex: '10', marginTop: '1.5rem' }} onClick={() => router.push('/discovery-centers?type=India')}>
        <Button variant='outlined' className='view-all-discovery'>View All</Button>
      </Box>
    </div>
  );
}
