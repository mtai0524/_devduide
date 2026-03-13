<script setup>
import { reactive, ref } from 'vue'
import ClassicTaskbar from './components/ClassicTaskbar.vue'
import Hero from './components/Hero.vue'
import About from './components/About.vue'
import Projects from './components/Projects.vue'
import Contact from './components/Contact.vue'

const windows = reactive({
  hero: { title: 'Welcome', isOpen: true, isMinimized: false, zIndex: 101, initialX: 100, initialY: 50, initialWidth: 350, initialHeight: 180 },
  about: { title: 'About - Notepad', isOpen: true, isMinimized: false, zIndex: 102, initialX: 120, initialY: 250, initialWidth: 400, initialHeight: 250 },
  projects: { title: 'My Projects', isOpen: true, isMinimized: false, zIndex: 103, initialX: 450, initialY: 80, initialWidth: 450, initialHeight: 200 },
  contact: { title: 'Contact Me', isOpen: true, isMinimized: false, zIndex: 104, initialX: 500, initialY: 300, initialWidth: 320, initialHeight: 220 }
})

const maxZ = ref(104)

const handleFocus = (id) => {
  if (windows[id].isMinimized) {
    windows[id].isMinimized = false
  }
  maxZ.value++
  windows[id].zIndex = maxZ.value
}

const closeWindow = (id) => {
  windows[id].isOpen = false
}

const minimizeWindow = (id) => {
  windows[id].isMinimized = true
}

const openWindow = (id) => {
  if (!windows[id].isOpen) {
    windows[id].isOpen = true
  }
  handleFocus(id)
}

const toggleMinimize = (id) => {
  if (windows[id].isMinimized) {
    handleFocus(id)
  } else {
    minimizeWindow(id)
  }
}
</script>

<template>
  <div class="classic-desktop">
    <main class="desktop">
      <div class="desktop-icons">
        <div class="classic-icon-item" @dblclick="openWindow('projects')">
          <div class="icon-graphic">💽</div>
          <div class="icon-label">My Computer</div>
        </div>
        <div class="classic-icon-item" @dblclick="openWindow('hero')">
          <div class="icon-graphic">📄</div>
          <div class="icon-label">Portfolio.hlp</div>
        </div>
        <div class="classic-icon-item" @dblclick="openWindow('about')">
          <div class="icon-graphic">📝</div>
          <div class="icon-label">About.txt</div>
        </div>
        <div class="classic-icon-item">
          <div class="icon-graphic">🗑️</div>
          <div class="icon-label">Recycle Bin</div>
        </div>
      </div>
      
      <div class="classic-windows-container">
        <Hero 
          v-if="windows.hero.isOpen"
          :isMinimized="windows.hero.isMinimized"
          :initialX="windows.hero.initialX" 
          :initialY="windows.hero.initialY" 
          :initialWidth="windows.hero.initialWidth"
          :initialHeight="windows.hero.initialHeight"
          :zIndex="windows.hero.zIndex"
          @focus="handleFocus('hero')"
          @close="closeWindow('hero')"
          @minimize="minimizeWindow('hero')"
        />
        <About 
          v-if="windows.about.isOpen"
          :isMinimized="windows.about.isMinimized"
          :initialX="windows.about.initialX" 
          :initialY="windows.about.initialY" 
          :initialWidth="windows.about.initialWidth"
          :initialHeight="windows.about.initialHeight"
          :zIndex="windows.about.zIndex"
          @focus="handleFocus('about')"
          @close="closeWindow('about')"
          @minimize="minimizeWindow('about')"
        />
        <Projects 
          v-if="windows.projects.isOpen"
          :isMinimized="windows.projects.isMinimized"
          :initialX="windows.projects.initialX" 
          :initialY="windows.projects.initialY" 
          :initialWidth="windows.projects.initialWidth"
          :initialHeight="windows.projects.initialHeight"
          :zIndex="windows.projects.zIndex"
          @focus="handleFocus('projects')"
          @close="closeWindow('projects')"
          @minimize="minimizeWindow('projects')"
        />
        <Contact 
          v-if="windows.contact.isOpen"
          :isMinimized="windows.contact.isMinimized"
          :initialX="windows.contact.initialX" 
          :initialY="windows.contact.initialY" 
          :initialWidth="windows.contact.initialWidth"
          :initialHeight="windows.contact.initialHeight"
          :zIndex="windows.contact.zIndex"
          @focus="handleFocus('contact')"
          @close="closeWindow('contact')"
          @minimize="minimizeWindow('contact')"
        />
      </div>
    </main>
    <ClassicTaskbar 
      :windows="windows" 
      @open-app="openWindow" 
      @toggle-minimize="toggleMinimize" 
    />
  </div>
</template>

<style>
.classic-desktop {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.desktop-icons {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.classic-icon-item {
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
}

.icon-graphic {
  font-size: 32px;
}

.icon-label {
  color: white;
  font-size: 11px;
  text-align: center;
  padding: 1px 2px;
}

.classic-icon-item:hover .icon-label {
  background-color: var(--win-blue);
}

.classic-windows-container {
  padding: 10px 10px 40px 80px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  height: 100%;
}

@media (max-width: 768px) {
  .classic-windows-container {
    padding-left: 10px;
  }
}
</style>
