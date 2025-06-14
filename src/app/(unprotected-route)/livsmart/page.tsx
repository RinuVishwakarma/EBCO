import ProductPageContainer from '@/components/containers/ProductPageContainer'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Livsmart by Ebco: Intelligent Hardware for Homes',
  description:
    "Ebco's product range spans Drawer Slides, Hinges, Computer Furniture Fittings, Joinery Fittings, Wardrobe Fittings, Furniture Locks, Kitchen Systems and Accessories, Window and Door Fittings, Architectural Fittings, LED Lights and more.",
  keywords: 'Ebco, LivSmart Products, Kitchen Systems & Accessories',
}

const livsmart = () => {
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
        <ProductPageContainer type='Livsmart' />
      </Suspense>
    </div>
  )
}

export default livsmart
