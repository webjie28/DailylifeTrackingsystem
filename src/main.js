import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css' // Import global styling system
import { useAppStore } from './stores/appStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize global store watch for cloud sync with a debounce
const store = useAppStore()
let syncTimeout = null
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000
let inactivityTimer = null
let inactivityListenersAttached = false

function clearInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
    inactivityTimer = null
  }
}

function resetInactivityTimer() {
  if (!store.isAuthenticated || !store.user) return

  clearInactivityTimer()
  inactivityTimer = setTimeout(async () => {
    clearInactivityTimer()
    await store.logoutUser()

    if (router.currentRoute.value.path !== '/login') {
      await router.push('/login')
    }
  }, INACTIVITY_TIMEOUT_MS)
}

function attachInactivityListeners() {
  if (inactivityListenersAttached) return

  const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']
  activityEvents.forEach((eventName) => {
    window.addEventListener(eventName, resetInactivityTimer, { passive: true })
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      resetInactivityTimer()
    }
  })

  inactivityListenersAttached = true
}

function detachInactivityListeners() {
  if (!inactivityListenersAttached) return

  const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']
  activityEvents.forEach((eventName) => {
    window.removeEventListener(eventName, resetInactivityTimer)
  })

  document.removeEventListener('visibilitychange', resetInactivityTimer)
  inactivityListenersAttached = false
}

watch(
  () => [
    store.dailyTasks,
    store.customCategories,
    store.walkTrackerData,
    store.gymTrackerData,
    store.gymCheckedItems,
    store.fitnessStepGoal,
    store.financeTransactions,
    store.savingsContributions,
    store.savingsGoals,
    store.animeWatchlist,
    store.eventsList,
    store.longtermGoalsList,
    store.studyBooksList,
    store.studySessionNotes,
    store.studyTotalTime,
    store.readingBookmarks,
    store.waterIntakeLog,
    store.waterDailyTarget,
    store.dailyCheckins,
    store.workTimeLogs,
    store.isClockedIn,
    store.activeClockInLogId,
    store.dailyStreak,
    store.lastStreakDate
  ],
  () => {
    if (store.isAuthenticated && store.user) {
      if (syncTimeout) clearTimeout(syncTimeout)
      syncTimeout = setTimeout(() => {
        store.syncAllDataToCloud()
      }, 2000) // 2 seconds debounce
    }
  },
  { deep: true }
)

watch(
  () => store.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      attachInactivityListeners()
      resetInactivityTimer()
    } else {
      clearInactivityTimer()
      detachInactivityListeners()
    }
  },
  { immediate: true }
)

app.mount('#app')


import './refresh.css'
import './dashboard.css'
import './learning.css'
import './wellness.css'
import './watchlist.css'
import './money.css'
