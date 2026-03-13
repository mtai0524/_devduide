<script setup>
const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <div class="taskbar aero-glass">
    <div class="start-orb">
      <div class="orb-content"></div>
    </div>
    <div class="taskbar-items">
      <div class="taskbar-item active">Desktop</div>
      <div class="taskbar-item">Browser</div>
    </div>
    <div class="system-tray">
      <div class="tray-icons">
        <span>🔇</span>
        <span>🌐</span>
      </div>
      <div class="clock">{{ currentTime }}</div>
    </div>
  </div>
</template>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  z-index: 9999;
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.start-orb {
  width: 48px;
  height: 48px;
  background: radial-gradient(circle, #4ea8de 0%, #1b4d8d 100%);
  border-radius: 50%;
  margin-top: -15px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 10px rgba(78, 168, 222, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.start-orb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(78, 168, 222, 0.8);
}

.orb-content {
  width: 20px;
  height: 20px;
  background: white;
  mask: radial-gradient(circle, transparent 40%, black 41%); /* Mocking the logo */
  opacity: 0.8;
}

.taskbar-items {
  flex-grow: 1;
  display: flex;
  gap: 5px;
  margin-left: 15px;
}

.taskbar-item {
  height: 30px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.taskbar-item.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.system-tray {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 10px;
  color: white;
}

.tray-icons {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.clock {
  font-size: 12px;
  font-weight: 500;
}
</style>
