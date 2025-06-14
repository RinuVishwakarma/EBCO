import { Suspense } from 'react'
import DesignerInspiration from '../module-components/DesignerInspiration/DesignerInspiration'

const DesignerInspirationContainer = () => {
  return (
    <Suspense
      fallback={
        <div
          className='loaderr'
          style={{
            height: '90vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        ></div>
      }
    >
      <DesignerInspiration />
    </Suspense>
  )
}

export default DesignerInspirationContainer
