'use client'

import SegmentFocused from '../module-components/SegmentFocused/SegmentFocused'

interface typeInterface {
  slug: string
}
const SegmentFocusedContainer:React.FC<typeInterface>  = ({slug}) => {
  return <SegmentFocused slug={slug} />
}

export default SegmentFocusedContainer
