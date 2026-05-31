<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import charactersData from '../data/characters.json'
import detailsData from '../data/character-details.json'
import { useLocale } from '../composables/useLocale'

const route = useRoute()
const { locale } = useLocale()
const { characterGroups } = charactersData

const getCharacterId = (item, groupIndex, itemIndex) => {
  const fromImage = item.image?.split('/').pop()?.split('.')[0]
  if (fromImage) return fromImage.toLowerCase()
  return `char-${groupIndex}-${itemIndex}`
}

const localizedGroups = computed(() =>
    characterGroups.map((group, groupIndex) => {
      const enTitle = detailsData.groupTitlesEn[group.title]
      return {
        title: locale.value === 'en' ? enTitle || group.title : group.title,
        items: group.items.map((item, itemIndex) => {
          const tr = locale.value === 'en' ? detailsData.charactersEn[item.name] : null
          const name = tr?.name || item.name
          return {
            id: getCharacterId(item, groupIndex, itemIndex),
            image: item.image,
            name,
            description: tr?.description || item.description,
            fullDescription: (detailsData.fullDescription[locale.value] || detailsData.fullDescription.ru).replace('{name}', name)
          }
        })
      }
    })
)

const allCharacters = computed(() => localizedGroups.value.flatMap((g) => g.items))
const character = computed(() => allCharacters.value.find((c) => c.id === route.params.id))
const wiki = computed(() => detailsData.wikiById[route.params.id])

const asset = (path) => {
  if (!path) return path
  if (path.startsWith('/assets/')) return `${import.meta.env.BASE_URL}${path.slice(1)}`
  return path
}

const isWikiMode = computed(() => Boolean(character.value && wiki.value))

const layoutStyles = computed(() => {
  const l = wiki.value?.layout || {}
  return {
    hero: {
      '--display': l.hero?.display || 'grid',
      '--columns': l.hero?.columns || '1fr 2fr',
      '--min-height': l.hero?.minHeight || '620px',
      '--gap': l.hero?.gap || '20px',
      '--align': l.hero?.alignItems || 'center'
    },
    signs: {
      '--display': l.signs?.display || 'flex',
      '--gap': l.signs?.gap || '24px',
      '--wrap': l.signs?.wrap ? 'wrap' : 'nowrap',
      '--icon-size': l.signs?.iconSize || '52px'
    },
    gallery: {
      '--columns': l.gallery?.columns || 3,
      '--gap': l.gallery?.gap || '10px',
      '--height': l.gallery?.height || '140px'
    }
  }
})

const activeTabIndex = ref(0)

// Текущая картинка из выбранного таба
const currentHeroImage = computed(() => {
  const tabs = wiki.value?.hero?.tabs || []
  return tabs[activeTabIndex.value]?.image || ''
})

// Сброс при смене персонажа
watch(() => route.params.id, () => {
  activeTabIndex.value = 0
})

const switchTab = (index) => {
  activeTabIndex.value = index
}
</script>

