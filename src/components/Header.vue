<template>
  <header class="dash-header animate-in">
    <div class="dash-header-left">
      <span class="dash-day-label">{{ dayLabel }}</span>
      <span class="dash-date-main">{{ dateLabel }}</span>
    </div>
    <div class="dash-header-right">
      <span class="dash-clock">{{ clockLabel }}</span>
      <span class="dash-period-badge">
        <span class="dash-period-dot"></span>
        <span>{{ periodLabel }}</span>
      </span>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/appStore'

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

const clockLabel = computed(() => {
  let h = time.value.getHours()
  const m = time.value.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
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

onMounted(() => {
  updateTime()
  timerId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<style scoped>
.dash-header {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 40px 0 28px;
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
  color: var(--time-accent, var(--accent-purple));
}
.dash-date-main {
  font-family: 'Playfair Display', Georgia, serif !important;
  font-style: italic;
  font-size: 38px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--time-text, var(--text-primary));
  line-height: 1.15;
}
.dash-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
.dash-clock {
  font-family: 'Playfair Display', Georgia, serif !important;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--time-accent, var(--accent-purple));
  line-height: 1.15;
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
  background: var(--badge-dot, var(--accent-purple));
  animation: pulseDot 2s ease-in-out infinite;
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}
@media (max-width: 600px) {
  .dash-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 28px 0 20px;
    margin-bottom: 24px;
  }
  .dash-header-right { align-items: flex-start; }
  .dash-date-main { font-size: 28px; }
  .dash-clock { font-size: 26px; }
}
</style>

