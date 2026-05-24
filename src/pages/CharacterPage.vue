<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import charactersData from '../data/characters.json'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useUiEffects'
import { useRouter } from 'vue-router'
import router from "../router/index.js";

const { characterGroups } = charactersData
const query = ref('')
const selectedGroup = ref('all')
const { t, locale } = useLocale()

const getCharacterId = (item, groupIndex, itemIndex) => {
  const fromImage = item.image?.split('/').pop()?.split('.')[0]
  if (fromImage) return fromImage.toLowerCase()
  return `char-${groupIndex}-${itemIndex}`
}

const alliesItemsEn = {
  'Весемир': { name: 'Vesemir', description: "The oldest witcher of Kaer Morhen and Geralt's mentor." },
  'Лютик': { name: 'Dandelion', description: "Poet and Geralt's best friend, often finding trouble." },
  'Лютик (Данделион)': { name: 'Dandelion', description: "Poet and Geralt's best friend, often finding trouble." },
  'Золтан Хивай': { name: 'Zoltan Chivay', description: 'A dwarven warrior and loyal ally of the witcher.' },
  'Вернон Роше': { name: 'Vernon Roche', description: 'Temerian officer, leader of the Blue Stripes and a master of sabotage.' },
  'Роше Вернон': { name: 'Vernon Roche', description: 'Temerian officer, leader of the Blue Stripes and a master of sabotage.' },
  'Кейра Мец': { name: 'Keira Metz', description: 'A sorceress who helps Geralt investigate magical secrets of Velen.' },
  'Мышовур': { name: 'Mousesack', description: 'A Skellige druid and keeper of ancient knowledge.' }
}

const enByRuTitle = {
  'Основные герои': {
    title: 'Main Heroes',
    items: {
      'Геральт из Ривии': { name: 'Geralt of Rivia', description: 'A Wolf School witcher, legendary monster hunter and the central hero of the game.' },
      'Цири': { name: 'Ciri', description: 'Child of the Elder Blood, hunted by the Wild Hunt.' },
      'Йеннифэр': { name: 'Yennefer', description: 'A powerful sorceress and key ally in the search for Ciri.' },
      'Трисс Меригольд': { name: 'Triss Merigold', description: 'A sorceress and diplomat who protects mages in Novigrad.' }
    }
  },
  'Друзья и союзники': { title: 'Allies and Friends', items: alliesItemsEn },
  'Союзники и друзья': { title: 'Allies and Friends', items: alliesItemsEn },
  'Скеллиге': {
    title: 'Skellige',
    items: {
      'Крах ан Крайт': { name: 'Crach an Craite', description: 'Jarl of Clan an Craite and an old friend of Geralt.' },
      'Хьялмар': { name: 'Hjalmar', description: "Crach's son and a claimant to the Skellige throne." },
      'Керис ан Крайт': { name: 'Cerys an Craite', description: "Crach's sharp-minded daughter and a strong candidate for the crown." },
      'Сванриге': { name: 'Svanrige', description: 'A claimant to power who favors centralized rule.' },
      'Удальрик': { name: 'Udalryk', description: 'Jarl of Clan Brokvar, tormented by a curse.' }
    }
  },
  'Новиград и Оксенфурт': {
    title: 'Novigrad and Oxenfurt',
    items: {
      'Сигизмунд Дийкстра': { name: 'Sigismund Dijkstra', description: 'Former Redanian spymaster, master of intrigue and manipulation.' },
      'Сиги Рувен (Дийкстра)': { name: 'Sigismund Dijkstra', description: 'Former Redanian spymaster, master of intrigue and manipulation.' },
      'Радовид V': { name: 'Radovid V', description: 'King of Redania leading a ruthless hunt for mages.' },
      'Присцилла': { name: 'Priscilla', description: "A singer and Dandelion's beloved, one of Novigrad's bright stars." },
      'Шани': { name: 'Shani', description: 'A medic and an old acquaintance of Geralt.' },
      'Барт': { name: 'Bart', description: "Treasury troll guard, one of Novigrad's most memorable characters." }
    }
  },
  'Нильфгаард и чародеи': {
    title: 'Nilfgaard and Sorcerers',
    items: {
      'Эмгыр вар Эмрейс': { name: 'Emhyr var Emreis', description: "Emperor of Nilfgaard, Ciri's father and a key political player." },
      'Морвран Воорхис': { name: 'Morvran Voorhis', description: 'A high-ranking imperial general and representative of the court.' },
      'Филиппа Эйльхарт': { name: 'Philippa Eilhart', description: 'An influential sorceress and experienced political schemer.' },
      'Маргарита Ло-Антиль': { name: 'Margarita Laux-Antille', description: 'A sorceress and former rector of Aretuza.' },
      'Фрингилья Виго': { name: 'Fringilla Vigo', description: 'A Nilfgaardian mage involved in Blood and Wine events.' }
    }
  },
  'Антагонисты': {
    title: 'Antagonists',
    items: {
      'Эредин': { name: 'Eredin', description: 'King of the Wild Hunt, the main enemy in the core campaign.' },
      'Имлерих': { name: 'Imlerith', description: "One of the Wild Hunt's generals, a brutal warrior." },
      'Карантир': { name: 'Caranthir', description: 'A Wild Hunt mage wielding destructive ice magic.' },
      "Гюнтер о'Дим": { name: "Gaunter O'Dimm", description: 'A mysterious entity known as the Man of Glass.' },
      'Детлафф ван дер Эретайн': { name: 'Dettlaff van der Eretein', description: 'A higher vampire and tragic antagonist of Blood and Wine.' }
    }
  }
}

