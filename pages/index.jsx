import Swirl from '@reactnimations/swirl'
import * as R from 'ramda'
import { useState } from 'react'
import css from 'styled-jsx/css'

import Mixer from '../components/Mixer'
import useObjectEffect from '../hooks/useObjectEffect'

const SwirlStyle = css.resolve`
  canvas {
    position: absolute;
  }
`
const MIXER_SETTINGS = [
  ['Base Hue', 'baseHue', [0, 255, 220, 5]],
  ['Base Radius', 'baseRadius', [0, 1, 1, 0.1]],
  ['Base Speed', 'baseSpeed', [0, 1, 0.1, 0.05]],
  ['Base TTL', 'baseTTL', [0, 1000, 50, 50]],
  ['Noise Steps', 'noiseSteps', [0, 10, 8, 1]],
  ['Opacity', 'opacity', [0, 1, 1, 0.1]],
  ['particleCount', 'particleCount', [0, 2000, 700, 100]],
  ['particlePropCount', 'particlePropCount', [9, 20, 9, 1]],
  ['Range Hue', 'rangeHue', [0, 255, 100, 5]],
  ['Range Radius', 'rangeRadius', [0, 10, 4, 1]],
  ['Range Speed', 'rangeSpeed', [0, 10, 2, 1]],
  ['Range TTL', 'rangeTTL', [0, 1000, 150, 50]],
  ['rangeY', 'rangeY', [0, 1000, 100, 50]],
  ['X Offset', 'xOff', [0, 0.005, 0.00125, 0.00025]],
  ['Y Offset', 'yOff', [0, 0.005, 0.00125, 0.00025]],
  ['Z Offset', 'zOff', [0, 0.001, 0.0005, 0.0001]],
]

const INITIAL_SETTINGS_VALUES = R.pipe(
  R.map(([, key, [, , value]]) => [key, value]),
  R.fromPairs,
)(MIXER_SETTINGS)

export default function IndexPage() {
  const [animationKey, setAnimationKey] = useState(1)
  const [animationSettings, setAnimationSettings] = useState(INITIAL_SETTINGS_VALUES)

  const updateSetting = (key, value) => {
    setAnimationSettings({
      ...animationSettings,
      [key]: value,
    })
  }

  useObjectEffect(() => {
    setAnimationKey(animationKey + 1)
  }, animationSettings)

  return (
    <>
      <Swirl key={animationKey} className={SwirlStyle.className} settings={animationSettings} />
      <Mixer onChange={updateSetting} settings={MIXER_SETTINGS} />

      {SwirlStyle.styles}
      <style jsx>{`
        div {
          color: white;
          display: flex;
          height: 20%;
          right: 5%;
          position: absolute;
          bottom: 5%;
          width: auto;
        }
      `}</style>
    </>
  )
}
