<script setup>
import ClassicWindow from './ClassicWindow.vue'
import ProjectCard from './ProjectCard.vue'

defineProps(['isMinimized', 'initialX', 'initialY', 'zIndex'])
defineEmits(['focus', 'close', 'minimize'])

const projects = [
  {
    title: 'Financial System',
    description: 'Enterprise level financial management.',
    tags: ['COBOL', 'Java'],
    link: '#'
  },
  {
    title: 'Server Dashboard',
    description: 'Classic monitoring dashboard.',
    tags: ['PHP', 'C++'],
    link: '#'
  }
]
</script>

<template>
  <ClassicWindow 
    title="C:\Projects" 
    id="projects"
    :isMinimized="isMinimized"
    :initialX="initialX"
    :initialY="initialY"
    :zIndex="zIndex"
    @focus="$emit('focus')"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
  >
    <div class="classic-explorer">
      <div class="explorer-toolbar classic-outset">
        <span>Back</span> <span>Forward</span> <span>Up</span>
      </div>
      <div class="classic-inset explorer-content">
        <ProjectCard 
          v-for="project in projects" 
          :key="project.title"
          v-bind="project"
        />
      </div>
    </div>
  </ClassicWindow>
</template>

<style scoped>
.classic-explorer {
  font-size: 11px;
}

.explorer-toolbar {
  display: flex;
  gap: 5px;
  padding: 2px 5px;
  margin-bottom: 5px;
  border-width: 1px;
}

.explorer-content {
  height: 120px;
  overflow-y: auto;
}
</style>
