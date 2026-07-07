<template>
  <div class="study-view">
    <div class="study-header">
      <div>
        <h1>Study Hub</h1>
        <p class="study-subtitle">
          Focus sessions, study logs, and reading progress — all in one place.
        </p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showBookModal = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16" style="vertical-align: -2px; margin-right: 6px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Book
        </button>
      </div>
    </div>

    <!-- Summary Stats with Mini Rings -->
    <div class="stats-row animate-in delay-100">
      <!-- Total Study Time -->
      <div class="stat-card-glass">
        <div class="stat-glass-left">
          <div class="stat-glass-label">Total Study Time</div>
          <div class="stat-glass-value">{{ store.studyTotalTime }} <span class="stat-unit">mins</span></div>
        </div>
        <div class="stat-glass-right">
          <div class="mini-ring-wrap" style="--ring-color: #f97316;">
            <svg viewBox="0 0 36 36" class="mini-ring-svg">
              <circle class="ring-bg" cx="18" cy="18" r="15.915" fill="none" stroke-width="3"></circle>
              <circle class="ring-fill" cx="18" cy="18" r="15.915" fill="none" stroke-dasharray="100" :stroke-dashoffset="100 - Math.min(100, studyTimePercent)" stroke-width="3"></circle>
            </svg>
            <div class="mini-ring-icon-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Books Completed -->
      <div class="stat-card-glass">
        <div class="stat-glass-left">
          <div class="stat-glass-label">Books Completed</div>
          <div class="stat-glass-value" style="color: #22c55e;">{{ completedBooksCount }}</div>
        </div>
        <div class="stat-glass-right">
          <div class="mini-ring-wrap" style="--ring-color: #22c55e;">
            <svg viewBox="0 0 36 36" class="mini-ring-svg">
              <circle class="ring-bg" cx="18" cy="18" r="15.915" fill="none" stroke-width="3"></circle>
              <circle class="ring-fill" cx="18" cy="18" r="15.915" fill="none" stroke-dasharray="100" :stroke-dashoffset="100 - Math.min(100, completionPercent)" stroke-width="3"></circle>
            </svg>
            <div class="mini-ring-icon-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Currently Reading -->
      <div class="stat-card-glass">
        <div class="stat-glass-left">
          <div class="stat-glass-label">Currently Reading</div>
          <div class="stat-glass-value" style="color: #f97316;">{{ readingBooksCount }}</div>
        </div>
        <div class="stat-glass-right">
          <div class="mini-ring-wrap" style="--ring-color: #3b82f6;">
            <svg viewBox="0 0 36 36" class="mini-ring-svg">
              <circle class="ring-bg" cx="18" cy="18" r="15.915" fill="none" stroke-width="3"></circle>
              <circle class="ring-fill" cx="18" cy="18" r="15.915" fill="none" stroke-dasharray="100" :stroke-dashoffset="100 - Math.min(100, readingPercent)" stroke-width="3"></circle>
            </svg>
            <div class="mini-ring-icon-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="two-col animate-in delay-200">
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
              <svg v-if="!isRunning" viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            </button>
            <button class="btn-timer reset" @click="resetTimer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            </button>
          </div>
          <p class="timer-hint">
            Focus for 25 minutes, followed by a 5-minute break.
          </p>
        </div>

        <!-- Session Notes Panel -->
        <div class="panel">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="vertical-align: -3px; margin-right: 8px; opacity: 0.6;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Study Session Notes
          </h3>
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
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="vertical-align: -3px; margin-right: 8px; opacity: 0.6;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
            Reading Progress Tracker
          </h3>
          <div class="books-list">
            <!-- Enhanced Empty State -->
            <div v-if="store.studyBooksList.length === 0" class="empty-state-books">
              <div class="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/>
                </svg>
              </div>
              <div class="empty-state-title">No Books Yet</div>
              <div class="empty-state-text">Start building your reading list. Track progress page by page and celebrate when you finish.</div>
              <button class="btn btn-primary btn-sm" @click="showBookModal = true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14" style="vertical-align: -2px; margin-right: 4px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Your First Book
              </button>
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
                  <button class="btn-action-sm" @click="openEditBook(book)" title="Edit Page Progress">Edit</button>
                  <button class="btn-action-sm btn-action-danger" @click="deleteBook(book.id)" title="Remove Book">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <div class="book-amounts">
                Page <strong>{{ book.currentPage }}</strong> of <strong>{{ book.totalPages }}</strong>
                <span class="book-status-pill" :class="book.status">
                  {{ book.status }}
                </span>
              </div>

              <div class="goal-bar-wrap">
                <div class="goal-bar-fill" :style="{ width: book.percentage + '%' }"></div>
              </div>

              <div class="book-progress-footer">
                <span>{{ book.percentage }}% Complete</span>
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
            <input type="text" v-model="bookTitle" placeholder="e.g. Clean Code, Atomic Habits" required />
          </div>
          <div class="form-group">
            <label>Author</label>
            <input type="text" v-model="bookAuthor" placeholder="e.g. James Clear" />
          </div>
          <div class="two-input">
            <div class="form-group">
              <label>Current Page</label>
              <input type="number" v-model.number="bookCurrentPage" min="0" placeholder="0" required />
            </div>
            <div class="form-group">
              <label>Total Pages</label>
              <input type="number" v-model.number="bookTotalPages" min="1" placeholder="100" required />
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
    <!-- Library Bookshelf -->
    <div class="panel bookshelf-panel animate-in delay-300" style="margin-top: 24px;">
      <h3 style="margin-bottom: 18px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="vertical-align: -3px; margin-right: 8px; opacity: 0.6;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
        Library Bookshelf
        <span style="font-size: 12px; font-weight: 400; color: var(--text-muted); margin-left: 8px;">({{ LIBRARY_BOOKS.length }} books)</span>
      </h3>
      <div class="library-grid">
        <div 
          v-for="book in LIBRARY_BOOKS" 
          :key="book.id" 
          class="library-card"
          @click="openReadingSetup(book)"
        >
          <div class="library-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div class="library-card-body">
            <h4 class="library-book-title">{{ book.title }}</h4>
            <span class="library-book-genre">{{ book.genre }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Reading Timer Modal / Running Timer -->
    <div class="modal-overlay" v-if="showReadingModal" @click.self="!isReadingActive && (showReadingModal = false)">
      <div class="modal-content" :style="{ 'max-width': isReadingActive ? '1080px' : '440px', 'width': '96%', 'padding': '28px' }">

        <!-- Setup Screen (before starting) -->
        <div v-if="!isReadingActive" style="text-align: center;">
          <div style="font-size: 18px; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">
            📖 {{ selectedLibBook?.title }}
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">
            by {{ selectedLibBook?.author }}
          </div>

          <!-- Loading / error while fetching book -->
          <div v-if="isBookLoading" style="padding: 28px 0; color: var(--text-muted); font-size: 14px;">
            <div class="book-load-spinner"></div>
            Loading full book text…
          </div>
          <div v-else-if="bookLoadingError" style="padding: 16px; color: #ef4444; font-size: 13px; background: rgba(239,68,68,0.08); border-radius: 8px; margin: 16px 0;">
            ⚠ {{ bookLoadingError }}
          </div>
          <div v-else-if="bookParagraphs.length > 0" style="font-size: 12px; color: var(--text-muted); margin: 8px 0 20px; padding: 8px 12px; background: rgba(var(--accent-purple-rgb, 139,92,246), 0.08); border-radius: 8px;">
            ✅ {{ bookParagraphs.length.toLocaleString() }} paragraphs loaded — full book ready!
          </div>

          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">
            Set your target reading time for this session.
          </p>
          <div class="two-input" style="margin-bottom: 20px;">
            <div class="form-group">
              <label>Hours</label>
              <input type="number" v-model.number="readingInputHours" min="0" max="10" placeholder="0" />
            </div>
            <div class="form-group">
              <label>Minutes</label>
              <input type="number" v-model.number="readingInputMins" min="0" max="59" placeholder="30" />
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button type="button" class="btn btn-primary" style="flex: 1;" @click="startReadingSession" :disabled="isBookLoading || bookParagraphs.length === 0">
              {{ isBookLoading ? 'Loading…' : 'Start Reading' }}
            </button>
            <button type="button" class="btn btn-outline" @click="showReadingModal = false">Cancel</button>
          </div>
        </div>

        <!-- Active Reading Session -->
        <div v-else class="reading-session-layout">
          <!-- Left: Full-text reader -->
          <div class="reader-content-panel">
            <div class="reader-header">
              <div class="reader-meta">
                <div>
                  <h4 class="reader-title">{{ selectedLibBook?.title }}</h4>
                  <p class="reader-author">by {{ selectedLibBook?.author }}</p>
                </div>
              </div>
              <div style="font-size: 12px; color: var(--text-muted);">
                Page {{ currentPage }} / {{ totalPages }}
              </div>
            </div>

            <!-- Reading Body Text -->
            <div class="reader-body">
              <p class="reader-text-paragraph" v-for="(p, pi) in visibleParagraphs" :key="pi">{{ p }}</p>
            </div>

            <!-- Pagination Controls -->
            <div class="reader-pagination">
              <button class="reader-nav-btn" @click="prevPage" :disabled="scrollOffset === 0">
                ← Prev
              </button>
              <span class="reader-page-count">{{ currentPage }} / {{ totalPages }}</span>
              <button class="reader-nav-btn" @click="nextPage" :disabled="scrollOffset + PARAS_PER_PAGE >= bookParagraphs.length">
                Next →
              </button>
            </div>
          </div>

          <!-- Right: Live Timer Status -->
          <div class="reader-timer-panel">
            <div class="reading-emoji-pulse">📖</div>
            <h3 style="margin: 0; font-size: 16px;">Reading Session</h3>
            <p style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin: 4px 0 24px;">Focus Time</p>
            
            <div class="timer-display" style="font-size: 46px; font-weight: 800; margin-bottom: 12px; line-height: 1; letter-spacing: -0.02em;">
              {{ formattedReadingTime }}
            </div>

            <div class="timer-controls" style="margin-bottom: 24px; display: flex; justify-content: center;">
              <button class="btn-timer play" @click="toggleReadingPause" style="background: var(--accent-purple); color: var(--accent-purple-text); width: 56px; height: 56px; border-radius: 50%;">
                <svg v-if="isReadingPaused" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              </button>
            </div>

            <button type="button" class="btn btn-outline" style="width: 100%; border-color: rgba(239,68,68,0.3); color: #ef4444; font-size: 13px;" @click="stopReadingSessionEarly">
              Stop Session & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/appStore'
import { LIBRARY_BOOKS, fetchBookText } from '../services/libraryBooks'

// Live reader state
const bookParagraphs = ref([])
const bookLoadingError = ref(null)
const isBookLoading = ref(false)
const scrollOffset = ref(0)
const PARAS_PER_PAGE = 18

const currentPage = computed(() => Math.floor(scrollOffset.value / PARAS_PER_PAGE) + 1)
const totalPages = computed(() => Math.ceil(bookParagraphs.value.length / PARAS_PER_PAGE))
const visibleParagraphs = computed(() => {
  const start = scrollOffset.value
  return bookParagraphs.value.slice(start, start + PARAS_PER_PAGE)
})

function nextPage() {
  if (scrollOffset.value + PARAS_PER_PAGE < bookParagraphs.value.length) {
    scrollOffset.value += PARAS_PER_PAGE
  }
}
function prevPage() {
  if (scrollOffset.value > 0) {
    scrollOffset.value = Math.max(0, scrollOffset.value - PARAS_PER_PAGE)
  }
}
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

// Ring progress percentages for stat cards
const studyTimePercent = computed(() => {
  // Target: 120 mins per day as a goal reference
  return Math.min(100, Math.round((store.studyTotalTime / 120) * 100))
})

const completionPercent = computed(() => {
  const total = store.studyBooksList.length
  if (total === 0) return 0
  return Math.min(100, Math.round((completedBooksCount.value / total) * 100))
})

const readingPercent = computed(() => {
  const total = store.studyBooksList.length
  if (total === 0) return 0
  return Math.min(100, Math.round((readingBooksCount.value / total) * 100))
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

function saveBook() {
  if (!bookTitle.value.trim() || bookCurrentPage.value === undefined || bookCurrentPage.value === null || bookCurrentPage.value === '') {
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
      title: bookTitle.value.trim(),
      author: bookAuthor.value.trim() || 'Unknown',
      currentPage: curr,
      totalPages: total,
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

const showReadingModal = ref(false)
const selectedLibBook = ref(null)
const readingInputMins = ref(30)
const readingInputHours = ref(0)
const isReadingActive = ref(false)
const isReadingPaused = ref(false)
const readingTimeRemaining = ref(0)
const totalReadingSessionSecs = ref(0)
let readingTimerId = null

const formattedReadingTime = computed(() => {
  const h = Math.floor(readingTimeRemaining.value / 3600).toString().padStart(2, '0')
  const m = Math.floor((readingTimeRemaining.value % 3600) / 60).toString().padStart(2, '0')
  const s = (readingTimeRemaining.value % 60).toString().padStart(2, '0')
  return h !== '00' ? `${h}:${m}:${s}` : `${m}:${s}`
})

async function openReadingSetup(book) {
  selectedLibBook.value = book
  readingInputMins.value = 30
  readingInputHours.value = 0
  showReadingModal.value = true
  isReadingActive.value = false
  isReadingPaused.value = false
  bookParagraphs.value = []
  bookLoadingError.value = null
  scrollOffset.value = 0

  // Fetch the full book text
  isBookLoading.value = true
  try {
    const paragraphs = await fetchBookText(book.textUrl)
    bookParagraphs.value = paragraphs
  } catch (e) {
    bookLoadingError.value = 'Could not load book. Check your internet connection and try again.'
  } finally {
    isBookLoading.value = false
  }
}

function startReadingSession() {
  const totalMins = (parseInt(readingInputHours.value) || 0) * 60 + (parseInt(readingInputMins.value) || 0)
  if (totalMins <= 0) {
    alert('Please enter a valid reading duration.')
    return
  }

  totalReadingSessionSecs.value = totalMins * 60
  readingTimeRemaining.value = totalMins * 60
  isReadingActive.value = true
  isReadingPaused.value = false

  if (readingTimerId) clearInterval(readingTimerId)
  readingTimerId = setInterval(() => {
    if (!isReadingPaused.value) {
      if (readingTimeRemaining.value > 0) {
        readingTimeRemaining.value--
      } else {
        clearInterval(readingTimerId)
        readingTimerId = null
        isReadingActive.value = false
        showReadingModal.value = false

        store.addStudyMinutes(totalMins)
        alert(`🎉 Congratulations! You completed your reading session for "${selectedLibBook.value.title}" of ${totalMins} minutes!`)
      }
    }
  }, 1000)
}

function toggleReadingPause() {
  isReadingPaused.value = !isReadingPaused.value
}

function stopReadingSessionEarly() {
  if (confirm('Do you want to end your reading session early? The minutes you read so far will still be saved.')) {
    if (readingTimerId) clearInterval(readingTimerId)
    readingTimerId = null
    isReadingActive.value = false
    showReadingModal.value = false

    const secondsRead = totalReadingSessionSecs.value - readingTimeRemaining.value
    const minsRead = Math.floor(secondsRead / 60)
    if (minsRead > 0) {
      store.addStudyMinutes(minsRead)
      alert(`Saved ${minsRead} minutes of reading for "${selectedLibBook.value.title}"!`)
    }
  }
}

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
  if (readingTimerId) clearInterval(readingTimerId)
})
</script>

<style scoped>
/* ── Page Header ───────────────────────────────────────── */
.study-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}
.study-header h1 {
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}
.study-subtitle {
  font-family: 'Inter', sans-serif;
  color: var(--text-muted);
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
}

/* ── Animations ────────────────────────────────────────── */
.animate-in {
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}
.delay-100 { animation-delay: 0.08s; }
.delay-200 { animation-delay: 0.16s; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Glassmorphism Stat Cards ──────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}
.stat-card-glass {
  font-family: 'Inter', sans-serif;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 130px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  background: var(--glass-bg, rgba(255,255,255,0.15));
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border, rgba(255,255,255,0.2));
  color: var(--time-text, var(--text-primary));
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}
.stat-card-glass:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}
.stat-glass-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat-glass-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--time-text-muted, var(--text-secondary));
  opacity: 0.8;
}
.stat-glass-value {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--time-text, var(--text-primary));
}
.stat-unit {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.6;
}

