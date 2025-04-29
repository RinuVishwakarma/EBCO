import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './HomeVideoCarousal.css';

import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';

export default function HomeVideoCarousal({ bannerCarousal }) {
    const swiperRef = useRef(null);
    const theme = useTheme();
    const [carousal, setCarousal] = useState([])
    const [isMuted, setIsMuted] = useState(true);
    const router = useRouter()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));
    const isLargeScreen = useMediaQuery(theme.breakpoints.down("xl"))
    const handleVideoEnd = () => {
        //console.log("VIDEO ENDED")
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };
    const handleVideoEnd1 = () => {
        //console.log("VIDEO ENDED")
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };


    const handleSlideChange = () => {
        const swiper = swiperRef.current.swiper;
        swiper.slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (index === swiper.activeIndex) {
                video.play();
            } else {
                video.pause();
            }
        });
    };

    useEffect(() => {
        //console.log(bannerCarousal, "BANNERRRRrrrrrrrrrrrrrr")
        setCarousal(bannerCarousal)
        if (swiperRef.current) {
            const swiper = swiperRef.current.swiper;
            handleSlideChange(); // Initial slide change to play the first video
            swiper.on('slideChange', handleSlideChange);
            return () => {
                swiper.off('slideChange', handleSlideChange);
            };
        }
    }, []);
    useEffect(() => {
        //console.log("CAROUSALLLLLLLLLLLLLLLLL", carousal)
    }, [carousal])

    const toggleMute = () => {
        setIsMuted(!isMuted);
        const swiper = swiperRef.current.swiper;
        const currentVideo = swiper.slides[swiper.activeIndex].querySelector('video');
        currentVideo.muted = !isMuted;
    };

    return (
        <div style={{
            position: "relative",
            marginTop: '1rem !important',

        }}
            className='home-carousal-wrapper'
        >
            <Swiper
                ref={swiperRef}
                slidesPerView={isSmallScreen ? 1.1 : isMediumScreen ? 1.7 : isLargeScreen ? 1.6 : 1.4} // Adjust this to show part of the next slide
                spaceBetween={20}
                loop={true}
                centeredSlides={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{ delay: 15000, disableOnInteraction: false }}
                modules={[Pagination, Navigation, Autoplay]}
                navigation={{ nextEl: ".arrow-right-home", prevEl: ".arrow-left-home" }}
                speed={1000}
                className="mySwiper home-video-swiper"
                onSwiper={(swiper) => {
                    swiperRef.current = { swiper };
                }}
            >
                {
                    carousal.length > 0 && carousal.map((item, index) => {

                        return (

                            <SwiperSlide key={index}>
                                <div className="slide-content">
                                <video
                                        loop
                                        muted={isMuted}
                                        playsInline
                                        className="hero-video"
                                        controls={false} // Disable video controls
                                        controlsList="nodownload"
                                        preload="metadata" // Load only metadata initially
                                        poster={item.poster || ''} // Use poster if available
                                        style={{ display: "block" }}
                                        onEnded={() => swiperRef.current.swiper.slideNext()}
                                        onCanPlayThrough={(event) => {
                                            // Play the video when it's ready
                                            if (swiperRef.current.swiper.activeIndex === index) {
                                                event.target.play();
                                            }
                                        }}
                                    >
                                        <source src={item.video} type="video/mp4" />
                                    </video>
                                    {/* <button 
                                        onClick={toggleMute}
                                        className="audio-toggle-btn"
                                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                                    >
                                        {isMuted ? <VolumeOffIcon sx={{ fontSize: 26 }} /> : <VolumeUpIcon sx={{ fontSize: 26 }} />}
                                    </button> */}
                                    <div className='overlay-container' style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',

                                    }}>
                                        <div className='overlay-content' >
                                            <div></div>
                                            {item.centered_image ? <img src={item.centered_image} alt="" className='gif-image' style={{
                                                width: '33%',
                                                height: 'auto',
                                            }} /> : <div></div>}
                                            <div className='w-100 row-space-between'>
                                                <div className='' style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}>

                                                    <button className='explore-btn' onClick={() => {
                                                        router.push(item.redirect_url)
                                                    }}>EXPLORE</button>
                                                    <p className='bottom-overlay-text'>{item.title}</p>
                                                </div>
                                                <div
                                                    className='overlay-image-container'
                                                >
                                                    <img src={item.logo} className='overlay-logo' alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })
                }

            </Swiper>

            <Box className="row-space-between w-100  custom-home-arrows">
                <button className="arrow-left-home arrow" aria-label='Previous'>
                    {/* <Image src='/images/prev_icon.svg' alt="Previous icon" width={24} height={18} /> */}
                    <WestIcon className='arrow' color='#ffffff' />
                </button>
                <button className="arrow-right-home arrow" aria-label='Next'>
                    {/* <Image src='/images/next_icon.svg' alt="Next icon" width={24} height={18} /> */}
                    <EastIcon className='arrow' color='#ffffff' />
                </button>
            </Box>
        </div>
    );
}
