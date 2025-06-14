import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { customColors } from '@/styles/MuiThemeRegistry/theme';

import './Manufacturing.css';
import { motion } from 'framer-motion'

import getTransition from '@/utils/transitionDelay';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { Box, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';

export default function MyManufacturingPlantCarousal({ manufacturingUnits }) {
  const [swiper, setSwiper] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const swiperRef = useRef(null);

  const handleActiveSlide = (i) => {
    //console.log(swiper.slideTo() , swiper , "swiper initialized")
    swiper.slideNext(i, 200)
  }
  // //console.log(isSmallScreen)
  return (
    <div style={{ position: "relative" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: getTransition(1, 0.5), ease: "easeInOut" }}
        variants={{
          visible: { opacity: 1, transform: 'translateY(0px)' },
          hidden: { opacity: 0, transform: 'translateY(20px)' }
        }}
      //  viewport={{ once: true }}
      >
        <Swiper
          onSwiper={(swiper) => {
            //console.log(swiper.__proto__, "set swiper =-=-=-=--=-=-")
            setSwiper(swiper.__proto__)
          }}
          slidesPerView={isSmallScreen ? 1 : 5}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,

          }}
          initialSlide={0}
          slideToClickedSlide={true}
          watchslidesvisibility="true"
          navigation={{ nextEl: ".arrow-right-manufacturing", prevEl: ".arrow-left-manufacturing" }}
          // navigation={{ nextEl: ".arrow-right-arrival", prevEl: ".arrow-left" }}
          // navigation={true}
          modules={[Pagination, Navigation]}
          className="product-range-swiper manufacturing-swiper"
          ref={swiperRef}
        >
          {
            manufacturingUnits.map((item, i) => {
              return (
                <SwiperSlide className={`manufacturing_plant_carousal `} id={`custom_manufacturing_plant_carousal_${i}`} key={i}>
                  <Box
                    key={i}
                    sx={{
                      width: '100% !important',
                      cursor: 'pointer'
                    }}
                    className="manufacturing_plant "
                    onClick={() => handleActiveSlide(i)}
                  >
                    <Box
                      className="bg-center arrival-image"
                      sx={{
                        backgroundImage: `url(${item.image})`,
                        width: '100%',

                      }}
                    >
                    </Box>
                    <Box className="section_description new_arrival_description manu_desc">
                      <Typography sx={{ fontFamily: 'Uniform Bold', color: customColors.darkBlueEbco }} className='manufacturing_plant_title '>{item.title}</Typography>
                      <Typography sx={{ fontFamily: 'Uniform Light', color: customColors.darkBlueEbco, textAlign: 'left' }} className='manufacturing_plant_location'>{item.location}</Typography>


                    </Box>

                  </Box>
                </SwiperSlide>
              )
            })
          }
        </Swiper>
      </motion.div>
      <Box className="row-space-between w-100 custom-arrows-manufacturing" sx={{
        padding: '0 1rem',
        zIndex: '2',
        position: 'absolute',
        bottom: '0',
      }}>

        <button className="arrow-left-manufacturing arrow">
          {/* <Image src='/images/prev_icon.svg' alt="Previous icon" width={24} height={18}/> */}
          <WestIcon className='arrow' color='#5b5b5b' />
        </button>
        <button className="arrow-right-manufacturing arrow">
          {/* <Image src='/images/next_icon.svg' alt="Next icon" width={24} height={18}/> */}
          <EastIcon className='arrow' color='#5b5b5b' />
        </button>
      </Box>


    </div>
  );
}
