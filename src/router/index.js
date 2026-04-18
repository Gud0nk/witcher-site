import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import MonstersPage from '../pages/MonstersPage.vue'
import CharacterPage from '../pages/CharacterPage.vue'

const routes = [
    { path: '/', component: HomePage },
    { path: '/characters', component: CharacterPage },
    { path: '/monsters', component: MonstersPage },
    { path: '/velen', component: () => import('../pages/VelenPage.vue') },
    { path: '/skellige', component: () => import('../pages/SkelligePage.vue') },
    { path: '/white-orchard', component: () => import('../pages/WhiteOrchardPage.vue') },
    { path: '/kaer-morhen', component: () => import('../pages/KaerMorhenPage.vue') },
    { path: '/toussaint', component: () => import('../pages/ToussaintPage.vue') },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
