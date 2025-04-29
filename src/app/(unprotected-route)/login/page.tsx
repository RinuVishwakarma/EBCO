import { Box } from '@mui/material'
import LoginContainer from '@/components/containers/LoginContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login ',
  description: '',
}

const Login = () => {
  return (
    <Box
      className='login-image-text-container'
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <LoginContainer />
    </Box>
  )
}

export default Login
