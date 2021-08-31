import * as R from 'ramda'
import { useState } from 'react'
import css from 'styled-jsx/css'

import Mixer from '../components/Mixer'
import useObjectEffect from '../hooks/useObjectEffect'
import Pipeline from '../packages/pipeline/index'

const PipelineStyle = css.resolve`
  canvas {
    position: absolute;
  }
`
const MIXER_SETTINGS = [
  ['Base Hue', 'baseHue', [0, 255, 180, 5]],
  ['Base Speed', 'baseSpeed', [0, 1, 0.5, 0.05]],
  ['Base TTL', 'baseTTL', [0, 1000, 100, 50]],
  ['Base Width', 'baseWidth', [0, 10, 2, 1]],
  ['Opacity', 'opacity', [0, 1, 1, 0.1]],
  ['Pipe Count', 'pipeCount', [0, 100, 30, 1]],
  ['Pipe Prop Count', 'pipePropCount', [0, 20, 8, 1]],
  ['Range Hue', 'rangeHue', [0, 255, 60, 5]],
  ['Range Speed', 'rangeSpeed', [0, 10, 1, 1]],
  ['Range TTL', 'rangeTTL', [0, 1000, 300, 50]],
  ['Range Width', 'rangeWidth', [0, 10, 4, 1]],
  ['Turn Chance Range', 'turnChanceRange', [0, 100, 58, 1]],
  ['Turn Count', 'turnCount', [0, 10, 8, 1]],
]

const INITIAL_SETTINGS_VALUES = R.pipe(
  R.map(([, key, [, , value]]) => [key, value]),
  R.fromPairs,
)(MIXER_SETTINGS)

export default function PipelinePage() {
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
      <Pipeline key={animationKey} className={PipelineStyle.className} settings={animationSettings} />
      <Mixer onChange={updateSetting} settings={MIXER_SETTINGS} />

      {PipelineStyle.styles}
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
