import { Box, CircularProgress } from '@mui/material'
import React from 'react'

interface Props {
  width?: number | string
  height?: number | string
}

const Loader = (props: Props) => {
  const { width = '100%', height = 250 } = props
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width, height }}>
      <CircularProgress />
    </Box>
  )
}

export default Loader
