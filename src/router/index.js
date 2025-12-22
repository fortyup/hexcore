import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChampionDetailView from '../views/ChampionDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/champions',
      name: 'champions',
      component: () => import('../views/ChampionsView.vue')
    },
    {
      path: '/skins',
      name: 'skins',
      component: () => import('../views/SkinsView.vue')
    },
    {
      path: '/skin/:championId/:skinNum',
      name: 'skin-preview',
      component: () => import('../views/SkinPreviewView.vue')
    },
    {
      path: '/champion/:id',
      name: 'champion-detail',
      component: ChampionDetailView
    }
  ]
})

export default router
