<template>
  <div class="purpose-page">
    <div class="purpose-crumb">Workspace <span>/</span> <strong>Life Goals</strong></div>
    <header class="purpose-header"><div><small>MAKE SPACE FOR WHAT MATTERS</small><h1>Small steps. Meaningful goals.</h1><p>Track personal achievements through milestones—health, learning, career, and everyday growth.</p></div><button class="purpose-primary" @click="showAddModal = true">＋ New life goal</button></header>
    <section class="goal-scope-note" aria-label="Difference between life goals and savings goals">
      <div><span class="goal-scope-icon">◎</span><p><strong>Life Goals</strong><small>For achievements and milestones, such as learning a skill, building a habit, or finishing a project.</small></p></div>
      <RouterLink to="/savings"><span class="goal-scope-icon">₱</span><p><strong>Need to save money for a target?</strong><small>Use Savings Goals to set a peso amount and record every contribution.</small></p><b>Open Savings →</b></RouterLink>
    </section>
    <section class="purpose-stats" aria-label="Goal summary"><div><span>In progress</span><strong>{{ activeGoalsCount }}</strong><small>Ideas you're bringing to life</small></div><div><span>Milestones reached</span><strong>{{ totalMilestonesCompleted }}</strong><small>Every step is worth celebrating</small></div><div><span>Goals completed</span><strong>{{ completedGoalsCount }}</strong><small>Look how far you've come</small></div></section>
    <div class="purpose-toolbar"><div role="group" aria-label="Filter goals"><button v-for="item in filters" :key="item.id" :aria-pressed="filter === item.id" @click="filter = item.id">{{ item.label }}</button></div><span>{{ filteredGoals.length }} {{ filteredGoals.length === 1 ? 'goal' : 'goals' }}</span></div>
    <section v-if="!filteredGoals.length" class="purpose-empty"><div class="purpose-empty-art" aria-hidden="true">◎<span>✦</span></div><small>A LITTLE INTENTION GOES A LONG WAY</small><h2>{{ store.longtermGoalsList.length ? 'Nothing here just yet' : 'What would you love to work toward?' }}</h2><p>{{ store.longtermGoalsList.length ? 'Choose another filter to see the rest of your goals.' : 'A healthier routine. A new skill. A dream you keep coming back to. Start with one goal and break it into small, achievable steps.' }}</p><button v-if="!store.longtermGoalsList.length" class="purpose-primary" @click="showAddModal = true">Create your first goal <span>↗</span></button><button v-else class="purpose-secondary" @click="filter = 'all'">View all goals</button><div v-if="!store.longtermGoalsList.length" class="purpose-ideas"><span>♡ Build a healthy habit</span><span>▤ Learn something new</span><span>↗ Plan your next chapter</span></div></section>
    <section v-else class="purpose-grid" aria-label="Your goals"><article v-for="goal in filteredGoals" :key="goal.id" class="purpose-card"><div class="purpose-card-top"><span class="purpose-category">{{ goal.category }}</span><span :class="{ 'purpose-overdue': goal.daysLeftText === 'Overdue' }">{{ goal.daysLeftText }}</span></div><h2>{{ goal.title }}</h2><div class="purpose-progress-label"><span>{{ goal.milestones.filter(m => m.done).length }} of {{ goal.milestones.length }} milestones</span><strong>{{ goal.percentage }}%</strong></div><div class="purpose-progress" role="progressbar" :aria-label="goal.title + ' progress'" :aria-valuenow="goal.percentage" aria-valuemin="0" aria-valuemax="100"><span :style="{width: goal.percentage + '%'}"></span></div><div class="purpose-milestones"><label v-for="(milestone, index) in goal.milestones" :key="index" :class="{done:milestone.done}"><input type="checkbox" :checked="milestone.done" @change="store.toggleMilestone(goal.id, index)"><span>{{ milestone.text }}</span></label><p v-if="!goal.milestones.length">No milestones added yet.</p></div><footer><span>▦ {{ goal.deadline || 'No deadline' }}</span><button @click="deleteGoal(goal.id)" :aria-label="'Delete goal: ' + goal.title">Delete</button></footer></article></section>
    <Teleport to="body"><dialog ref="goalDialog" class="purpose-dialog" aria-labelledby="new-goal-title" @cancel.prevent="showAddModal = false" @click="event => { if (event.target === goalDialog) showAddModal = false }"><button class="purpose-close" aria-label="Close new goal" @click="showAddModal = false">×</button><small>YOUR NEXT CHAPTER</small><h2 id="new-goal-title">Make it a goal.</h2><p>Start with the outcome. Then map the small steps.</p><form @submit.prevent="saveGoal"><label for="goal-title">What do you want to achieve?</label><input id="goal-title" v-model="newGoalTitle" placeholder="e.g. Finish my first online course" required maxlength="160"><div class="purpose-form-row"><div><label for="goal-category">Category</label><select id="goal-category" v-model="newGoalCategory"><option value="personal">Personal</option><option value="health">Health</option><option value="finance">Finance</option><option value="study">Study / Career</option><option value="other">Other</option></select></div><div><label for="goal-deadline">Target date</label><input id="goal-deadline" type="date" v-model="newGoalDeadline" required></div></div><label for="goal-milestones">Your milestones</label><textarea id="goal-milestones" v-model="newGoalMilestones" rows="5" placeholder="Pick a course&#10;Complete the first module&#10;Finish the final project" required></textarea><small class="purpose-help">Add one achievable step per line.</small><div class="purpose-form-actions"><button type="button" class="purpose-secondary" @click="showAddModal = false">Cancel</button><button class="purpose-primary" type="submit">Create goal ↗</button></div></form></dialog></Teleport>
  </div>
