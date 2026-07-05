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
                <button class="goal-btn-delete" @click="deleteGoal(goal.id)" title="Delete Goal">
                  <svg class="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended SDLC Projects Shelf -->
    <section class="animate-in" style="margin-top: 48px; margin-bottom: 32px;">
      <h3 style="font-size: 20px; font-weight: 800; color: var(--text-heading); margin-bottom: 16px;">
        Recommended Future Projects (SDLC Structured)
      </h3>
      <div class="recommendations-grid">
        <div v-for="proj in recommendedProjects" :key="proj.id" class="recommend-card">
          <div class="recommend-header">
            <h4>{{ proj.title }}</h4>
            <span class="recommend-cat">{{ proj.category }}</span>
          </div>
          <p class="recommend-desc">{{ proj.description }}</p>
          
          <div class="recommend-milestones">
            <div v-for="(m, i) in proj.milestones" :key="i" class="recommend-milestone-item">
              <span class="m-bullet">▪</span>
              <span>{{ m.text }}</span>
            </div>
          </div>
          
          <button class="btn btn-outline" style="width: 100%; margin-top: auto;" @click="importProjectGoal(proj)">
            + Add to Goals Board
          </button>
        </div>
      </div>
    </section>

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

// Recommended SDLC Projects template data
const recommendedProjects = [
  {
    id: 'blog_cms',
    title: 'Developer Blog & CMS',
    category: 'Study',
    description: 'A personal technical blog with markdown rendering, SEO meta fields, tag filters, and local headless CMS database integration.',
    milestones: [
      { text: 'Phase 1 (Planning): Select headless CMS & define posts schema' },
      { text: 'Phase 2 (Design): Sketch responsive blog card layouts & dark theme overrides' },
      { text: 'Phase 3 (Dev): Code article page renderer & GraphQL query services' },
      { text: 'Phase 4 (Testing): Audit site with Google Lighthouse and verify forms' },
      { text: 'Phase 5 (Deploy): Set up continuous deployment to Vercel/Netlify' }
    ]
  },
  {
    id: 'kanban_board',
    title: 'Kanban Collaboration Board',
    category: 'Productivity',
    description: 'A board displaying project tasks in columns (Todo, In Progress, Review, Done) with smooth drag-and-drop, card categories, and search.',
    milestones: [
      { text: 'Phase 1 (Planning): Draft state flow diagram & task schema specifications' },
      { text: 'Phase 2 (Design): Wireframe column groups and task card layouts' },
      { text: 'Phase 3 (Dev): Implement HTML5 Drag & Drop operations and card filters' },
      { text: 'Phase 4 (Testing): Verify task sorting, card movements, and state persistence' },
      { text: 'Phase 5 (Deploy): Deploy fully functional prototype to GitHub pages' }
    ]
  },
  {
    id: 'crypto_analytics',
    title: 'Crypto Analytics Dashboard',
    category: 'Finance',
    description: 'A financial dashboard fetching live crypto token prices, plotting interactive price charts, tracking portfolio values, and firing indicators.',
    milestones: [
      { text: 'Phase 1 (Planning): Register CoinGecko API keys & define target assets' },
      { text: 'Phase 2 (Design): Grid mockup for candlestick chart & price alert modal' },
      { text: 'Phase 3 (Dev): Code Chart.js candlestick data queries & portfolio calculator' },
      { text: 'Phase 4 (Testing): Validate rendering speeds & test asset price alarms' },
      { text: 'Phase 5 (Deploy): Compile desktop application wrapper using Electron' }
    ]
  }
]

function importProjectGoal(proj) {
  if (!confirm(`Add "${proj.title}" as a new Goal with SDLC milestones to your board?`)) return
  
  const deadlineDate = new Date()
  deadlineDate.setDate(deadlineDate.getDate() + 30)
  const deadlineStr = deadlineDate.toISOString().split('T')[0]
  
  const newGoal = {
    id: Date.now() + '_' + Math.random().toString(36).slice(2),
    title: proj.title,
    category: proj.category.toLowerCase(),
    deadline: deadlineStr,
    emoji: '🎯',
    milestones: proj.milestones.map(m => ({ text: m.text, done: false }))
  }
  
  store.addLongtermGoal(newGoal)
  alert(`"${proj.title}" successfully added to your Goals Board!`)
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
  color: var(--accent-purple);
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
.goal-cat.cat-study { color: var(--accent-purple); background: var(--accent-purple-light); }
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
  background: linear-gradient(90deg, var(--accent-purple), #22c55e);
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
  color: var(--accent-purple);
}
.goal-btn-delete {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}
.goal-btn-delete:hover {
  background: #ef4444;
  color: #ffffff;
  border-color: #ef4444;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}
.trash-icon {
  width: 12px;
  height: 12px;
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
  border-color: var(--accent-purple);
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

/* ── Recommended Projects SDLC Shelf Styling ───────────── */
.recommendations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 16px;
}
.recommend-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 24px;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    transition: transform 0.25s, box-shadow 0.25s;
    min-height: 380px;
    text-align: left;
}
.recommend-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}
.recommend-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
}
.recommend-header h4 {
    font-size: 16px;
    font-weight: 750;
    color: var(--text-heading);
    margin: 0;
}
.recommend-cat {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    color: var(--accent-purple);
    background: var(--accent-purple-light);
}
.recommend-desc {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.4;
    margin: 0 0 16px;
}
.recommend-milestones {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
}
.recommend-milestone-item {
    display: flex;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
}
.m-bullet {
    color: var(--time-accent, var(--accent-purple));
}
</style>
