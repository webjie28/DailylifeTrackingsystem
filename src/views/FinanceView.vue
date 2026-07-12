<template>
  <div class="finance-view">
    <div class="finance-header">
      <div>
        <h1>Finance</h1>
        <p style="color: var(--text-muted); margin-top: 4px; font-size: 14px;">
          Track your income, budget limits, and monthly expenses
        </p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openScanModal">📄 Scan Receipt Image</button>
        <button class="btn btn-outline" @click="exportCSV">Export CSV</button>
        <button class="btn btn-outline" @click="clearAll">Clear All</button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Income</div>
        <div class="stat-value income">₱{{ totalIncome.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Expenses</div>
        <div class="stat-value expense">₱{{ totalExpenses.toLocaleString() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Net Balance</div>
        <div class="stat-value" :class="{ income: netBalance >= 0, expense: netBalance < 0 }">
          ₱{{ netBalance.toLocaleString() }}
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">This Month</div>
        <div class="stat-value" style="color: var(--accent-purple);">₱{{ store.monthlyExpenses.toLocaleString() }}</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="content-grid" style="margin-bottom: 28px;">
      <div class="panel">
        <h3>Expenses by Category</h3>
        <div class="chart-wrap">
          <canvas ref="categoryChartCanvas"></canvas>
        </div>
      </div>
      <div class="panel">
        <h3>Monthly Overview</h3>
        <div class="chart-wrap">
          <canvas ref="monthlyChartCanvas"></canvas>
        </div>
      </div>
    </div>

    <!-- Ledger & Input Form Split -->
    <div class="content-grid-split">
      <!-- Left: Form -->
      <div class="panel">
        <h3 id="formTitle">{{ editingId ? 'Edit Transaction' : 'Add Transaction' }}</h3>
        
        <div class="type-toggle-row">
          <button 
            type="button" 
            class="type-btn expense" 
            :class="{ 'active-expense': txType === 'expense' }"
            @click="txType = 'expense'"
          >
            Expense
          </button>
          <button 
            type="button" 
            class="type-btn income" 
            :class="{ 'active-income': txType === 'income' }"
            @click="txType = 'income'"
          >
            Income
          </button>
        </div>

        <form @submit.prevent="saveTransaction">
          <div class="form-group">
            <label>Description</label>
            <input type="text" v-model="txDesc" list="txDescList" placeholder="e.g. Starbucks, Salary" required />
            <datalist id="txDescList">
              <option v-for="d in uniqueDescriptions" :key="d" :value="d"></option>
            </datalist>
          </div>

          <div class="two-input">
            <div class="form-group">
              <label>Amount (₱)</label>
              <input type="number" v-model.number="txAmount" min="0.01" step="any" placeholder="0.00" required />
            </div>
            <div class="form-group">
              <label>Category</label>
              <select v-model="txCategory">
                <option v-for="cat in availableCategories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Date</label>
            <input type="date" v-model="txDate" required />
          </div>

          <div class="form-group">
            <label>Note (Optional)</label>
            <input type="text" v-model="txNote" list="txNoteList" placeholder="e.g. Lunch with friends" />
            <datalist id="txNoteList">
              <option v-for="n in uniqueNotes" :key="n" :value="n"></option>
            </datalist>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="submit" class="btn btn-primary" style="flex: 1;">
              {{ editingId ? 'Update' : 'Save' }}
            </button>
            <button 
              v-if="editingId" 
              type="button" 
              class="btn btn-outline" 
              @click="cancelEdit"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Right: Ledger List -->
      <div class="panel">
        <h3>Transaction Ledger</h3>
        
        <!-- Filter Row -->
        <div class="filter-bar">
          <select v-model="filterType">
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>

          <select v-model="filterCat">
            <option value="all">All Categories</option>
            <option v-for="cat in allUniqueCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <input type="month" v-model="filterMonth" />
          <button v-if="hasActiveFilters" class="btn btn-sm btn-outline" @click="resetFilters" style="padding: 6px 10px;">
            Reset
          </button>
        </div>

        <!-- Ledger Table/List -->
        <div class="ledger-list">
          <div v-if="filteredTransactions.length === 0" class="empty-msg">
            No transactions match the selected filters.
          </div>
          
          <div 
            v-else 
            v-for="tx in filteredTransactions" 
            :key="tx.id" 
            class="ledger-item"
          >
            <div class="tx-icon" :class="tx.type">
              {{ tx.type === 'income' ? 'IN' : 'OUT' }}
            </div>
            <div class="tx-info">
              <div class="tx-name">{{ tx.desc }}</div>
              <div class="tx-meta">
                <span>{{ tx.date }}</span> • 
                <span class="category-badge">{{ tx.category }}</span>
                <span v-if="tx.note" style="margin-left: 6px; font-style: italic; opacity: 0.85;">
                  ({{ tx.note }})
                </span>
              </div>
            </div>
            <div class="tx-amount" :class="tx.type">
              {{ tx.type === 'income' ? '+' : '-' }}₱{{ tx.amount.toLocaleString() }}
            </div>
            <div class="tx-actions" style="margin-left: 12px;">
              <button class="btn-del" @click="editTransaction(tx.id)" title="Edit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn-del" @click="deleteTransaction(tx.id)" title="Delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Receipt Scanner Modal -->
    <div class="modal-overlay" v-if="showScanModal" @click.self="closeScanModal">
      <div class="modal-content" style="max-width: 550px; width: 95%;">
        <h3>Scan Receipt Image</h3>
        
        <!-- Drag & Drop / File Select Area -->
        <div 
          v-if="!receiptImageSrc"
          class="scan-dropzone"
          :class="{ 'drag-over': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleFileDrop"
          @click="triggerFileInput"
        >
          <input 
            type="file" 
            ref="fileInputRef" 
            style="display: none;" 
            accept="image/*" 
            @change="handleFileSelect"
          />
          <div class="dropzone-icon">📁</div>
          <p class="dropzone-text">Drag & drop your receipt image here, or <strong>browse files</strong></p>
          <span class="dropzone-sub">Supports PNG, JPG, JPEG</span>
        </div>

        <!-- Preview & Progress Area -->
        <div v-else class="scan-preview-area">
          <div class="preview-header">
            <span>Receipt Preview</span>
            <button class="btn-text-danger" @click="resetScanner">Remove Image</button>
          </div>
          
          <div class="preview-img-container">
            <img :src="receiptImageSrc" class="receipt-preview-img" alt="Uploaded Receipt" />
          </div>

          <!-- OCR Processing State -->
          <div v-if="isProcessingOCR" class="scan-progress-wrap">
            <div class="spinner-circle"></div>
            <div class="progress-message">{{ progressMessage }}</div>
          </div>
          
          <!-- Review Fields Form (Visible after OCR completes) -->
          <div v-else class="scan-results-form animate-in">
            <div class="raw-text-toggle-wrap">
              <button 
                type="button" 
                class="btn-text-toggle" 
                @click="showRawText = !showRawText"
              >
                {{ showRawText ? 'Hide Raw Scanned Text' : 'Show Raw Scanned Text' }}
              </button>
            </div>
            
            <!-- Raw Scanned Text Box (Helps verify nothing is missed) -->
            <div v-if="showRawText" class="raw-text-box animate-in">
              <pre>{{ scannedRawText }}</pre>
            </div>

            <h4 style="margin: 16px 0 10px; font-size: 14px; text-transform: uppercase; color: var(--accent-purple);">Confirm Transaction Details</h4>
            
            <form @submit.prevent="saveScannedTransaction">
              <div class="form-group">
                <label>Description / Store Name</label>
                <input type="text" v-model="scannedDesc" required placeholder="e.g. SM Supermarket" />
              </div>

              <div class="two-input">
                <div class="form-group">
                  <label>Amount (₱)</label>
                  <input type="number" v-model.number="scannedAmount" min="0.01" step="any" required placeholder="0.00" />
                </div>
                <div class="form-group">
                  <label>Category</label>
                  <select v-model="scannedCategory">
                    <option v-for="cat in expenseCategories" :key="cat" :value="cat">
                      {{ cat }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="two-input">
                <div class="form-group">
                  <label>Date</label>
                  <input type="date" v-model="scannedDate" required />
                </div>
                <div class="form-group">
                  <label>Note / Extras</label>
                  <input type="text" v-model="scannedNote" placeholder="e.g. Weekly grocery stock" />
                </div>
              </div>

              <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn btn-primary" style="flex: 1;">
                  Add to Ledger
                </button>
                <button type="button" class="btn btn-outline" @click="closeScanModal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore, getTodayKey } from '../stores/appStore'
import Chart from 'chart.js/auto'
import Tesseract from 'tesseract.js'

const store = useAppStore()

// Receipt Scanner states
const showScanModal = ref(false)
const isDragging = ref(false)
const receiptImageSrc = ref(null)
const isProcessingOCR = ref(false)
const progressMessage = ref('Initializing engine...')
const scannedRawText = ref('')
const showRawText = ref(false)
const fileInputRef = ref(null)

// Scanned review fields
const scannedDesc = ref('')
const scannedAmount = ref('')
const scannedCategory = ref('Food')
const scannedDate = ref(getTodayKey())
const scannedNote = ref('')

// Form states
const txType = ref('expense')
const txDesc = ref('')
const txAmount = ref('')
const txCategory = ref('Food')
const txDate = ref(getTodayKey())
const txNote = ref('')
const editingId = ref(null)

// Filter states
const filterType = ref('all')
const filterCat = ref('all')
const filterMonth = ref('') // YYYY-MM

// Canvas Refs
const categoryChartCanvas = ref(null)
const monthlyChartCanvas = ref(null)

let categoryChartInstance = null
let monthlyChartInstance = null

// Category dropdowns
const incomeCategories = ['Salary', 'Freelance', 'Other']
const expenseCategories = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Gym', 'Other']

const availableCategories = computed(() => {
  return txType.value === 'income' ? incomeCategories : expenseCategories
})

// Auto select default category when type toggles
watch(txType, (newType) => {
  txCategory.value = newType === 'income' ? 'Salary' : 'Food'
})

const uniqueDescriptions = computed(() => {
  const list = store.financeTransactions || []
  return Array.from(new Set(list.map(t => t.description?.trim()).filter(Boolean)))
})

const uniqueNotes = computed(() => {
  const list = store.financeTransactions || []
  return Array.from(new Set(list.map(t => t.note?.trim()).filter(Boolean)))
})

// Financial metrics
const totalIncome = computed(() => {
  return store.financeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
})

const totalExpenses = computed(() => {
  return store.financeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
})

const netBalance = computed(() => {
  return totalIncome.value - totalExpenses.value
})

// Categories populated in filters
const allUniqueCategories = computed(() => {
  const cats = new Set(store.financeTransactions.map(t => t.category))
  return Array.from(cats)
})

// Filters logic
const hasActiveFilters = computed(() => {
  return filterType.value !== 'all' || filterCat.value !== 'all' || filterMonth.value !== ''
})

function resetFilters() {
  filterType.value = 'all'
  filterCat.value = 'all'
  filterMonth.value = ''
}

const filteredTransactions = computed(() => {
  return store.financeTransactions.filter(t => {
    // Type filter
    if (filterType.value !== 'all' && t.type !== filterType.value) return false
    // Category filter
    if (filterCat.value !== 'all' && t.category !== filterCat.value) return false
    // Month filter (YYYY-MM)
    if (filterMonth.value) {
      const [year, month] = filterMonth.value.split('-')
      const tDate = new Date(t.date)
      if (tDate.getFullYear() !== parseInt(year) || (tDate.getMonth() + 1) !== parseInt(month)) return false
    }
    return true
  }).sort((a, b) => b.date.localeCompare(a.date))
})

// CRUD actions
function saveTransaction() {
  if (!txDesc.value.trim() || !txAmount.value || txAmount.value <= 0 || !txDate.value) {
    alert('Please fill out all fields.')
    return
  }

  const txData = {
    id: editingId.value || Date.now() + '_' + Math.random().toString(36).slice(2),
    desc: txDesc.value.trim(),
    amount: parseFloat(txAmount.value),
    category: txCategory.value,
    date: txDate.value,
    note: txNote.value.trim(),
    type: txType.value
  }

  if (editingId.value) {
    const updated = store.financeTransactions.map(t => t.id === editingId.value ? txData : t)
    store.financeTransactions = updated
    localStorage.setItem('financeTransactions', JSON.stringify(updated))
    cancelEdit()
  } else {
    store.addTransaction(txData)
    resetForm()
  }
}

function editTransaction(id) {
  const tx = store.financeTransactions.find(t => t.id === id)
  if (!tx) return
  editingId.value = id
  txType.value = tx.type
  txDesc.value = tx.desc
  txAmount.value = tx.amount
  txCategory.value = tx.category
  txDate.value = tx.date
  txNote.value = tx.note || ''
}

function deleteTransaction(id) {
  const tx = store.financeTransactions.find(t => t.id === id)
  const desc = tx ? tx.description : 'this transaction'
  
  store.showConfirm({
    title: 'Delete Transaction?',
    message: `Are you sure you want to delete "${desc}"?`,
    confirmText: 'Delete',
    onConfirm: () => {
      store.deleteTransaction(id)
      if (editingId.value === id) cancelEdit()
    }
  })
}

function cancelEdit() {
  editingId.value = null
  resetForm()
}

function resetForm() {
  txDesc.value = ''
  txAmount.value = ''
  txNote.value = ''
  txDate.value = getTodayKey()
}

function clearAll() {
  store.showConfirm({
    title: 'Clear All History?',
    message: 'Are you sure you want to clear ALL transactions? This cannot be undone.',
    confirmText: 'Clear All',
    onConfirm: () => {
      store.financeTransactions = []
      localStorage.setItem('financeTransactions', '[]')
    }
  })
  cancelEdit()
}

function exportCSV() {
  if (store.financeTransactions.length === 0) {
    alert('No transactions to export.')
    return
  }
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount (PHP)', 'Note']
  const rows = store.financeTransactions.map(t => [
    t.date,
    t.type.toUpperCase(),
    t.category,
    `"${t.desc.replace(/"/g, '""')}"`,
    t.amount,
    `"${(t.note || '').replace(/"/g, '""')}"`
  ])
  
  const csvContent = 'data:text/csv;charset=utf-8,' 
    + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `dlt_finance_export_${getTodayKey()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Charts setups
function renderCharts() {
  // 1. Category expenses chart
  if (categoryChartCanvas.value) {
    if (categoryChartInstance) categoryChartInstance.destroy()

    const cats = {}
    store.financeTransactions.filter(t => t.type === 'expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + (parseFloat(t.amount) || 0)
    })

    const labels = Object.keys(cats)
    const values = Object.values(cats)

    // Fallbacks
    if (labels.length === 0) {
      labels.push('No Expenses')
      values.push(1)
    }

    categoryChartInstance = new Chart(categoryChartCanvas.value, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--accent-purple').trim() || '#334155', '#22c55e', '#f97316', '#3b82f6', '#ec4899', '#14b8a6', '#eab308'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } }
      }
    })
  }

  // 2. Monthly income vs expenses chart
  if (monthlyChartCanvas.value) {
    if (monthlyChartInstance) monthlyChartInstance.destroy()

    // Aggregate by month (last 6 months)
    const monthlyData = {}
    const months = []
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' })
      months.push({ key, label })
      monthlyData[key] = { income: 0, expense: 0 }
    }

    store.financeTransactions.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
      if (monthlyData[key]) {
        monthlyData[key][t.type] += parseFloat(t.amount) || 0
      }
    })

    monthlyChartInstance = new Chart(monthlyChartCanvas.value, {
      type: 'bar',
      data: {
        labels: months.map(m => m.label),
        datasets: [
          {
            label: 'Income',
            data: months.map(m => monthlyData[m.key].income),
            backgroundColor: '#22c55e',
            borderRadius: 6
          },
          {
            label: 'Expenses',
            data: months.map(m => monthlyData[m.key].expense),
            backgroundColor: '#ef4444',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)' } }
        }
      }
    })
  }
}

onMounted(() => {
  renderCharts()
})

watch(() => store.financeTransactions, () => {
  renderCharts()
}, { deep: true })

function openScanModal() {
  resetScanner()
  showScanModal.value = true
}

function closeScanModal() {
  showScanModal.value = false
  resetScanner()
}

function resetScanner() {
  receiptImageSrc.value = null
  isProcessingOCR.value = false
  scannedRawText.value = ''
  showRawText.value = false
  scannedDesc.value = ''
  scannedAmount.value = ''
  scannedCategory.value = 'Food'
  scannedDate.value = getTodayKey()
  scannedNote.value = ''
}

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

function handleFileSelect(e) {
  const files = e.target.files
  if (files && files[0]) {
    processImageFile(files[0])
  }
}

function handleFileDrop(e) {
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files && files[0]) {
    processImageFile(files[0])
  }
}

function processImageFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file (PNG, JPG, or JPEG).')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    receiptImageSrc.value = e.target.result
    runOCR(file)
  }
  reader.readAsDataURL(file)
}

async function runOCR(file) {
  isProcessingOCR.value = true
  progressMessage.value = 'Initializing scanner...'
  
  try {
    const result = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            progressMessage.value = `Reading receipt... ${Math.round(m.progress * 100)}%`
          } else if (m.status === 'loading tesseract ocr core') {
            progressMessage.value = 'Loading scan engine...'
          }
        }
      }
    )
    
    scannedRawText.value = result.data.text
    isProcessingOCR.value = false
    
    // Parse fields from text
    const parsed = parseReceiptText(result.data.text)
    scannedDesc.value = parsed.storeName
    scannedAmount.value = parsed.amount > 0 ? parsed.amount : ''
    scannedCategory.value = parsed.category
    scannedDate.value = parsed.date
    scannedNote.value = `Scanned from receipt image`
  } catch (error) {
    console.error('OCR failed:', error)
    alert('Failed to read receipt text. Please enter the details manually.')
    isProcessingOCR.value = false
    // Fallbacks
    scannedDesc.value = 'Receipt Purchase'
    scannedAmount.value = ''
    scannedCategory.value = 'Food'
    scannedDate.value = getTodayKey()
  }
}

function parseReceiptText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  
  // 1. Est store name (first 3 lines, ignore common things like receipt title, tel, date)
  let storeName = 'Receipt Purchase'
  const ignorePatterns = [/receipt/i, /invoice/i, /tel/i, /phone/i, /date/i, /time/i, /address/i, /street/i, /http/i, /www/i, /tax/i, /vat/i, /cashier/i]
  for (let i = 0; i < Math.min(4, lines.length); i++) {
    if (!ignorePatterns.some(p => p.test(lines[i])) && lines[i].length > 3) {
      storeName = lines[i].replace(/[^a-zA-Z0-9\s&'-]/g, '').trim()
      break
    }
  }

  // 2. Est total amount
  let amount = 0
  const totalRegex = /(?:total|grand\s*total|due|amount|net|cash|subtotal|php|₱)\s*(?:val|due)?[:=]?\s*(?:php|₱)?\s*([\d,]+\.\d{2}|[\d,]+)/i
  
  let bestMatches = []
  lines.forEach(line => {
    const match = line.match(totalRegex)
    if (match) {
      const valStr = match[1].replace(/,/g, '')
      const parsedVal = parseFloat(valStr)
      if (!isNaN(parsedVal) && parsedVal > 0) {
        let score = 1
        if (/total/i.test(line)) score += 2
        if (/due/i.test(line)) score += 1
        if (/subtotal/i.test(line)) score -= 1
        bestMatches.push({ value: parsedVal, score })
      }
    }
  })

  if (bestMatches.length > 0) {
    bestMatches.sort((a, b) => b.score - a.score || b.value - a.value)
    amount = bestMatches[0].value
  } else {
    let allNumbers = []
    const numberRegex = /([\d,]+\.\d{2})/g
    lines.forEach(line => {
      if (/\d{4}-\d{2}-\d{2}/.test(line) || /\d{2}\/\d{2}\/\d{4}/.test(line)) return
      const matches = line.match(numberRegex)
      if (matches) {
        matches.forEach(m => {
          const val = parseFloat(m.replace(/,/g, ''))
          if (!isNaN(val) && val < 50000) {
            allNumbers.push(val)
          }
        })
      }
    })
    if (allNumbers.length > 0) {
      amount = Math.max(...allNumbers)
    }
  }

  // 3. Est date
  let date = getTodayKey()
  const dateRegexes = [
    /(\d{4})[-/](\d{2})[-/](\d{2})/,
    /(\d{2})[-/](\d{2})[-/](\d{4})/,
    /(\d{2})[-/](\d{2})[-/](\d{2})/
  ]
  for (const line of lines) {
    let matched = false
    for (const r of dateRegexes) {
      const match = line.match(r)
      if (match) {
        try {
          let y = parseInt(match[1])
          let m = parseInt(match[2]) - 1
          let d = parseInt(match[3])
          if (match[3].length === 4) {
            y = parseInt(match[3])
            m = parseInt(match[1]) - 1
            d = parseInt(match[2])
            if (m > 11) {
              m = parseInt(match[2]) - 1
              d = parseInt(match[1])
            }
          }
          const parsedDate = new Date(y, m, d)
          if (!isNaN(parsedDate.getTime())) {
            if (y > 2000 && y <= new Date().getFullYear() + 1) {
              const mm = (m + 1).toString().padStart(2, '0')
              const dd = d.toString().padStart(2, '0')
              date = `${y}-${mm}-${dd}`
              matched = true
              break
            }
          }
        } catch (e) {}
      }
    }
    if (matched) break
  }

  // 4. Est category
  let category = 'Food'
  const lowerText = text.toLowerCase()
  const catKeywords = {
    Transport: ['grab', 'uber', 'taxi', 'gas', 'fuel', 'petrol', 'shell', 'petron', 'caltex', 'toll'],
    Bills: ['electric', 'water', 'internet', 'meralco', 'pldt', 'globe', 'smart', 'bill', 'subscription', 'netflix', 'spotify'],
    Shopping: ['sm', 'mall', 'lazada', 'shopee', 'uniqlo', 'h&m', 'zara', 'bench', 'clothes', 'shoes', 'boutique', 'department'],
    Health: ['watson', 'mercury', 'drug', 'pharmacy', 'clinic', 'hospital', 'medical', 'doctor', 'medicine'],
    Entertainment: ['cinema', 'movie', 'ticket', 'concert', 'game', 'play', 'steam', 'playstation', 'nintendo'],
    Gym: ['anytime', 'fitness', 'workout', 'supplement', 'whey', 'protein', 'gym'],
    Food: ['supermarket', 'grocer', 'grocery', 'food', 'restaurant', 'cafe', 'starbucks', 'coffee', 'mcdonald', 'jollibee', 'kfc', 'dining', 'baker', 'eats', 'store']
  }

  for (const [cat, keywords] of Object.entries(catKeywords)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      category = cat
      break
    }
  }

  return { storeName, amount, date, category }
}

function saveScannedTransaction() {
  if (!scannedDesc.value.trim() || !scannedAmount.value) {
    alert('Please fill out all required fields.')
    return
  }
  
  const newTx = {
    id: Date.now() + '_' + Math.random().toString(36).slice(2),
    type: 'expense',
    desc: scannedDesc.value.trim(),
    amount: parseFloat(scannedAmount.value),
    category: scannedCategory.value,
    date: scannedDate.value,
    note: scannedNote.value.trim()
  }
  
  store.addTransaction(newTx)
  closeScanModal()
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
.header-actions {
  display: flex;
  gap: 8px;
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
.stat-value.expense {
  color: #dc2626;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 800px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
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

.chart-wrap {
  position: relative;
  height: 250px;
}

.type-toggle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}
.type-btn {
  padding: 12px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-subtle);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}
.type-btn.expense:hover {
  border-color: #ef4444;
}
.type-btn.income:hover {
  border-color: #22c55e;
}
.active-expense {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}
.active-income {
  background: #22c55e;
  color: #fff;
  border-color: #22c55e;
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

.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items: center;
}
.filter-bar select, .filter-bar input {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-input-inset);
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
}

.ledger-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 520px;
  overflow-y: auto;
}
.ledger-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.2s;
}
.ledger-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.tx-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.tx-icon.income {
  background: rgba(34, 197, 94, 0.1);
}
.tx-icon.expense {
  background: rgba(239, 68, 68, 0.1);
}

.tx-info {
  flex: 1;
  min-width: 0;
}
.tx-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tx-meta {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}
.category-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  background: var(--accent-purple-light);
  color: var(--accent-purple);
}

.tx-amount {
  font-size: 15px;
  font-weight: 800;
}
.tx-amount.income {
  color: #16a34a;
}
.tx-amount.expense {
  color: #dc2626;
}

.tx-actions {
  display: flex;
  gap: 4px;
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
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 8px;
}
.empty-msg {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 14px;
}

/* ── Receipt Scanner Styles ────────────────────────────────────── */
.scan-dropzone {
  border: 2px dashed var(--border-color-strong);
  border-radius: var(--radius-md);
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  background: var(--bg-input-inset);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}
.scan-dropzone:hover, .scan-dropzone.drag-over {
  border-color: var(--accent-purple);
  background: var(--bg-hover);
  transform: translateY(-2px);
}
.dropzone-icon {
  font-size: 40px;
}
.dropzone-text {
  font-size: 14px;
  color: var(--text-primary);
}
.dropzone-sub {
  font-size: 11px;
  color: var(--text-muted);
}
.scan-preview-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
}
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
}
.preview-img-container {
  max-height: 200px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: rgba(0,0,0,0.05);
  display: flex;
  justify-content: center;
  align-items: center;
}
.receipt-preview-img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}
.scan-progress-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
}
.spinner-circle {
  width: 36px;
  height: 36px;
  border: 3.5px solid var(--border-color);
  border-top-color: var(--accent-purple);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.progress-message {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}
.raw-text-toggle-wrap {
  text-align: right;
  margin-bottom: 8px;
}
.raw-text-box {
  background: var(--bg-input-inset);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 12px;
  max-height: 120px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 11px;
  color: var(--text-primary);
  text-align: left;
}
.raw-text-box pre {
  margin: 0;
  white-space: pre-wrap;
}
.btn-text-danger {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.btn-text-danger:hover {
  text-decoration: underline;
}
</style>
