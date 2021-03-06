import { Component, LegacyRef } from 'react';

declare module '@reactnimations/coalesce' {
  export type AnimationSettings = {
    backgroundColor: string
    baseHue: number
    baseSize: number
    baseSpeed: number
    baseTTL: number
    noiseSteps: number
    opacity: number
    particleCount: number
    particlePropCount: number
    rangeHue: number
    rangeSize: number
    rangeSpeed: number
    rangeTTL: number
    rangeY: number
    xOff: number
    yOff: number
    zOff: number
  }

  export interface CoalesceProps {
    baseRef?: LegacyRef<HTMLElement>
    settings?: AnimationSettings
  }


  export default class Coalesce extends Component<CoalesceProps, {}> {}
}
