import ProductPageContainer from '@/components/containers/ProductPageContainer'
import SegmentFocusedContainer from '@/components/containers/SegmentFocusedContainer'
import { Suspense } from 'react'

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const formattedTitle = `${params.slug
    .replace(/-/g, ' ') // Replace dashes with spaces
    .replace(/\b\w/g, char => char.toUpperCase())}`

  return {
    title: formattedTitle,
    description: 'Description',
  }
}

const SegmentDetails = async ({ params }: { params: { slug: string } }) => {
  return (
    <div>
      <Suspense
        fallback={
          <div
            className='new-arrival-loader'
            style={{
              height: '80vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          ></div>
        }
      >
        <SegmentFocusedContainer slug={params.slug} />
      </Suspense>
    </div>
  )
}

export default SegmentDetails
