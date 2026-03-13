<script setup>
defineProps({
  title: String,
  description: String,
  tags: Array,
  link: String
})
</script>

<template>
  <div class="classic-project-row">
    <span class="classic-file-icon">📁</span>
    <div class="classic-file-details">
      <div class="classic-file-name">{{ title }}</div>
      <div class="classic-file-info">{{ tags.join(', ') }}</div>
    </div>
  </div>
</template>

<style scoped>
.classic-project-row {
  display: flex;
  gap: 10px;
  padding: 2px 5px;
  cursor: default;
}

.classic-project-row:hover {
  background-color: var(--win-blue);
  color: white;
}

.classic-file-icon {
  font-size: 16px;
}

.classic-file-name {
  font-size: 11px;
}

.classic-file-info {
  font-size: 10px;
  opacity: 0.8;
}
</style>
