import ProductCollectionContainer from '@/components/containers/ProductCollectionContainer'
import React from 'react'

const ProductsCollection = ({ params }: { params: { slug: string } }) => {
  return <ProductCollectionContainer slug={params.slug} />
}

export default ProductsCollection
