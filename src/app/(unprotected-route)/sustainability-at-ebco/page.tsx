import SustainabilityContainer from '@/components/containers/SustainabiltiyContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sustainability: Committed to Environmental Excellence',
  description:
    'Ebco proudly holds ISO 14001:2015 certification ensuring a systematic approach to environmental management. Learn how our operations prioritize sustainability and eco-friendly practices.',
}

const SustainabilityAtEbco = () => {
  return (
    <div>
      <SustainabilityContainer />
    </div>
  )
}

export default SustainabilityAtEbco
