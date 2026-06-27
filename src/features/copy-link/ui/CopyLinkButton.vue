<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getNoteUrl } from '@/entities/note'
import { useCopyToClipboard } from '@/shared/lib/useCopyToClipboard'
import { CoreButton, UiButton } from '@/shared/ui/Button'

const props = withDefaults(
  defineProps<{
    slug: string
    variant?: 'button' | 'inline'
  }>(),
  {
    variant: 'button',
  },
)

const { t } = useI18n()
const { copyText } = useCopyToClipboard()

const displayUrl = computed(() => getNoteUrl(props.slug).replace(/^https?:\/\//, ''))

function handleCopy() {
  copyText(getNoteUrl(props.slug), t('clipboard.linkCopied'))
}
</script>

<template>
  <UiButton
    v-if="variant === 'button'"
    variant="secondary"
    size="sm"
    :aria-label="t('common.copyLink')"
    @click="handleCopy"
  >
    <template #icon>⛓</template>
    {{ t('common.copyLink') }}
  </UiButton>

  <span v-else :class="$style.inline">
    <span :class="$style.url">{{ displayUrl }}</span>
    <CoreButton
      type="button"
      :class="$style.copyBtn"
      :aria-label="t('common.copyLink')"
      @click="handleCopy"
    >
      ⧉
    </CoreButton>
  </span>
</template>

<style module lang="scss">
.inline {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--muted);
}

.url {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copyBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  border: none;
  padding: 0;
  background: transparent;
  color: var(--muted);
  font: inherit;
  line-height: 1;
  cursor: pointer;

  @include transition(color);

  &:hover {
    color: var(--ink);
  }

  &:focus-visible {
    @include focus-ring;
    border-radius: var(--radius-sm);
  }
}
</style>
