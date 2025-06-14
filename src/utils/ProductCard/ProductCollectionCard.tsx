import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import { ProductDetails } from '@/interface/productDetails'
import { getCategoryByName } from '../getCategoryByName'
import { convertHtmltoArray, decodeHtml } from '../convertHtmltoArray'
import formatPrice from '../formatPrice'
import PushPinIcon from '@mui/icons-material/PushPin'
import {
  containsScreenReaderText,
  extractRegularPrice,
  extractSalePrice,
} from '../extractPrice'
import { NewProduct } from '@/interface/NewProductDetails'
import { customColors } from '@/styles/MuiThemeRegistry/theme'

interface ProductCardProps {
  data: NewProduct
  selectedItem: string | null
  handleProductClick: (data: NewProduct) => void
  downloadBrochureAndOpen: (id: number, name: string) => void
  isShopNow: (data: NewProduct) => boolean
  handleWishlistIcon: (data: NewProduct) => string
  handleWishlistBorder: (data: NewProduct) => string
  handleBookmarkIcon: (data: NewProduct) => string
  handleBookmarkBorder: (data: NewProduct) => string | undefined
  handleWishlistToggle: (data: NewProduct) => void
  handleBookmarkToggle: (data: NewProduct) => void
}

const ProductCollectionCard: React.FC<ProductCardProps> = ({
  data,
  selectedItem,
  handleProductClick,
  downloadBrochureAndOpen,
  isShopNow,
  handleWishlistIcon,
  handleWishlistBorder,
  handleBookmarkIcon,
  handleBookmarkBorder,
  handleWishlistToggle,
  handleBookmarkToggle,
}) => {
  const category = getCategoryByName(data.categories) // Implement this function as needed
  const selectedItemParam = selectedItem
    ? `selectedItem=${encodeURIComponent(selectedItem).replace(/%20/g, '_')}`
    : ''
  const idParam = `id=${encodeURIComponent(data.id)}`
  const queryParams = [selectedItemParam, idParam].filter(Boolean).join('&')
  const productUrl = `/${category?.name.toLowerCase()}/${data.slug}`

  return (
    <Box className='product-card'>
      {/* {data?.tags && (
        <></>
        // <Typography className='product-tag'>{data?.tags}</Typography>
      )} */}
      <Link prefetch={false} href={productUrl} style={{ width: '100%' }}>
        <Box
          className='product-image-container'
          sx={{
            position: 'relative',
          }}
        >
          {data?.image_urls.featured_image && (
            <>
              <Image
                src={data?.image_urls.featured_image}
                alt='product image'
                width={300}
                height={300}
                className='product-image-item'
                onClick={() => handleProductClick(data)}
              />
            </>
          )}
          {data.image_urls.gallery_images.length > 0 ? (
            <Image
              src={data?.image_urls.gallery_images[0]}
              alt='product image'
              width={300}
              height={300}
              className='product-image-item'
              onClick={() => handleProductClick(data)}
            />
          ) : (
            <Image
              src={data?.image_urls.featured_image}
              alt='product image'
              width={300}
              height={300}
              className='product-image-item'
              onClick={() => handleProductClick(data)}
            />
          )}
          {data.acf_fields && data.acf_fields.segment_logo && (
            <Image
              src={data?.acf_fields.segment_logo}
              alt='product image1'
              width={300}
              height={300}
              className='product-image-item segment-logo'
              onClick={() => handleProductClick(data)}
            />
          )}
          {/* {data.acf_fields.is_pinned && (
            <PushPinIcon
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: customColors.darkBlueEbco, // Customize color
                backgroundColor: customColors.whiteEbco,
                borderRadius: '50%',
                padding: '2px',
                boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)',
              }}
            />
          )} */}
        </Box>
      </Link>
      <Box className='product-info-container'>
        <Box className='product-info' onClick={() => handleProductClick(data)}>
          <Tooltip title={decodeHtml(data.name)} placement='bottom'>
            <Typography className='product-title'>
              {decodeHtml(data.name)}
            </Typography>
          </Tooltip>
          <Typography className='product-description-short'>
            {convertHtmltoArray(data.description)[0]}
          </Typography>
        </Box>
        {/* <Box className='products-btn-container'>
          {isShopNow(data) ? (
            <Box
              className='pricing-container row-center'
              sx={{
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
              }}
            >
              {data.has_options &&
              data.price_html &&
              !containsScreenReaderText(data.price_html) ? (
                <div
                  className='product-price-mrp-html'
                  style={{ fontSize: '20px !important' }}
                  dangerouslySetInnerHTML={{ __html: data.price_html }}
                ></div>
              ) : data.has_options &&
                data.price_html &&
                containsScreenReaderText(data.price_html) ? (
                <>
                  <Typography className='product-price-mrp'>
                    {formatPrice(
                      Number(extractSalePrice(data.price_html)).toFixed(2),
                    )}
                  </Typography>
                  <Typography className='product-price'>
                    {formatPrice(
                      Number(extractRegularPrice(data.price_html)).toFixed(2),
                    )}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography className='product-price-mrp'>
                    {formatPrice(data.price)}
                  </Typography>
                  {data.regular_price && (
                    <Typography className='product-price'>
                      {formatPrice(data.regular_price)}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          ) : (
            <Box sx={{ marginBottom: '1rem' }} className='download-ccontainer'>
              <Typography
                className='download action-text'
                onClick={() => downloadBrochureAndOpen(data.id, data.name)}
              >
                Download Brochure
              </Typography>
            </Box>
          )}
          <Box className='action-container row-space-between'>
            {isShopNow(data) ? (
              <Box
                className='action-icon-container'
                sx={{
                  backgroundColor: handleWishlistIcon(data),
                  border: `1px solid ${handleWishlistBorder(data)}`,
                  marginRight: '0.5rem !important',
                }}
                onClick={() => handleWishlistToggle(data)}
              >
                <FavoriteBorderIcon
                  className='action-icon'
                  sx={{ color: handleWishlistBorder(data) }}
                />
              </Box>
            ) : (
              <Box
                className='action-icon-container'
                sx={{
                  backgroundColor: handleBookmarkIcon(data),
                  border: `1px solid ${handleBookmarkBorder(data)}`,
                  marginRight: '0.5rem !important',
                }}
                onClick={() => handleBookmarkToggle(data)}
              >
                <BookmarkBorderOutlinedIcon
                  className='action-icon'
                  sx={{ color: handleBookmarkBorder(data) }}
                />
              </Box>
            )}
            {isShopNow(data) ? (
              <button
                className='shop-now-button action-button row-center'
                onClick={() => handleProductClick(data)}
              >
                <Typography
                  sx={{ fontSize: '14px', fontFamily: 'Uniform Medium' }}
                  className='action-text'
                >
                  Shop Now
                </Typography>
              </button>
            ) : (
              <button
                className='know-more action-button row-center'
                onClick={() => handleProductClick(data)}
              >
                <Typography
                  sx={{ fontSize: '14px', fontFamily: 'Uniform Medium' }}
                >
                  Know More
                </Typography>
              </button>
            )}
          </Box>
        </Box> */}
      </Box>
    </Box>
  )
}

export default ProductCollectionCard
