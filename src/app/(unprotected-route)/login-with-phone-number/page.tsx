import { Box } from '@mui/material'
import LoginWithPhoneNumberContainer from '@/components/containers/LoginWithPhoneNumberContainer'

const LoginWithPhoneNumber = () => {
  return (
    <Box
      className='login-image-text-container'
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <LoginWithPhoneNumberContainer />
    </Box>
  )
}

export default LoginWithPhoneNumber
