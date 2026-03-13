<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  items: { type: Array, required: true }
})

const emit = defineEmits(['close', 'select'])

const menuRef = ref(null)

const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    emit('close')
  }
}

const handleItemClick = (item) => {
  if (!item.disabled) {
    emit('select', item)
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div 
    ref="menuRef"
    class="classic-context-menu classic-outset"
    :style="{ top: `${y}px`, left: `${x}px` }"
  >
    <div 
      v-for="(item, index) in items" 
      :key="index"
      class="menu-item-wrapper"
    >
      <div v-if="item.separator" class="menu-separator"></div>
      <button 
        v-else
        class="menu-item" 
        :class="{ disabled: item.disabled }"
        @click="handleItemClick(item)"
      >
        <span class="item-icon">{{ item.icon || '' }}</span>
        <span class="item-label">{{ item.label }}</span>
        <span v-if="item.shortcut" class="item-shortcut">{{ item.shortcut }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.classic-context-menu {
  position: fixed;
  background-color: var(--win-grey);
  z-index: 10000;
  min-width: 150px;
  padding: 2px;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  border: none;
  background: none;
  padding: 4px 10px;
  text-align: left;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  color: black;
  cursor: default;
  gap: 8px;
}

.menu-item:hover:not(.disabled) {
  background-color: var(--win-blue);
  color: white;
}

.menu-item.disabled {
  color: #808080;
  text-shadow: 1px 1px white;
}

.item-icon {
  width: 16px;
  display: flex;
  justify-content: center;
}

.item-label {
  flex-grow: 1;
}

.item-shortcut {
  margin-left: 20px;
  opacity: 0.7;
}

.menu-separator {
  height: 2px;
  border-top: 1px solid #808080;
  border-bottom: 1px solid white;
  margin: 2px 5px;
}

.classic-outset {
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
}
</style>
