<template>
  <div class="water-view">
    <header class="page-header">
      <div>
        <h1>Water Intake</h1>
        <p class="header-sub">Keep hydrated and track your daily water consumption target</p>
      </div>
    </header>

    <!-- Stats Row -->
    <section class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Today's Intake</div>
        <div class="stat-value">{{ store.todayWaterIntake }} ml</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Daily Goal</div>
        <div class="stat-value" style="color: var(--accent-purple);">{{ store.waterDailyTarget }} ml</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Completion Streak</div>
        <div class="stat-value" style="color: var(--accent-green);">{{ store.waterStreak }} days</div>
      </div>
    </section>

    <div class="content-grid">
      <!-- Left: Bottle filling SVG -->
      <div class="panel glass-display">
        <div class="water-container-svg">
          <svg width="150" height="230" viewBox="0 0 150 230">
            <!-- Cup border and background -->
            <path class="water-cup-bg" d="M 15 20 L 135 20 L 120 210 L 30 210 Z" />
            
            <!-- Cup clipping path to keep water inside -->
            <clipPath id="cupClip">
              <path d="M 15 20 L 135 20 L 120 210 L 30 210 Z" />
            </clipPath>
            
            <!-- Water waves inside clipping path -->
            <g clip-path="url(#cupClip)">
              <!-- Wave 2 (back wave) -->
              <rect x="-50" :y="backWaveY" width="250" height="230" class="water-cup-wave" opacity="0.5" />
              <!-- Wave 1 (front wave) -->
              <rect x="-50" :y="frontWaveY" width="250" height="230" class="water-cup-fill" />
            </g>
          </svg>
          <div class="percentage-overlay">{{ intakePercentage }}%</div>
        </div>

        <div class="quick-log-row">
          <div class="log-btn" @click="store.addWater(250)">
            <span class="log-btn-label">250 ml</span>
          </div>
          <div class="log-btn" @click="store.addWater(500)">
            <span class="log-btn-label">500 ml</span>
          </div>
          <div class="log-btn" @click="store.addWater(750)">
            <span class="log-btn-label">750 ml</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 20px; width: 100%;">
          <button class="btn btn-outline" style="flex: 1;" @click="resetToday">Reset Today</button>
          <button class="btn btn-primary" style="flex: 1;" @click="openCustomLog">Log Custom ml</button>
        </div>
      </div>

      <!-- Right: Target setting & history -->
      <div class="panel">
        <h3>Target Settings</h3>
        <div class="form-group">
          <label>Daily Goal Target (ml)</label>
          <input 
            type="number" 
            :value="store.waterDailyTarget" 
            @change="updateTarget"
            min="500" 
            max="10000" 
            step="250" 
          />
        </div>

        <h3 style="margin-top: 30px;">Recent Daily History</h3>
        <div class="water-history">
          <div v-if="sortedHistory.length === 0" class="empty-msg">No hydration logs yet. Keep drinking!</div>
          <div v-else v-for="log in sortedHistory" :key="log.date" class="water-history-item">
            <span class="water-history-date">{{ log.date }}</span>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="water-history-amount">{{ log.amount }} ml</span>
              <button class="btn-del" @click="deleteLog(log.date)" title="Delete Log" style="background: transparent; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px; padding: 4px; display: flex; align-items: center; justify-content: center; line-height: 1;">✕</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

const intakePercentage = computed(() => {
  if (store.waterDailyTarget <= 0) return 0
  return Math.min(100, Math.round((store.todayWaterIntake / store.waterDailyTarget) * 100))
})

// Total cup height inside path: 190. Wave y position goes from 210 (0% fill) to 20 (100% fill)
const frontWaveY = computed(() => {
  if (intakePercentage.value === 0) return 230
  const fillHeight = Math.round(190 * (intakePercentage.value / 100))
  return 210 - fillHeight
})

const backWaveY = computed(() => {
  if (intakePercentage.value === 0) return 230
  return frontWaveY.value - 4 // slight offset for depth effect
})

const sortedHistory = computed(() => {
  return Object.entries(store.waterIntakeLog)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)
})

function resetToday() {
  if (!confirm("Reset today's water intake to 0 ml?")) return
  store.resetWaterToday()
}

function openCustomLog() {
  const val = prompt('Enter custom amount of water logged in ml:', '330')
  if (val === null) return
  const amount = parseInt(val)
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount.')
    return
  }
  store.addWater(amount)
}

function updateTarget(e) {
  const target = parseInt(e.target.value)
  if (!target || target < 500) {
    alert('Goal target must be at least 500 ml.')
    return
  }
  store.updateWaterTarget(target)
}

function deleteLog(date) {
  if (!confirm(`Are you sure you want to delete the log for ${date}?`)) return
  store.deleteWaterLog(date)
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}
.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}
.btn {
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary {
  background: #3b82f6;
  color: #fff;
}
.btn-primary:hover {
  background: #2563eb;
}
.btn-outline {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color-strong);
}
.btn-outline:hover {
  background: var(--bg-subtle);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 20px 22px;
  box-shadow: var(--shadow-sm);
}
.stat-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #3b82f6;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
}
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
}
.panel h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}
.form-group input {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-input-inset);
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  width: 100%;
  font-family: inherit;
}
.form-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.glass-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}
.water-container-svg {
  position: relative;
  width: 150px;
  height: 250px;
}
.water-cup-bg {
  fill: var(--bg-subtle);
  stroke: var(--border-color-strong);
  stroke-width: 4;
}
.water-cup-fill {
  fill: #3b82f6;
  transition: height 0.6s ease, y 0.6s ease;
}
.water-cup-wave {
  fill: #60a5fa;
  transition: height 0.6s ease, y 0.6s ease;
}

.percentage-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  pointer-events: none;
}

.quick-log-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
  width: 100%;
}
.log-btn {
  background: var(--bg-input-inset);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.log-btn:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
.log-btn-icon {
  font-size: 24px;
}
.log-btn-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.water-history {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
}
.water-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--bg-input-inset);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}
.water-history-date {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}
.water-history-amount {
  font-size: 14px;
  font-weight: 800;
  color: #3b82f6;
}
</style>
