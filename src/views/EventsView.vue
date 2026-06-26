<template>
  <div class="events-view">
    <div class="finance-header">
      <div>
        <h1>Events Scheduler</h1>
        <p style="color: var(--text-muted); margin-top: 4px; font-size: 14px;">
          Plan your activities, schedule goals deadlines, and keep track of upcoming events
        </p>
      </div>
      <div class="header-actions">
        <!-- Optional header buttons -->
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Events</div>
        <div class="stat-value purple">{{ store.eventsList.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Upcoming Events</div>
        <div class="stat-value green">{{ upcomingEventsCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Passed Events</div>
        <div class="stat-value" style="color: var(--text-muted);">{{ passedEventsCount }}</div>
      </div>
    </div>

    <!-- Layout Columns -->
    <div class="content-grid-split">
      <!-- Left Column: Add Event Form -->
      <div class="panel">
        <h3>Schedule New Event</h3>
        <form @submit.prevent="saveEvent">
          <div class="form-group">
            <label>Event Title</label>
            <input type="text" v-model="eventTitle" placeholder="e.g. Gym Assessment, Coding Exam" required />
          </div>

          <div class="two-input">
            <div class="form-group">
              <label>Date</label>
              <input type="date" v-model="eventDate" required />
            </div>
            <div class="form-group">
              <label>Time</label>
              <input type="time" v-model="eventTime" required />
            </div>
          </div>

          <div class="form-group">
            <label>Category</label>
            <select v-model="eventCategory">
              <option value="Personal">Personal</option>
              <option value="Study">Study / Work</option>
              <option value="Fitness">Fitness</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
            Save Event
          </button>
        </form>
      </div>

      <!-- Right Column: Events List -->
      <div class="panel">
        <div class="panel-header-tabs">
          <h3>Upcoming Schedule</h3>
          <div class="filter-tabs">
            <button 
              v-for="t in ['all', 'upcoming', 'passed']" 
              :key="t"
              class="tab-btn"
              :class="{ active: activeTab === t }"
              @click="activeTab = t"
            >
              {{ t.toUpperCase() }}
            </button>
          </div>
        </div>

        <div class="events-list">
          <div v-if="filteredEvents.length === 0" class="empty-msg">
            No events scheduled.
          </div>

          <div 
            v-else 
            v-for="event in filteredEvents" 
            :key="event.id" 
            class="event-item"
            :class="{ passed: isEventPassed(event) }"
          >
            <div class="event-left">
              <div class="event-date-badge" :class="event.category">
                <span class="badge-month">{{ getMonthAbbr(event.date) }}</span>
                <span class="badge-day">{{ getDayNumber(event.date) }}</span>
              </div>
              <div class="event-details">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-meta">
                  <span class="event-time">{{ formatTimeLabel(event.time) }}</span> • 
                  <span class="category-badge" :class="event.category">{{ event.category }}</span>
                </div>
              </div>
            </div>
            <div class="event-right">
              <button class="btn-del" @click="deleteEvent(event.id)" title="Delete Event">✕</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore, getTodayKey } from '../stores/appStore'

const store = useAppStore()

// Form states
const eventTitle = ref('')
const eventDate = ref(getTodayKey())
const eventTime = ref('09:00')
const eventCategory = ref('Personal')

const activeTab = ref('all')

const upcomingEventsCount = computed(() => {
  return store.eventsList.filter(e => !isEventPassed(e)).length
})

const passedEventsCount = computed(() => {
  return store.eventsList.filter(e => isEventPassed(e)).length
})

const filteredEvents = computed(() => {
  return [...store.eventsList]
    .filter(e => {
      if (activeTab.value === 'upcoming') return !isEventPassed(e)
      if (activeTab.value === 'passed') return isEventPassed(e)
      return true
    })
    .sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`)
      const dateTimeB = new Date(`${b.date}T${b.time}`)
      // Sort upcoming events ascending (soonest first), passed events descending (latest first)
      if (activeTab.value === 'passed') {
        return dateTimeB - dateTimeA
      }
      return dateTimeA - dateTimeB
    })
})

function isEventPassed(e) {
  const eventDateTime = new Date(`${e.date}T${e.time}`)
  return eventDateTime < new Date()
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
  const [hStr, mStr] = timeStr.split(':')
  let h = parseInt(hStr)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${mStr} ${ampm}`
}

// CRUD
function saveEvent() {
  if (!eventTitle.value.trim() || !eventDate.value || !eventTime.value) {
    alert('Please fill out all fields.')
    return
  }

  const newEvent = {
    id: Date.now() + '_' + Math.random().toString(36).slice(2),
    title: eventTitle.value.trim(),
    date: eventDate.value,
    time: eventTime.value,
    category: eventCategory.value
  }

  store.addEvent(newEvent)
  
  // Reset
  eventTitle.value = ''
  eventDate.value = getTodayKey()
  eventTime.value = '09:00'
  eventCategory.value = 'Personal'
}

function deleteEvent(id) {
  if (!confirm('Are you sure you want to cancel this event?')) return
  store.deleteEvent(id)
}
</script>

<style scoped>
.finance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}
.finance-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 18px 20px;
  box-shadow: var(--shadow-sm);
}
.stat-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
}
.stat-value.purple {
  color: #7c3aed;
}
.stat-value.green {
  color: #22c55e;
}

.content-grid-split {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 24px;
}
@media (max-width: 900px) {
  .content-grid-split {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
}
.panel h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0 0 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}
.form-group input, .form-group select {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-input-inset);
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  width: 100%;
  font-family: inherit;
}
.form-group input:focus, .form-group select:focus {
  border-color: #7c3aed;
}
.two-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Tabs */
.panel-header-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.panel-header-tabs h3 {
  margin: 0;
}
.filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-subtle);
  padding: 4px;
  border-radius: 10px;
}
.tab-btn {
  background: transparent;
  border: none;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 750;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}
