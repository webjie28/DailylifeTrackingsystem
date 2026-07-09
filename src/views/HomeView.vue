<template>
  <div>
    <!-- Dashboard Header (now contains Clock In / Clock Out) -->
    <Header />

    <!-- Work Log Record Card -->
    <section class="animate-in delay-100" style="margin-bottom: 24px;">
      <article class="focus-minimal-card">
        <div class="focus-header" style="justify-content: space-between; display: flex; align-items: center; width: 100%; margin-bottom: 16px;">
          <h3>Work Log Record</h3>
          <span class="status-dot-badge" :class="{ active: store.isClockedIn }">
            {{ store.workTimeLogs.length }} {{ store.workTimeLogs.length === 1 ? 'Log' : 'Logs' }}
          </span>
        </div>

        <!-- Log Table: always visible -->
        <div v-if="store.workTimeLogs.length === 0" class="empty-msg" style="padding: 24px 0; text-align: center;">
          No work logs recorded yet. Clock in above to start tracking.
        </div>
        <div v-else class="logs-table-wrapper">
          <table class="logs-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Rest Day</th>
                <th>Note</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="log in [...store.workTimeLogs].reverse()" 
                :key="log.id" 
                :class="{ 
                  'log-row-active': !log.clockOut 
                }"
              >
                <!-- Date -->
                <td class="log-td-date">
                  {{ log.date }}
                </td>
                
                <!-- Clock In -->
                <td class="log-td-time">
                  {{ formatTime(log.clockIn) }}
                </td>

                <!-- Clock Out -->
                <td class="log-td-time">
                  <span v-if="log.clockOut">{{ formatTime(log.clockOut) }}</span>
                  <span v-else class="log-in-progress-badge">● In Progress</span>
                </td>

                <!-- Hours -->
                <td class="log-td-hours">
                  {{ log.duration !== null && log.duration !== undefined ? formatDuration(log.duration) : '—' }}
                </td>

                <!-- Status -->
                <td>
                  <span class="punctuality-badge" :class="getPunctualityStatus(log.clockIn).status">
                    ● {{ getPunctualityStatus(log.clockIn).text }}
                  </span>
                </td>

                <!-- Rest Day -->
                <td style="font-size: 13px; color: var(--text-secondary);">
                  Saturday, Sunday
                </td>

                <!-- Note -->
                <td class="log-note-td" :title="log.note">{{ log.note || '—' }}</td>

                <!-- Actions -->
                <td>
                  <button class="btn-del-log" @click="confirmDeleteWorkLog(log)">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>

    <!-- Quick Stats Section (Modern Grid Cards) -->
    <section class="animate-in delay-150">
      <div class="stats-pastel-grid">
        <!-- Calories -->
        <router-link to="/fitness" class="stat-pastel-card">
          <div class="stat-card-left">
            <div class="stat-pastel-label">Calories Burned</div>
            <div class="stat-pastel-value">{{ store.todayTotalCaloriesBurned }} kcal</div>
            <span class="trend-pill" :class="calGoalPercent >= 100 ? 'success' : 'warning'">
              {{ calGoalPercent }}% of goal
            </span>
          </div>
          <div class="stat-card-right">
            <div class="mini-ring-wrap" style="--ring-color: #f97316;">
              <svg viewBox="0 0 36 36" class="mini-ring-svg">
                <circle class="ring-bg" cx="18" cy="18" r="15.915" fill="none" stroke-width="3"></circle>
                <circle class="ring-fill" cx="18" cy="18" r="15.915" fill="none" stroke-dasharray="100" :stroke-dashoffset="100 - Math.min(100, calGoalPercent)" stroke-width="3"></circle>
              </svg>
              <div class="mini-ring-icon-center">
                <svg class="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Steps -->
        <router-link to="/fitness" class="stat-pastel-card">
          <div class="stat-card-left">
            <div class="stat-pastel-label">Steps Today</div>
            <div class="stat-pastel-value">{{ store.todaySteps.toLocaleString() }}</div>
            <span class="trend-pill" :class="stepsGoalPercent >= 100 ? 'success' : 'warning'">
              {{ stepsGoalPercent }}% of goal
            </span>
          </div>
          <div class="stat-card-right">
            <div class="mini-ring-wrap" style="--ring-color: #22c55e;">
              <svg viewBox="0 0 36 36" class="mini-ring-svg">
                <circle class="ring-bg" cx="18" cy="18" r="15.915" fill="none" stroke-width="3"></circle>
                <circle class="ring-fill" cx="18" cy="18" r="15.915" fill="none" stroke-dasharray="100" :stroke-dashoffset="100 - Math.min(100, stepsGoalPercent)" stroke-width="3"></circle>
              </svg>
              <div class="mini-ring-icon-center">
                <svg class="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Watchlist Show Recommendation -->
        <router-link to="/anime" class="stat-pastel-card">
          <div class="stat-card-left" style="max-width: 70%;">
            <div class="stat-pastel-label">Recommended Watch</div>
            <div class="stat-pastel-value" style="font-size: 20px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;" :title="recommendedShow ? recommendedShow.title : 'Watchlist Empty'">
              {{ recommendedShow ? recommendedShow.title : 'Plan a Show!' }}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <span class="trend-pill success" style="margin-top: 0; font-size: 10px; padding: 2px 6px;">
                {{ recommendedShow ? `Ep. ${recommendedShow.currentEpisode}/${recommendedShow.totalEpisodes}` : 'Empty list' }}
              </span>
              <button 
                v-if="store.animeWatchlist.length > 1" 
                class="shuffle-recommend-btn"
                @click.prevent="shuffleRecommend"
                title="Shuffle suggestion"
              >
                🎲 Shuffle
              </button>
            </div>
          </div>
          <div class="stat-card-right">
            <div class="mini-ring-wrap" style="--ring-color: #ec4899;">
              <div class="mini-ring-icon-center" style="position: static; width: auto; height: auto;">
                <svg class="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                  <line x1="7" y1="2" x2="7" y2="22"/>
                  <line x1="17" y1="2" x2="17" y2="22"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <line x1="2" y1="7" x2="7" y2="7"/>
                  <line x1="2" y1="17" x2="7" y2="17"/>
                  <line x1="17" y1="17" x2="22" y2="17"/>
                  <line x1="17" y1="7" x2="22" y2="7"/>
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Recommended Book (Replaces Total Savings card in status row) -->
        <router-link to="/study" class="stat-pastel-card">
          <div class="stat-card-left" style="max-width: 70%;">
            <div class="stat-pastel-label">Recommended Book</div>
            <div class="stat-pastel-value" style="font-size: 18px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;" :title="recommendedBook ? recommendedBook.title : 'No Books'">
              {{ recommendedBook ? recommendedBook.title : 'Read a Book!' }}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <span class="trend-pill success" style="margin-top: 0; font-size: 10px; padding: 2px 6px;">
                {{ recommendedBook ? recommendedBook.genre : 'Empty list' }}
              </span>
              <button 
                class="shuffle-recommend-btn"
                @click.prevent="shuffleBookRecommend"
                title="Shuffle book recommendation"
              >
                🎲 Shuffle
              </button>
            </div>
          </div>
          <div class="stat-card-right">
            <div class="mini-ring-wrap" style="--ring-color: #8b5cf6;">
              <div class="mini-ring-icon-center" style="position: static; width: auto; height: auto;">
                <svg class="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </section>

