<template>
  <div class="fitness-view">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-item">
        <div class="banner-label">Total Burned (Today)</div>
        <div class="banner-value">{{ store.todayTotalCaloriesBurned }}</div>
        <div class="banner-sub">kcal</div>
      </div>
      <div class="banner-divider"></div>
      <div class="banner-item">
        <div class="banner-label">Gym Workout</div>
        <div class="banner-value">{{ store.todayWorkoutCalories }}</div>
        <div class="banner-sub">kcal</div>
      </div>
      <div class="banner-divider"></div>
      <div class="banner-item">
        <div class="banner-label">Active Walk</div>
        <div class="banner-value">{{ store.todayWalkCalories }}</div>
        <div class="banner-sub">kcal</div>
      </div>
      <div class="banner-divider"></div>
      <div class="banner-item">
        <div class="banner-label">Steps Walked</div>
        <div class="banner-value">{{ store.todaySteps.toLocaleString() }}</div>
        <div class="banner-sub">today</div>
      </div>
    </div>

    <!-- Stats Row -->
    <section class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Workout Streak</div>
        <div class="stat-value purple">{{ store.fitnessStreak }} days</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Gym Sessions</div>
        <div class="stat-value orange">{{ gymSessionsCount }} logs</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Steps (Month)</div>
        <div class="stat-value green">{{ monthlyTotalSteps.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Days (Month)</div>
        <div class="stat-value">{{ activeDaysCount }} days</div>
      </div>
    </section>

    <!-- Content Grid -->
    <div class="two-col">
      <!-- Left Column: Steps Circular Progress and Workout Routines -->
      <div class="left-col">
        <!-- Walk Hero with radial ring progress -->
        <div class="walk-hero">
          <div class="step-ring-wrap">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" class="ring-bg" />
              <circle 
                cx="70" 
                cy="70" 
                r="58" 
                class="ring-fill" 
                :stroke-dasharray="ringCircumference"
                :stroke-dashoffset="ringDashoffset"
              />
            </svg>
            <div class="ring-label">
              <span class="ring-steps">{{ store.todaySteps.toLocaleString() }}</span>
              <span class="ring-goal">of {{ store.fitnessStepGoal.toLocaleString() }}</span>
              <span class="ring-pct">{{ stepGoalPercentage }}%</span>
            </div>
          </div>
          <div class="walk-info">
            <h3>Daily Steps Logging</h3>
            <p>Every step counts. Log your steps below to track your movement and active walking calories.</p>
            <div class="step-input-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Steps Today</label>
                <input type="number" v-model.number="stepsInput" @change="saveSteps" min="0" placeholder="e.g. 8500" />
              </div>
            </div>
            <div class="walk-goal-row">
              <span>Goal:</span>
              <input type="number" :value="store.fitnessStepGoal" @change="saveStepGoal" min="1000" step="500" />
              <span>steps</span>
            </div>
          </div>
        </div>

        <!-- Gym Routine Checklist Panel -->
        <div class="panel">
          <div class="panel-header">
            <h3>Gym Workouts &amp; Routines</h3>
            <span class="cal-pill" style="font-size: 13px;">Auto-calculated from checks</span>
          </div>

          <!-- Day Selector tabs -->
          <div class="day-tabs">
            <button 
              v-for="day in DAYS" 
              :key="day" 
              class="day-tab" 
              :class="{ 
                active: activeDay === day,
                completed: isDayCompleted(day)
              }"
              @click="activeDay = day"
            >
              {{ day }}
            </button>
          </div>

          <!-- Exercises list for active day -->
          <div v-if="PLAN[activeDay]" class="exercise-list">
            <div 
              v-for="(ex, index) in PLAN[activeDay]" 
              :key="index" 
              class="exercise-item" 
              :class="{ checked: isExerciseChecked(activeDay, index) }"
            >
              <input 
                type="checkbox" 
                :id="'ex-' + activeDay + '-' + index"
                :checked="isExerciseChecked(activeDay, index)"
                @change="toggleExercise(activeDay, index, ex.cals)"
              />
              <label :for="'ex-' + activeDay + '-' + index">{{ ex.text }}</label>
              <span class="cal-pill">+{{ ex.cals }} kcal</span>
            </div>

            <!-- Routine completion progress bar -->
            <div class="progress-block">
              <div class="progress-row">
                <span>Routine Progress</span>
                <span>{{ routineProgressPercent(activeDay) }}% Completed</span>
              </div>
              <div class="prog-bar">
                <div class="prog-fill" :style="{ width: routineProgressPercent(activeDay) + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Rest Day display -->
          <div v-else class="rest-card">
            <span class="rest-icon">🛋️</span>
            <p>Today is scheduled as a Rest Day.</p>
            <p style="font-size: 13px; font-weight: normal; margin-top: 4px;">Make sure to stretch or do light active walking!</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Manual Logs, Charts and History -->
      <div class="right-col">
        <!-- Manual Workouts Log Form -->
        <div class="panel">
          <h3>💪 Log Gym Session / Manual Activity</h3>
          <form @submit.prevent="logManualGym" class="manual-log-form">
            <div class="two-input">
              <div class="form-group">
                <label>Date</label>
                <input type="date" v-model="manualDate" required />
              </div>
              <div class="form-group">
                <label>Calories Burned</label>
                <input type="number" v-model.number="manualCals" min="0" required placeholder="e.g. 350" />
              </div>
            </div>
            <div class="form-group">
              <label>Description / Workout Type</label>
              <input type="text" v-model="manualWorkout" placeholder="e.g. Back & Biceps, Jogging" required />
            </div>
            <div class="form-group">
              <label>Optional Note</label>
              <input type="text" v-model="manualNote" placeholder="e.g. Felt strong today, increased lat pulldowns" />
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
              Save Workout Log
            </button>
          </form>
        </div>

        <!-- 30-Day Trend Chart -->
        <div class="panel">
          <h3>📊 30-Day Calorie Progress (Walk + Gym)</h3>
          <div class="chart-wrap" style="margin-top: 10px;">
            <canvas ref="fitnessChartCanvas"></canvas>
          </div>
        </div>

        <!-- Recent Gym History Logs -->
        <div class="panel">
          <h3>📋 Recent Workout Logs</h3>
          <div class="water-history">
            <div v-if="sortedGymHistory.length === 0" class="empty-msg">No workout history logged yet.</div>
            <div v-else v-for="log in sortedGymHistory" :key="log.date" class="water-history-item" style="align-items: flex-start; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                <span class="wh-date">{{ log.date }} <span style="font-size: 11px; font-weight: normal; color: var(--text-muted);">({{ log.workout }})</span></span>
                <span class="wh-cals" style="font-weight: 800; color: #f97316;">{{ log.calories }} kcal</span>
              </div>
              <p v-if="log.note" style="font-size: 12px; margin: 0; color: var(--text-secondary);">
                Note: {{ log.note }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore, getTodayKey } from '../stores/appStore'
import Chart from 'chart.js/auto'

const store = useAppStore()

// Ring SVG calculations
const ringRadius = 58
const ringCircumference = 2 * Math.PI * ringRadius

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

const PLAN = {
  MONDAY: [
    { text: 'Machine Incline Press – 4×6-10', cals: 40 },
    { text: 'Machine Chest Press – 3×8-12', cals: 35 },
    { text: 'Machine Shoulder Press – 2×8-12', cals: 30 },
    { text: 'Cable Lateral Raise – 3×15-20', cals: 20 },
    { text: 'Machine Lateral Raise – 5×12-20', cals: 20 },
    { text: 'Cable / Rope Pushdown – 3×12', cals: 25 },
    { text: 'Overhead Tricep Extension – 3×12', cals: 25 },
    { text: 'Incline Walk – 20 mins', cals: 100 },
  ],
  TUESDAY: [
    { text: 'Assisted Pull-Up Machine – 4×6-10', cals: 40 },
    { text: 'Lat Pulldown Machine – 4×8-12', cals: 35 },
    { text: 'Single Arm Lat Pulldown – 3×10-12', cals: 35 },
    { text: 'Chest Supported Row Machine – 3×8-12', cals: 35 },
    { text: 'Straight Arm Pulldown – 3×15', cals: 25 },
    { text: 'Rear Delt Fly – 3×15', cals: 20 },
    { text: 'Machine Preacher Curl – 3×10-12', cals: 25 },
    { text: 'Incline Walk – 15 mins', cals: 90 },
  ],
  WEDNESDAY: [
    { text: 'Leg Press – 4×6-8', cals: 45 },
    { text: 'Romanian Deadlift – 3×10', cals: 45 },
    { text: 'Walking Lunges – 3×12 each', cals: 40 },
    { text: 'Leg Curl Machine – 3×10-15', cals: 30 },
    { text: 'Leg Extension Machine – 3×12-15', cals: 30 },
    { text: 'Standing Calf Raise – 4×12-20', cals: 20 },
    { text: 'Plank – 3×1 min', cals: 20 },
    { text: 'Leg Raises – 3×12', cals: 20 },
  ],
  THURSDAY: [
    { text: '10k steps', cals: 120 },
    { text: 'Stretching', cals: 30 },
    { text: 'Dead hang – 3× max', cals: 20 },
    { text: '15 min HIIT (bike / jog intervals)', cals: 180 },
  ],
  FRIDAY: [
    { text: 'Machine Lateral Raise – 5×12-20', cals: 20 },
    { text: 'Cable Lateral Raise – 3×15-20', cals: 20 },
    { text: 'Single Arm Lat Pulldown – 4×10-12', cals: 35 },
    { text: 'Lat Pulldown Machine – 3×10-12', cals: 35 },
    { text: 'Chest Supported Row Machine – 3×10-12', cals: 35 },
    { text: 'Rear Delt Machine – 4×15-20', cals: 20 },
    { text: 'Machine Incline Press – 3×10-12', cals: 35 },
    { text: 'DB Curl – 3×12', cals: 25 },
    { text: '20 min incline walk', cals: 100 },
  ],
  SATURDAY: [
    { text: 'Leg Press – 3×15', cals: 40 },
    { text: 'RDL – 3×12', cals: 40 },
    { text: 'Leg Curl – 3×15', cals: 30 },
    { text: 'Leg Extension – 3×15', cals: 30 },
    { text: "Farmer's Walk – 3 rounds", cals: 35 },
    { text: 'Incline Walk – 30 min', cals: 130 },
  ],
  SUNDAY: null
}

const stepsInput = ref(store.todaySteps)
const activeDay = ref(DAYS[new Date().getDay()])

// Manual inputs
const manualDate = ref(getTodayKey())
const manualCals = ref('')
const manualWorkout = ref('')
const manualNote = ref('')

const fitnessChartCanvas = ref(null)
let fitnessChartInstance = null

// Walk computed Ring offset
const stepGoalPercentage = computed(() => {
  if (store.fitnessStepGoal <= 0) return 0
  return Math.min(100, Math.round((store.todaySteps / store.fitnessStepGoal) * 100))
})

const ringDashoffset = computed(() => {
  const percent = stepGoalPercentage.value
  return ringCircumference - (percent / 100) * ringCircumference
})

// Streak metrics
const monthlyTotalSteps = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  return Object.entries(store.walkTrackerData)
    .filter(([date]) => {
      const d = new Date(date + 'T00:00:00')
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((sum, [, steps]) => sum + steps, 0)
})

const gymSessionsCount = computed(() => {
  return Object.values(store.gymTrackerData).filter(v => v && v.calories > 0).length
})

const activeDaysCount = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const dates = new Set([
    ...Object.keys(store.gymTrackerData).filter(k => store.gymTrackerData[k] && store.gymTrackerData[k].calories > 0),
    ...Object.keys(store.walkTrackerData).filter(k => store.walkTrackerData[k] > 0)
  ])
  return Array.from(dates).filter(date => {
    const d = new Date(date + 'T00:00:00')
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  }).length
})

