import AboutUsContainer from '@/components/containers/AboutUsContainer'
import { Box } from '@mui/material'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Ebco ',
  description: '',
}

const AboutUs = () => {
  return (
    <Box>
      <AboutUsContainer />
    </Box>
  )
}

export default AboutUs
