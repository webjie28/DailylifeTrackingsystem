<template>
  <div class="fitness-view">
    <!-- Header -->
    <div class="fit-header">
      <div>
        <h1>Fitness Center</h1>
        <p class="fit-subtitle">Track your daily walking steps, custom gym routines, and active calorie burn goals</p>
      </div>
    </div>

    <!-- Metric Cards with Circular Progress Rings -->
    <div class="metrics-grid animate-in delay-100">
      <!-- Total Burned -->
      <div class="metric-card">
        <div class="metric-left">
          <div class="metric-label">Total Burned</div>
          <div class="metric-value">{{ store.todayTotalCaloriesBurned }}</div>
          <div class="metric-unit">kcal today</div>
        </div>
        <div class="metric-right">
          <div class="mini-ring-wrap" style="--ring-color: #6366f1;">
            <svg viewBox="0 0 36 36" class="mini-ring-svg">
              <circle class="ring-bg" cx="18" cy="18" r="15.915" fill="none" stroke-width="3"></circle>
              <circle class="ring-fill" cx="18" cy="18" r="15.915" fill="none" stroke-dasharray="100" :stroke-dashoffset="100 - Math.min(100, totalBurnedPercent)" stroke-width="3"></circle>
            </svg>
            <div class="mini-ring-icon-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Gym Workout -->
      <div class="metric-card">
        <div class="metric-left">
          <div class="metric-label">Gym Workout</div>
          <div class="metric-value">{{ store.todayWorkoutCalories }}</div>
          <div class="metric-unit">kcal burned</div>
        </div>
        <div class="metric-right">
          <div class="mini-ring-wrap" style="--ring-color: #f97316;">
            <svg viewBox="0 0 36 36" class="mini-ring-svg">
              <circle class="ring-bg" cx="18" cy="18" r="15.915" fill="none" stroke-width="3"></circle>
              <circle class="ring-fill" cx="18" cy="18" r="15.915" fill="none" stroke-dasharray="100" :stroke-dashoffset="100 - Math.min(100, gymPercent)" stroke-width="3"></circle>
            </svg>
            <div class="mini-ring-icon-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v8H2z"/><line x1="6" y1="8" x2="6" y2="16"/><line x1="10" y1="8" x2="10" y2="16"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Walk -->
      <div class="metric-card">
        <div class="metric-left">
          <div class="metric-label">Active Walk</div>
          <div class="metric-value">{{ store.todayWalkCalories }}</div>
          <div class="metric-unit">kcal walking</div>
        </div>
        <div class="metric-right">
          <div class="mini-ring-wrap" style="--ring-color: #22c55e;">
            <svg viewBox="0 0 36 36" class="mini-ring-svg">
              <circle class="ring-bg" cx="18" cy="18" r="15.915" fill="none" stroke-width="3"></circle>
              <circle class="ring-fill" cx="18" cy="18" r="15.915" fill="none" stroke-dasharray="100" :stroke-dashoffset="100 - Math.min(100, walkPercent)" stroke-width="3"></circle>
            </svg>
            <div class="mini-ring-icon-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Steps Walked -->
      <div class="metric-card">
        <div class="metric-left">
          <div class="metric-label">Steps Walked</div>
          <div class="metric-value">{{ store.todaySteps.toLocaleString() }}</div>
          <div class="metric-unit">today</div>
        </div>
        <div class="metric-right">
          <div class="mini-ring-wrap" style="--ring-color: #3b82f6;">
            <svg viewBox="0 0 36 36" class="mini-ring-svg">
              <circle class="ring-bg" cx="18" cy="18" r="15.915" fill="none" stroke-width="3"></circle>
              <circle class="ring-fill" cx="18" cy="18" r="15.915" fill="none" stroke-dasharray="100" :stroke-dashoffset="100 - Math.min(100, stepGoalPercentage)" stroke-width="3"></circle>
            </svg>
            <div class="mini-ring-icon-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Three-Column Layout -->
    <div class="three-col animate-in delay-200">
      <!-- Col 1: Log Daily Activity -->
      <div class="panel">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Log Daily Activity
        </h3>
        <div class="step-ring-mini-wrap">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" class="ring-bg-lg" />
            <circle cx="50" cy="50" r="42" class="ring-fill-lg" :stroke-dasharray="ringCircumferenceSm" :stroke-dashoffset="ringDashoffsetSm" />
          </svg>
          <div class="ring-label-sm">
            <span class="ring-steps-sm">{{ activeDaySteps.toLocaleString() }}</span>
            <span class="ring-pct-sm">{{ stepGoalPercentage }}%</span>
          </div>
        </div>

        <div class="form-group">
          <label>Logging Date</label>
          <input type="date" v-model="backtrackDate" />
        </div>
        <div class="form-group">
          <label>Steps Logged</label>
          <div class="input-with-btn">
            <input type="number" v-model.number="stepsInput" @keyup.enter="saveSteps" min="0" placeholder="e.g. 8500" />
            <button type="button" @click="saveSteps" class="btn btn-primary btn-sm">Enter</button>
          </div>
        </div>
        <div class="goal-row">
          <span>Daily Goal:</span>
          <input type="number" :value="store.fitnessStepGoal" @change="saveStepGoal" min="1000" step="500" />
          <span>steps</span>
        </div>
      </div>

      <!-- Col 2: Weekly Routines -->
      <div class="panel">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Weekly Routines
        </h3>
        <!-- Day Selector tabs -->
        <div class="day-tabs">
          <button v-for="day in DAYS" :key="day" class="day-tab" :class="{ active: activeDay === day, completed: isDayCompleted(day) }" @click="activeDay = day">
            {{ day.slice(0, 3) }}
          </button>
        </div>

        <!-- Exercises list -->
        <div class="exercise-list">
          <div v-if="!(store.gymRoutines[activeDay] && store.gymRoutines[activeDay].length)" class="empty-msg-sm">
            No exercises for {{ activeDay }}
          </div>
          <div v-else v-for="(ex, index) in store.gymRoutines[activeDay]" :key="index" class="exercise-item" :class="{ checked: isExerciseChecked(activeDay, index) }">
            <input type="checkbox" :id="'ex-' + activeDay + '-' + index" :checked="isExerciseChecked(activeDay, index)" @change="toggleExercise(activeDay, index, ex.cals)" />
            <label :for="'ex-' + activeDay + '-' + index">{{ ex.text }}</label>
            <button type="button" @click="deleteCustomExercise(index)" class="btn-icon-del" title="Remove">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Routine progress -->
        <div v-if="store.gymRoutines[activeDay] && store.gymRoutines[activeDay].length" class="progress-block">
          <div class="progress-row">
            <span>Progress</span>
            <span>{{ routineProgressPercent(activeDay) }}%</span>
          </div>
          <div class="prog-bar">
            <div class="prog-fill" :style="{ width: routineProgressPercent(activeDay) + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Col 3: Quick Log Workout -->
      <div class="panel">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Quick Log Workout
        </h3>
        <!-- Exercise Add Form -->
        <div class="form-group" style="position: relative;">
          <label>Exercise Name</label>
          <input type="text" v-model="newExText" placeholder="e.g. Bench Press" @focus="showSuggestions = true" @blur="hideSuggestionsWithDelay" @keyup.enter="addCustomExercise" />
          <!-- Suggestions -->
          <div v-if="showSuggestions && filteredSuggestions.length > 0" class="suggestions-dropdown">
            <div v-for="sug in filteredSuggestions" :key="sug" class="suggestion-item" @mousedown="selectSuggestion(sug)">{{ sug }}</div>
          </div>
        </div>
        <div class="two-input">
          <div class="form-group">
            <label>Sets</label>
            <input type="number" v-model.number="newExSets" min="1" @keyup.enter="addCustomExercise" />
          </div>
          <div class="form-group">
            <label>Reps</label>
            <input type="number" v-model.number="newExReps" min="1" @keyup.enter="addCustomExercise" />
          </div>
        </div>
        <button type="button" @click="addCustomExercise" class="btn btn-primary" style="width: 100%;">
          Add to {{ activeDay }}
        </button>

        <div class="divider"></div>

        <!-- Manual Gym Session Log -->
        <h4 class="sub-heading">Log Gym Session</h4>
        <form @submit.prevent="logManualGym">
          <div class="two-input">
            <div class="form-group">
              <label>Date</label>
              <input type="date" v-model="manualDate" required />
            </div>
            <div class="form-group">
              <label>Calories</label>
              <input type="number" v-model.number="manualCals" min="0" required placeholder="350" />
            </div>
          </div>
          <div class="form-group">
            <label>Workout Type</label>
            <input type="text" v-model="manualWorkout" placeholder="e.g. Back & Biceps" required />
          </div>
          <div class="form-group">
            <label>Note (Optional)</label>
            <input type="text" v-model="manualNote" placeholder="e.g. Felt strong today" />
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Enter</button>
        </form>
      </div>
    </div>

    <!-- Footer: Recent Logs & Gym Summary -->
    <div class="footer-row animate-in delay-400">
      <!-- Recent Step Logs -->
      <div class="panel">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Recent Step Logs
        </h3>
        <div class="log-list">
          <div v-if="sortedStepsHistory.length === 0" class="empty-msg-sm">No steps logged yet.</div>
          <div v-else v-for="log in sortedStepsHistory" :key="log.date" class="log-item">
            <span class="log-date">{{ log.date }}</span>
            <div class="log-actions">
              <span class="log-value green">{{ log.steps.toLocaleString() }} steps</span>
              <button type="button" @click="editStepsLog(log)" class="btn-icon" title="Edit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button type="button" @click="deleteStepsLog(log.date)" class="btn-icon btn-icon-danger" title="Delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Gym Summary -->
      <div class="panel">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          Gym Summary
        </h3>
        <div class="summary-stats-mini">
          <div class="summary-stat">
            <span class="ss-label">Workout Streak</span>
            <span class="ss-value purple">{{ store.fitnessStreak }} days</span>
          </div>
          <div class="summary-stat">
            <span class="ss-label">Gym Sessions</span>
            <span class="ss-value orange">{{ gymSessionsCount }} logs</span>
          </div>
          <div class="summary-stat">
            <span class="ss-label">Monthly Steps</span>
            <span class="ss-value green">{{ monthlyTotalSteps.toLocaleString() }}</span>
          </div>
          <div class="summary-stat">
            <span class="ss-label">Active Days</span>
            <span class="ss-value blue">{{ activeDaysCount }} days</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Recent Workout Logs -->
        <h4 class="sub-heading">Recent Workout Logs</h4>
        <div class="log-list">
          <div v-if="sortedGymHistory.length === 0" class="empty-msg-sm">No workout history yet.</div>
          <div v-else v-for="log in sortedGymHistory" :key="log.date" class="log-item log-item-col">
            <div class="log-item-top">
              <span class="log-date">{{ log.date }} <span class="log-tag">{{ log.workout }}</span></span>
              <div class="log-actions">
                <span class="log-value orange">{{ log.calories }} kcal</span>
                <button type="button" @click="editGymLog(log)" class="btn-icon" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button type="button" @click="deleteGymLog(log.date)" class="btn-icon btn-icon-danger" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <p v-if="log.note" class="log-note">{{ log.note }}</p>
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

