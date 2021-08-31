import debounce from 'lodash.debounce'

const HALF_PI = 0.5 * Math.PI
const TAU = 2 * Math.PI
const TO_RAD = Math.PI / 180

const fadeInOutWithOpacity = (t, m, o) => {
  const hm = 0.5 * m
  const fio = 0.125 * (Math.abs(((t + hm) % m) - hm) / hm)
  const fiowo = fio * o

  return fiowo
}
const rand = n => n * Math.random()

const DEFAULT_SETTINGS = {
  backgroundColor: 'hsla(0, 0%, 0%, 1)',
  baseHue: 180,
  baseSpeed: 0.5,
  baseTTL: 100,
  baseWidth: 2,
  opacity: 1,
  pipeCount: 30,
  pipePropCount: 8,
  rangeHue: 60,
  rangeSpeed: 1,
  rangeTTL: 300,
  rangeWidth: 4,
  turnChanceRange: 58,
  turnCount: 8,
}

/**
 * @see https://github.com/crnacura/AmbientCanvasBackgrounds
 */
export default class Animation {
  constructor($window, $canvas, $base = null, settings = {}) {
    this.reset($window, $canvas, $base, settings)
  }

  reset($window, $canvas, $base = null, settings) {
    const {
      backgroundColor,
      baseHue,
      baseSpeed,
      baseTTL,
      baseWidth,
      opacity,
      pipeCount,
      pipePropCount,
      rangeHue,
      rangeSpeed,
      rangeTTL,
      rangeWidth,
      turnChanceRange,
      turnCount,
    } = {
      ...DEFAULT_SETTINGS,
      ...settings,
    }

    this.$window = $window
    this.$canvas = $canvas
    this.$base = $base

    this.backgroundColor = backgroundColor
    this.baseHue = baseHue
    this.baseSpeed = baseSpeed
    this.baseTTL = baseTTL
    this.baseWidth = baseWidth
    this.opacity = opacity
    this.pipeCount = pipeCount
    this.pipePropCount = pipePropCount
    this.rangeHue = rangeHue
    this.rangeSpeed = rangeSpeed
    this.rangeTTL = rangeTTL
    this.rangeWidth = rangeWidth
    this.turnChanceRange = turnChanceRange
    this.turnCount = turnCount

    this.pipePropsLength = this.pipeCount * this.pipePropCount
    this.turnAmount = (360 / this.turnCount) * TO_RAD

    this.canvas = null
    this.center = []
    this.container = null
    this.ctx = null
    this.pipeProps = new Float32Array(this.pipePropsLength)
    this.tick = 0

    this.isListeningToResize = false
    this.debouncedResize = debounce(this.resize.bind(this), 250)

    this.start()
  }

  start() {
    this.createCanvas()
    this.resize()
    this.initPipes()
    this.draw()
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrameId)
  }

  createCanvas() {
    this.canvas = {
      a: this.canvas === null ? this.$window.document.createElement('canvas') : this.canvas.a,
      b: this.$canvas,
    }

    this.ctx = {
      a: this.canvas.a.getContext('2d'),
      b: this.canvas.b.getContext('2d'),
    }
  }

  resize() {
    if (this.isListeningToResize) {
      this.$window.removeEventListener('resize', this.debouncedResize)

      this.isListeningToResize = false
    }

    const width = this.$base !== null ? this.$base.offsetWidth : this.$window.innerWidth
    const height = this.$base !== null ? this.$base.offsetHeight : this.$window.innerHeight

    this.canvas.a.width = width
    this.canvas.a.height = height

    this.ctx.a.drawImage(this.canvas.b, 0, 0)

    this.canvas.b.width = width
    this.canvas.b.height = height

    this.ctx.b.drawImage(this.canvas.a, 0, 0)

    this.center[0] = 0.5 * this.canvas.a.width
    this.center[1] = 0.5 * this.canvas.a.height

    if (!this.isListeningToResize) {
      this.$window.addEventListener('resize', this.debouncedResize)

      this.isListeningToResize = true
    }
  }

  initPipes() {
    for (let i = 0; i < this.pipePropsLength; i += this.pipePropCount) {
      this.initPipe(i)
    }
  }

  initPipe(i) {
    const x = rand(this.canvas.a.width)
    const y = this.center[1]
    const direction = Math.round(rand(1)) ? HALF_PI : TAU - HALF_PI
    const speed = this.baseSpeed + rand(this.rangeSpeed)
    const life = 0
    const ttl = this.baseTTL + rand(this.rangeTTL)
    const width = this.baseWidth + rand(this.rangeWidth)
    const hue = this.baseHue + rand(this.rangeHue)

    this.pipeProps.set([x, y, direction, speed, life, ttl, width, hue], i)
  }

  updatePipes() {
    this.tick += 1

    for (let i = 0; i < this.pipePropsLength; i += this.pipePropCount) {
      this.updatePipe(i)
    }
  }

  updatePipe(i) {
    const i2 = 1 + i
    const i3 = 2 + i
    const i4 = 3 + i
    const i5 = 4 + i
    const i6 = 5 + i
    const i7 = 6 + i
    const i8 = 7 + i

    let x = this.pipeProps[i]
    let y = this.pipeProps[i2]
    let direction = this.pipeProps[i3]
    const speed = this.pipeProps[i4]
    let life = this.pipeProps[i5]
    const ttl = this.pipeProps[i6]
    const width = this.pipeProps[i7]
    const hue = this.pipeProps[i8]

    this.drawPipe(x, y, life, ttl, width, hue)

    life += 1
    x += Math.cos(direction) * speed
    y += Math.sin(direction) * speed
    const turnChance =
      !(this.tick % Math.round(rand(this.turnChanceRange))) && (!(Math.round(x) % 6) || !(Math.round(y) % 6))
    const turnBias = Math.round(rand(1)) ? -1 : 1
    direction += turnChance ? this.turnAmount * turnBias : 0

    this.pipeProps[i] = x
    this.pipeProps[i2] = y
    this.pipeProps[i3] = direction
    this.pipeProps[i5] = life

    if (this.checkBounds(x, y) || life > ttl) {
      this.initPipe(i)
    }
  }

  drawPipe(x, y, life, ttl, width, hue) {
    this.ctx.a.save()
    this.ctx.a.strokeStyle = `hsla(${hue},75%,50%,${fadeInOutWithOpacity(life, ttl, this.opacity)})`
    this.ctx.a.beginPath()
    this.ctx.a.arc(x, y, width, 0, TAU)
    this.ctx.a.stroke()
    this.ctx.a.closePath()
    this.ctx.a.restore()
  }

  checkBounds(x, y) {
    return x > this.canvas.a.width || x < 0 || y > this.canvas.a.height || y < 0
  }

  render() {
    this.ctx.b.save()
    this.ctx.b.fillStyle = this.backgroundColor
    this.ctx.b.fillRect(0, 0, this.canvas.b.width, this.canvas.b.height)
    this.ctx.b.restore()

    this.ctx.b.save()
    this.ctx.b.filter = 'blur(12px)'
    this.ctx.b.drawImage(this.canvas.a, 0, 0)
    this.ctx.b.restore()

    this.ctx.b.save()
    this.ctx.b.drawImage(this.canvas.a, 0, 0)
    this.ctx.b.restore()
  }

  draw() {
    this.updatePipes()

    this.render()

    this.animationFrameId = this.$window.requestAnimationFrame(this.draw.bind(this))
  }
}
