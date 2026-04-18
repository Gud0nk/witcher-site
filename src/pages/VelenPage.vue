<script setup>
import RegionMapPage from '../components/RegionMapPage.vue'
import { regions } from '../data/regions'
</script>

<template>
  <RegionMapPage :region="regions.velen" />
</template>
