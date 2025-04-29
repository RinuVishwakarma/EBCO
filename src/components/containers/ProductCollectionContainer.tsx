import React from 'react'
import ProductCollection from '../module-components/ProductCollection/ProductCollection'

function ProductCollectionContainer({ slug }: { slug: string }) {
  return <ProductCollection slug={slug} />
}

export default ProductCollectionContainer
