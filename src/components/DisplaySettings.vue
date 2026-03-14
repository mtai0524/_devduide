<script setup>
import { ref } from 'vue'
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

const emit = defineEmits(['focus', 'close', 'minimize', 'wallpaper-change'])

const previewImage = ref(localStorage.getItem('desktopWallpaper') || '')
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Check if file is too large before processing (optional but good practice)
  if (file.size > 10 * 1024 * 1024) {
    alert('File is too large! Please select an image under 10MB.')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new Image()
    img.onload = () => {
      // Create a canvas to resize and compress the image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Target resolution (max 1280px width)
      const maxW = 1280
      const maxH = 720
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxW) {
          height *= maxW / width
          width = maxW
        }
      } else {
        if (height > maxH) {
          width *= maxH / height
          height = maxH
        }
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to JPEG with 0.7 quality to save space
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
      previewImage.value = compressedBase64
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(file)
}

const applyWallpaper = () => {
  try {
    localStorage.setItem('desktopWallpaper', previewImage.value)
    emit('wallpaper-change', previewImage.value)
    alert('Wallpaper applied successfully!')
  } catch (e) {
    console.error(e)
    alert('Failed to save wallpaper: Image is still too large for browser storage. Try a smaller image.')
  }
}

const resetWallpaper = () => {
  localStorage.removeItem('desktopWallpaper')
  previewImage.value = ''
  emit('wallpaper-change', '')
}
</script>

<template>
  <ClassicWindow
    title="Display Properties"
    id="displaySettings"
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
    <div class="display-settings">
      <div class="tabs">
        <div class="tab active-tab">Background</div>
        <div class="tab">Screen Saver</div>
        <div class="tab">Appearance</div>
        <div class="tab">Settings</div>
      </div>
      
      <div class="tab-content classic-outset">
        <div class="monitor-preview classic-inset">
          <div class="monitor-screen" :style="{ backgroundImage: previewImage ? `url(${previewImage})` : 'none' }">
            <div v-if="!previewImage" class="no-wallpaper">Classic Teal</div>
          </div>
          <div class="monitor-stand"></div>
        </div>

        <div class="controls-area">
          <p class="instruction">Select an image to use as your desktop wallpaper:</p>
          <div class="button-group">
            <input 
              type="file" 
              ref="fileInput" 
              style="display: none" 
              accept="image/*" 
              @change="handleFileChange"
            >
            <button class="btn-classic" @click="triggerFileInput">Browse...</button>
            <button class="btn-classic" @click="resetWallpaper">Reset Default</button>
          </div>
          
          <div class="display-mode classic-inset">
            <label>Picture Display:</label>
            <select class="classic-input" disabled>
              <option>Stretch</option>
              <option>Tile</option>
              <option>Center</option>
            </select>
          </div>
        </div>
      </div>

      <div class="footer-buttons">
        <button class="btn-classic" @click="applyWallpaper">OK</button>
        <button class="btn-classic" @click="emit('close')">Cancel</button>
        <button class="btn-classic" @click="applyWallpaper">Apply</button>
      </div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.display-settings {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px;
  background-color: var(--win-grey);
}

.tabs {
  display: flex;
  gap: 2px;
  padding-left: 2px;
}

.tab {
  padding: 3px 10px;
  font-size: 11px;
  background-color: var(--win-grey);
  border: 1px solid;
  border-top-color: var(--win-white);
  border-left-color: var(--win-white);
  border-right-color: var(--win-grey-dark);
  border-bottom: none;
  cursor: default;
}

.active-tab {
  z-index: 10;
  margin-top: -2px;
  padding-top: 5px;
  background-color: var(--win-grey);
  border-bottom: 2px solid var(--win-grey);
}

.tab-content {
  flex-grow: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-top: none;
}

.monitor-preview {
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #404040;
  padding: 10px;
}

.monitor-screen {
  width: 140px;
  height: 90px;
  background-color: var(--win-teal);
  border: 4px solid #c0c0c0;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-wallpaper {
  font-size: 10px;
  color: white;
  text-shadow: 1px 1px black;
}

.monitor-stand {
  width: 40px;
  height: 10px;
  background-color: #c0c0c0;
  margin-top: 2px;
  clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
}

.controls-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.instruction {
  font-size: 11px;
}

.button-group {
  display: flex;
  gap: 5px;
}

.display-mode {
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
}

.classic-input {
  flex-grow: 1;
  font-size: 11px;
  padding: 2px;
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.btn-classic {
  min-width: 75px;
}
</style>
