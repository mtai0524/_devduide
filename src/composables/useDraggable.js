import { ref, onMounted, onUnmounted } from 'vue'

export function useDraggable(el, { handle, initialX = 0, initialY = 0 } = {}) {
  const x = ref(initialX)
  const y = ref(initialY)
  const isDragging = ref(false)

  let startMouseX = 0
  let startMouseY = 0
  let startX = 0
  let startY = 0

  const onMouseDown = (e) => {
    isDragging.value = true
    startMouseX = e.clientX
    startMouseY = e.clientY
    startX = x.value
    startY = y.value

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    
    // Prevent text selection during drag
    e.preventDefault()
  }

  const onMouseMove = (e) => {
    if (!isDragging.value) return
    const dx = e.clientX - startMouseX
    const dy = e.clientY - startMouseY
    x.value = startX + dx
    y.value = startY + dy
  }

  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  onMounted(() => {
    const handleEl = handle?.value || el.value
    if (handleEl) {
      handleEl.addEventListener('mousedown', onMouseDown)
    }
  })

  onUnmounted(() => {
    const handleEl = handle?.value || el.value
    if (handleEl) {
      handleEl.removeEventListener('mousedown', onMouseDown)
    }
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return { x, y, isDragging }
}