<template>
  <div class="page-shell">
    <AppHeader />
    <main class="characters-page">
      <section v-if="character && isWikiMode" class="wiki-wrap">
        <RouterLink to="/characters" class="back-link">{{ locale === 'en' ? '← Back to characters' : '← Назад к персонажам' }}</RouterLink>

        <article class="geralt-sheet">
          <!-- Hero -->
          <section class="sheet-block hero" :style="[layoutStyles.hero, { backgroundImage: `url('${asset(wiki.hero.bg)}')` }]">
            <div class="content-container hero-grid">
              <div class="hero-left">
                <div class="hero-tabs">
    <span
        v-for="(tab, index) in wiki.hero.tabs"
        :key="index"
        class="tab-btn"
        :class="{ active: activeTabIndex === index }"
        @click="switchTab(index)"
    >
      {{ tab.name }}
    </span>
                </div>

                <!-- Плавная смена картинки -->
                <Transition name="fade-img" mode="out-in">
                  <img :key="activeTabIndex" class="hero-geralt" :src="asset(currentHeroImage)" alt="Hero">
                </Transition>
              </div>

              <div class="hero-content">
                <div class="hero-copy">
                  <!-- Статичный текст (не меняется!) -->
                  <p v-for="(line, i) in (locale === 'en' ? wiki.hero.enParagraphs : wiki.hero.ruParagraphs)" :key="i">
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Секции с чередованием -->
          <section v-for="(block, idx) in wiki.sections" :key="idx" class="sheet-block" :style="{ backgroundImage: `url('${asset(block.bg)}')` }">
            <div class="content-container" :class="{ 'has-image': block.image && idx % 2 === 0, 'reverse': block.image && idx % 2 !== 0 }">
              <div>
                <h2>{{ locale === 'en' ? block.titleEn : block.titleRu }}</h2>
                <p>{{ locale === 'en' ? block.textEn : block.textRu }}</p>
              </div>
              <img v-if="block.image" class="scar" :src="asset(block.image)" alt="Detail">
            </div>
          </section>

          <!-- Знаки -->
          <section class="sheet-block signs" :style="{ backgroundImage: `url('${asset(wiki.signs.bg)}')` }">
            <div class="content-container">
              <h2>{{ locale === 'en' ? wiki.signs.titleEn : wiki.signs.titleRu }}</h2>
              <div class="sign-row">
                <img v-for="icon in wiki.signs.icons" :key="icon" :src="asset(icon)" alt="sign">
              </div>
            </div>
          </section>

          <!-- Видео -->
          <section class="sheet-video">
            <video autoplay muted loop playsinline :src="asset(wiki.video)"></video>
          </section>

          <!-- Галерея -->
          <section class="sheet-gallery">
            <h2>{{ locale === 'en' ? wiki.gallery.titleEn : wiki.gallery.titleRu }}</h2>
            <div class="gallery-grid">
              <img v-for="(img, i) in wiki.gallery.images" :key="i" :src="asset(img)" :alt="`gallery-${i+1}`">
            </div>
          </section>
        </article>
      </section>

      <section v-else-if="character" class="detail-wrap">
        <RouterLink to="/characters" class="back-link">{{ locale === 'en' ? '← Back to characters' : '← Назад к персонажам' }}</RouterLink>
        <article class="detail-card">
          <div class="detail-image-wrap"><img :src="character.image" :alt="character.name" class="detail-image"></div>
          <div class="detail-content"><h1>{{ character.name }}</h1><p class="lead">{{ character.description }}</p><p>{{ character.fullDescription }}</p></div>
        </article>
      </section>

      <section v-else class="detail-wrap">
        <RouterLink to="/characters" class="back-link">{{ locale === 'en' ? '← Back to characters' : '← Назад к персонажам' }}</RouterLink>
        <p class="no-results">{{ locale === 'en' ? 'Character not found.' : 'Персонаж не найден.' }}</p>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
/* ================= 1. БАЗОВЫЕ КОНТЕЙНЕРЫ ================= */
.page-shell,
.characters-page,
.wiki-wrap {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

.back-link {
  display: inline-block;
  padding-top: 65px;
  margin: 24px 0 0 24px;
  color: #e7cf96;
  text-decoration: none;
  border-bottom: 1px solid rgba(231,207,150,.55);
  font-size: 18px;
  font-family: 'Forum', serif;
  transition: opacity 0.3s;
}
.back-link:hover { opacity: 0.8; }

.geralt-sheet {
  width: 100%;
  margin: 0;
  border: none;
  background: transparent;
}

/* ================= 2. ОБЩИЕ СТИЛИ БЛОКОВ ================= */
.sheet-block {
  position: relative;
  padding: 80px 24px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Затемняющий оверлей */
.sheet-block::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(6, 6, 6, 0.75);
  pointer-events: none;
}

/* Контент поверх оверлея */
.sheet-block > * {
  position: relative;
  z-index: 1;
}

/* Центральный ограничитель контента */
.content-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  gap: 60px;
}

/* ================= 3. HERO СЕКЦИЯ ================= */
.hero {
  min-height: 900px;
  padding: 60px 24px 90px;
  align-items: flex-start;
}

.hero .content-container {
  grid-template-columns: 1.1fr 0.9fr; /* Левая часть шире для арта */
  align-items: flex-start;
}

/* Левая колонка: Табы + Картинка */
.hero-left {
  display: flex;
  padding-right:100px;
  flex-direction: column;
  align-items: flex-start;
}

.hero-tabs {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  width: 100%;
}

.hero-tabs span {
  color: #d4c4a8;
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.85;
  cursor: default;
  white-space: nowrap;
}

.hero-geralt {
  width: 100%;
  max-height: 720px;
  object-fit: contain;
  object-position: center top;
  filter: drop-shadow(0 10px 40px rgba(0,0,0,0.6));
}

/* Правая колонка: Текст */
.hero .content-container {
  grid-template-columns: 0.9fr 1.3fr; /* Левая часть уже, правая (текст) шире */
  gap: 40px;
}

/* 2. Контейнер текста */
.hero-content {
  width: 100%;
  padding-top: 20px;
  text-align: left !important; /* Принудительно влево */
}

