<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import galleryData from '../data/gallery.json'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useUiEffects'

const { locale, t } = useLocale()
const { gallerySets, heroSlides } = galleryData

const activeHero = ref(0)
const heroTimer = ref(null)

const activeGallery = ref('screenshots')
const galleryIndex = ref(0)
const galleryStep = ref(0)
const visibleCount = ref(3)
const trackRef = ref(null)

const isLightboxOpen = ref(false)
const lightboxItems = ref([])
const lightboxIndex = ref(0)

const activeHeroSlide = computed(() => heroSlides[activeHero.value] || heroSlides[0])
const currentGalleryItems = computed(() => gallerySets[activeGallery.value] || [])

const maxGalleryIndex = computed(() => Math.max(0, currentGalleryItems.value.length - visibleCount.value))

const trackStyle = computed(() => ({
  transform: `translate3d(-${galleryIndex.value * galleryStep.value}px, 0, 0)`
}))

const lightboxCurrent = computed(() => lightboxItems.value[lightboxIndex.value] || null)

const setHero = (index) => {
  activeHero.value = index
}

const nextHero = () => {
  activeHero.value = (activeHero.value + 1) % heroSlides.length
}

const startHeroAuto = () => {
  stopHeroAuto()
  heroTimer.value = window.setInterval(nextHero, 5500)
}

const stopHeroAuto = () => {
  if (heroTimer.value) {
    window.clearInterval(heroTimer.value)
    heroTimer.value = null
  }
}

const updateGalleryLayout = () => {
  visibleCount.value = window.innerWidth <= 760 ? 1 : 3
  const firstSlide = trackRef.value?.querySelector('.gallery-slide')
  galleryStep.value = firstSlide ? firstSlide.getBoundingClientRect().width + 14 : 0
  if (galleryIndex.value > maxGalleryIndex.value) {
    galleryIndex.value = maxGalleryIndex.value
  }
}

const nextGallery = () => {
  galleryIndex.value = galleryIndex.value >= maxGalleryIndex.value ? 0 : galleryIndex.value + 1
}

const prevGallery = () => {
  galleryIndex.value = galleryIndex.value <= 0 ? maxGalleryIndex.value : galleryIndex.value - 1
}

const openLightbox = (item) => {
  if (!item || item.type !== 'image') {
    return
  }

  const imagesOnly = currentGalleryItems.value.filter((entry) => entry.type === 'image')
  const found = imagesOnly.findIndex((entry) => entry.src === item.src)
  if (found < 0) {
    return
  }

  lightboxItems.value = imagesOnly
  lightboxIndex.value = found
  isLightboxOpen.value = true
  document.body.classList.add('lightbox-open')
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  document.body.classList.remove('lightbox-open')
}

const nextLightbox = () => {
  if (!lightboxItems.value.length) {
    return
  }
  lightboxIndex.value = (lightboxIndex.value + 1) % lightboxItems.value.length
}

const prevLightbox = () => {
  if (!lightboxItems.value.length) {
    return
  }
  lightboxIndex.value = (lightboxIndex.value - 1 + lightboxItems.value.length) % lightboxItems.value.length
}

const onKeydown = (event) => {
  if (!isLightboxOpen.value) {
    return
  }

  if (event.key === 'Escape') {
    closeLightbox()
  }
  if (event.key === 'ArrowRight') {
    nextLightbox()
  }
  if (event.key === 'ArrowLeft') {
    prevLightbox()
  }
}

watch(activeGallery, async () => {
  galleryIndex.value = 0
  await nextTick()
  updateGalleryLayout()
})

watch(locale, async () => {
  await nextTick()
  updateGalleryLayout()
})

useReveal('.home-page .reveal-item')

onMounted(async () => {
  await nextTick()
  updateGalleryLayout()
  startHeroAuto()
  window.addEventListener('resize', updateGalleryLayout)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  stopHeroAuto()
  window.removeEventListener('resize', updateGalleryLayout)
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('lightbox-open')
})
</script>