// Ring SVG calculations (large ring in walk hero)
const ringRadius = 58
const ringCircumference = 2 * Math.PI * ringRadius

// Small ring for Log Daily Activity panel
const ringRadiusSm = 42
const ringCircumferenceSm = 2 * Math.PI * ringRadiusSm

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

const ringDashoffsetSm = computed(() => {
  const percent = stepGoalPercentage.value
  return ringCircumferenceSm - (percent / 100) * ringCircumferenceSm
})

// Metric card percentages
const totalBurnedPercent = computed(() => {
  // Goal: 500 kcal per day
  return Math.min(100, Math.round((store.todayTotalCaloriesBurned / 500) * 100))
})
const gymPercent = computed(() => {
  return Math.min(100, Math.round((store.todayWorkoutCalories / 300) * 100))
})
const walkPercent = computed(() => {
  return Math.min(100, Math.round((store.todayWalkCalories / 200) * 100))
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

function editGymLog(log) {
  manualDate.value = log.date
  manualCals.value = log.calories
  manualWorkout.value = log.workout
  manualNote.value = log.note || ''
}

function deleteGymLog(date) {
  if (confirm(`Are you sure you want to delete the workout log for ${date}?`)) {
    store.deleteGymWorkout(date)
    if (manualDate.value === date) {
      manualCals.value = ''
      manualWorkout.value = ''
      manualNote.value = ''
    }
  }
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
</script>

<style scoped>
/* ── Page Header ───────────────────────────────────────── */
.fit-header {
  margin-bottom: 28px;
}
.fit-header h1 {
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}
.fit-subtitle {
  font-family: 'Inter', sans-serif;
  color: var(--text-muted);
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
}

/* ── Animations ────────────────────────────────────────── */
.animate-in { opacity: 0; animation: fadeInUp 0.5s ease forwards; }
.delay-100 { animation-delay: 0.08s; }
.delay-200 { animation-delay: 0.16s; }
.delay-300 { animation-delay: 0.24s; }
.delay-400 { animation-delay: 0.32s; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* ── Metric Cards ──────────────────────────────────────── */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}
@media (max-width: 1100px) { .metrics-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .metrics-grid { grid-template-columns: 1fr; } }

.metric-card {
  font-family: 'Inter', sans-serif;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--glass-bg, rgba(255,255,255,0.15));
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border, rgba(255,255,255,0.2));
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}
.metric-left { display: flex; flex-direction: column; gap: 4px; }
.metric-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.05em; color: var(--time-text-muted, var(--text-secondary)); opacity: 0.8;
}
.metric-value {
  font-size: 28px; font-weight: 800; line-height: 1.2;
  color: var(--time-text, var(--text-primary));
}
.metric-unit {
  font-size: 12px; font-weight: 600; color: var(--text-muted); opacity: 0.7;
}

