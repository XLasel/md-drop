<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ShareButton from '@/features/share-note/ui/ShareButton.vue'
import ThemePicker from '@/features/theme-picker/ui/ThemePicker.vue'
import { fetchNoteBySlug, hasEditAccess } from '@/entities/note/api/noteRepository'
import { useEditorStore } from '@/entities/note/model/editorStore'
import { useAuthStore } from '@/entities/user/model/authStore'
import EditorPanel from '@/widgets/editor/ui/EditorPanel.vue'
import AppHeader from '@/widgets/header/ui/AppHeader.vue'
import PreviewPanel from '@/widgets/preview/ui/PreviewPanel.vue'

const route = useRoute()
const editorStore = useEditorStore()
const authStore = useAuthStore()
const { content, theme, editingSlug } = storeToRefs(editorStore)

onMounted(async () => {
  const slug = route.query.edit as string | undefined
  if (!slug) return

  const note = await fetchNoteBySlug(slug)
  const canEdit =
    note &&
    (hasEditAccess(slug) || note.author_id === authStore.user?.id)

  if (canEdit && note) {
    editorStore.startEditing(note.slug, note.content, note.theme)
  } else {
    editorStore.reset()
  }
})

watch(
  () => route.query.edit,
  () => {
    if (!route.query.edit) {
      editorStore.reset()
    }
  },
)
</script>

<template>
  <div :data-theme="theme" :class="$style.page">
    <AppHeader>
      <ThemePicker v-model="theme" />
      <ShareButton />
    </AppHeader>

    <main :class="$style.main">
      <div v-if="editingSlug" :class="$style.editingBadge">
        Editing <code>{{ editingSlug }}</code>
      </div>

      <div :class="$style.workspace">
        <EditorPanel v-model="content" />
        <PreviewPanel :content="content" :theme="theme" />
      </div>
    </main>
  </div>
</template>

<style module lang="scss">
.page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.main {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 1rem;
}

.editingBadge {
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--accent-bg);
  color: var(--text-secondary);
  font-size: 0.875rem;

  code {
    font-family: var(--font-mono);
    color: var(--accent-color);
  }
}

.workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  min-height: calc(100vh - var(--header-height) - 2rem);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--border-color);

  @include mobile {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}
</style>