<!-- Bottom: Analytics & Trends (Tabbed Chart, full width) -->
    <section class="animate-in delay-250" style="margin-bottom: 36px;">
      <article class="chart-card-tabbed">
        <div class="chart-tab-header">
          <h3>{{ activeChartTitle }}</h3>
          <div class="chart-tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.key" 
              class="chart-tab-btn" 
              :class="{ active: activeChart === tab.key }" 
              @click="selectChart(tab.key)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div class="chart-container">
          <div v-if="hasRealData" class="chart-wrapper">
            <canvas ref="chartCanvas"></canvas>
          </div>
          <div v-else class="empty-msg" style="padding: 60px 20px; text-align: center; font-size: 14px; color: var(--text-muted);">
            📊 No activity recorded for this category yet. Your analytics chart will appear here once logged.
          </div>
        </div>
      </article>
    </section>

    <!-- Permanent 30-Day Fitness & Savings Charts Row -->
    <section class="animate-in delay-300" style="margin-bottom: 36px;">
      <div class="charts-row">
        <div class="panel chart-panel">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon" style="vertical-align: middle; margin-right: 8px;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            30-Day Steps Trend
          </h3>
          <div class="chart-wrap" style="position: relative; height: 260px; width: 100%;"><canvas ref="stepsChartCanvas"></canvas></div>
        </div>
        <div class="panel chart-panel">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon" style="vertical-align: middle; margin-right: 8px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="9" y2="17"/><line x1="15" y1="13" x2="15" y2="17"/></svg>
            30-Day Gym Calories
          </h3>
          <div class="chart-wrap" style="position: relative; height: 260px; width: 100%;"><canvas ref="gymChartCanvas"></canvas></div>
        </div>
        <div class="panel chart-panel">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon" style="vertical-align: middle; margin-right: 8px; color: #22c55e;"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Savings Goals Progress
          </h3>
          <div class="chart-wrap" style="position: relative; height: 260px; width: 100%;"><canvas ref="savingsChartCanvas"></canvas></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Header from '../components/Header.vue'
