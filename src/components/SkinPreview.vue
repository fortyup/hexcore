<script setup>
import { computed, watch, onUnmounted } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  skin: {
    type: Object,
    default: null
  },
  champion: {
    type: Object,
    default: null
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

const isVisible = computed(() => props.open && Boolean(props.skin));
const computedImageUrl = computed(() => props.imageUrl || props.skin?.imageUrl || '');
const skinLabel = computed(() => {
  if (!props.skin) return '';
  return props.skin.name === 'default' ? 'Base Skin' : props.skin.name;
});
const championName = computed(() => props.champion?.name || props.skin?.championName || '');
const championTitle = computed(() => props.champion?.title || '');
const championTags = computed(() => props.champion?.tags || []);
const tagsDisplay = computed(() => championTags.value.length ? championTags.value.join(' / ') : '');
const skinNumber = computed(() => props.skin?.num ?? null);

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

watch(
  () => isVisible.value,
  (open) => {
    if (open) {
      window.addEventListener('keydown', handleKeydown);
    } else {
      window.removeEventListener('keydown', handleKeydown);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <transition name="preview-fade">
    <div
      v-if="isVisible"
      class="skin-preview-overlay"
      @click.self="emit('close')"
    >
      <div class="skin-preview-card">
        <button
          class="preview-close-btn"
          type="button"
          aria-label="Close skin preview"
          @click.stop="emit('close')"
        >
          ×
        </button>
        <div class="preview-image-wrapper">
          <img
            :src="computedImageUrl"
            :alt="skinLabel"
            class="preview-image"
            loading="lazy"
          />
          <div class="preview-scanline"></div>
        </div>
        <div class="preview-copy">
          <span class="preview-skin-label">{{ championName }}</span>
          <h3 class="preview-champion-name">{{ skinLabel }}</h3>
          <div class="preview-actions">
            <button class="preview-action-btn" type="button" @click="emit('close')">
              Close preview
            </button>
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.skin-preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.94);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 2vw, 3rem);
}

.skin-preview-card {
  width: min(1100px, 100%);
  max-height: 90vh;
  background: linear-gradient(180deg, rgba(8, 8, 10, 0.96), rgba(1, 1, 1, 0.92));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: relative;
  box-shadow: 0 50px 120px rgba(0, 0, 0, 0.9);
}

.preview-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.preview-close-btn:hover {
  border-color: var(--color-accent-blue);
  transform: rotate(90deg) scale(1.05);
}

.preview-image-wrapper {
  position: relative;
  width: 100%;
  background: #000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  flex: 1;
  min-height: 360px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(1.05);
  transition: transform 1s ease;
}

.skin-preview-card:hover .preview-image {
  transform: scale(1.03);
}

.preview-scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 70%);
  pointer-events: none;
  animation: scanline 4s linear infinite;
  opacity: 0.6;
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.preview-copy {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.preview-skin-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5em;
  color: var(--color-accent-gold);
  opacity: 0.9;
}

.preview-champion-name {
  font-size: clamp(2.5rem, 4vw, 4rem);
  font-family: var(--font-heading);
  margin: 0;
}

.preview-champion-title {
  margin: 0;
  color: #ccc;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.preview-meta {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.meta-separator {
  opacity: 0.4;
}

.preview-actions {
  margin-top: var(--spacing-sm);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: start;
}

.preview-action-btn {
  padding: 0.9rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-family: var(--font-heading);
  cursor: pointer;
  border-radius: 999px;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

.preview-action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-accent-blue);
  transform: translateY(-1px);
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.25s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}
</style>
