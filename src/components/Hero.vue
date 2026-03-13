<script setup>
import ClassicWindow from './ClassicWindow.vue'

defineProps(['isMinimized', 'initialX', 'initialY', 'initialWidth', 'initialHeight', 'zIndex'])
defineEmits(['focus', 'close', 'minimize'])
</script>

<template>
  <ClassicWindow 
    title="Welcome.exe" 
    id="hero"
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
    <div class="classic-hero-content">
      <h1 class="classic-welcome-title">Welcome to my Portfolio</h1>
      <p class="classic-hero-desc">
        System Version: 2026.03.13 <br />
        Developer: Lập Trình Viên
      </p>
      <div class="classic-hero-actions">
        <button class="btn-classic">View Projects</button>
        <button class="btn-classic">Contact Me</button>
      </div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.classic-hero-content {
  text-align: center;
}

.classic-welcome-title {
  font-size: 16px;
  color: #000;
  margin-bottom: 10px;
}

.classic-hero-desc {
  font-size: 11px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #000;
}

.classic-hero-actions {
  display: flex;
  gap: 5px;
  justify-content: center;
}
</style>
