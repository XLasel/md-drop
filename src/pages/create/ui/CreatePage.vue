<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { fetchNoteBySlug, hasEditAccess, useEditorStore } from '@/entities/note'
import { useAuthStore } from '@/entities/user'
import { FormatButton } from '@/features/format-markdown'
import { NewNoteButton } from '@/features/new-note'
import { ShareButton } from '@/features/share-note'
import { EditorPanel } from '@/widgets/editor'
import { NoteActionsBar } from '@/widgets/note-actions'
import { PreviewPanel } from '@/widgets/preview'

const route = useRoute()
const { t } = useI18n()
const editorStore = useEditorStore()
const authStore = useAuthStore()
const { title, content, editingSlug } = storeToRefs(editorStore)

onMounted(async () => {
  const slug = route.query.edit as string | undefined
  if (!slug) return

  const note = await fetchNoteBySlug(slug)
  const canEdit = note && (hasEditAccess(slug) || note.author_id === authStore.user?.id)

  if (canEdit && note) {
    editorStore.startEditing(note.slug, note.title, note.content, note.indexable)
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
  <div :class="$style.root">
    <div :class="$style.titleBlock">
      <input
        v-model="title"
        type="text"
        :class="$style.titleInput"
        :placeholder="t('editor.titlePlaceholder')"
        maxlength="100"
      />
      <span :class="$style.titleHint">{{ t('editor.titleHint') }}</span>
    </div>

    <NoteActionsBar>
      <template #start>
        <span v-if="editingSlug" :class="$style.status">
          <span :class="$style.statusDot" />
          {{ t('editor.editing') }}
        </span>
        <span v-else :class="$style.status">{{ t('editor.draft') }}</span>
      </template>
      <NewNoteButton variant="ribbon" />
      <FormatButton />
      <ShareButton />
    </NoteActionsBar>

    <div :class="$style.workspace">
      <EditorPanel v-model="content" />
      <PreviewPanel :content="content" />
    </div>
  </div>
</template>

<style module lang="scss">
.root {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--header-height));
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--faint);
  white-space: nowrap;
}

.statusDot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent2);
  flex: none;
}

.titleBlock {
  @include layout-shell;
  padding: var(--page-pad-top-lg) 0 6px;
}

.titleInput {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--ink);
  font-size: var(--heading-md);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.1;

  &::placeholder {
    color: var(--faint);
  }

  &:focus {
    outline: none;
  }
}

.titleHint {
  display: block;
  margin-top: 6px;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--faint);
}

.workspace {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  min-height: 0;
  @include layout-shell;
  padding: var(--space-s) 0 var(--page-pad-bottom);

  @include mobile {
    grid-template-columns: 1fr;
    padding-bottom: var(--page-pad-bottom);
  }
}
</style>
