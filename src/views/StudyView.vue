<template>
  <div class="study-view">
    <div class="finance-header">
      <div>
        <h1>Study &amp; Books</h1>
        <p style="color: var(--text-muted); margin-top: 4px; font-size: 14px;">
          Boost productivity with the Pomodoro Timer, manage study logs, and track reading books
        </p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showBookModal = true">+ Add Book</button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Study Time</div>
        <div class="stat-value purple">{{ store.studyTotalTime }} mins</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Books Completed</div>
        <div class="stat-value green">{{ completedBooksCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Currently Reading</div>
        <div class="stat-value orange">{{ readingBooksCount }}</div>
      </div>
    </div>

    <div class="two-col">
      <!-- Left Column: Pomodoro Timer and Session Notes -->
      <div class="left-col">
        <!-- Pomodoro Timer Panel -->
        <div class="panel timer-panel" style="text-align: center;">
          <div class="timer-mode-badge-wrap">
            <span 
              class="timer-mode-badge"
              :class="{ 'break-mode': isBreak, 'focus-mode': !isBreak }"
            >
              {{ isBreak ? 'Break Time' : 'Focus Session' }}
            </span>
          </div>
          
          <div class="timer-display">{{ formattedTime }}</div>

          <div class="timer-controls">
            <button class="btn-timer play" @click="toggleTimer">
              {{ isRunning ? '⏸' : '▶' }}
            </button>
            <button class="btn-timer reset" @click="resetTimer">
              Reset
            </button>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 15px;">
            Focus for 25 minutes, followed by a 5-minute break.
          </p>
        </div>

        <!-- Session Notes Panel -->
        <div class="panel">
          <h3>Study Session Notes</h3>
          <div class="form-group" style="margin-bottom: 0;">
            <textarea 
              v-model="sessionNotes" 
              @input="saveNotes"
              class="notes-textarea" 
              placeholder="Jot down formulas, ideas, summaries, or homework to-dos from your study session..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Right Column: Reading Tracker -->
      <div class="right-col">
        <div class="panel">
          <h3>Reading Progress Tracker</h3>
          <div class="books-list">
            <div v-if="store.studyBooksList.length === 0" class="empty-msg">
              No books registered. Add a book to track your reading progress!
            </div>
            
            <div 
              v-else 
              v-for="book in booksWithProgress" 
              :key="book.id" 
              class="book-card"
              :class="{ 'book-completed': book.status === 'completed' }"
            >
              <div class="book-top">
                <div class="book-info-wrap">
                  <div class="book-text-details">
                    <div class="book-title">{{ book.title }}</div>
                    <div class="book-author">by {{ book.author }}</div>
                  </div>
                </div>
                <div class="book-actions">
                  <button class="btn-del" @click="openEditBook(book)" title="Edit Page Progress">Edit</button>
                  <button class="btn-del" @click="deleteBook(book.id)" title="Remove Book">✕</button>
                </div>
              </div>

              <div class="book-amounts">
                Page <strong>{{ book.currentPage }}</strong> of <strong>{{ book.totalPages }}</strong>
                <span style="margin-left: 6px; font-weight: 700; text-transform: uppercase; font-size: 11px;" :class="book.status">
                  · {{ book.status }}
                </span>
              </div>

              <div class="goal-bar-wrap">
                <div class="goal-bar-fill" :style="{ width: book.percentage + '%' }"></div>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: var(--text-muted);">
                <span>{{ book.percentage }}% Finished</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Add / Edit Book Modal -->
    <div class="modal-overlay" v-if="showBookModal" @click.self="closeBookModal">
      <div class="modal-content">
        <h3>{{ editingBookId ? 'Edit Book Progress' : 'Add New Book to Library' }}</h3>
        <form @submit.prevent="saveBook">
          <div class="form-group">
            <label>Book Title</label>
            <input type="text" v-model="bookTitle" placeholder="e.g. Clean Code, Atomic Habits" required :disabled="!!editingBookId" />
          </div>
          <div class="form-group">
            <label>Author</label>
            <input type="text" v-model="bookAuthor" placeholder="e.g. James Clear" :disabled="!!editingBookId" />
          </div>
          <div class="two-input">
            <div class="form-group">
              <label>Current Page</label>
              <input type="number" v-model.number="bookCurrentPage" min="0" placeholder="0" required />
            </div>
            <div class="form-group">
              <label>Total Pages</label>
              <input type="number" v-model.number="bookTotalPages" min="1" placeholder="100" required :disabled="!!editingBookId" />
            </div>
          </div>
          <div class="form-group">
            <label>Reading Status</label>
            <select v-model="bookStatus">
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
              <option value="to-read">To Read</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="submit" class="btn btn-primary" style="flex: 1;">
              {{ editingBookId ? 'Update Progress' : 'Add Book' }}
            </button>
            <button type="button" class="btn btn-outline" @click="closeBookModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

// Timer States
const timeRemaining = ref(1500) // 25 mins
const isRunning = ref(false)
const isBreak = ref(false)
let timerId = null

// Notes state
const sessionNotes = ref(store.studySessionNotes)

// Book Form States
const showBookModal = ref(false)
const editingBookId = ref(null)
const bookTitle = ref('')
const bookAuthor = ref('')
const bookCurrentPage = ref('')
const bookTotalPages = ref('')
const bookStatus = ref('reading')

// Format MM:SS
const formattedTime = computed(() => {
  const m = Math.floor(timeRemaining.value / 60).toString().padStart(2, '0')
  const s = (timeRemaining.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

// Book stats
const booksWithProgress = computed(() => {
  return store.studyBooksList.map(b => {
    const total = parseInt(b.totalPages) || 1
    const curr = parseInt(b.currentPage) || 0
    const percentage = Math.min(100, Math.round((curr / total) * 100))
    return {
      ...b,
      percentage
    }
  })
})

const completedBooksCount = computed(() => {
  return store.studyBooksList.filter(b => b.status === 'completed').length
})

const readingBooksCount = computed(() => {
  return store.studyBooksList.filter(b => b.status === 'reading').length
})

// Timer controls
function toggleTimer() {
  if (isRunning.value) {
    clearInterval(timerId)
    isRunning.value = false
  } else {
    isRunning.value = true
    timerId = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        // Voice alert
        try {
          const synth = window.speechSynthesis
          if (synth) {
            const utterance = new SpeechSynthesisUtterance(
              isBreak.value ? 'Break is over, time to focus!' : 'Focus session complete, time for a break!'
            )
            synth.speak(utterance)
          }
        } catch (e) {}

        if (!isBreak.value) {
          // Focus finished -> add 25 study minutes
          store.addStudyMinutes(25)
          isBreak.value = true
          timeRemaining.value = 300 // 5 min break
        } else {
          // Break finished
          isBreak.value = false
          timeRemaining.value = 1500 // 25 min focus
        }
      }
    }, 1000)
  }
}

function resetTimer() {
  if (timerId) clearInterval(timerId)
  isRunning.value = false
  isBreak.value = false
  timeRemaining.value = 1500
}

// Notes
function saveNotes() {
  store.saveStudyNotes(sessionNotes.value)
}

// Book CRUD
function saveBook() {
  if (!bookTitle.value.trim() || !bookCurrentPage.value) {
    alert('Please fill out necessary fields.')
    return
  }

  // Cap current page at total pages
  const total = parseInt(bookTotalPages.value) || 1
  let curr = parseInt(bookCurrentPage.value) || 0
  if (curr > total) curr = total

  // Auto set status to completed if read 100%
  let status = bookStatus.value
  if (curr === total) status = 'completed'

  if (editingBookId.value) {
    store.updateBook(editingBookId.value, {
      currentPage: curr,
      status
    })
    closeBookModal()
  } else {
    const newBook = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2),
      title: bookTitle.value.trim(),
      author: bookAuthor.value.trim() || 'Unknown',
      currentPage: curr,
      totalPages: total,
      status
    }
    store.addBook(newBook)
    closeBookModal()
  }
}

