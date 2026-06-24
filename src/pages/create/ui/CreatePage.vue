<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import FormatButton from '@/features/format-markdown/ui/FormatButton.vue'
import ShareButton from '@/features/share-note/ui/ShareButton.vue'
import { fetchNoteBySlug, hasEditAccess } from '@/entities/note/api/noteRepository'
import { useEditorStore } from '@/entities/note/model/editorStore'
import { useAuthStore } from '@/entities/user/model/authStore'
import {
  PAGE_HEADER_ACTIONS_ID,
  PAGE_HEADER_START_ID,
} from '@/widgets/header/lib/teleportTargets'
import EditorPanel from '@/widgets/editor/ui/EditorPanel.vue'
import PreviewPanel from '@/widgets/preview/ui/PreviewPanel.vue'

const route = useRoute()
const editorStore = useEditorStore()
const authStore = useAuthStore()
const { title, content, editingSlug } = storeToRefs(editorStore)

onMounted(async () => {
  const slug = route.query.edit as string | undefined
  if (!slug) return

  const note = await fetchNoteBySlug(slug)
  const canEdit =
    note && (hasEditAccess(slug) || note.author_id === authStore.user?.id)

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
  <div :class="$style.page">
    <Teleport :to="`#${PAGE_HEADER_START_ID}`">
      <span v-if="editingSlug" :class="$style.status">
        <span :class="$style.statusDot" />
        editing
      </span>
      <span v-else :class="$style.status">draft</span>
    </Teleport>

    <Teleport :to="`#${PAGE_HEADER_ACTIONS_ID}`">
      <FormatButton />
      <ShareButton />
    </Teleport>

    <div :class="$style.titleBlock">
      <input
        v-model="title"
        type="text"
        :class="$style.titleInput"
        placeholder="Note title"
        maxlength="100"
      />
      <span :class="$style.titleHint">title — optional</span>
    </div>

    <div :class="$style.workspace">
      <EditorPanel v-model="content" />
      <PreviewPanel :content="content" />
    </div>
  </div>
</template>

<style module lang="scss">
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--faint);
}

.statusDot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent2);
}

.titleBlock {
  max-width: var(--content-max-width);
  width: 100%;
  margin: 0 auto;
  padding: 26px 2.5rem 6px;
}

.titleInput {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--ink);
  font-size: 2.25rem;
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
  font-size: 0.8125rem;
  color: var(--faint);
}

.workspace {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  min-height: 0;
  max-width: var(--content-max-width);
  width: 100%;
  margin: 0 auto;
  padding: 18px 2.5rem 5.25rem;

  @include mobile {
    grid-template-columns: 1fr;
    padding-bottom: 2rem;
  }
}
</style>
