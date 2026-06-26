<template>
  <header class="dash-header animate-in">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

@media (max-width: 600px) {
  .dash-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 28px 0 20px;
    margin-bottom: 24px;
  }
  .dash-header-right {
    align-items: flex-start;
  }
  .date-char-flip {
    font-size: 28px;
  }
}
</style>


