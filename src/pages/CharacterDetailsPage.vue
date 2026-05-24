<script setup>
import { computed } from 'vue'
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
</script>

<template>
  <div class="page-shell">
    <AppHeader />
    <main class="characters-page">
      <section v-if="character && isWikiMode" class="wiki-wrap">
        <RouterLink to="/characters" class="back-link">{{ locale === 'en' ? '← Back to characters' : '← Назад к персонажам' }}</RouterLink>

        <article class="geralt-sheet">
          <section class="sheet-block hero" :style="{ backgroundImage: `url('${asset(wiki.hero.bg)}')` }">
            <div class="hero-tabs">
              <span v-for="tab in wiki.hero.tabs" :key="tab">{{ tab }}</span>
            </div>
            <div class="hero-layout">
              <img class="hero-geralt" :src="asset(wiki.hero.image)" alt="Hero">
              <div class="hero-copy">
                <p v-for="(line, i) in (locale === 'en' ? wiki.hero.enParagraphs : wiki.hero.ruParagraphs)" :key="i">{{ line }}</p>
              </div>
            </div>
          </section>

          <section v-for="(block, idx) in wiki.sections" :key="idx" class="sheet-block" :style="{ backgroundImage: `url('${asset(block.bg)}')` }">
            <h2>{{ locale === 'en' ? block.titleEn : block.titleRu }}</h2>
            <p>{{ locale === 'en' ? block.textEn : block.textRu }}</p>
            <img v-if="block.image" class="scar" :src="asset(block.image)" alt="Detail">
          </section>

          <section class="sheet-block signs" :style="{ backgroundImage: `url('${asset(wiki.signs.bg)}')` }">
            <h2>{{ locale === 'en' ? wiki.signs.titleEn : wiki.signs.titleRu }}</h2>
            <div class="sign-row">
              <img v-for="icon in wiki.signs.icons" :key="icon" :src="asset(icon)" alt="sign">
            </div>
          </section>

          <section class="sheet-video">
            <video autoplay muted loop playsinline :src="asset(wiki.video)"></video>
          </section>

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
.wiki-wrap,
.detail-wrap { width: min(1320px, calc(100% - 48px)); margin: 18px auto 40px; }
.back-link { display:inline-block; margin-bottom:10px; color:#e7cf96; text-decoration:none; border-bottom:1px solid rgba(231,207,150,.55); font-size:20px; }

.geralt-sheet { width:min(1280px,100%); margin:0 auto; border:1px solid rgba(184,148,69,.3); background:#090909; }
.sheet-block { position:relative; padding:22px 22px 24px; border-bottom:1px solid rgba(184,148,69,.2); background-size:cover; background-position:center; }
.sheet-block::before { content:''; position:absolute; inset:0; background:rgba(6,6,6,.68); }
.sheet-block > * { position:relative; z-index:1; }
.hero { min-height: 620px; padding: 16px 24px 24px; }
.hero-tabs-copy { align-self: start; padding-top: 6px; }
.hero-copy p { margin: 0 0 12px; color: #eadabc; font-size: clamp(17px, 1.22vw, 24px); line-height: 1.33; text-shadow: 0 1px 2px rgba(0, 0, 0, .7); }
.sheet-block h2 { margin:0 0 10px; font-family:'Forum',serif; color:#efdfb5; font-size:40px; }
.sheet-block p { margin:0; color:#e2cc93; line-height:1.38; font-size:29px; }

.scar { margin-top:10px; width:110px; border:1px solid rgba(184,148,69,.25); }
.signs .sign-row { display:flex; gap:24px; flex-wrap:wrap; margin-top:10px; }
.signs img { width:52px; height:52px; object-fit:contain; filter:brightness(1.2) drop-shadow(0 0 8px rgba(255,255,255,.2)); }

.sheet-video video { width:100%; display:block; max-height:260px; object-fit:cover; }
.sheet-gallery { padding:20px; background:#0b0b0b; }
.sheet-gallery h2 { margin:0 0 12px; text-align:center; font-family:'Forum',serif; font-size:34px; color:#efdfb5; }
.gallery-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.gallery-grid img { width:100%; height:140px; object-fit:cover; border:1px solid rgba(184,148,69,.28); }

.detail-card { display:grid; grid-template-columns:minmax(320px,520px) minmax(0,1fr); border:1px solid rgba(184,148,69,.25); background:linear-gradient(180deg,#131313,#0c0c0c); }
.detail-image-wrap { min-height:520px; }
.detail-image { width:100%; height:100%; object-fit:cover; display:block; }
.detail-content { padding:34px 36px; }
.detail-content h1 { margin:0 0 16px; font-size:clamp(42px,4vw,64px); color:#ecd79f; font-family:'Forum',serif; }
.detail-content p { margin:0 0 16px; color:#ddc589; font-size:clamp(23px,1.8vw,30px); line-height:1.42; }
.detail-content .lead { color:#efd9a4; font-size:clamp(26px,2.1vw,34px); }

@media (max-width:980px){
  .hero-layout { grid-template-columns: 1fr; }
  .hero-geralt { max-height: 320px; }
  .hero-copy { padding-top: 0; }
  .sheet-block h2 { font-size:30px; }
  .sheet-block p { font-size:23px; }
  .gallery-grid { grid-template-columns:1fr; }
  .detail-card { grid-template-columns:1fr; }
  .detail-image-wrap { min-height:360px; }
  .detail-content { padding:24px 20px; }
}
</style>





