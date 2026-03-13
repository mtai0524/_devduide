<script setup>
import { ref, reactive, onMounted } from 'vue'
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

const ROWS = 10
const COLS = 10
const MINES = 15

const board = ref([])
const gameState = ref('playing') // 'playing', 'won', 'lost'
const minesCount = ref(MINES)

const initBoard = () => {
  const newBoard = []
  for (let r = 0; r < ROWS; r++) {
    const row = []
    for (let c = 0; c < COLS; c++) {
      row.push({
        r, c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      })
    }
    newBoard.push(row)
  }

  // Place mines
  let placedMines = 0
  while (placedMines < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (!newBoard[r][c].isMine) {
      newBoard[r][c].isMine = true
      placedMines++
    }
  }

  // Calculate neighbor mines
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!newBoard[r][c].isMine) {
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr
            const nc = c + dc
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
              count++
            }
          }
        }
        newBoard[r][c].neighborMines = count
      }
    }
  }

  board.value = newBoard
  gameState.value = 'playing'
  minesCount.value = MINES
}

const reveal = (r, c) => {
  if (gameState.value !== 'playing' || board.value[r][c].isRevealed || board.value[r][c].isFlagged) return

  board.value[r][c].isRevealed = true

  if (board.value[r][c].isMine) {
    gameState.value = 'lost'
    revealAllMines()
    return
  }

  if (board.value[r][c].neighborMines === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          reveal(nr, nc)
        }
      }
    }
  }

  checkWin()
}

const toggleFlag = (e, r, c) => {
  e.preventDefault()
  if (gameState.value !== 'playing' || board.value[r][c].isRevealed) return
  
  board.value[r][c].isFlagged = !board.value[r][c].isFlagged
  minesCount.value += board.value[r][c].isFlagged ? -1 : 1
}

const revealAllMines = () => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board.value[r][c].isMine) {
        board.value[r][c].isRevealed = true
      }
    }
  }
}

const checkWin = () => {
  let revealedCount = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board.value[r][c].isRevealed && !board.value[r][c].isMine) {
        revealedCount++
      }
    }
  }
  if (revealedCount === ROWS * COLS - MINES) {
    gameState.value = 'won'
  }
}

onMounted(initBoard)
</script>

<template>
  <ClassicWindow
    title="Minesweeper"
    id="minesweeper"
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
    <div class="minesweeper-game classic-inset">
      <div class="game-header classic-inset">
        <div class="counter">{{ String(minesCount).padStart(3, '0') }}</div>
        <button class="reset-btn classic-outset" @click="initBoard">
          {{ gameState === 'playing' ? '😊' : (gameState === 'won' ? '😎' : '😵') }}
        </button>
        <div class="counter">000</div>
      </div>
      <div class="game-board classic-inset">
        <div v-for="(row, r) in board" :key="r" class="row">
          <div 
            v-for="(cell, c) in row" 
            :key="c" 
            class="cell classic-outset"
            :class="{ 
              revealed: cell.isRevealed, 
              'is-mine': cell.isRevealed && cell.isMine,
              flagged: cell.isFlagged
            }"
            @click="reveal(r, c)"
            @contextmenu="toggleFlag($event, r, c)"
          >
            <template v-if="cell.isRevealed">
              <span v-if="cell.isMine">💣</span>
              <span v-else-if="cell.neighborMines > 0" :class="`count-${cell.neighborMines}`">
                {{ cell.neighborMines }}
              </span>
            </template>
            <template v-else-if="cell.isFlagged">
              🚩
            </template>
          </div>
        </div>
      </div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.minesweeper-game {
  padding: 10px;
  background-color: var(--win-grey);
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: fit-content;
  margin: 0 auto;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: var(--win-grey);
}

.counter {
  background-color: black;
  color: red;
  font-family: 'Courier New', Courier, monospace;
  font-size: 24px;
  padding: 2px 5px;
  min-width: 50px;
  text-align: center;
}

.reset-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
}

.game-board {
  border: 2px solid;
  border-color: #808080 white white #808080;
}

.row {
  display: flex;
}

.cell {
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: 'Tahoma', sans-serif;
  cursor: pointer;
  background-color: var(--win-grey);
  user-select: none;
}

.cell.revealed {
  border: 1px solid #808080;
  box-shadow: none;
  cursor: default;
}

.cell.is-mine {
  background-color: red;
}

.count-1 { color: blue; }
.count-2 { color: green; }
.count-3 { color: red; }
.count-4 { color: darkblue; }
.count-5 { color: darkred; }
.count-6 { color: teal; }
.count-7 { color: black; }
.count-8 { color: gray; }

.classic-inset {
  border: 2px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}

.classic-outset {
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
}
</style>
