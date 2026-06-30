<template>
  <div class="fitness-view">
    <!-- Header -->
    <div class="finance-header" style="margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 32px; font-weight: 800; color: var(--text-primary); margin: 0;">Fitness</h1>
        <p style="color: var(--text-muted); margin-top: 4px; font-size: 14px;">
          Track your daily walking steps, custom gym routines, and active calorie burn goals
        </p>
      </div>
    </div>

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
      <!-- Left Column: Steps Tracking & Logs -->
      <div class="left-col">
        <!-- Walk Hero with radial ring progress -->
        <div class="walk-hero" style="margin-bottom: 24px;">
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
              <span class="ring-steps">{{ activeDaySteps.toLocaleString() }}</span>
              <span class="ring-goal">of {{ store.fitnessStepGoal.toLocaleString() }}</span>
              <span class="ring-pct">{{ stepGoalPercentage }}%</span>
            </div>
          </div>
          <div class="walk-info">
            <h3>Daily Steps & Activity Backtrack</h3>
            <p>Pick a date to track your active walking steps and view your gym routines for that day.</p>
            
            <div class="form-group" style="margin-bottom: 12px; max-width: 220px;">
              <label>Logging Date</label>
              <input type="date" v-model="backtrackDate" style="padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border-color-strong); background: var(--bg-card); color: var(--text-primary); outline: none; font-size: 13px;" />
            </div>

            <div class="step-input-row" style="display: flex; gap: 8px; align-items: flex-end; width: 100%;">
              <div class="form-group" style="margin-bottom: 0; flex: 1;">
                <label>Steps Logged</label>
                <input 
                  type="number" 
                  v-model.number="stepsInput" 
                  @keyup.enter="saveSteps" 
                  min="0" 
                  placeholder="e.g. 8500" 
                  style="padding: 10px 14px; border-radius: 12px; border: 1px solid var(--border-color-strong); background: var(--bg-input-inset); font-size: 14px; color: var(--text-primary); outline: none; width: 100%;" 
                />
              </div>
              <button 
                type="button" 
                @click="saveSteps" 
                class="btn btn-primary" 
                style="padding: 10px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; height: 42px;"
              >
                Enter
              </button>
            </div>
            <div class="walk-goal-row" style="margin-top: 10px;">
              <span>Goal:</span>
              <input type="number" :value="store.fitnessStepGoal" @change="saveStepGoal" min="1000" step="500" />
              <span>steps</span>
            </div>
          </div>
        </div>

        <!-- 30-Day Steps Trend Chart -->
        <div class="panel">
          <h3>30-Day Steps Count Trend</h3>
          <div class="chart-wrap" style="margin-top: 10px;">
            <canvas ref="stepsChartCanvas"></canvas>
          </div>
        </div>

        <!-- Recent Steps History Logs -->
        <div class="panel">
          <h3>Recent Steps Logs</h3>
          <div class="water-history">
            <div v-if="sortedStepsHistory.length === 0" class="empty-msg">No steps logged yet.</div>
            <div v-else v-for="log in sortedStepsHistory" :key="log.date" class="water-history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-color-subtle); font-size: 14px;">
              <span class="wh-date" style="font-weight: 600;">{{ log.date }}</span>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-weight: 800; color: #22c55e;">{{ log.steps.toLocaleString() }} steps</span>
                <div style="display: flex; gap: 8px;">
                  <button type="button" @click="editStepsLog(log)" style="background: transparent; border: none; cursor: pointer; color: var(--text-muted); font-size: 13px; padding: 2px;" title="Edit Steps">✏️</button>
                  <button type="button" @click="deleteStepsLog(log.date)" style="background: transparent; border: none; cursor: pointer; color: var(--text-muted); font-size: 13px; padding: 2px;" title="Delete Steps">✕</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Gym Workouts, Charts and History -->
      <div class="right-col">
        <!-- Gym Routine Checklist Panel -->
        <div class="panel">
          <div class="panel-header">
            <h3>Gym Workouts &amp; Routines</h3>
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
          <div class="exercise-list" style="margin-top: 16px;">
            <!-- Exercise Add Form -->
            <div style="margin-bottom: 20px; background: var(--bg-subtle); padding: 14px; border-radius: 16px; border: 1px solid var(--border-color);">
              <h4 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: var(--text-primary);">Add Exercise for {{ activeDay }}</h4>
              <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end;">
                <!-- Exercise Name Input with Suggestions -->
                <div style="flex: 1; min-width: 180px; position: relative; display: flex; flex-direction: column; gap: 4px;">
                  <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary);">Exercise Name</label>
                  <input 
                    type="text" 
                    v-model="newExText" 
                    placeholder="e.g. Bench Press" 
                    @focus="showSuggestions = true"
                    @blur="hideSuggestionsWithDelay"
                    @keyup.enter="addCustomExercise"
                    style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color-strong); background: var(--bg-card); color: var(--text-primary); outline: none; font-size: 13px; width: 100%;"
                  />
                  
                  <!-- Suggestions Dropdown -->
                  <div 
                    v-if="showSuggestions && filteredSuggestions.length > 0" 
                    class="suggestions-dropdown"
                    style="top: 100%;"
                  >
                    <div 
                      v-for="sug in filteredSuggestions" 
                      :key="sug" 
                      class="suggestion-item"
                      @mousedown="selectSuggestion(sug)"
                    >
                      {{ sug }}
                    </div>
                  </div>
                </div>

                <!-- Sets Input -->
                <div style="width: 70px; display: flex; flex-direction: column; gap: 4px;">
                  <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary);">Sets</label>
                  <input 
                    type="number" 
                    v-model.number="newExSets" 
                    min="1"
                    @keyup.enter="addCustomExercise"
                    style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color-strong); background: var(--bg-card); color: var(--text-primary); outline: none; font-size: 13px; width: 100%;"
                  />
                </div>

                <!-- Reps Input -->
                <div style="width: 70px; display: flex; flex-direction: column; gap: 4px;">
                  <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary);">Reps</label>
                  <input 
                    type="number" 
                    v-model.number="newExReps" 
                    min="1"
                    @keyup.enter="addCustomExercise"
                    style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color-strong); background: var(--bg-card); color: var(--text-primary); outline: none; font-size: 13px; width: 100%;"
                  />
                </div>

                <button 
                  type="button"
                  @click="addCustomExercise"
                  class="btn btn-primary" 
                  style="padding: 8px 16px; font-size: 12px; height: 35px;"
                >
                  Enter
                </button>
              </div>
            </div>

            <div v-if="!(store.gymRoutines[activeDay] && store.gymRoutines[activeDay].length)" class="empty-msg" style="padding: 20px 0;">
              No exercises added for {{ activeDay }} yet. Use the form above to add your exercises!
            </div>
            
            <div 
              v-else
              v-for="(ex, index) in store.gymRoutines[activeDay]" 
              :key="index" 
              class="exercise-item" 
              :class="{ checked: isExerciseChecked(activeDay, index) }"
              style="display: flex; justify-content: space-between; align-items: center;"
            >
              <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                <input 
                  type="checkbox" 
                  :id="'ex-' + activeDay + '-' + index"
                  :checked="isExerciseChecked(activeDay, index)"
                  @change="toggleExercise(activeDay, index, ex.cals)"
                />
                <label :for="'ex-' + activeDay + '-' + index" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer;">{{ ex.text }}</label>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <button 
                  type="button"
                  @click="deleteCustomExercise(index)"
                  style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; font-size: 12px;"
                  title="Remove Exercise"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Routine completion progress bar -->
            <div v-if="store.gymRoutines[activeDay] && store.gymRoutines[activeDay].length" class="progress-block" style="margin-top: 20px;">
              <div class="progress-row">
                <span>Routine Progress</span>
                <span>{{ routineProgressPercent(activeDay) }}% Completed</span>
              </div>
              <div class="prog-bar">
                <div class="prog-fill" :style="{ width: routineProgressPercent(activeDay) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Manual Workouts Log Form -->
        <div class="panel">
          <h3>Log Gym Session / Manual Activity</h3>
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
              Enter
            </button>
          </form>
        </div>

        <!-- 30-Day Gym Calories Trend Chart -->
        <div class="panel">
          <h3>30-Day Gym Calories Trend</h3>
          <div class="chart-wrap" style="margin-top: 10px;">
            <canvas ref="gymChartCanvas"></canvas>
          </div>
        </div>

        <!-- Recent Gym History Logs -->
        <div class="panel">
          <h3>Recent Workout Logs</h3>
          <div class="water-history">
            <div v-if="sortedGymHistory.length === 0" class="empty-msg">No workout history logged yet.</div>
            <div v-else>
              <div v-for="log in sortedGymHistory" :key="log.date" class="water-history-item" style="align-items: flex-start; flex-direction: column; gap: 4px;">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore, getTodayKey } from '../stores/appStore'
