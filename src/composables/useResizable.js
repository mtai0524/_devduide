import { ref, onMounted, onUnmounted } from 'vue'

export function useResizable(el, { handle, initialWidth = 300, initialHeight = 200, minWidth = 150, minHeight = 100 } = {}) {
  const width = ref(initialWidth)
  const height = ref(initialHeight)
  const isResizing = ref(false)

  let startMouseX = 0
  let startMouseY = 0
  let startWidth = 0
  let startHeight = 0

  const onMouseDown = (e) => {
    isResizing.value = true
    startMouseX = e.clientX
    startMouseY = e.clientY
    startWidth = width.value
    startHeight = height.value

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    
    e.preventDefault()
    e.stopPropagation() // Prevent triggering drag
  }

  const onMouseMove = (e) => {
    if (!isResizing.value) return
    const dx = e.clientX - startMouseX
    const dy = e.clientY - startMouseY
    
    width.value = Math.max(minWidth, startWidth + dx)
    height.value = Math.max(minHeight, startHeight + dy)
  }

  const onMouseUp = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  onMounted(() => {
    const handleEl = handle?.value
    if (handleEl) {
      handleEl.addEventListener('mousedown', onMouseDown)
    }
  })

  onUnmounted(() => {
    const handleEl = handle?.value
    if (handleEl) {
      handleEl.removeEventListener('mousedown', onMouseDown)
    }
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return { width, height, isResizing }
}
