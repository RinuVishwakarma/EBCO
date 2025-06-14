import TermsOfUseContainer from '@/components/containers/TermsOfUse'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: '',
}

export default function TermsOfUse() {
  return <TermsOfUseContainer />
}
