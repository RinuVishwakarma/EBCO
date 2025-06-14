'use client'
import { useEffect, useRef } from 'react'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const video = videoRef.current

      if (video) {
        // Calculate the scroll position as a fraction of the total scrollable height
        const scrollTop = window.scrollY
        const scrollHeight = document.body.scrollHeight - window.innerHeight

        const scrollFraction = scrollTop / scrollHeight

        // Set the video's currentTime based on scrollFraction
        const videoDuration = video.duration || 0 // Handle case where duration is not yet available
        const scrubTime = scrollFraction * videoDuration

        if (!isNaN(scrubTime)) {
          video.currentTime = scrubTime
        }
      }
    }

    // Add a scroll listener
    window.addEventListener('scroll', handleScroll)

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      style={{
        height: '300vh', // Enough height to allow scrolling
        backgroundColor: '#000',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh', // Video remains fullscreen
        }}
      >
        {/* Video Player */}
        <video
          ref={videoRef}
          // src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          src='https://dashboard.ebco.in/wp-content/uploads/2024/12/cac4-4d23-b07a-347d173d6d56.mp4'
          muted
          playsInline
          style={{
            width: '100%',
            maxWidth: '900px', // Keep the video centered and clean
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  )
}
