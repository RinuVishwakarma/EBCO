import PrivacyPolicyContainer from '@/components/containers/PrivacyPolicyContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: '',
}

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PrivacyPolicyContainer />
    </div>
  )
}
