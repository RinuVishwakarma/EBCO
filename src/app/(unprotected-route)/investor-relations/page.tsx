import InvestorContainer from '@/components/containers/InvestorContainer'
import { Metadata } from 'next'
import { Suspense } from 'react'
export const metadata: Metadata = {
  title:
    'Ebco Investor Relations: AGM Notices Annual Returns and Corporate Policies',
  description:
    "Gain access to Ebco's AGM notices (FY 2014-15 to FY 2022-23), annual returns (FY 2020 – 21 to FY 2022-23), and corporate policies including CSR and IMS. Stay informed about our financial performance and corporate governance standards as part of our commitment to transparency and compliance.",
}

const InvestorRelations = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvestorContainer />
    </Suspense>
  )
}

export default InvestorRelations
