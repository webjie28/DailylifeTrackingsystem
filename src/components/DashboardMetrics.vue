<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
const store = useAppStore()
const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value)
const metrics = computed(() => [
  { title: 'Steps today', value: store.todaySteps.toLocaleString(), detail: `of ${store.fitnessStepGoal.toLocaleString()} daily goal`, progress: store.todaySteps / Math.max(1, store.fitnessStepGoal) * 100, icon: '↗', to: '/fitness', tone: 'green' },
  { title: 'Water intake', value: `${(store.todayWaterIntake / 1000).toFixed(1)} L`, detail: `of ${(store.waterDailyTarget / 1000).toFixed(1)} L daily goal`, progress: store.todayWaterIntake / Math.max(1, store.waterDailyTarget) * 100, icon: '◒', to: '/water', tone: 'blue' },
  { title: 'Monthly expenses', value: money(store.monthlyExpenses), detail: 'Your spending this month', icon: '↗', to: '/finance', tone: 'orange' },
  { title: 'Total savings', value: money(store.totalSavings), detail: 'Every contribution counts', icon: '◇', to: '/savings', tone: 'purple' },
])
</script>
<template>
  <section class="dashboard-metrics" aria-label="Your key metrics">
    <router-link v-for="metric in metrics" :key="metric.to" :to="metric.to" class="metric-tile" :class="metric.tone">
      <div class="metric-top"><span>{{ metric.title }}</span><i>{{ metric.icon }}</i></div>
      <strong>{{ metric.value }}</strong><small>{{ metric.detail }}</small>
      <div v-if="metric.progress !== undefined" class="metric-track"><span :style="{ width: Math.min(100, Math.max(0, metric.progress)) + '%' }"></span></div>
      <span v-else class="metric-foot">View breakdown <b>→</b></span>
    </router-link>
  </section>
</template>