import Chart from 'chart.js/auto'

const store = useAppStore()

// Add exercise inputs
const newExText = ref('')
const newExSets = ref(4)
const newExReps = ref(12)

// Ring SVG calculations
const ringRadius = 58
const ringCircumference = 2 * Math.PI * ringRadius

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

const backtrackDate = ref(getTodayKey())
const stepsInput = ref(0)
const activeDay = ref(DAYS[new Date().getDay()])

// Watch backtrackDate to load activeDay for routines and clear input field
watch(backtrackDate, (newDate) => {
  if (!newDate) return
  const d = new Date(newDate + 'T00:00:00')
  activeDay.value = DAYS[d.getDay()]
  stepsInput.value = null
}, { immediate: true })

// Manual inputs
const manualDate = ref(getTodayKey())
const manualCals = ref('')
const manualWorkout = ref('')
const manualNote = ref('')

const fitnessChartCanvas = ref(null)
let fitnessChartInstance = null

// Custom exercise CRUD
function addCustomExercise() {
  if (!newExText.value.trim()) return
  const sets = parseInt(newExSets.value) || 4
  const reps = parseInt(newExReps.value) || 12
  const fullText = `${newExText.value.trim()} – ${sets}×${reps}`
  
  store.addGymExercise(activeDay.value, {
    text: fullText,
    cals: 0
  })
  newExText.value = ''
  newExSets.value = 4
  newExReps.value = 12
}

