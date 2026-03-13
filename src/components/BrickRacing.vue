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
const playerLane = ref(1) // 0, 1, 2
const speed = ref(5)
const road = reactive([])
const enemies = reactive([])
let gameInterval

const initGame = () => {
  road.length = 0
  enemies.length = 0
  score.value = 0
  gameState.value = 'playing'
  playerLane.value = 1
  
  // Fill initial road dots
  for (let i = 0; i < 20; i++) {
    road.push({ id: i, y: i * 15 })
  }
  
  if (gameInterval) clearInterval(gameInterval)
  gameInterval = setInterval(update, 50)
}

const update = () => {
  if (gameState.value !== 'playing') return

  score.value += 1
  
  // Spawn enemies
  if (Math.random() < 0.05) {
    enemies.push({
      id: Date.now(),
      lane: Math.floor(Math.random() * 3),
      y: -50
    })
  }

  // Update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += speed.value
    
    // Collision check
    if (enemies[i].lane === playerLane.value && enemies[i].y > 220 && enemies[i].y < 260) {
      gameState.value = 'gameover'
    }

    if (enemies[i].y > 300) {
      enemies.splice(i, 1)
    }
  }

  // Animate road
  road.forEach(dot => {
    dot.y += speed.value
    if (dot.y > 300) dot.y = 0
  })
}

const handleKey = (e) => {
  if (!props.isActive || props.isMinimized) return
  
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    if (playerLane.value > 0) playerLane.value--
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    if (playerLane.value < 2) playerLane.value++
  }
}

onMounted(() => {
  initGame()
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  clearInterval(gameInterval)
  window.removeEventListener('keydown', handleKey)
})
</script>

<template>
  <ClassicWindow
    title="Brick Racer 99-in-1"
    id="brickRacer"
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
    <div class="brick-game-container classic-inset">
      <div class="handheld-screen">
        <div class="score-display">SCORE: {{ score.toString().padStart(5, '0') }}</div>
        
        <div class="game-area">
          <!-- Road side dots -->
          <div v-for="dot in road" :key="`road-${dot.id}`" 
               class="road-dot" :style="{ top: `${dot.y}px`, left: '5px' }"></div>
          <div v-for="dot in road" :key="`road-r-${dot.id}`" 
               class="road-dot" :style="{ top: `${dot.y}px`, right: '5px' }"></div>

          <!-- Enemies -->
          <div v-for="enemy in enemies" :key="enemy.id" 
               class="car enemy-car" 
               :style="{ top: `${enemy.y}px`, left: `${40 + enemy.lane * 40}px` }">
            <div class="car-body"></div>
          </div>

          <!-- Player -->
          <div class="car player-car" 
               :style="{ bottom: '20px', left: `${40 + playerLane * 40}px` }">
            <div class="car-body"></div>
          </div>
        </div>

        <div v-if="gameState === 'gameover'" class="game-over-overlay">
          <div class="game-over-text">GAME OVER</div>
          <button class="classic-outset retry-btn" @click="initGame">START</button>
        </div>
      </div>
      <div class="controls-hint">USE A / D OR ARROWS TO STEER</div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.brick-game-container {
  width: 100%;
  height: 100%;
  background-color: #8b956d; /* Classic brick game greenish background */
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', Courier, monospace;
}

.handheld-screen {
  width: 180px;
  height: 280px;
  border: 4px solid #4a4a4a;
  background-color: #9ead86;
  position: relative;
  overflow: hidden;
  box-shadow: inset 2px 2px 10px rgba(0,0,0,0.2);
}

.game-area {
  width: 100%;
  height: 100%;
  position: relative;
}

.score-display {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 14px;
  color: #2b2b2b;
  z-index: 10;
  font-weight: bold;
}

.road-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #2b2b2b;
  border-radius: 1px;
}

.car {
  position: absolute;
  width: 30px;
  height: 40px;
  transition: left 0.1s ease-out;
}

.car-body {
  width: 100%;
  height: 100%;
  background-color: #2b2b2b;
  /* Simple brick car shape */
  clip-path: polygon(
    20% 0%, 80% 0%, 80% 20%, 100% 20%, 100% 40%, 80% 40%, 80% 100%, 20% 100%, 20% 40%, 0% 40%, 0% 20%, 20% 20%
  );
}

.player-car .car-body {
  background-color: #1a1a1a;
}

.enemy-car .car-body {
  opacity: 0.8;
}

.game-over-overlay {
  position: absolute;
  inset: 0;
  background: rgba(158, 173, 134, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.game-over-text {
  font-size: 24px;
  font-weight: bold;
  color: #2b2b2b;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 5px 20px;
  cursor: pointer;
  background-color: var(--win-grey);
}

.controls-hint {
  margin-top: 10px;
  font-size: 9px;
  color: #4a4a4a;
  font-weight: bold;
}

.classic-inset {
  border: 2px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}

.classic-outset {
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
}
</style>