/* 3. Абзацы */
.hero-copy p {
  margin: 0 0 14px;
  color: #e8d5b0;
  font-size: 17px;
  line-height: 1.7;
  font-style: italic;
  text-align: left !important; /* Убираем центрирование */
  width: 100%;
  /* Если текст всё ещё не растягивается, проверьте глобальный CSS на наличие max-width для p */
}
.hero-content {
  padding-top: 50px;
}

.hero-copy p {
  margin: 0 0 18px;
  color: #e8d5b0;
  font-size: 27px;
  line-height: 1.75;
  font-style: italic;
  text-shadow: 0 2px 8px rgba(0,0,0,0.9);
}

/* ================= 4. СТАНДАРТНЫЕ СЕКЦИИ (Вики) ================= */
.sheet-block:not(.hero) .content-container {
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

/* Чередование сторон */
.content-container.reverse {
  grid-template-columns: 1fr 1fr;
}
.content-container.reverse .text-block { order: 2; }
.content-container.reverse .scar { order: 1; }

.text-block h2 {
  margin: 0 0 24px;
  font-family: 'Forum', serif;
  color: #efdfb5;
  font-size: 42px;
  line-height: 1.1;
  text-shadow: 0 4px 12px rgba(0,0,0,0.8);
}

.text-block p {
  margin: 0;
  color: #e2cc93;
  line-height: 1.8;
  font-size: 17px;
}

.scar {
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(184,148,69,0.3);
  box-shadow: 0 12px 40px rgba(0,0,0,0.7);
}

/* ================= 5. ЗНАКИ ВЕДЬМАКА ================= */
.signs .content-container {
  grid-template-columns: 1fr;
  text-align: center;
  justify-items: center;
}

.signs h2 {
  margin-bottom: 40px;
}

.sign-row {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.sign-row img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  filter: brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.2));
  transition: transform 0.3s;
}
.sign-row img:hover { transform: scale(1.1); }

/* ================= 6. ВИДЕО И ГАЛЕРЕЯ ================= */
.sheet-video {
  padding: 0;
  background: #000;
}
.sheet-video video {
  width: 100%;
  display: block;
  max-height: 900px;
  object-fit: cover;
}

.sheet-gallery {
  padding: 80px 24px;
  background: #0b0b0b;
}
.sheet-gallery h2 {
  text-align: center;
  margin-bottom: 50px;
  font-family: 'Forum', serif;
  color: #efdfb5;
  font-size: 42px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1280px;
  margin: 0 auto;
}
.gallery-grid img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border: 1px solid rgba(184,148,69,0.3);
  transition: transform 0.3s, box-shadow 0.3s;
}
.gallery-grid img:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 30px rgba(184,148,69,0.2);
}

/* ================= ТАБЫ (кнопки) ================= */
.tab-btn {
  color: #d4c4a8;
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.65;
  padding: 8px 12px;
  border-bottom: 2px solid transparent; /* Резерв места под линию */
  transition: all 0.25s ease;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

/* Подсветка при наведении */
.tab-btn:hover {
  opacity: 1;
  color: #fff;
  text-shadow: 0 0 8px rgba(231, 207, 150, 0.6);
  transform: translateY(-2px);
}

/* Активная вкладка */
.tab-btn.active {
  opacity: 1;
  color: #efdfb5;
  border-bottom-color: #b89445;
  background: rgba(184, 148, 69, 0.15);
  text-shadow: 0 0 12px rgba(184, 148, 69, 0.4);
}

/* ================= АНИМАЦИЯ СМЕНЫ КАРТИНКИ ================= */
.fade-img-enter-active,
.fade-img-leave-active {
  transition: opacity 0.45s ease-in-out;
}

.fade-img-enter-from,
.fade-img-leave-to {
  opacity: 0;
}

/* Фикс высоты, чтобы вёрстка не прыгала во время анимации */
.hero-geralt {
  width: 100%;
  max-height: 720px;
  object-fit: contain;
  object-position: center top;
  filter: drop-shadow(0 10px 40px rgba(0,0,0,0.6));
  /* Важно: задаём минимальную высоту, если картинки разной пропорции */
  min-height: 480px;
}

/* ================= 7. АДАПТИВНОСТЬ ================= */
@media (max-width: 1024px) {
  .hero .content-container,
  .sheet-block:not(.hero) .content-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero-left { align-items: center; }
  .hero-geralt { max-height: 500px; }
  .hero-content { padding-top: 0; text-align: center; }
  .hero-tabs { justify-content: center; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .sheet-block { padding: 50px 16px; }
  .text-block h2 { font-size: 32px; }
  .gallery-grid { grid-template-columns: 1fr; }
  .gallery-grid img { height: 280px; }
  .back-link { margin-left: 16px; }
}
</style>





