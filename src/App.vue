<script setup>
import { reactive, ref, onMounted } from 'vue'
import ClassicTaskbar from './components/ClassicTaskbar.vue'
import Hero from './components/Hero.vue'
import About from './components/About.vue'
import Projects from './components/Projects.vue'
import Contact from './components/Contact.vue'
import Minesweeper from './components/Minesweeper.vue'
import ThreeGame from './components/ThreeGame.vue'
import WebGLGame from './components/WebGLGame.vue'
import CatGame from './components/CatGame.vue'
import BrickRacing from './components/BrickRacing.vue'
import ContextMenu from './components/ContextMenu.vue'

const windows = reactive({
  hero: { title: 'Welcome', isOpen: true, isMinimized: false, zIndex: 101, initialX: 100, initialY: 50, initialWidth: 350, initialHeight: 180 },
  about: { title: 'About - Notepad', isOpen: true, isMinimized: false, zIndex: 102, initialX: 120, initialY: 250, initialWidth: 400, initialHeight: 250 },
  projects: { title: 'My Projects', isOpen: true, isMinimized: false, zIndex: 103, initialX: 450, initialY: 80, initialWidth: 450, initialHeight: 200 },
  contact: { title: 'Contact Me', isOpen: true, isMinimized: false, zIndex: 104, initialX: 500, initialY: 300, initialWidth: 320, initialHeight: 220 },
  minesweeper: { title: 'Minesweeper', isOpen: false, isMinimized: false, zIndex: 105, initialX: 200, initialY: 100, initialWidth: 300, initialHeight: 350 },
  threeGame: { title: '3D Space Explorer', isOpen: false, isMinimized: false, zIndex: 106, initialX: 250, initialY: 150, initialWidth: 400, initialHeight: 300 },
  webglGame: { title: 'WebGL Terminal', isOpen: false, isMinimized: false, zIndex: 107, initialX: 150, initialY: 180, initialWidth: 400, initialHeight: 300 },
  catGame: { title: 'Cat Fish Catcher', isOpen: false, isMinimized: false, zIndex: 108, initialX: 300, initialY: 200, initialWidth: 400, initialHeight: 350 },
  brickRacer: { title: 'Brick Racer', isOpen: false, isMinimized: false, zIndex: 109, initialX: 100, initialY: 120, initialWidth: 320, initialHeight: 450 }
})

const maxZ = ref(108)
const activeWindowId = ref(null)

const contextMenu = reactive({
  show: false,
  x: 0,
  y: 0,
  items: []
})

const focusedIcon = ref(null)

const desktopMenuItems = [
  { label: 'Welcome', icon: '📄', action: () => openWindow('hero') },
  { label: 'My Computer', icon: '💽', action: () => openWindow('projects') },
  { separator: true },
  { label: 'Games', icon: '🎮', action: () => {} }, // Placeholder
  { separator: true },
  { label: 'Refresh', action: () => window.location.reload() },
  { label: 'New Task', disabled: true },
  { separator: true },
  { label: 'Properties', action: () => alert('Windows Portfolio v1.0. Created with <3') }
]

const handleFocus = (id) => {
  focusedIcon.value = null 
  activeWindowId.value = id
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
  focusedIcon.value = null
  if (!windows[id].isOpen) {
    windows[id].isOpen = true
  }
  handleFocus(id)
}

const minimizeAll = () => {
  Object.keys(windows).forEach(id => {
    if (windows[id].isOpen) {
      windows[id].isMinimized = true
    }
  })
}

const toggleMinimize = (id) => {
  if (windows[id].isMinimized) {
    handleFocus(id)
  } else {
    minimizeWindow(id)
  }
}

const handleContextMenu = (e) => {
  e.preventDefault()
  contextMenu.x = e.clientX
  contextMenu.y = e.clientY
  contextMenu.items = desktopMenuItems
  contextMenu.show = true
}

const iconIds = ['projects', 'hero', 'minesweeper', 'threeGame', 'about']

const handleGlobalKeyDown = (e) => {
  // Alt + F4: Close active window
  if (e.altKey && e.key === 'F4') {
    e.preventDefault()
    let highestZ = -1
    let activeId = null
    Object.keys(windows).forEach(id => {
      if (windows[id].isOpen && !windows[id].isMinimized && windows[id].zIndex > highestZ) {
        highestZ = windows[id].zIndex
        activeId = id
      }
    })
    if (activeId) closeWindow(activeId)
  }

  // Alt + M: Minimize all
  if (e.altKey && e.key === 'm') {
    e.preventDefault()
    minimizeAll()
  }

  // Escape to close menu or clear focus
  if (e.key === 'Escape') {
    contextMenu.show = false
    focusedIcon.value = null
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown)
})
</script>

