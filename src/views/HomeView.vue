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

    <!-- Quick Stats Section (Glassmorphism Cards) -->
    <section class="animate-in delay-200">
      <div class="stats-pastel-grid">
        <router-link to="/fitness" class="stat-pastel-card stat-pastel-green">
          <div class="stat-pastel-info">
            <div class="stat-pastel-value">{{ store.todayTotalCaloriesBurned }} kcal</div>
            <div class="stat-pastel-label">Calories Today</div>
          </div>
        </router-link>

        <router-link to="/fitness" class="stat-pastel-card stat-pastel-blue">
          <div class="stat-pastel-info">
            <div class="stat-pastel-value">{{ store.todaySteps.toLocaleString() }} steps</div>
            <div class="stat-pastel-label">Steps Today</div>
          </div>
        </router-link>

        <router-link to="/finance" class="stat-pastel-card stat-pastel-yellow">
          <div class="stat-pastel-info">
            <div class="stat-pastel-value">₱{{ store.monthlyExpenses.toLocaleString() }}</div>
            <div class="stat-pastel-label">Expenses (Month)</div>
          </div>
        </router-link>

        <router-link to="/savings" class="stat-pastel-card stat-pastel-purple">
          <div class="stat-pastel-info">
            <div class="stat-pastel-value">₱{{ store.totalSavings.toLocaleString() }}</div>
            <div class="stat-pastel-label">Total Savings</div>
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

/* ── Stat Cards: Glassmorphism ─────────────────────────── */
.stats-pastel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}
.stat-pastel-card {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    border-radius: 24px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 172px;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    background: var(--glass-bg, rgba(255,255,255,0.15)) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid var(--glass-border, rgba(255,255,255,0.2)) !important;
    color: var(--time-text, var(--text-primary)) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}
.stat-pastel-card:hover {
    transform: translateY(-4px);
    background: var(--glass-hover, rgba(255,255,255,0.22)) !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}
.stat-pastel-value {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 32px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 4px;
    color: var(--time-text, var(--text-primary));
}
.stat-pastel-label {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 13px;
    font-weight: 600;
    color: var(--time-text-muted, var(--text-secondary));
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

