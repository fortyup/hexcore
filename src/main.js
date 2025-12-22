import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { initAnimations } from './utils/animations'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Initialize global animations after mount
router.afterEach(() => {
    // Wait for next tick to ensure DOM is updated
    setTimeout(() => {
        initAnimations();
    }, 100);
});