import { useAppStore } from '../stores/appStore'
import Chart from 'chart.js/auto'

import { LIBRARY_BOOKS } from '../services/libraryBooks'

const store = useAppStore()

// Book Recommendation Logic
const recommendBookId = ref(localStorage.getItem('dailyBookRecommendId') || '')

const recommendedBook = computed(() => {
  if (!LIBRARY_BOOKS || LIBRARY_BOOKS.length === 0) return null
  let current = LIBRARY_BOOKS.find(b => b.id === recommendBookId.value)
  if (!current) {
    const randomIdx = Math.floor(Math.random() * LIBRARY_BOOKS.length)
    current = LIBRARY_BOOKS[randomIdx]
    recommendBookId.value = current.id
    localStorage.setItem('dailyBookRecommendId', current.id)
  }
  return current
})

function shuffleBookRecommend() {
  if (!LIBRARY_BOOKS || LIBRARY_BOOKS.length <= 1) return
  const filteredList = LIBRARY_BOOKS.filter(b => b.id !== recommendBookId.value)
  const randomIdx = Math.floor(Math.random() * filteredList.length)
  const nextBook = filteredList[randomIdx]
  recommendBookId.value = nextBook.id
  localStorage.setItem('dailyBookRecommendId', nextBook.id)
}

const calGoalPercent = computed(() => {
  const target = 500 // Active calorie burn target
  return Math.min(100, Math.round((store.todayTotalCaloriesBurned / target) * 100))
})

const stepsGoalPercent = computed(() => {
  const target = store.fitnessStepGoal || 8000
  return Math.min(100, Math.round((store.todaySteps / target) * 100))
})

const expensesBudgetPercent = computed(() => {
  const target = 15000 // Monthly budget target
  return Math.min(100, Math.round((store.monthlyExpenses / target) * 100))
})

const savingsGoalsPercent = computed(() => {
  const totalTarget = store.savingsGoals.reduce((sum, g) => sum + (g.target || 0), 0)
  if (totalTarget <= 0) return 0
  return Math.min(100, Math.round((store.totalSavings / totalTarget) * 100))
})

const showLogsDrawer = ref(false)

// Electron IPC & Python Analytics
const { ipcRenderer } = window.require ? window.require('electron') : {}
const pythonAnalytics = ref(null)

function calculateJSAnalytics() {
  const logs = store.workTimeLogs
  if (!logs || logs.length === 0) {
    pythonAnalytics.value = {
      total_minutes: 0,
      avg_minutes: 0,
      most_productive_day: 'None',
      project_breakdown: []
    }
    return
  }

  let total_mins = 0
  const durations = []
  const project_counts = {}
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayMinutes = { "Sunday": 0, "Monday": 0, "Tuesday": 0, "Wednesday": 0, "Thursday": 0, "Friday": 0, "Saturday": 0 }

  logs.forEach(log => {
    const duration = log.duration
    if (duration !== null && duration !== undefined) {
      total_mins += duration
      durations.push(duration)
    }

    if (log.date) {
      try {
        const parts = log.date.split('-')
        const dt = new Date(parts[0], parts[1] - 1, parts[2])
        const dayName = dayNames[dt.getDay()]
        if (duration !== null && duration !== undefined) {
          dayMinutes[dayName] = (dayMinutes[dayName] || 0) + duration
        }
      } catch (e) {
        console.error(e)
      }
    }

    let note = (log.note || '').trim()
    if (!note) note = 'General Work'
    project_counts[note] = (project_counts[note] || 0) + (duration || 0)
  })

  const avg_mins = durations.length > 0 ? Math.round(total_mins / durations.length) : 0

  let most_productive = 'None'
  let max_mins = -1
  for (const day of dayNames) {
    const mins = dayMinutes[day]
    if (mins > max_mins && mins > 0) {
      max_mins = mins
      most_productive = day
    }
  }

  const proj_breakdown = Object.keys(project_counts).map(name => ({
    name,
    minutes: project_counts[name]
  }))

  pythonAnalytics.value = {
    status: 'success',
    total_minutes: total_mins,
    avg_minutes: avg_mins,
    most_productive_day: most_productive,
    project_breakdown: proj_breakdown
  }
}

