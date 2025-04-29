import { FeaturesData, Layout3 } from '@/interface/BlogDetails'
import { Box } from '@mui/material'
import React from 'react'
import './BlogEvents.css'

interface BlogThreeProps {
  content: string
}

const BlogFour: React.FC<BlogThreeProps> = ({ content }) => {
  return (
    <Box
      sx={{ p: 2 }}
      className='blog-text-container'
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    ></Box>
  )
}

export default BlogFour
