<script setup>
import { computed, ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import monstersData from '../data/monsters.json'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useUiEffects'

const query = ref('')
const selectedGroup = ref('all')
const selectedWeakness = ref('all')
const { t } = useLocale()
const { monsterGroups, monsters } = monstersData

const options = computed(() => ['all', ...monsterGroups])

const weaknessByGroup = computed(() => {
  const map = {}
  map[monsterGroups[0]] = ['igni', 'beast_oil', 'axii']
  map[monsterGroups[1]] = ['moon_dust', 'black_blood', 'vampire_oil']
  map[monsterGroups[2]] = ['hybrid_oil', 'aard', 'crossbow']
  map[monsterGroups[3]] = ['draconid_oil', 'aard', 'grapeshot']
  map[monsterGroups[4]] = ['yrden', 'relict_oil', 'moon_dust']
  map[monsterGroups[5]] = ['dimeritium_bomb', 'aard', 'elementa_oil']
  map[monsterGroups[6]] = ['insectoid_oil', 'quen', 'aard']
  map[monsterGroups[7]] = ['ogroid_oil', 'quen', 'axii']
  map[monsterGroups[8]] = ['cursed_oil', 'yrden', 'moon_dust']
  map[monsterGroups[9]] = ['relict_oil', 'yrden', 'dimeritium_bomb']
  map[monsterGroups[10]] = ['necrophage_oil', 'axii', 'quen']
  return map
})

const weaknessMeta = {
  all: { icon: 'assets/icons/chertov_grib.webp', label: () => t('allWeaknesses') },
  igni: { icon: 'assets/icons/igni.webp', label: () => t('weakIgni') },
  aard: { icon: 'assets/icons/aard.webp', label: () => t('weakAard') },
  yrden: { icon: 'assets/icons/irden.webp', label: () => t('weakYrden') },
  axii: { icon: 'assets/icons/axii.webp', label: () => t('weakAxii') },
  quen: { icon: 'assets/icons/quen.webp', label: () => t('weakQuen') },
  moon_dust: { icon: 'assets/icons/lunnaya_pil.webp', label: () => t('weakMoonDust') },
  black_blood: { icon: 'assets/icons/black_krov.webp', label: () => t('weakBlackBlood') },
  dimeritium_bomb: { icon: 'assets/icons/dvimerit_bomba.webp', label: () => t('weakDimeritium') },
  grapeshot: { icon: 'assets/icons/kartech.webp', label: () => t('weakGrapeshot') },
  crossbow: { icon: 'assets/icons/arbalet.webp', label: () => t('weakCrossbow') },
  beast_oil: { icon: 'assets/icons/maslo_zveri.webp', label: () => t('weakBeastOil') },
  vampire_oil: { icon: 'assets/icons/maslo_vampir.webp', label: () => t('weakVampireOil') },
  hybrid_oil: { icon: 'assets/icons/maslo_gibrid.webp', label: () => t('weakHybridOil') },
  draconid_oil: { icon: 'assets/icons/maslo_drakonid.webp', label: () => t('weakDraconidOil') },
  elementa_oil: { icon: 'assets/icons/maslo_magic_tvar.webp', label: () => t('weakElementaOil') },
  insectoid_oil: { icon: 'assets/icons/maslo_insektoid.webp', label: () => t('weakInsectoidOil') },
  ogroid_oil: { icon: 'assets/icons/maslo_ogr.webp', label: () => t('weakOgroidOil') },
  cursed_oil: { icon: 'assets/icons/maslo_proklyati.webp', label: () => t('weakCursedOil') },
  relict_oil: { icon: 'assets/icons/maslo_relikt.webp', label: () => t('weakRelictOil') },
  necrophage_oil: { icon: 'assets/icons/maslo_trupoed.webp', label: () => t('weakNecrophageOil') }
}

const weaknessOptions = computed(() => ['all', ...Object.keys(weaknessMeta).filter((k) => k !== 'all')])

const getMonsterWeaknesses = (monster) => weaknessByGroup.value[monster.group] || ['relict_oil', 'quen']
const weaknessLabel = (key) => weaknessMeta[key]?.label() || key
const weaknessIcon = (key) => weaknessMeta[key]?.icon || 'assets/icons/chertov_grib.webp'

const filteredGroups = computed(() =>
  monsterGroups
    .filter((group) => selectedGroup.value === 'all' || group === selectedGroup.value)
    .map((group) => ({
      title: group,
      items: monsters.filter((monster) => {
        if (monster.group !== group) return false
        if (!monster.name.toLowerCase().includes(query.value.trim().toLowerCase())) return false
        if (selectedWeakness.value === 'all') return true
        return getMonsterWeaknesses(monster).includes(selectedWeakness.value)
      })
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
        <select v-model="selectedWeakness" aria-label="Фильтр по слабостям монстров">
          <option v-for="option in weaknessOptions" :key="option" :value="option">
            {{ option === 'all' ? t('allWeaknesses') : weaknessLabel(option) }}
          </option>
        </select>
      </section>

      <p v-if="!filteredGroups.length" class="no-results" style="display:block;">{{ t('noResults') }}</p>

      <section v-for="group in filteredGroups" :key="group.title" class="group">
        <h2>{{ group.title }}</h2>
        <div class="grid monster-grid">
          <article v-for="monster in group.items" :key="monster.name" class="card monster-card">
            <div class="monster-image-wrap">
              <img :src="monster.image" :alt="monster.name" loading="lazy" decoding="async">
            </div>
            <h3>{{ monster.name }}</h3>
            <p>{{ monster.description }}</p>
            <div class="monster-weaknesses">
              <span
                v-for="weakness in getMonsterWeaknesses(monster)"
                :key="`${monster.name}-${weakness}`"
                class="weakness-chip"
                :title="weaknessLabel(weakness)"
              >
                <img class="weakness-icon" :src="weaknessIcon(weakness)" :alt="weaknessLabel(weakness)" loading="lazy" decoding="async">
                {{ weaknessLabel(weakness) }}
              </span>
            </div>
          </article>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.monster-weaknesses {
  margin-top: 14px;
  margin-bottom: 14px;
  padding: 0 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.weakness-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px;
  border: 1px solid rgba(217, 192, 127, 0.45);
  background: rgba(7, 7, 7, 0.62);
  color: #e5cb8f;
  font-size: 16px;
  line-height: 1.1;
}

.monster-weaknesses .weakness-icon {
  display: block !important;
  width: 33px !important;
  height: 33px !important;
  min-width: 33px !important;
  min-height: 33px !important;
  max-width: 33px !important;
  max-height: 33px !important;
  object-fit: contain !important;
  flex: 0 0 16px !important;
  margin: 0 !important;
}
</style>






