import { Component, LegacyRef } from 'react';

declare module '@reactnimations/pipeline' {
  export type AnimationSettings = {
    backgroundColor: string
    baseHue: number
    baseSpeed: number
    baseTTL: number
    baseWidth: number
    opcaity: number
    pipeCount: number
    pipePropCount: number
    rangeHue: number
    rangeSpeed: number
    rangeTTL: number
    rangeWidth: number
    turnChanceRange: number
    turnCount: number
  }

  export interface PipelineProps {
    baseRef?: LegacyRef<HTMLElement>
    settings?: AnimationSettings
  }


  export default class Pipeline extends Component<PipelineProps, {}> {}
}
