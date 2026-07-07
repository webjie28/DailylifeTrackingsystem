<template>
  <div :class="pageThemeClass">
    <!-- Smooth Animated Fixed Background Glowing Spheres -->
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>

    <!-- Splash Screen Overlay -->
    <div v-if="showSplash" class="splash-screen" :class="{ 'fade-out': isSplashFading }">
      <div class="splash-content">
        <h1 class="splash-title">DLT</h1>
        <p class="splash-subtitle">Daily Life Tracker</p>
        <div class="splash-loader">
          <div class="splash-loader-bar"></div>
        </div>
      </div>
    </div>

    <div class="app-shell" :class="{ 'sidebar-collapsed': store.isSidebarCollapsed, 'no-sidebar': !store.isAuthenticated || route.meta.isGuest }">
      <!-- Sidebar container with reactive collapsed class -->
      <div 
        v-if="store.isAuthenticated && !route.meta.isGuest"
        id="sidebar" 
        class="sidebar-container" 
        :class="{ collapsed: store.isSidebarCollapsed }"
      >
        <Sidebar />
      </div>

      <!-- Main content container -->
      <main class="main-content">
        <div class="container" style="padding-top: 0;">
          <router-view v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <!-- Global Confirmation Modal Dialog -->
    <div class="modal-overlay" v-if="store.confirmDialog.show" @click.self="store.confirmDialog.onCancel" style="z-index: 9999;">
      <div class="modal-content" style="max-width: 420px; padding: 32px; text-align: center; border-radius: 24px; background: var(--bg-card); border: 1px solid var(--border-color); box-shadow: var(--shadow-2xl); animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(239, 68, 68, 0.12); color: #ef4444; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 24px;">
          ⚠️
        </div>
        <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 19px; font-weight: 750; color: var(--text-primary);">
          {{ store.confirmDialog.title }}
        </h3>
        <p style="font-size: 13.5px; color: var(--text-muted); margin: 0 0 24px; line-height: 1.5;">
          {{ store.confirmDialog.message }}
        </p>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-outline" style="flex: 1; padding: 10px;" @click="store.confirmDialog.onCancel">
            {{ store.confirmDialog.cancelText }}
          </button>
          <button class="btn" style="flex: 1; background: #ef4444; color: white; padding: 10px;" @click="store.confirmDialog.onConfirm">
            {{ store.confirmDialog.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import { useAppStore } from './stores/appStore'

const store = useAppStore()
const route = useRoute()
const showSplash = ref(true)
const isSplashFading = ref(false)

const pageThemeClass = computed(() => {
  if (!route.path) return 'page-dashboard'
  if (route.path === '/') return 'page-dashboard'
  const name = route.path.replace('/', '')
  return `page-${name}`
})

// Keep html attributes in sync with store state immediately
watch(() => store.theme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
}, { immediate: true })

onMounted(() => {
  // Apply persisted theme and accent options to DOM root
  document.documentElement.setAttribute('data-theme', store.theme || 'light')
  document.documentElement.setAttribute('data-accent', store.colorAccent || 'orange')

  // Splash screen fadeout timer
  setTimeout(() => {
    isSplashFading.value = true
    setTimeout(() => {
      showSplash.value = false
    }, 600)
  }, 1600)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

body, h1, h2, h3, h4, h5, h6, input, button, select, textarea, p, span, a, label, div {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}
</style>

<style>
/* View transitions for fade-slide premium feel */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Splash Screen Overlay Styling */
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0a0908; /* Match portfolio dark theme primary */
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  opacity: 1;
  visibility: visible;
}

.splash-screen.fade-out {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.splash-content {
  text-align: center;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.splash-title {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 54px;
  font-weight: 900 !important;
  letter-spacing: 0.18em;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #e65c00 0%, #ff7b00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 12px rgba(230, 92, 0, 0.3));
  text-transform: uppercase;
  display: block;
}

.splash-subtitle {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 500 !important;
  color: #a8a29e; /* Stone gray */
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 40px;
}

.splash-loader {
  width: 240px;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.splash-loader-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #ea580c 0%, #d97706 100%);
  border-radius: 999px;
  animation: loadBar 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes loadBar {
  0% { width: 0%; }
  50% { width: 60%; }
  100% { width: 100%; }
}

/* ── Time-Period Gradients (main-content only) ─────────── */
.main-content {
  background: var(--bg-body);
  background-attachment: fixed;
  transition: background 0.8s ease;
  min-height: 100vh;
}

.no-sidebar .main-content {
  margin-left: 0 !important;
  padding: 40px 20px;
}
</style>
