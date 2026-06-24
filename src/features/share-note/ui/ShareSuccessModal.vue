<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  getNoteUrl,
  updateNoteAsAuthor,
  updateNoteByToken,
} from '@/entities/note/api/noteRepository'
import { useAuthStore } from '@/entities/user/model/authStore'
import { useCopyToClipboard } from '@/shared/lib/useCopyToClipboard'
import { useToast } from '@/shared/lib/toast'

const props = defineProps<{
  slug: string
  title: string
  content: string
  indexable: boolean
  editToken?: string | null
  authorId?: string | null
}>()

const emit = defineEmits<{
  close: []
  indexableChange: [value: boolean]
}>()

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const { copyText } = useCopyToClipboard()

const localIndexable = ref(props.indexable)
const savingIndexable = ref(false)
const copiedLink = ref(false)
const copiedMd = ref(false)

let copiedLinkTimer: ReturnType<typeof setTimeout> | undefined
let copiedMdTimer: ReturnType<typeof setTimeout> | undefined

const displayUrl = () => getNoteUrl(props.slug).replace(/^https?:\/\//, '')

watch(
  () => props.indexable,
  (value) => {
    localIndexable.value = value
  },
)

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
  clearTimeout(copiedLinkTimer)
  clearTimeout(copiedMdTimer)
})

function handleBackdropClick() {
  emit('close')
}

function handlePanelClick(event: MouseEvent) {
  event.stopPropagation()
}

function flashCopied(target: 'link' | 'md') {
  if (target === 'link') {
    copiedLink.value = true
    clearTimeout(copiedLinkTimer)
    copiedLinkTimer = setTimeout(() => {
      copiedLink.value = false
    }, 1800)
    return
  }

  copiedMd.value = true
  clearTimeout(copiedMdTimer)
  copiedMdTimer = setTimeout(() => {
    copiedMd.value = false
  }, 1800)
}

async function persistIndexable(value: boolean) {
  localIndexable.value = value
  savingIndexable.value = true

  try {
    if (props.editToken) {
      const updated = await updateNoteByToken({
        slug: props.slug,
        title: props.title,
        content: props.content,
        editToken: props.editToken,
        indexable: value,
      })
      if (!updated) throw new Error('Failed to update indexing preference')
    } else if (props.authorId && authStore.user?.id === props.authorId) {
      await updateNoteAsAuthor(props.slug, props.title, props.content, props.authorId, value)
    }

    emit('indexableChange', value)
  } catch (error) {
    localIndexable.value = !value
    toast.error(error instanceof Error ? error.message : 'Failed to update indexing')
  } finally {
    savingIndexable.value = false
  }
}

function copyLink() {
  copyText(getNoteUrl(props.slug), 'Link copied')
  flashCopied('link')
}

function copyMarkdown() {
  copyText(props.content, 'Markdown copied')
  flashCopied('md')
}

function toggleSeo() {
  if (savingIndexable.value) return
  void persistIndexable(!localIndexable.value)
}

function viewPage() {
  emit('close')
  void router.push(`/v/${props.slug}`)
}
</script>

<template>
  <Teleport to="body">
    <div :class="$style.backdrop" @click="handleBackdropClick">
      <div :class="$style.panel" role="dialog" aria-modal="true" @click="handlePanelClick">
        <div :class="$style.confetti" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div :class="$style.hero">
          <div :class="$style.checkWrap">
            <span :class="$style.checkRing" />
            <span :class="$style.checkIcon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12.5l4.2 4.2L19 7"
                  stroke="#fff"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :class="$style.checkPath"
                />
              </svg>
            </span>
          </div>
          <h2 :class="$style.title">Your note is live</h2>
          <p :class="$style.subtitle">Anyone with the link can read it — no account needed.</p>
        </div>

        <div :class="$style.linkRow">
          <span :class="$style.linkText">{{ displayUrl() }}</span>
          <button type="button" :class="$style.copyLinkBtn" @click="copyLink">
            {{ copiedLink ? 'Copied ✓' : 'Copy link' }}
          </button>
        </div>

        <button type="button" :class="$style.copyMd" @click="copyMarkdown">
          {{ copiedMd ? 'Markdown copied ✓' : 'Copy markdown source' }}
        </button>

        <button
          type="button"
          :class="$style.seo"
          :disabled="savingIndexable"
          @click="toggleSeo"
        >
          <span :class="[$style.seoBox, localIndexable && $style.seoBoxOn]">
            <span v-if="localIndexable">✓</span>
          </span>
          <span :class="$style.seoCopy">
            <span :class="$style.seoTitle">List in search engines</span>
            <span :class="$style.seoHint">
              Off keeps it link-only · currently {{ localIndexable ? 'on' : 'off' }}
            </span>
          </span>
        </button>

        <div :class="$style.actions">
          <button type="button" :class="$style.doneBtn" @click="emit('close')">Done</button>
          <button type="button" :class="$style.viewBtn" @click="viewPage">View page →</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style module lang="scss">
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-m);
  overflow-y: auto;
  background: color-mix(in oklch, var(--ink) 32%, transparent);
  backdrop-filter: blur(6px);
}

