<script setup>
import { onMounted } from 'vue';

// Random styles for particles
const getParticleStyle = (n) => {
  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const delay = Math.random() * 20;
  const duration = Math.random() * 20 + 15;
  const opacity = Math.random() * 0.3 + 0.1;
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: opacity,
    background: n % 3 === 0 ? 'var(--color-accent-blue)' : n % 3 === 1 ? 'var(--color-accent-gold)' : '#fff'
  };
};
</script>

<template>
  <div class="landing-page">
    <div class="landing-hero">
      <div class="video-bg">
        <div class="animated-bg"></div>
        <div class="particles">
          <div class="particle" v-for="n in 30" :key="n" :style="getParticleStyle(n)"></div>
        </div>
        <div class="overlay"></div>
      </div>

      <div class="content">
        <h1 class="brand-name reveal">HEXCORE</h1>
        <p class="tagline reveal" style="transition-delay: 0.1s">The Ultimate League of Legends Explorer</p>
        
        <div class="nav-cards reveal" style="transition-delay: 0.2s">
          <router-link to="/champions" class="nav-card">
            <span class="card-title">CHAMPIONS</span>
            <span class="card-desc">Master the Roster</span>
            <div class="card-bg" style="background-image: url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_0.jpg')"></div>
          </router-link>
          
          <router-link to="/skins" class="nav-card">
            <span class="card-title">SKINS</span>
            <span class="card-desc">Visual Archive</span>
            <div class="card-bg" style="background-image: url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_6.jpg')"></div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landing-page::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(to bottom, transparent 0%, var(--color-bg) 100%);
  z-index: 3;
  pointer-events: none;
}

.video-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

.animated-bg {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(0, 44, 253, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(203, 173, 144, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(0, 44, 253, 0.2) 0%, transparent 40%),
    linear-gradient(180deg, #000 0%, #0a0a0a 50%, #050505 100%);
  animation: pulse-bg 15s ease-in-out infinite;
}

@keyframes pulse-bg {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-5%, -5%) scale(1.1);
    opacity: 0.8;
  }
}

.overlay {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 60%),
    linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, var(--color-bg) 100%);
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

.brand-name {
  font-family: 'Compacta Pro', sans-serif;
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.02em;
  background: linear-gradient(180deg, #fff 0%, #888 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  text-transform: uppercase;
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
  line-height: 1.1;
  padding: 0 20px; /* Prevent italic clipping */
  width: 100%;
}

.tagline {
  font-family: 'Parabolica', sans-serif;
  font-size: 1.5rem;
  color: var(--color-accent-gold);
  margin-bottom: 60px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(20px, 5vw, 30px);
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.nav-card {
  position: relative;
  height: clamp(250px, 60vw, 300px);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  transition: all 0.5s ease;
  z-index: -1;
  filter: grayscale(80%);
}

.nav-card:hover .card-bg {
  opacity: 0.6;
  transform: scale(1.1);
  filter: grayscale(0%);
}

.nav-card:hover {
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 30px rgba(0, 44, 253, 0.3);
}

.card-title {
  font-family: 'Compacta Pro', sans-serif;
  font-size: clamp(1.5rem, 6vw, 3rem);
  color: #fff;
  font-style: italic;
  font-weight: 900;
  z-index: 2;
  text-transform: uppercase;
  padding: 0 10px;
  text-align: center;
}

.card-desc {
  font-family: 'Parabolica', sans-serif;
  color: #ccc;
  z-index: 2;
  font-size: clamp(0.7rem, 2.5vw, 0.9rem);
  letter-spacing: 0.1em;
  margin-top: 10px;
  text-transform: uppercase;
  padding: 0 10px;
  text-align: center;
}

/* Floating Particles */
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.particle {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  animation: float-up linear infinite;
  pointer-events: none;
  filter: blur(1px);
}

@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-cards {
    grid-template-columns: 1fr;
    gap: clamp(15px, 4vw, 25px);
    padding: 0 var(--spacing-sm);
  }

  .particles {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-card {
    height: clamp(200px, 50vw, 280px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .card-title {
    font-size: clamp(1.2rem, 5vw, 2rem);
  }

  .card-desc {
    font-size: clamp(0.6rem, 2vw, 0.75rem);
  }
}

</style>