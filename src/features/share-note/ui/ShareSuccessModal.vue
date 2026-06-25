<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  getNoteUrl,
  updateNoteAsAuthor,
  updateNoteByToken,
} from '@/entities/note/api/noteRepository'
import { useAuthStore } from '@/entities/user/model/authStore'
import { useCopyToClipboard } from '@/shared/lib/useCopyToClipboard'
import { useToast } from '@/shared/lib/toast'
import { useNewNote } from '@/features/new-note/lib/useNewNote'
import UiButton from '@/shared/ui/Button/UiButton.vue'

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
const { t } = useI18n()
const toast = useToast()
const authStore = useAuthStore()
const { copyText } = useCopyToClipboard()
const { startNewNote } = useNewNote()

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
      if (!updated) throw new Error(t('share.indexingFailed'))
    } else if (props.authorId && authStore.user?.id === props.authorId) {
      await updateNoteAsAuthor(props.slug, props.title, props.content, props.authorId, value)
    }

    emit('indexableChange', value)
  } catch (error) {
    localIndexable.value = !value
    toast.error(error instanceof Error ? error.message : t('share.indexingUpdateFailed'))
  } finally {
    savingIndexable.value = false
  }
}

function copyLink() {
  copyText(getNoteUrl(props.slug), t('clipboard.linkCopied'))
  flashCopied('link')
}

function copyMarkdown() {
  copyText(props.content, t('clipboard.markdownCopied'))
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

function writeNew() {
  emit('close')
  void startNewNote()
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
                  stroke="var(--on-accent)"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :class="$style.checkPath"
                />
              </svg>
            </span>
          </div>
          <h2 :class="$style.title">{{ t('share.noteLive') }}</h2>
          <p :class="$style.subtitle">{{ t('share.noteLiveHint') }}</p>
        </div>

        <div :class="$style.linkRow">
          <span :class="$style.linkText">{{ displayUrl() }}</span>
          <UiButton variant="primary" size="sm" @click="copyLink">
            {{ copiedLink ? t('share.copied') : t('share.copyLink') }}
          </UiButton>
        </div>

        <UiButton variant="secondary" size="sm" :class="$style.copyMd" @click="copyMarkdown">
          {{ copiedMd ? t('share.markdownCopied') : t('share.copyMarkdownSource') }}
        </UiButton>

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
            <span :class="$style.seoTitle">{{ t('share.seoTitle') }}</span>
            <span :class="$style.seoHint">
              {{
                t('share.seoHint', {
                  state: localIndexable ? t('share.seoOn') : t('share.seoOff'),
                })
              }}
            </span>
          </span>
        </button>

        <div :class="$style.actions">
          <UiButton variant="secondary" size="sm" :class="$style.actionBtn" @click="emit('close')">
            {{ t('common.done') }}
          </UiButton>
          <UiButton variant="accent-outline" size="sm" :class="$style.actionBtn" @click="writeNew">
            {{ t('share.writeNew') }}
          </UiButton>
          <UiButton variant="primary" size="sm" :class="$style.actionBtn" @click="viewPage">
            {{ t('share.viewPage') }}
          </UiButton>
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
  overflow: visible;
  pointer-events: none;
  z-index: 1;

  span {
    position: absolute;
    border-radius: 2px;
    background: var(--accent);
    opacity: 0;
    will-change: transform, opacity;

    &:nth-child(1) {
      left: -90px;
      top: 30px;
      width: 8px;
      height: 8px;
      animation: confetti-fall-a 1.1s 0.15s ease-out forwards;
    }

    &:nth-child(2) {
      left: -40px;
      top: 10px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent2);
      animation: confetti-fall-b 1.3s 0.05s ease-out forwards;
    }

    &:nth-child(3) {
      left: 30px;
      top: 20px;
      width: 9px;
      height: 9px;
      background: var(--accent2);
      animation: confetti-fall-c 1s 0.2s ease-out forwards;
    }

    &:nth-child(4) {
      left: 80px;
      top: 8px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      animation: confetti-fall-d 1.25s 0.1s ease-out forwards;
    }

    &:nth-child(5) {
      left: 115px;
      top: 34px;
      width: 8px;
      height: 8px;
      background: var(--accent2);
      animation: confetti-fall-e 1.15s 0.25s ease-out forwards;
    }
  }
}

@keyframes confetti-fall-a {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translate(-18px, 160px) rotate(420deg);
    opacity: 0;
  }
}

@keyframes confetti-fall-b {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translate(12px, 150px) rotate(-320deg);
    opacity: 0;
  }
}

@keyframes confetti-fall-c {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translate(-10px, 170px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes confetti-fall-d {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translate(22px, 145px) rotate(-400deg);
    opacity: 0;
  }
}

@keyframes confetti-fall-e {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translate(-14px, 155px) rotate(380deg);
    opacity: 0;
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

.copyMd {
  display: block;
  width: 100%;
  margin-bottom: var(--space-s);
  text-align: center;
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
  color: var(--on-accent);
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

.actionBtn {
  flex: 1;
  justify-content: center;
}
</style>
