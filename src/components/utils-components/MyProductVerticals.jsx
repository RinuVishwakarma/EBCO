import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { customColors } from '@/styles/MuiThemeRegistry/theme';
import { apiClient } from "@/apiClient/apiService";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import CloseIcon from '@mui/icons-material/Close';
import './Header.css';
import './ProductVerticals.css';
import {
  useLightTextHeading,
  useLightTextSubHeading,
  useBoldTextSubHeading,
  useBoldTextHeading,
  useEbcoBorderBlueButtonStyle,
  useEbcoOrangeButtonStyle
} from '@/utils/CommonStyling';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT } from '@/apiClient/apiEndpoint';
import { ebcoApiData } from '@/utils/ebcoApiData';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

export default function MyProductVerticals() {
  const boxRef = useRef(null);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [productRanges, setProductRanges] = useState([]);
  const [swiperKey, setSwiperKey] = useState(0);

  const fetchHomePageData = async () => {
    try {
      const response = await apiClient.get(
        ` ${API_ENDPOINT.GET.get_page}/${ebcoApiData.HOME_PAGE_CODE}?acf_format=standard`
      );
      if (!response) {
        throw new Error("No data found");
      }
      setProductRanges(response.data.acf.carousel);
      setSwiperKey(prevKey => prevKey + 1); // Update key to force re-render Swiper
      return response.data;
    } catch (error) {
      console.error("Failed to fetch new arrival data", error);
      return {};
    }
  };

  const homePageQuery = useQuery({
    queryKey: ["home-page"],
    queryFn: fetchHomePageData,
  });

  useEffect(() => {
    homePageQuery.refetch();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.5, 0.75],
    };

    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => {
      if (observer && boxRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const theme = useTheme();
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const lightTextHeadingStyle = useLightTextHeading();
  const lightTextSubHeadingStyle = useLightTextSubHeading();
  const boldTextHeadingStyle = useBoldTextHeading();
  const boldTextSubHeadingStyle = useBoldTextSubHeading();
  const ebcoBorderBlueButtonStyle = useEbcoBorderBlueButtonStyle();
  const ebcoOrangeButtonStyle = useEbcoOrangeButtonStyle();

  const handleDescription = (index) => {
    let doc = document.getElementById(`description-${index}`);
    doc.style.display = 'flex !important';
    doc.classList.add('custom-column-space-between');
  }

  const closeDescription = (index) => {
    let doc = document.getElementById(`description-${index}`);
    doc.classList.remove('custom-column-space-between');
  }

  const routeToProductRange = (link) => {
    router.push(link);
  }

  return (
    <>
      {homePageQuery.isLoading ? <div
        className='product-range-loader'
        style={{
          // height: '80vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      ></div> : (
        <>
          <Swiper
            key={swiperKey}
            slidesPerView={2}
            spaceBetween={30}
            loop={true}
            pagination={{ clickable: true }}
            // autoplay={{
            //   delay: 2500,
            //   disableOnInteraction: false,
            //   pauseOnMouseEnter: true
            // }}
            speed={1000}
            slideToClickedSlide={true}
            navigation={{ nextEl: ".arrow-right-product", prevEl: ".arrow-left-product" }}
            modules={[Pagination, Navigation, Autoplay]}
            className="product-vertical-swiperr"
          >
            {productRanges.map((product, index) => (
              <SwiperSlide key={index}>
                <Box
                  lazy="true"
                  className="product-vertical-card bg-center"
                  key={index}
                  ref={boxRef}
                  sx={{
                    width: '83vw !important',
                    cursor: 'grab',
                    margin: isMediumScreen ? '0 1rem' : '0 1rem 0 0 !important',
                    position: 'relative',
                    boxShadow: '1px 1px 10px 1px #dddddd',
                    backgroundColor: !isVisible ? '#f0f0f0' : 'transparent',
                  }}
                >
                  <Box className="logo-product-range row-center mobile-section"
                    sx={{
                      height: '55px',
                      width: '90%',
                      cursor: 'pointer !important',
                      backgroundColor: '#ffffff',
                      padding: '0 1rem',
                      position: 'relative',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Image src={product.logo} alt='Ebco logo' className='hoveredLogo-image' width={80} height={38} style={{
                      height: 'auto',
                      width: '80px'
                    }} />

                  </Box>
                  <Image
                    alt='Image'
                    className="product_range_card_image"
                    src={product.image}
                    loading='lazy'
                    width={700}
                    height={700}
                    style={{
                      position: 'absolute',
                      width: '100% !important',
                      height: '100% !important',
                      objectFit: 'cover',
                      right: '0',
                      top: '0',
                      zIndex: 1
                    }}
                  />
                  {isMediumScreen ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        right: '0',
                        float: 'right',
                        cursor: 'pointer !important',
                        display: 'flex',
                        alignItems: 'flex-end',
                        zIndex: 10,
                        position: 'relative'
                      }}
                      onClick={() => routeToProductRange(product.route)}

                      className="product_range_card_description column-space-between"
                    >

                      <Box
                        style={{
                          backgroundColor: '#ffffff',
                          height: '110%',
                          position: 'absolute',
                          boxShadow: '1px 1px 5px  1px #cccccc',
                          padding: '1rem 0.25rem',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: 'column'
                        }}

                        id={`description-${index}`}
                        className=" product_range_card_description_container"
                      >

                        <Typography sx={{
                          padding: '1rem',
                          color: customColors.blueEbcoText,
                          fontSize: '16px',
                          fontFamily: 'Uniform Light',

                        }}>
                          {product.description}
                        </Typography>
                        <Box className="row-center" sx={{
                          width: '100%',

                        }}>

                          <button style={{ ...ebcoOrangeButtonStyle, width: '90%', margin: '0 auto', fontSize: '12px', height: '28px' }} onClick={() => routeToProductRange(product.route)}>KNOW MORE</button>
                        </Box>
                        <Box className="row-center" mt={1} sx={{
                          width: '100%',

                        }}>

                          <button style={{ ...ebcoBorderBlueButtonStyle, width: '90%', margin: '0 auto', fontSize: '12px', height: '28px' }}
                            onClick={() => window.open(product.file, '_blank')}
                          >Download Brochure</button>
                        </Box>

                      </Box>


                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: '100%',
                        right: '0',
                        float: 'right',
                        cursor: 'pointer !important',
                        display: 'flex',
                        zIndex: 2,
                        position: 'relative'
                      }}
                      onClick={() => routeToProductRange(product.route)}
                      className="product_range_card_description product_range_card_description_default column-space-between"
                    >
                      <Box className="product_details w-100 column-space-between" sx={{ flex: '1' }}>
                        <Box className="hovered_logo_container ">
                          <Image onClick={() => routeToProductRange(product.route)} src={product.logo} className="unhovered_logo" alt={product.id + ' logo'} width={150} height={150} />
                        </Box>
                        <Typography sx={{
                          padding: '1rem',
                          color: customColors.blueEbcoText,
                          fontSize: '22px',
                          fontFamily: 'Uniform Medium !important',
                        }}>
                          {product.description}
                          {/* Hi tgis is description */}
                        </Typography>
                        <Box className="detail-buttons w-100 column-space-between" sx={{ padding: '1rem' }}>
                          <button
                            onClick={() => routeToProductRange(product.route)}
                            style={{ ...ebcoOrangeButtonStyle, width: '90%', margin: '0.5rem auto', fontSize: '14px', height: '40px' }}
                          >
                            KNOW MORE
                          </button>
                          <button
                            style={{ ...ebcoBorderBlueButtonStyle, width: '90%', margin: '0.5rem auto', fontSize: '14px', height: '40px' }}
                            onClick={() => {
                              window.open(product.file, '_blank');
                            }}
                          >
                            Download Brochure
                          </button>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
          <Box className="row-space-between w-100 custom-products-arrows">
            <button className="arrow-left-product arrow">
              {/* <Image src='/images/prev_icon.svg' alt="Previous icon" width={24} height={18} /> */}
              <WestIcon className='arrow' color='#5b5b5b' />
            </button>
            <button className="arrow-right-product arrow">
              {/* <Image src='/images/next_icon.svg' alt="Next icon" width={24} height={18} /> */}
              <EastIcon className='arrow' color='#5b5b5b' />
            </button>
          </Box>
        </>
      )}
    </>
  );
}
