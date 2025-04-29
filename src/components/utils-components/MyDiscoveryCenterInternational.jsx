import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import theme, { customColors } from '@/styles/MuiThemeRegistry/theme';

import './discoveryInternational.css';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { decodeHtml } from '@/utils/convertHtmltoArray';
import { useRouter } from 'next/navigation';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Link from 'next/link';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';

export default function MyDiscoveryCenterInternational({ discoveryCenter }) {
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme => theme.breakpoints.down('lg'));
  const router = useRouter();

  const openEmail = (emails) => {
    // Construct the mailto link
    const emailList = emails.split(" / ");

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
    if (location && location.length > 0) {
      window.open(location, '_blank');
    } else {

      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank")
    }
  }
  // console.log(isLargeScreen , discoveryCenter.length)
  if (discoveryCenter.length > 4) {
    return (
      <div>
        <Swiper
          slidesPerView={isSmallScreen ? 1 : 4}
          spaceBetween={30}
          loop={true}
          pagination={{ clickable: true }}
          slideToClickedSlide={true}
          watchslidesvisibility="true"
          navigation={{ nextEl: ".arrow-right-discovery", prevEl: ".arrow-left-discovery" }}
          modules={[Pagination, Navigation]}
          className="discovery-center-international-swiper"
        >
          {discoveryCenter.map((item, i) => (
            <SwiperSlide key={item.id}>
             
                <Box
                  key={i}
                  sx={{ width: '100% !important' }}
                  className="custom_slide custom_discovery_slide"

                >
                   <Link  prefetch={false}
                href={`/discovery-centers/${item.id}`}
                passHref
                key={i}

                rel="noopener noreferrer"
              >

                  <Box
                    className="bg-center custom_discovery_slide_image"
                    sx={{ background: "white", backgroundImage: `url(${item?.featured_media_src_url})` }}
                  >
                  </Box>
                  </Link>

                  <Typography className="discovery_short_name" sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco, fontSize: '18px', marginTop: '1rem' }}>
                    {item?.acf?.city}
                  </Typography>
                  <Box className="section_description discovery_center_description">
                  <Link  prefetch={false}
                href={`/discovery-centers/${item.id}`}
                passHref
                key={i}

                rel="noopener noreferrer"
              >
                    <Box>

                      <Typography sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco, fontSize: '20px', textAlign: 'left !important' }} className='discovery_center_place'>
                        {decodeHtml(item.title.rendered)}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Uniform Medium', color: customColors.darkBlueEbco, fontSize: '14px', textAlign: 'left !important' }} className='discovery_center_name_carousal'>
                        International Display Center
                      </Typography>
                      <Typography sx={{ fontFamily: 'Uniform Light', color: customColors.darkBlueEbco, fontSize: '14px', width: '80%', textAlign: 'left !important' }} className='discovery_center_address'>
                        {item.acf.address}
                      </Typography>
                    </Box>
                    </Link>
                    <Box className="row-space-around discovery_center_contact" sx={{ boxShadow: 'none', padding: '0.5rem', border: `1px solid ${customColors.opaqueBlue}`, borderRadius: '50px', margin: '0.25rem 0' }}>
                      <Image src="/images/call.svg" onClick={() => window.open(`tel:${item?.acf?.phone}`)} alt='call' width={20} height={20} className='discovery_center_icon' />
                      <Image src="/images/email.svg" onClick={() => openEmail(item?.acf?.email)} alt='email' width={20} height={20} className='discovery_center_icon' />
                      <FmdGoodOutlinedIcon sx={{
                        color: customColors.darkBlueEbco
                      }} width={26} height={26} onClick={() => openLocation(item?.acf?.latitude, item?.acf?.longitude, item?.acf?.google_maps_link)} className='discovery_center_icon' />
                    </Box>
                  </Box>
                </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        <Box className="row-space-between w-100 custom-arrows" sx={{ padding: '0 2rem', marginTop: '-3rem', zIndex: '1', position: 'relative' }}>
          <button className="arrow-left-discovery arrow">
            {/* <Image src='/images/prev_icon.svg' alt="Previous icon" width={24} height={18} /> */}
            <WestIcon className='arrow' color='#5b5b5b' />

          </button>
          <button className="arrow-right-discovery arrow">
            {/* <Image src='/images/next_icon.svg' alt="Next icon" width={24} height={18} /> */}
            <EastIcon className='arrow' color='#5b5b5b' />

          </button>
        </Box>
        <Box className="row-center w-100" onClick={() => router.push('/discovery-centers?type=International')}>
          <Button variant='outlined' className='view-all-discovery'>View All</Button>
        </Box>
      </div>
    );
  } else {
    if (isLargeScreen && discoveryCenter.length > 2) {
      return (
        <div className="">
          <Swiper
            slidesPerView={isSmallScreen ? 1 : 2}
            spaceBetween={30}
            loop={true}
            pagination={{ clickable: true }}
            slideToClickedSlide={true}
            watchslidesvisibility="true"
            navigation={{ nextEl: ".arrow-right-discovery", prevEl: ".arrow-left-discovery" }}
            modules={[Pagination, Navigation]}
            className="discovery-center-international-swiper international-dc dc-carousal"
          >
            {discoveryCenter.map((item, i) => (
              <SwiperSlide key={item.id}>
              
                  <Box
                    key={i}
                    sx={{ width: '100% !important' }}
                    className="custom_slide custom_discovery_slide"

                  >
                      <Link  prefetch={false}
                  href={`/discovery-centers/${item.id}`}
                  passHref
                  key={i}

                  rel="noopener noreferrer"
                >

                    <Box
                      className="bg-center custom_discovery_slide_image"
                      sx={{ background: "white", backgroundImage: `url(${item?.featured_media_src_url})` }}
                    >
                    </Box>
                    </Link>
                    <Typography className="discovery_short_name" sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco, fontSize: '18px', marginTop: '1rem' }}>
                      {item?.acf?.city}
                    </Typography>
                    <Box className="section_description discovery_center_description">
                    <Link  prefetch={false}
                  href={`/discovery-centers/${item.id}`}
                  passHref
                  key={i}

                  rel="noopener noreferrer"
                >

                      <Box>

                        <Typography sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco, fontSize: '20px', textAlign: 'left !important' }} className='discovery_center_place'>
                          {decodeHtml(item.title.rendered)}
                        </Typography>
                        <Typography sx={{ fontFamily: 'Uniform Medium', color: customColors.darkBlueEbco, fontSize: '14px', textAlign: 'left !important' }} className='discovery_center_name_carousal'>
                          International Display Center
                        </Typography>
                        <Typography sx={{ fontFamily: 'Uniform Light', color: customColors.darkBlueEbco, fontSize: '14px', width: '80%', textAlign: 'left !important' }} className='discovery_center_address'>
                          {item.acf.address}
                        </Typography>
                      </Box>
                      </Link>
                      <Box className="row-space-around discovery_center_contact" sx={{ boxShadow: 'none', padding: '0.5rem', border: `1px solid ${customColors.opaqueBlue}`, borderRadius: '50px', margin: '0.25rem 0' }}>
                        <Image src="/images/call.svg" onClick={() => window.open(`tel:${item?.acf?.phone}`)} alt='call' width={20} height={20} className='discovery_center_icon' />
                        <Image src="/images/email.svg" onClick={() => openEmail(item?.acf?.email)} alt='email' width={20} height={20} className='discovery_center_icon' />
                        <FmdGoodOutlinedIcon sx={{
                          color: customColors.darkBlueEbco
                        }} width={26} height={26} onClick={() => openLocation(item?.acf?.latitude, item?.acf?.longitude, item?.acf?.google_maps_link)} className='discovery_center_icon' />
                      </Box>
                    </Box>
                  </Box>
              </SwiperSlide>
            ))}
          </Swiper>
          <Box className="row-space-between w-100 custom-arrows" sx={{ padding: '0 2rem', marginTop: '-3rem', zIndex: '1', position: 'relative' }}>
            <button className="arrow-left-discovery arrow">
              {/* <Image src='/images/prev_icon.svg' alt="Previous icon" width={24} height={18} /> */}
              <WestIcon className='arrow' color='#5b5b5b' />

            </button>
            <button className="arrow-right-discovery arrow">
              {/* <Image src='/images/next_icon.svg' alt="Next icon" width={24} height={18} /> */}
              <EastIcon className='arrow' color='#5b5b5b' />

            </button>
          </Box>
          <Box className="row-center w-100" onClick={() => router.push('/discovery-centers?type=International')}>
            <Button variant='outlined' className='view-all-discovery'>View All</Button>
          </Box>
        </div>
      )
    } else {
      return (
        <div className="international-dc-container">
          <div className='row-space-between international-section' style={{
            alignItems: 'stretch',
            cursor: 'pointer',
          }}>
            {discoveryCenter.map((item, i) => (

              <Box
                key={i}
                sx={{ margin: '0 1rem' }}
                className="custom_slide custom_discovery_slide internatioan-dc non-carousal-dc"
                onClick={() => {
                  // router.push(`/discovery-centers/${item.id}`)
                }}
              >
                <Link  prefetch={false}
                  href={`/discovery-centers/${item.id}`}
                  passHref
                  key={i}

                  rel="noopener noreferrer"
                >

                  <Box
                    className="bg-center custom_discovery_slide_image"
                    sx={{ background: "white", backgroundImage: `url(${item?.featured_media_src_url})` }}
                  >
                  </Box>
                  </Link>
                  <Typography className="discovery_short_name_international" sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco, fontSize: '18px', marginTop: '1rem' }}>
                    {item?.acf?.city}
                  </Typography>
                  <Box className=" discovery_international_description">
                    <Typography sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco, textAlign: 'left !important' }} className='discovery_international_place'>
                      {decodeHtml(item.title.rendered)}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Uniform Medium', color: customColors.darkBlueEbco, textAlign: 'left !important' }} className='discovery_international_name'>
                      International Display Center
                    </Typography>
                    <Typography sx={{ fontFamily: 'Uniform Light', color: customColors.darkBlueEbco, width: '80%', textAlign: 'left !important' }} className='discovery_international_address'>
                      {item.acf.address}
                    </Typography>
                    <Box className="row-space-around discovery_center_international_contact" sx={{ boxShadow: 'none', padding: '0.5rem', border: `1px solid ${customColors.opaqueBlue}`, borderRadius: '50px', margin: '1rem 0' }}>
                      <Image src="/images/call.svg" onClick={() => window.open(`tel:${item?.acf?.phone}`)} alt='call' width={20} height={20} className='discovery_center_icon' />
                      <Image src="/images/email.svg" onClick={() => openEmail(item?.acf?.email)} alt='email' width={20} height={20} className='discovery_center_icon' />
                      <FmdGoodOutlinedIcon sx={{
                        color: customColors.darkBlueEbco
                      }} width={26} height={26} onClick={() => openLocation(item?.acf?.latitude, item?.acf?.longitude, item?.acf?.google_maps_link)} className='discovery_center_icon' />
                    </Box>
                  </Box>
              </Box>
            ))}

          </div>
          <Box className="row-center w-100" onClick={() => router.push('/discovery-centers?type=International')}>
            <Button variant='outlined' className='view-all-discovery'>View All</Button>
          </Box>
        </div>
      );
    }

  }
}
