<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
const store = useAppStore()
const upcoming = computed(() => [...store.eventsList].filter(event => event.date >= store.todayKey).sort((a,b) => `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`)).slice(0,3))
const goals = computed(() => store.longtermGoalsList.slice(0,3).map(goal => ({ ...goal, progress: goal.milestones?.length ? Math.round(goal.milestones.filter(m => m.done).length / goal.milestones.length * 100) : 0 })))
const dateLabel = date => new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
</script>
<template>
  <aside class="dashboard-aside">
    <section class="side-panel"><div class="panel-heading"><h3>Goals in motion</h3><router-link to="/goals" aria-label="View all goals">↗</router-link></div><p class="panel-caption">A little closer, every day.</p>
      <router-link v-for="goal in goals" :key="goal.id" to="/goals" class="aside-goal"><div><strong>{{ goal.title }}</strong><span>{{ goal.progress }}%</span></div><div class="metric-track"><span :style="{ width: goal.progress + '%' }"></span></div></router-link>
      <div v-if="!goals.length" class="aside-empty"><span>◎</span><strong>Start with one goal</strong><p>Turn something you care about into your next milestone.</p><router-link to="/goals">Create a goal →</router-link></div>
    </section>
    <section class="side-panel"><div class="panel-heading"><h3>Coming up</h3><router-link to="/events" aria-label="Open calendar">↗</router-link></div><p class="panel-caption">Keep a little space for what matters.</p>
      <router-link v-for="event in upcoming" :key="event.id" to="/events" class="agenda-row"><span class="agenda-date">{{ dateLabel(event.date) }}</span><div><strong>{{ event.title }}</strong><small>{{ event.time || 'All day' }}</small></div></router-link>
      <div v-if="!upcoming.length" class="aside-empty"><span>▦</span><strong>A little breathing room</strong><p>No upcoming events. Plan something worth looking forward to.</p><router-link to="/events">Add an event →</router-link></div>
    </section>
    <div class="dashboard-note"><span>✦</span><p>You don't have to do it all.<br><strong>Just make today count.</strong></p></div>
  </aside>
</template>
