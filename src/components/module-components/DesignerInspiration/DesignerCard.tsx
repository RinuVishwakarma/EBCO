import {
  Box,
  Chip,
  IconButton,
  Modal,
  Typography,
  useTheme,
} from '@mui/material'
import Image from 'next/image'
// import './brochure/Brochure.css'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import { DownloadBrochure } from '@/interface/DownloadBrochure'
import { decodeHtml } from '@/utils/convertHtmltoArray'
import { useEffect, useState } from 'react'
import ModelViewer from '../../utils-components/ModelVIewer'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import './DesignerCard.css'
import { ViewInAr } from '@mui/icons-material'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}

const DesignerCard = ({ item }: { item: DownloadBrochure }) => {
  const [openModal, setOpenModal] = useState(false)
  const [openSliderModal, setOpenSliderModal] = useState(false)
  const [initialSlideGallery, setInitialSlideGallery] = useState<number>(0)
  const [productImages, setProductImages] = useState<string[] | undefined>([])
  const [isMobile, setIsMobile] = useState(false)
  const theme = useTheme()

  const handleCloseSwiper = () => {
    setOpenSliderModal(prev => {
      console.log(prev, 'prev')
      return !prev
    })
  }

  const handleImage = (itm: DownloadBrochure | any) => {
    setOpenSliderModal(prev => (prev = !prev))
  }

  useEffect(() => {
    if (item?.acf && item?.acf?.images && item?.acf?.images.length > 0) {
      item &&
        item?.acf &&
        item?.acf?.images &&
        setProductImages(prev => (prev = item?.acf?.images))
    }
  }, [item])

  useEffect(() => {
    const isAndroidOrIOS = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      return (
        /android/.test(userAgent) || // Android devices
        /iphone|ipad|ipod/.test(userAgent) // iOS devices
      )
    }
    if (isAndroidOrIOS()) {
      setIsMobile(true)
    }
  }, [])
  return (
    <Box
      key={item.link}
      className='designer-card-wrapper masonry-item'
      sx={{
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <Image
        src={
          item.featured_media_src_url
            ? item.featured_media_src_url
            : '/images/default.png'
        }
        alt={item.title.rendered}
        width={300}
        height={300}
        onClick={() => handleImage(item)}
      />

      {item.title.rendered && (
        <Chip
          label={decodeHtml(item.title.rendered)}
          sx={{
            backgroundColor: '#FFF',
            color: '#092853',
            fontWeight: 700,
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '80%',
            '&:hover': {
              backgroundColor: '#FFF',
              color: '#092853',
            },
            [theme.breakpoints.down('sm')]: {
              height: 24,
              fontSize: '12px',
            },
          }}
          onClick={() => handleImage(item)}
        />
      )}

      {item.acf.is_cad && (
        <IconButton
          sx={{
            background: '#fff',
            position: 'absolute',
            top: '4%',
            right: '4%',
            '&:hover': {
              background: '#fff',
              color: '#03247D',
            },
          }}
          onClick={() => setOpenModal(prev => (prev = !prev))}
        >
          <ViewInAr fontSize='small' />
        </IconButton>
      )}

      {/* <Typography
        className='card-title '
        sx={{
          color: customColors.darkBlueEbco,
        }}
      >
        {decodeHtml(item.title.rendered)}
      </Typography> */}
      {/* <button
        className='shop-now-button action-button row-center'
        onClick={() => handleImage(item)}
      >
        <Typography
          sx={{ fontSize: '14px', fontFamily: 'Uniform Medium' }}
          className='action-text'
        >
          View
        </Typography>
      </button> */}
      {/* <button
        onClick={() => handleImage(item)}
        className='row-center download-button'
      >
        View
      </button> */}
      <Modal
        open={openSliderModal}
        // onClose={() => setOpenSliderModal(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style} className='Gallery-modal'>
          <Box
            className='swiper-container gallery-container'
            sx={{
              width: '100%',
            }}
          >
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              initialSlide={initialSlideGallery}
              loop={true}
              slideToClickedSlide={true}
              navigation={{
                nextEl: '.arrow-right-gallery',
                prevEl: '.arrow-left-gallery',
              }}
              modules={[Navigation]}
              className='image-gallery-swiper'
            >
              {productImages?.map((item, i) => {
                return (
                  <SwiperSlide key={item}>
                    <Box className='row-center product-image-gallery-container'>
                      <Box
                        component='img'
                        className='product-image-slider'
                        src={item}
                        alt={item}
                        sx={{
                          objectFit: 'contain !important',
                          width: '75% !important',
                          [theme.breakpoints.down('sm')]: {
                            width: '100% !important',
                          },
                        }}
                        // onContextMenu={preventSaveImage}
                      />
                    </Box>
                  </SwiperSlide>
                )
              })}
            </Swiper>
            <Typography
              className='close-gallery-modal'
              onClick={() => handleCloseSwiper()}
              sx={{ right: '6%', top: '7%' }}
            >
              Close
            </Typography>
            <Box
              className='row-space-between w-100 custom-arrows custom-swiper-arrows'
              sx={{
                padding: '0 2rem',
                zIndex: '1',
                position: 'absolute',
              }}
            >
              <button
                className='arrow-left-gallery arrow'
                style={{
                  borderColor: 'white',
                }}
              >
                <Image
                  src='/images/left-white.svg'
                  alt='Previous icon'
                  width={24}
                  height={18}
                />
              </button>
              <button
                className='arrow-right-gallery arrow'
                style={{
                  borderColor: 'white',
                }}
              >
                <Image
                  src='/images/right-white.svg'
                  alt='Next icon'
                  width={24}
                  height={18}
                />
              </button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal
        disableEnforceFocus
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100vw',
            height: '100vh',
            bgcolor: 'background.paper',
            border: '1px solid #000',
          }}
        >
          <div>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 4,
              }}
            >
              <Typography
                className='product-details-title'
                sx={{
                  textTransform: 'capitalize',
                  mb: '1rem !important',
                }}
              >
                {item.title.rendered}
              </Typography>
              <Typography
                sx={{ cursor: 'pointer', mt: 1, textWrap: 'nowrap' }}
                onClick={() => setOpenModal(false)}
              >
                &#8592; Close
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
              {item && item.acf && item.acf.cad_data && (
                <>
                  <ModelViewer
                    src={item.acf.cad_data}
                    ar={isMobile ? true : undefined}
                    style={{
                      width: '100%',
                      height: '68vh',
                      display: 'flex',
                      touchAction: 'none',
                    }}
                  />
                </>
              )}
            </Box>
          </div>
        </Box>
      </Modal>
    </Box>
  )
}

export default DesignerCard
