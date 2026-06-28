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
    store.waterIntakeLog,
    store.waterDailyTarget,
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

app.mount('#app')

