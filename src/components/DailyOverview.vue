<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
const store = useAppStore()
const waterProgress = computed(() => Math.min(100, Math.round(store.todayWaterIntake / Math.max(1, store.waterDailyTarget) * 100)))
const destinations = [
  { to: '/study', icon: '◷', title: 'Make time to focus', detail: 'Books & study sessions', color: 'sage' },
  { to: '/fitness', icon: '↗', title: 'Move a little more', detail: 'Steps & daily movement', color: 'peach' },
  { to: '/finance', icon: '＋', title: 'Know your spending', detail: 'Expenses & your budget', color: 'lavender' },
  { to: '/goals', icon: '◎', title: 'Take the next step', detail: 'Plans with a purpose', color: 'sand' },
]
</script>

<template>
  <section class="daily-overview" aria-label="Daily overview">
    <div class="daily-banner">
      <div><span class="story-eyebrow">YOUR EVERYDAY, A LITTLE BETTER</span><h2>Little steps. <em>Big possibilities.</em></h2><p>Give today a direction. Pick one thing that matters to you.</p><router-link to="/goals" class="daily-cta">Explore your goals <span>↗</span></router-link></div>
      <router-link to="/water" class="hydration-preview" :aria-label="`Water intake: ${waterProgress}% of daily target. Open water tracker.`">
        <div class="water-orb" :style="{ '--water': waterProgress + '%' }"><span>{{ waterProgress }}<small>%</small></span></div>
        <div><strong>A moment to recharge</strong><p>{{ store.todayWaterIntake.toLocaleString() }} / {{ store.waterDailyTarget.toLocaleString() }} ml today</p><span>Track your water →</span></div>
      </router-link>
    </div>
    <div class="daily-section-heading"><h3>Find your rhythm</h3><span>Your spaces, one tap away</span></div>
    <div class="daily-shortcuts"><router-link v-for="item in destinations" :key="item.to" :to="item.to" class="daily-shortcut" :class="item.color"><span class="shortcut-icon">{{ item.icon }}</span><strong>{{ item.title }}</strong><small>{{ item.detail }}</small><span class="shortcut-arrow">↗</span></router-link></div>
  </section>
</template>
