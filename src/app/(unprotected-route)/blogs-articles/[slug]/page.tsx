import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { apiClient } from '@/apiClient/apiService'
import MainBlog from '@/components/module-components/BlogEvents/MainBlog'
import { BlogDetails } from '@/interface/BlogDetails'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

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
        url: `${baseUrl}/blogs-articles/${blogData.slug}`,
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

// Fetch blog details based on slug or ID
const fetchBlogDetailsData = async (param: string): Promise<BlogDetails | null> => {
  try {
    // Check if the parameter is a numeric ID (with optional suffix)
    const isNumericId = /^\d+(-\d+)?$/.test(param);
    
    console.log(`Fetching blog with param: ${param}, isNumericId: ${isNumericId}`);
    
    let response;
    
    if (isNumericId) {
      // If it's a numeric ID, fetch by ID
      // Extract the base ID without the suffix for the API call
      const baseId = param.split('-')[0];
      const url = `${API_ENDPOINT.GET.getBlogs}/${baseId}`;
      console.log(`Fetching by ID: ${url}`);
      
      response = await apiClient.get<BlogDetails>(
        url,
        { acf_format: 'standard' }
      );
    } else {
      // Otherwise, fetch by slug
      const url = `${API_ENDPOINT.GET.getBlogs}`;
      console.log(`Fetching by slug: ${url} with slug=${param}`);
      
      response = await apiClient.get<BlogDetails[]>(
        url,
        { slug: param, acf_format: 'standard' }
      );
    }

    console.log('API Response:', JSON.stringify(response, null, 2));

    if (!response?.data || (Array.isArray(response.data) && response.data.length === 0)) {
      console.log('No blog data found');
      return null;
    }
    
    // Extract the blog details from the response
    const blogData = Array.isArray(response.data) 
      ? response.data[0] 
      : response.data;
    
    console.log('Extracted blog data:', blogData.id, blogData.slug);
    
    return blogData;
  } catch (error) {
    console.error('Failed to fetch blog details:', error);
    return null;
  }
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  console.log('BlogPage rendering with params:', params);
  
  // Fetch the blog data
  const blogData = await fetchBlogDetailsData(params.slug);
  
  if (!blogData) {
    console.log('Blog not found, redirecting to /blogs-articles');
    // If blog not found, redirect to the blogs listing page
    redirect('/blogs-articles');
  }
  
  // If the URL parameter doesn't match the blog's slug, redirect to the proper URL
  if (params.slug !== blogData.slug) {
    console.log(`Redirecting from ${params.slug} to ${blogData.slug}`);
    redirect(`/blogs-articles/${blogData.slug}`);
  }
  
  // Pass the blog data to the MainBlog component
  return <MainBlog initialBlogData={blogData} />;
} 