<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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
let gl, program, animationId

const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;
  varying vec2 vTextureCoord;
  void main() {
    gl_Position = aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`

const fsSource = `
  precision mediump float;
  varying vec2 vTextureCoord;
  uniform float uTime;
  
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vTextureCoord;
    float time = uTime * 0.5;
    
    // Grid system for rain
    vec2 grid = vec2(50.0, 20.0);
    vec2 ipos = floor(uv * grid);
    vec2 fpos = fract(uv * grid);
    
    // Slanting speed/offset
    float offset = random(vec2(ipos.x, 0.0)) * 10.0;
    float speed = 2.0 + random(vec2(ipos.x, 0.0)) * 3.0;
    float y = fract(uv.y + time * speed + offset);
    
    // Character-like glow
    float char = step(0.1, random(ipos + floor(time * 10.0)));
    float brightness = pow(1.0 - y, 3.0) * char;
    
    vec3 color = vec3(0.0, 1.0, 0.0) * brightness;
    
    // Add some "head" brightness
    if (y < 0.1) {
      color += vec3(0.8, 1.0, 0.8) * (1.0 - y * 10.0);
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`

const initGL = () => {
  const canvas = canvasRef.value
  gl = canvas.getContext('webgl')
  if (!gl) return

  const vs = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
  program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  const vertices = new Float32Array([
    -1.0,  1.0,   0.0, 1.0,
     1.0,  1.0,   1.0, 1.0,
    -1.0, -1.0,   0.0, 0.0,
     1.0, -1.0,   1.0, 0.0,
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

  render()
}

const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

const render = (time) => {
  if (!gl) return
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  const timeLoc = gl.getUniformLocation(program, 'uTime')
  gl.uniform1f(timeLoc, time * 0.001)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  animationId = requestAnimationFrame(render)
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
    title="WebGL Matrix Rain"
    id="webglGame"
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
    <div ref="containerRef" class="webgl-container classic-inset">
      <canvas ref="canvasRef"></canvas>
      <div class="webgl-overlay">
        <p>SYSTEM: WEBGL_ACTIVE</p>
        <p>KERNEL: 0x00FF00</p>
      </div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.webgl-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.webgl-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
  text-align: right;
  pointer-events: none;
  text-shadow: 0 0 5px #00ff00;
}

.classic-inset {
  border: 2px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}
</style>
