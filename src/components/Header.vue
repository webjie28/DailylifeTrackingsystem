<template>
  <header class="dash-header animate-in">
    <!-- Clock In/Out Tracker Pill (Full Width) -->
    <div class="dash-header-tracker">
      <div class="header-tracker-pill" :class="{ 'is-active': store.isClockedIn }">
        <!-- Left side: Live clock / Working status -->
        <div class="tracker-left-side">
          <svg class="tracker-clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span class="live-clock-time">{{ currentTimeStr }}</span>
          <span v-if="store.isClockedIn" class="session-divider">•</span>
          <span v-if="store.isClockedIn" class="session-duration">Active: {{ activeDurationText }}</span>
        </div>

        <!-- Right side: Clock In / Clock Out button -->
        <div class="tracker-right-side">
          <!-- Clocked Out View -->
          <button v-if="!store.isClockedIn" class="btn-tracker-action clock-in-trigger" @click="handleClockIn">
            <svg class="btn-play-icon" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>
            <span>Clock In</span>
          </button>

          <!-- Clocked In View -->
          <button v-else class="btn-tracker-action clock-out-trigger" @click="handleClockOut">
            <svg class="btn-stop-icon" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            </svg>
            <span>Clock Out</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

const currentTimeStr = ref('')
const activeDurationText = ref('00:00:00')
let liveTimeInterval = null
let activeTimerId = null

function updateLiveTime() {
  const d = new Date()
  currentTimeStr.value = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' })
}

const activeLog = computed(() => {
  return store.workTimeLogs.find(l => l.id === store.activeClockInLogId)
})

function updateActiveDuration() {
  if (!store.isClockedIn || !activeLog.value) {
    activeDurationText.value = '00:00:00'
    return
  }
  const start = new Date(activeLog.value.clockIn)
  const now = new Date()
  const diffMs = now - start
  
  const h = Math.floor(diffMs / 3600000).toString().padStart(2, '0')
  const m = Math.floor((diffMs % 3600000) / 60000).toString().padStart(2, '0')
  const s = Math.floor((diffMs % 60000) / 1000).toString().padStart(2, '0')
  activeDurationText.value = `${h}:${m}:${s}`
}

function handleClockIn() {
  store.clockIn('Working Session')
}

function handleClockOut() {
  store.clockOut()
}

watch(() => store.isClockedIn, (val) => {
  if (val) {
    if (!activeTimerId) {
      activeTimerId = setInterval(updateActiveDuration, 1000)
    }
    updateActiveDuration()
  } else {
    if (activeTimerId) {
      clearInterval(activeTimerId)
      activeTimerId = null
    }
    activeDurationText.value = '00:00:00'
  }
}, { immediate: true })

onMounted(() => {
  updateLiveTime()
  liveTimeInterval = setInterval(updateLiveTime, 1000)
})

onUnmounted(() => {
  if (liveTimeInterval) clearInterval(liveTimeInterval)
  if (activeTimerId) clearInterval(activeTimerId)
})
</script>
