import ProductPageContainer from '@/components/containers/ProductPageContainer'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Worksmart by Ebco: Ergonomic Hardware for Offices',
  description:
    'Explore Worksmart by Ebco, offering cutting-edge office furniture fittings designed to optimize your workspace. Enhance productivity with our innovative solutions.',
  keywords:
    'Ebco, WorkSmart, Offices, Ergonomic, Convenient, Furniture Fittings'
}

const worksmart = () => {
  return (
    <>
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
                alignItems: 'center'
              }}
            ></div>
          }
        >
          <ProductPageContainer type='Worksmart' />
        </Suspense>
      </div>
    </>
  )
}

export default worksmart
