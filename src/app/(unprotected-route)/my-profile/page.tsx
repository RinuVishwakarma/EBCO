import MyProfileContainer from '@/components/containers/MyProfileContainer'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'My Account',
  description: '',
}

const MyProfile = () => {
  return <MyProfileContainer />
}
export default MyProfile
