<script setup>
import { computed } from 'vue';

const props = defineProps({
  role: {
    type: String,
    required: true
  }
});

// Mapping roles to their respective SVG paths/colors or symbolic representations
// Using simplified geometric representations of the classic League of Legends role icons
const roleConfig = computed(() => {
  const role = props.role.toLowerCase();
  
  switch (role) {
    case 'assassin':
      return {
        color: '#e74c3c', // Red
        icon: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z'
      };
    case 'fighter':
      return {
        color: '#e67e22', // Orange
        icon: 'M23 5.5V18.5L17.5 23H6.5L1 18.5V5.5L6.5 1H17.5L23 5.5ZM12 4L6 10V14L12 20L18 14V10L12 4Z'
      };
    case 'mage':
      return {
        color: '#9b59b6', // Purple
        icon: 'M12 2L2 12l10 10 10-10L12 2zm0 4l6 6-6 6-6-6 6-6z'
      };
    case 'marksman':
      return {
        color: '#2ecc71', // Green
        icon: 'M21 3L3 10.53v.98l7.58 1.65L12.43 21h.98L21 3z'
      };
    case 'support':
      return {
        color: '#3498db', // Blue
        icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
      };
    case 'tank':
      return {
        color: '#95a5a6', // Grayish
        icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.47 4.07-3.02 7.61-7 8.99V12h-7V6.31l7-3.11v8.8z'
      };
    default:
      return {
        color: '#CBAD90',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
      };
  }
});
</script>

<template>
  <div class="role-icon" :style="{ '--role-color': roleConfig.color }">
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path :d="roleConfig.icon" />
    </svg>
    <div class="glow"></div>
  </div>
</template>

<style scoped>
.role-icon {
  position: relative;
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--role-color);
  transition: all 0.3s ease;
}

.glow {
  position: absolute;
  inset: -4px;
  background: var(--role-color);
  filter: blur(8px);
  opacity: 0.2;
  border-radius: 50%;
  z-index: -1;
}

svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 2px var(--role-color));
}
</style>
