import ProductPageContainer from '@/components/containers/ProductPageContainer'
import { Suspense } from 'react'

const shopNow = () => {
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
              alignItems: 'center'
            }}
          ></div>
        }
      >
        <ProductPageContainer type='shop-now' />
      </Suspense>
    </div>
  )
}

export default shopNow
