import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

import { getCategoryByName } from '../getCategoryByName'
import { convertHtmltoArray, decodeHtml } from '../convertHtmltoArray'
import formatPrice from '../formatPrice'
import {
  containsScreenReaderText,
  extractRegularPrice,
  extractSalePrice,
} from '../extractPrice'

import { NewProduct } from '@/interface/NewProductDetails'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import { Blogs } from '@/interface/Blog'

interface BlogCardProps {
  data: Blogs
  selectedItem: string | null
  handleProductClick: (data: Blogs) => void
}

const BlogCardMobile: React.FC<BlogCardProps> = ({
  data,
  selectedItem,
  handleProductClick,
}) => {
  return (
    <Box className='product-card' key={decodeHtml(data.title.rendered)}>
      <Link
        prefetch={false}
        href={`/blogs-articles/${data.slug}`}
        style={{ width: '100%' }}
      >
        <Box
          className='product-image-container'
          sx={{
            position: 'relative',
          }}
        >
          {data?.featured_media_src_url && (
            <Image
              src={data?.featured_media_src_url}
              alt='product image'
              width={300}
              height={300}
              // className='product-image-item'
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              onClick={() => {
                // //console.log("clicked");
                handleProductClick(data)
              }}
            />
          )}

          {/* {
            <Box
              sx={{
                position: 'absolute',
                top: '0px',
                left: '-4px',
                textAlign: 'center',
                width: 60,
                height: 26,
                color: customColors.darkBlueEbco, // Customize color
                backgroundColor: customColors.whiteEbco,
                borderRadius: '12%',
                padding: '2px',
                boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Typography>Tag</Typography>
            </Box>
          } */}
        </Box>
      </Link>
      <Box className='product-info-container '>
        <Box className='product-info'>
          <Typography
            className='product-title'
            onClick={() => {
              handleProductClick(data)
            }}
          >
            {decodeHtml(data.title.rendered)}
          </Typography>
        </Box>

        <Box
          className='blog-title'
          sx={{
            color: '#5B5B5B',
            fontSize: 16,
            fontFamily: 'Montserrat',
            fontWeight: 400,
            lineHeight: 20,
          }}
        >
          <Typography>{convertHtmltoArray(data.content.rendered)}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default BlogCardMobile
