<script setup>
</script>

<template>
  <nav class="navbar">
    <div class="container nav-content">
      <div class="logo gradient-text">Portfolio</div>
      <ul class="nav-links">
        <li><a href="#about">Về tôi</a></li>
        <li><a href="#projects">Dự án</a></li>
        <li><a href="#contact">Liên hệ</a></li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 70px;
  display: flex;
  align-items: center;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  font-weight: 500;
  color: var(--text-muted);
}

.nav-links a:hover {
  color: var(--text);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
