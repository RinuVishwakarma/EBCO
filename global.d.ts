declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': ModelViewerJSX &
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
  }
}

interface ModelViewerJSX {
  src: string
  poster?: string
  iosSrc?: string
  seamlessPoster?: boolean
  autoplay?: boolean
  environmentImage?: string
  exposure?: string
  loading?: string
  arScale?: string
  interactionPromptThreshold?: string
  disableZoom?: boolean
  shadowIntensity?: string
  ar?: boolean
  arModes?: string
  autoRotate?: boolean
  cameraControls?: boolean
  cameraOrbit?: string
  alt?: string
}