function deleteCustomExercise(index) {
  if (confirm('Are you sure you want to remove this exercise?')) {
    store.deleteGymExercise(activeDay.value, index)
  }
}

// Walk computed Ring offset
const activeDaySteps = computed(() => {
  return store.walkTrackerData[backtrackDate.value] || 0
})

const stepGoalPercentage = computed(() => {
  if (store.fitnessStepGoal <= 0) return 0
  return Math.min(100, Math.round((activeDaySteps.value / store.fitnessStepGoal) * 100))
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
  const plan = store.gymRoutines[day] || []
  if (!plan.length) return false
  const checkKey = `${getTodayKey()}_${day}`
  const dayChecks = store.gymCheckedItems[checkKey] || {}
  return plan.every((_, i) => !!dayChecks[i])
}

function routineProgressPercent(day) {
  const plan = store.gymRoutines[day] || []
  if (!plan.length) return 0
  const checkKey = `${getTodayKey()}_${day}`
  const dayChecks = store.gymCheckedItems[checkKey] || {}
  const completed = plan.filter((_, i) => !!dayChecks[i]).length
  return Math.round((completed / plan.length) * 100)
}

// Toggle exercise checkbox state
function toggleExercise(day, index, cals) {
  const checkKey = `${backtrackDate.value}_${day}`
  const currentDayChecks = { ...(store.gymCheckedItems[checkKey] || {}) }
  
  currentDayChecks[index] = !currentDayChecks[index]
  store.setGymCheckedItem(checkKey, currentDayChecks)
}

// Log actions
function saveSteps() {
  if (stepsInput.value === null || stepsInput.value === undefined || stepsInput.value === '') {
    return
  }
  const steps = parseInt(stepsInput.value) || 0
  store.updateSteps(steps, backtrackDate.value)
  stepsInput.value = null
}

function editStepsLog(log) {
  backtrackDate.value = log.date
  setTimeout(() => {
    stepsInput.value = log.steps
  }, 50)
}

function deleteStepsLog(date) {
  if (confirm(`Are you sure you want to delete the steps log for ${date}?`)) {
    store.deleteSteps(date)
    if (backtrackDate.value === date) {
      stepsInput.value = 0
    }
  }
}

const PREDEFINED_WORKOUTS = [
  // Chest Exercises
  'Flat Barbell Bench Press',
  'Incline Dumbbell Bench Press',
  'Decline Barbell Bench Press',
  'Dumbbell Chest Flyes',
  'Cable Crossover',
  'Chest Dips',
  'Push-Ups',
  'Incline Chest Flyes',
  'Decline Dumbbell Bench Press',
  'Pec Deck Flyes',
  
  // Back Exercises
  'Barbell Deadlift',
  'Pull-Ups',
  'Wide-Grip Lat Pulldowns',
  'Bent Over Barbell Rows',
  'Seated Cable Rows',
  'One-Arm Dumbbell Rows',
  'Hyperextensions (Back Extensions)',
  'Face Pulls',
  'Chin-Ups',
  'Close-Grip Lat Pulldowns',
  'T-Bar Rows',
  'Straight-Arm Cable Pulldowns',
  
  // Shoulders Exercises
  'Standing Barbell Overhead Press',
  'Seated Dumbbell Shoulder Press',
  'Dumbbell Lateral Raises',
  'Dumbbell Front Raises',
  'Reverse Dumbbell Flyes (Rear Delt)',
  'Barbell Upright Rows',
  'Arnold Press',
  'Cable Lateral Raises',
  'Dumbbell Shrugs',
  'Barbell Shrugs',
  
  // Legs Exercises
  'Barbell Squats',
  'Leg Press',
  'Romanian Deadlifts (RDL)',
  'Walking Lunges',
  'Lying Leg Curls',
  'Leg Extensions',
  'Standing Calf Raises',
  'Seated Calf Raises',
  'Goblet Squats',
  'Bulgarian Split Squats',
  'Glute Bridges',
  'Hip Thrusts',
  'Sumo Squats',
  
  // Arms (Biceps & Triceps)
  'Barbell Bicep Curls',
  'Dumbbell Hammer Curls',
  'Incline Dumbbell Curls',
  'Preacher Curls',
  'Concentration Curls',
  'Tricep Rope Pushdowns',
  'Cable Overhead Tricep Extensions',
  'Skull Crushers (Lying Tricep Extensions)',
  'Bench Dips',
  'Close-Grip Bench Press',
  'Cable Bicep Curls',
  
  // Abs & Core
  'Abdominal Crunches',
  'Hanging Leg Raises',
  'Plank',
  'Russian Twists',
  'Ab Wheel Rollouts',
  'Decline Crunches',
  'Cable Woodchoppers',
  
  // Cardio & Active Movement
  'Treadmill Run',
  'Outdoor Running / Jogging',
  'Stationary Cycling',
  'Elliptical Trainer',
  'Jump Rope',
  'Rowing Machine',
  'Stretching & Yoga',
  'HIIT Workout'
]

const showSuggestions = ref(false)

const filteredSuggestions = computed(() => {
  const query = newExText.value ? newExText.value.trim().toLowerCase() : ''
  
  // Unique workouts from history
  const historyWorkouts = Object.values(store.gymTrackerData)
    .map(log => log.workout)
    .filter(Boolean)
  
  const allSuggestions = Array.from(new Set([...PREDEFINED_WORKOUTS, ...historyWorkouts]))

  if (!query) {
    return allSuggestions.slice(0, 6)
  }
  
  return allSuggestions
    .filter(item => item.toLowerCase().includes(query))
    .slice(0, 6)
})

function selectSuggestion(suggestion) {
  newExText.value = suggestion
  showSuggestions.value = false
}

function hideSuggestionsWithDelay() {
  setTimeout(() => {
    showSuggestions.value = false
  }, 150)
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

const sortedStepsHistory = computed(() => {
  return Object.entries(store.walkTrackerData)
    .map(([date, steps]) => ({ date, steps }))
    .filter(log => log.steps > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)
})

const sortedGymHistory = computed(() => {
  return Object.entries(store.gymTrackerData)
    .map(([date, data]) => ({ date, ...data }))
    .filter(log => log.calories > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)
})

// Canvas template refs and Chart instances
const stepsChartCanvas = ref(null)
const gymChartCanvas = ref(null)
let stepsChartInstance = null
let gymChartInstance = null

// 30 Days trend charts
function renderCharts() {
  renderStepsChart()
  renderGymChart()
}

function renderStepsChart() {
  if (!stepsChartCanvas.value) return
  if (stepsChartInstance) {
    stepsChartInstance.destroy()
  }

  const ctx = stepsChartCanvas.value.getContext('2d')
  const labels = []
  const stepValues = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`

    labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
    stepValues.push(store.walkTrackerData[key] || 0)
  }

  stepsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Steps Walked',
        data: stepValues,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#22c55e'
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

function renderGymChart() {
  if (!gymChartCanvas.value) return
  if (gymChartInstance) {
    gymChartInstance.destroy()
  }

  const ctx = gymChartCanvas.value.getContext('2d')
  const labels = []
  const gymValues = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`

    labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
    const gCals = store.gymTrackerData[key] ? (parseInt(store.gymTrackerData[key].calories) || 0) : 0
    gymValues.push(gCals)
  }

  gymChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Calories Burned (kcal)',
        data: gymValues,
        backgroundColor: '#7c3aed',
        borderRadius: 4
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
  renderCharts()
})

watch([() => store.walkTrackerData, () => store.gymTrackerData], () => {
  renderCharts()
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

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color-strong);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  z-index: 10;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
}
.suggestion-item {
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}
.suggestion-item:hover {
  background: var(--bg-subtle);
  color: var(--accent-purple);
}
</style>