// Day completion helpers
function isExerciseChecked(day, index) {
  const checkKey = `${getTodayKey()}_${day}`
  const dayChecks = store.gymCheckedItems[checkKey] || {}
  return !!dayChecks[index]
}

function isDayCompleted(day) {
  const plan = PLAN[day]
  if (!plan) return false
  const checkKey = `${getTodayKey()}_${day}`
  const dayChecks = store.gymCheckedItems[checkKey] || {}
  return plan.every((_, i) => !!dayChecks[i])
}

function routineProgressPercent(day) {
  const plan = PLAN[day]
  if (!plan) return 0
  const checkKey = `${getTodayKey()}_${day}`
  const dayChecks = store.gymCheckedItems[checkKey] || {}
  const completed = plan.filter((_, i) => !!dayChecks[i]).length
  return Math.round((completed / plan.length) * 100)
}

// Check/uncheck routines
function toggleExercise(day, index, cals) {
  const checkKey = `${getTodayKey()}_${day}`
  const currentDayChecks = { ...(store.gymCheckedItems[checkKey] || {}) }
  
  // Toggle status
  currentDayChecks[index] = !currentDayChecks[index]
  store.setGymCheckedItem(checkKey, currentDayChecks)

  // Auto update workout calories if editing activeDay routine for TODAY
  const todayDayName = DAYS[new Date().getDay()]
  if (day === todayDayName) {
    const plan = PLAN[todayDayName]
    const updatedChecks = store.gymCheckedItems[checkKey] || {}
    const autoCals = plan.reduce((s, ex, i) => s + (updatedChecks[i] ? ex.cals : 0), 0)
    
    // Merge with existing manual calories
    const tk = getTodayKey()
    const existing = store.gymTrackerData[tk] || {}
    
    store.updateGymWorkout(
      autoCals + (existing.manualCals || 0),
      existing.workout || `${todayDayName} Routine`,
      existing.duration || 3600
    )
    
    // Keep internal values
    const freshGym = { ...(store.gymTrackerData) }
    freshGym[tk] = {
      workout: existing.workout || `${todayDayName} Routine`,
      duration: existing.duration || 3600,
      autoCheckCals: autoCals,
      manualCals: existing.manualCals || 0,
      calories: autoCals + (existing.manualCals || 0),
      note: existing.note || ''
    }
    localStorage.setItem('gymTrackerData', JSON.stringify(freshGym))
    store.gymTrackerData = freshGym
  }
}

