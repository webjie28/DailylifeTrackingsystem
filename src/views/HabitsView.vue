<script setup>
import { computed, ref } from 'vue'
import { useAppStore, getTodayKey } from '../stores/appStore'
const store = useAppStore()
const selectedDate = ref(getTodayKey())
const customTitle = ref('')
const starters = [
 {id:'reading',title:'Read a few pages',detail:'Make a little room for a good book.',icon:'▤'},
 {id:'stretch',title:'Take a stretch break',detail:'Step away from your desk and move.',icon:'↗'},
 {id:'outdoors',title:'Spend time outdoors',detail:'Enjoy a change of scenery.',icon:'☼'},
 {id:'rest',title:'Unwind before bed',detail:'Give yourself a quieter end to the day.',icon:'☾'},
 {id:'connect',title:'Connect with someone',detail:'Make time for a friend or loved one.',icon:'♡'},
 {id:'reflect',title:'Notice one good thing',detail:'Pause and reflect on your day.',icon:'✦'},
]
const savedHabits = computed(() => store.dailyTasks.filter(t => t.kind === 'everyday-habit'))
const habits = computed(() => [...starters, ...savedHabits.value.filter(h=>h.custom)].map(h => ({...h, checked: savedHabits.value.find(s=>s.id===h.id)?.dates?.includes(selectedDate.value) || false})))
const completed = computed(() => habits.value.filter(h=>h.checked).length)
function toggle(habit) {
 const saved = savedHabits.value.find(h=>h.id===habit.id)
 if (!saved) store.addTask({id:habit.id,kind:'everyday-habit',title:habit.title,dates:[selectedDate.value]})
 else {
  saved.dates = saved.dates?.includes(selectedDate.value) ? saved.dates.filter(d=>d!==selectedDate.value) : [...(saved.dates || []),selectedDate.value]
  localStorage.setItem('dailyTasks',JSON.stringify(store.dailyTasks))
 }
}
function addHabit() { const title=customTitle.value.trim(); if(!title)return; store.addTask({id:crypto.randomUUID(),kind:'everyday-habit',custom:true,title,detail:'Your own daily intention.',icon:'✓',dates:[]}); customTitle.value='' }
</script>
<template>
 <div class="everyday-page"><div class="learning-crumb">Everyday <span>/</span> Daily habits</div><header class="learning-header"><small>SMALL THINGS, DONE OFTEN</small><h1>Build a day that feels good.</h1><p>Simple routines, at your own pace. Check off what you did and come back tomorrow.</p></header><div class="habit-overview"><div><strong>{{ completed }} <span>/ {{ habits.length }}</span></strong><p>intentions completed</p></div><div class="habit-progress" role="progressbar" aria-label="Daily habits completed" :aria-valuenow="completed" :aria-valuemax="habits.length" aria-valuemin="0"><span :style="{width:(completed/habits.length*100)+'%'}"></span></div><label>Viewing date<input type="date" v-model="selectedDate" :max="getTodayKey()" required @change="selectedDate = selectedDate || getTodayKey()"></label></div><section class="habit-grid"><label v-for="habit in habits" :key="habit.id" class="habit-card" :class="{checked:habit.checked}"><span class="habit-icon">{{ habit.icon }}</span><div><strong>{{ habit.title }}</strong><p>{{ habit.detail }}</p></div><input type="checkbox" :checked="habit.checked" @change="toggle(habit)"></label></section><form class="habit-add" @submit.prevent="addHabit"><div><h2>Make it your own.</h2><p>Add a routine that matters to you.</p></div><label class="habit-custom-label">Your habit<input v-model="customTitle" placeholder="e.g. Practice guitar" maxlength="100" required></label><button type="submit">＋ Add habit</button></form><p class="habit-footnote">Your check-ins are saved by date in your account. Small progress still counts.</p></div>
</template>
