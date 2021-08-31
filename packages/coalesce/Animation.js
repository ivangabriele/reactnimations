import debounce from 'lodash.debounce'

const HALF_PI = 0.5 * Math.PI

const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2
const fadeInOutWithOpacity = (t, m, o) => {
  const hm = 0.5 * m
  const fo = Math.abs(((t + hm) % m) - hm) / hm
  const ff = Math.max(0, fo - Math.abs(o - 1))

  return ff
}
const angle = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)
const rand = n => n * Math.random()

const DEFAULT_SETTINGS = {
  backgroundColor: 'hsla(0, 0%, 0%, 1)',
  baseHue: 10,
  baseSize: 2,
  baseSpeed: 0.1,
  baseTTL: 100,
  noiseSteps: 2,
  opacity: 1,
  particleCount: 700,
  particlePropCount: 9,
  rangeHue: 100,
  rangeSize: 10,
  rangeSpeed: 1,
  rangeTTL: 500,
  xOff: 0.0025,
  yOff: 0.005,
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
      baseSize,
      baseSpeed,
      baseTTL,
      noiseSteps,
      opacity,
      particleCount,
      particlePropCount,
      rangeHue,
      rangeSize,
      rangeSpeed,
      rangeTTL,
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
    this.baseSize = baseSize
    this.baseSpeed = baseSpeed
    this.baseTTL = baseTTL
    this.noiseSteps = noiseSteps
    this.opacity = opacity
    this.particleCount = particleCount
    this.particlePropCount = particlePropCount
    this.rangeHue = rangeHue
    this.rangeSize = rangeSize
    this.rangeSpeed = rangeSpeed
    this.rangeTTL = rangeTTL
    this.xOff = xOff
    this.yOff = yOff
    this.zOff = zOff

    this.particlePropsLength = this.particleCount * this.particlePropCount

    this.canvas = null
    this.center = null
    this.container = null
    this.ctx = null
    this.gradient = null
    this.hues = null
    this.lifeSpans = null
    this.particleProps = null
    this.positions = null
    this.sizes = null
    this.speeds = null
    this.tick = null
    this.velocities = null

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
    this.particleProps = new Float32Array(this.particlePropsLength)

    let i

    for (i = 0; i < this.particlePropsLength; i += this.particlePropCount) {
      this.initParticle(i)
    }
  }

  initParticle(i) {
    const x = rand(this.canvas.a.width)
    const y = rand(this.canvas.a.height)
    const theta = angle(x, y, this.center[0], this.center[1])
    const vx = Math.cos(theta) * 6
    const vy = Math.sin(theta) * 6
    const life = 0
    const ttl = this.baseTTL + rand(this.rangeTTL)
    const speed = this.baseSpeed + rand(this.rangeSpeed)
    const size = this.baseSize + rand(this.rangeSize)
    const hue = this.baseHue + rand(this.rangeHue)

    this.particleProps.set([x, y, vx, vy, life, ttl, speed, size, hue], i)
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
    const theta = angle(x, y, this.center[0], this.center[1]) + 0.75 * HALF_PI
    const vx = lerp(this.particleProps[i3], 2 * Math.cos(theta), 0.05)
    const vy = lerp(this.particleProps[i4], 2 * Math.sin(theta), 0.05)
    let life = this.particleProps[i5]
    const ttl = this.particleProps[i6]
    const speed = this.particleProps[i7]
    const x2 = x + vx * speed
    const y2 = y + vy * speed
    const size = this.particleProps[i8]
    const hue = this.particleProps[i9]

    this.drawParticle(x, y, theta, life, ttl, size, hue)

    life += 1

    this.particleProps[i] = x2
    this.particleProps[i2] = y2
    this.particleProps[i3] = vx
    this.particleProps[i4] = vy
    this.particleProps[i5] = life

    if (life > ttl) {
      this.initParticle(i)
    }
  }

  drawParticles() {
    let i

    for (i = 0; i < this.particlePropsLength; i += this.particlePropCount) {
      this.updateParticle(i)
    }
  }

  drawParticle(x, y, theta, life, ttl, size, hue) {
    const xRel = x - 0.5 * size
    const yRel = y - 0.5 * size

    this.ctx.a.save()
    this.ctx.a.lineCap = 'round'
    this.ctx.a.lineWidth = 1
    this.ctx.a.strokeStyle = `hsla(${hue},100%,60%,${fadeInOutWithOpacity(life, ttl, this.opacity)})`
    this.ctx.a.beginPath()
    this.ctx.a.translate(xRel, yRel)
    this.ctx.a.rotate(theta)
    this.ctx.a.translate(-xRel, -yRel)
    this.ctx.a.strokeRect(xRel, yRel, size, size)
    this.ctx.a.closePath()
    this.ctx.a.restore()
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