const localizedGroups = computed(() =>
  characterGroups.map((group, groupIndex) => {
    const enGroup = enByRuTitle[group.title]
    return {
      title: locale.value === 'en' ? enGroup?.title || group.title : group.title,
      items: group.items.map((item, itemIndex) => {
        const translated = locale.value === 'en' ? enGroup?.items?.[item.name] : null
        return {
          ...item,
          id: getCharacterId(item, groupIndex, itemIndex),
          name: translated?.name || item.name,
          description: translated?.description || item.description
        }
      })
    }
  })
)

const groupOptions = computed(() => ['all', ...localizedGroups.value.map((group) => group.title)])

const filteredGroups = computed(() =>
  localizedGroups.value
    .filter((group) => selectedGroup.value === 'all' || group.title === selectedGroup.value)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.name.toLowerCase().includes(query.value.trim().toLowerCase()))
    }))
    .filter((group) => group.items.length > 0)
)

const getCharacterRoute = (character) => {
  // ID генерируется из имени картинки: geralt.jpg → 'geralt'
  if (character.id === 'geralt') return '/wiki/geralt'
  return `/characters/${character.id}`
}
useReveal('.characters-page .reveal-item')
</script>

<template>
  <div class="page-shell">
    <AppHeader />
    <main class="characters-page">
      <section class="intro reveal-item">
        <h1>{{ t('charactersTitle') }}</h1>
        <p>{{ t('charactersSubtitle') }}</p>
      </section>

      <section class="filters reveal-item" aria-label="Фильтрация персонажей">
        <input v-model="query" type="text" :placeholder="t('searchCharacter')" aria-label="Поиск по имени персонажа">
        <select v-model="selectedGroup" aria-label="Фильтр по категории">
          <option v-for="option in groupOptions" :key="option" :value="option">
            {{ option === 'all' ? t('allCategories') : option }}
          </option>
        </select>
      </section>

      <p v-if="!filteredGroups.length" class="no-results" style="display:block;">{{ t('noResults') }}</p>

      <section v-for="group in filteredGroups" :key="group.title" class="group">
        <h2>{{ group.title }}</h2>
        <div class="grid character-grid" :class="{ 'single-result': group.items.length === 1 }">
          <RouterLink v-for="character in group.items" :key="character.id" :to="`/characters/${character.id}`" class="card card-link">
            <img :src="character.image" :alt="character.name">
            <h3>{{ character.name }}</h3>
            <p>{{ character.description }}</p>
          </RouterLink>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.card-link:hover {
  transform: translateY(-3px);
  border-color: rgba(184, 148, 69, 0.7);
}
</style>
