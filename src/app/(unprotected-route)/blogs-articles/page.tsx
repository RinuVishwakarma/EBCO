import BlogEventsContainer from '@/components/containers/BlogEventsContainer'
import { Suspense } from 'react'

export const metadata = {
  title: 'Blogs & Articles',
  description: 'Blogs & Articles Description',
}

const BlogEvents = () => {
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
        <BlogEventsContainer />
      </Suspense>
    </div>
  )
}

export default BlogEvents
