<template>
 <div class="planner-page">
  <div class="planner-crumb">Workspace <span>/</span> <strong>Calendar</strong></div>
  <header class="planner-header"><div><small>A LITTLE SPACE FOR WHAT'S NEXT</small><h1>Make time for your life.</h1><p>Your plans, your moments, and a little room to breathe.</p></div><button class="planner-primary" @click="openNew">＋ New event</button></header>
  <div class="planner-layout"><section class="planner-calendar" aria-label="Monthly calendar"><div class="planner-month"><div><h2 aria-live="polite">{{ monthLabel }}</h2><span>{{ monthEvents }} {{ monthEvents === 1 ? 'event' : 'events' }} planned this month</span></div><div class="planner-controls"><button @click="goToday">Today</button><button @click="changeMonth(-1)" aria-label="Previous month">‹</button><button @click="changeMonth(1)" aria-label="Next month">›</button></div></div><div class="planner-weekdays" aria-hidden="true"><span v-for="day in ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']" :key="day">{{ day }}</span></div><div class="planner-days"><button v-for="day in calendarDays" :key="day.key" class="planner-day" :class="{muted:!day.current,selected:day.key === selectedDate,today:day.key === store.todayKey}" :aria-pressed="day.key === selectedDate" :aria-label="`${day.key}, ${day.events.length} events`" @click="selectedDate = day.key"><span class="planner-day-number">{{ day.day }}</span><span v-for="event in day.events.slice(0,2)" :key="event.id" class="planner-event-chip" :class="event.category">{{ event.title }}</span><small v-if="day.events.length > 2">+{{ day.events.length - 2 }} more</small></button></div><div class="planner-legend"><span><i></i>Personal</span><span><i class="study"></i>Study / Work</span><span><i class="fitness"></i>Fitness</span><small>Select a day to see your plans</small></div></section>
  <aside class="planner-agenda"><section><div class="planner-agenda-heading"><small>YOUR DAY AT A GLANCE</small><h2>{{ selectedLabel }}</h2><span>{{ dayEvents.length }} {{ dayEvents.length === 1 ? 'item' : 'items' }}</span></div><div v-if="!dayEvents.length" class="planner-empty"><span>☼</span><h3>A little breathing room.</h3><p>Nothing planned for this day.<br>Make space for something good.</p><button @click="openNew">Add a plan ↗</button></div><article v-for="event in dayEvents" :key="event.id" class="planner-agenda-event"><small>{{ formatTimeLabel(event.time) }} <span>· {{ event.category }}{{ event.system ? ' · Synced' : '' }}</span></small><h3>{{ event.title }}</h3><div v-if="!event.system"><button @click="startEdit(event)" :aria-label="'Edit ' + event.title">Edit</button><button @click="deleteEvent(event.id)" :aria-label="'Delete ' + event.title">Delete</button></div></article></section><div class="planner-note"><span>✦</span><p>Goals, workouts, reading, and savings dates<br><strong>appear here automatically.</strong></p></div></aside></div>
  <section class="planner-schedule"><div class="planner-schedule-top"><h2>Your connected schedule</h2><div role="group" aria-label="Filter schedule"><button v-for="tab in ['all','upcoming','passed']" :key="tab" :aria-pressed="activeTab === tab" @click="activeTab = tab">{{ tab === 'all' ? 'Active' : tab === 'passed' ? 'Past' : 'Upcoming' }}</button></div></div><p v-if="!filteredEvents.length" class="planner-list-empty">No events in this view. Finished days move automatically to Past.</p><article v-for="event in filteredEvents" :key="event.id" class="planner-list-row"><span class="planner-date-badge"><small>{{ getMonthAbbr(event.date) }}</small><strong>{{ getDayNumber(event.date) }}</strong></span><div><h3>{{ event.title }}</h3><p>{{ formatTimeLabel(event.time) }} · {{ event.category }}{{ event.system ? ' · Synced from tracker' : '' }}</p></div><button v-if="!event.system" @click="startEdit(event)" :aria-label="'Edit scheduled event: ' + event.title">Edit ↗</button></article></section>
  <Teleport to="body"><dialog ref="eventDialog" class="planner-dialog" aria-labelledby="event-form-title" @click="event => { if (event.target === eventDialog) closeForm() }"><button class="planner-close" @click="closeForm" aria-label="Close event form">×</button><small>MAKE IT A PLAN</small><h2 id="event-form-title">{{ editingEventId ? 'Edit your event' : 'Something to look forward to.' }}</h2><form @submit.prevent="saveEvent"><label for="planner-title">Event title</label><input id="planner-title" v-model="eventTitle" required maxlength="160" placeholder="e.g. Coffee with a friend"><div class="planner-form-row"><div><label for="planner-date">Date</label><input id="planner-date" type="date" v-model="eventDate" required></div><div><label for="planner-time">Time</label><input id="planner-time" type="time" v-model="eventTime" required></div></div><label for="planner-category">Category</label><select id="planner-category" v-model="eventCategory"><option v-for="category in ['Personal','Study','Fitness','Entertainment','Other']" :key="category">{{ category }}</option></select><div class="planner-form-actions"><button type="button" @click="closeForm">Cancel</button><button class="planner-primary" type="submit">{{ editingEventId ? 'Save changes' : 'Create event' }} ↗</button></div></form></dialog></Teleport>
 </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useAppStore, getTodayKey } from '../stores/appStore'

