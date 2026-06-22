<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  placeholder?: string
  readonly?: boolean
}>()
</script>

<template>
  <div :class="$style.panel">
    <div :class="$style.label">Editor</div>
    <textarea
      v-model="model"
      :class="$style.textarea"
      :placeholder="placeholder ?? 'Paste your Markdown here...'"
      :readonly="readonly"
      spellcheck="false"
    />
  </div>
</template>

<style module lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  background: var(--bg-primary);
}

.label {
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.textarea {
  flex: 1;
  width: 100%;
  min-height: 320px;
  padding: 1rem;
  border: none;
  resize: none;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--text-muted);
  }
}
</style>