</template>
<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

const showAddModal = ref(false)
const goalDialog = ref(null)
const filter = ref('all')
const filters = [{ id: 'all', label: 'All goals' }, { id: 'active', label: 'In progress' }, { id: 'completed', label: 'Completed' }]
const filteredGoals = computed(() => goalsWithCalculatedProgress.value.filter(g => filter.value === 'all' || (filter.value === 'completed' ? g.percentage === 100 : g.percentage < 100)))
watch(showAddModal, async value => { await nextTick(); if (value) goalDialog.value?.showModal(); else goalDialog.value?.close() })

// Add Goal Form States
const newGoalTitle = ref('')
const newGoalCategory = ref('personal')
const newGoalDeadline = ref(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // +30 days
const newGoalMilestones = ref('')

// Calculations
const goalsWithCalculatedProgress = computed(() => {
  return store.longtermGoalsList.map(g => {
    const total = g.milestones.length
    const done = g.milestones.filter(m => m.done).length
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0
    
    // Calculate days remaining
    let daysLeftText = ''
    if (g.deadline) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const deadline = new Date(g.deadline + 'T00:00:00')
      const diffTime = deadline - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays < 0) {
        daysLeftText = 'Overdue'
      } else if (diffDays === 0) {
        daysLeftText = 'Deadline today!'
      } else {
        daysLeftText = `${diffDays} days left`
      }
    } else {
      daysLeftText = 'No deadline'
    }

    return {
      ...g,
      percentage,
      daysLeftText
    }
  })
})

const activeGoalsCount = computed(() => {
  // Goals that have at least one milestone not completed
  return goalsWithCalculatedProgress.value.filter(g => g.percentage < 100).length
})

const completedGoalsCount = computed(() => {
  // Goals that have all milestones completed
  return store.longtermGoalsList.filter(g => g.milestones.length > 0 && g.milestones.every(m => m.done)).length
})

const totalMilestonesCompleted = computed(() => {
  return store.longtermGoalsList.reduce((sum, g) => sum + g.milestones.filter(m => m.done).length, 0)
})

// Actions
function saveGoal() {
  if (!newGoalTitle.value.trim() || !newGoalMilestones.value.trim()) {
    alert('Please enter a title and milestones.')
    return
  }

  const milestones = newGoalMilestones.value
    .split('\n')
    .map(m => m.trim())
    .filter(m => m.length > 0)
    .map(m => ({ text: m, done: false }))

  const newGoal = {
    id: Date.now().toString(),
    title: newGoalTitle.value.trim(),
    category: newGoalCategory.value,
    deadline: newGoalDeadline.value,
    emoji: '🎯',
    milestones
  }

  store.addLongtermGoal(newGoal)
  showAddModal.value = false
  
  // Reset
  newGoalTitle.value = ''
  newGoalCategory.value = 'personal'
  newGoalDeadline.value = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  newGoalMilestones.value = ''
}

function deleteGoal(id) {
  const goal = store.longtermGoalsList.find(g => g.id === id)
  const title = goal ? goal.title : 'this goal'
  store.showConfirm({
    title: 'Delete Goal?',
    message: `Are you sure you want to delete "${title}"? This cannot be undone.`,
    confirmText: 'Delete',
    onConfirm: () => {
      store.deleteLongtermGoal(id)
    }
  })
}