/* ── Mini Rings ────────────────────────────────────────── */
.mini-ring-wrap { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
.mini-ring-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
.mini-ring-svg .ring-bg { stroke: var(--border-color-strong, rgba(0,0,0,0.08)); opacity: 0.3; }
.mini-ring-svg .ring-fill { stroke: var(--ring-color, #6366f1); stroke-linecap: round; transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
.mini-ring-icon-center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--time-text, var(--text-primary)); opacity: 0.7; }

/* ── Three-Column Layout ───────────────────────────────── */
.three-col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
}
@media (max-width: 1100px) { .three-col { grid-template-columns: 1fr 1fr; } }
@media (max-width: 700px) { .three-col { grid-template-columns: 1fr; } }

/* ── Panels ────────────────────────────────────────────── */
.panel {
  font-family: 'Inter', sans-serif;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow-md);
}
.panel h3 {
  font-family: 'Inter', sans-serif;
  font-size: 16px; font-weight: 700; color: var(--text-heading);
  margin: 0 0 18px; display: flex; align-items: center;
}
.panel-icon { margin-right: 8px; opacity: 0.5; flex-shrink: 0; }
.sub-heading {
  font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 700; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 14px;
}
.divider { height: 1px; background: var(--border-color); margin: 20px 0; }

