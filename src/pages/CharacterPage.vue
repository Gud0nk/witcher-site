<script setup>
import { computed, ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { characterGroups } from '../data/characters'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useUiEffects'

const query = ref('')
const selectedGroup = ref('all')

const { t } = useLocale()

const groupOptions = computed(() => ['all', ...characterGroups.map((group) => group.title)])

const filteredGroups = computed(() =>
  characterGroups
    .filter((group) => selectedGroup.value === 'all' || group.title === selectedGroup.value)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.name.toLowerCase().includes(query.value.trim().toLowerCase()))
    }))
    .filter((group) => group.items.length > 0)
)

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
        <div class="grid">
          <article v-for="character in group.items" :key="character.name" class="card">
            <img :src="character.image" :alt="character.name">
            <h3>{{ character.name }}</h3>
            <p>{{ character.description }}</p>
          </article>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
