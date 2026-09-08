<template>
  <div class="dashboard-page">
    <div class="dashboard-topbar"><div class="dashboard-breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><router-link to="/events" class="dashboard-date">▦ {{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</router-link></div>
    <div class="dashboard-heading"><div><span class="dashboard-eyebrow">YOUR PERSONAL WORKSPACE</span><h1>Welcome back, {{ store.username || 'friend' }}<span class="greeting-spark">✦</span></h1><p>Here's how your day is shaping up. Let's make it a good one.</p></div><Header /></div>
    <DashboardMetrics v-if="dashboard.metrics" />
    <div class="dashboard-columns" :style="dashboard.sidePanel ? undefined : { gridTemplateColumns: '1fr' }"><div class="dashboard-primary"><!-- Bottom: Analytics & Trends (Tabbed Chart, full width) -->
    <section v-if="dashboard.progress" class="animate-in delay-250" style="margin-bottom: 36px;">
      <article class="workspace-chart">
        <div class="workspace-chart-heading">
          <h3>{{ activeChartTitle }}</h3>
          <div class="workspace-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="workspace-tab"
              :class="{ active: activeChart === tab.key }"
              @click="selectChart(tab.key)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div class="workspace-chart-body">
          <div v-if="hasRealData" class="workspace-canvas">
            <canvas ref="chartCanvas"></canvas>
          </div>
          <div v-else class="workspace-empty" style="padding: 60px 20px; text-align: center; font-size: 14px; color: var(--text-muted);">
            Your next step starts here. Log an activity to see your progress over time.
          </div>
        </div>
      </article>
    </section>

    <!-- Work Log Record Card -->
    <section v-if="dashboard.work" class="animate-in delay-100" style="margin-bottom: 24px;">
      <article class="workspace-history">
        <div class="workspace-history-heading" style="justify-content: space-between; display: flex; align-items: center; width: 100%; margin-bottom: 16px;">
          <h3>Recent work sessions</h3>
          <span class="workspace-count" :class="{ active: store.isClockedIn }">
            {{ store.workTimeLogs.length }} {{ store.workTimeLogs.length === 1 ? 'Log' : 'Logs' }}
          </span>
        </div>

        <!-- Log Table: always visible -->
        <div v-if="store.workTimeLogs.length === 0" class="workspace-empty" style="padding: 24px 0; text-align: center;">
          No work logs recorded yet. Clock in above to start tracking.
        </div>
        <div v-else class="workspace-table-scroll">
          <table class="workspace-table">
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
                v-for="log in visibleWorkLogs"
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
                  <button :aria-label="`Delete work session from ${log.date}`" class="workspace-delete" @click="confirmDeleteWorkLog(log)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button v-if="store.workTimeLogs.length > 5" class="history-toggle" @click="showAllLogs = !showAllLogs">{{ showAllLogs ? 'Show recent sessions' : 'View all ' + store.workTimeLogs.length + ' sessions' }} <span>↓</span></button></article>
    </section>

</div><DashboardAside v-if="dashboard.sidePanel" /></div><template v-if="dashboard.trends"><div class="dashboard-section-title"><h2>Your bigger picture</h2><span>Movement, momentum, and milestones</span></div>    <!-- Permanent 30-Day Fitness & Savings Charts Row -->
    <section class="animate-in delay-300" style="margin-bottom: 36px;">
      <div class="workspace-trends">
        <div class="workspace-trend">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon" style="vertical-align: middle; margin-right: 8px;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            30-Day Steps Trend
          </h3>
          <div class="chart-wrap" style="position: relative; height: 260px; width: 100%;"><canvas ref="stepsChartCanvas"></canvas></div>
        </div>
        <div class="workspace-trend">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon" style="vertical-align: middle; margin-right: 8px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="9" y2="17"/><line x1="15" y1="13" x2="15" y2="17"/></svg>
            30-Day Gym Calories
          </h3>
          <div class="chart-wrap" style="position: relative; height: 260px; width: 100%;"><canvas ref="gymChartCanvas"></canvas></div>
        </div>
        <div class="workspace-trend">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="panel-icon" style="vertical-align: middle; margin-right: 8px; color: #6b9a7e;"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Savings Goals Progress
          </h3>
          <div class="chart-wrap" style="position: relative; height: 260px; width: 100%;"><canvas ref="savingsChartCanvas"></canvas></div>
        </div>
      </div>
    </section></template>
<section v-if="dashboard.discover" class="dashboard-discover" aria-label="Your downtime">
  <router-link to="/check-in"><span class="discover-icon">◌</span><div><small>A MOMENT FOR YOURSELF</small><strong>How are you feeling today?</strong><p>Complete your daily check-in</p></div><span>↗</span></router-link>
  <router-link to="/study"><span class="discover-icon">▤</span><div><small>ON YOUR READING LIST</small><strong>{{ recommendedBook ? recommendedBook.title : 'Find your next great read' }}</strong><p>Open your study space</p></div><span>↗</span></router-link>
  <router-link to="/anime"><span class="discover-icon">▷</span><div><small>WHEN IT'S TIME TO UNWIND</small><strong>{{ recommendedShow ? recommendedShow.title : 'Find something worth watching' }}</strong><p>Open your watchlist</p></div><span>↗</span></router-link>
</section></div></template><script setup>
import DashboardMetrics from '../components/DashboardMetrics.vue'
import DashboardAside from '../components/DashboardAside.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Header from '../components/Header.vue'
import { useAppStore } from '../stores/appStore'
import Chart from 'chart.js/auto'

import { LIBRARY_BOOKS } from '../services/libraryBooks'

const store = useAppStore()
const dashboard = computed(() => store.preferences.dashboard)
const showAllLogs = ref(false)
const visibleWorkLogs = computed(() => [...store.workTimeLogs].reverse().slice(0, showAllLogs.value ? undefined : 5))

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
            backgroundColor: 'rgba(181, 141, 97, 0.75)',
            borderColor: '#b58d61',
            borderWidth: 1,
            borderRadius: 8,
            maxBarThickness: 35
          },
          {
            label: 'Daily Goal',
            data: goalLineData,
            type: 'line',
            borderColor: 'rgba(107, 154, 126, 0.8)',
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
            borderColor: 'rgba(102, 140, 118, 0.95)',
            backgroundColor: 'rgba(102, 140, 118, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 2,
            pointBackgroundColor: 'rgba(102, 140, 118, 1)'
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
          backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--accent-purple').trim() || '#334155', '#6b9a7e', '#f97316', '#3b82f6', '#ec4899', '#14b8a6'],
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
          borderColor: '#6b9a7e',
          backgroundColor: 'rgba(107, 154, 126, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 2,
          pointBackgroundColor: '#6b9a7e'
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
        borderColor: '#668c76',
        backgroundColor: 'rgba(102, 140, 118, 0.08)',
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        pointBackgroundColor: '#668c76'
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
        backgroundColor: '#668c76',
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
          backgroundColor: 'rgba(107, 154, 126, 0.85)',
          borderColor: '#6b9a7e',
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
