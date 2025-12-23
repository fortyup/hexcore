<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { riotApi } from '../services/riotApi';
import ChampionCard from '../components/ChampionCard.vue';
import { initAnimations } from '../utils/animations';

const champions = ref([]);
const loading = ref(true);
const searchQuery = ref(localStorage.getItem('champions_search') || '');
const selectedRole = ref(localStorage.getItem('champions_role') || 'All');

const roles = ['All', 'Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'];

// Save to localStorage on change
watch(searchQuery, (val) => {
  localStorage.setItem('champions_search', val);
});

watch(selectedRole, (val) => {
  localStorage.setItem('champions_role', val);
});

onMounted(async () => {
  try {
    champions.value = await riotApi.getChampions();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
    initAnimations();
  }
});

const filteredChampions = computed(() => {
  let results = champions.value;
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    results = results.filter(c => c.name.toLowerCase().includes(q));
  }
  
  if (selectedRole.value !== 'All') {
    results = results.filter(c => c.tags.includes(selectedRole.value));
  }
  
  return results;
});

const selectRole = (role) => {
  selectedRole.value = role;
};
</script>

<template>
  <div class="champions-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title reveal">CHAMPIONS</h1>
        <p class="page-subtitle reveal" style="transition-delay: 0.1s">Master the Roster of Runeterra</p>
        
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-value">{{ champions.length }}</span>
            <span class="stat-label">Total Champions</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ filteredChampions.length }}</span>
            <span class="stat-label">Showing</span>
          </div>
        </div>
      </div>
    </div>

    <div class="filters-section">
      <div class="search-container">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="SEARCH CHAMPIONS..." 
          class="search-input"
        />
      </div>
      
      <div class="role-filters">
        <button 
          v-for="role in roles" 
          :key="role"
          class="role-btn"
          :class="{ active: selectedRole === role }"
          @click="selectRole(role)"
        >
          {{ role }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="champion-grid skeleton-grid">
      <div v-for="n in 12" :key="n" class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-subtitle"></div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredChampions.length === 0" class="empty-state">
      <p>No champions found matching your criteria.</p>
    </div>

    <div v-else class="champion-grid">
      <ChampionCard 
        v-for="(champion, index) in filteredChampions" 
        :key="champion.id" 
        :champion="champion"
        :index="index"
      />
    </div>
  </div>
</template>

<style scoped>
.champions-view {
  padding-bottom: var(--spacing-xl);
}

.page-header {
  text-align: center;
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(180deg, rgba(0,44,253,0.05) 0%, transparent 100%);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.page-title {
  font-family: 'Compacta Pro', sans-serif;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-sm);
  background: linear-gradient(180deg, #fff 0%, #888 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-family: 'Parabolica', sans-serif;
  color: var(--color-accent-gold);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: var(--spacing-lg);
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-family: 'Compacta Pro', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-accent-blue);
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.filters-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  align-items: center;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem 1rem 50px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-family: 'Parabolica', sans-serif;
  text-transform: uppercase;
  font-size: 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent-blue);
  background: rgba(0, 44, 253, 0.05);
  box-shadow: 0 0 20px rgba(0, 44, 253, 0.1);
}

.role-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.role-btn {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: #888;
  font-family: 'Parabolica', sans-serif;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.role-btn:hover {
  border-color: var(--color-accent-blue);
  color: #fff;
}

.role-btn.active {
  background: var(--color-accent-blue);
  border-color: var(--color-accent-blue);
  color: #fff;
  box-shadow: 0 0 15px rgba(0, 44, 253, 0.3);
}

.champion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  gap: var(--spacing-md);
  color: #666;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: var(--color-accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: #666;
  font-size: 1.2rem;
}

/* Skeleton Loaders */
.skeleton-card {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.skeleton-image {
  aspect-ratio: 308/560;
  background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  padding: var(--spacing-md);
}

.skeleton-title {
  height: 24px;
  width: 70%;
  background: linear-gradient(90deg, #252525 25%, #333 50%, #252525 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-subtitle {
  height: 14px;
  width: 50%;
  background: linear-gradient(90deg, #252525 25%, #333 50%, #252525 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
