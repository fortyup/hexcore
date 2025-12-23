<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { riotApi } from '../services/riotApi';
import SkinGallery from '../components/SkinGallery.vue';
import SkinPreview from '../components/SkinPreview.vue';
import AbilityShowcase from '../components/AbilityShowcase.vue';
import RoleIcon from '../components/RoleIcon.vue';

const route = useRoute();
const router = useRouter();
const champion = ref(null);
const allChampions = ref([]);
const loading = ref(true);
const isVisible = ref(false);
const parallaxOffset = ref(0);
const previewSkin = ref(null);

const previewImageUrl = computed(() => {
  if (!previewSkin.value || !champion.value) return '';
  return riotApi.getSkinImageUrl(champion.value.id, previewSkin.value.num);
});

const updateSkinQueryParam = (skinNum) => {
  const target = skinNum != null ? String(skinNum) : undefined;
  const current = route.query.skin;
  const alreadyMatching = (target === undefined && current === undefined) || (target !== undefined && target === current);
  if (alreadyMatching) return;
  const nextQuery = { ...route.query };
  if (target === undefined) {
    delete nextQuery.skin;
  } else {
    nextQuery.skin = target;
  }
  router.replace({ name: 'champion-detail', params: { id: route.params.id }, query: nextQuery });
};

const applySkinQuery = () => {
  if (!champion.value) {
    previewSkin.value = null;
    return;
  }
  const skinParam = route.query.skin;
  if (!skinParam) {
    previewSkin.value = null;
    return;
  }
  const skinNum = Number(skinParam);
  if (!Number.isFinite(skinNum)) {
    previewSkin.value = null;
    updateSkinQueryParam(null);
    return;
  }
  const matchingSkin = champion.value.skins?.find(skin => skin.num === skinNum);
  if (matchingSkin) {
    previewSkin.value = matchingSkin;
  } else {
    previewSkin.value = null;
    updateSkinQueryParam(null);
  }
};

const openSkinPreview = (skin, shouldUpdateQuery = true) => {
  previewSkin.value = skin;
  if (shouldUpdateQuery) {
    updateSkinQueryParam(skin?.num);
  }
};

const closeSkinPreview = () => {
  if (!previewSkin.value) return;
  previewSkin.value = null;
  updateSkinQueryParam(null);
};

// Parallax scroll effect
const handleScroll = () => {
  parallaxOffset.value = window.scrollY * 0.3;
};

const fetchChampionData = async (id) => {
  loading.value = true;
  isVisible.value = false;
  previewSkin.value = null;
  
  try {
    const [championData, champList] = await Promise.all([
      riotApi.getChampionDetail(id),
      riotApi.getChampions()
    ]);
    champion.value = championData;
    allChampions.value = champList;
    applySkinQuery();
    
    // Trigger entrance animations
    setTimeout(() => {
      isVisible.value = true;
    }, 100);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  await fetchChampionData(route.params.id);
});

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchChampionData(newId);
  }
});

