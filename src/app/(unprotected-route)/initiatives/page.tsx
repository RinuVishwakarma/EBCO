import InitiativeContainer from '@/components/containers/InitiativeContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ebco Initiatives: Driving Positive Change in Communities',
  description:
    "Explore Ebco's impactful initiatives from installing solar streetlights for safety in rural areas to promoting health and hygiene interventions and supporting educational initiatives like Just for Kicks. Learn how we're making a difference in communities.",
}

const InitiativeAtEbco = () => {
  return (
    <div>
      <InitiativeContainer />
    </div>
  )
}

export default InitiativeAtEbco