<template>
  <div class="page-shell home-page">
    <AppHeader />

    <main>
      <section class="hero">
        <div class="hero-media">
          <video autoplay muted loop playsinline>
            <source src="/assets/video/videoWitcher.mp4" type="video/mp4">
          </video>
        </div>
        <div class="hero-overlay"></div>
        <div class="hero-content reveal-item">
          <p class="kicker">CD PROJEKT RED</p>
          <img class="hero-logo" src="/assets/logotype.png" alt="Ведьмак 3: Дикая Охота">
          <p>{{ t('heroSubtitle') }}</p>
        </div>
      </section>

      <section class="section section-dark reveal-item" id="about">
        <h2>{{ t('aboutTitle') }}</h2>
        <p>{{ t('aboutText') }}</p>
      </section>

      <section class="section section-characters reveal-item" id="heroes">
        <h2>{{ t('heroesTitle') }}</h2>
        <div class="characters-slider" @mouseenter="stopHeroAuto" @mouseleave="startHeroAuto">
          <div class="slider-top">
            <div class="hero-tabs">
              <button
                v-for="(hero, index) in heroSlides"
                :key="hero.id"
                class="hero-tab"
                :class="{ active: index === activeHero }"
                type="button"
                @click="setHero(index)"
              >
                {{ hero.tab[locale] }}
              </button>
            </div>
          </div>

          <div class="slides">
            <Transition name="hero-switch" mode="out-in">
              <article :key="activeHeroSlide.id" class="slide hero-slide">
                <img :src="activeHeroSlide.image" :alt="activeHeroSlide.name[locale]">
                <div class="slide-body">
                  <h3>{{ activeHeroSlide.name[locale] }}</h3>
                  <p>{{ activeHeroSlide.text[locale] }}</p>
                </div>
              </article>
            </Transition>
          </div>
        </div>
      </section>

      <section class="section gallery-section reveal-item" id="gallery">
        <div class="gallery-title-wrap">
          <h2 class="gallery-title">{{ t('galleryTitle') }}</h2>
          <div class="gallery-ornament" aria-hidden="true"></div>
        </div>

        <div class="gallery-tabs">
          <button class="gallery-tab" :class="{ active: activeGallery === 'video' }" type="button" @click="activeGallery = 'video'">{{ t('galleryVideo') }}</button>
          <button class="gallery-tab" :class="{ active: activeGallery === 'screenshots' }" type="button" @click="activeGallery = 'screenshots'">{{ t('galleryScreenshots') }}</button>
          <button class="gallery-tab" :class="{ active: activeGallery === 'wallpapers' }" type="button" @click="activeGallery = 'wallpapers'">{{ t('galleryWallpapers') }}</button>
          <button class="gallery-tab" :class="{ active: activeGallery === 'arts' }" type="button" @click="activeGallery = 'arts'">{{ t('galleryArts') }}</button>
          <button class="gallery-tab" :class="{ active: activeGallery === 'memes' }" type="button" @click="activeGallery = 'memes'">{{ t('galleryMemes') }}</button>
        </div>

        <div class="gallery-slider">
          <button class="gallery-arrow prev" type="button" @click="prevGallery">&#10094;</button>
          <div class="gallery-viewport">
            <div ref="trackRef" class="gallery-track" :style="trackStyle">
              <article v-for="(item, index) in currentGalleryItems" :key="`${activeGallery}-${index}`" class="gallery-slide" :class="{ 'gallery-slide-video': item.type === 'video' }">
                <template v-if="item.type === 'video'">
                  <iframe :src="item.src" :title="item.title[locale]" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
                  <a class="gallery-video-link" :href="item.link" target="_blank" rel="noopener noreferrer">{{ t('openVideo') }}</a>
                </template>
                <template v-else>
                  <img :src="item.src" :alt="item.alt[locale]" @click="openLightbox(item)">
                </template>
              </article>
            </div>
          </div>
          <button class="gallery-arrow next" type="button" @click="nextGallery">&#10095;</button>
        </div>
      </section>

      <section class="section newsletter-section reveal-item" id="newsletter">
        <div class="newsletter-wrap">
          <div class="newsletter-ornament" aria-hidden="true"></div>
          <h2 class="newsletter-title">{{ locale === 'en' ? 'STAY INFORMED!' : 'БУДЬТЕ В КУРСЕ ВСЕГО!' }}</h2>
          <p class="newsletter-subtitle">
            {{
              locale === 'en'
                ? 'Subscribe to updates and get fresh Witcher news first.'
                : 'Подпишитесь на рассылку и получайте свежие ведьмачьи новости первыми.'
            }}
          </p>

          <form class="newsletter-form" @submit.prevent>
            <input
              type="email"
              class="newsletter-input"
              :placeholder="locale === 'en' ? 'your@email.com' : 'ваш@email.ru'"
            >

            <label class="newsletter-check">
              <input type="checkbox">
              <span>
                {{
                  locale === 'en'
                    ? 'I agree to receive updates and special offers.'
                    : 'Я согласен получать новости и специальные предложения.'
                }}
              </span>
            </label>

            <button type="submit" class="newsletter-btn">
              {{ locale === 'en' ? 'SUBSCRIBE' : 'ПОДПИСАТЬСЯ' }}
            </button>
          </form>
          <div class="newsletter-ornament bottom" aria-hidden="true"></div>
        </div>
      </section>
    </main>

    <AppFooter />

    <div class="lightbox" :class="{ open: isLightboxOpen }" @click.self="closeLightbox">
      <button class="lightbox-close" type="button" aria-label="Close" @click="closeLightbox">&times;</button>
      <button class="lightbox-arrow prev" type="button" aria-label="Previous" @click="prevLightbox">&#10094;</button>
      <img v-if="lightboxCurrent" class="lightbox-image" :src="lightboxCurrent.src" :alt="lightboxCurrent.alt[locale]">
      <button class="lightbox-arrow next" type="button" aria-label="Next" @click="nextLightbox">&#10095;</button>
      <p v-if="lightboxCurrent" class="lightbox-caption">{{ lightboxCurrent.alt[locale] }}</p>
    </div>
  </div>
