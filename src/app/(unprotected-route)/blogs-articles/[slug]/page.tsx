import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { apiClient } from '@/apiClient/apiService'
import MainBlog from '@/components/module-components/BlogEvents/MainBlog'
import { BlogDetails } from '@/interface/BlogDetails'
import { Metadata } from 'next'
import { headers } from 'next/headers'

// This function will generate dynamic metadata
export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> => {
  try {
    const headersList = headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'https'

    const baseUrl = `${protocol}://${host}`

    // Fetch data using the slug from URL
    const blogData = await fetchBlogDetailsData(params.slug)

    if (!blogData) {
      return {
        title: 'Blog not found',
        description: 'The blog you are looking for does not exist.',
      }
    }

    // Dynamic title and description based on the blog data
    return {
      title: blogData.title.rendered || 'Blog Details',
      description: blogData.content.rendered || 'Blog Description',
      openGraph: {
        title: blogData.title.rendered || 'Blog Details',
        description: blogData.content.rendered || 'Blog Description',
        url: `${baseUrl}/blogs-articles/${params.slug}`,
        siteName: 'Ebco',
        images: [
          {
            url: blogData.featured_media_src_url,
          },
        ],
      },
    }
  } catch (error) {
    console.error('Error fetching blog data for metadata:', error)
    return {
      title: 'Blog not found',
      description: 'The blog you are looking for does not exist.',
    }
  }
}

const BlogsEvents = async ({ params }: { params: { slug: string } }) => {
  return <MainBlog />
}

// Fetch blog details based on slug
const fetchBlogDetailsData = async (slug: string): Promise<BlogDetails> => {
  try {
    const response = await apiClient.get<BlogDetails[]>(
      `${API_ENDPOINT.GET.getBlogs}?slug=${slug}&acf_format=standard`,
    )

    if (!response || !response.data || response.data.length === 0) {
      throw new Error('No data found')
    }
    
    return response.data[0] // WordPress returns an array, we want the first item
  } catch (error) {
    console.error('Failed to fetch blog details:', error)
    throw new Error('Failed to fetch blog details')
  }
}

export default BlogsEvents
