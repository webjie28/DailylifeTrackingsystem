<template>
  <div>
    <!-- Dashboard Header -->
    <Header />

    <!-- Today's Focus Card -->
    <section class="animate-in delay-100">
      <article class="focus-minimal-card">
        <div class="focus-header">
          <h3>Today's Focus</h3>
        </div>
        <input 
          type="text" 
          v-model="focusInput" 
          @input="onFocusInput"
          class="focus-minimal-input" 
          placeholder="What is your #1 priority today?" 
        />
      </article>
    </section>

    <!-- Quick Stats Section (Modern Grid Cards) -->
    <section class="animate-in delay-200">
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
            <svg class="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
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
            <svg class="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
          </div>
        </router-link>

        <!-- Expenses -->
        <router-link to="/finance" class="stat-pastel-card">
          <div class="stat-card-left">
            <div class="stat-pastel-label">Expenses (Month)</div>
            <div class="stat-pastel-value">₱{{ store.monthlyExpenses.toLocaleString() }}</div>
            <span class="trend-pill" :class="expensesBudgetPercent > 100 ? 'danger' : (expensesBudgetPercent > 70 ? 'warning' : 'success')">
              {{ expensesBudgetPercent }}% of budget
            </span>
          </div>
          <div class="stat-card-right">
            <svg class="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
        </router-link>

        <!-- Savings -->
        <router-link to="/savings" class="stat-pastel-card">
          <div class="stat-card-left">
            <div class="stat-pastel-label">Total Savings</div>
            <div class="stat-pastel-value">₱{{ store.totalSavings.toLocaleString() }}</div>
            <span class="trend-pill" :class="savingsGoalsPercent > 0 ? 'success' : 'neutral'">
              {{ savingsGoalsPercent > 0 ? savingsGoalsPercent + '% of target' : 'No active targets' }}
            </span>
          </div>
          <div class="stat-card-right">
            <svg class="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Quick Actions Card -->
    <section class="animate-in delay-300">
      <div class="actions-minimal-row">
        <router-link to="/finance" class="action-minimal-btn">
          Log Expense
        </router-link>
        <router-link to="/fitness" class="action-minimal-btn">
          Log Workout
        </router-link>
      </div>
    </section>

    <!-- Bottom: Analytics & Trends (Tabbed Chart, full width) -->
    <section class="animate-in delay-400" style="margin-bottom: 36px;">
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
          <div class="chart-wrapper">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Header from '../components/Header.vue'
import { useAppStore } from '../stores/appStore'
import Chart from 'chart.js/auto'

const store = useAppStore()
const focusInput = ref(store.todayFocus)

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
const activeChart = ref('growth')
const chartCanvas = ref(null)
let chartInstance = null

const tabs = [
  { key: 'growth', label: 'Savings' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'loans', label: 'Goals' },
  { key: 'calories', label: 'Calories' }
]

const titles = {
  growth: 'Savings Growth Over Time',
  expenses: 'Expenses by Category',
  loans: 'Savings Goals Progress',
  calories: 'Calories Burned Trend (30 Days)'
}

const activeChartTitle = computed(() => titles[activeChart.value])

function onFocusInput() {
  store.updateTodayFocus(focusInput.value)
}

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
  
  if (activeChart.value === 'growth') {
    // Mock growth timeline
    const data = [
      { label: 'Jan', value: 1000 },
      { label: 'Feb', value: 2500 },
      { label: 'Mar', value: 3500 },
      { label: 'Apr', value: 5000 }
    ]
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(p => p.label),
        datasets: [{
          label: 'Savings Progress',
          data: data.map(p => p.value),
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#7c3aed',
          pointBorderColor: '#ffffff'
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
  } else if (activeChart.value === 'expenses') {
    // Generate actual expense categories data
    const categoriesMap = {}
    store.financeTransactions.filter(t => t.type === 'expense').forEach(t => {
      categoriesMap[t.category] = (categoriesMap[t.category] || 0) + (parseFloat(t.amount) || 0)
    })
    
    const labels = Object.keys(categoriesMap)
    const values = Object.values(categoriesMap)
    
    // Fallback default sample data if empty
    if (labels.length === 0) {
      labels.push('Sample Food', 'Sample Utilities', 'Sample Other')
      values.push(2500, 1500, 800)
    }
    
    chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: ['#7c3aed', '#22c55e', '#f97316', '#3b82f6', '#ec4899', '#14b8a6'],
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
  } else if (activeChart.value === 'loans') {
    // Actual Goals Progress Data
    const data = store.savingsGoals.map(g => {
      const contribs = store.savingsContributions.filter(c => c.goalId === g.id)
      const totalSaved = contribs.reduce((sum, c) => {
        if (c.type === 'deposit') return sum + (parseFloat(c.amount) || 0)
        if (c.type === 'withdraw') return sum - (parseFloat(c.amount) || 0)
        return sum
      }, 0)
      const progress = g.target > 0 ? Math.min(100, Math.round((totalSaved / g.target) * 100)) : 0
      return { label: g.name, progress }
    })
    
    // Fallback sample data if empty
    const displayData = data.length > 0 ? data : [
      { label: 'Sample Travel', progress: 65 },
      { label: 'Sample Gadget', progress: 30 }
    ]
    
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: displayData.map(p => p.label),
        datasets: [{
          label: 'Progress (%)',
          data: displayData.map(p => p.progress),
          backgroundColor: '#7c3aed',
          borderRadius: 12,
          maxBarThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: v => `${v}%` },
            grid: { color: 'rgba(148, 163, 184, 0.15)' }
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

onMounted(() => {
  renderChart()
})

// Re-render chart if relevant store state updates
watch([() => store.financeTransactions, () => store.savingsGoals, () => store.savingsContributions], () => {
  renderChart()
}, { deep: true })
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
    font-family: 'Plus Jakarta Sans', sans-serif !important;
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
    opacity: 0.85;
}
.stat-card-icon {
    width: 38px;
    height: 38px;
    stroke-width: 1.75;
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
    font-family: 'Plus Jakarta Sans', sans-serif !important;
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
    font-family: 'Plus Jakarta Sans', sans-serif !important;
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
    font-family: 'Plus Jakarta Sans', sans-serif !important;
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
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 700;
    color: var(--time-text-muted, var(--text-secondary));
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.focus-minimal-input {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
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
</style>

