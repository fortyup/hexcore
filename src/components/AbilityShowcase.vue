<script setup>
import { ref, computed } from 'vue';
import { riotApi } from '../services/riotApi';

const props = defineProps({
  passive: {
    type: Object,
    required: true
  },
  spells: {
    type: Array,
    required: true
  },
  championKey: {
    type: [String, Number],
    required: true
  }
});

const selectedSpellIndex = ref(-1); // -1 for Passive, 0-3 for QWER

const currentSpell = computed(() => {
  if (selectedSpellIndex.value === -1) {
    return {
      name: props.passive.name,
      description: props.passive.description,
      image: riotApi.getPassiveImageUrl(props.passive.image.full),
      hotkey: 'Passive',
      videoUrl: riotApi.getSpellVideoUrl(props.championKey, 'P')
    };
  }
  const spell = props.spells[selectedSpellIndex.value];
  const hotkeys = ['Q', 'W', 'E', 'R'];
  return {
    name: spell.name,
    description: spell.description,
    image: riotApi.getSpellImageUrl(spell.image.full),
    hotkey: hotkeys[selectedSpellIndex.value],
    videoUrl: riotApi.getSpellVideoUrl(props.championKey, hotkeys[selectedSpellIndex.value])
  };
});

const selectSpell = (index) => {
  selectedSpellIndex.value = index;
};
</script>

<template>
  <div class="ability-showcase">
    <h2 class="section-title">ABILITIES</h2>
    
    <div class="ability-selector">
      <!-- Passive -->
      <button 
        class="ability-btn" 
        :class="{ active: selectedSpellIndex === -1 }"
        @click="selectSpell(-1)"
      >
        <div class="btn-frame"></div>
        <div class="icon-wrapper">
          <img :src="riotApi.getPassiveImageUrl(passive.image.full)" :alt="passive.name" />
        </div>
        <span class="hotkey">PASSIVE</span>
      </button>

      <!-- Spells QWER -->
      <button 
        v-for="(spell, index) in spells" 
        :key="spell.id"
        class="ability-btn"
        :class="{ active: selectedSpellIndex === index }"
        @click="selectSpell(index)"
      >
        <div class="btn-frame"></div>
        <div class="icon-wrapper">
          <img :src="riotApi.getSpellImageUrl(spell.image.full)" :alt="spell.name" />
        </div>
        <span class="hotkey">{{ ['Q', 'W', 'E', 'R'][index] }}</span>
      </button>
    </div>

    <div class="ability-detail">
      <div class="detail-header">
        <h3 class="ability-name">
          <span class="hotkey-large">{{ currentSpell.hotkey }}</span>
          {{ currentSpell.name }}
        </h3>
      </div>
      
      <div class="detail-body">
        <div class="video-section">
          <div class="video-container" v-if="currentSpell.videoUrl">
            <video 
              :key="currentSpell.videoUrl" 
              :src="currentSpell.videoUrl" 
              autoplay 
              muted 
              loop 
              playsinline
            ></video>
          </div>
        </div>
        
        <div class="info-section">
          <p class="ability-description" v-html="currentSpell.description"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ability-showcase {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: 1rem;
  letter-spacing: 0.3em;
  margin-bottom: var(--spacing-md);
  color: var(--color-accent-gold);
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-title::after {
  content: '';
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, var(--color-accent-gold), transparent);
  opacity: 0.4;
}

.ability-selector {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  justify-content: center;
}

.ability-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-frame {
  position: absolute;
  inset: -4px;
  border: 1px solid var(--color-accent-gold);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.ability-btn.active .btn-frame {
  opacity: 1;
  inset: -6px;
}

.icon-wrapper {
  width: 72px;
  height: 72px;
  border: 2px solid rgba(203, 173, 144, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #000;
}

.ability-btn.active .icon-wrapper {
  border-color: var(--color-accent-gold);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(203, 173, 144, 0.3);
}

.ability-btn:hover:not(.active) .icon-wrapper {
  border-color: rgba(203, 173, 144, 0.5);
  transform: translateY(-4px);
}

.icon-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.ability-btn.active img {
  filter: brightness(1.2) contrast(1.1);
}

.hotkey {
  font-family: var(--font-heading);
  color: var(--color-accent-gold);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.ability-btn.active .hotkey {
  opacity: 1;
  font-weight: bold;
}

.ability-detail {
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.8), rgba(0, 0, 0, 0.9));
  border: 1px solid rgba(203, 173, 144, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 500px;
}

.detail-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid rgba(203, 173, 144, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.ability-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 0;
  font-style: italic;
}

.hotkey-large {
  color: var(--color-accent-gold);
  font-size: 1.25rem;
  border: 1px solid var(--color-accent-gold);
  padding: 2px 8px;
  min-width: 40px;
  display: flex;
  justify-content: center;
  opacity: 0.8;
}

.detail-body {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  flex: 1;
}

.video-section {
  position: relative;
  background: #000;
  border-right: 1px solid rgba(203, 173, 144, 0.1);
}

.video-container {
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Scanline Effect */
.video-section::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%
  ),
  linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.03),
    rgba(0, 255, 0, 0.01),
    rgba(0, 0, 255, 0.03)
  );
  background-size: 100% 3px, 3px 100%;
  pointer-events: none;
}

.info-section {
  padding: var(--spacing-xl) var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ability-description {
  color: var(--color-text-secondary);
  font-size: 1.15rem;
  line-height: 1.8;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 1024px) {
  .detail-body {
    grid-template-columns: 1fr;
  }
  
  .video-section {
    border-right: none;
    border-bottom: 1px solid rgba(203, 173, 144, 0.1);
  }
}

@media (max-width: 768px) {
  .ability-selector {
    gap: var(--spacing-sm);
  }
  
  .icon-wrapper {
    width: 56px;
    height: 56px;
  }
  
  .ability-name {
    font-size: 1.75rem;
  }
}
</style>
