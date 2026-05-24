<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import charactersData from '../data/characters.json'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useUiEffects'

const gallery = ref([
  '/images/geralt-1.jpg',
  '/images/geralt-2.jpg',
  '/images/geralt-3.jpg',
  '/images/geralt-4.jpg',
  '/images/geralt-5.jpg',
  '/images/geralt-6.jpg'
])
</script>

<template>

</template>


<style scoped>
.geralt-page {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: #e0e0e0;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 80vh;
  overflow: hidden;
}

.character-main-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.character-main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.character-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 60px 40px;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
}

.character-name {
  font-size: 4em;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 30px rgba(255,255,255,0.5);
  margin: 0 0 10px 0;
  letter-spacing: 5px;
}

.character-titles {
  font-size: 1.5em;
  color: #c9a227;
  margin: 0;
  font-style: italic;
}

/* Stats Section */
.stats-section {
  padding: 60px 40px;
  background: rgba(0,0,0,0.5);
}

.stats-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 30px;
  border-radius: 10px;
  border: 1px solid #c9a227;
  text-align: center;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(201, 162, 39, 0.3);
}

.stat-card h3 {
  color: #c9a227;
  margin: 0 0 10px 0;
  font-size: 1.2em;
}

.stat-card p {
  margin: 0;
  font-size: 1.1em;
}

/* Biography Section */
.biography-section {
  padding: 80px 40px;
}

.bio-container {
  max-width: 1200px;
  margin: 0 auto;
}

.bio-block {
  margin-bottom: 80px;
}

.bio-block h2 {
  font-size: 2.5em;
  color: #c9a227;
  margin-bottom: 30px;
  border-bottom: 3px solid #c9a227;
  padding-bottom: 10px;
}

.bio-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.bio-block.reverse .bio-content {
  direction: rtl;
}

.bio-block.reverse .bio-text,
.bio-block.reverse .bio-image {
  direction: ltr;
}

.bio-text {
  font-size: 1.1em;
  line-height: 1.8;
}

.bio-text p {
  margin-bottom: 20px;
}

.bio-text ul {
  list-style: none;
  padding: 0;
}

.bio-text li {
  padding: 10px 0;
  padding-left: 30px;
  position: relative;
}

.bio-text li:before {
  content: "⚔️";
  position: absolute;
  left: 0;
}

.bio-text blockquote {
  border-left: 4px solid #c9a227;
  padding-left: 20px;
  margin: 20px 0;
  font-style: italic;
  color: #fff;
}

.bio-image img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

/* Symbols Section */
.symbols-section {
  padding: 80px 40px;
  background: rgba(0,0,0,0.5);
  text-align: center;
}

.symbols-section h2 {
  font-size: 2.5em;
  color: #c9a227;
  margin-bottom: 50px;
}

.symbols-grid {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.symbol-item {
  text-align: center;
}

.symbol-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #c9a227;
  border-radius: 50%;
  background: rgba(201, 162, 39, 0.1);
}

.symbol-icon svg {
  width: 60px;
  height: 60px;
}

.wolf-head img {
  width: 80px;
  height: 80px;
}

.symbol-item p {
  color: #c9a227;
  font-weight: bold;
}

/* Equipment Section */
.equipment-section {
  padding: 80px 40px;
}

.equipment-section h2 {
  font-size: 2.5em;
  color: #c9a227;
  text-align: center;
  margin-bottom: 50px;
}

.equipment-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.equipment-card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #c9a227;
  transition: transform 0.3s;
}

.equipment-card:hover {
  transform: scale(1.05);
}

.equipment-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.equipment-card h3 {
  color: #c9a227;
  padding: 20px;
  margin: 0;
  text-align: center;
}

.equipment-card p {
  padding: 0 20px 20px;
  text-align: center;
  color: #888;
}

/* Gallery Section */
.gallery-section {
  padding: 80px 40px;
  background: rgba(0,0,0,0.5);
}

.gallery-section h2 {
  font-size: 2.5em;
  color: #c9a227;
  text-align: center;
  margin-bottom: 50px;
}

.gallery-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.gallery-item {
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

/* Quotes Section */
.quotes-section {
  padding: 100px 40px;
  text-align: center;
}

.quote-block {
  max-width: 800px;
  margin: 0 auto;
}

.quote-text {
  font-size: 2em;
  font-style: italic;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.4;
}

.quote-author {
  color: #c9a227;
  font-size: 1.3em;
}

/* Responsive */
@media (max-width: 768px) {
  .character-name {
    font-size: 2.5em;
  }

  .character-titles {
    font-size: 1.2em;
  }

  .bio-content {
    grid-template-columns: 1fr;
  }

  .symbols-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid,
  .equipment-grid,
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>