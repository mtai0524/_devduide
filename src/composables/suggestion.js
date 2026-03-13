import { Extension, VueRenderer } from '@tiptap/vue-3'
import Suggestion from '@tiptap/suggestion'
import tippy from 'tippy.js'
import SlashMenuList from '../components/SlashMenuList.vue'

export default Extension.create({
  name: 'slashMenu',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
        items: ({ query }) => {
          return [
            {
              title: 'Heading 1',
              description: 'Large section heading',
              icon: 'H1',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 1 })
                  .run()
              },
            },
            {
              title: 'Heading 2',
              description: 'Medium section heading',
              icon: 'H2',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 2 })
                  .run()
              },
            },
            {
              title: 'Bullet List',
              description: 'Create a simple bulleted list',
              icon: '•',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBulletList()
                  .run()
              },
            },
            {
              title: 'Numbered List',
              description: 'Create a list with numbering',
              icon: '1.',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleOrderedList()
                  .run()
              },
            },
            {
              title: 'Bold',
              description: 'Make text bold',
              icon: 'B',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setMark('bold')
                  .run()
              },
            },
            {
              title: 'Italic',
              description: 'Make text italic',
              icon: 'I',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setMark('italic')
                  .run()
              },
            },
          ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
        },
        render: () => {
          let component
          let popup

          return {
            onStart: props => {
              component = new VueRenderer(SlashMenuList, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) {
                return
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },

            onUpdate(props) {
              component.updateProps(props)

              if (!props.clientRect) {
                return
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup[0].hide()
                return true
              }

              return component.ref?.onKeyDown(props)
            },

            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
