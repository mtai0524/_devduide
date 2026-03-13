<script setup>
defineProps({
  title: {
    type: String,
    default: 'Windows Vista'
  },
  id: String
})
</script>

<template>
  <div :id="id" class="vista-window aero-glass">
    <div class="window-title-bar">
      <div class="window-title">{{ title }}</div>
      <div class="window-controls">
        <div class="control-btn"></div>
        <div class="control-btn"></div>
        <div class="control-btn close-btn"></div>
      </div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.window-content {
  color: #1e293b;
}
</style>
