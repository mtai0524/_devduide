<script setup>
import ClassicWindow from './ClassicWindow.vue'

defineProps(['isMinimized', 'initialX', 'initialY', 'initialWidth', 'initialHeight', 'zIndex'])
defineEmits(['focus', 'close', 'minimize'])
</script>

<template>
  <ClassicWindow 
    title="Contact - Dial-up" 
    id="contact"
    :isMinimized="isMinimized"
    :initialX="initialX"
    :initialY="initialY"
    :initialWidth="initialWidth"
    :initialHeight="initialHeight"
    :zIndex="zIndex"
    @focus="$emit('focus')"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
  >
    <div class="classic-contact">
      <div class="contact-prompt">
        <span class="classic-icon">📞</span>
        <span>Please select a connection method:</span>
      </div>
      <div class="classic-inset contact-list">
        <div>Email: dev@server.local</div>
        <div>GitHub: /devduide</div>
        <div>LinkedIn: /in/devduide</div>
      </div>
      <div class="classic-actions">
        <button class="btn-classic">Connect</button>
        <button class="btn-classic">Cancel</button>
      </div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.classic-contact {
  font-size: 11px;
}

.contact-prompt {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.classic-icon {
  font-size: 24px;
}

.contact-list {
  padding: 5px;
  margin-bottom: 10px;
  background-color: white;
}

.classic-actions {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}
</style>
