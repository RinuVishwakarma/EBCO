import React, { FC, ReactNode } from 'react'
import { Paper, PaperProps } from '@mui/material'

interface PaperBoxProps extends PaperProps {
  children: ReactNode
  component?: React.ElementType
}

const BoxShadowWrapper: FC<PaperBoxProps> = ({ children, sx, ...props }) => {
  return (
    <Paper
      elevation={0}
      variant='elevation'
      sx={{
        p: 2,
       boxShadow:'0px 10px 12px 0px #B5B5B540',

        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  )
}

export default BoxShadowWrapper
