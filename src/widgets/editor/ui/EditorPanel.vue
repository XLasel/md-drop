<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const model = defineModel<string>({ required: true })

defineProps<{
  placeholder?: string
  readonly?: boolean
  improving?: boolean
}>()

const { t } = useI18n()

const wordCount = computed(() => {
  const words = model.value.trim() ? model.value.trim().split(/\s+/).length : 0
  return t('editor.wordCount', { count: words })
})
</script>

<template>
  <div :class="$style.panel">
    <div :class="$style.label">
      <span>{{ t('editor.markdownLabel') }}</span>
      <span>{{ wordCount }}</span>
    </div>
    <div :class="$style.body">
      <textarea
        v-model="model"
        :class="$style.textarea"
        :placeholder="placeholder ?? t('editor.placeholder')"
        :readonly="readonly"
        spellcheck="false"
      />
      <div v-if="improving" :class="$style.shimmer" aria-hidden="true" />
    </div>
  </div>
</template>

<style module lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  border: 1px solid var(--line2);
  border-radius: var(--radius-lg);
  background: var(--panel);
  overflow: hidden;
}

.label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 18px;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--faint);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.body {
  position: relative;
  flex: 1;
  min-height: 320px;
}

.textarea {
  width: 100%;
  height: 100%;
  min-height: 320px;
  padding: 14px 22px 24px;
  border: none;
  resize: none;
  background: transparent;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.84375rem;
  line-height: 1.9;

  &::placeholder {
    color: var(--faint);
  }

  &:focus {
    outline: none;
    color: var(--ink);
  }
}

.shimmer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    100deg,
    transparent 20%,
    var(--accent-soft) 50%,
    transparent 80%
  );
  background-size: 440px 100%;
  animation: shimmer 1s linear infinite;
}
</style>
