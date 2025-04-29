import ResetPasswordContainer from '@/components/containers/ResetPasswordContainer'
import { Box } from '@mui/material'

const ResetPassword = () => {
  return (
    <Box
      className='login-image-text-container'
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* <ImageSection imageProp={BannerImage} /> */}
      <ResetPasswordContainer />
    </Box>
  )
}

export default ResetPassword
