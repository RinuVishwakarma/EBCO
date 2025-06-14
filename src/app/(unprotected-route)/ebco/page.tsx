import ProductPageContainer from '@/components/containers/ProductPageContainer'
import { Suspense } from 'react'

export const metadata = {
  title: 'Ebco - Furniture Fittings and Accessories',
  description:
    "Ebco's product range spans Drawer Slides, Hinges, Computer Furniture Fittings, Joinery Fittings, Wardrobe Fittings, Furniture Locks, Kitchen Systems and Accessories, Window and Door Fittings, Architectural Fittings, LED Lights and more.",
  keywords: 'Drawer Slides & Hinges, General Hardware, Architectural Hardware',
}

const Ebco = () => {
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
        <ProductPageContainer type='Ebco' />
      </Suspense>
    </div>
  )
}

export default Ebco