async function runPythonAnalytics() {
  if (!ipcRenderer) {
    calculateJSAnalytics()
    return
  }
  try {
    const rawLogs = JSON.parse(JSON.stringify(store.workTimeLogs))
    const result = await ipcRenderer.invoke('run-python', {
      action: 'analyze_work_logs',
      logs: rawLogs
    })
    if (result && result.status === 'success') {
      pythonAnalytics.value = result
    } else {
      calculateJSAnalytics()
    }
  } catch (err) {
    console.error('Python Analytics error, using JS fallback:', err)
    calculateJSAnalytics()
  }
}

watch(() => store.workTimeLogs, () => {
  runPythonAnalytics()
}, { deep: true })

// 🎬 Watchlist Show Recommendation Engine
const recommendShowId = ref(localStorage.getItem('dailyShowRecommendId') || '')

const recommendedShow = computed(() => {
  const list = store.animeWatchlist.filter(a => a.status === 'planning' || a.status === 'watching')
  if (list.length === 0) return null
  
  let current = list.find(a => a.id === recommendShowId.value)
  if (!current) {
    const randomIdx = Math.floor(Math.random() * list.length)
    current = list[randomIdx]
    recommendShowId.value = current.id
    localStorage.setItem('dailyShowRecommendId', current.id)
  }
  return current
})

function shuffleRecommend() {
  const list = store.animeWatchlist.filter(a => a.status === 'planning' || a.status === 'watching')
  if (list.length <= 1) return
  
  const filteredList = list.filter(a => a.id !== recommendShowId.value)
  const randomIdx = Math.floor(Math.random() * filteredList.length)
  const nextShow = filteredList[randomIdx]
  recommendShowId.value = nextShow.id
  localStorage.setItem('dailyShowRecommendId', nextShow.id)
}

function confirmDeleteWorkLog(log) {
  const logLabel = log.date || 'this work session'
  store.showConfirm({
    title: 'Delete Work Log?',
    message: `Are you sure you want to delete the work log for "${logLabel}"?`,
    confirmText: 'Delete',
    onConfirm: () => {
      store.deleteWorkLog(log.id)
    }
  })
}

function getPunctualityStatus(clockInIso) {
  if (!clockInIso) return { status: 'ontime', text: 'On Time' }
  const clockIn = new Date(clockInIso)
  
  // Create 11:00 PM target on the same day as clock-in
  let targetDate = new Date(clockIn)
  targetDate.setHours(23, 0, 0, 0)
  
  // If clocked in between 12:00 AM and 5:00 AM, it counts as part of the previous night's 11:00 PM shift
  if (clockIn.getHours() < 5) {
    targetDate.setDate(targetDate.getDate() - 1)
  }
  
  const diffMs = clockIn - targetDate
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins > 0) {
    if (diffMins >= 60) {
      const hrs = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return { status: 'late', text: `Late ${hrs}h ${mins}m` }
    }
    return { status: 'late', text: `Late ${diffMins}m` }
  }
  return { status: 'ontime', text: 'On Time' }
}

function formatTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

