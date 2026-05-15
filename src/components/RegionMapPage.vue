<script setup>
import { computed, ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useUiEffects'
import regionCardsData from '../data/region-cards.json'

const props = defineProps({
  region: {
    type: Object,
    required: true
  }
})

const { locale } = useLocale()
const isLoreOpen = ref(false)

const cardLabels = computed(() => {
  const slug = props.region?.slug
  const localized = regionCardsData.cardsBySlug?.[slug]?.[locale.value]
  if (localized) {
    return localized
  }
  return regionCardsData.defaultCards?.[locale.value] || regionCardsData.defaultCards?.ru
})

const loreCardStyle = computed(() => {
  const slug = props.region?.slug
  const bg = regionCardsData.cardsBySlug?.[slug]?.background
  return bg ? { backgroundImage: `url('${bg}')` } : {}
})

const openLore = () => {
  isLoreOpen.value = true
  document.body.classList.add('lightbox-open')
}

const closeLore = () => {
  isLoreOpen.value = false
  document.body.classList.remove('lightbox-open')
}

useReveal('.region-page .reveal-item')
</script>

<template>
  <div class="page-shell region-page">
    <AppHeader />

    <main class="misc-page">
      <section class="map-section map-only">
        <div class="map-copy reveal-item in-view">
          <h2 class="region-title">{{ props.region.title[locale] }}</h2>
          <p>{{ props.region.description[locale] }}</p>
        </div>
        <div class="map-frame-wrap reveal-item">
          <iframe :src="props.region.map" title="Interactive map" loading="lazy" allowfullscreen></iframe>
        </div>
      </section>

      <section class="orchard-cards reveal-item" aria-label="Информация о регионе">
        <article class="orchard-card">
          <h3>{{ cardLabels.locationTitle }}</h3>
          <p>{{ cardLabels.locationText }}</p>
        </article>

        <button type="button" class="orchard-card orchard-card-lore" :style="loreCardStyle" @click="openLore">
          <h3>{{ cardLabels.loreTitle }}</h3>
          <p>{{ cardLabels.loreText }}</p>
          <span class="lore-action">{{ locale === 'en' ? 'Open Lore Panel' : 'Открыть лор-табличку' }}</span>
        </button>

        <article class="orchard-card">
          <h3>{{ cardLabels.questsTitle }}</h3>
          <p>{{ cardLabels.questsLead }}</p>
          <ul class="quest-list">
            <li v-for="item in cardLabels.questsItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </section>
    </main>

    <AppFooter />

    <Transition name="lore-panel">
      <div v-if="isLoreOpen" class="lore-overlay" @click.self="closeLore">
        <section class="lore-panel">
          <button type="button" class="lore-close" aria-label="Close lore" @click="closeLore">Г—</button>
          <h3>{{ cardLabels.panelTitle }}</h3>
          <p>{{ cardLabels.panelText }}</p>
        </section>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.orchard-cards {
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.orchard-card {
  background: linear-gradient(180deg, #151515, #101010);
  border: 1px solid #2d2d2d;
  text-align: left;
  padding: 18px 18px 16px;
  min-height: 210px;
}

.orchard-card h3 {
  margin: 0 0 10px;
  font-family: 'Forum', serif;
  font-size: clamp(25px, 2.1vw, 33px);
  color: #efe0b4;
}

.orchard-card p {
  margin: 0;
  color: #dcc48b;
  font-size: clamp(19px, 1.5vw, 23px);
  line-height: 1.4;
}

.quest-list {
  margin: 12px 0 0;
  padding-left: 22px;
}

.quest-list li {
  color: #e5cb8f;
  font-size: clamp(18px, 1.45vw, 22px);
  line-height: 1.35;
  margin: 6px 0;
}

.orchard-card-lore {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  cursor: pointer;
  transition: transform 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease;
}

.orchard-card-lore:hover {
  transform: translateY(-4px);
  border-color: #7f6b3d;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.36);
}

.lore-action {
  display: inline-block;
  margin-top: 14px;
  font-family: 'Forum', serif;
  letter-spacing: 1px;
  color: #f1deb0;
  border-bottom: 1px solid #f1deb0;
}

.lore-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  z-index: 1400;
  display: grid;
  place-items: center;
  padding: 20px;
}

.lore-panel {
  position: relative;
  width: min(880px, 100%);
  border: 1px solid #6f5c33;
  background:
    radial-gradient(circle at 15% 15%, rgba(217, 192, 127, 0.16), transparent 38%),
    linear-gradient(180deg, #121212 0%, #0a0a0a 100%);
  padding: 24px 24px 22px;
  box-shadow: 0 24px 52px rgba(0, 0, 0, 0.55);
}

.lore-panel h3 {
  margin: 0 0 10px;
  font-family: 'Forum', serif;
  letter-spacing: 1px;
  color: #efe0b4;
  font-size: clamp(32px, 3vw, 44px);
}

.lore-panel p {
  margin: 0;
  color: #e5cb8f;
  font-size: clamp(22px, 1.8vw, 28px);
  line-height: 1.42;
}

.lore-close {
  position: absolute;
  right: 10px;
  top: 8px;
  width: 38px;
  height: 38px;
  border: 1px solid #6f5c33;
  background: rgba(12, 12, 12, 0.72);
  color: #e5cb8f;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}

.lore-panel-enter-active,
.lore-panel-leave-active {
  transition: opacity 0.34s ease;
}

.lore-panel-enter-active .lore-panel,
.lore-panel-leave-active .lore-panel {
  transition: transform 0.42s cubic-bezier(0.2, 0.85, 0.2, 1), opacity 0.28s ease, filter 0.28s ease;
}

.lore-panel-enter-from,
.lore-panel-leave-to {
  opacity: 0;
}

.lore-panel-enter-from .lore-panel,
.lore-panel-leave-to .lore-panel {
  transform: translate3d(0, 26px, 0) scale(0.97);
  opacity: 0;
  filter: blur(2px);
}

@media (max-width: 960px) {
  .orchard-cards {
    grid-template-columns: 1fr;
  }

  .orchard-card {
    min-height: auto;
  }
}
</style>
