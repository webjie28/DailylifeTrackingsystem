<template>
  <div class="goals-view">
    <div class="finance-header">
      <div>
        <h1>Goals Board</h1>
        <p style="color: var(--text-muted); margin-top: 4px; font-size: 14px;">
          Set long-term life goals, define milestone paths, and monitor your progress
        </p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showAddModal = true">+ Add Long-term Goal</button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Active Goals</div>
        <div class="stat-value orange">{{ activeGoalsCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Milestones Completed</div>
        <div class="stat-value purple">{{ totalMilestonesCompleted }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Completed Goals</div>
        <div class="stat-value green">{{ completedGoalsCount }}</div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="goals-container" style="margin-bottom: 32px;">
      <div v-if="store.longtermGoalsList.length === 0" class="empty-msg-panel">
        <p>No goals defined yet. Create your first long-term target!</p>
        <button class="btn btn-primary" style="margin-top: 10px;" @click="showAddModal = true">
          Add Goal
        </button>
      </div>

      <div v-else class="goals-grid">
        <div 
          v-for="goal in goalsWithCalculatedProgress" 
          :key="goal.id" 
          class="goal-card"
          :class="{ 'goal-completed-card': goal.percentage >= 100 }"
        >
          <div class="card-inner-top">
            <div class="goal-card-header">
              <div class="goal-emoji-title">
                <span class="goal-title">{{ goal.title }}</span>
              </div>
              <span class="goal-cat" :class="'cat-' + goal.category">{{ goal.category }}</span>
            </div>

            <!-- Milestones Checkboxes -->
            <div class="goal-milestones-box">
              <div 
                v-for="(milestone, idx) in goal.milestones" 
                :key="idx" 
                class="milestone-item" 
                :class="{ done: milestone.done }"
                @click="store.toggleMilestone(goal.id, idx)"
              >
                <input type="checkbox" :checked="milestone.done" @click.stop />
                <span>{{ milestone.text }}</span>
              </div>
              <div v-if="goal.milestones.length === 0" style="font-size: 12px; color: var(--text-muted);">
                No milestones defined.
              </div>
            </div>
          </div>

          <div class="card-inner-bottom">
            <div class="goal-deadline">
              <span>{{ goal.deadline || 'No deadline' }}</span>
              <strong :class="{ overdue: goal.daysLeftText.includes('Overdue') }">
                {{ goal.daysLeftText }}
              </strong>
            </div>

            <div class="goal-bar-wrap">
              <div class="goal-bar-fill" :style="{ width: goal.percentage + '%' }"></div>
            </div>

            <div class="goal-footer">
              <span class="goal-pct">{{ goal.percentage }}% done</span>
              <div class="goal-actions">
                <button class="goal-btn-delete" @click="deleteGoal(goal.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Goal Modal Overlay -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="showAddModal = false">
      <div class="modal-content">
        <h3>Schedule Long-term Goal</h3>
        <form @submit.prevent="saveGoal">
          <div class="form-group">
            <label>Goal Title</label>
            <input type="text" v-model="newGoalTitle" placeholder="e.g. Graduate college, Buy house" required />
          </div>
          <div class="two-input">
            <div class="form-group">
              <label>Category</label>
              <select v-model="newGoalCategory">
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="finance">Finance</option>
                <option value="study">Study / Career</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Target Deadline</label>
              <input type="date" v-model="newGoalDeadline" required />
            </div>
          </div>
          <div class="form-group">
            <label>Milestones (One per line)</label>
            <textarea 
              v-model="newGoalMilestones" 
              placeholder="e.g.&#10;Enroll in course&#10;Study 2 hours daily&#10;Pass mock exam"
              rows="4"
              class="milestones-textarea"
              required
            ></textarea>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="submit" class="btn btn-primary" style="flex: 1;">Save Goal</button>
            <button type="button" class="btn btn-outline" @click="showAddModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

const showAddModal = ref(false)

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
  return store.longtermGoalsList.filter(g => g.milestones.some(m => !m.done)).length
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
  if (!confirm('Delete this long-term goal?')) return
  store.deleteLongtermGoal(id)
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
.stat-value.orange {
  color: #f97316;
}
.stat-value.green {
  color: #22c55e;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.goal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 280px;
}
.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.goal-completed-card {
  border-color: rgba(34, 197, 94, 0.4);
  background: var(--accent-green-light);
}

.goal-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
}
.goal-emoji-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.goal-emoji {
  font-size: 24px;
}
.goal-title {
  font-weight: 750;
  font-size: 16px;
  color: var(--text-heading);
}

.goal-cat {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}
.goal-cat.cat-personal { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
.goal-cat.cat-health { color: #22c55e; background: rgba(34, 197, 94, 0.1); }
.goal-cat.cat-finance { color: #f97316; background: rgba(249, 115, 22, 0.1); }
.goal-cat.cat-study { color: #7c3aed; background: rgba(124, 58, 237, 0.1); }
.goal-cat.cat-other { color: #64748b; background: rgba(100, 116, 139, 0.1); }

.goal-milestones-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}
.milestone-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--bg-subtle);
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.milestone-item input {
  width: 16px;
  height: 16px;
  accent-color: #22c55e;
  cursor: pointer;
}
.milestone-item.done {
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.2);
}
.milestone-item.done span {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.goal-deadline {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}
.goal-deadline strong.overdue {
  color: #ef4444;
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
  background: linear-gradient(90deg, #7c3aed, #22c55e);
  transition: width 0.4s ease;
}

.goal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
}
.goal-pct {
  color: #7c3aed;
}
.goal-btn-delete {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: color 0.2s;
}
.goal-btn-delete:hover {
  color: #ef4444;
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
.form-group input, .form-group select, .form-group textarea {
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
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #7c3aed;
}
.milestones-textarea {
  resize: vertical;
  line-height: 1.5;
}
.two-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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

.empty-msg-panel {
  text-align: center;
  background: var(--bg-card);
  border: 1.5px dashed var(--border-color-strong);
  border-radius: 24px;
  padding: 48px 20px;
}

/* Modals Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
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
