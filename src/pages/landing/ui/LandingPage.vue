<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiButton from '@/shared/ui/Button/UiButton.vue'

const { t } = useI18n()
</script>

<template>
  <section :class="$style.hero">
        <div class="animate-fade-up" :class="$style.copy">
          <span :class="$style.badge">{{ t('landing.badge') }}</span>
          <h1 :class="$style.title" v-html="t('landing.title')" />
          <p :class="$style.lead">
            {{ t('landing.lead') }}
          </p>
          <div :class="$style.cta">
            <UiButton to="/write" size="lg">{{ t('landing.cta') }}</UiButton>
          </div>
          <div :class="$style.meta">
            <span>{{ t('landing.metaPublicLinks') }}</span>
            <span>/</span>
            <span>{{ t('landing.metaEditTokens') }}</span>
            <span>/</span>
            <span>{{ t('landing.metaAiImprove') }}</span>
          </div>
        </div>

        <div class="animate-fade-up-delayed" :class="$style.preview">
          <div class="animate-floaty" :class="$style.card">
            <div :class="$style.cardChrome">
              <span />
              <span />
              <span />
              <span :class="$style.url">/v/sunday-thoughts-8k2</span>
            </div>
            <div :class="$style.cardBody">
              <div :class="$style.cardKicker">{{ t('landing.demoKicker') }}</div>
              <div :class="$style.cardTitle">{{ t('landing.demoTitle') }}</div>
              <p :class="$style.cardText">
                {{ t('landing.demoText') }}
              </p>
              <span :class="$style.cardTag">{{ t('landing.demoTag') }}</span>
            </div>
          </div>
          <span :class="$style.sticker">{{ t('landing.sticker') }}</span>
        </div>
      </section>
</template>

<style module lang="scss">
.hero {
  @include layout-shell(var(--landing-max-width));
  min-height: calc(100dvh - var(--header-height) - var(--site-nav-offset));
  padding-block: var(--space-l);
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: var(--space-xl);
  align-items: center;
  align-content: center;

  @include tablet {
    grid-template-columns: 1fr;
    gap: var(--space-l);
    min-height: calc(100dvh - var(--header-height) - var(--site-nav-offset));
    padding-block: var(--space-m);
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--accent);
  background: var(--accent-soft);
  padding: var(--space-2xs) var(--space-s);
  border-radius: var(--radius-pill);
  margin-bottom: var(--space-m);
}

.title {
  margin: 0 0 var(--space-m);
  font-size: var(--step-8);
  line-height: 0.92;
  letter-spacing: -0.05em;
  font-weight: 600;
}

.lead {
  margin: 0 0 var(--space-l);
  max-width: 40ch;
  font-size: var(--step-1);
  line-height: 1.5;
  color: var(--muted);
  letter-spacing: -0.01em;
}

.cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);
  margin-top: var(--space-l);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--faint);

  span:nth-child(even) {
    color: var(--line);
  }
}

.preview {
  position: relative;
}

.card {
  background: var(--panel);
  border: 1px solid var(--line2);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow);
  overflow: hidden;
  transform-origin: center center;
}

.cardChrome {
  display: flex;
  align-items: center;
  gap: var(--gap-2xs);
  padding: var(--space-s) var(--space-m);

  span:not(.url) {
    width: 0.6875rem;
    height: 0.6875rem;
    border-radius: 50%;
    background: var(--line);
  }
}

.url {
  margin-left: var(--space-2xs);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--faint);
}

.cardBody {
  padding: var(--space-2xs) var(--space-l) var(--space-l);
}

.cardKicker {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--accent2);
  margin-bottom: var(--space-2xs);
}

.cardTitle {
  font-size: var(--step-2);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.3;
  margin-bottom: var(--space-s);
}

.cardText {
  margin: 0 0 var(--space-s);
  font-size: var(--step-0);
  line-height: 1.75;
  color: var(--muted);
}

.cardTag {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  background: var(--accent-soft);
  color: var(--accent);
  padding: var(--space-3xs) var(--space-xs);
  border-radius: var(--radius-sm);
}

.sticker {
  position: absolute;
  top: calc(-1 * var(--space-s));
  right: calc(-1 * var(--space-s));
  background: var(--ink);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  padding: var(--space-2xs) var(--space-s);
  border-radius: var(--radius-pill);
  transform: rotate(4deg);
  box-shadow: var(--shadow);
  pointer-events: none;
}
</style>
