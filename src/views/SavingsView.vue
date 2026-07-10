<template>
  <div class="savings-view">
    <div class="finance-header">
      <div>
        <h1>Savings Tracking</h1>
        <p style="color: var(--text-muted); margin-top: 4px; font-size: 14px;">
          Define your financial targets, track milestones, and log saving increments
        </p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showAddGoalModal = true">Create New Goal</button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Savings</div>
        <div class="stat-value income">₱{{ store.totalSavings.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Goals</div>
        <div class="stat-value purple">{{ activeGoalsCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Completed Goals</div>
        <div class="stat-value green">{{ completedGoalsCount }}</div>
      </div>
    </div>

    <!-- Goals Grid -->
    <div class="goals-section" style="margin-bottom: 32px;">
      <h3>My Savings Goals</h3>
      <div v-if="store.savingsGoals.length === 0" class="empty-msg-panel">
        <p>No goals defined yet. Create your first goal to start saving!</p>
        <button class="btn btn-primary" style="margin-top: 10px;" @click="showAddGoalModal = true">
          Create Goal
        </button>
      </div>
      
      <div v-else class="goals-grid">
        <div 
          v-for="goal in goalsWithSavedAmount" 
          :key="goal.id" 
          class="goal-card"
          :class="{ 'goal-completed': goal.isCompleted }"
        >
          <div class="goal-top">
            <div class="goal-title-wrap" style="flex: 1; padding-right: 8px;">
              <span class="goal-name">{{ goal.name }}</span>
              <span v-if="goal.isCompleted" class="complete-badge" style="margin-left: 6px;">✓ COMPLETE</span>
            </div>
            <button class="btn-danger-sm" @click="deleteGoal(goal.id)" style="margin-top: 2px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="goal-amounts">
            Saved: <strong>₱{{ goal.saved.toLocaleString() }}</strong> of 
            <strong>₱{{ goal.target.toLocaleString() }}</strong>
            <span v-if="!goal.isCompleted" style="margin-left: 6px; opacity: 0.85;">
              · Remaining: <strong>₱{{ goal.remaining.toLocaleString() }}</strong>
            </span>
          </div>

          <div class="goal-bar-wrap">
            <div class="goal-bar-fill" :style="{ width: goal.percentage + '%' }"></div>
          </div>

          <div class="goal-footer" style="margin-bottom: 12px;">
            <span class="goal-pct">{{ goal.percentage }}%</span>
            <span v-if="goal.date" class="goal-due">Target: {{ goal.date }}</span>
          </div>

          <button class="btn btn-primary btn-sm" @click="openAddContrib(goal.id, goal.name)" style="width: 100%;">
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Add Contribution Panel & Recent History Split -->
    <div class="content-grid-split">
      <!-- Quick Add Panel -->
      <div class="panel">
        <h3>Log Saving Contribution</h3>
        <form @submit.prevent="saveDirectContrib">
          <div class="form-group">
            <label>Select Savings Goal</label>
            <select v-model="contribGoalId" required>
              <option value="" disabled>Choose a goal...</option>
              <option v-for="g in store.savingsGoals" :key="g.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>
          </div>
          <div class="two-input">
            <div class="form-group">
              <label>Amount (₱)</label>
              <input type="number" v-model.number="contribAmount" min="0.01" step="any" placeholder="0.00" required />
            </div>
            <div class="form-group">
              <label>Date</label>
              <input type="date" v-model="contribDate" required />
            </div>
          </div>
          <div class="form-group">
            <label>Notes (Optional)</label>
            <input type="text" v-model="contribNote" list="contribNoteList" placeholder="e.g. Spare cash from weekly budget" />
            <datalist id="contribNoteList">
              <option v-for="n in uniqueContribNotes" :key="n" :value="n"></option>
            </datalist>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
            Log Contribution
          </button>
        </form>
      </div>

      <!-- Recent Contributions List -->
      <div class="panel">
        <h3>Recent Contributions History</h3>
        <div class="contrib-list">
          <div v-if="store.savingsContributions.length === 0" class="empty-msg">
            No savings contributions logged yet.
          </div>
          <div 
            v-else 
            v-for="c in sortedContributions" 
            :key="c.id" 
            class="contrib-item"
          >
            <div class="contrib-left">
              <div class="contrib-name">{{ getGoalDisplayName(c.goalId) }}</div>
              <div class="contrib-meta">
                <span>{{ c.date }}</span>
                <span v-if="c.note" style="margin-left: 6px; font-style: italic;">
                  ({{ c.note }})
                </span>
              </div>
            </div>
            <div class="contrib-right">
              <span class="contrib-amount">+₱{{ c.amount.toLocaleString() }}</span>
              <button class="btn-del" @click="deleteContribution(c.id)" title="Delete contribution">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals Section -->
    <!-- 1. Create Goal Modal -->
    <div class="modal-overlay" v-if="showAddGoalModal" @click.self="showAddGoalModal = false">
      <div class="modal-content">
        <h3>Create New Savings Goal</h3>
        <form @submit.prevent="createGoal">
          <div class="form-group">
            <label>Goal Name</label>
            <input type="text" v-model="goalName" list="goalNameList" placeholder="e.g. New Laptop, Japan Travel" required />
            <datalist id="goalNameList">
              <option v-for="gName in uniqueGoalNames" :key="gName" :value="gName"></option>
            </datalist>
          </div>
          <div class="form-group">
            <label>Target Amount (₱)</label>
            <input type="number" v-model.number="goalTarget" min="1" placeholder="0.00" required />
          </div>
          <div class="form-group">
            <label>Target Date (Optional)</label>
            <input type="date" v-model="goalDate" />
          </div>
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="submit" class="btn btn-primary" style="flex: 1;">Create Goal</button>
            <button type="button" class="btn btn-outline" @click="showAddGoalModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. Add Contribution Modal -->
    <div class="modal-overlay" v-if="showAddContribModal" @click.self="showAddContribModal = false">
      <div class="modal-content">
        <h3>Add Savings to: {{ modalGoalName }}</h3>
        <form @submit.prevent="saveModalContrib">
          <div class="two-input">
            <div class="form-group">
              <label>Amount (₱)</label>
              <input type="number" v-model.number="modalContribAmount" min="0.01" step="any" placeholder="0.00" required />
            </div>
            <div class="form-group">
              <label>Date</label>
              <input type="date" v-model="modalContribDate" required />
            </div>
          </div>
          <div class="form-group">
            <label>Note (Optional)</label>
            <input type="text" v-model="modalContribNote" list="contribNoteList" placeholder="e.g. Bonus, savings envelope" />
          </div>
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="submit" class="btn btn-primary" style="flex: 1;">Log Savings</button>
            <button type="button" class="btn btn-outline" @click="showAddContribModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore, getTodayKey } from '../stores/appStore'

const store = useAppStore()

// Modals display flags
const showAddGoalModal = ref(false)
const showAddContribModal = ref(false)

const uniqueGoalNames = computed(() => {
  const list = store.savingsGoals || []
  return Array.from(new Set(list.map(g => g.name?.trim()).filter(Boolean)))
})

const uniqueContribNotes = computed(() => {
  const list = store.savingsContributions || []
  return Array.from(new Set(list.map(c => c.note?.trim()).filter(Boolean)))
})

// Create Goal inputs
const goalName = ref('')
const goalTarget = ref('')
const goalEmoji = ref('🎯')
const goalDate = ref('')

// Direct Contrib Form inputs
const contribGoalId = ref('')
const contribAmount = ref('')
const contribDate = ref(getTodayKey())
const contribNote = ref('')

// Modal Contrib Form inputs
const modalGoalId = ref(null)
const modalGoalName = ref('')
const modalContribAmount = ref('')
const modalContribDate = ref(getTodayKey())
const modalContribNote = ref('')

// Goal aggregates
const goalsWithSavedAmount = computed(() => {
  return store.savingsGoals.map(g => {
    const saved = store.savingsContributions
      .filter(c => c.goalId === g.id)
      .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
    
    const percentage = g.target > 0 ? Math.min(100, Math.round((saved / g.target) * 100)) : 0
    const remaining = Math.max(0, g.target - saved)
    
    return {
      ...g,
      saved,
      percentage,
      remaining,
      isCompleted: percentage >= 100
    }
  })
})

const activeGoalsCount = computed(() => {
  return goalsWithSavedAmount.value.filter(g => !g.isCompleted).length
})

const completedGoalsCount = computed(() => {
  return goalsWithSavedAmount.value.filter(g => g.isCompleted).length
})

const sortedContributions = computed(() => {
  return [...store.savingsContributions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20)
})

function getGoalDisplayName(goalId) {
  const g = store.savingsGoals.find(g => g.id === goalId)
  return g ? g.name : 'Unknown Goal'
}

// Actions
function createGoal() {
  if (!goalName.value.trim() || !goalTarget.value || goalTarget.value <= 0) {
    alert('Please fill out Name and Target.')
    return
  }

  const newGoal = {
    id: Date.now() + '_' + Math.random().toString(36).slice(2),
    name: goalName.value.trim(),
    emoji: goalEmoji.value.trim() || '🎯',
    target: parseFloat(goalTarget.value),
    date: goalDate.value
  }

  store.addSavingsGoal(newGoal)
  
  // Reset
  goalName.value = ''
  goalTarget.value = ''
  goalEmoji.value = '🎯'
  goalDate.value = ''
  showAddGoalModal.value = false
}

function deleteGoal(id) {
  const goal = store.savingsGoals.find(g => g.id === id)
  const name = goal ? goal.name : 'this goal'
  store.showConfirm({
    title: 'Delete Savings Goal?',
    message: `Are you sure you want to delete "${name}" and all its contribution logs?`,
    confirmText: 'Delete',
    onConfirm: () => {
      store.deleteSavingsGoal(id)
    }
  })
}

// Modal Contrib
function openAddContrib(goalId, name) {
  modalGoalId.value = goalId
  modalGoalName.value = name
  modalContribDate.value = getTodayKey()
  modalContribAmount.value = ''
  modalContribNote.value = ''
  showAddContribModal.value = true
}

function saveModalContrib() {
  if (!modalContribAmount.value || modalContribAmount.value <= 0 || !modalContribDate.value) {
    alert('Please enter a valid amount and date.')
    return
  }

  const contrib = {
    id: Date.now() + '_' + Math.random().toString(36).slice(2),
    goalId: modalGoalId.value,
    amount: parseFloat(modalContribAmount.value),
    date: modalContribDate.value,
    note: modalContribNote.value.trim()
  }

  store.addSavingsContribution(contrib)
  showAddContribModal.value = false
}

// Direct Form Contrib
function saveDirectContrib() {
  if (!contribGoalId.value) {
    alert('Please select a goal.')
    return
  }
  if (!contribAmount.value || contribAmount.value <= 0 || !contribDate.value) {
    alert('Please fill in amount and date.')
    return
  }

  const contrib = {
    id: Date.now() + '_' + Math.random().toString(36).slice(2),
    goalId: contribGoalId.value,
    amount: parseFloat(contribAmount.value),
    date: contribDate.value,
    note: contribNote.value.trim()
  }

  store.addSavingsContribution(contrib)
  
  // Reset
  contribGoalId.value = ''
  contribAmount.value = ''
  contribNote.value = ''
  contribDate.value = getTodayKey()
}

function deleteContribution(id) {
  store.showConfirm({
    title: 'Delete Contribution?',
    message: 'Are you sure you want to delete this contribution log?',
    confirmText: 'Delete',
    onConfirm: () => {
      store.deleteSavingsContribution(id)
    }
  })
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
.stat-value.income {
  color: #16a34a;
}
.stat-value.purple {
  color: var(--accent-purple);
}
.stat-value.green {
  color: #22c55e;
}

.goals-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 16px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.goal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s;
}
.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.goal-completed {
  border-color: rgba(34, 197, 94, 0.4);
  background: var(--accent-green-light);
}

.goal-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}
.goal-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.goal-emoji {
  font-size: 24px;
}
.goal-name {
  font-weight: 750;
  font-size: 16px;
  color: var(--text-heading);
}
.complete-badge {
  font-size: 11px;
  font-weight: 700;
  color: #16a34a;
}

.goal-actions {
  display: flex;
  gap: 6px;
}

.goal-amounts {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 12px;
}

.goal-bar-wrap {
  height: 8px;
  background: var(--bg-subtle);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 10px;
}
.goal-bar-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--accent-purple), #22c55e);
  transition: width 0.4s ease;
}

.goal-footer {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
}
.goal-pct {
  color: var(--accent-purple);
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
  border-color: var(--accent-purple);
}
.two-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.contrib-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 480px;
  overflow-y: auto;
}
.contrib-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.2s;
}
.contrib-item:hover {
  transform: translateY(-1px);
}
.contrib-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.contrib-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.contrib-meta {
  font-size: 11px;
  color: var(--text-secondary);
}
.contrib-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.contrib-amount {
  font-size: 14px;
  font-weight: 800;
  color: #16a34a;
}

.btn-del {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  line-height: 1;
}
.btn-del:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.btn-danger-sm {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  line-height: 1;
}
.btn-danger-sm:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
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
  background: var(--accent-purple);
  color: #fff;
}
.btn-primary:hover {
  background: var(--accent-purple-hover);
}
.btn-outline {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color-strong);
}
.btn-outline:hover {
  background: var(--bg-subtle);
}
.btn-sm {
  padding: 5px 12px;
  font-size: 12px;
  border-radius: 8px;
}

.empty-msg-panel {
  text-align: center;
  background: var(--bg-card);
  border: 1.5px dashed var(--border-color-strong);
  border-radius: 24px;
  padding: 48px 20px;
}

.empty-msg {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 14px;
}

/* Modals Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 28px;
  width: 90%;
  max-width: 440px;
  box-shadow: var(--shadow-lg);
  animation: fadeInUp 0.3s ease;
}
.modal-content h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-heading);
  margin-top: 0;
  margin-bottom: 20px;
}
</style>