.tab-btn.active {
  background: var(--bg-card);
  color: #7c3aed;
  box-shadow: var(--shadow-sm);
}

/* Events list items */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 520px;
  overflow-y: auto;
}
.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  transition: all 0.2s;
}
.event-item:hover {
  transform: translateY(-1px);
}
.event-item.passed {
  opacity: 0.65;
}

.event-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.event-date-badge {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  background: #64748b;
}
/* Category badges colors */
.event-date-badge.Personal { background: #3b82f6; }
.event-date-badge.Study { background: #7c3aed; }
.event-date-badge.Fitness { background: #22c55e; }
.event-date-badge.Entertainment { background: #ec4899; }
.event-date-badge.Other { background: #f97316; }

.badge-month {
  font-size: 9px;
  font-weight: 800;
  opacity: 0.85;
  letter-spacing: 0.05em;
  line-height: 1;
}
.badge-day {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
  margin-top: 1px;
}

.event-details {
  min-width: 0;
}
.event-title {
  font-weight: 750;
  font-size: 15px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.event-meta {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  background: var(--bg-card);
}
.category-badge.Personal { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
.category-badge.Study { color: #7c3aed; background: rgba(124, 58, 237, 0.1); }
.category-badge.Fitness { color: #22c55e; background: rgba(34, 197, 94, 0.1); }
.category-badge.Entertainment { color: #ec4899; background: rgba(236, 72, 153, 0.1); }
.category-badge.Other { color: #f97316; background: rgba(249, 115, 22, 0.1); }

.event-right {
  flex-shrink: 0;
}

.btn-del {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
  transition: color 0.2s;
}
.btn-del:hover {
  color: #ef4444;
}

.btn {
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary {
  background: #7c3aed;
  color: #fff;
}
.btn-primary:hover {
  background: #5b21b6;
}
.btn-outline {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color-strong);
}
.btn-outline:hover {
  background: var(--bg-subtle);
}

.empty-msg {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 14px;
}
</style>
