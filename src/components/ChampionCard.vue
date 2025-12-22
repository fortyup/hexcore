<script setup>
import { ref, computed, onMounted } from 'vue';
import { riotApi } from '../services/riotApi';

const props = defineProps({
  champion: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
});

const cardRef = ref(null);
const isVisible = ref(false);
const tiltStyle = ref({});

const imageUrl = computed(() => riotApi.getChampionImageUrl(props.champion.id));

// Staggered entrance animation with IntersectionObserver
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        isVisible.value = true;
      }, (props.index % 10) * 50); // 50ms stagger per card in view
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  
  if (cardRef.value?.$el) {
    observer.observe(cardRef.value.$el);
  }
});

// 3D Tilt effect
const handleMouseMove = (e) => {
  if (!cardRef.value) return;
  
  const rect = cardRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 15;
  const rotateY = (centerX - x) / 15;
  
  // Dynamic glow position
  const glowX = (x / rect.width) * 100;
  const glowY = (y / rect.height) * 100;

  tiltStyle.value = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    '--glow-x': `${glowX}%`,
    '--glow-y': `${glowY}%`,
  };
};

const handleMouseLeave = () => {
  tiltStyle.value = {
    transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
    '--glow-x': '50%',
    '--glow-y': '50%',
  };
};
</script>

<template>
  <router-link 
    ref="cardRef"
    :to="{ name: 'champion-detail', params: { id: champion.id } }" 
    class="champion-card"
    :class="{ 'is-visible': isVisible }"
    :style="tiltStyle"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="image-wrapper">
      <img :src="imageUrl" :alt="champion.name" loading="lazy" />
      <div class="overlay"></div>
    </div>
    <div class="content">
      <h3 class="champion-name">{{ champion.name }}</h3>
      <span class="champion-title">{{ champion.title }}</span>
    </div>
    <div class="shine"></div>
  </router-link>
</template>

<style scoped>
.champion-card {
  position: relative;
  display: block;
  overflow: hidden;
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  will-change: transform;
}

.champion-card.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.champion-card:hover {
  border-color: var(--color-accent-gold);
  box-shadow: 0 20px 40px rgba(0, 44, 253, 0.25);
  z-index: 10;
}

/* Mouse-following glow */
.champion-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--glow-x, 50%) var(--glow-y, 50%),
    rgba(0, 44, 253, 0.15),
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 3;
}

.champion-card:hover::after {
  opacity: 1;
}

.image-wrapper {
  position: relative;
  aspect-ratio: 308/560;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: grayscale(80%) contrast(110%) brightness(0.8);
}

.champion-card:hover .image-wrapper img {
  transform: scale(1.12);
  filter: grayscale(0%) contrast(100%) brightness(1);
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
}

.content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: var(--spacing-md);
  z-index: 4;
}

.champion-name {
  font-size: 1.75rem;
  color: #fff;
  margin-bottom: 0;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
  font-style: italic;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.champion-card:hover .champion-name {
  transform: translateY(-5px);
}

.champion-title {
  display: block;
  font-family: var(--font-body);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 5px;
  opacity: 0.7;
  transition: color 0.3s ease, opacity 0.3s ease;
}

.champion-card:hover .champion-title {
  color: var(--color-accent-gold);
  opacity: 1;
}

/* Shine effect on hover */
.shine {
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0.05),
    transparent
  );
  transform: skewX(-25deg);
  transition: none;
  pointer-events: none;
  z-index: 5;
}

.champion-card:hover .shine {
  animation: shine-animation 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes shine-animation {
  0% { left: -150%; }
  100% { left: 150%; }
}
</style>
