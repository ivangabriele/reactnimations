import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

import Animation from './Animation'

let ANIMATION_INSTANCE = null

const Swirl = ({ baseRef, className, settings, style }) => {
  const canvasRef = useRef(null)
  const [hasRendered, setHasRendered] = useState(false)

  useEffect(() => {
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

Swirl.defaultProps = {
  baseRef: null,
  settings: {},
}

Swirl.propTypes = {
  baseRef: PropTypes.element,
  settings: PropTypes.shape({
    backgroundColor: PropTypes.string,
    baseHue: PropTypes.number,
    baseRadius: PropTypes.number,
    baseSpeed: PropTypes.number,
    baseTTL: PropTypes.number,
    noiseSteps: PropTypes.number,
    opacity: PropTypes.number,
    particleCount: PropTypes.number,
    particlePropCount: PropTypes.number,
    rangeHue: PropTypes.number,
    rangeRadius: PropTypes.number,
    rangeSpeed: PropTypes.number,
    rangeTTL: PropTypes.number,
    rangeY: PropTypes.number,
    xOff: PropTypes.number,
    yOff: PropTypes.number,
    zOff: PropTypes.number,
  }),
}

export default Swirl