// Log actions
function saveSteps() {
  const steps = parseInt(stepsInput.value) || 0
  store.updateSteps(steps)
}

function saveStepGoal(e) {
  const goal = parseInt(e.target.value) || 10000
  store.updateStepGoal(goal)
}

function logManualGym() {
  const cals = parseInt(manualCals.value) || 0
  const date = manualDate.value
  const desc = manualWorkout.value
  const note = manualNote.value

  const existing = store.gymTrackerData[date] || { autoCheckCals: 0 }
  const total = (existing.autoCheckCals || 0) + cals

  // Direct state modify and save
  const updatedGym = { ...(store.gymTrackerData) }
  updatedGym[date] = {
    workout: desc,
    duration: 3600,
    autoCheckCals: existing.autoCheckCals || 0,
    manualCals: cals,
    calories: total,
    note: note
  }
  localStorage.setItem('gymTrackerData', JSON.stringify(updatedGym))
  store.gymTrackerData = updatedGym

  // Reset fields
  manualCals.value = ''
  manualWorkout.value = ''
  manualNote.value = ''
}

const sortedGymHistory = computed(() => {
  return Object.entries(store.gymTrackerData)
    .map(([date, data]) => ({ date, ...data }))
    .filter(log => log.calories > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)
})

// 30 Days trend chart
function renderChart() {
  if (!fitnessChartCanvas.value) return
  if (fitnessChartInstance) {
    fitnessChartInstance.destroy()
  }

  const ctx = fitnessChartCanvas.value.getContext('2d')
  const labels = []
  const totals = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`

    const wCals = Math.round((store.walkTrackerData[key] || 0) * 0.04)
    const gCals = store.gymTrackerData[key] ? (parseInt(store.gymTrackerData[key].calories) || 0) : 0
    
    labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
    totals.push(wCals + gCals)
  }

  fitnessChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Calories Burned (kcal)',
        data: totals,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#7c3aed'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)' } }
      }
    }
  })
}

onMounted(() => {
  renderChart()
})

watch([() => store.walkTrackerData, () => store.gymTrackerData], () => {
  renderChart()
  stepsInput.value = store.todaySteps
}, { deep: true })
</script>

<style scoped>
/* Page & Grid setups */
.page-header { margin-bottom: 28px; }
.banner {
  background: linear-gradient(135deg, #7c3aed 0%, #22c55e 100%);
  border-radius: 24px;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
  box-shadow: 0 12px 32px rgba(124,58,237,0.18);
}
.banner-item { text-align: center; }
.banner-label { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
.banner-value { font-size: 32px; font-weight: 800; color: #fff; line-height: 1; }
.banner-sub { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 4px; }
.banner-divider { width: 1px; height: 60px; background: rgba(255,255,255,0.25); }

@media (max-width: 700px) {
  .banner-divider { display: none; }
  .banner-item { flex: 1 1 120px; }
}

.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 28px; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 18px 20px; box-shadow: var(--shadow-sm); }
.stat-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
.stat-value { font-size: 24px; font-weight: 800; color: var(--text-primary); }
.stat-value.green { color: #16a34a; }
.stat-value.purple { color: #7c3aed; }
.stat-value.orange { color: #f97316; }

.panel { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; box-shadow: var(--shadow-md); margin-bottom: 24px; }
.panel h3 { font-size: 18px; font-weight: 700; color: var(--text-heading); margin: 0 0 15px; }

.two-col { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
@media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

.day-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
.day-tab { padding: 7px 14px; border-radius: 10px; border: 1.5px solid var(--border-color); background: var(--bg-subtle); font-size: 12px; font-weight: 700; cursor: pointer; color: var(--text-secondary); transition: all 0.2s; }
.day-tab.active { background: #7c3aed; color: #fff; border-color: #7c3aed; }
.day-tab.completed { border-color: #22c55e; color: #16a34a; background: var(--accent-green-light); }
.day-tab.active.completed { background: #22c55e; border-color: #22c55e; color: #fff; }

.exercise-list { display: flex; flex-direction: column; gap: 8px; max-height: 460px; overflow-y: auto; }
.exercise-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: 14px; transition: background 0.2s, border-color 0.2s; }
.exercise-item.checked { background: var(--accent-green-light); border-color: rgba(34,197,94,0.3); }
.exercise-item input[type="checkbox"] { width: 18px; height: 18px; accent-color: #22c55e; cursor: pointer; }
.exercise-item label { flex: 1; font-size: 14px; color: var(--text-primary); cursor: pointer; line-height: 1.4; }
.exercise-item.checked label { text-decoration: line-through; color: var(--text-muted); }
.cal-pill { font-size: 11px; font-weight: 700; color: #f97316; background: rgba(249,115,22,0.1); padding: 3px 9px; border-radius: 999px; }

.progress-block { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border-color); }
.progress-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600; }
.prog-bar { height: 10px; background: var(--bg-subtle); border-radius: 999px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #7c3aed, #22c55e); transition: width 0.4s ease; }

.rest-card { text-align: center; padding: 48px 20px; color: var(--text-secondary); }
.rest-icon { font-size: 52px; display: block; margin-bottom: 14px; }

.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.form-group input, .form-group select { padding: 10px 14px; border-radius: 12px; border: 1px solid var(--border-color-strong); background: var(--bg-input-inset); font-size: 14px; color: var(--text-primary); outline: none; width: 100%; }
.form-group input:focus { border-color: #7c3aed; }
.two-input { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.chart-wrap { height: 240px; position: relative; }

.walk-hero {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.step-ring-wrap { flex-shrink: 0; position: relative; width: 140px; height: 140px; }
.step-ring-wrap svg { transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: var(--border-color); stroke-width: 12; }
.ring-fill { fill: none; stroke: #22c55e; stroke-width: 12; stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
.ring-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.ring-steps { font-size: 22px; font-weight: 800; color: var(--text-primary); line-height: 1; }
.ring-goal { font-size: 11px; color: var(--text-secondary); font-weight: 600; margin-top: 4px; }
.ring-pct { font-size: 13px; font-weight: 800; color: #16a34a; margin-top: 2px; }

.walk-info { flex: 1; min-width: 200px; }
.walk-info h3 { font-size: 20px; font-weight: 800; color: var(--text-primary); margin: 0 0 6px; }
.walk-info p { color: var(--text-secondary); font-size: 14px; margin: 0 0 16px; }

.step-input-row { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
.step-input-row input { width: 160px; }
.walk-goal-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-secondary); margin-top: 10px; font-weight: 600; }
.walk-goal-row input { width: 110px; padding: 6px 10px; border-radius: 10px; border: 1px solid var(--border-color-strong); background: var(--bg-input-inset); font-size: 13px; color: var(--text-primary); }

.water-history { display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto; }
.water-history-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: 12px; }
.empty-msg { text-align: center; padding: 32px 20px; color: var(--text-muted); font-size: 14px; }

.btn { padding: 10px 18px; border-radius: 12px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-primary { background: #7c3aed; color: #fff; }
.btn-primary:hover { background: #5b21b6; }
.btn-outline { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color-strong); }
</style>