watch(() => route.query.skin, () => {
  if (!champion.value) return;
  applySkinQuery();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Related champions (same role)
const relatedChampions = computed(() => {
  if (!champion.value || !allChampions.value.length) return [];
  
  const currentTags = champion.value.tags;
  return allChampions.value
    .filter(c => 
      c.id !== champion.value.id && 
      c.tags.some(tag => currentTags.includes(tag))
    )
    .slice(0, 6);
});

</script>

<template>
  <!-- Skeleton Loader -->
  <div v-if="loading" class="skeleton-page">
    <div class="skeleton-hero">
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-subtitle"></div>
        <div class="skeleton-tags">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
        </div>
        <div class="skeleton-desc"></div>
        <div class="skeleton-desc short"></div>
      </div>
    </div>
    <div class="skeleton-stats">
      <div v-for="n in 4" :key="n" class="skeleton-stat-box"></div>
    </div>
  </div>
  
  <div v-else-if="champion" class="champion-detail" :class="{ 'is-visible': isVisible }">

    <div class="hero-header">
      <div 
        class="backdrop" 
        :style="{ 
          backgroundImage: `url(${riotApi.getSkinImageUrl(champion.id, 0)})`,
          transform: `translateY(${parallaxOffset}px) scale(1.1)`
        }"
      ></div>
      <div class="overlay"></div>
      
      <div class="hero-content container">
        <h1 class="champion-name animate-item">{{ champion.name }}</h1>
        <h2 class="champion-title animate-item delay-1">{{ champion.title }}</h2>
        
        <div class="tags animate-item delay-2">
          <div v-for="tag in champion.tags" :key="tag" class="tag">
            <RoleIcon :role="tag" />
            <span class="tag-text">{{ tag }}</span>
          </div>
        </div>

        <p class="description animate-item delay-3">{{ champion.lore }}</p>
      </div>
    </div>

    <div class="container content-section">
      <!-- Animated Stats -->
      <div class="stats-grid animate-item delay-4">
        <div class="stat-box">
          <span class="stat-label">Attack</span>
          <div class="stat-bar">
            <div class="fill" :style="{ width: isVisible ? `${champion.info.attack * 10}%` : '0%' }"></div>
          </div>
          <span class="stat-value">{{ champion.info.attack }}/10</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Defense</span>
          <div class="stat-bar">
            <div class="fill defense" :style="{ width: isVisible ? `${champion.info.defense * 10}%` : '0%' }"></div>
          </div>
          <span class="stat-value">{{ champion.info.defense }}/10</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Magic</span>
          <div class="stat-bar">
            <div class="fill magic" :style="{ width: isVisible ? `${champion.info.magic * 10}%` : '0%' }"></div>
          </div>
          <span class="stat-value">{{ champion.info.magic }}/10</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Difficulty</span>
          <div class="stat-bar">
            <div class="fill difficulty" :style="{ width: isVisible ? `${champion.info.difficulty * 10}%` : '0%' }"></div>
          </div>
          <span class="stat-value">{{ champion.info.difficulty }}/10</span>
        </div>
      </div>

      <div class="animate-item delay-5">
        <AbilityShowcase 
          :passive="champion.passive" 
          :spells="champion.spells" 
          :championKey="champion.key"
        />
      </div>

      <div class="animate-item delay-6">
        <SkinGallery :championId="champion.id" :skins="champion.skins" @select="openSkinPreview" />
      </div>

      <SkinPreview
        :open="Boolean(previewSkin)"
        :skin="previewSkin"
        :champion="champion"
        :imageUrl="previewImageUrl"
        @close="closeSkinPreview"
      />

      <!-- Related Champions -->
      <div v-if="relatedChampions.length" class="related-section animate-item delay-7">
        <h3 class="section-title">Related Champions</h3>
        <div class="related-grid">
          <router-link 
            v-for="(related, index) in relatedChampions" 
            :key="related.id"
            :to="{ name: 'champion-detail', params: { id: related.id } }"
            class="related-card"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="card-border"></div>
            <div class="image-wrapper">
              <img :src="riotApi.getChampionImageUrl(related.id)" :alt="related.name" />
              <div class="shine"></div>
            </div>
            <div class="related-info">
              <span class="related-name">{{ related.name }}</span>
              <span class="related-tags">{{ related.tags.join(' / ') }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Skeleton Loader */
.skeleton-page {
  min-height: 100vh;
}

.skeleton-hero {
  height: 80vh;
  background: linear-gradient(to bottom, #1a1a1a, #000);
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-xl);
}

.skeleton-content {
  max-width: 800px;
}

.skeleton-title {
  height: 80px;
  width: 300px;
  background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 15px;
}

.skeleton-subtitle {
  height: 30px;
  width: 200px;
  background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 20px;
}

.skeleton-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.skeleton-tag {
  height: 30px;
  width: 80px;
  background: linear-gradient(90deg, #252525 25%, #333 50%, #252525 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-desc {
  height: 20px;
  width: 100%;
  background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 10px;
}

.skeleton-desc.short {
  width: 60%;
}

.skeleton-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  max-width: var(--max-width);
  margin: 0 auto;
}

.skeleton-stat-box {
  height: 80px;
  background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border: 1px solid rgba(255,255,255,0.05);
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}


/* Main Content */
.champion-detail {
  opacity: 0;
}

.champion-detail.is-visible {
  opacity: 1;
}

/* Entrance Animations */
.animate-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-visible .animate-item {
  opacity: 1;
  transform: translateY(0);
}

.delay-1 { transition-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; }
.delay-4 { transition-delay: 0.4s; }
.delay-5 { transition-delay: 0.5s; }
.delay-6 { transition-delay: 0.6s; }
.delay-7 { transition-delay: 0.7s; }

/* Hero Section */
.hero-header {
  position: relative;
  height: 85vh;
  display: flex;
  align-items: flex-end;
  padding-bottom: var(--spacing-xl);
  margin-top: calc(-1 * var(--spacing-xl));
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  width: 100vw;
  overflow: hidden;
}

.backdrop {
  position: absolute;
  inset: -50px;
  background-size: cover;
  background-position: center 20%;
  z-index: -1;
  transition: transform 0.1s ease-out;
  will-change: transform;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 60%, #000 100%);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
}

.champion-name {
  font-size: clamp(4rem, 12vw, 10rem);
  line-height: 0.9;
  margin-bottom: var(--spacing-xs);
  text-shadow: 0 0 50px rgba(0, 44, 253, 0.5);
  letter-spacing: -0.02em;
}

.champion-title {
  font-family: var(--font-heading);
  text-transform: uppercase;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  color: var(--color-accent-gold);
  margin-bottom: var(--spacing-md);
  font-style: italic;
}

.tags {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.tag {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 100px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.tag-text {
  text-transform: uppercase;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
}


.tag:hover .tag-text {
  color: #fff;
}

.description {
  max-width: 800px;
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.content-section {
  padding-top: var(--spacing-xl);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-box {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  padding: var(--spacing-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-box:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.stat-label {
  display: block;
  font-family: var(--font-heading);
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.stat-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-blue), #4d7aff);
  box-shadow: 0 0 15px var(--color-accent-blue);
  transition: width 1s ease-out;
  border-radius: 4px;
}

.fill.defense {
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  box-shadow: 0 0 15px #27ae60;
}

.fill.magic {
  background: linear-gradient(90deg, #9b59b6, #be7ddb);
  box-shadow: 0 0 15px #9b59b6;
}

.fill.difficulty {
  background: linear-gradient(90deg, #e74c3c, #ff7675);
  box-shadow: 0 0 15px #e74c3c;
}

.stat-value {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: #fff;
}

/* Related Champions */
.related-section {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid rgba(255,255,255,0.1);
}

.section-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
  font-style: italic;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-md);
}

.related-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #0a0a0a;
  padding: 1px; /* Space for animated border */
  display: flex;
  flex-direction: column;
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: linear-gradient(
    var(--angle, 0deg),
    transparent 0%,
    rgba(0, 44, 253, 0.2) 20%,
    var(--color-accent-blue) 50%,
    rgba(0, 44, 253, 0.2) 80%,
    transparent 100%
  );
  animation: rotate-border 4s linear infinite;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate-border {
  to { --angle: 360deg; }
}

.related-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 44, 253, 0.3);
}

.related-card:hover .card-border {
  opacity: 1;
}

.related-card .image-wrapper {
  position: relative;
  aspect-ratio: 308/560;
  overflow: hidden;
  border-radius: 7px;
}

.related-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s ease;
  filter: grayscale(60%) brightness(0.8);
}

.related-card:hover img {
  transform: scale(1.1);
  filter: grayscale(0%) brightness(1);
}

/* Shine effect */
.shine {
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  );
  transform: skewX(-25deg);
  transition: left 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 5;
}

.related-card:hover .shine {
  left: 150%;
}

.related-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: var(--spacing-md);
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
}

.related-name {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: #fff;
  font-style: italic;
}

.related-tags {
  display: block;
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}
</style>
