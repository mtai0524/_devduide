<script setup>
import ClassicWindow from './ClassicWindow.vue'
import TiptapEditor from './TiptapEditor.vue'

defineProps(['isMinimized', 'initialX', 'initialY', 'zIndex'])
defineEmits(['focus', 'close', 'minimize'])
</script>

<template>
  <ClassicWindow 
    title="About - Notepad" 
    id="about"
    :isMinimized="isMinimized"
    :initialX="initialX"
    :initialY="initialY"
    :zIndex="zIndex"
    initialWidth="600px"
    initialHeight="400px"
    @focus="$emit('focus')"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
  >
    <div class="classic-notepad">
      <div class="notepad-menu">
        <span>File</span> <span>Edit</span> <span>Search</span> <span>Help</span>
      </div>
      <div class="notepad-editor-wrapper">
        <TiptapEditor />
      </div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.classic-notepad {
  font-size: 11px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notepad-menu {
  display: flex;
  gap: 10px;
  padding: 2px 5px;
  border-bottom: 1px solid var(--win-grey-dark);
  margin-bottom: 2px;
  flex-shrink: 0;
}

.notepad-editor-wrapper {
  flex-grow: 1;
  overflow: hidden;
}
</style>
