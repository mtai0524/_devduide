<script setup>
const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <div class="classic-taskbar classic-outset">
    <button class="classic-start-btn btn-classic">
      <span class="start-icon">🪟</span> <b>Start</b>
    </button>
    <div class="classic-taskbar-items">
      <div class="classic-task-item task-inset">Desktop</div>
      <div class="classic-task-item">My Portfolio</div>
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
}

.classic-task-item {
  height: 22px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  font-size: 11px;
  background-color: var(--win-grey);
  border: 1px solid;
  border-top-color: var(--win-white);
  border-left-color: var(--win-white);
  border-right-color: var(--win-grey-dark);
  border-bottom-color: var(--win-grey-dark);
}

.task-inset {
  border-top-color: var(--win-grey-dark);
  border-left-color: var(--win-grey-dark);
  border-right-color: var(--win-white);
  border-bottom-color: var(--win-white);
  background-color: var(--win-grey-light);
  font-weight: bold;
}

.classic-system-tray {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 5px;
  height: 22px;
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