/* ── Mini Ring Progress ────────────────────────────────── */
.mini-ring-wrap {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}
.mini-ring-svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}
.mini-ring-svg .ring-bg {
  stroke: var(--border-color-strong, rgba(0,0,0,0.08));
  opacity: 0.3;
}
.mini-ring-svg .ring-fill {
  stroke: var(--ring-color, #f97316);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.mini-ring-icon-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--time-text, var(--text-primary));
  opacity: 0.7;
}

/* ── Two Column Layout ─────────────────────────────────── */
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

/* ── Panel Cards ───────────────────────────────────────── */
.panel {
  font-family: 'Inter', sans-serif;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
}
.panel h3 {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0 0 20px;
  display: flex;
  align-items: center;
}

/* ── Pomodoro Timer ────────────────────────────────────── */
.timer-panel {
  padding: 40px 24px;
}
.timer-mode-badge-wrap {
  margin-bottom: 18px;
}
.timer-mode-badge {
  font-family: 'Inter', sans-serif;
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
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
  font-family: 'Inter', sans-serif;
  font-size: 78px;
  font-weight: 800;
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
  background: linear-gradient(135deg, #e65c00 0%, #ff7b00 100%);
  color: #fff;
  font-size: 24px;
}
.btn-timer.play:hover {
  background: linear-gradient(135deg, #c2410c 0%, #e65c00 100%);
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(234, 88, 12, 0.35);
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
.timer-hint {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 15px;
  opacity: 0.7;
}

/* ── Notes ─────────────────────────────────────────────── */
.notes-textarea {
  font-family: 'Inter', sans-serif;
  width: 100%;
  height: 200px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-input-inset);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.notes-textarea:focus {
  border-color: var(--accent-purple);
  box-shadow: 0 0 0 3px var(--accent-purple-light);
}

/* ── Books Tracker ─────────────────────────────────────── */
.books-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 520px;
  overflow-y: auto;
}

/* Enhanced Empty State */
.empty-state-books {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  gap: 12px;
}
.empty-state-icon {
  color: var(--text-muted);
  opacity: 0.25;
  margin-bottom: 4px;
}
.empty-state-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}
.empty-state-text {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--text-muted);
  max-width: 280px;
  line-height: 1.5;
  margin-bottom: 8px;
}

/* Book Cards */
.book-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 18px;
  transition: all 0.2s;
}
.book-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
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
.book-text-details {
  display: flex;
  flex-direction: column;
}
.book-title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: var(--text-primary);
}
.book-author {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: var(--text-secondary);
}