function formatDuration(mins) {
  if (mins === null || mins === undefined) return 'In Progress'
  if (mins < 60) return `${mins} mins`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

// Format date range for timesheet: e.g. "Jul 8 (Tue)"
function formatLogDateRange(log) {
  if (!log.clockIn) return log.date || '—'
  const d = new Date(log.clockIn)
  const options = { month: 'short', day: 'numeric', weekday: 'short' }
  return d.toLocaleDateString(undefined, options)
}

// Format ISO datetime as "Jul 8 · 10:00 PM" 
function formatDateTime(isoStr) {
  if (!isoStr) return '—'
  const d = new Date(isoStr)
  const datePart = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const timePart = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${datePart} · ${timePart}`
}



onMounted(() => {
  renderChart()
  runPythonAnalytics()
})

const activeChart = ref('steps')
const chartCanvas = ref(null)
const stepsChartCanvas = ref(null)
const gymChartCanvas = ref(null)
const savingsChartCanvas = ref(null)
let chartInstance = null
let stepsChartInstance = null
let gymChartInstance = null
let savingsChartInstance = null

const tabs = [
  { key: 'steps', label: 'Steps Trend' },
  { key: 'calories', label: 'Calories' },
  { key: 'workload', label: 'Work Hours' },
  { key: 'water', label: 'Water Intake' },
  { key: 'expenses', label: 'Expenses' }
]

const titles = {
  steps: 'Weekly Steps Trend (Last 7 Days)',
  calories: 'Calories Burned Trend (30 Days)',
  workload: 'Weekly Work Hours & Workload (Last 7 Days)',
  water: 'Daily Water Intake (Last 7 Days vs 3L Goal)',
  expenses: 'Expenses by Category'
}

const activeChartTitle = computed(() => titles[activeChart.value])

const hasRealData = computed(() => {
  if (activeChart.value === 'steps') {
    return Object.values(store.walkTrackerData).some(v => v && v > 0)
  }
  if (activeChart.value === 'workload') {
    return store.workTimeLogs.some(l => l.duration > 0)
  }
  if (activeChart.value === 'water') {
    return Object.values(store.waterIntakeLog).some(v => v && v > 0)
  }
  if (activeChart.value === 'expenses') {
    return store.financeTransactions.some(t => t.type === 'expense')
  }
  if (activeChart.value === 'calories') {
    const hasGym = Object.values(store.gymTrackerData).some(v => v && v.calories > 0)
    const hasWalk = Object.values(store.walkTrackerData).some(v => v && v > 0)
    return hasGym || hasWalk
  }
  return false
})

function selectChart(chartKey) {
  activeChart.value = chartKey
  renderChart()
}

function renderChart() {
  if (!chartCanvas.value) return

  // Destroy previous chart instance
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  
  if (activeChart.value === 'steps') {
    const labels = []
    const stepsData = []
    const goalLineData = []
    const targetSteps = store.fitnessStepGoal || 10000
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
      
      labels.push(d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }))
      stepsData.push(store.walkTrackerData[key] || 0)
      goalLineData.push(targetSteps)
    }
    
    const displaySteps = stepsData
    
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Steps Taken',
            data: displaySteps,
            backgroundColor: 'rgba(230, 92, 0, 0.75)',
            borderColor: '#e65c00',
            borderWidth: 1,
            borderRadius: 8,
            maxBarThickness: 35
          },
          {
            label: 'Daily Goal',
            data: goalLineData,
            type: 'line',
            borderColor: 'rgba(34, 197, 94, 0.8)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { boxWidth: 12, padding: 8 } }
        },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)' } }
        }
      }
    })
  } else if (activeChart.value === 'workload') {
    const labels = []
    const hoursData = []
    const targetHoursData = []
    const targetHours = 8 // Daily target hours (8 hours timesheet practice)
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
      
      labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
      
      const dailyLogs = store.workTimeLogs.filter(l => l.date === dateStr && l.duration > 0)
      const totalMins = dailyLogs.reduce((sum, l) => sum + (l.duration || 0), 0)
      const totalHours = Math.round((totalMins / 60) * 10) / 10
      
      hoursData.push(totalHours)
      targetHoursData.push(targetHours)
    }
    
    let displayHours = hoursData
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Hours Logged',
            data: displayHours,
            borderColor: 'rgba(99, 102, 241, 0.95)',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 2,
            pointBackgroundColor: 'rgba(99, 102, 241, 1)'
          },
          {
            label: 'Daily Goal (8h)',
            data: targetHoursData,
            borderColor: 'rgba(249, 115, 22, 0.7)',
            borderWidth: 1.5,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { boxWidth: 12, padding: 8 } }
        },
        scales: {
          x: { 
            grid: { display: false },
            ticks: { maxTicksLimit: 10 } // Clean up X-axis density
          },
          y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)' }, ticks: { callback: v => `${v}h` } }
        }
      }
    })
  } else if (activeChart.value === 'water') {
    // Generate 7-day cumulative water intake data vs goal line
    const labels = []
    const waterValues = []
    const goalLineData = []
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
      
      labels.push(d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }))
      
      const intakeMl = store.waterIntakeLog[key] || 0
      const intakeLiters = parseFloat((intakeMl / 1000).toFixed(2))
      waterValues.push(intakeLiters)
      
      // Goal is 3L or user defined target
      const targetLiters = (store.waterDailyTarget || 3000) / 1000
      goalLineData.push(targetLiters)
    }
    
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Water Intake',
            data: waterValues,
            backgroundColor: 'rgba(14, 165, 233, 0.75)',
            borderColor: '#0ea5e9',
            borderWidth: 1,
            borderRadius: 6,
            maxBarThickness: 35
          },
          {
            label: 'Daily Target Line',
            data: goalLineData,
            type: 'line',
            borderColor: 'rgba(239, 68, 68, 0.85)',
            borderWidth: 2,
            borderDash: [6, 6],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { boxWidth: 12, padding: 8 } }
        },
        scales: {
          x: { grid: { display: false } },
          y: { 
            beginAtZero: true, 
            grid: { color: 'rgba(148, 163, 184, 0.15)' },
            ticks: {
              callback: v => `${v}L`
            }
          }
        }
      }
    })
  } else if (activeChart.value === 'expenses') {
    // Generate actual expense categories data
    const categoriesMap = {}
    store.financeTransactions.filter(t => t.type === 'expense').forEach(t => {
      categoriesMap[t.category] = (categoriesMap[t.category] || 0) + (parseFloat(t.amount) || 0)
    })
    
    const labels = Object.keys(categoriesMap)
    const values = Object.values(categoriesMap)
    
    // No fallback default sample data
    
    chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--accent-purple').trim() || '#334155', '#22c55e', '#f97316', '#3b82f6', '#ec4899', '#14b8a6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 16 }
          }
        }
      }
    })
  } else if (activeChart.value === 'calories') {
    // Generate 30 days calories (Walk + Gym)
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
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Calories Burned',
          data: totals,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 2,
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

  const displaySteps = stepValues

  stepsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Steps Walked',
        data: displaySteps,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        pointBackgroundColor: '#6366f1'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
        y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.1)' } }
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

  const displayGym = gymValues

  gymChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Calories Burned (kcal)',
        data: displayGym,
        backgroundColor: '#6366f1',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
        y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.1)' } }
      }
    }
  })
}

function renderSavingsChart() {
  if (!savingsChartCanvas.value) return
  if (savingsChartInstance) {
    savingsChartInstance.destroy()
  }

  const ctx = savingsChartCanvas.value.getContext('2d')
  
  // Truncate long labels so they stay clean on the left axis
  const labels = store.savingsGoals.map(g => {
    const name = g.name || 'Unnamed'
    return name.length > 18 ? name.slice(0, 18) + '...' : name
  })

  const currentValues = store.savingsGoals.map(g => {
    return store.savingsContributions
      .filter(c => c.goalId === g.id)
      .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
  })
  const targetValues = store.savingsGoals.map(g => parseFloat(g.target) || 0)

  savingsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Current Saved (₱)',
          data: currentValues,
          backgroundColor: 'rgba(34, 197, 94, 0.85)',
          borderColor: '#22c55e',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Target Goal (₱)',
          data: targetValues,
          backgroundColor: 'rgba(148, 163, 184, 0.15)',
          borderColor: '#cbd5e1',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      indexAxis: 'y', // Makes the chart horizontal
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
        y: { grid: { display: false } }
      }
    }
  })
}

onMounted(() => {
  renderChart()
  renderStepsChart()
  renderGymChart()
  renderSavingsChart()
  runPythonAnalytics()
})

// Re-render chart if relevant store state updates
watch(
  [
    () => store.financeTransactions,
    () => store.savingsGoals,
    () => store.waterIntakeLog,
    () => store.walkTrackerData,
    () => store.gymTrackerData,
    () => store.workTimeLogs
  ],
  () => {
    renderChart()
    renderStepsChart()
    renderGymChart()
    renderSavingsChart()
  },
  { deep: true }
)
</script>

<style scoped>
/* Scoped adjustments */
.animate-in {
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}
.delay-100 { animation-delay: 0.08s; }
.delay-200 { animation-delay: 0.16s; }
.delay-300 { animation-delay: 0.24s; }
.delay-400 { animation-delay: 0.32s; }

/* ── Stat Cards: Split Layout with Trend Pills ─────────── */
.stats-pastel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}
.stat-pastel-card {
    font-family: 'Inter', sans-serif !important;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 148px;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    background: var(--glass-bg, rgba(255,255,255,0.15)) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.2)) !important;
    color: var(--time-text, var(--text-primary)) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}
.stat-pastel-card:hover {
    transform: translateY(-3px);
    background: var(--glass-hover, rgba(255,255,255,0.22)) !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}
.stat-card-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    text-align: left;
}
.stat-pastel-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--time-text-muted, var(--text-secondary));
    opacity: 0.8;
}
.stat-pastel-value {
    font-size: 28px;
    font-weight: 800;
    line-height: 1.2;
    color: var(--time-text, var(--text-primary));
    margin: 0;
}
.trend-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    margin-top: 4px;
}
.shuffle-recommend-btn {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 6px;
    font-family: 'Inter', sans-serif !important;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    background: var(--glass-bg, rgba(255,255,255,0.1));
    border: 1px solid var(--glass-border, rgba(255,255,255,0.2));
    color: var(--time-text, var(--text-primary));
    cursor: pointer;
    transition: all 0.2s ease;
}
.shuffle-recommend-btn:hover {
    background: var(--glass-hover, rgba(255,255,255,0.2));
    border-color: var(--time-accent, var(--accent-purple));
    transform: scale(1.03);
}
.trend-pill.success {
    background: rgba(34, 197, 94, 0.15);
    color: #16a34a;
}
.trend-pill.warning {
    background: rgba(249, 115, 22, 0.15);
    color: #ea580c;
}
.trend-pill.danger {
    background: rgba(239, 68, 68, 0.15);
    color: #dc2626;
}
.trend-pill.neutral {
    background: rgba(148, 163, 184, 0.15);
    color: var(--text-secondary);
}
.stat-card-right {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--time-accent, var(--accent-orange));
}
.stat-card-icon {
    width: 20px;
    height: 20px;
    stroke-width: 1.75;
    opacity: 0.85;
}

/* ── Circular Progress Rings ───────────────────────────── */
.mini-ring-wrap {
    position: relative;
    width: 64px;
    height: 64px;
    flex-shrink: 0;
}
.mini-ring-svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
}
.mini-ring-svg .ring-bg {
    stroke: var(--border-color-strong, rgba(0,0,0,0.08));
    opacity: 0.3;
}
.mini-ring-svg .ring-fill {
    stroke: var(--ring-color, #f97316);
    stroke-linecap: round;
    transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.mini-ring-icon-center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--time-text, var(--text-primary));
}

/* ── Time Tracker Widget Styling ────────────────────────── */
.status-dot-badge {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 6px;
    background: rgba(148, 163, 184, 0.15);
    color: var(--text-secondary);
    letter-spacing: 0.05em;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}
.status-dot-badge::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #64748b;
}
.status-dot-badge.active {
    background: rgba(34, 197, 94, 0.15);
    color: #16a34a;
}
.status-dot-badge.active::before {
    background: #22c55e;
    animation: blinkDotPulse 1.5s step-start infinite;
}
@keyframes blinkDotPulse {
  50% { opacity: 0.3; }
}
.timer-tick-display {
    font-family: 'Inter', sans-serif !important;
    font-size: 40px;
    font-weight: 800;
    text-align: center;
    color: var(--time-text, var(--text-primary));
    letter-spacing: -0.01em;
    margin: 8px 0;
}
.active-note-lbl {
    font-size: 13px;
    text-align: center;
    color: var(--time-text-muted, var(--text-secondary));
    margin-bottom: 12px;
}
.btn-warning {
    background: linear-gradient(135deg, #ea580c 0%, #d97706 100%);
    color: #ffffff;
    border: none;
    cursor: pointer;
    padding: 10px 18px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    transition: all 0.2s;
}
.btn-warning:hover {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
}
.btn-text-toggle {
    background: transparent;
    border: none;
    font-size: 13px;
    font-weight: 700;
    color: var(--time-accent, var(--accent-purple));
    cursor: pointer;
    transition: opacity 0.2s;
}
.btn-text-toggle:hover {
    opacity: 0.8;
    text-decoration: underline;
}
.logs-drawer-content {
    margin-top: 20px;
    border-top: 1px solid var(--glass-border, rgba(255,255,255,0.15));
    padding-top: 16px;
}
.logs-table-wrapper {
    overflow-x: auto;
    width: 100%;
}
.logs-history-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
}
.logs-history-table th {
    font-weight: 700;
    color: var(--time-text-muted, var(--text-secondary));
    padding: 8px;
    border-bottom: 1.5px solid var(--glass-border, rgba(255,255,255,0.15));
}
.logs-history-table td {
    padding: 10px 8px;
    border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.1));
    color: var(--time-text, var(--text-primary));
}
.log-note-td {
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.btn-del-log {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 13px;
    transition: color 0.2s;
}
.btn-del-log:hover {
    color: #ef4444;
}

/* ── Dashboard Dual Row ──────────────────────────────────── */
.dashboard-dual-row {
    display: flex;
    gap: 24px;
    align-items: flex-start;
}
.dashboard-dual-row > article {
    flex: 1;
    min-width: 0;
}
@media (max-width: 768px) {
    .dashboard-dual-row {
        flex-direction: column;
    }
}
.timesheet-table th,
.timesheet-table td {
    white-space: nowrap;
    padding: 8px 6px;
}
.timesheet-table td:first-child div:first-child {
    font-weight: 700;
    font-size: 12.5px;
}
.ts-rest-row td {
    background: rgba(100, 116, 139, 0.04);
    opacity: 0.75;
}
.ts-rest-row:hover td {
    background: rgba(100, 116, 139, 0.08);
    opacity: 1;
}

.python-analytics-box {
    background: var(--bg-subtle, rgba(255,255,255,0.06));
    border: 1px solid var(--glass-border, rgba(255,255,255,0.12));
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 20px;
}
.python-analytics-box h4 {
    font-family: 'Inter', sans-serif !important;
    font-size: 12px;
    font-weight: 750;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--time-accent, var(--accent-orange));
    margin: 0 0 12px;
}
.python-stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}
.py-stat-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: var(--bg-card, rgba(255,255,255,0.1));
    border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
    border-radius: 12px;
    padding: 12px 10px;
    text-align: center;
}
.py-stat-lbl {
    font-size: 10px;
    font-weight: 600;
    color: var(--time-text-muted, var(--text-secondary));
    text-transform: uppercase;
}
.py-stat-val {
    font-size: 14px;
    font-weight: 800;
    color: var(--time-text, var(--text-primary));
}
@media (max-width: 500px) {
    .python-stats-row {
        grid-template-columns: 1fr;
    }
}

/* ── Tabbed Chart Card: Glassmorphism ──────────────────── */
.chart-card-tabbed {
    background: var(--glass-bg, rgba(255,255,255,0.18)) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.2)) !important;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}
.chart-tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.15));
    padding-bottom: 16px;
}
.chart-tab-header h3 {
    font-family: 'Inter', sans-serif !important;
    font-size: 18px;
    font-weight: 700;
    color: var(--time-text, var(--text-primary));
}
.chart-tabs {
    display: flex;
    gap: 4px;
    background: var(--glass-bg, rgba(255,255,255,0.1));
    padding: 4px;
    border-radius: 12px;
}
.chart-tab-btn {
    font-family: 'Inter', sans-serif !important;
    background: transparent;
    border: none;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--time-text-muted, var(--text-secondary));
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
}
.chart-tab-btn:hover { color: var(--time-text, var(--text-primary)); }
.chart-tab-btn.active {
    background: var(--glass-hover, rgba(255,255,255,0.2));
    color: var(--time-text, var(--text-primary));
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.chart-wrapper { position: relative; height: 320px; width: 100%; }

/* ── Action Buttons: Glassmorphism ─────────────────────── */
.actions-minimal-row { display: flex; gap: 12px; margin-bottom: 32px; }
.action-minimal-btn {
    font-family: 'Inter', sans-serif !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: var(--glass-bg, rgba(255,255,255,0.15)) !important;
    backdrop-filter: blur(16px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.2)) !important;
    border-radius: 12px;
    color: var(--time-text, var(--text-primary)) !important;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.25s ease;
}
.action-minimal-btn:hover {
    background: var(--glass-hover, rgba(255,255,255,0.25)) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

/* ── Focus Card: Glassmorphism ─────────────────────────── */
.focus-minimal-card {
    background: var(--glass-bg, rgba(255,255,255,0.15)) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.2)) !important;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    margin-bottom: 24px;
}
.focus-minimal-card .focus-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}
.focus-minimal-card h3 {
    font-family: 'Inter', sans-serif !important;
    font-size: 14px;
    font-weight: 700;
    color: var(--time-text-muted, var(--text-secondary));
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.focus-minimal-input {
    font-family: 'Inter', sans-serif !important;
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.2));
    border-radius: 12px;
    background: var(--glass-bg, rgba(255,255,255,0.1));
    color: var(--time-text, var(--text-primary));
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.focus-minimal-input::placeholder {
    color: var(--time-text-muted, var(--text-secondary));
    opacity: 0.7;
}
.focus-minimal-input:focus {
    border-color: var(--time-accent, var(--accent-purple));
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.15);
    background: var(--glass-hover, rgba(255,255,255,0.2));
}

/* ── Permanent Charts Grid & Glass Panels ── */
.charts-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 24px;
    margin-bottom: 28px;
}
.chart-panel {
    background: var(--glass-bg, rgba(255,255,255,0.18)) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.2)) !important;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.chart-panel h3 {
    font-family: 'Inter', sans-serif !important;
    font-size: 16px;
    font-weight: 700;
    color: var(--time-text, var(--text-primary));
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}
.chart-panel h3 svg {
    color: var(--time-accent, var(--accent-purple));
}
.chart-wrap {
    position: relative;
    height: 260px;
    width: 100%;
}

/* ── Punctuality Badges ── */
.punctuality-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 6px;
    font-family: 'Inter', sans-serif !important;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    gap: 4px;
}
.punctuality-badge.ontime {
    background: rgba(34, 197, 94, 0.15);
    color: #16a34a;
}
.punctuality-badge.late {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
}

/* ── Recommended Books grid and cards ── */
.recommended-books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.rec-book-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 18px;
  border-radius: 16px;
  transition: all 0.25s ease;
}
.rec-book-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-purple);
  box-shadow: var(--shadow-sm);
}
.rec-book-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.rec-book-icon {
  font-size: 28px;
  flex-shrink: 0;
}
.rec-book-title {
  font-size: 14px;
  font-weight: 750;
  color: var(--text-primary);
  margin: 0;
}
.rec-book-author {
  font-size: 11px;
  color: var(--text-secondary);
  margin: 0;
}
.rec-book-genre {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.rec-book-btn {
  width: 100%;
  text-align: center;
  display: block;
}
</style>

