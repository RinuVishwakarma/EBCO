import React from 'react'
import { Box, Typography } from '@mui/material'
import EastIcon from '@mui/icons-material/East' // Assuming you're using Material-UI icons
import { ImageProp } from '@/interface/productDetails'

interface ImageGalleryProps {
  productImages: ImageProp[]
  videoLink: string
  ytLink: string
  remainingImages: number
  handleImageGallery: (index: number) => void
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  productImages,
  videoLink,
  ytLink,
  remainingImages,
  handleImageGallery,
}) => {
  const hasVideos = videoLink.length > 0 || ytLink.length > 0

  const preventSaveImage = (e: React.MouseEvent) => {
    e.preventDefault() // Prevents the context menu from opening
  }

  return (
    <Box
      className={`image-gallery-many ${
        productImages.length === 1 ? 'single-image-gallery' : ''
      }`}
    >
      {!hasVideos ? (
        <>
          {productImages[0] && (
            <Box
              component='img'
              className='product-image'
              src={productImages[0].src}
              alt='Image 1'
              sx={{ width: '100%', height: 'auto' }}
              onClick={() => handleImageGallery(0)}
              // onContextMenu={preventSaveImage} // Disables right-click
              draggable={false} // Disables dragging
            />
          )}
          {productImages[1] && (
            <Box
              component='img'
              className='product-image'
              src={productImages[1].src}
              alt='Image 2'
              sx={{ width: '100%', height: 'auto' }}
              onClick={() => handleImageGallery(1)}
              // onContextMenu={preventSaveImage}
              draggable={false}
            />
          )}
          {productImages[2] && (
            <Box
              component='img'
              className='product-image'
              src={productImages[2].src}
              alt='Image 3'
              sx={{ width: '100%', height: 'auto' }}
              onClick={() => handleImageGallery(2)}
              // onContextMenu={preventSaveImage}
              draggable={false}
            />
          )}
          {productImages.length > 4 ? (
            <Box
              className='product-image more-images'
              sx={{
                width: '100%',
                height: 'auto',
                backgroundImage: `url(${productImages[3]?.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={() => handleImageGallery(3)}
              // onContextMenu={preventSaveImage}
              draggable={false}
            >
              <Box className='layer'>
                <Box className='view-all-container column-center'>
                  <EastIcon className='view-all-icon' />
                  <Typography className='view-all-text'>View all</Typography>
                </Box>
                <Box className='remaining-count'>
                  <Typography className='remaining-text'>
                    +{remainingImages} more
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            productImages[3] && (
              <Box
                component='img'
                className='product-image'
                src={productImages[3].src}
                alt='Image 4'
                sx={{ width: '100%', height: 'auto' }}
                onClick={() => handleImageGallery(3)}
                // onContextMenu={preventSaveImage}
                draggable={false}
              />
            )
          )}
        </>
      ) : (
        <>
          {productImages[0] && (
            <Box
              component='img'
              className='product-image'
              src={productImages[0].src}
              alt='Image 1'
              sx={{ width: '100%', height: 'auto' }}
              onClick={() => handleImageGallery(0)}
              // onContextMenu={preventSaveImage}
              draggable={false}
            />
          )}
          {productImages.length > 1 ? (
            <Box
              className='product-image more-images'
              sx={{
                width: '100%',
                height: 'auto',
                backgroundImage: `url(${productImages[1]?.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={() => handleImageGallery(1)}
              // onContextMenu={preventSaveImage}
              draggable={false}
            >
              <Box className='layer'>
                <Box className='view-all-container column-center'>
                  <EastIcon className='view-all-icon' />
                  <Typography className='view-all-text'>View all</Typography>
                </Box>
                <Box className='remaining-count'>
                  <Typography className='remaining-text'>
                    +{remainingImages} more
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            productImages[1] && (
              <Box
                component='img'
                className='product-image'
                src={productImages[1]?.src}
                alt='Image 2'
                sx={{ width: '100%', height: 'auto' }}
                onClick={() => handleImageGallery(1)}
                // onContextMenu={preventSaveImage}
                draggable={false}
              />
            )
          )}
        </>
      )}
    </Box>
  )
}

export default ImageGallery
