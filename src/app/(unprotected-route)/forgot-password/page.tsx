import { Box } from '@mui/material'
import ForgotPasswordContainer from '@/components/containers/ForgotPasswordContainer'

const ForgotPassword = () => {
  return (
    <Box
      className='login-image-text-container'
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <ForgotPasswordContainer />
    </Box>
  )
}

export default ForgotPassword
