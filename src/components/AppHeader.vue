<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    closeMenu();
  }
);

const handleNavClick = () => {
  try {
    localStorage.clear();
  } catch (e) {
    // noop: storage might be unavailable
  }
  closeMenu();
};
</script>

<template>
  <header class="app-header">
    <div class="container header-content">
      <router-link to="/" class="logo" @click="handleNavClick">
        <span class="logo-text">HEXCORE</span>
      </router-link>
      
      <button class="menu-toggle" type="button" :aria-expanded="isMenuOpen" aria-label="Toggle menu" @click="toggleMenu">
        <span class="hamburger" :class="{ active: isMenuOpen }"></span>
      </button>
      
      <nav class="nav-links" :class="{ active: isMenuOpen }">
        <router-link to="/champions" class="nav-item reveal" @click="handleNavClick">Champions</router-link>
        <router-link to="/skins" class="nav-item reveal" style="transition-delay: 0.1s" @click="handleNavClick">Skins</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  text-decoration: none;
}

.logo-text {
  font-family: 'Compacta Pro', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.05em;
  color: #fff;
  transition: color 0.3s ease;
}

.logo:hover .logo-text {
  color: var(--color-accent-blue);
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-item {
  font-family: var(--font-heading);
  text-transform: uppercase;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  position: relative;
  transition: color 0.3s ease;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--color-text-primary);
}

.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-accent-blue);
  box-shadow: 0 0 10px var(--color-accent-blue);
}

.menu-toggle {
  display: none;
  width: 30px;
  height: 30px;
  position: relative;
  z-index: 101;
}

.hamburger {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 2px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -8px;
  left: 0;
}

.hamburger::after {
  top: 8px;
  left: 0;
}

.hamburger.active {
  background-color: transparent;
}

.hamburger.active::before {
  top: 0;
  transform: rotate(45deg);
}

.hamburger.active::after {
  top: 0;
  transform: rotate(-45deg);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 10, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: right 0.5s cubic-bezier(0.83, 0, 0.17, 1);
    z-index: 100;
  }

  .nav-links.active {
    right: 0;
  }

  .nav-item {
    font-size: 2.5rem;
    padding: 1rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
  }

  .nav-links.active .nav-item {
    opacity: 1;
    transform: translateY(0);
  }

  .nav-links.active .nav-item:nth-child(1) { transition-delay: 0.2s; }
  .nav-links.active .nav-item:nth-child(2) { transition-delay: 0.3s; }
}
</style>
