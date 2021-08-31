# Reactnimations Pipeline

_This is a work in progress._

## Usage

```sh
npm/yarn i -E @reactnimations/pipeline
```

```js
import Pipeline from '@reactnimations/pipeline'

const MyComponents = () => (
  <>
    <Pipeline />
    <div style={{ position: "absolute" }}>
      <h1>Pipeline Animation as a fullscreen background!</h1>
      <h2>What else?</h1>
    </div>
  </>
)
```

### Properties

Everything is optional.

- `baseRef`: Element on which basing the canvas size. Otherwise, if not set, `window` will be the reference, resizing
  the animation to the current `window` size.
- `settings`: Animation settings. [See below.](#settings)

Also, `className` and `style` are exposed.

#### Settings

```ts
{
  backgroundColor: string
  baseHue: number
  baseRadius: number
  baseSpeed: number
  baseTTL: number
  noiseSteps: number
  opacity: number
  particleCount: number
  particlePropCount: number
  rangeHue: number
  rangeRadius: number
  rangeSpeed: number
  rangeTTL: number
  rangeY: number
  xOff: number
  yOff: number
  zOff: number
}
```

Check the [source code](https://github.com/ivangabriele/reactnimations/blob/main/packages/pipeline/Animation.js) to see
the default values.

## Credits

- [Ambient Canvas Backgrounds](https://github.com/crnacura/AmbientCanvasBackgrounds)
  by [Mary Lou](https://github.com/crnacura) / [Codrops](https://tympanus.net/codrops/)

## Animation License

This resource can be used freely if integrated or build upon in personal or commercial projects such as websites, web
apps and web templates intended for sale. It is not allowed to take the resource "as-is" and sell it, redistribute,
re-publish it, or sell "pluginized" versions of it. Free plugins built using this resource should have a visible mention
and link to the original work. Always consider the licenses of all included libraries, scripts and images used.
