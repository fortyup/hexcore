<script setup>
import { riotApi } from '../services/riotApi';

const props = defineProps({
  championId: {
    type: String,
    required: true
  },
  skins: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['select']);

const handleSkinClick = (skin) => {
  emit('select', skin);
};

</script>

<template>
  <div class="skin-gallery">
    <h2 class="gallery-title">Skins</h2>
    <div class="scroll-container">
      <div 
        v-for="skin in skins" 
        :key="skin.id ?? skin.num"
        class="skin-item"
        tabindex="0"
        role="button"
        @click="handleSkinClick(skin)"
        @keyup.enter.prevent="handleSkinClick(skin)"
      >
        <div class="skin-image">
          <img :src="riotApi.getSkinImageUrl(championId, skin.num)" :alt="skin.name" loading="lazy" />
        </div>
        <div class="skin-info">
          <span class="skin-name">{{ skin.name === 'default' ? 'Base Skin' : skin.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skin-gallery {
  padding: var(--spacing-xl) 0;
}

.gallery-title {
  margin-bottom: var(--spacing-lg);
  font-size: 3rem;
  color: #fff;
}

.scroll-container {
  display: flex;
  overflow-x: auto;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) 0;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--color-accent-blue) rgba(255, 255, 255, 0.1);
}

.scroll-container::-webkit-scrollbar {
  height: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: var(--color-accent-blue);
  border-radius: 4px;
}

.skin-item {
  flex: 0 0 300px;
  scroll-snap-align: start;
  position: relative;
  transition: transform 0.3s ease;
  cursor: pointer;
  outline: none;
}

.skin-item:hover {
  transform: scale(1.02);
}

.skin-item:focus-visible {
  outline: 2px solid var(--color-accent-blue);
  outline-offset: 6px;
}

.skin-image {
  aspect-ratio: 16/9;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: var(--spacing-sm);
}

.skin-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.skin-item:hover .skin-image img {
  transform: scale(1.1);
}

.skin-name {
  font-family: var(--font-heading);
  text-transform: uppercase;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
}

.skin-item:hover .skin-name {
  color: var(--color-accent-blue);
}

/* Lightbox Styles */
.lightbox {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.98);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  backdrop-filter: blur(20px);
}

.lightbox-content {
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  position: relative;
}

.lightbox-image-wrapper {
  position: relative;
  width: 100%;
  max-height: 75vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.9);
  background: #000;
}

.splash-art {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-active .splash-art {
  transform: scale(1.1) blur(10px);
}

.fade-enter-to .splash-art {
  transform: scale(1) blur(0px);
}

.image-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 44, 253, 0.2), transparent);
  animation: scan 4s linear infinite;
  opacity: 0.5;
}

@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%);
}

.image-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 44, 253, 0.2), transparent 70%);
  pointer-events: none;
  z-index: 1;
}

.lightbox-info {
  text-align: center;
  z-index: 5;
}

.info-stagger > * {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-to .info-stagger > * {
  opacity: 1;
  transform: translateY(0);
}

.fade-enter-to .info-stagger h3 { transition-delay: 0.3s; }
.fade-enter-to .info-stagger .lightbox-actions { transition-delay: 0.4s; }

.lightbox-title {
  font-family: 'Compacta Pro', sans-serif;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 900;
  font-style: italic;
  color: #fff;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

/* Enhanced Hexcore Button */
.btn-hexcore {
  background: rgba(0, 44, 253, 0.1);
  border: 1px solid rgba(0, 44, 253, 0.3);
  padding: 1.25rem 4rem;
  overflow: visible;
}

.btn-hexcore .btn-text {
  position: relative;
  z-index: 2;
  letter-spacing: 0.4em;
}

.btn-hexcore .btn-border {
  position: absolute;
  inset: -1px;
  border: 1px solid var(--color-accent-blue);
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px var(--color-accent-blue);
}

.btn-hexcore:hover .btn-border {
  opacity: 1;
  inset: -5px;
}

.btn-hexcore:hover {
  background: rgba(0, 44, 253, 0.2);
  box-shadow: 0 0 40px rgba(0, 44, 253, 0.4);
  transform: scale(1.05);
}

.close-btn {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  cursor: pointer;
  z-index: 10001;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(0, 44, 253, 0.2);
  border-color: var(--color-accent-blue);
  color: #fff;
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 0 30px rgba(0, 44, 253, 0.5);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
