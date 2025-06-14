import NewsEventsContainer from '@/components/containers/NewsEventsContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News and Events',
  description: '',
}

const NewsAndEvents = () => {
  return <NewsEventsContainer />
}
export default NewsAndEvents