const store = useAppStore()
const eventDialog = ref(null)
const selectedDate = ref(getTodayKey())
const month = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
const monthLabel = computed(() => month.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
const selectedLabel = computed(() => new Date(selectedDate.value + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }))
const integratedEvents = computed(() => [
  ...store.longtermGoalsList.filter(g=>g.deadline).map(g=>({id:`goal-${g.id}`,title:`Goal due: ${g.title}`,date:g.deadline,time:'',category:'Goal',system:true})),
  ...Object.entries(store.gymTrackerData).map(([date,g])=>({id:`gym-${date}`,title:g?.workout || 'Workout',date,time:'',category:'Fitness',system:true})),
  ...store.savingsGoals.filter(g=>g.date || g.deadline).map(g=>({id:`saving-${g.id}`,title:`Savings target: ${g.name || g.title}`,date:g.date || g.deadline,time:'',category:'Savings',system:true})),
  ...store.readingLogs.map((log,index)=>{const d=new Date(log.date);return Number.isNaN(d.getTime())?null:{id:`read-${index}`,title:`Read ${log.bookTitle || 'a book'}`,date:dateKey(d),time:'',category:'Study',system:true}}).filter(Boolean)
])
const calendarEvents = computed(() => [...store.eventsList, ...integratedEvents.value])
const dayEvents = computed(() => calendarEvents.value.filter(e => e.date === selectedDate.value).sort((a,b) => (a.time || '').localeCompare(b.time || '')))
const monthEvents = computed(() => calendarEvents.value.filter(e => e.date?.startsWith(dateKey(month.value).slice(0,7))).length)
const calendarDays = computed(() => {
  const start = new Date(month.value)
  start.setDate(1 - ((start.getDay() + 6) % 7))
  return Array.from({length:42}, (_,index) => {
    const date = new Date(start); date.setDate(start.getDate() + index)
    const key = dateKey(date)
    return { key, day:date.getDate(), current:date.getMonth() === month.value.getMonth(), events:calendarEvents.value.filter(e => e.date === key) }
  })
})
function changeMonth(offset) { month.value = new Date(month.value.getFullYear(), month.value.getMonth()+offset, 1) }
function goToday() { const now = new Date(); month.value = new Date(now.getFullYear(),now.getMonth(),1); selectedDate.value = dateKey(now) }
function openNew() { cancelEdit(); eventDate.value = selectedDate.value; eventDialog.value.showModal() }
function closeForm() { eventDialog.value.close() }

// Form states
const eventTitle = ref('')
const eventDate = ref(getTodayKey())
const eventTime = ref('09:00')
const eventCategory = ref('Personal')
const editingEventId = ref(null)

const activeTab = ref('all')

const uniqueEventTitles = computed(() => {
  const list = store.eventsList || []
  return Array.from(new Set(list.map(e => e.title?.trim()).filter(Boolean)))
})

const upcomingEventsCount = computed(() => {
  return store.eventsList.filter(e => !isEventPassed(e)).length
})

const passedEventsCount = computed(() => {
  return store.eventsList.filter(e => isEventPassed(e)).length
})

