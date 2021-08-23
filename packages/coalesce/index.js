import React from 'react'

import Animation from './Animation'

let ANIMATION_INSTANCE = null
const DEFAULT_PROPS = {
  baseRef: null,
  settings: {},
}

const Caolesce = props => {
  const { baseRef, className, settings, style } = { ...DEFAULT_PROPS, ...props }

  const canvasRef = React.useRef(null)
  const [hasRendered, setHasRendered] = React.useState(false)

  React.useEffect(() => {
    const $canvas = canvasRef.current
    const hasBaseRef = baseRef !== null

    if (hasRendered || $canvas === null || (hasBaseRef && baseRef.current === null)) {
      return () => undefined
    }

    if (ANIMATION_INSTANCE !== null) {
      ANIMATION_INSTANCE.reset(window, $canvas, baseRef?.current, settings)

      return () => ANIMATION_INSTANCE !== null && ANIMATION_INSTANCE.stop()
    }

    setTimeout(
      () => {
        ANIMATION_INSTANCE = new Animation(window, $canvas, baseRef?.current, settings)
      },
      hasBaseRef ? 250 : 0,
    )

    setHasRendered(true)

    return () => ANIMATION_INSTANCE !== null && ANIMATION_INSTANCE.stop()
  }, [baseRef, hasRendered, settings])

  return <canvas ref={canvasRef} className={className} style={style} />
}

export default Caolesce
