import ProductDetailsPage from "@/components/utils-components/ProductDetails"

const ProductDetails = ({ params }: { params: { slug: string } }) => {
  return <ProductDetailsPage slug={params.slug} />
}

export default ProductDetails