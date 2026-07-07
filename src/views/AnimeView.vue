<template>
  <div class="anime-view">
    <div class="finance-header">
      <div>
        <h1>Watchlist</h1>
        <p style="color: var(--text-muted); margin-top: 4px; font-size: 14px;">
          Keep tabs on your favorite series and movies, log episodes, and rate completed shows
        </p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openAddModal">+ Add Watch</button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Shows</div>
        <div class="stat-value purple">{{ (store.animeWatchlist || []).length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Currently Watching</div>
        <div class="stat-value orange">{{ watchingCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Completed Shows</div>
        <div class="stat-value green">{{ completedCount }}</div>
      </div>
    </div>

    <!-- Watchlist Panel -->
    <div class="panel">
      <div class="controls-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
        <div class="filter-tabs" style="display: flex; gap: 4px;">
          <button 
            v-for="f in ['all', 'watching', 'completed', 'planning', 'dropped']" 
            :key="f"
            class="tab-btn"
            :class="{ active: currentFilter === f }"
            @click="currentFilter = f"
          >
            {{ formatFilterLabel(f) }}
          </button>
        </div>
        <input 
          type="text" 
          v-model="searchQuery" 
          class="search-input" 
          placeholder=" Search watchlist..." 
          style="padding: 8px 14px; border-radius: 12px; border: 1px solid var(--border-color-strong); background: var(--bg-card); color: var(--text-primary); outline: none; font-size: 13px; width: min(280px, 100%);"
        />
      </div>

      <div class="anime-list-grid">
        <div v-if="filteredAnime.length === 0" class="empty-msg">
          No shows match the selected filter.
        </div>

        <div 
          v-else 
          v-for="anime in filteredAnime" 
          :key="anime.id" 
          class="anime-card"
          :class="anime.status"
        >
          <div class="anime-card-top">
            <div class="anime-title-block">
              <span class="format-badge">{{ anime.format }}</span>
              <span class="anime-card-title">{{ anime.title }}</span>
            </div>
            <div class="anime-actions">
              <button class="btn-del" @click="editAnime(anime.id)" title="Edit">Edit</button>
              <button class="btn-del" @click="deleteAnime(anime.id)" title="Delete">✕</button>
            </div>
          </div>

          <div class="anime-progress-row" v-if="anime.format !== 'Movie'">
            <span class="progress-lbl">Progress:</span>
            <div class="episode-controls">
              <button 
                class="ep-btn" 
                @click="decrementEpisode(anime)"
                :disabled="anime.currentEpisode <= 0"
              >
                -
              </button>
              <span class="ep-count">
                {{ anime.currentEpisode }} / {{ anime.totalEpisodes || '?' }}
              </span>
              <button 
                class="ep-btn" 
                @click="incrementEpisode(anime)"
                :disabled="anime.totalEpisodes && anime.currentEpisode >= anime.totalEpisodes"
              >
                +
              </button>
            </div>
          </div>

          <div class="goal-bar-wrap" style="margin-top: 10px; margin-bottom: 10px;" v-if="anime.format !== 'Movie'">
            <div class="goal-bar-fill" :style="{ width: calculateProgressPercentage(anime) + '%' }"></div>
          </div>

          <div class="anime-card-footer">
            <span class="rating-display">
              {{ anime.rating > 0 ? anime.rating + '/10' : 'Unrated' }}
            </span>
            <span class="status-indicator-badge" :class="anime.status">
              {{ formatStatusLabel(anime.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal Overlay -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <button class="modal-close" @click="closeModal">×</button>
        <div class="modal-header">
          <h3>{{ editingId ? 'Edit Entry' : 'Add New Entry' }}</h3>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAnime">
            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="animeTitle" placeholder="e.g. Moneyball, Breaking Bad" required />
            </div>

            <div class="two-input">
              <div class="form-group">
                <label>Format</label>
                <select v-model="animeFormat">
                  <option value="TV">TV Series</option>
                  <option value="Movie">Movie</option>
                  <option value="OVA">OVA / Special</option>
                  <option value="KDrama">KDrama</option>
                </select>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select v-model="animeStatus">
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="planning">Plan to Watch</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>
            </div>

            <div class="two-input" v-if="animeFormat !== 'Movie'">
              <div class="form-group">
                <label>Current Episode</label>
                <input type="number" v-model.number="animeCurrentEpisode" min="0" placeholder="0" />
              </div>
              <div class="form-group">
                <label>Total Episodes</label>
                <input type="number" v-model.number="animeTotalEpisodes" min="1" placeholder="12" />
              </div>
            </div>

            <div class="form-group">
              <label>My Rating (1-10)</label>
              <select v-model.number="animeRating">
                <option value="0">Unrated</option>
                <option v-for="n in 10" :key="n" :value="n">⭐ {{ n }}/10</option>
              </select>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 20px;">
              <button type="submit" class="btn btn-primary" style="width: 100%;">
                {{ editingId ? 'Update Entry' : 'Save Entry' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

// Form states
const animeTitle = ref('')
const animeFormat = ref('TV')
const animeStatus = ref('watching')
const animeCurrentEpisode = ref(0)
const animeTotalEpisodes = ref(12)
const animeRating = ref(0)
const editingId = ref(null)

// Filtering state
const currentFilter = ref('all')
const showAddModal = ref(false)
const searchQuery = ref('')

// Statistics
const watchingCount = computed(() => {
  return (store.animeWatchlist || []).filter(a => a && a.status === 'watching').length
})

const completedCount = computed(() => {
  return (store.animeWatchlist || []).filter(a => a && a.status === 'completed').length
})

const filteredAnime = computed(() => {
  const list = store.animeWatchlist || []
  return list.filter(a => {
    if (!a) return false
    
    // Status filter
    if (currentFilter.value !== 'all' && a.status !== currentFilter.value) {
      return false
    }
    
    // Search query filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      return a.title && a.title.toLowerCase().includes(q)
    }
    
    return true
  }).sort((a, b) => {
    const titleA = (a && a.title) || ''
    const titleB = (b && b.title) || ''
    return titleA.localeCompare(titleB)
  })
})

// Progress percentage bar
function calculateProgressPercentage(a) {
  if (!a || !a.totalEpisodes) return 0
  return Math.min(100, Math.round(((parseInt(a.currentEpisode) || 0) / a.totalEpisodes) * 100))
}

// Helpers
function formatFilterLabel(f) {
  if (f === 'planning') return 'Plan to Watch'
  return f.charAt(0).toUpperCase() + f.slice(1)
}

function formatStatusLabel(s) {
  if (s === 'watching') return 'Watching'
  if (s === 'completed') return 'Completed'
  if (s === 'dropped') return 'Dropped'
  return 'Plan to Watch'
}

// CRUD
function saveAnime() {
  if (!animeTitle.value.trim()) {
    alert('Please enter a title.')
    return
  }

  let total = parseInt(animeTotalEpisodes.value) || 0
  let current = parseInt(animeCurrentEpisode.value) || 0

  if (animeFormat.value === 'Movie') {
    total = 1
    current = animeStatus.value === 'completed' ? 1 : 0
  } else {
    if (total > 0 && current > total) current = total
  }

  // Auto set status to completed if episodes reach max
  let status = animeStatus.value
  if (total > 0 && current === total) {
    status = 'completed'
  }

  const animeData = {
    id: editingId.value || Date.now() + '_' + Math.random().toString(36).slice(2),
    title: animeTitle.value.trim(),
    format: animeFormat.value,
    status: status,
    currentEpisode: current,
    totalEpisodes: total,
    rating: parseInt(animeRating.value) || 0
  }

  if (editingId.value) {
    store.updateAnime(editingId.value, animeData)
  } else {
    store.addAnime(animeData)
  }
  closeModal()
}

function openAddModal() {
  editingId.value = null
  resetForm()
  showAddModal.value = true
}

function editAnime(id) {
  const list = store.animeWatchlist || []
  const a = list.find(item => item && item.id === id)
  if (!a) return
  editingId.value = id
  animeTitle.value = a.title
  animeFormat.value = a.format || 'TV'
  animeStatus.value = a.status
  animeCurrentEpisode.value = a.currentEpisode
  animeTotalEpisodes.value = a.totalEpisodes
  animeRating.value = a.rating
  showAddModal.value = true
}

function deleteAnime(id) {
  if (!confirm('Remove this anime from your watchlist?')) return
  store.deleteAnime(id)
  if (editingId.value === id) closeModal()
}

function incrementEpisode(anime) {
  const total = parseInt(anime.totalEpisodes) || 0
  let current = parseInt(anime.currentEpisode) || 0
  current++
  
  if (total > 0 && current > total) current = total
  
  let status = anime.status
  if (total > 0 && current === total) {
    status = 'completed'
  }

  store.updateAnime(anime.id, { currentEpisode: current, status })
}

watch(animeCurrentEpisode, (currVal) => {
  const total = parseInt(animeTotalEpisodes.value) || 0
  if (total > 0 && currVal >= total) {
    animeStatus.value = 'completed'
  }
})

function decrementEpisode(anime) {
  let current = parseInt(anime.currentEpisode) || 0
  current--
  if (current < 0) current = 0
  store.updateAnime(anime.id, { currentEpisode: current })
}

function closeModal() {
  showAddModal.value = false
  editingId.value = null
  resetForm()
}

function resetForm() {
  animeTitle.value = ''
  animeFormat.value = 'TV'
  animeStatus.value = 'watching'
  animeCurrentEpisode.value = 0
  animeTotalEpisodes.value = 12
  animeRating.value = 0
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

.panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
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

/* Tabs */
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
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}
.tab-btn.active {
  background: var(--nav-active-bg);
  color: var(--nav-active-color);
  box-shadow: var(--shadow-sm);
}

/* Anime Card Layout */
.anime-list-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 520px;
  overflow-y: auto;
}
.anime-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 18px;
  transition: all 0.2s;
}
.anime-card:hover {
  transform: translateY(-1px);
}
.anime-card.completed {
  border-color: rgba(34, 197, 94, 0.3);
  background: var(--accent-green-light);
}
.anime-card.dropped {
  border-color: rgba(239, 68, 68, 0.3);
  background: var(--accent-red-bg);
}

.anime-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.anime-title-block {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.format-badge {
  font-size: 10px;
  font-weight: 700;
  background: var(--accent-purple-light);
  color: var(--accent-purple);
  padding: 2px 6px;
  border-radius: 6px;
}
.anime-card-title {
  font-weight: 750;
  font-size: 15px;
  color: var(--text-primary);
}
.anime-actions {
  display: flex;
  gap: 4px;
}

.anime-progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-secondary);
}
.episode-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ep-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-card);
  color: var(--text-primary);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.ep-btn:hover:not(:disabled) {
  background: var(--accent-purple-hover);
  color: #fff;
  border-color: var(--accent-purple-hover);
}
.ep-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ep-count {
  font-weight: 800;
  font-size: 14px;
  color: var(--text-primary);
}

.goal-bar-wrap {
  height: 6px;
  background: var(--bg-subtle);
  border-radius: 99px;
  overflow: hidden;
}
.goal-bar-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--accent-purple), #22c55e);
}

.anime-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
}
.rating-display {
  color: #f59e0b;
}
.status-indicator-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 99px;
  background: var(--bg-card);
}
.status-indicator-badge.watching {
  color: #f97316;
  background: rgba(249, 115, 22, 0.1);
}
.status-indicator-badge.completed {
  color: #16a34a;
  background: rgba(34, 197, 94, 0.1);
}
.status-indicator-badge.planning {
  color: var(--accent-purple);
  background: var(--accent-purple-light);
}
.status-indicator-badge.dropped {
  color: #f87171;
  background: rgba(248, 113, 113, 0.15);
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

.empty-msg {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 14px;
}
</style>