</script>
<style scoped>
.purpose-page,.purpose-dialog { --purpose-bg:#fff; --purpose-ink:#304c3c; --purpose-muted:#7c8c80; --purpose-line:#e2e9e2; --purpose-soft:#edf2e9; color:var(--purpose-ink); }
:global([data-theme="dark"] :is(.purpose-page,.purpose-dialog)) { --purpose-bg:#1c2922; --purpose-ink:#e1ebe2; --purpose-muted:#a0afa4; --purpose-line:#35473a; --purpose-soft:#293e30; }
:global([data-theme="navy"] :is(.purpose-page,.purpose-dialog)) { --purpose-bg:#182b37; --purpose-ink:#dceaf0; --purpose-muted:#9bafbb; --purpose-line:#304854; --purpose-soft:#294655; }
.purpose-page { max-width:1400px; margin:auto; }.purpose-crumb { font-size:11px; color:var(--purpose-muted); border-bottom:1px solid var(--purpose-line); padding-bottom:24px; }.purpose-crumb span { margin:0 12px; }.purpose-crumb strong { font-weight:500; color:var(--purpose-ink); }.purpose-header { display:flex; align-items:center; justify-content:space-between; gap:20px; margin:33px 0 28px; }.purpose-header small,.purpose-empty > small,.purpose-dialog > small { font-size:9px; letter-spacing:1.6px; color:var(--purpose-muted); }.purpose-header h1 { font-size:clamp(25px,2.6vw,35px); font-weight:500; letter-spacing:-1px; margin:10px 0; color:var(--purpose-ink); }.purpose-header p { margin:0; font-size:12px; color:var(--purpose-muted); }
.purpose-primary,.purpose-secondary { border:1px solid transparent; padding:11px 17px; border-radius:8px; background:#3e7257; color:white; font-size:12px; cursor:pointer; white-space:nowrap; }.purpose-primary:hover { background:#315d46; }.purpose-secondary { background:var(--purpose-bg); border-color:var(--purpose-line); color:var(--purpose-ink); }.purpose-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }.purpose-stats > div { background:var(--purpose-bg); padding:22px; border:1px solid var(--purpose-line); border-radius:14px; }.purpose-stats span { font-size:12px; }.purpose-stats strong { display:block; font-size:33px; font-weight:500; margin:12px 0 7px; }.purpose-stats small { font-size:10px; color:var(--purpose-muted); }.purpose-toolbar { display:flex; align-items:center; justify-content:space-between; margin:29px 0 18px; }.purpose-toolbar > div { display:flex; gap:5px; }.purpose-toolbar button { border:0; background:transparent; color:var(--purpose-muted); border-radius:7px; padding:9px 13px; font-size:11px; cursor:pointer; }.purpose-toolbar button[aria-pressed=true] { background:var(--purpose-soft); color:var(--purpose-ink); }.purpose-toolbar > span { color:var(--purpose-muted); font-size:11px; }
.goal-scope-note { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:0 0 18px; }.goal-scope-note>div,.goal-scope-note>a { display:flex; align-items:center; gap:13px; min-width:0; padding:15px 17px; border:1px solid var(--purpose-line); border-radius:12px; background:var(--purpose-bg); color:var(--purpose-ink); text-decoration:none; }.goal-scope-note>a { background:var(--purpose-soft); }.goal-scope-icon { display:grid; place-items:center; width:34px; height:34px; flex:0 0 34px; border-radius:50%; background:var(--purpose-soft); color:#537a60; font-weight:700; }.goal-scope-note>a .goal-scope-icon { background:var(--purpose-bg); }.goal-scope-note p { display:flex; flex-direction:column; gap:3px; margin:0; min-width:0; }.goal-scope-note strong { font-size:12px; font-weight:600; }.goal-scope-note small { color:var(--purpose-muted); font-size:10px; line-height:1.45; }.goal-scope-note b { margin-left:auto; white-space:nowrap; font-size:10px; font-weight:600; color:#4d765b; }.goal-scope-note>a:hover { border-color:#9bb4a0; transform:translateY(-1px); }
.purpose-empty { padding:40px 24px 28px; background:var(--purpose-bg); border:1px solid var(--purpose-line); border-radius:18px; text-align:center; }.purpose-empty-art { width:95px; height:95px; margin:0 auto 23px; background:var(--purpose-soft); border-radius:50%; color:#7c9770; display:grid; place-items:center; font-size:62px; position:relative; }.purpose-empty-art > span { position:absolute; right:-6px; top:3px; font-size:28px; color:#bd9d71; animation:note-float 5s ease-in-out infinite; }.purpose-empty h2 { font-size:24px; letter-spacing:-.6px; font-weight:500; color:var(--purpose-ink); margin:15px 0 10px; }.purpose-empty p { max-width:440px; margin:0 auto 22px; line-height:1.8; font-size:12px; color:var(--purpose-muted); }.purpose-ideas { display:flex; flex-wrap:wrap; justify-content:center; gap:25px; border-top:1px solid var(--purpose-line); margin-top:36px; padding-top:23px; font-size:10px; color:var(--purpose-muted); }
.purpose-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; }.purpose-card { background:var(--purpose-bg); border:1px solid var(--purpose-line); border-radius:16px; padding:23px; display:flex; flex-direction:column; animation:daily-rise .4s both; }.purpose-card-top { display:flex; align-items:center; justify-content:space-between; gap:10px; font-size:10px; color:var(--purpose-muted); }.purpose-category { background:var(--purpose-soft); color:var(--purpose-ink); padding:5px 9px; border-radius:6px; text-transform:capitalize; }.purpose-overdue { color:#bb705b; }.purpose-card h2 { font-size:19px; font-weight:500; letter-spacing:-.4px; margin:21px 0; overflow-wrap:anywhere; color:var(--purpose-ink); }.purpose-progress-label { display:flex; justify-content:space-between; font-size:10px; color:var(--purpose-muted); }.purpose-progress-label strong { color:var(--purpose-ink); font-weight:500; }.purpose-progress { height:5px; background:var(--purpose-line); border-radius:8px; margin-top:10px; overflow:hidden; }.purpose-progress span { display:block; height:100%; background:#7d9e78; transition:width .4s; }.purpose-milestones { margin:20px 0; flex:1; }.purpose-milestones label { display:flex; align-items:flex-start; gap:10px; padding:9px 0; font-size:12px; line-height:1.6; cursor:pointer; overflow-wrap:anywhere; }.purpose-milestones input { width:16px; height:16px; margin-top:2px; flex-shrink:0; accent-color:#52815d; }.purpose-milestones .done span { text-decoration:line-through; color:var(--purpose-muted); }.purpose-card footer { display:flex; justify-content:space-between; border-top:1px solid var(--purpose-line); padding-top:15px; font-size:10px; color:var(--purpose-muted); }.purpose-card footer button { background:transparent; border:0; color:var(--purpose-muted); font-size:10px; cursor:pointer; }.purpose-card footer button:hover { color:#ab594e; }
.purpose-dialog { margin:auto; width:min(480px,calc(100vw - 30px)); max-height:calc(100dvh - 40px); overflow:auto; background:var(--purpose-bg); border:1px solid var(--purpose-line); border-radius:20px; padding:30px; }.purpose-dialog::backdrop { background:#15241d66; backdrop-filter:blur(4px); }.purpose-close { position:absolute; right:15px; top:12px; border:0; background:transparent; font-size:24px; color:var(--purpose-muted); cursor:pointer; }.purpose-dialog h2 { font-size:28px; margin:13px 0 8px; font-weight:500; color:var(--purpose-ink); }.purpose-dialog > p { color:var(--purpose-muted); font-size:12px; margin-bottom:25px; }.purpose-dialog label { display:block; font-size:11px; margin:17px 0 8px; }.purpose-dialog input,.purpose-dialog select,.purpose-dialog textarea { width:100%; padding:11px; border:1px solid var(--purpose-line); border-radius:8px; background:var(--purpose-bg); color:var(--purpose-ink); font-size:12px; box-sizing:border-box; }.purpose-dialog textarea { resize:vertical; }.purpose-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }.purpose-help { display:block; font-size:10px; color:var(--purpose-muted); margin-top:6px; }.purpose-form-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:25px; }
@media(max-width:650px) { .purpose-header { align-items:flex-start; flex-direction:column; }.goal-scope-note { grid-template-columns:1fr; }.goal-scope-note b { display:none; }.purpose-stats { gap:8px; }.purpose-stats > div { padding:14px 11px; }.purpose-stats span { font-size:10px; }.purpose-stats small { display:none; }.purpose-grid { grid-template-columns:1fr; }.purpose-toolbar button { padding:8px 10px; }.purpose-empty h2 { font-size:21px; }.purpose-dialog { padding:24px; } }
</style>
