<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
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

const canvasContainer = ref(null)
let scene, camera, renderer, animationId
let cubes = []

const initThree = () => {
  if (!canvasContainer.value) return

  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  canvasContainer.value.appendChild(renderer.domElement)

  // Add some light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  // Create some floating cubes
  const geometry = new THREE.BoxGeometry()
  for (let i = 0; i < 50; i++) {
    const material = new THREE.MeshPhongMaterial({ 
      color: Math.random() * 0xffffff,
      flatShading: true
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.y = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.rotation.x = Math.random() * Math.PI
    cube.rotation.y = Math.random() * Math.PI
    
    // Custom properties for animation
    cube.userData = {
      rotX: (Math.random() - 0.5) * 0.02,
      rotY: (Math.random() - 0.5) * 0.02,
      velZ: Math.random() * 0.05
    }
    
    scene.add(cube)
    cubes.push(cube)
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate)

    cubes.forEach(cube => {
      cube.rotation.x += cube.userData.rotX
      cube.rotation.y += cube.userData.rotY
      cube.position.z += cube.userData.velZ
      
      if (cube.position.z > 5) {
        cube.position.z = -10
        cube.position.x = (Math.random() - 0.5) * 10
        cube.position.y = (Math.random() - 0.5) * 10
      }
    })

    renderer.render(scene, camera)
  }

  animate()

  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  if (!canvasContainer.value || !renderer || !camera) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(initThree)

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<template>
  <ClassicWindow
    title="3D Space Explorer"
    id="threeGame"
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
    <div class="game-container classic-inset">
      <div ref="canvasContainer" class="canvas-wrapper"></div>
      <div class="game-ui">
        <p>3D Space Explorer v1.0</p>
        <p>Enjoy the 3D vibes!</p>
      </div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;
  display: flex;
  flex-direction: column;
}

.canvas-wrapper {
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
}

.game-ui {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 5px;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
}

.classic-inset {
  border: 2px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}
</style>
