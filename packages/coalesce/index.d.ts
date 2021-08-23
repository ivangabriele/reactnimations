import { Component, LegacyRef } from 'react';

declare module '@reactnimations/swirl' {
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

  export interface SwirlProps {
    baseRef?: LegacyRef<HTMLElement>
    settings?: AnimationSettings
  }


  export default class Swirl extends Component<SwirlProps, {}> {}
}
