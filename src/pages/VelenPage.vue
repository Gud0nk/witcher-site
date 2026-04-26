<script setup>
import RegionMapPage from '../components/RegionMapPage.vue'
import regionsData from '../data/regions.json'

const { regions } = regionsData
</script>

<template>
  <RegionMapPage :region="regions.velen" />
</template>