.book-actions {
  display: flex;
  gap: 4px;
}
.btn-action-sm {
  font-family: 'Inter', sans-serif;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}
.btn-action-sm:hover {
  border-color: var(--accent-purple);
  color: var(--accent-purple);
  background: var(--accent-purple-light);
}
.btn-action-danger:hover {
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.book-amounts {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.book-status-pill {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  border-radius: 6px;
}
.book-status-pill.reading {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}
.book-status-pill.completed {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}
.book-status-pill.to-read {
  background: var(--accent-purple-light);
  color: var(--accent-purple);
}

.goal-bar-wrap {
  height: 6px;
  background: var(--border-color-strong);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 8px;
}
.goal-bar-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #e65c00 0%, #ff7b00 100%);
  transition: width 0.5s ease;
}

.book-progress-footer {
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
}

/* ── Forms ─────────────────────────────────────────────── */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.form-group label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}
.form-group input, .form-group select {
  font-family: 'Inter', sans-serif;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-input-inset);
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:focus, .form-group select:focus {
  border-color: var(--accent-purple);
  box-shadow: 0 0 0 3px var(--accent-purple-light);
}
.two-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* ── Buttons ───────────────────────────────────────────── */
.btn {
  font-family: 'Inter', sans-serif;
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}
.btn-primary {
  background: linear-gradient(135deg, #e65c00 0%, #ff7b00 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
}
.btn-primary:hover {
  background: linear-gradient(135deg, #c2410c 0%, #e65c00 100%);
  box-shadow: 0 6px 16px rgba(234, 88, 12, 0.35);
  transform: translateY(-1px);
}
.btn-outline {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color-strong);
}
.btn-outline:hover {
  background: var(--bg-subtle);
}

/* ── Modals ────────────────────────────────────────────── */
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
  font-family: 'Inter', sans-serif;
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
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-heading);
  margin-top: 0;
  margin-bottom: 20px;
}
/* ── Library Bookshelf Styling ── */
.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.library-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, box-shadow 0.2s, background 0.2s;
  position: relative;
  text-align: left;
}
.library-card:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: var(--shadow-md);
  border-color: var(--accent-purple);
  background: var(--bg-card);
}
.library-card-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(var(--accent-purple-rgb, 139,92,246), 0.12);
  color: var(--accent-purple);
  display: flex;
  align-items: center;
  justify-content: center;
}
.library-card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.library-book-title {
  font-size: 13px;
  font-weight: 650;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}
