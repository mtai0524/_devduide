<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import ClassicWindow from './ClassicWindow.vue'

const props = defineProps({
  isMinimized: Boolean,
  initialX: Number,
  initialY: Number,
  initialWidth: Number,
  initialHeight: Number,
  zIndex: Number
})

const emit = defineEmits(['focus', 'close', 'minimize'])

const canvasRef = ref(null)
const containerRef = ref(null)
const score = ref(0)
const gameState = ref('playing') // 'playing', 'gameover'

let gl, program, animationId
let catX = 0
let fishes = []
let catTexture, fishTexture

const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;
  varying vec2 vTextureCoord;
  uniform vec2 uOffset;
  uniform float uScale;
  void main() {
    gl_Position = vec4(aVertexPosition.xy * uScale + uOffset, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
  }
`

const fsSource = `
  precision mediump float;
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    if (gl_FragColor.a < 0.1) discard; // Simple alpha testing
  }
`

const initGL = () => {
  const canvas = canvasRef.value
  gl = canvas.getContext('webgl')
  if (!gl) return

  // Enable alpha blending
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const vs = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
  program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  // Use a square geometry for all objects with UVs
  // x, y, u, v
  const vertices = new Float32Array([
    -1.0,  1.0,  0.0, 0.0,
     1.0,  1.0,  1.0, 0.0,
    -1.0, -1.0,  0.0, 1.0,
     1.0, -1.0,  1.0, 1.0,
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const posAttrib = gl.getAttribLocation(program, 'aVertexPosition')
  gl.enableVertexAttribArray(posAttrib)
  gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 16, 0)

  const texAttrib = gl.getAttribLocation(program, 'aTextureCoord')
  gl.enableVertexAttribArray(texAttrib)
  gl.vertexAttribPointer(texAttrib, 2, gl.FLOAT, false, 16, 8)

  catTexture = loadTexture(gl, '/assets/sprites/cat.png')
  fishTexture = loadTexture(gl, '/assets/sprites/goldfish.png')

  spawnFish()
  render(0)
}

const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

const loadTexture = (gl, url) => {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  // Fill with a single blue pixel until the image loads
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
  
  const image = new Image()
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  }
  image.src = url
  return texture
}

const spawnFish = () => {
  if (gameState.value !== 'playing') return
  fishes.push({
    x: (Math.random() - 0.5) * 1.8,
    y: 1.1,
    speed: 0.01 + Math.random() * 0.02
  })
  setTimeout(spawnFish, 1000 + Math.random() * 1000)
}

const render = (time) => {
  if (!gl || gameState.value === 'gameover') return

  gl.clearColor(0.2, 0.3, 0.4, 1) // Water-ish color
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(program)

  const offsetLoc = gl.getUniformLocation(program, 'uOffset')
  const scaleLoc = gl.getUniformLocation(program, 'uScale')
  const samplerLoc = gl.getUniformLocation(program, 'uSampler')

  // Render Cat
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, catTexture)
  gl.uniform1i(samplerLoc, 0)
  gl.uniform2f(offsetLoc, catX, -0.75)
  gl.uniform1f(scaleLoc, 0.2) // Bigger cat
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  // Update and render fish
  fishes = fishes.filter(fish => {
    fish.y -= fish.speed
    
    // Check collision
    if (Math.abs(fish.x - catX) < 0.25 && Math.abs(fish.y - (-0.75)) < 0.2) {
      score.value += 10
      return false
    }
    
    if (fish.y < -1.2) {
      gameState.value = 'gameover'
      return false
    }

    // Render Fish
    gl.bindTexture(gl.TEXTURE_2D, fishTexture)
    gl.uniform2f(offsetLoc, fish.x, fish.y)
    gl.uniform1f(scaleLoc, 0.1)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    return true
  })

  animationId = requestAnimationFrame(render)
}

const handleMouseMove = (e) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  catX = (mouseX / rect.width) * 2 - 1
  // Clamp
  catX = Math.max(-0.85, Math.min(0.85, catX))
}

const resetGame = () => {
  gameState.value = 'playing'
  score.value = 0
  fishes = []
  catX = 0
  spawnFish()
  render(0)
}

const handleResize = () => {
  if (!canvasRef.value || !containerRef.value) return
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  canvasRef.value.width = width
  canvasRef.value.height = height
  if (gl) gl.viewport(0, 0, width, height)
}

onMounted(() => {
  handleResize()
  initGL()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <ClassicWindow
    title="Cat Fish Catcher HD"
    id="catGame"
    :initialX="initialX"
    :initialY="initialY"
    :initialWidth="initialWidth"
    :initialHeight="initialHeight"
    :zIndex="zIndex"
    :isMinimized="isMinimized"
    @focus="emit('focus')"
    @close="emit('close')"
    @minimize="emit('minimize')"
  >
    <div 
      ref="containerRef" 
      class="game-container classic-inset"
      @mousemove="handleMouseMove"
    >
      <canvas ref="canvasRef"></canvas>
      <div class="game-ui">
        <div class="score">XP: {{ score }}</div>
        <div v-if="gameState === 'gameover'" class="game-over">
          <p>MEOW! SOME FISH ESCAPED!</p>
          <button class="classic-outset" @click="resetGame">PLAY AGAIN</button>
        </div>
      </div>
      <div class="cat-label">🐾 MOVE MOUSE TO CATCH THE GOLDFISH</div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #2c3e50;
  overflow: hidden;
  cursor: none;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.score {
  color: #f1c40f;
  font-family: 'Tahoma', sans-serif;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px #000;
}

.game-over {
  margin: auto;
  text-align: center;
  background: rgba(0, 0, 0, 0.85);
  padding: 25px;
  border: 4px double #f39c12;
  pointer-events: auto;
  box-shadow: 0 0 20px rgba(243, 156, 18, 0.5);
}

.game-over p {
  color: #e67e22;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
}

.game-over button {
  padding: 8px 20px;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Tahoma', sans-serif;
}

.cat-label {
  position: absolute;
  bottom: 8px;
  left: 12px;
  color: #bdc3c7;
  font-size: 11px;
  font-weight: bold;
  text-shadow: 1px 1px #000;
}

.classic-inset {
  border: 2px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}

.classic-outset {
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
  background-color: #c0c0c0;
}
</style>
