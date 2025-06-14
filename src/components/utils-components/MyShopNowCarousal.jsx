import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined'
import EastOutlinedIcon from '@mui/icons-material/EastOutlined'
import { motion } from 'framer-motion'
import getTransition from '@/utils/transitionDelay'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './ShopNow.css'
import { Pagination, Navigation } from 'swiper/modules'
import formatPrice from '@/utils/formatPrice'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { selectWishlist } from '@/store/wishlist'
import { useAppSelector } from '@/store/reduxHooks'
import { getCategoryByName } from '@/utils/getCategoryByName'
import { setUrl } from '@/store/routeUrl'
import {
  containsScreenReaderText,
  extractRegularPrice,
  extractSalePrice,
} from '@/utils/extractPrice'
import { useAddWishlist } from '@/hooks/useWishListAdd'
import { useRemoveWishlist } from '@/hooks/useWishlistRemove'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Link from 'next/link'
import { apiClient } from '@/apiClient/apiService'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
// import { setUrl } from "@/store/routeUrl";
export default function MyShopNowCarousal({ shopNowData }) {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const wishlistCart = useAppSelector(state => state.wishlist).products
  const auth = useAppSelector(state => state.auth).isLoggedIn
  const [swiperInstance, setSwiperInstance] = useState(null)
  const [isPdfLoading, setPdfLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const wishlist = useSelector(selectWishlist)
  const [shopNowProducts, setShopNowProducts] = useState([])
  const useAddWishlistMutation = useAddWishlist()
  const useRemoveWishlistMutation = useRemoveWishlist()

  useEffect(() => {
    // console.log(shopNowData, 'SHOP NOW');
    setShopNowProducts([])
    setShopNowProducts(shopNowData)
    //console.log(wishlistCart , "=-=-=-")
  }, [shopNowData])

  useEffect(() => {
    if (swiperInstance) {
      // Manually add active class to the initial slide
      //console.log('swiperInstance', swiperInstance);
      setTimeout(() => {
        if (
          swiperInstance &&
          swiperInstance?.slides &&
          swiperInstance?.slides[0]
        ) {
          const initialActiveSlide = swiperInstance?.slides[0]
          //console.log('initialActiveSlide', initialActiveSlide);
          initialActiveSlide?.classList.add('swiper-slide-active')
        }
      }, 2000)
    }
  }, [swiperInstance])

  const handleSwiperInit = swiper => {
    setSwiperInstance(swiper)
  }

  const downloadBrochure = async id => {
    setPdfLoading(true)
    try {
      const response = await apiClient.get(
        `${API_ENDPOINT.GET.downloadPdf}/${id}`,
      )

      if (!response) {
        throw new Error('No data found')
      }
      setPdfLoading(false)

      return response.data.pdf_url
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return '' // Return an empty array and 0 total pages if an error occurs
    }
  }
  const downloadBrochureAndOpen = async (id, name) => {
    try {
      // Fetch the brochure URL or directly fetch the PDF data as Blob
      const url = await downloadBrochure(id)

      if (url) {
        // Fetch the PDF content as a blob
        const response = await fetch(url)
        const blob = await response.blob() // Convert the response into a Blob

        // Create a temporary object URL for the Blob
        const blobUrl = URL.createObjectURL(blob)

        // Create a temporary anchor element
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `${name}.pdf` // Set the desired file name with .pdf extension
        document.body.appendChild(link) // Append the link to the document

        // Trigger the download
        link.click()

        // Clean up the DOM and revoke the Blob URL to free up memory
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      }
    } catch (error) {
      console.error('Error downloading brochure:', error)
    }
  }

  const handleRoute = item => {
    let category = getCategoryByName(item.categories)
    let url = `/${category?.name.toLowerCase()}/${item.slug}`
    return url
  }

  const handleWishlistToggle = data => {
    if (!auth) {
      const currentUrl = window.location.pathname + window.location.search
      const href = window.location.href
      //console.log(href);
      dispatch(
        setUrl({
          url: href,
        }),
      )
      localStorage.setItem('url', href)
      router.push('/login')
      return
    }
    if (data && data.id !== null) {
      const updatedProducts = shopNowProducts.map(product => {
        if (product.id === data.id) {
          const updatedProduct = {
            ...product,
            is_wishlist: !product.is_wishlist,
          }

          // API Call to add/remove from wishlist
          if (updatedProduct.is_wishlist) {
            // API Call to add to wishlist

            useAddWishlistMutation.mutate(updatedProduct.id)
            // Make API call to add to wishlist here
          } else {
            // API Call to remove from wishlist

            useRemoveWishlistMutation.mutate(updatedProduct.id)

            // Make API call to remove from wishlist here
          }

          return updatedProduct
        }
        return product
      })

      setShopNowProducts(updatedProducts)
    }
  }
  const preventSaveImage = e => {
    e.preventDefault() // Prevents the context menu from opening
  }

  return (
    <>
      <Box className='shop-now-grid'>
        {shopNowProducts?.map((item, i) => {
          const href = handleRoute(item)
          return (
            <motion.div
              key={i}
              initial='hidden'
              whileInView='visible'
              transition={{
                duration: getTransition(i, 0.2),
                ease: 'easeInOut',
              }}
              variants={{
                visible: { opacity: 1, transform: 'translateY(0px)' },
                hidden: { opacity: 0, transform: 'translateY(100px)' },
              }}
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                willChange: 'transform, opacity',
              }}
            >
              <Box
                className='shop-now-product'
                sx={{
                  background: customColors.whiteEbco,
                  borderRadius: '4px',
                  position: 'relative',
                }}
              >
                <Link
                  prefetch={false}
                  href={href}
                  passHref
                  key={i}
                  rel='noopener noreferrer'
                >
                  <Box
                    className='shop-now-image'
                    // onClick={() => handleRoute(item)}
                  >
                    <Image
                      src={
                        item?.images?.length > 0 &&
                        item?.images[0] &&
                        item.images[0].src
                      }
                      alt={item.name}
                      width={300}
                      height={310}
                      className='shop_now_image'
                    />
                    <Image
                      src={
                        item?.images?.length > 1 &&
                        item?.images[1] &&
                        item.images[1].src
                      }
                      alt={item.name}
                      width={300}
                      height={310}
                      className='shop_now_image'
                    />
                  </Box>
                </Link>
                {item.tag && (
                  <Typography
                    className='shop-now-tag'
                    sx={{
                      color: customColors.darkBlueEbco,
                      backgroundColor: customColors.skyBlueEbco,
                    }}
                  >
                    {item.tag}
                  </Typography>
                )}
                <Box
                  className='description_shop_now column-space-around'
                  sx={{ alignItems: 'flex-start' }}
                >
                  <Box className='product-activities w-100 row-center'>
                    <Box
                      className='like-download icon-div row-space-around outline-button'
                      sx={{ borderColor: customColors.darkBlueEbco }}
                    >
                      {!item.is_wishlist ? (
                        <FavoriteBorderIcon
                          className='favorite-icon'
                          sx={{
                            color: customColors.darkBlueEbco,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleWishlistToggle(item)}
                        />
                      ) : (
                        <FavoriteIcon
                          className='favorite-icon'
                          sx={{
                            color: customColors.darkBlueEbco,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleWishlistToggle(item)}
                        />
                      )}
                      {!isPdfLoading ? (
                        <SimCardDownloadOutlinedIcon
                          className='shop_now_icon'
                          titleAccess='Download'
                          sx={{ color: customColors.darkBlueEbco }}
                          onClick={() =>
                            downloadBrochureAndOpen(item.id, item.name)
                          }
                        />
                      ) : (
                        <div class='loader-shop'></div>
                      )}
                    </Box>
                  </Box>
                  <Typography
                    className='shop-now-title-carousal'
                    sx={{
                      color: customColors.darkBlueEbco,
                      fontFamily: 'Uniform Bold',
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box className='pricing'>
                    {item.has_options &&
                    !containsScreenReaderText(item.price_html) ? (
                      <>
                        <Typography
                          className='smart-solutions-product-description-mrp'
                          sx={{
                            fontFamily: 'Uniform Medium !important',
                            color: '#092853 !important',
                            zIndex: 2,
                            fontSize: '0.8rem !important',
                          }}
                        >
                          Price Range
                        </Typography>
                        <div
                          className='product-price-mrp-html-shop'
                          style={{
                            fontSize: '32px !important',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: item.price_html,
                          }}
                        ></div>
                      </>
                    ) : item.has_options &&
                      containsScreenReaderText(item.price_html) ? (
                      <>
                        <Typography
                          className='shop-now-ogprice'
                          sx={{ color: customColors.lightGreyEbco }}
                        >
                          MRP:{' '}
                          {formatPrice(extractRegularPrice(item.price_html))}
                        </Typography>
                        <Typography
                          className='shop-now-discount'
                          sx={{
                            color: customColors.darkBlueEbco,
                            fontFamily: 'Uniform Bold',
                          }}
                        >
                          {formatPrice(extractSalePrice(item.price_html))}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          className='shop-now-ogprice'
                          sx={{ color: customColors.lightGreyEbco }}
                        >
                          MRP: {formatPrice(item.regular_price)}
                        </Typography>
                        <Typography
                          className='shop-now-discount'
                          sx={{
                            color: customColors.darkBlueEbco,
                            fontFamily: 'Uniform Bold',
                          }}
                        >
                          {formatPrice(item.price)}
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Box
                    className='product-activities-mobile w-100 row-center'
                    sx={{ marginTop: '2rem' }}
                  >
                    <Box
                      className='like-download row-space-around outline-button'
                      sx={{
                        width: '75%',
                        borderColor: customColors.lightGreyEbco,
                        height: '50px',
                      }}
                    >
                      {!item.is_wishlist ? (
                        <FavoriteBorderIcon
                          className='favorite-icon'
                          sx={{
                            color: customColors.darkBlueEbco,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleWishlistToggle(item)}
                        />
                      ) : (
                        <FavoriteIcon
                          className='favorite-icon'
                          sx={{
                            color: customColors.darkBlueEbco,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleWishlistToggle(item)}
                        />
                      )}
                      {!isPdfLoading ? (
                        <SimCardDownloadOutlinedIcon
                          sx={{ color: customColors.darkBlueEbco }}
                          titleAccess='Download'
                          onClick={() =>
                            downloadBrochureAndOpen(item.id, item.name)
                          }
                          className='shop_now_icon'
                        />
                      ) : (
                        <div class='loader-shop'></div>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          )
        })}
      </Box>
      {shopNowProducts.length > 0 && (
        <Swiper
          onSwiper={handleSwiperInit}
          slidesPerView={isSmallScreen ? 1 : 2}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Navigation]}
          className='shop-now-swiper'
        >
          {shopNowProducts?.map((item, i) => {
            const href = handleRoute(item)
            return (
              <SwiperSlide key={item.id}>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  transition={{
                    duration: getTransition(i, 0.2),
                    ease: 'easeInOut',
                  }}
                  variants={{
                    visible: { opacity: 1, transform: 'translateY(0px)' },
                    hidden: { opacity: 0, transform: 'translateY(100px)' },
                  }}
                  style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform, opacity',
                  }}
                >
                  <Box
                    className='shop-now-product'
                    sx={{
                      background: customColors.whiteEbco,
                      borderRadius: '4px',
                      position: 'relative',
                    }}
                    key={i}
                  >
                    <Link
                      prefetch={false}
                      href={href}
                      passHref
                      key={i}
                      rel='noopener noreferrer'
                    >
                      <Box className='shop-now-image'>
                        <Image
                          src={
                            item?.images?.length > 0 &&
                            item?.images[0] &&
                            item.images[0].src
                          }
                          alt={item.name}
                          width={300}
                          height={310}
                          className='shop_now_image'
                        />
                      </Box>
                    </Link>
                    {item.tag && (
                      <Typography
                        className='shop-now-tag'
                        sx={{
                          color: customColors.darkBlueEbco,
                          backgroundColor: customColors.skyBlueEbco,
                        }}
                      >
                        {item.tag}
                      </Typography>
                    )}
                    <Box
                      className='description_shop_now column-space-around'
                      sx={{ alignItems: 'flex-start' }}
                    >
                      <Box className='product-activities w-100 row-center'>
                        <Box
                          className='like-download icon-div row-space-around outline-button'
                          sx={{ borderColor: customColors.darkBlueEbco }}
                        >
                          {!item.is_wishlist ? (
                            <FavoriteBorderIcon
                              className='favorite-icon'
                              sx={{
                                color: customColors.darkBlueEbco,
                                cursor: 'pointer',
                              }}
                              onClick={() => handleWishlistToggle(item)}
                            />
                          ) : (
                            <FavoriteIcon
                              className='favorite-icon'
                              sx={{
                                color: customColors.darkBlueEbco,
                                cursor: 'pointer',
                              }}
                              onClick={() => handleWishlistToggle(item)}
                            />
                          )}
                          {!isPdfLoading ? (
                            <SimCardDownloadOutlinedIcon
                              className='shop_now_icon'
                              sx={{ color: customColors.darkBlueEbco }}
                              onClick={() =>
                                downloadBrochureAndOpen(item.id, item.name)
                              }
                            />
                          ) : (
                            <div class='loader-shop'></div>
                          )}
                        </Box>
                      </Box>
                      <Typography
                        className='shop-now-title-carousal'
                        sx={{
                          color: customColors.darkBlueEbco,
                          fontFamily: 'Uniform Bold',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Box className='pricing'>
                        {item.has_options &&
                        !containsScreenReaderText(item.price_html) ? (
                          <>
                            <Typography
                              className='smart-solutions-product-description-mrp'
                              sx={{
                                fontFamily: 'Uniform Medium !important',
                                color: '#092853 !important',
                                zIndex: 2,
                                fontSize: '0.8rem !important',
                              }}
                            >
                              Price Range
                            </Typography>
                            <div
                              className='product-price-mrp-html-shop'
                              style={{
                                fontSize: '32px !important',
                              }}
                              dangerouslySetInnerHTML={{
                                __html: item.price_html,
                              }}
                            ></div>
                          </>
                        ) : item.has_options &&
                          containsScreenReaderText(item.price_html) ? (
                          <>
                            <Typography
                              className='shop-now-ogprice'
                              sx={{ color: customColors.lightGreyEbco }}
                            >
                              MRP:{' '}
                              {formatPrice(
                                extractRegularPrice(item.price_html),
                              )}
                            </Typography>
                            <Typography
                              className='shop-now-discount'
                              sx={{
                                color: customColors.darkBlueEbco,
                                fontFamily: 'Uniform Bold',
                              }}
                            >
                              {formatPrice(extractSalePrice(item.price_html))}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography
                              className='shop-now-ogprice'
                              sx={{ color: customColors.lightGreyEbco }}
                            >
                              MRP: {formatPrice(item.regular_price)}
                            </Typography>
                            <Typography
                              className='shop-now-discount'
                              sx={{
                                color: customColors.darkBlueEbco,
                                fontFamily: 'Uniform Bold',
                              }}
                            >
                              {formatPrice(item.price)}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </>
  )
}
