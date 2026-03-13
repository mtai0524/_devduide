<script setup>
import { ref, reactive } from 'vue'
import ClassicWindow from './ClassicWindow.vue'

const props = defineProps({
  isActive: Boolean,
  isMinimized: Boolean,
  initialX: Number,
  initialY: Number,
  initialWidth: Number,
  initialHeight: Number,
  zIndex: Number
})

const emit = defineEmits(['focus', 'close', 'minimize'])

const files = reactive([
  { 
    name: 'App.vue', 
    icon: '📦', 
    content: `<script setup>\nimport { reactive } from 'vue'\n\nconst windows = reactive({\n  hero: { title: 'Welcome', isOpen: true },\n  projects: { title: 'Built with RetroJS' }\n})\n<\/script>\n\n<template>\n  <Desktop :active="true" />\n</template>`,
    language: 'javascript'
  },
  { 
    name: 'WebGL_Rain.glsl', 
    icon: '🌊', 
    content: `precision mediump float;\nvarying vec2 vTexCoord;\nuniform float uTime;\n\nvoid main() {\n  float brightness = sin(vTexCoord.y * 10.0 + uTime);\n  gl_FragColor = vec4(0.0, brightness, 0.0, 1.0);\n}`,
    language: 'glsl'
  },
  { 
    name: 'CatLogic.js', 
    icon: '🐱', 
    content: `function catchFish(cat, fish) {\n  if (distance(cat, fish) < 20) {\n    score += 10;\n    playSound('meow.wav');\n    spawnNewFish();\n  }\n}`,
    language: 'javascript'
  },
  { 
    name: 'Readme.txt', 
    icon: '📝', 
    content: `VISUAL SOURCE v1.0\n------------------\nA highly sophisticated Integrated Development Environment for the Retro OS.\n\nFeatures:\n- Advanced Line Buffering\n- 16-color "Syntax Assist"\n- Zero latency typing (simulated)`,
    language: 'text'
  }
])

const activeFileIndex = ref(0)
const selectedFile = ref(files[0])

const selectFile = (index) => {
  activeFileIndex.value = index
  selectedFile.value = files[index]
}

const highlightCode = (code, lang) => {
  if (lang === 'text') return code
  
  // Very simple regex highlighters for visual effect
  let h = code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(const|let|var|function|return|if|else|import|from|export|default)/g, '<span class="keyword">$1</span>')
    .replace(/(import|from|precision|mediump|varying|uniform|void)/g, '<span class="keyword">$1</span>')
    .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="string">$1</span>')
    .replace(/(\/\/. * )/g, '<span class="comment">$1</span>')
    .replace(/(setup|reactive|distance|playSound|spawnNewFish|sin|main)/g, '<span class="function">$1</span>')
  
  return h
}
</script>

<template>
  <ClassicWindow
    title="Visual Source - Professional Edition"
    id="visualSource"
    :initialX="initialX"
    :initialY="initialY"
    :initialWidth="initialWidth"
    :initialHeight="initialHeight"
    :zIndex="zIndex"
    :isMinimized="isMinimized"
    @focus="emit('focus')"
    @close="emit('close')"
    @minimize="emit('minimize')"
  >
    <div class="ide-container">
      <!-- IDE Menu Bar -->
      <div class="ide-menubar">
        <span class="menu-item underline">F</span>ile
        <span class="menu-item underline">E</span>dit
        <span class="menu-item underline">S</span>earch
        <span class="menu-item underline">P</span>roject
        <span class="menu-item underline">R</span>un
        <span class="menu-item underline">O</span>ptions
      </div>

      <div class="ide-main-area">
        <!-- Sidebar Explorer -->
        <div class="ide-sidebar classic-inset">
          <div class="sidebar-header">EXPLORER</div>
          <div 
            v-for="(file, index) in files" 
            :key="index"
            class="sidebar-item"
            :class="{ active: activeFileIndex === index }"
            @click="selectFile(index)"
          >
            <span class="file-icon">{{ file.icon }}</span>
            <span class="file-name">{{ file.name }}</span>
          </div>
        </div>

        <!-- Editor Area -->
        <div class="ide-editor-container">
          <div class="editor-tabs">
            <div 
              v-for="(file, index) in files" 
              :key="'tab-'+index"
              class="editor-tab classic-outset"
              :class="{ active: activeFileIndex === index }"
              @click="selectFile(index)"
            >
              {{ file.name }}
            </div>
          </div>
          <div class="editor-body classic-inset">
            <pre class="code-output" v-html="highlightCode(selectedFile.content, selectedFile.language)"></pre>
          </div>
        </div>
      </div>

      <!-- Footer / Console -->
      <div class="ide-footer classic-inset">
        <div class="status-bar">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span>JavaScript</span>
        </div>
        <div class="console-output">
          &gt; Build started: Project: Portfolio, Configuration: Retro Debug Win32<br>
          &gt; Done building project "Portfolio".<br>
          &gt; ========== Build: 1 succeeded, 0 failed, 0 up-to-date, 0 skipped ==========
        </div>
      </div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.ide-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--win-grey);
  color: black;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
}

.ide-menubar {
  display: flex;
  padding: 2px 5px;
  background-color: var(--win-grey);
  border-bottom: 1px solid #808080;
  gap: 15px;
}

.menu-item {
  cursor: default;
}

.underline {
  text-decoration: underline;
}

.ide-main-area {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  padding: 2px;
  gap: 2px;
}

.ide-sidebar {
  width: 120px;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  background-color: var(--win-blue-dark);
  color: white;
  padding: 2px 5px;
  font-weight: bold;
  font-size: 9px;
}

.sidebar-item {
  padding: 2px 5px;
  cursor: default;
  display: flex;
  align-items: center;
  gap: 5px;
}

.sidebar-item:hover {
  background-color: #f0f0f0;
}

.sidebar-item.active {
  background-color: var(--win-blue);
  color: white;
}

.ide-editor-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-tabs {
  display: flex;
  background-color: var(--win-grey);
}

.editor-tab {
  padding: 2px 10px;
  margin-right: 1px;
  border-bottom: none;
  font-size: 10px;
  cursor: default;
}

.editor-tab.active {
  background-color: white;
  z-index: 10;
  position: relative;
  border-bottom: 2px solid white;
  margin-bottom: -1px;
}

.editor-body {
  flex-grow: 1;
  background-color: white;
  overflow: auto;
  padding: 10px;
}

.code-output {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre;
}

/* Syntax Highlighting */
:deep(.keyword) { color: #0000ff; font-weight: bold; }
:deep(.string) { color: #a31515; }
:deep(.function) { color: #795e26; }
:deep(.comment) { color: #008000; font-style: italic; }

.ide-footer {
  height: 80px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
}

.status-bar {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  padding: 2px 10px;
  background-color: var(--win-grey);
  border-top: 1px solid #808080;
  font-size: 10px;
}

.console-output {
  padding: 5px 10px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
  color: #333;
  overflow-y: auto;
  flex-grow: 1;
}

.classic-inset {
  border: 1px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}

.classic-outset {
  border: 1px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
}
</style>