function openEditBook(book) {
  editingBookId.value = book.id
  bookTitle.value = book.title
  bookAuthor.value = book.author
  bookCurrentPage.value = book.currentPage
  bookTotalPages.value = book.totalPages
  bookStatus.value = book.status
  showBookModal.value = true
}

function deleteBook(id) {
  if (!confirm('Are you sure you want to remove this book?')) return
  store.deleteBook(id)
}

function closeBookModal() {
  editingBookId.value = null
  bookTitle.value = ''
  bookAuthor.value = ''
  bookCurrentPage.value = ''
  bookTotalPages.value = ''
  bookStatus.value = 'reading'
  showBookModal.value = false
}

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
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
.stat-value.orange {
  color: #f97316;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 900px) {
  .two-col {
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

/* Timer styles */
.timer-panel {
  padding: 40px 24px;
}
.timer-mode-badge-wrap {
  margin-bottom: 18px;
}
.timer-mode-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.timer-mode-badge.focus-mode {
  background: var(--accent-purple-light);
  color: var(--accent-purple);
}
.timer-mode-badge.break-mode {
  background: var(--accent-green-light);
  color: var(--accent-green);
}

.timer-display {
  font-size: 78px;
  font-weight: 800;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text-heading);
  line-height: 1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  align-items: center;
}
.btn-timer {
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}
.btn-timer.play {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #7c3aed;
  color: #fff;
  font-size: 24px;
}
.btn-timer.play:hover {
  background: #5b21b6;
  transform: scale(1.05);
}
.btn-timer.reset {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--bg-subtle);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  font-size: 18px;
}
.btn-timer.reset:hover {
  background: var(--bg-card);
  transform: scale(1.05);
}

.notes-textarea {
  width: 100%;
  height: 200px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-input-inset);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
}
.notes-textarea:focus {
  border-color: #7c3aed;
}

/* Books tracker styles */
.books-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 520px;
  overflow-y: auto;
}
.book-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 18px;
  transition: all 0.2s;
}
.book-card:hover {
  transform: translateY(-1px);
}
.book-completed {
  border-color: rgba(34, 197, 94, 0.3);
  background: var(--accent-green-light);
}

.book-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.book-info-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.book-icon {
  font-size: 24px;
}
.book-text-details {
  display: flex;
  flex-direction: column;
}
.book-title {
  font-weight: 750;
  font-size: 15px;
  color: var(--text-primary);
}
.book-author {
  font-size: 12px;
  color: var(--text-secondary);
}

.book-actions {
  display: flex;
  gap: 4px;
}

.book-amounts {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}
.book-amounts .reading {
  color: #f97316;
}
.book-amounts .completed {
  color: #16a34a;
}
.book-amounts .to-read {
  color: #7c3aed;
}

.goal-bar-wrap {
  height: 6px;
  background: var(--bg-subtle);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 8px;
}
.goal-bar-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #7c3aed, #22c55e);
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
