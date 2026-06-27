<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const model = defineModel<string>({ required: true })

defineProps<{
  placeholder?: string
}>()

const { t } = useI18n()

const wordCount = computed(() => {
  const words = model.value.trim() ? model.value.trim().split(/\s+/).length : 0
  return t('editor.wordCount', words)
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
        spellcheck="false"
      />
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
  padding: var(--space-xs) var(--space-s);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
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
  padding: var(--field-pad-top) var(--space-s) var(--field-pad-bottom);
  border: none;
  resize: none;
  background: transparent;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--field-font-size);
  line-height: var(--field-line-height);

  &::placeholder {
    color: var(--faint);
  }

  &:focus {
    outline: none;
    color: var(--ink);
  }
}
</style>
