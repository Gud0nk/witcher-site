<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'

const route = useRoute()
const { locale, t, setLocale } = useLocale()

const regionPaths = ['/velen', '/skellige', '/white-orchard', '/kaer-morhen', '/toussaint']
const miscPaths = ['/characters', '/monsters']

const isHome = computed(() => route.path === '/')
const isRegions = computed(() => regionPaths.includes(route.path))
const isMisc = computed(() => miscPaths.includes(route.path))
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <RouterLink class="brand" to="/">
        <img src="/assets/logotype3.webp" alt="The Witcher 3">
      </RouterLink>

      <nav class="menu">
        <RouterLink class="menu-link" :class="{ 'active-router': isHome }" to="/">{{ t('home') }}</RouterLink>

        <div class="menu-dropdown">
          <button class="menu-link menu-toggle" :class="{ 'active-router': isRegions }" type="button">{{ t('northernKingdoms') }}</button>
          <div class="submenu">
            <RouterLink class="submenu-link" :class="{ active: route.path === '/velen' }" to="/velen">{{ t('velen') }}</RouterLink>
            <RouterLink class="submenu-link" :class="{ active: route.path === '/skellige' }" to="/skellige">{{ t('skellige') }}</RouterLink>
            <RouterLink class="submenu-link" :class="{ active: route.path === '/white-orchard' }" to="/white-orchard">{{ t('whiteOrchard') }}</RouterLink>
            <RouterLink class="submenu-link" :class="{ active: route.path === '/kaer-morhen' }" to="/kaer-morhen">{{ t('kaerMorhen') }}</RouterLink>
            <RouterLink class="submenu-link" :class="{ active: route.path === '/toussaint' }" to="/toussaint">{{ t('toussaint') }}</RouterLink>
          </div>
        </div>

        <div class="menu-dropdown">
          <button class="menu-link menu-toggle" :class="{ 'active-router': isMisc }" type="button">{{ t('misc') }}</button>
          <div class="submenu">
            <RouterLink class="submenu-link" :class="{ active: route.path === '/characters' }" to="/characters">{{ t('allCharacters') }}</RouterLink>
            <RouterLink class="submenu-link" :class="{ active: route.path === '/monsters' }" to="/monsters">{{ t('bestiary') }}</RouterLink>
          </div>
        </div>
      </nav>

      <div class="lang-switch" aria-label="Language switch">
        <button type="button" class="lang-btn" :class="{ active: locale === 'ru' }" @click="setLocale('ru')">RU</button>
        <button type="button" class="lang-btn" :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
      </div>
    </div>
  </header>
</template>
