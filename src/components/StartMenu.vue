<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['windows'])
const emit = defineEmits(['open-app', 'close'])

const searchQuery = ref('')

const filteredApps = computed(() => {
  return Object.entries(props.windows).filter(([id, win]) => 
    win.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleAppClick = (id) => {
  emit('open-app', id)
  emit('close')
}
</script>

<template>
  <div class="classic-start-menu classic-outset">
    <div class="start-menu-sidebar">
      <div class="sidebar-text"><b>Windows</b>Server</div>
    </div>
    <div class="start-menu-main">
      <div class="search-container">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search apps..." 
          class="classic-input classic-inset"
          @click.stop
        >
      </div>
      <div class="start-menu-items">
        <div 
          v-for="[id, win] in filteredApps" 
          :key="id"
          class="start-menu-item"
          @click="handleAppClick(id)"
        >
          <span class="app-icon">📁</span>
          <span class="app-title">{{ win.title }}</span>
        </div>
      </div>
      <div class="start-menu-divider"></div>
      <div class="start-menu-footer">
        <div class="start-menu-item">
          <span class="app-icon">🔑</span>
          <span class="app-title">Log Off...</span>
        </div>
        <div class="start-menu-item">
          <span class="app-icon">💻</span>
          <span class="app-title">Shut Down...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.classic-start-menu {
  position: absolute;
  bottom: 28px;
  left: 0;
  width: 200px;
  display: flex;
  z-index: 10000;
}

.start-menu-sidebar {
  width: 25px;
  background: linear-gradient(180deg, #808080 0%, #000000 100%);
  position: relative;
}

.sidebar-text {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%) rotate(-90deg);
  transform-origin: bottom center;
  color: #c0c0c0;
  white-space: nowrap;
  font-size: 14px;
}

.start-menu-main {
  flex-grow: 1;
  background-color: var(--win-grey);
  display: flex;
  flex-direction: column;
}

.search-container {
  padding: 5px;
  border-bottom: 1px solid var(--win-grey-dark);
}

.classic-input {
  width: 100%;
  padding: 2px 5px;
  font-size: 11px;
  border: 1px solid;
  outline: none;
}

.start-menu-items {
  flex-grow: 1;
  padding: 2px;
}

.start-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 11px;
}

.start-menu-item:hover {
  background-color: var(--win-blue);
  color: white;
}

.app-icon {
  font-size: 14px;
}

.start-menu-divider {
  height: 1px;
  background-color: var(--win-grey-dark);
  border-bottom: 1px solid var(--win-white);
  margin: 2px 0;
}

.start-menu-footer {
  padding: 2px;
}
</style>
