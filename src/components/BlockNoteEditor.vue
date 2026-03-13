<script setup>
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "blocknote-vue";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { onMounted, shallowRef } from "vue";

const editor = shallowRef();

onMounted(() => {
  editor.value = BlockNoteEditor.create();
});
</script>

<template>
  <div class="blocknote-container classic-inset">
    <BlockNoteView v-if="editor" :editor="editor" />
  </div>
</template>

<style scoped>
.blocknote-container {
  height: 100%;
  background-color: white;
  overflow-y: auto;
}

/* Customizing BlockNote to fit Classic theme if possible */
:deep(.bn-editor) {
  padding: 10px !important;
  font-family: 'Tahoma', sans-serif !important;
}
</style>
