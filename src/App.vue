<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
const routeKey = computed(() => {
  if (route.name === 'champion-detail') {
    return route.path
  }
  return route.fullPath
})
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="default">
            <component :is="Component" :key="routeKey" />
          </transition>
        </router-view>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  padding-top: var(--spacing-xl);
  flex: 1;
}

.hero-title {
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.hero-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