</template>

<style scoped>
.newsletter-section {
  margin-top: 28px;
}

.newsletter-wrap {
  max-width: 1920px;
  margin: 0 auto;
  padding: 46px 28px 40px;
  border: 1px solid rgba(217, 192, 127, 0.35);
  background:
    linear-gradient(180deg, rgba(6, 6, 6, 0.78), rgba(5, 5, 5, 0.92)),
    url('/assets/fon.jpg') center / cover no-repeat;
  box-shadow: inset 0 0 0 1px rgba(217, 192, 127, 0.1), 0 18px 34px rgba(0, 0, 0, 0.44);
  transition: box-shadow 0.28s ease, border-color 0.28s ease;
}

.newsletter-wrap:hover {
  border-color: rgba(217, 192, 127, 0.65);
  box-shadow:
    inset 0 0 0 1px rgba(217, 192, 127, 0.22),
    0 0 30px rgba(217, 192, 127, 0.18),
    0 24px 42px rgba(0, 0, 0, 0.5);
}

.newsletter-ornament {
  width: min(420px, 76%);
  height: 16px;
  margin: 0 auto 16px;
  position: relative;
  border-top: 1px solid rgba(217, 192, 127, 0.62);
}

.newsletter-ornament::before,
.newsletter-ornament::after {
  content: "";
  position: absolute;
  top: -4px;
  width: 8px;
  height: 8px;
  border: 1px solid rgba(217, 192, 127, 0.72);
  transform: rotate(45deg);
  background: rgba(5, 5, 5, 0.72);
}

.newsletter-ornament::before {
  left: -4px;
}

.newsletter-ornament::after {
  right: -4px;
}

.newsletter-ornament.bottom {
  margin: 24px auto 0;
}

.newsletter-title {
  margin: 0;
  text-align: center;
  font-family: "Forum", serif;
  font-size: clamp(34px, 4.2vw, 54px);
  letter-spacing: 4px;
  color: #e9d39a;
}

.newsletter-subtitle {
  margin: 10px auto 22px;
  max-width: 680px;
  text-align: center;
  color: #e5cb8f;
  font-size: clamp(21px, 2.2vw, 29px);
  line-height: 1.25;
}

.newsletter-form {
  display: grid;
  gap: 14px;
}

.newsletter-input {
  width: 100%;
  height: 60px;
  border: 1px solid rgba(217, 192, 127, 0.64);
  background: rgba(5, 5, 5, 0.72);
  color: #f0ddb2;
  padding: 0 16px;
  font-family: "Cormorant Garamond", serif;
  font-size: 29px;
  transition: box-shadow 0.24s ease, border-color 0.24s ease;
}

.newsletter-input:focus,
.newsletter-input:hover {
  outline: none;
  border-color: #e5cb8f;
  box-shadow: 0 0 22px rgba(229, 203, 143, 0.28);
}

.newsletter-check {
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: start;
  gap: 10px;
  color: #d8c08a;
  font-size: clamp(17px, 1.3vw, 22px);
}

.newsletter-check input {
  margin-top: 4px;
  accent-color: #d9c07f;
}

.newsletter-btn {
  justify-self: center;
  min-width: 260px;
  height: 56px;
  border: 1px solid rgba(217, 192, 127, 0.76);
  background: rgba(8, 8, 8, 0.76);
  color: #e9d39a;
  font-family: "Forum", serif;
  font-size: clamp(23px, 2vw, 30px);
  letter-spacing: 2px;
  cursor: pointer;
  transition: box-shadow 0.24s ease, border-color 0.24s ease, transform 0.22s ease;
}

.newsletter-btn:hover {
  border-color: #efd9a5;
  box-shadow: 0 0 24px rgba(239, 217, 165, 0.28);
  transform: translateY(-1px);
}

.newsletter-btn:active {
  transform: translateY(0);
}

.hero-slide {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  filter: blur(0);
  pointer-events: auto;
}

.hero-switch-enter-active,
.hero-switch-leave-active {
  transition:
    opacity 0.55s ease,
    transform 0.55s cubic-bezier(0.2, 0.85, 0.2, 1),
    filter 0.45s ease;
}

.hero-switch-enter-from,
.hero-switch-leave-to {
  opacity: 0 !important;
  transform: translate3d(34px, 0, 0) scale(0.992) !important;
  filter: blur(2px) !important;
}

.hero-switch-enter-to,
.hero-switch-leave-from {
  opacity: 1 !important;
  transform: translate3d(0, 0, 0) scale(1) !important;
  filter: blur(0) !important;
}

@media (max-width: 760px) {
  .newsletter-wrap {
    padding: 30px 16px 26px;
  }

  .newsletter-input {
    height: 52px;
    font-size: 24px;
  }

  .newsletter-btn {
    min-width: 220px;
    height: 50px;
  }
}
</style>
