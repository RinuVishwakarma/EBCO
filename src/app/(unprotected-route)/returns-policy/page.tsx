import ReturnPolicyContainer from '@/components/containers/ReturnPolicyContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Return Policy',
  description: '',
}

export default function ReturnPolicy() {
  return <ReturnPolicyContainer />
}
