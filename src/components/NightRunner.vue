<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import ClassicWindow from './ClassicWindow.vue'

const props = defineProps({
  isActive: Boolean,
  isMinimized: Boolean,
  initialX: Number,
  initialY: Number,
  initialWidth: Number,
  initialHeight: Number,
  zIndex: Number
})

const emit = defineEmits(['focus', 'close', 'minimize'])

const score = ref(0)
const gameState = ref('playing') // 'playing', 'gameover'
const playerY = ref(150)
const playerVelY = ref(0)
const obstacles = reactive([])
const stars = reactive([])
let animationId

const initGame = () => {
  score.value = 0
  gameState.value = 'playing'
  playerY.value = 150
  playerVelY.value = 0
  obstacles.length = 0
  stars.length = 0
  
  for (let i = 0; i < 30; i++) {
    stars.push({
      x: Math.random() * 400,
      y: Math.random() * 250,
      speed: 0.5 + Math.random() * 1.5
    })
  }
}

const update = () => {
  if (gameState.value !== 'playing') return

  score.value++
  
  // Physics
  playerVelY.value += 0.5 // Gravity
  playerY.value += playerVelY.value
  
  // Ground/Ceiling collision
  if (playerY.value > 210) {
    playerY.value = 210
    playerVelY.value = 0
  }
  if (playerY.value < 0) {
    playerY.value = 0
    playerVelY.value = 0
  }

  // Obstacles
  if (Math.random() < 0.02) {
    obstacles.push({
      x: 400,
      y: Math.random() < 0.5 ? 210 : 30,
      w: 20 + Math.random() * 30,
      h: 40
    })
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= 4
    
    // Collision
    if (
      Math.abs(obstacles[i].x - 60) < obstacles[i].w / 2 &&
      Math.abs(obstacles[i].y - playerY.value) < 30
    ) {
      gameState.value = 'gameover'
    }

    if (obstacles[i].x < -50) obstacles.splice(i, 1)
  }

  // Stars
  stars.forEach(star => {
    star.x -= star.speed
    if (star.x < -10) star.x = 410
  })

  animationId = requestAnimationFrame(update)
}

const handleJump = (e) => {
  if (!props.isActive || props.isMinimized) return
  if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
    e.preventDefault()
    playerVelY.value = -8
  }
}

onMounted(() => {
  initGame()
  window.addEventListener('keydown', handleJump)
  animationId = requestAnimationFrame(update)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('keydown', handleJump)
})
</script>

<template>
  <ClassicWindow
    title="Night Runner - Loop Challenge"
    id="nightRunner"
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
    <div class="night-runner-container classic-inset">
      <div class="score">SCORE: {{ score }}</div>
      <div class="game-view">
        <div v-for="(star, i) in stars" :key="i" class="star" :style="{ left: star.x + 'px', top: star.y + 'px' }"></div>
        
        <div class="player" :style="{ top: playerY + 'px', left: '60px' }">🐱</div>
        
        <div v-for="(obs, i) in obstacles" :key="i" class="obstacle" 
             :style="{ left: obs.x + 'px', top: obs.y + 'px', width: obs.w + 'px', height: obs.h + 'px' }">
          🌵
        </div>
      </div>
      
      <div v-if="gameState === 'gameover'" class="game-over">
        <div>CRASHED!</div>
        <button class="classic-outset" @click="initGame">RETRY</button>
      </div>
      
      <div class="controls">SPACE / UP TO JUMP</div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.night-runner-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  position: relative;
  overflow: hidden;
  color: white;
  font-family: 'Tahoma', sans-serif;
}

.score {
  position: absolute;
  top: 10px;
  right: 15px;
  font-weight: bold;
  font-size: 18px;
  z-index: 10;
}

.game-view {
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
}

.player {
  position: absolute;
  font-size: 30px;
  transform: translate(-50%, -50%);
}

.obstacle {
  position: absolute;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 0, 0, 0.2);
  border-radius: 4px;
}

.game-over {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
}

.controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 10px;
  opacity: 0.6;
}

.retry-btn {
  margin-top: 20px;
  color: black;
  padding: 5px 20px;
  font-size: 16px;
}
</style>