.library-book-genre {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Reader Pagination */
.reader-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 0;
  border-top: 1px solid var(--border-color);
  margin-top: 12px;
}
.reader-nav-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s, border-color 0.15s;
}
.reader-nav-btn:hover:not(:disabled) {
  background: var(--accent-purple);
  color: var(--accent-purple-text);
  border-color: var(--accent-purple);
}
.reader-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.reader-page-count {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

/* Book loading spinner */
.book-load-spinner {
  width: 28px; height: 28px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-purple);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }


/* Reading Active Session in modal */
.reading-emoji-pulse {
  font-size: 48px;
  animation: readingEmojiFloat 2s infinite ease-in-out;
  display: inline-block;
  margin-bottom: 12px;
}
@keyframes readingEmojiFloat {
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px) scale(1.05); }
  100% { transform: translateY(0); }
}
.reading-author {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
  margin-bottom: 0;
}

/* ── Active Split Ebook Reader Layout ── */
.reading-session-layout {
  display: grid;
  grid-template-columns: 2.2fr 0.8fr;
  gap: 24px;
  text-align: left;
  min-height: 480px;
}
@media (max-width: 768px) {
  .reading-session-layout {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}
.reader-content-panel {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color-strong);
  padding-right: 24px;
}
@media (max-width: 768px) {
  .reader-content-panel {
    border-right: none;
    padding-right: 0;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-color-strong);
  }
}
.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}
.reader-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}
.reader-emoji {
  font-size: 32px;
}
.reader-title {
  font-size: 16px;
  font-weight: 750;
  color: var(--text-primary);
  margin: 0;
}
.reader-author {
  font-size: 11px;
  color: var(--text-secondary);
  margin: 0;
}
.chapter-selector-wrap {
  min-width: 200px;
}
.chapter-select {
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-input-inset);
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  font-family: inherit;
  cursor: pointer;
}
.reader-body {
  flex: 1;
  overflow-y: auto;
  max-height: 420px;
  padding-top: 16px;
  padding-right: 8px;
}
.reader-chapter-title {
  font-size: 15px;
  font-weight: 750;
  color: var(--text-heading);
  margin: 0 0 14px;
}
.reader-text-paragraph {
  font-size: 14px;
  color: var(--text-body);
  line-height: 1.7;
  margin-bottom: 16px;
  text-align: justify;
}

/* Right Timer Side panel */
.reader-timer-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-left: 8px;
}
</style>