/* ── Step Ring in Panel ────────────────────────────────── */
.step-ring-mini-wrap { position: relative; width: 100px; height: 100px; margin: 0 auto 18px; }
.step-ring-mini-wrap svg { transform: rotate(-90deg); }
.ring-bg-lg { fill: none; stroke: var(--border-color-strong); stroke-width: 8; opacity: 0.2; }
.ring-fill-lg { fill: none; stroke: #6366f1; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
.ring-label-sm { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ring-steps-sm { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 800; color: var(--text-primary); }
.ring-pct-sm { font-size: 12px; font-weight: 700; color: #6366f1; }

/* ── Forms ─────────────────────────────────────────────── */
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.form-group label { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.form-group input, .form-group select {
  font-family: 'Inter', sans-serif; padding: 10px 14px; border-radius: 12px;
  border: 1px solid var(--border-color-strong); background: var(--bg-input-inset);
  font-size: 14px; color: var(--text-primary); outline: none; width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12); }
.two-input { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.input-with-btn { display: flex; gap: 8px; }
.input-with-btn input { flex: 1; }
.goal-row {
  display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif;
  font-size: 13px; color: var(--text-secondary); font-weight: 600; margin-top: 4px;
}
.goal-row input { width: 90px; padding: 6px 10px; border-radius: 10px; border: 1px solid var(--border-color-strong); background: var(--bg-input-inset); font-size: 13px; color: var(--text-primary); }

/* ── Day Tabs ──────────────────────────────────────────── */
.day-tabs { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 16px; }
.day-tab {
  font-family: 'Inter', sans-serif; padding: 6px 10px; border-radius: 10px;
  border: 1.5px solid var(--border-color); background: var(--bg-subtle);
  font-size: 11px; font-weight: 700; cursor: pointer; color: var(--text-secondary);
  transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.02em;
}
.day-tab.active { background: #6366f1; color: #fff; border-color: #6366f1; }
.day-tab.completed { border-color: #22c55e; color: #16a34a; background: var(--accent-green-light); }
.day-tab.active.completed { background: #22c55e; border-color: #22c55e; color: #fff; }

/* ── Exercise List ─────────────────────────────────────── */
.exercise-list { display: flex; flex-direction: column; gap: 6px; max-height: 300px; overflow-y: auto; }
.exercise-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: 12px;
  transition: background 0.2s, border-color 0.2s;
}
.exercise-item.checked { background: var(--accent-green-light); border-color: rgba(34,197,94,0.3); }
.exercise-item input[type="checkbox"] { width: 16px; height: 16px; accent-color: #6366f1; cursor: pointer; flex-shrink: 0; }
.exercise-item label { flex: 1; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text-primary); cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.exercise-item.checked label { text-decoration: line-through; color: var(--text-muted); }
.btn-icon-del { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; transition: color 0.2s; flex-shrink: 0; }
.btn-icon-del:hover { color: #ef4444; }

/* ── Progress Bar ──────────────────────────────────────── */
.progress-block { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border-color); }
.progress-row { display: flex; justify-content: space-between; font-family: 'Inter', sans-serif; font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600; }
.prog-bar { height: 8px; background: var(--bg-subtle); border-radius: 999px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #6366f1, #22c55e); transition: width 0.4s ease; }

/* ── Charts ────────────────────────────────────────────── */
.charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
@media (max-width: 900px) { .charts-row { grid-template-columns: 1fr; } }
.chart-panel { margin-bottom: 0; }
.chart-wrap { height: 240px; position: relative; }

/* ── Footer Row ────────────────────────────────────────── */
.footer-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
@media (max-width: 900px) { .footer-row { grid-template-columns: 1fr; } }

/* ── Log Lists ─────────────────────────────────────────── */
.log-list { display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; }
.log-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; background: var(--bg-subtle); border: 1px solid var(--border-color);
  border-radius: 12px; transition: background 0.2s;
}
.log-item:hover { background: var(--bg-hover); }
.log-item-col { flex-direction: column; align-items: stretch; gap: 4px; }
.log-item-top { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.log-date { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-primary); }
.log-tag { font-size: 11px; font-weight: 500; color: var(--text-muted); }
.log-actions { display: flex; align-items: center; gap: 8px; }
.log-value { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800; }
.log-value.green { color: #22c55e; }
.log-value.orange { color: #f97316; }
.log-note { font-family: 'Inter', sans-serif; font-size: 12px; margin: 0; color: var(--text-secondary); }

/* ── Icon Buttons ──────────────────────────────────────── */
.btn-icon {
  background: transparent; border: 1px solid var(--border-color); color: var(--text-muted);
  cursor: pointer; padding: 4px 6px; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center;
}
.btn-icon:hover { border-color: #6366f1; color: #6366f1; background: rgba(99, 102, 241, 0.08); }
.btn-icon-danger:hover { border-color: rgba(239, 68, 68, 0.3); color: #ef4444; background: rgba(239, 68, 68, 0.08); }

/* ── Gym Summary ───────────────────────────────────────── */
.summary-stats-mini { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.summary-stat {
  display: flex; flex-direction: column; gap: 4px; padding: 12px; border-radius: 12px;
  background: var(--bg-subtle); border: 1px solid var(--border-color);
}
.ss-label { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
.ss-value { font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 800; color: var(--text-primary); }
.ss-value.purple { color: #6366f1; }
.ss-value.orange { color: #f97316; }
.ss-value.green { color: #22c55e; }
.ss-value.blue { color: #3b82f6; }

/* ── Buttons ───────────────────────────────────────────── */
.btn {
  font-family: 'Inter', sans-serif; padding: 10px 18px; border-radius: 12px;
  border: none; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn-sm { padding: 8px 14px; font-size: 13px; }
.btn-primary { background: #6366f1; color: #fff; }
.btn-primary:hover { background: #4f46e5; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
.empty-msg-sm { font-family: 'Inter', sans-serif; text-align: center; padding: 24px 12px; color: var(--text-muted); font-size: 13px; }

/* ── Suggestions ───────────────────────────────────────── */
.suggestions-dropdown {
  position: absolute; left: 0; right: 0; background: var(--bg-card);
  border: 1px solid var(--border-color-strong); border-radius: 12px;
  box-shadow: var(--shadow-lg); z-index: 10; margin-top: 4px; max-height: 200px; overflow-y: auto;
}
.suggestion-item {
  font-family: 'Inter', sans-serif; padding: 10px 14px; font-size: 13px;
  color: var(--text-primary); cursor: pointer; transition: background 0.2s; text-align: left;
}
.suggestion-item:hover { background: var(--bg-subtle); color: #6366f1; }
</style>
