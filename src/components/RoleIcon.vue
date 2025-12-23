<script setup>
import { computed } from 'vue';
import assassinIcon from '../assets/role-icons/assassin.png?url';
import fighterIcon from '../assets/role-icons/fighter.png?url';
import mageIcon from '../assets/role-icons/mage.png?url';
import marksmanIcon from '../assets/role-icons/marksman.png?url';
import supportIcon from '../assets/role-icons/support.png?url';
import tankIcon from '../assets/role-icons/tank.png?url';
import defaultIcon from '../assets/role-icons/default.png?url';

const props = defineProps({
  role: {
    type: String,
    required: true
  }
});

const roleAssets = {
  assassin: { color: '#f35d52', icon: assassinIcon },
  fighter: { color: '#e67e22', icon: fighterIcon },
  mage: { color: '#8459ff', icon: mageIcon },
  marksman: { color: '#20c77b', icon: marksmanIcon },
  support: { color: '#43a7ff', icon: supportIcon },
  tank: { color: '#94a5b0', icon: tankIcon },
  default: { color: '#CBAD90', icon: defaultIcon }
};

const normalizedRole = computed(() => props.role?.toLowerCase?.() ?? '');
const roleConfig = computed(() => roleAssets[normalizedRole.value] ?? roleAssets.default);
const accessibleRole = computed(() => props.role ?? 'role');
</script>

<template>
  <div
    class="role-icon"
    :style="{ '--role-color': roleConfig.color }"
    :aria-label="accessibleRole"
  >
    <img :src="roleConfig.icon" :alt="accessibleRole" loading="lazy" />
    <div class="glow"></div>
  </div>
</template>

<style scoped>
.role-icon {
  position: relative;
  width: 1.4rem;
  height: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--role-color);
  transition: all 0.3s ease;
}

.role-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.35));
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
</style>
