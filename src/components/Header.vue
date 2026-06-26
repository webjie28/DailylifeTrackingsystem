<template>
  <header class="dash-header animate-in">
    <!-- Day & Date (Left) -->
    <div class="dash-header-left">
      <span class="dash-day-label">{{ dayLabel }}</span>
      <div class="dash-date-main-wrapper">
        <span 
          v-for="(char, index) in dateLabelArray" 
          :key="index"
          class="date-char-flip"
          :style="{ 'animation-delay': (index * 0.02) + 's' }"
        >
          <span v-if="char === ' '">&nbsp;</span>
          <span v-else>{{ char }}</span>
        </span>
      </div>
    </div>

    <!-- Clock In/Out Tracker Pill (Center) -->
    <div class="dash-header-center">
      <div class="header-tracker-pill">
        <!-- Clocked Out View -->
        <div v-if="!store.isClockedIn" class="tracker-inner-out">
          <div class="tracker-input-wrapper">
            <svg class="tracker-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <input 
              type="text" 
              v-model="workNoteInput" 
              class="tracker-note-input" 
              placeholder="What are you working on?" 
              @keyup.enter="handleClockIn"
            />
          </div>
          <button class="btn-tracker-action clock-in-trigger" @click="handleClockIn">
            <svg class="btn-play-icon" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>
            <span>Clock In</span>
          </button>
        </div>

        <!-- Clocked In View -->
        <div v-else class="tracker-inner-in">
          <div class="tracker-info-wrapper">
            <span class="tracker-dot active"></span>
            <div class="tracker-meta">
              <span class="tracker-active-note">{{ activeLog && activeLog.note ? activeLog.note : 'Working Session' }}</span>
              <span class="tracker-active-time">{{ activeDurationText }}</span>
            </div>
          </div>
          <button class="btn-tracker-action clock-out-trigger" @click="handleClockOut">
            <svg class="btn-stop-icon" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            </svg>
            <span>Clock Out</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Flip Clock (Right) -->
    <div class="dash-header-right">
      <div class="dash-clock-flip-container">
        <FlipDigit :value="hTens" />
        <FlipDigit :value="hOnes" />
        <span class="clock-colon">:</span>
        <FlipDigit :value="mTens" />
        <FlipDigit :value="mOnes" />
        <span class="clock-ampm">{{ ampmLabel }}</span>
      </div>
      <span class="dash-period-badge">
        <span class="dash-period-dot"></span>
        <span>{{ periodLabel }}</span>
      </span>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import FlipDigit from './FlipDigit.vue'

const store = useAppStore()

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const PERIOD_LABELS = {
  night: 'Late Night',
  dawn: 'Dawn',
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
}

const time = ref(new Date())
let timerId = null

const dayLabel = computed(() => DAYS[time.value.getDay()].toUpperCase())
const dateLabel = computed(() => `${MONTHS[time.value.getMonth()]} ${time.value.getDate()}, ${time.value.getFullYear()}`)

const dateLabelArray = computed(() => {
  return dateLabel.value.split('')
})

// Parsed digits for the flip clock
const hTens = computed(() => {
  let h = time.value.getHours()
  h = h % 12 || 12
  return Math.floor(h / 10).toString()
})
const hOnes = computed(() => {
  let h = time.value.getHours()
  h = h % 12 || 12
  return (h % 10).toString()
})
const mTens = computed(() => {
  return Math.floor(time.value.getMinutes() / 10).toString()
})
const mOnes = computed(() => {
  return (time.value.getMinutes() % 10).toString()
})
const ampmLabel = computed(() => {
  return time.value.getHours() >= 12 ? 'PM' : 'AM'
})

const periodLabel = computed(() => {
  const period = getTimePeriod(time.value.getHours())
  return PERIOD_LABELS[period]
})

function getTimePeriod(h) {
  if (h < 5) return 'night'
  if (h < 8) return 'dawn'
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  if (h < 21) return 'evening'
  return 'night'
}

function updateTime() {
  time.value = new Date()
  const period = getTimePeriod(time.value.getHours())
  if (store.timePeriod !== period) {
    store.updateTimePeriod(period)
  }
}

// Time Tracker states and ticking logic
const workNoteInput = ref('')
const activeDurationText = ref('00:00:00')
let activeTimerId = null

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
  store.clockIn(workNoteInput.value)
  workNoteInput.value = ''
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
  updateTime()
  timerId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
  if (activeTimerId) clearInterval(activeTimerId)
})
</script>

<style scoped>
.dash-header {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0 24px;
  border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.15));
  margin-bottom: 32px;
  width: 100%;
}
.dash-header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.dash-day-label {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--time-accent, var(--accent-orange));
}

/* Date character animation */
.dash-date-main-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-top: 4px;
}
.date-char-flip {
  display: inline-block;
  font-family: 'Playfair Display', Georgia, serif !important;
  font-style: italic;
  font-size: 38px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--time-text, var(--text-primary));
  line-height: 1.15;
  transform-origin: top center;
  transform: rotateX(-90deg);
  opacity: 0;
  animation: dateFlipIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes dateFlipIn {
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

/* ── Header Tracker Pill Styles ────────────────────────── */
.dash-header-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

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
  transition: all 0.3s ease;
}

.header-tracker-pill:hover,
.header-tracker-pill:focus-within {
  background: var(--glass-hover, rgba(255, 255, 255, 0.12)) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.08);
}

.tracker-inner-out, .tracker-inner-in {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.tracker-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.tracker-input-icon {
  width: 16px;
  height: 16px;
  color: var(--time-accent, var(--accent-orange));
  opacity: 0.85;
}

.tracker-note-input {
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 500;
  color: var(--time-text, var(--text-primary));
  width: 220px;
  padding: 0;
  transition: width 0.3s ease;
}

.tracker-note-input::placeholder {
  color: var(--time-text-muted, var(--text-secondary));
  opacity: 0.6;
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
}

.btn-play-icon, .btn-stop-icon {
  width: 12px;
  height: 12px;
}

.clock-in-trigger {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.clock-in-trigger:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.4);
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
}

.tracker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #64748b;
  position: relative;
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
  max-width: 160px;
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

.dash-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* Flip clock layout styling */
.dash-clock-flip-container {
  display: flex;
  gap: 4px;
  align-items: center;
  user-select: none;
}
.clock-colon {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 32px;
  font-weight: 800;
  color: var(--time-accent, var(--accent-orange));
  margin: 0 2px;
  animation: blink 1s step-start infinite;
  align-self: center;
  line-height: 1;
}
@keyframes blink {
  50% { opacity: 0.2; }
}
.clock-ampm {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--time-accent, var(--accent-orange));
  margin-left: 6px;
  align-self: flex-end;
  padding-bottom: 4px;
  letter-spacing: 0.05em;
}

.dash-period-badge {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 999px;
  background: var(--badge-bg, rgba(255,255,255,0.15));
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--badge-text, var(--text-secondary));
}
.dash-period-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--badge-dot, var(--accent-orange));
  animation: pulseDot 2s ease-in-out infinite;
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

@media (max-width: 950px) {
  .dash-header {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
    padding: 32px 0 20px;
    margin-bottom: 24px;
  }
  .dash-header-left {
    align-items: center;
  }
  .dash-header-right {
    align-items: center;
    order: 2;
  }
  .dash-header-center {
    order: 1;
    width: 100%;
    justify-content: center;
  }
}
@media (max-width: 600px) {
  .date-char-flip {
    font-size: 28px;
  }
}
</style>