.panel {
  position: relative;
  width: 100%;
  max-width: var(--modal-width);
  margin: auto;
  padding: var(--space-l) var(--space-m) var(--space-m);
  border: 1px solid var(--line2);
  border-radius: var(--radius-xl);
  background: var(--panel);
  box-shadow: var(--shadow);
  overflow: hidden;
  animation: pop-in 0.42s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
}

.confetti {
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;

  span {
    position: absolute;
    border-radius: 2px;
    background: var(--accent);

    &:nth-child(1) {
      left: -90px;
      top: 30px;
      width: 8px;
      height: 8px;
      animation: confetti 1.1s 0.15s ease-out both;
    }

    &:nth-child(2) {
      left: -40px;
      top: 10px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent2);
      animation: confetti 1.3s 0.05s ease-out both;
    }

    &:nth-child(3) {
      left: 30px;
      top: 20px;
      width: 9px;
      height: 9px;
      background: var(--accent2);
      animation: confetti 1s 0.2s ease-out both;
    }

    &:nth-child(4) {
      left: 80px;
      top: 8px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      animation: confetti 1.25s 0.1s ease-out both;
    }

    &:nth-child(5) {
      left: 115px;
      top: 34px;
      width: 8px;
      height: 8px;
      background: var(--accent2);
      animation: confetti 1.15s 0.25s ease-out both;
    }
  }
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: var(--space-m);
}

.checkWrap {
  position: relative;
  width: 3.875rem;
  height: 3.875rem;
  margin-bottom: var(--space-s);
}

.checkRing {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--accent);
  animation: ring-pulse 1.2s 1 ease-out;
}

.checkIcon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.875rem;
  height: 3.875rem;
  border-radius: 50%;
  background: var(--accent);
}

.checkPath {
  stroke-dasharray: 30;
  animation: draw-check 0.5s 0.15s ease both;
}

.title {
  margin: 0 0 var(--space-3xs);
  font-size: var(--step-3);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--ink);
}

.subtitle {
  margin: 0;
  font-size: var(--step--1);
  color: var(--muted);
}

.linkRow {
  display: flex;
  align-items: center;
  gap: var(--gap-2xs);
  margin-bottom: var(--space-2xs);
  padding: var(--space-3xs) var(--space-3xs) var(--space-3xs) var(--space-s);
  border: 1px solid var(--line2);
  border-radius: var(--radius-md);
  background: var(--panel2);
}

.linkText {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--ink);
}

.copyLinkBtn {
  border: none;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-sans);
  font-size: var(--step--1);
  font-weight: 500;
  padding: 0.55em 1em;
  border-radius: var(--radius-md);
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: var(--accent-hover);
  }
}

.copyMd {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: var(--space-s);
  padding: 0.7em;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: var(--step--1);
  text-align: center;
  cursor: pointer;

  &:hover {
    background: var(--panel2);
    color: var(--ink);
  }
}

.seo {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  width: 100%;
  margin-bottom: var(--space-s);
  padding: var(--space-xs) var(--space-s);
  border: none;
  border-radius: var(--radius-md);
  background: var(--panel2);
  text-align: left;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
}

.seoBox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 1.5px solid var(--accent);
  border-radius: var(--radius-sm);
  background: transparent;
  color: #fff;
  font-size: var(--step--2);
  flex: none;
}

.seoBoxOn {
  background: var(--accent);
}

.seoCopy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.seoTitle {
  font-size: var(--step--1);
  font-weight: 500;
  color: var(--ink);
}

.seoHint {
  font-size: var(--step--2);
  color: var(--faint);
}

.actions {
  display: flex;
  gap: var(--gap-2xs);
}

.doneBtn,
.viewBtn {
  flex: 1;
  padding: 0.8em;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: var(--step--1);
  cursor: pointer;
  text-align: center;
}

.doneBtn {
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted);

  &:hover {
    color: var(--ink);
    background: var(--panel2);
  }
}

.viewBtn {
  border: none;
  background: var(--accent);
  color: #fff;
  font-weight: 500;

  &:hover {
    background: var(--accent-hover);
  }
}
</style>
