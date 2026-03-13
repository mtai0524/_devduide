<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import StartMenu from './StartMenu.vue'

const props = defineProps(['windows'])
const emit = defineEmits(['open-app', 'toggle-minimize'])

const isStartOpen = ref(false)
const currentTime = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

let timer
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const toggleStart = () => {
  isStartOpen.value = !isStartOpen.value
}

const closeStart = () => {
  isStartOpen.value = false
}
</script>

<template>
  <div class="classic-taskbar classic-outset">
    <button 
      class="classic-start-btn btn-classic" 
      :class="{ 'task-inset': isStartOpen }"
      @click="toggleStart"
    >
      <span class="start-icon">🪟</span> <b>Start</b>
    </button>
    
    <StartMenu 
      v-if="isStartOpen" 
      :windows="windows" 
      @open-app="(id) => emit('open-app', id)"
      @close="closeStart"
    />

    <div class="classic-taskbar-items">
      <template v-for="(win, id) in windows" :key="id">
        <button 
          v-if="win.isOpen"
          class="classic-task-item" 
          :class="{ 'task-inset': !win.isMinimized }"
          @click="emit('toggle-minimize', id)"
        >
          <span class="task-icon">📁</span>
          <span class="task-title">{{ win.title }}</span>
        </button>
      </template>
    </div>

    <div class="classic-system-tray classic-inset">
      <div class="classic-tray-icons">
        <span>🔊</span>
        <span>🌐</span>
      </div>
      <div class="classic-clock">{{ currentTime }}</div>
    </div>
  </div>
</template>

<style scoped>
.classic-taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
  padding: 2px;
  z-index: 9999;
  border-width: 1px;
}

.classic-start-btn {
  height: 22px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
  font-weight: bold;
}

.start-icon {
  font-size: 14px;
}

.classic-taskbar-items {
  flex-grow: 1;
  display: flex;
  gap: 2px;
  margin-left: 5px;
  overflow-x: auto;
}

.classic-task-item {
  height: 22px;
  max-width: 150px;
  min-width: 60px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  background-color: var(--win-grey);
  border: 1px solid;
  border-top-color: var(--win-white);
  border-left-color: var(--win-white);
  border-right-color: var(--win-grey-dark);
  border-bottom-color: var(--win-grey-dark);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-inset {
  border-top-color: var(--win-grey-dark);
  border-left-color: var(--win-grey-dark);
  border-right-color: var(--win-white);
  border-bottom-color: var(--win-white);
  background-color: var(--win-grey-light);
  font-weight: bold;
}

.task-icon {
  font-size: 12px;
}

.classic-system-tray {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 5px;
  height: 22px;
  flex-shrink: 0;
}

.classic-tray-icons {
  display: flex;
  gap: 5px;
  font-size: 12px;
}

.classic-clock {
  font-size: 11px;
}
</style>
