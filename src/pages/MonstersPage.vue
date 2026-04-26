<script setup>
import { computed, ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import monstersData from '../data/monsters.json'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useUiEffects'

const query = ref('')
const selectedGroup = ref('all')
const { t } = useLocale()
const { monsterGroups, monsters } = monstersData

const options = computed(() => ['all', ...monsterGroups])

const filteredGroups = computed(() =>
  monsterGroups
    .filter((group) => selectedGroup.value === 'all' || group === selectedGroup.value)
    .map((group) => ({
      title: group,
      items: monsters.filter(
        (monster) => monster.group === group && monster.name.toLowerCase().includes(query.value.trim().toLowerCase())
      )
    }))
    .filter((group) => group.items.length > 0)
)

useReveal('.monsters-page .reveal-item')
</script>

<template>
  <div class="page-shell">
    <AppHeader />

    <main class="characters-page monsters-page">
      <section class="intro reveal-item">
        <h1>{{ t('monstersTitle') }}</h1>
        <p>{{ t('monstersSubtitle') }}</p>
      </section>

      <section class="filters reveal-item" aria-label="Фильтрация монстров">
        <input v-model="query" type="text" :placeholder="t('searchMonster')" aria-label="Поиск по имени монстра">
        <select v-model="selectedGroup" aria-label="Фильтр по категории монстров">
          <option v-for="option in options" :key="option" :value="option">{{ option === 'all' ? t('allCategories') : option }}</option>
        </select>
      </section>

      <p v-if="!filteredGroups.length" class="no-results" style="display:block;">{{ t('noResults') }}</p>

      <section v-for="group in filteredGroups" :key="group.title" class="group">
        <h2>{{ group.title }}</h2>
        <div class="grid monster-grid">
          <article v-for="monster in group.items" :key="monster.name" class="card monster-card">
            <div class="monster-image-wrap">
              <img :src="monster.image" :alt="monster.name">
            </div>
            <h3>{{ monster.name }}</h3>
            <p>{{ monster.description }}</p>
          </article>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