const filteredEvents = computed(() => {
  return [...calendarEvents.value]
    .filter(e => {
      if (activeTab.value === 'upcoming') return !isEventPassed(e)
      if (activeTab.value === 'passed') return isEventPassed(e)
      return !isEventPassed(e)
    })
    .sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`)
      const dateTimeB = new Date(`${b.date}T${b.time}`)
      if (activeTab.value === 'passed') {
        return dateTimeB - dateTimeA
      }
      return dateTimeA - dateTimeB
    })
})

function isEventPassed(e) {
  if (!e?.date) return false
  const eventDateTime = new Date(`${e.date}T${e.time || '23:59:59'}`)
  return !Number.isNaN(eventDateTime.getTime()) && eventDateTime < new Date()
}

// Helpers
const MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getMonthAbbr(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return MONTHS_ABBR[d.getMonth()].toUpperCase()
}

function getDayNumber(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.getDate()
}

function formatTimeLabel(timeStr) {
  if (!timeStr) return 'All day'
  const [hStr, mStr] = timeStr.split(':')
  let h = parseInt(hStr)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${mStr} ${ampm}`
}

// CRUD
function startEdit(event) {
  editingEventId.value = event.id
  eventTitle.value = event.title
  eventDate.value = event.date
  eventTime.value = event.time
  eventCategory.value = event.category
  eventDialog.value.showModal()
}

function cancelEdit() {
  editingEventId.value = null
  eventTitle.value = ''
  eventDate.value = getTodayKey()
  eventTime.value = '09:00'
  eventCategory.value = 'Personal'
}

function saveEvent() {
  if (!eventTitle.value.trim() || !eventDate.value || !eventTime.value) {
    alert('Please fill out all fields.')
    return
  }

  if (editingEventId.value) {
    // Update existing event
    const updated = {
      id: editingEventId.value,
      title: eventTitle.value.trim(),
      date: eventDate.value,
      time: eventTime.value,
      category: eventCategory.value
    }
    store.updateEvent(updated)
    editingEventId.value = null
  } else {
    // Create new event
    const newEvent = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2),
      title: eventTitle.value.trim(),
      date: eventDate.value,
      time: eventTime.value,
      category: eventCategory.value
    }
    store.addEvent(newEvent)
  }
  
  selectedDate.value = eventDate.value
  const savedDate = new Date(eventDate.value + 'T00:00:00')
  month.value = new Date(savedDate.getFullYear(), savedDate.getMonth(), 1)
  closeForm()
  // Reset
  eventTitle.value = ''
  eventDate.value = getTodayKey()
  eventTime.value = '09:00'
  eventCategory.value = 'Personal'
}

