<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useUiEffects'

const props = defineProps({
  region: {
    type: Object,
    required: true
  }
})

const { locale } = useLocale()

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
    </main>

    <AppFooter />
  </div>
</template>
