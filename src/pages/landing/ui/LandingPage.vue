<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { UiButton } from '@/shared/ui/Button'
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useLocaleStore } from '@/entities/locale'

gsap.registerPlugin(SplitText)

const { t } = useI18n()
const { locale } = storeToRefs(useLocaleStore())

const badgeRef = ref<HTMLElement | null>(null)
const titleLine1Ref = ref<HTMLElement | null>(null)
const titleLine2Ref = ref<HTMLElement | null>(null)
const leadRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const metaRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)

const titleLines = computed(() =>
  t('landing.title')
    .split(/<br\s*\/?>/i)
    .map((line) => line.trim()),
)

let timeline: gsap.core.Timeline | null = null
let titleSplit1: SplitText | null = null
let titleSplit2: SplitText | null = null

const titleCharTween = {
  yPercent: 110,
  duration: 1.05,
  stagger: 0.042,
  ease: 'power4.out',
} as const

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function animatedElements() {
  return [
    badgeRef.value,
    titleLine1Ref.value,
    titleLine2Ref.value,
    leadRef.value,
    ctaRef.value,
    metaRef.value,
    cardRef.value,
  ].filter(Boolean)
}

function teardown() {
  timeline?.kill()
  timeline = null
  titleSplit1?.revert()
  titleSplit2?.revert()
  titleSplit1 = null
  titleSplit2 = null

  const els = animatedElements()
  if (els.length) {
    gsap.set(els, { clearProps: 'all' })
  }
}

function setupTitleSplit() {
  if (!titleLine1Ref.value || !titleLine2Ref.value) return

  titleSplit1 = SplitText.create(titleLine1Ref.value, { type: 'words,chars', wordsClass: 'word' })
  titleSplit2 = SplitText.create(titleLine2Ref.value, { type: 'words,chars', wordsClass: 'word' })
}

async function playEntrance() {
  teardown()
  await nextTick()

  const reduced = prefersReducedMotion()
  timeline = gsap.timeline()

  if (reduced) {
    timeline.from(animatedElements(), { opacity: 0, duration: 0.15, stagger: 0.04 }, 0)
    return
  }

  setupTitleSplit()

  if (!titleSplit1 || !titleSplit2) return

  timeline
    .from(badgeRef.value, { opacity: 0, y: 6, duration: 0.8, ease: 'power2.out' }, 0)
    .from(titleSplit1.chars, titleCharTween, 0.1)
    .from(titleSplit2.chars, titleCharTween, 0.18)
    .from(
      cardRef.value,
      { opacity: 0, y: 14, scale: 0.97, duration: 1.1, ease: 'power3.out' },
      0.42,
    )
    .from(leadRef.value, { opacity: 0, y: 6, duration: 0.9, ease: 'power2.out' }, 0.62)
    .from(ctaRef.value, { opacity: 0, y: 6, duration: 0.85, ease: 'power2.out' }, 0.82)
    .from(metaRef.value, { opacity: 0, duration: 0.8, ease: 'power1.out' }, 0.98)
}

onMounted(() => {
  void playEntrance()
})

watch(locale, () => {
  void playEntrance()
})

onUnmounted(() => {
  teardown()
})
</script>

<template>
  <div :class="$style.root">
    <section :class="$style.hero">
      <div :class="$style.copy">
        <span ref="badgeRef" :class="$style.badge">{{ t('landing.badge') }}</span>
        <h1 :class="$style.title">
          <span :class="$style.titleLine">
            <span ref="titleLine1Ref" :class="$style.titleInner">{{ titleLines[0] }}</span>
          </span>
          <span :class="$style.titleLine">
            <span ref="titleLine2Ref" :class="$style.titleInner">{{ titleLines[1] }}</span>
          </span>
        </h1>
        <p ref="leadRef" :class="$style.lead">
          {{ t('landing.lead') }}
        </p>
        <div ref="ctaRef" :class="$style.cta">
          <UiButton to="/write" size="lg" icon-position="end" animated>
            <template #icon>→</template>
            {{ t('landing.cta') }}
          </UiButton>
        </div>
        <div ref="metaRef" :class="$style.meta">
          <span>{{ t('landing.metaPublicLinks') }}</span>
          <span>/</span>
          <span>{{ t('landing.metaEditTokens') }}</span>
          <span>/</span>
          <span>{{ t('landing.metaAiImprove') }}</span>
        </div>
      </div>

      <div :class="$style.preview">
        <div ref="cardRef" :class="$style.cardEnter">
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
      </div>
    </section>
  </div>
</template>

<style module lang="scss">
.root {
  min-height: calc(100dvh - var(--header-height) - var(--site-nav-offset));
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero {
  @include layout-shell(var(--landing-max-width));
  padding-top: var(--space-l);
  padding-bottom: var(--page-pad-bottom);
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: var(--space-xl);
  align-items: center;
  align-content: center;

  @include tablet {
    grid-template-columns: 1fr;
    gap: var(--space-l);
    min-height: calc(100dvh - var(--header-height) - var(--site-nav-offset));
    padding-top: var(--space-m);
    padding-bottom: var(--page-pad-bottom);
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--accent);
  background: var(--accent-soft);
  padding: var(--space-2xs) var(--space-s);
  border-radius: var(--radius-pill);
  margin-bottom: var(--space-m);
}

.title {
  margin: 0 0 var(--space-m);
  font-size: var(--heading-3xl);
  line-height: 0.92;
  letter-spacing: -0.05em;
  font-weight: 600;
}

.titleLine {
  display: block;
  overflow: hidden;
  padding-block: 0.14em;
  margin-block: -0.14em;
}

.titleInner {
  display: block;

  :global(.word) {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    padding-bottom: 0.15em;
    margin-bottom: -0.15em;
    vertical-align: bottom;
  }
}

.lead {
  margin: 0 0 var(--space-l);
  max-width: 40ch;
  font-size: var(--text-lg);
  line-height: 1.5;
  color: var(--muted);
  letter-spacing: -0.01em;
  white-space: pre-line;
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
  gap: var(--space-2xs);
  margin-top: var(--space-l);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--faint);

  span:nth-child(even) {
    color: var(--line);
  }
}

.preview {
  position: relative;
}

.cardEnter {
  position: relative;
  transform-origin: center center;
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
  font-size: var(--text-sm);
  color: var(--faint);
}

.cardBody {
  padding: var(--space-2xs) var(--space-l) var(--space-l);
}

.cardKicker {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--accent2);
  margin-bottom: var(--space-2xs);
}

.cardTitle {
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.3;
  margin-bottom: var(--space-s);
}

.cardText {
  margin: 0 0 var(--space-s);
  font-size: var(--text-base);
  line-height: 1.75;
  color: var(--muted);
}

.cardTag {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background: var(--accent-soft);
  color: var(--accent);
  padding: var(--space-3xs) var(--space-xs);
  border-radius: var(--radius-sm);
}

.sticker {
  position: absolute;
  top: calc(-1 * var(--space-s));
  right: calc(-0.5 * var(--space-s));
  background: var(--ink);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  padding: var(--space-2xs) var(--space-s);
  border-radius: var(--radius-pill);
  transform: rotate(4deg);
  box-shadow: var(--shadow);
  pointer-events: none;
}
</style>
