<script setup>
import { ref, onMounted } from 'vue'
import { useDraggable } from '../composables/useDraggable'
import { useResizable } from '../composables/useResizable'

const props = defineProps({
  title: {
    type: String,
    default: 'Windows Classic'
  },
  id: String,
  initialX: { type: Number, default: 0 },
  initialY: { type: Number, default: 0 },
  initialWidth: { type: Number, default: 300 },
  initialHeight: { type: Number, default: 200 },
  zIndex: { type: Number, default: 100 }
})

const emit = defineEmits(['focus'])

const windowRef = ref(null)
const handleRef = ref(null)
const resizeHandleRef = ref(null)

const { x, y, isDragging } = useDraggable(windowRef, { 
  handle: handleRef,
  initialX: props.initialX,
  initialY: props.initialY
})

const { width, height, isResizing } = useResizable(windowRef, {
  handle: resizeHandleRef,
  initialWidth: props.initialWidth,
  initialHeight: props.initialHeight
})

const onWindowClick = () => {
  emit('focus', props.id)
}
</script>

<template>
  <div 
    :id="id" 
    ref="windowRef"
    class="classic-window classic-outset"
    :class="{ dragging: isDragging, resizing: isResizing }"
    :style="{ 
      transform: `translate(${x}px, ${y}px)`,
      width: `${width}px`,
      height: `${height}px`,
      zIndex: zIndex,
      position: 'absolute',
      left: 0,
      top: 0
    }"
    @mousedown="onWindowClick"
  >
    <div ref="handleRef" class="classic-title-bar">
      <div class="classic-title-text">{{ title }}</div>
      <div class="classic-window-controls">
        <div class="classic-ctrl-btn">_</div>
        <div class="classic-ctrl-btn">❐</div>
        <div class="classic-ctrl-btn">✕</div>
      </div>
    </div>
    <div class="classic-window-content">
      <slot></slot>
    </div>
    <div ref="resizeHandleRef" class="resize-handle"></div>
  </div>
</template>

<style scoped>
.classic-window-content {
  background-color: var(--win-grey);
  height: calc(100% - 22px);
  overflow: auto;
}

.resize-handle {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 12px;
  height: 12px;
  cursor: nwse-resize;
  background-image: radial-gradient(circle, #808080 1px, transparent 1px);
  background-size: 3px 3px;
  z-index: 10;
}
</style>
