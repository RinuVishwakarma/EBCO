import ProductDetailsPage from '@/components/utils-components/ProductDetails'
import { Metadata } from 'next'
import { apiClient } from '@/apiClient/apiService'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint' // Adjust import path as necessary
import type { ProductDetails } from '@/interface/productDetails'

import { headers } from 'next/headers'

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> => {
  const headersList = headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || 'https'

  const baseUrl = `${protocol}://${host}`

  const productData = await fetchInitialData(params.slug)

  if (!productData) {
    return {
      title: 'Product not found',
      description: 'The product you are looking for does not exist.',
    }
  }
  let extractedDescription = productData.description
  if (productData?.description) {
    const listItemMatches = productData.description.match(/<li>(.*?)<\/li>/g)

    if (listItemMatches) {
      extractedDescription = listItemMatches
        .map((item: string) => item.replace(/<\/?li>/g, ''))
        .join('. ')
    } else {
      extractedDescription = productData.description // Fallback to the whole content if no <li> is found
    }
  }

  return {
    title: productData.name || 'Product Details',
    description: extractedDescription,
    openGraph: {
      title: productData.name,
      description: extractedDescription,
      url: `${baseUrl}/ebco/${params.slug}`,
      siteName: 'Ebco',
      images: [
        {
          url: productData.images[0].src, // Must be an absolute URL
        },
      ],
    },
  }
}

const ProductDetails = async ({ params }: { params: { slug: string } }) => {
  return <ProductDetailsPage slug={params.slug} />
}

export default ProductDetails

const fetchInitialData = async (slug: string) => {
  try {
    const response = await apiClient.get<ProductDetails[]>(
      ` ${API_ENDPOINT.GET.get_prod_products}?slug=${slug}&acf_format=standard`,
    )

    // if (!response || !response.data || response.data.length === 0) {
    //   throw new Error('No data found')
    // }
    return response.data[0] // Assuming the first item is the relevant product
  } catch (error) {
    console.error('Failed to fetch product data', error)
    return null
  }
}
