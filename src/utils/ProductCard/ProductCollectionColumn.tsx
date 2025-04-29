import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import { getCategoryByName } from '../getCategoryByName'
import { convertHtmltoArray, decodeHtml } from '../convertHtmltoArray'
import formatPrice from '../formatPrice'
import {
  containsScreenReaderText,
  extractRegularPrice,
  extractSalePrice,
} from '../extractPrice'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import { NewProduct } from '@/interface/NewProductDetails'
import PushPinIcon from '@mui/icons-material/PushPin'
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

const ProductCollectionCardColumn: React.FC<ProductCardProps> = ({
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
    <Box
      className='product-card-column row-space-between'
      key={decodeHtml(data.name)}
      sx={{
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {
        data && <></>
        //  <Typography className='product-tag'>{data.tags}</Typography>
      }

      <Box
        className='product-image-container-main'
        sx={{
          position: 'relative',
        }}
      >
        <Link prefetch={false} href={productUrl}>
          {data?.image_urls.featured_image && (
            <Image
              src={data?.image_urls.featured_image}
              alt='product image'
              width={300}
              height={300}
              className='product-image-item-main'
            />
          )}
          {data.image_urls.gallery_images.length > 0 ? (
            <Image
              src={data?.image_urls.gallery_images[0]}
              alt='product image'
              width={300}
              height={300}
              className='product-image-item-main'
              onClick={() => {
                handleProductClick(data)
              }}
            />
          ) : (
            <Image
              src={data?.image_urls.featured_image}
              alt='product image'
              width={300}
              height={300}
              className='product-image-item-main'
              onClick={() => {
                handleProductClick(data)
              }}
            />
          )}
          {data.acf_fields && data.acf_fields.segment_logo && (
            <Image
              src={data?.acf_fields.segment_logo}
              alt='product image1'
              width={300}
              height={300}
              className='product-image-item segment-logo-column'
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
        </Link>
      </Box>

      <Box
        className='product-info-container-column column-space-between'
        sx={{
          alignItems: 'normal',
        }}
      >
        <Box className='product-info row-space-between'>
          <Link prefetch={false} href={productUrl}>
            <Box
              className='title-container'
              onClick={() => {
                handleProductClick(data)
              }}
            >
              <Tooltip title={decodeHtml(data.name)} placement='bottom'>
                <Typography
                  className='product-title-column single-line'
                  sx={{
                    marginBottom: '0.5rem !important',
                  }}
                >
                  {decodeHtml(data.name)}
                </Typography>
              </Tooltip>
              <Typography
                className={`product-description-column ${
                  isShopNow(data) ? '' : 'multi-line-description'
                }`}
              >
                {convertHtmltoArray(data.description).map((item, index) => (
                  <span className='product-description-item' key={index}>
                    {item}
                  </span>
                ))}
              </Typography>
            </Box>
          </Link>
          {/* {isShopNow(data) ? (
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
                sx={{
                  color: handleWishlistBorder(data),
                }}
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
                sx={{
                  color: handleBookmarkBorder(data),
                }}
              />
            </Box>
          )} */}
        </Box>
        {/* {isShopNow(data) && (
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
                style={{
                  fontSize: '20px !important',
                }}
                dangerouslySetInnerHTML={{
                  __html: data.price_html,
                }}
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
        )} */}

        {/* <br /> */}
        {/* {isShopNow(data) ? (
          <Box className=''>
            <Box className='row-space-between'>
              <Box
                className='download-container row-center w-50'
                sx={{
                  borderRight: `1px solid ${customColors.menuBorderDark}`,
                }}
              >
                <Typography
                  className='download-column action-text'
                  sx={{
                    color: customColors.darkBlueEbco,
                  }}
                  onClick={() => {
                    downloadBrochureAndOpen(data.id, data.name)
                  }}
                >
                  Download Brochure
                </Typography>
              </Box>
              <Box className='know-more-container row-center w-50'>
                <button
                  className='shop-now-button action-button-column-shop w-50 row-center'
                  onClick={() => handleProductClick(data)}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontFamily: 'Uniform Medium',
                    }}
                    className='action-text'
                  >
                    Shop Now
                  </Typography>
                </button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className=''>
            <Box className='row-space-between'>
              <Box
                className='download-container row-center w-50'
                sx={{
                  borderRight: `1px solid ${customColors.menuBorderDark}`,
                }}
              >
                <Typography
                  className='download-column action-text'
                  onClick={() => {
                    downloadBrochureAndOpen(data.id, data.name)
                  }}
                >
                  Download Brochure
                </Typography>
              </Box>
              <Box className='know-more-container row-center w-50'>
                <button
                  className='know-more action-button-column row-center'
                  onClick={() => handleProductClick(data)}
                >
                  <span
                    style={{
                      fontFamily: 'Uniform Bold',
                    }}
                  >
                    Know More
                  </span>
                </button>
              </Box>
            </Box>
          </Box>
        )} */}
      </Box>
    </Box>
  )
}

export default ProductCollectionCardColumn
