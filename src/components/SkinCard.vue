<script setup>
import { ref } from 'vue';

const props = defineProps({
  skin: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['select']);

const cardRef = ref(null);
const isVisible = ref(false);

// Entry animation
import { onMounted } from 'vue';
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        isVisible.value = true;
      }, (props.index % 10) * 40);
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  
  if (cardRef.value) {
    observer.observe(cardRef.value);
  } else {
    isVisible.value = true;
  }
});
</script>

<template>
  <div 
    ref="cardRef"
    class="skin-card"
    :class="{ 'is-visible': isVisible }"
    @click="emit('select', skin)"
  >
    <div class="skin-image">
      <img :src="skin.imageUrl" :alt="skin.name" loading="lazy" />
      <div class="skin-overlay"></div>
    </div>
    <div class="skin-info">
      <span class="skin-name">{{ skin.name }}</span>
      <span class="champion-name">{{ skin.championName }}</span>
    </div>
    <div class="shine"></div>
  </div>
</template>

<style scoped>
.skin-card {
  position: relative;
  display: block;
  aspect-ratio: 16/9;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #1a1a1a;
  transition: transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.6s ease, transform 0.6s ease;
  will-change: transform, opacity;
  opacity: 0;
  transform: translateY(20px);
}

.skin-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.skin-card:hover {
  border-color: var(--color-accent-gold);
  box-shadow: 0 15px 35px rgba(203, 173, 144, 0.2);
  z-index: 10;
  cursor: pointer;
}

.skin-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--glow-x, 50%) var(--glow-y, 50%),
    rgba(203, 173, 144, 0.15),
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 3;
}

.skin-card:hover::after {
  opacity: 1;
}

.skin-image {
  position: absolute;
  inset: 0;
}

.skin-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.7) grayscale(30%);
}

.skin-card:hover .skin-image img {
  transform: scale(1.08);
  filter: brightness(1) grayscale(0%);
}

.skin-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 60%);
  z-index: 1;
}

.skin-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-md);
  z-index: 4;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.skin-card:hover .skin-info {
  transform: translateY(-5px);
}

.skin-name {
  display: block;
  font-family: 'Compacta Pro', sans-serif;
  font-size: 1.3rem;
  font-style: italic;
  font-weight: 900;
  color: #fff;
  margin-bottom: 4px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
}

.champion-name {
  font-family: 'Parabolica', sans-serif;
  font-size: 0.75rem;
  color: var(--color-accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.skin-card:hover .champion-name {
  opacity: 1;
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
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.05),
    transparent
  );
  transform: skewX(-25deg);
  pointer-events: none;
  z-index: 5;
}

.skin-card:hover .shine {
  animation: shine-animation 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes shine-animation {
  0% { left: -150%; }
  100% { left: 150%; }
}
</style>
