<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  command: {
    type: Function,
    required: true,
  },
})

const selectedIndex = ref(0)

const selectItem = (index) => {
  const item = props.items[index]
  if (item) {
    props.command(item)
  }
}

const onKeyDown = ({ event }) => {
  if (event.key === 'ArrowUp') {
    selectedIndex.value = ((selectedIndex.value + props.items.length - 1) % props.items.length)
    return true
  }

  if (event.key === 'ArrowDown') {
    selectedIndex.value = ((selectedIndex.value + 1) % props.items.length)
    return true
  }

  if (event.key === 'Enter') {
    selectItem(selectedIndex.value)
    return true
  }

  return false
}

defineExpose({
  onKeyDown,
})

watch(() => props.items, () => {
  selectedIndex.value = 0
})
</script>

<template>
  <div class="slash-menu-list classic-outset">
    <div v-if="items.length">
      <button
        v-for="(item, index) in items"
        :key="index"
        class="slash-menu-item"
        :class="{ 'is-selected': index === selectedIndex }"
        @click="selectItem(index)"
      >
        <span class="item-icon">{{ item.icon }}</span>
        <div class="item-content">
          <span class="item-title">{{ item.title }}</span>
          <span class="item-description">{{ item.description }}</span>
        </div>
      </button>
    </div>
    <div v-else class="no-result">
      No result
    </div>
  </div>
</template>

<style scoped>
.slash-menu-list {
  background-color: var(--win-grey-light);
  padding: 2px;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.slash-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  background: none;
  border: 1px solid transparent;
  padding: 4px 8px;
  cursor: pointer;
  color: black;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
}

.slash-menu-item.is-selected {
  background-color: var(--win-blue);
  color: white;
}

.item-icon {
  margin-right: 10px;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.item-content {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-weight: bold;
}

.item-description {
  font-size: 9px;
  opacity: 0.8;
}

.no-result {
  padding: 8px;
  color: var(--win-grey-dark);
  font-size: 11px;
}
</style>
