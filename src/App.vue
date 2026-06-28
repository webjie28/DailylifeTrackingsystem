<template>
  <div>
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

    <!-- Toggle Menu Button -->
    <button 
      v-if="store.isAuthenticated"
      id="toggleSidebar" 
      class="toggle-sidebar-btn" 
      @click="toggleSidebar"
    >
      ☰ Menu
    </button>

    <div class="app-shell" :class="{ 'no-sidebar': !store.isAuthenticated }">
      <!-- Sidebar container with reactive collapsed class -->
      <div 
        v-if="store.isAuthenticated"
        id="sidebar" 
        class="sidebar-container" 
        :class="{ collapsed: isSidebarCollapsed }"
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Sidebar from './components/Sidebar.vue'
import { useAppStore } from './stores/appStore'

const store = useAppStore()
const isSidebarCollapsed = ref(true)
const showSplash = ref(true)
const isSplashFading = ref(false)

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// Keep html attributes in sync with store state immediately
watch(() => store.theme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
}, { immediate: true })

watch(() => store.timePeriod, (newPeriod) => {
  document.documentElement.setAttribute('data-time', newPeriod)
}, { immediate: true })

onMounted(() => {
  // Splash screen fadeout timer
  setTimeout(() => {
    isSplashFading.value = true
    setTimeout(() => {
      showSplash.value = false
    }, 500)
  }, 2000)
})
</script>

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
  font-size: 52px;
  font-weight: 800 !important;
  letter-spacing: 0.18em;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ea580c 0%, #d97706 100%); /* Sunset portfolio colors */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
