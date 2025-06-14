import React, { FC, ReactNode } from 'react'
import { Paper, PaperProps } from '@mui/material'

interface PaperBoxProps extends PaperProps {
  children: ReactNode
  component?: React.ElementType
}

const CustomPaper: FC<PaperBoxProps> = ({ children, sx, ...props }) => {
  return (
    <Paper
      elevation={0}
      variant='outlined'
      sx={{
        p: 3.5,
        borderRadius: '20px',
        border: '1px solid',
				borderColor:"borders.cardborder1",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  )
}

export default CustomPaper