<template>
  <div class="classic-desktop" @contextmenu="handleContextMenu">
    <main class="desktop">
      <div class="desktop-icons">
        <div 
          class="classic-icon-item" 
          :class="{ focused: focusedIcon === 'projects' }"
          @click="focusedIcon = 'projects'"
          @dblclick="openWindow('projects')"
        >
          <div class="icon-graphic">💽</div>
          <div class="icon-label">My Computer</div>
        </div>
        <div 
          class="classic-icon-item" 
          :class="{ focused: focusedIcon === 'hero' }"
          @click="focusedIcon = 'hero'"
          @dblclick="openWindow('hero')"
        >
          <div class="icon-graphic">📄</div>
          <div class="icon-label">Portfolio.hlp</div>
        </div>
        <div 
          class="classic-icon-item" 
          :class="{ focused: focusedIcon === 'minesweeper' }"
          @click="focusedIcon = 'minesweeper'"
          @dblclick="openWindow('minesweeper')"
        >
          <div class="icon-graphic">💣</div>
          <div class="icon-label">Minesweeper</div>
        </div>
        <div 
          class="classic-icon-item" 
          :class="{ focused: focusedIcon === 'threeGame' }"
          @click="focusedIcon = 'threeGame'"
          @dblclick="openWindow('threeGame')"
        >
          <div class="icon-graphic">🧊</div>
          <div class="icon-label">3D Space</div>
        </div>
        <div 
          class="classic-icon-item" 
          :class="{ focused: focusedIcon === 'webglGame' }"
          @click="focusedIcon = 'webglGame'"
          @dblclick="openWindow('webglGame')"
        >
          <div class="icon-graphic">📺</div>
          <div class="icon-label">WebGL Term</div>
        </div>
        <div 
          class="classic-icon-item" 
          :class="{ focused: focusedIcon === 'catGame' }"
          @click="focusedIcon = 'catGame'"
          @dblclick="openWindow('catGame')"
        >
          <div class="icon-graphic">🐱</div>
          <div class="icon-label">Cat Catch</div>
        </div>
        <div 
          class="classic-icon-item" 
          :class="{ focused: focusedIcon === 'brickRacer' }"
          @click="focusedIcon = 'brickRacer'"
          @dblclick="openWindow('brickRacer')"
        >
          <div class="icon-graphic">🏎️</div>
          <div class="icon-label">Brick Racer</div>
        </div>
        <div 
          class="classic-icon-item" 
          :class="{ focused: focusedIcon === 'about' }"
          @click="focusedIcon = 'about'"
          @dblclick="openWindow('about')"
        >
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
        <Minesweeper 
          v-if="windows.minesweeper.isOpen"
          :isMinimized="windows.minesweeper.isMinimized"
          :initialX="windows.minesweeper.initialX" 
          :initialY="windows.minesweeper.initialY" 
          :initialWidth="windows.minesweeper.initialWidth"
          :initialHeight="windows.minesweeper.initialHeight"
          :zIndex="windows.minesweeper.zIndex"
          @focus="handleFocus('minesweeper')"
          @close="closeWindow('minesweeper')"
          @minimize="minimizeWindow('minesweeper')"
        />
        <ThreeGame 
          v-if="windows.threeGame.isOpen"
          :isMinimized="windows.threeGame.isMinimized"
          :initialX="windows.threeGame.initialX" 
          :initialY="windows.threeGame.initialY" 
          :initialWidth="windows.threeGame.initialWidth"
          :initialHeight="windows.threeGame.initialHeight"
          :zIndex="windows.threeGame.zIndex"
          @focus="handleFocus('threeGame')"
          @close="closeWindow('threeGame')"
          @minimize="minimizeWindow('threeGame')"
        />
        <WebGLGame 
          v-if="windows.webglGame.isOpen"
          :isMinimized="windows.webglGame.isMinimized"
          :initialX="windows.webglGame.initialX" 
          :initialY="windows.webglGame.initialY" 
          :initialWidth="windows.webglGame.initialWidth"
          :initialHeight="windows.webglGame.initialHeight"
          :zIndex="windows.webglGame.zIndex"
          @focus="handleFocus('webglGame')"
          @close="closeWindow('webglGame')"
          @minimize="minimizeWindow('webglGame')"
        />
        <CatGame 
          v-if="windows.catGame.isOpen"
          :isMinimized="windows.catGame.isMinimized"
          :initialX="windows.catGame.initialX" 
          :initialY="windows.catGame.initialY" 
          :initialWidth="windows.catGame.initialWidth"
          :initialHeight="windows.catGame.initialHeight"
          :zIndex="windows.catGame.zIndex"
          @focus="handleFocus('catGame')"
          @close="closeWindow('catGame')"
          @minimize="minimizeWindow('catGame')"
        />
        <BrickRacing 
          v-if="windows.brickRacer.isOpen"
          :isMinimized="windows.brickRacer.isMinimized"
          :initialX="windows.brickRacer.initialX" 
          :initialY="windows.brickRacer.initialY" 
          :initialWidth="windows.brickRacer.initialWidth"
          :initialHeight="windows.brickRacer.initialHeight"
          :zIndex="windows.brickRacer.zIndex"
          @focus="handleFocus('brickRacer')"
          @close="closeWindow('brickRacer')"
          @minimize="minimizeWindow('brickRacer')"
        />
      </div>
    </main>
    <ClassicTaskbar 
      :windows="windows" 
      @open-app="openWindow" 
      @toggle-minimize="toggleMinimize" 
    />

    <ContextMenu 
      v-if="contextMenu.show"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :items="contextMenu.items"
      @close="contextMenu.show = false"
      @select="(item) => item.action && item.action()"
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

.classic-icon-item.focused .icon-label {
  background-color: var(--win-blue);
  outline: 1px dotted white;
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
