<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { riotApi } from '../services/riotApi';
import SkinCard from '../components/SkinCard.vue';

const router = useRouter();
const champions = ref([]);
const allSkins = ref([]);
const loading = ref(true);
const searchQuery = ref(localStorage.getItem('skins_search') || '');

const loadProgress = ref(0);

// Save to localStorage on change
watch(searchQuery, (val) => {
  localStorage.setItem('skins_search', val);
});

onMounted(async () => {
  try {
    const champList = await riotApi.getChampions();
    champions.value = champList;
    
    // Fetch all champion details to get complete skin data
    const skinPreviews = [];
    const total = champList.length;
    let loaded = 0;
    
    // Process in batches of 10 to avoid overwhelming the API
    const batchSize = 10;
    for (let i = 0; i < champList.length; i += batchSize) {
      const batch = champList.slice(i, i + batchSize);
      const details = await Promise.all(
        batch.map(champ => riotApi.getChampionDetail(champ.id))
      );
      
      details.forEach(champDetail => {
        if (champDetail && champDetail.skins) {
          champDetail.skins.forEach(skin => {
            skinPreviews.push({
              id: `${champDetail.id}_${skin.num}`,
              championId: champDetail.id,
              championName: champDetail.name,
              skinNum: skin.num,
              name: skin.name === 'default' ? `${champDetail.name} (Base)` : skin.name,
              imageUrl: riotApi.getSkinImageUrl(champDetail.id, skin.num)
            });
          });
        }
      });
      
      loaded += batch.length;
      loadProgress.value = Math.round((loaded / total) * 100);
    }
    
    allSkins.value = skinPreviews;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const filteredSkins = computed(() => {
  if (!searchQuery.value) return allSkins.value;
  const q = searchQuery.value.toLowerCase();
  return allSkins.value.filter(s => 
    s.championName.toLowerCase().includes(q) || 
    s.name.toLowerCase().includes(q)
  );
});

const skinCount = computed(() => allSkins.value.length);

const handleSelect = (skin) => {
  router.push({ name: 'champion-detail', params: { id: skin.championId } });
};
</script>

<template>
  <div class="skins-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title reveal">SKINS</h1>
        <p class="page-subtitle reveal" style="transition-delay: 0.1s">The Visual Archive of Runeterra</p>
        
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-value">{{ skinCount }}</span>
            <span class="stat-label">Skin Previews</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ filteredSkins.length }}</span>
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
          placeholder="SEARCH SKINS OR CHAMPIONS..." 
          class="search-input"
        />
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loader-wrapper">
        <div class="loader"></div>
        <div class="loader-glow"></div>
      </div>
      <span class="loading-text">DECODING ARCHIVES... {{ loadProgress }}%</span>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: loadProgress + '%' }"></div>
      </div>
    </div>

    <div v-else-if="filteredSkins.length === 0" class="empty-state">
      <p>No skins found matching your search.</p>
    </div>

    <div v-else class="skin-grid">
      <SkinCard 
        v-for="(skin, index) in filteredSkins" 
        :key="skin.id"
        :skin="skin"
        :index="index"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.skins-view {
  padding-bottom: var(--spacing-xl);
}

.page-header {
  text-align: center;
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(180deg, rgba(203,173,144,0.05) 0%, transparent 100%);
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
  justify-content: center;
  margin-bottom: var(--spacing-xl);
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
  background: rgba(203, 173, 144, 0.05);
  box-shadow: 0 0 20px rgba(203, 173, 144, 0.1);
}

.skin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-md);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  gap: var(--spacing-md);
}

.loader-wrapper {
  position: relative;
  margin-bottom: var(--spacing-md);
}

.loader {
  width: 60px;
  height: 60px;
  border: 2px solid rgba(203, 173, 144, 0.1);
  border-top-color: var(--color-accent-gold);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.loader-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(203, 173, 144, 0.2) 0%, transparent 70%);
  filter: blur(5px);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.loading-text {
  font-family: 'Compacta Pro', sans-serif;
  color: var(--color-accent-gold);
  letter-spacing: 0.2em;
  font-size: 0.9rem;
}

.progress-bar {
  width: 300px;
  height: 2px;
  background: rgba(255,255,255,0.05);
  border-radius: 2px;
  overflow: hidden;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-gold), #fff);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(203, 173, 144, 0.5);
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
</style>
