'use client'
import React, { FC, ReactNode, useEffect } from 'react'
import {
  Box,
  Paper,
  PaperProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Image from 'next/image' // Import Next.js Image component
import { StaticImageData } from 'next/image'
import EbcoDarkLogo from '../../../public/images/EbcoLogo.svg'
import { useWhiteParagraphStyle } from '@/utils/CommonStyling'
import dynamic from 'next/dynamic'
import './overlayWrapper.css'
// import video from ""

interface OverlayProps extends PaperProps {
  children: ReactNode
  component?: React.ElementType
  media: string // Adjusted the type to StaticImageData
  isVideo?: boolean
}

const OverlayWrapper: FC<OverlayProps> = ({
  children,
  sx,
  media,
  isVideo,
  ...props
}) => {
  const [propImg, setPropImg] = React.useState(media)
  const theme = useTheme()
  const whiteParagraphStyle = useWhiteParagraphStyle()
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('md'),
  )
  useEffect(() => {}, [])
  //console.log(isSmallScreen, "isSmallScreen");
  return (
    <Box>
      <Box
        className={`${
          isVideo ? 'video' : 'image'
        }-overlay-container column-space-between`}
      >
        {isVideo && media ? (
          <video
            autoPlay
            loop
            controlsList='nodownload'
            muted
            className='overlay-video w-100 h-100'
          >
            <source src={media} type='video/mp4' />
          </video>
        ) : !isVideo && media ? (
          <Image
            src={media}
            alt='overlay'
            className='overlay-image'
            width={1000}
            height={600}
          />
        ) : (
          <div
            className='about-us-hero-loader'
            style={{
              width: '100%',
              height: isSmallScreen ? '300px' : '100vh',
            }}
          ></div>
        )}
      </Box>

      <Box className='overlay-text-logo-container column-space-between'>
        <Box className='text-logo row-space-between'>
          <Box className='overlay-text'>{children}</Box>
          {/* <Box className="overlay-logo row-center desktop-view">
            <Image
              src={"/images/logo/ebco-white.svg"}
              alt="Ebco Logo"
              width={200}
              height={200}
            />
          </Box> */}
        </Box>
      </Box>
    </Box>
  )
}

export default OverlayWrapper
