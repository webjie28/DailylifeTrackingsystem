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

<style scoped>
.dash-header {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0 20px;
  border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.15));
  margin-bottom: 28px;
  width: 100%;
}

.dash-header-tracker {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* ── Header Tracker Pill Styles ────────────────────────── */
.header-tracker-pill {
  background: var(--glass-bg, rgba(255, 255, 255, 0.08)) !important;
  backdrop-filter: blur(12px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.15)) !important;
  border-radius: 99px;
  padding: 4px 4px 4px 18px;
  height: 52px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  width: 320px;
  max-width: 100%;
}

.header-tracker-pill.is-active {
  width: 480px;
  border-color: rgba(34, 197, 94, 0.4) !important;
  background: rgba(34, 197, 94, 0.04) !important;
  box-shadow: 0 10px 35px rgba(34, 197, 94, 0.12);
}

.header-tracker-pill:hover {
  background: var(--glass-hover, rgba(255, 255, 255, 0.12)) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

.tracker-left-side {
  display: flex;
  align-items: center;
  flex: 1;
}

.tracker-right-side {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.tracker-clock-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
  opacity: 0.85;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.header-tracker-pill.is-active .tracker-clock-icon {
  color: #22c55e;
  animation: clockPulse 2s infinite alternate;
}

@keyframes clockPulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.15); opacity: 1; }
}

.live-clock-time {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.session-divider {
  margin: 0 10px;
  color: var(--text-muted);
  opacity: 0.5;
}

.session-duration {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.btn-tracker-action {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  border: none;
  outline: none;
  border-radius: 99px;
  height: 44px;
  padding: 0 20px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  color: #ffffff;
  flex-shrink: 0;
}

.btn-play-icon, .btn-stop-icon {
  width: 12px;
  height: 12px;
}

.clock-in-trigger {
  background: var(--accent-purple);
  box-shadow: var(--shadow-sm);
}

.clock-in-trigger:hover {
  transform: translateY(-1px) scale(1.02);
  background: var(--accent-purple-hover);
  box-shadow: var(--shadow-md);
}

.clock-out-trigger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}

.clock-out-trigger:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
}

/* Clocked In state layout styles */
.tracker-info-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 8px;
  flex: 1;
}

.tracker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #64748b;
  position: relative;
  flex-shrink: 0;
}

.tracker-dot.active {
  background: #22c55e;
}

.tracker-dot.active::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 2px solid #22c55e;
  animation: trackerDotPulse 2s infinite ease-out;
  opacity: 0;
}

@keyframes trackerDotPulse {
  0% { transform: scale(0.6); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: scale(1.4); opacity: 0; }
}

.tracker-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.tracker-active-note {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 11px;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--time-text-muted, var(--text-secondary));
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tracker-active-time {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 16px;
  font-weight: 800;
  color: var(--time-text, var(--text-primary));
  line-height: 1.1;
  letter-spacing: -0.01em;
}

@media (max-width: 600px) {
  .header-tracker-pill {
    min-width: 0;
    width: 100%;
  }
  .tracker-note-input {
    width: 140px;
  }
}
</style>
