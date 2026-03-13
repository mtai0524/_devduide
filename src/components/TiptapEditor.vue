<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import SlashMenu from '../composables/suggestion'

const editor = useEditor({
  content: `
    <h2>Giới thiệu về tôi</h2>
    <p>Chào mừng bạn đến với Windows Server Portfolio của tôi. Đây là nơi tôi chia sẻ các dự án và kỹ năng của mình.</p>
    <h3>Kỹ năng chính:</h3>
    <ul>
      <li>Vue.js & Modern Web Development</li>
      <li>Windows Server UI Design</li>
      <li>Interactive App Development</li>
    </ul>
    <p>Hãy thử gõ dấu <strong>/</strong> để mở menu chọn định dạng nhé!</p>
  `,
  extensions: [
    StarterKit,
    SlashMenu,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
    },
  },
})
</script>

<template>
  <div class="tiptap-container classic-inset">
    <editor-content :editor="editor" class="tiptap-editor" />
  </div>
</template>

<style scoped>
.tiptap-container {
  height: 100%;
  background-color: white;
  overflow-y: auto;
  cursor: text;
}

.tiptap-editor {
  padding: 10px;
  min-height: 100%;
  font-family: 'Tahoma', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: black;
}

/* Tiptap specific styles to match Notepad */
:deep(.tiptap) {
  outline: none;
}

:deep(.tiptap p) {
  margin-bottom: 0.5em;
}

:deep(.tiptap h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.tiptap h3) {
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.tiptap ul) {
  padding-left: 20px;
  list-style-type: disc;
  margin-bottom: 0.5em;
}
</style>
