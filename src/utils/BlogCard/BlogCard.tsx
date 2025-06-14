import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { convertHtmltoArray, decodeHtml } from '../convertHtmltoArray'
import { Blogs } from '@/interface/Blog'

interface BlogCardProps {
  data: Blogs
  selectedItem: string | null
  handleProductClick: (data: Blogs) => void
  //   isShopNow: (data: NewProduct) => boolean
}

const BlogCard: React.FC<BlogCardProps> = ({
  data,
  selectedItem,
  handleProductClick,
}) => {
  return (
    <Box className='product-card' onClick={() => handleProductClick(data)}>
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
              src={
                data?.featured_media_src_url
                  ? data?.featured_media_src_url
                  : '/images/default.png'
              }
              // src={'/images/default.png'}
              className=''
              alt={'Image'}
              width={300}
              height={300}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              onClick={() => {}}
            />
          )}

          {/* <Box
            sx={{
              position: 'absolute',
              top: '0px',
              left: '-4px',
              textAlign: 'center',
              width: 62,
              height: 26,
              color: customColors.darkBlueEbco, // Customize color
              backgroundColor: theme.palette.primary.light,
              borderTopLeftRadius: '2px',
              borderBottomRightRadius: '20px',
              padding: '2px',
              boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography>Tag</Typography>
          </Box> */}
        </Box>
      </Link>
      <Box
        className='blog-info-container'
        sx={{ display: 'flex', justifyContent: 'initial !important' }}
      >
        <Box className='product-info' onClick={() => handleProductClick(data)}>
          <Tooltip title={decodeHtml(data.title.rendered)} placement='bottom'>
            <Typography className='product-title blog-list-title'>
              {decodeHtml(data.title.rendered)}
            </Typography>
          </Tooltip>
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

export default BlogCard
