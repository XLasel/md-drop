declare module 'markdown-it-footnote' {
  import type MarkdownIt from 'markdown-it'

  function footnotePlugin(md: MarkdownIt): void

  export default footnotePlugin
}

declare module 'markdown-it-task-lists' {
  import type MarkdownIt from 'markdown-it'

  interface TaskListOptions {
    enabled?: boolean
    label?: boolean
    labelAfter?: boolean
  }

  function taskListsPlugin(md: MarkdownIt, options?: TaskListOptions): void

  export default taskListsPlugin
}
