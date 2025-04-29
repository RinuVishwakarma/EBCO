import React, { useEffect, useRef, useState } from 'react'
import Loader from './Loader'

interface ModelData {
  src: string
  ar: boolean | undefined
  style?: React.CSSProperties
  rest?: Object
}

const ModelViewer: React.FC<ModelData> = ({ src, ar, style, rest }) => {
  const modelViewerRef = useRef<HTMLDivElement & { addEventListener: any }>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const loadModelViewer = async () => {
      try {
        await import('@google/model-viewer/lib/model-viewer')
      } catch (error) {
        console.error('Error loading model-viewer:', error)
      }
    }
    loadModelViewer()
    return () => {}
  }, [])

  useEffect(() => {
    const modelViewer = modelViewerRef.current
    if (modelViewer) {
      const handleModelLoaded = () => {
        setIsLoading(false)
      }
      modelViewer.addEventListener('load', handleModelLoaded)

      return () => {
        modelViewer.removeEventListener('load', handleModelLoaded)
      }
    }
  }, [])
  return (
    <>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <Loader />
        </div>
      )}
      {
        <model-viewer
          ref={modelViewerRef}
          src={src}
          ios-src={src}
          seamless-poster
          environment-image='neutral'
          exposure='2'
          interaction-prompt-threshold='0'
          shadow-intensity='1'
          loading='eager'
          autoplay
          ar-modes='scene-viewer quick-look'
          auto-rotate
          camera-controls
          camera-orbit='0deg 90deg 0deg 8.37364m'
          alt='3D model'
          style={style}
          ar={ar} // Pass the ar prop to model-viewer
          {...rest} // Spread any additional props
        ></model-viewer>
      }
    </>
  )
}

export default ModelViewer