function deleteEvent(id) {
  if (editingEventId.value === id) {
    cancelEdit()
  }
  store.showConfirm({
    title: 'Delete Event?',
    message: 'Are you sure you want to delete this event?',
    confirmText: 'Delete',
    onConfirm: () => {
      store.deleteEvent(id)
    }
  })
}
</script>
<style scoped>
.planner-page,.planner-dialog { --cal-bg:#fff; --cal-ink:#304c3c; --cal-muted:#7c8c80; --cal-line:#e2e9e2; --cal-soft:#edf2e9; color:var(--cal-ink); }
:global([data-theme="dark"] :is(.planner-page,.planner-dialog)) { --cal-bg:#1c2922; --cal-ink:#e1ebe2; --cal-muted:#a0afa4; --cal-line:#35473a; --cal-soft:#293e30; }
:global([data-theme="navy"] :is(.planner-page,.planner-dialog)) { --cal-bg:#182b37; --cal-ink:#dceaf0; --cal-muted:#9bafbb; --cal-line:#304854; --cal-soft:#294655; }
.planner-page { max-width:1400px; margin:auto; }.planner-crumb { font-size:11px; color:var(--cal-muted); border-bottom:1px solid var(--cal-line); padding-bottom:24px; }.planner-crumb span { margin:0 12px; }.planner-crumb strong { font-weight:500; color:var(--cal-ink); }.planner-header { display:flex; align-items:center; justify-content:space-between; gap:20px; margin:32px 0; text-align:left; }.planner-header small,.planner-dialog > small { font-size:9px; letter-spacing:1.6px; color:var(--cal-muted); }.planner-header h1 { color:var(--cal-ink); font-size:clamp(25px,2.6vw,35px); letter-spacing:-1px; font-weight:500; margin:10px 0; }.planner-header p { color:var(--cal-muted); font-size:12px; margin:0; }.planner-primary { background:#3e7257; color:#fff; border:0; border-radius:8px; padding:11px 16px; font-size:12px; cursor:pointer; white-space:nowrap; }
.planner-layout { display:grid; grid-template-columns:minmax(0,2.5fr) minmax(230px,1fr); gap:22px; align-items:start; }.planner-calendar { background:var(--cal-bg); border:1px solid var(--cal-line); border-radius:16px; overflow:hidden; }.planner-month { padding:24px; display:flex; align-items:center; justify-content:space-between; gap:12px; }.planner-month h2 { font-size:20px; font-weight:500; color:var(--cal-ink); margin:0 0 5px; }.planner-month span { font-size:10px; color:var(--cal-muted); }.planner-controls { display:flex; gap:6px; }.planner-controls button { border:1px solid var(--cal-line); background:var(--cal-bg); color:var(--cal-ink); padding:7px 11px; border-radius:7px; cursor:pointer; font-size:12px; }.planner-weekdays { display:grid; grid-template-columns:repeat(7,1fr); padding:13px 0; background:var(--cal-soft); text-align:center; color:var(--cal-muted); font-size:10px; }.planner-days { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); }.planner-day { min-height:92px; border:0; border-right:1px solid var(--cal-line); border-bottom:1px solid var(--cal-line); background:var(--cal-bg); padding:8px 5px; color:var(--cal-ink); text-align:left; cursor:pointer; min-width:0; transition:background .15s; }.planner-day:nth-child(7n) { border-right:0; }.planner-day:hover { background:var(--cal-soft); }.planner-day.selected { background:var(--cal-soft); box-shadow:inset 0 0 0 1px #85a17b; }.planner-day.muted { color:var(--cal-muted); }.planner-day.muted .planner-day-number { opacity:.5; }.planner-day-number { width:24px; height:24px; display:grid; place-items:center; font-size:11px; border-radius:50%; margin-bottom:4px; }.today .planner-day-number { background:#4e7b5d; color:#fff; }.planner-event-chip { display:block; font-size:8px; padding:3px 4px; background:#e6eedd; color:#557144; border-radius:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:3px; }.planner-event-chip.Study { background:#e4ebf1; color:#5e7c91; }.planner-event-chip.Fitness { background:#f3e8db; color:#9d7a4d; }.planner-day > small { font-size:8px; color:var(--cal-muted); }.planner-legend { display:flex; align-items:center; flex-wrap:wrap; gap:14px; padding:16px; font-size:9px; color:var(--cal-muted); }.planner-legend span { display:flex; align-items:center; gap:5px; }.planner-legend i { width:6px; height:6px; border-radius:50%; background:#91a781; }.planner-legend .study { background:#839dab; }.planner-legend .fitness { background:#c2a177; }.planner-legend small { margin-left:auto; font-size:9px; }
.planner-agenda > section { padding:23px; border:1px solid var(--cal-line); background:var(--cal-bg); border-radius:16px; }.planner-agenda-heading > small { font-size:8px; letter-spacing:1.4px; color:var(--cal-muted); }.planner-agenda-heading h2 { color:var(--cal-ink); font-size:18px; font-weight:500; margin:12px 0 6px; }.planner-agenda-heading > span { font-size:10px; color:var(--cal-muted); }.planner-empty { padding:30px 0 8px; text-align:center; }.planner-empty > span { font-size:40px; color:#a5b691; }.planner-empty h3 { color:var(--cal-ink); font-size:13px; font-weight:500; margin:16px 0 8px; }.planner-empty p { font-size:11px; color:var(--cal-muted); line-height:1.8; }.planner-empty button { border:0; color:var(--cal-ink); background:var(--cal-soft); padding:9px 15px; border-radius:7px; font-size:10px; cursor:pointer; }.planner-note { display:flex; gap:13px; align-items:center; background:var(--cal-soft); border-radius:15px; margin-top:20px; padding:22px; }.planner-note > span { font-size:30px; color:#8ca177; }.planner-note p { font-size:10px; line-height:1.9; color:var(--cal-muted); margin:0; }.planner-note strong { color:var(--cal-ink); font-weight:500; }.planner-agenda-event { border-top:1px solid var(--cal-line); padding-top:17px; margin-top:19px; }.planner-agenda-event small { font-size:10px; }.planner-agenda-event small span { color:var(--cal-muted); }.planner-agenda-event h3 { color:var(--cal-ink); font-size:15px; font-weight:500; overflow-wrap:anywhere; margin:9px 0; }.planner-agenda-event button { border:0; background:transparent; color:var(--cal-muted); font-size:10px; padding:5px 12px 5px 0; cursor:pointer; }
.planner-schedule { margin-top:25px; padding:24px; border:1px solid var(--cal-line); border-radius:16px; background:var(--cal-bg); }.planner-schedule-top { display:flex; align-items:center; justify-content:space-between; gap:10px; }.planner-schedule h2 { font-size:17px; color:var(--cal-ink); font-weight:500; margin:0; }.planner-schedule-top button { border:0; padding:7px 12px; border-radius:7px; font-size:10px; background:transparent; color:var(--cal-muted); text-transform:capitalize; cursor:pointer; }.planner-schedule-top button[aria-pressed=true] { background:var(--cal-soft); color:var(--cal-ink); }.planner-list-empty { text-align:center; font-size:12px; color:var(--cal-muted); padding:25px 0 8px; }.planner-list-row { display:flex; align-items:center; gap:15px; padding:17px 0; border-bottom:1px solid var(--cal-line); }.planner-list-row:last-child { border:0; }.planner-date-badge { background:var(--cal-soft); text-align:center; border-radius:8px; min-width:44px; padding:8px; }.planner-date-badge small { font-size:8px; }.planner-date-badge strong { font-size:17px; font-weight:500; display:block; }.planner-list-row > div { flex:1; min-width:0; }.planner-list-row h3 { font-size:13px; font-weight:500; color:var(--cal-ink); margin:0; overflow-wrap:anywhere; }.planner-list-row p { font-size:10px; color:var(--cal-muted); margin:6px 0 0; }.planner-list-row > button { border:0; background:transparent; color:var(--cal-muted); font-size:11px; cursor:pointer; }
.planner-dialog { margin:auto; width:min(440px,calc(100vw - 30px)); max-height:calc(100dvh - 40px); overflow:auto; background:var(--cal-bg); border:1px solid var(--cal-line); border-radius:20px; padding:30px; }.planner-dialog::backdrop { background:#15241d66; backdrop-filter:blur(4px); }.planner-close { position:absolute; right:15px; top:12px; border:0; background:transparent; color:var(--cal-muted); font-size:24px; cursor:pointer; }.planner-dialog h2 { font-size:24px; font-weight:500; color:var(--cal-ink); margin:13px 0 25px; }.planner-dialog label { display:block; font-size:11px; margin:17px 0 8px; }.planner-dialog input,.planner-dialog select { width:100%; padding:11px; border:1px solid var(--cal-line); border-radius:8px; background:var(--cal-bg); color:var(--cal-ink); font-size:12px; box-sizing:border-box; }.planner-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }.planner-form-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:26px; }.planner-form-actions > button:not(.planner-primary) { background:transparent; border:1px solid var(--cal-line); color:var(--cal-muted); border-radius:8px; padding:10px 15px; cursor:pointer; }
@media(max-width:1050px) { .planner-layout { grid-template-columns:1fr; }.planner-agenda { display:grid; grid-template-columns:1.5fr 1fr; gap:20px; }.planner-note { margin:0; }.planner-empty { padding-top:15px; } }
@media(max-width:600px) { .planner-header { flex-direction:column; align-items:flex-start; }.planner-month { padding:17px 12px; }.planner-month h2 { font-size:17px; }.planner-controls button { padding:7px 9px; }.planner-day { min-height:65px; padding:5px 2px; }.planner-event-chip { font-size:7px; }.planner-legend small { display:none; }.planner-agenda { grid-template-columns:1fr; }.planner-note { display:none; }.planner-schedule { padding:17px; }.planner-schedule-top { flex-wrap:wrap; } }
</style>
