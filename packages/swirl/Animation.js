import debounce from 'lodash.debounce'
import SimplexNoise from 'simplex-noise'

const TAU = 2 * Math.PI

const rand = n => n * Math.random()
const randRange = n => n - rand(2 * n)
const fadeInOutWithOpacity = (t, m, o) => {
  const hm = 0.5 * m
  const fo = Math.abs(((t + hm) % m) - hm) / hm
  const ff = Math.max(0, fo - Math.abs(o - 1))

  return ff
}
const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2

const DEFAULT_SETTINGS = {
  backgroundColor: 'hsla(0, 0%, 0%, 1)',
  baseHue: 220,
  baseRadius: 1,
  baseSpeed: 0.1,
  baseTTL: 50,
  noiseSteps: 8,
  opacity: 1,
  particleCount: 700,
  particlePropCount: 9,
  rangeHue: 100,
  rangeRadius: 4,
  rangeSpeed: 2,
  rangeTTL: 150,
  rangeY: 100,
  xOff: 0.00125,
  yOff: 0.00125,
  zOff: 0.0005,
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
      baseRadius,
      baseSpeed,
      baseTTL,
      noiseSteps,
      opacity,
      particleCount,
      particlePropCount,
      rangeHue,
      rangeRadius,
      rangeSpeed,
      rangeTTL,
      rangeY,
      xOff,
      yOff,
      zOff,
    } = {
      ...DEFAULT_SETTINGS,
      ...settings,
    }

    this.$window = $window
    this.$canvas = $canvas
    this.$base = $base

    this.backgroundColor = backgroundColor
    this.baseHue = baseHue
    this.baseRadius = baseRadius
    this.baseSpeed = baseSpeed
    this.baseTTL = baseTTL
    this.noiseSteps = noiseSteps
    this.opacity = opacity
    this.particleCount = particleCount
    this.particlePropCount = particlePropCount
    this.rangeHue = rangeHue
    this.rangeRadius = rangeRadius
    this.rangeSpeed = rangeSpeed
    this.rangeTTL = rangeTTL
    this.rangeY = rangeY
    this.xOff = xOff
    this.yOff = yOff
    this.zOff = zOff

    this.particlePropsLength = this.particleCount * this.particlePropCount

    this.canvas = null
    this.ctx = null
    this.center = null
    this.tick = null
    this.simplex = null
    this.particleProps = null

    this.isListeningToResize = false
    this.debouncedResize = debounce(this.resize.bind(this), 250)

    this.start()
  }

  start() {
    this.createCanvas()
    this.resize()
    this.initParticles()
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

    this.center = []
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

  initParticles() {
    this.tick = 0
    this.simplex = new SimplexNoise()
    this.particleProps = new Float32Array(this.particlePropsLength)

    for (let i = 0; i < this.particlePropsLength; i += this.particlePropCount) {
      this.initParticle(i)
    }
  }

  initParticle(i) {
    const x = rand(this.canvas.a.width)
    const y = this.center[1] + randRange(this.rangeY)
    const vx = 0
    const vy = 0
    const life = 0
    const ttl = this.baseTTL + rand(this.rangeTTL)
    const speed = this.baseSpeed + rand(this.rangeSpeed)
    const radius = this.baseRadius + rand(this.rangeRadius)
    const hue = this.baseHue + rand(this.rangeHue)

    this.particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i)
  }

  drawParticles() {
    for (let i = 0; i < this.particlePropsLength; i += this.particlePropCount) {
      this.updateParticle(i)
    }
  }

  updateParticle(i) {
    const i2 = 1 + i
    const i3 = 2 + i
    const i4 = 3 + i
    const i5 = 4 + i
    const i6 = 5 + i
    const i7 = 6 + i
    const i8 = 7 + i
    const i9 = 8 + i

    const x = this.particleProps[i]
    const y = this.particleProps[i2]
    const n = this.simplex.noise3D(x * this.xOff, y * this.yOff, this.tick * this.zOff) * this.noiseSteps * TAU
    const vx = lerp(this.particleProps[i3], Math.cos(n), 0.5)
    const vy = lerp(this.particleProps[i4], Math.sin(n), 0.5)
    let life = this.particleProps[i5]
    const ttl = this.particleProps[i6]
    const speed = this.particleProps[i7]
    const x2 = x + vx * speed
    const y2 = y + vy * speed
    const radius = this.particleProps[i8]
    const hue = this.particleProps[i9]

    this.drawParticle(x, y, x2, y2, life, ttl, radius, hue)

    life += 1

    this.particleProps[i] = x2
    this.particleProps[i2] = y2
    this.particleProps[i3] = vx
    this.particleProps[i4] = vy
    this.particleProps[i5] = life

    if (this.checkBounds(x, y) || life > ttl) {
      this.initParticle(i)
    }
  }

  drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
    this.ctx.a.save()
    this.ctx.a.lineCap = 'round'
    this.ctx.a.lineWidth = radius
    this.ctx.a.strokeStyle = `hsla(${hue},100%,60%,${fadeInOutWithOpacity(life, ttl, this.opacity)})`
    this.ctx.a.beginPath()
    this.ctx.a.moveTo(x, y)
    this.ctx.a.lineTo(x2, y2)
    this.ctx.a.stroke()
    this.ctx.a.closePath()
    this.ctx.a.restore()
  }

  checkBounds(x, y) {
    return x > this.canvas.a.width || x < 0 || y > this.canvas.a.height || y < 0
  }

  renderGlow() {
    this.ctx.b.save()
    this.ctx.b.filter = 'blur(8px) brightness(200%)'
    this.ctx.b.globalCompositeOperation = 'lighter'
    this.ctx.b.drawImage(this.canvas.a, 0, 0)
    this.ctx.b.restore()

    this.ctx.b.save()
    this.ctx.b.filter = 'blur(4px) brightness(200%)'
    this.ctx.b.globalCompositeOperation = 'lighter'
    this.ctx.b.drawImage(this.canvas.a, 0, 0)
    this.ctx.b.restore()
  }

  render() {
    this.ctx.b.save()
    this.ctx.b.globalCompositeOperation = 'lighter'
    this.ctx.b.drawImage(this.canvas.a, 0, 0)
    this.ctx.b.restore()
  }

  draw() {
    this.tick += 1

    this.ctx.a.clearRect(0, 0, this.canvas.a.width, this.canvas.a.height)

    this.ctx.b.fillStyle = this.backgroundColor
    this.ctx.b.fillRect(0, 0, this.canvas.a.width, this.canvas.a.height)

    this.drawParticles()
    this.renderGlow()
    this.render()

    this.animationFrameId = this.$window.requestAnimationFrame(this.draw.bind(this))
  }
}
