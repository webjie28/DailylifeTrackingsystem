import { defineStore } from 'pinia'
import { auth, db } from '../services/firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// Helper for formatted date key
export function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

export const useAppStore = defineStore('app', {
  state: () => {
    // 1. Initial State Loading
    const today = getTodayKey()
    
    let dailyTasks = []
    try {
      const parsed = JSON.parse(localStorage.getItem('dailyTasks') || '[]')
      dailyTasks = Array.isArray(parsed) ? parsed : []
    } catch { dailyTasks = [] }

    let customCategories = []
    try {
      const parsed = JSON.parse(localStorage.getItem('customCategories') || '[]')
      customCategories = Array.isArray(parsed) ? parsed : []
    } catch { customCategories = [] }

    let walkTrackerData = {}
    try {
      const parsed = JSON.parse(localStorage.getItem('walkTrackerData') || '{}')
      walkTrackerData = (parsed && typeof parsed === 'object') ? parsed : {}
    } catch { walkTrackerData = {} }

    let gymTrackerData = {}
    try {
      const parsed = JSON.parse(localStorage.getItem('gymTrackerData') || '{}')
      gymTrackerData = (parsed && typeof parsed === 'object') ? parsed : {}
    } catch { gymTrackerData = {} }

    let gymCheckedItems = {}
    try {
      const parsed = JSON.parse(localStorage.getItem('gymCheckedItems') || '{}')
      gymCheckedItems = (parsed && typeof parsed === 'object') ? parsed : {}
    } catch { gymCheckedItems = {} }

    let financeTransactions = []
    try {
      const parsed = JSON.parse(localStorage.getItem('financeTransactions') || '[]')
      financeTransactions = Array.isArray(parsed) ? parsed : []
    } catch { financeTransactions = [] }

    let savingsContributions = []
    try {
      const parsed = JSON.parse(localStorage.getItem('savingsContributions') || '[]')
      savingsContributions = Array.isArray(parsed) ? parsed : []
    } catch { savingsContributions = [] }

    let savingsGoals = []
    try {
      const parsed = JSON.parse(localStorage.getItem('savingsGoals') || '[]')
      savingsGoals = Array.isArray(parsed) ? parsed : []
    } catch { savingsGoals = [] }

    let animeWatchlist = []
    try {
      const parsed = JSON.parse(localStorage.getItem('animeWatchlist') || '[]')
      const rawList = Array.isArray(parsed) ? parsed : []
      animeWatchlist = rawList.map(item => {
        if (!item) return null
        return {
          id: item.id,
          title: item.title || '',
          format: item.format || 'TV',
          status: item.status === 'plantowatch' ? 'planning' : (item.status || 'watching'),
          currentEpisode: item.hasOwnProperty('currentEpisode') ? item.currentEpisode : (item.currentEp || 0),
          totalEpisodes: item.hasOwnProperty('totalEpisodes') ? item.totalEpisodes : (item.totalEp || 12),
          rating: item.rating || 0
        }
      }).filter(Boolean)
    } catch { animeWatchlist = [] }

    let eventsList = []
    try {
      const parsed = JSON.parse(localStorage.getItem('eventsList') || '[]')
      eventsList = Array.isArray(parsed) ? parsed : []
    } catch { eventsList = [] }

    let longtermGoalsList = []
    try {
      const parsed = JSON.parse(localStorage.getItem('longtermGoalsList') || '[]')
      longtermGoalsList = Array.isArray(parsed) ? parsed : []
    } catch { longtermGoalsList = [] }

    let studyBooksList = []
    try {
      const parsed = JSON.parse(localStorage.getItem('studyBooksList') || '[]')
      studyBooksList = Array.isArray(parsed) ? parsed : []
    } catch { studyBooksList = [] }

    let waterIntakeLog = {}
    try {
      const parsed = JSON.parse(localStorage.getItem('waterIntakeLog') || '{}')
      waterIntakeLog = (parsed && typeof parsed === 'object') ? parsed : {}
    } catch { waterIntakeLog = {} }

    let workTimeLogs = []
    try {
      const parsed = JSON.parse(localStorage.getItem('workTimeLogs') || '[]')
      workTimeLogs = Array.isArray(parsed) ? parsed : []
    } catch { workTimeLogs = [] }

    const isClockedIn = localStorage.getItem('isClockedIn') === 'true'
    const activeClockInLogId = localStorage.getItem('activeClockInLogId') || null

    return {
      // User authentication state
      user: null,
      isAuthenticated: false,
      isAuthLoading: true,

      theme: localStorage.getItem('theme') || 'light',
      timePeriod: 'morning',
      todayFocus: localStorage.getItem('todayFocus') || '',
      
      // Module Data
      dailyTasks,
      customCategories,
      walkTrackerData,
      gymTrackerData,
      gymCheckedItems,
      fitnessStepGoal: parseInt(localStorage.getItem('fitnessStepGoal') || '10000'),
      
      financeTransactions,
      savingsContributions,
      savingsGoals,
      
      animeWatchlist,
      eventsList,
      longtermGoalsList,
      
      studyBooksList,
      studySessionNotes: localStorage.getItem('studySessionNotes') || '',
      studyTotalTime: parseInt(localStorage.getItem('studyTotalTime') || '0'),
      
      waterIntakeLog,
      waterDailyTarget: parseInt(localStorage.getItem('waterDailyTarget') || '2000'),
      
      // Work logs data
      workTimeLogs,
      isClockedIn,
      activeClockInLogId,
      
      dailyStreak: parseInt(localStorage.getItem('dailyStreak') || '0'),
      lastStreakDate: localStorage.getItem('lastStreakDate') || ''
    }
  },
  
  getters: {
    todayKey: () => getTodayKey(),
    
    // 🏃 Fitness computed properties
    todaySteps(state) {
      return state.walkTrackerData[getTodayKey()] || 0
    },
    todayWorkoutCalories(state) {
      const todayGym = state.gymTrackerData[getTodayKey()]
      return todayGym ? (parseInt(todayGym.calories) || 0) : 0
    },
    todayWalkCalories(state) {
      // 1 step = 0.04 kcal approx
      return Math.round((state.walkTrackerData[getTodayKey()] || 0) * 0.04)
    },
    todayTotalCaloriesBurned() {
      return this.todayWorkoutCalories + this.todayWalkCalories
    },
    fitnessStreak(state) {
      const allDates = new Set([...Object.keys(state.gymTrackerData), ...Object.keys(state.walkTrackerData)])
      let streak = 0
      let check = new Date()
      for (let i = 0; i < 365; i++) {
        const checkStr = `${check.getFullYear()}-${(check.getMonth() + 1).toString().padStart(2, '0')}-${check.getDate().toString().padStart(2, '0')}`
        const hasActivity = (state.gymTrackerData[checkStr] && state.gymTrackerData[checkStr].calories > 0) ||
                            (state.walkTrackerData[checkStr] && state.walkTrackerData[checkStr] > 0)
        if (hasActivity) {
          streak++
          check.setDate(check.getDate() - 1)
        } else if (i === 0) {
          // Allow today to be empty, check yesterday
          check.setDate(check.getDate() - 1)
        } else {
          break
        }
      }
      return streak
    },

    // 💰 Finance computed properties
    monthlyExpenses(state) {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return state.financeTransactions
        .filter(t => {
          const d = new Date(t.date)
          return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
    },

    totalSavings(state) {
      return state.savingsContributions.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
    },
    
    // 💧 Water computed properties
    todayWaterIntake(state) {
      return state.waterIntakeLog[getTodayKey()] || 0
    },
    waterStreak(state) {
      const today = new Date()
      today.setHours(0,0,0,0)
      
      let streak = 0
      let checkDate = new Date(today)
      
      while(true) {
        const key = `${checkDate.getFullYear()}-${(checkDate.getMonth()+1).toString().padStart(2, '0')}-${checkDate.getDate().toString().padStart(2, '0')}`
        const amount = state.waterIntakeLog[key] || 0
        
        if (amount >= state.waterDailyTarget) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          const isToday = checkDate.getTime() === today.getTime()
          if (isToday) {
            checkDate.setDate(checkDate.getDate() - 1)
          } else {
            break
          }
        }
      }
      return streak
    }
  },
  
  actions: {
    // ── Global Themes & Settings ──────────────────────────
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem('theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    },
    toggleTheme() {
      if (this.theme === 'light') {
        this.setTheme('navy')
      } else if (this.theme === 'navy') {
        this.setTheme('dark')
      } else {
        this.setTheme('light')
      }
    },
    updateTimePeriod(period) {
      this.timePeriod = period
    },
    updateTodayFocus(focus) {
      this.todayFocus = focus
      localStorage.setItem('todayFocus', focus)
    },

    // ── Tasks & Categories ────────────────────────────────
    addTask(task) {
      this.dailyTasks.push(task)
      localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks))
    },
    toggleTaskDone(id, done) {
      const idx = this.dailyTasks.findIndex(t => t.id === id)
      if (idx !== -1) {
        this.dailyTasks[idx].done = done
        localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks))
      }
    },
    deleteTask(id) {
      this.dailyTasks = this.dailyTasks.filter(t => t.id !== id)
      localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks))
    },
    addCategory(cat) {
      this.customCategories.push(cat)
      localStorage.setItem('customCategories', JSON.stringify(this.customCategories))
    },
    deleteCategory(name) {
      this.customCategories = this.customCategories.filter(c => c !== name)
      localStorage.setItem('customCategories', JSON.stringify(this.customCategories))
    },

    // ── Fitness Tracking ──────────────────────────────────
    updateSteps(steps) {
      const tk = getTodayKey()
      this.walkTrackerData[tk] = steps
      localStorage.setItem('walkTrackerData', JSON.stringify(this.walkTrackerData))
    },
    updateGymWorkout(calories, workout = 'Gym Session', duration = 3600) {
      const tk = getTodayKey()
      this.gymTrackerData[tk] = { workout, duration, calories }
      localStorage.setItem('gymTrackerData', JSON.stringify(this.gymTrackerData))
    },
    updateStepGoal(goal) {
      this.fitnessStepGoal = goal
      localStorage.setItem('fitnessStepGoal', goal.toString())
    },
    setGymCheckedItem(exerciseKey, isChecked) {
      this.gymCheckedItems[exerciseKey] = isChecked
      localStorage.setItem('gymCheckedItems', JSON.stringify(this.gymCheckedItems))
    },

    // ── Finance ───────────────────────────────────────────
    addTransaction(t) {
      this.financeTransactions.push(t)
      localStorage.setItem('financeTransactions', JSON.stringify(this.financeTransactions))
    },
    deleteTransaction(id) {
      this.financeTransactions = this.financeTransactions.filter(t => t.id !== id)
      localStorage.setItem('financeTransactions', JSON.stringify(this.financeTransactions))
    },

    // ── Savings ───────────────────────────────────────────
    addSavingsGoal(g) {
      this.savingsGoals.push(g)
      localStorage.setItem('savingsGoals', JSON.stringify(this.savingsGoals))
    },
    deleteSavingsGoal(id) {
      this.savingsGoals = this.savingsGoals.filter(g => g.id !== id)
      // Also clean up contributions for this goal
      this.savingsContributions = this.savingsContributions.filter(c => c.goalId !== id)
      localStorage.setItem('savingsGoals', JSON.stringify(this.savingsGoals))
      localStorage.setItem('savingsContributions', JSON.stringify(this.savingsContributions))
    },
    addSavingsContribution(c) {
      this.savingsContributions.push(c)
      localStorage.setItem('savingsContributions', JSON.stringify(this.savingsContributions))
    },
    deleteSavingsContribution(id) {
      this.savingsContributions = this.savingsContributions.filter(c => c.id !== id)
      localStorage.setItem('savingsContributions', JSON.stringify(this.savingsContributions))
    },

    // ── Anime Watchlist ───────────────────────────────────
    addAnime(a) {
      this.animeWatchlist.push(a)
      localStorage.setItem('animeWatchlist', JSON.stringify(this.animeWatchlist))
    },
    updateAnime(id, updates) {
      const idx = this.animeWatchlist.findIndex(a => a.id === id)
      if (idx !== -1) {
        this.animeWatchlist[idx] = { ...this.animeWatchlist[idx], ...updates }
        localStorage.setItem('animeWatchlist', JSON.stringify(this.animeWatchlist))
      }
    },
    deleteAnime(id) {
      this.animeWatchlist = this.animeWatchlist.filter(a => a.id !== id)
      localStorage.setItem('animeWatchlist', JSON.stringify(this.animeWatchlist))
    },

    // ── Events Scheduler ──────────────────────────────────
    addEvent(e) {
      this.eventsList.push(e)
      localStorage.setItem('eventsList', JSON.stringify(this.eventsList))
    },
    deleteEvent(id) {
      this.eventsList = this.eventsList.filter(e => e.id !== id)
      localStorage.setItem('eventsList', JSON.stringify(this.eventsList))
    },

    // ── Goals Tracker ─────────────────────────────────────
    addLongtermGoal(g) {
      this.longtermGoalsList.push(g)
      localStorage.setItem('longtermGoalsList', JSON.stringify(this.longtermGoalsList))
    },
    toggleMilestone(goalId, index) {
      const idx = this.longtermGoalsList.findIndex(g => g.id === goalId)
      if (idx !== -1) {
        this.longtermGoalsList[idx].milestones[index].done = !this.longtermGoalsList[idx].milestones[index].done
        localStorage.setItem('longtermGoalsList', JSON.stringify(this.longtermGoalsList))
      }
    },
    deleteLongtermGoal(id) {
      this.longtermGoalsList = this.longtermGoalsList.filter(g => g.id !== id)
      localStorage.setItem('longtermGoalsList', JSON.stringify(this.longtermGoalsList))
    },

    // ── Study Logs & Books ────────────────────────────────
    addBook(b) {
      this.studyBooksList.push(b)
      localStorage.setItem('studyBooksList', JSON.stringify(this.studyBooksList))
    },
    updateBook(id, updates) {
      const idx = this.studyBooksList.findIndex(b => b.id === id)
      if (idx !== -1) {
        this.studyBooksList[idx] = { ...this.studyBooksList[idx], ...updates }
        localStorage.setItem('studyBooksList', JSON.stringify(this.studyBooksList))
      }
    },
    deleteBook(id) {
      this.studyBooksList = this.studyBooksList.filter(b => b.id !== id)
      localStorage.setItem('studyBooksList', JSON.stringify(this.studyBooksList))
    },
    addStudyMinutes(mins) {
      this.studyTotalTime += mins
      localStorage.setItem('studyTotalTime', this.studyTotalTime.toString())
    },
    saveStudyNotes(notes) {
      this.studySessionNotes = notes
      localStorage.setItem('studySessionNotes', notes)
    },

    // ── Water Intake ──────────────────────────────────────
    addWater(amount) {
      const tk = getTodayKey()
      this.waterIntakeLog[tk] = (this.waterIntakeLog[tk] || 0) + amount
      localStorage.setItem('waterIntakeLog', JSON.stringify(this.waterIntakeLog))
    },
    resetWaterToday() {
      const tk = getTodayKey()
      this.waterIntakeLog[tk] = 0
      localStorage.setItem('waterIntakeLog', JSON.stringify(this.waterIntakeLog))
    },
    updateWaterTarget(target) {
      this.waterDailyTarget = target
      localStorage.setItem('waterDailyTarget', target.toString())
    },
    // ── Work Logs / Clock In/Out ──────────────────────────
    clockIn(note = '') {
      if (this.isClockedIn) return
      
      const logId = Date.now().toString()
      const now = new Date()
      const today = getTodayKey()
      
      const newLog = {
        id: logId,
        date: today,
        clockIn: now.toISOString(),
        clockOut: null,
        duration: null,
        note: note
      }
      
      this.workTimeLogs.push(newLog)
      this.isClockedIn = true
      this.activeClockInLogId = logId
      
      localStorage.setItem('workTimeLogs', JSON.stringify(this.workTimeLogs))
      localStorage.setItem('isClockedIn', 'true')
      localStorage.setItem('activeClockInLogId', logId)
    },
    clockOut(note = '') {
      if (!this.isClockedIn || !this.activeClockInLogId) return
      
      const idx = this.workTimeLogs.findIndex(l => l.id === this.activeClockInLogId)
      if (idx !== -1) {
        const now = new Date()
        const clockInTime = new Date(this.workTimeLogs[idx].clockIn)
        const diffMs = now - clockInTime
        const durationMins = Math.max(0, Math.round(diffMs / 60000))
        
        this.workTimeLogs[idx].clockOut = now.toISOString()
        this.workTimeLogs[idx].duration = durationMins
        if (note) {
          this.workTimeLogs[idx].note = note
        }
      }
      
      this.isClockedIn = false
      this.activeClockInLogId = null
      
      localStorage.setItem('workTimeLogs', JSON.stringify(this.workTimeLogs))
      localStorage.setItem('isClockedIn', 'false')
      localStorage.removeItem('activeClockInLogId')
    },
    deleteWorkLog(id) {
      this.workTimeLogs = this.workTimeLogs.filter(l => l.id !== id)
      localStorage.setItem('workTimeLogs', JSON.stringify(this.workTimeLogs))
      
      if (this.activeClockInLogId === id) {
        this.isClockedIn = false
        this.activeClockInLogId = null
        localStorage.setItem('isClockedIn', 'false')
        localStorage.removeItem('activeClockInLogId')
      }
    },
    // ── Authentication Actions ─────────────────────────────
    async registerUser(email, password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        this.isAuthenticated = true
        await this.syncAllDataToCloud()
      } catch (err) {
        throw err
      }
    },
    async loginUser(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        this.isAuthenticated = true
        await this.fetchUserData()
      } catch (err) {
        throw err
      }
    },
    async logoutUser() {
      try {
        await signOut(auth)
        this.user = null
        this.isAuthenticated = false
        this.resetStoreData()
      } catch (err) {
        console.error('Logout error:', err)
      }
    },
    async fetchUserData() {
      if (!this.user) return
      try {
        const docRef = doc(db, 'users', this.user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.dailyTasks) this.dailyTasks = data.dailyTasks
          if (data.customCategories) this.customCategories = data.customCategories
          if (data.walkTrackerData) this.walkTrackerData = data.walkTrackerData
          if (data.gymTrackerData) this.gymTrackerData = data.gymTrackerData
          if (data.gymCheckedItems) this.gymCheckedItems = data.gymCheckedItems
          if (data.fitnessStepGoal !== undefined) this.fitnessStepGoal = data.fitnessStepGoal
          if (data.financeTransactions) this.financeTransactions = data.financeTransactions
          if (data.savingsContributions) this.savingsContributions = data.savingsContributions
          if (data.savingsGoals) this.savingsGoals = data.savingsGoals
          if (data.animeWatchlist) this.animeWatchlist = data.animeWatchlist
          if (data.eventsList) this.eventsList = data.eventsList
          if (data.longtermGoalsList) this.longtermGoalsList = data.longtermGoalsList
          if (data.studyBooksList) this.studyBooksList = data.studyBooksList
          if (data.studySessionNotes !== undefined) this.studySessionNotes = data.studySessionNotes
          if (data.studyTotalTime !== undefined) this.studyTotalTime = data.studyTotalTime
          if (data.waterIntakeLog) this.waterIntakeLog = data.waterIntakeLog
          if (data.waterDailyTarget !== undefined) this.waterDailyTarget = data.waterDailyTarget
          if (data.workTimeLogs) this.workTimeLogs = data.workTimeLogs
          if (data.isClockedIn !== undefined) this.isClockedIn = data.isClockedIn
          if (data.activeClockInLogId !== undefined) this.activeClockInLogId = data.activeClockInLogId
          if (data.dailyStreak !== undefined) this.dailyStreak = data.dailyStreak
          if (data.lastStreakDate !== undefined) this.lastStreakDate = data.lastStreakDate

          this.saveAllDataToLocalStorage()
        } else {
          await this.syncAllDataToCloud()
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    },
    async syncAllDataToCloud() {
      if (!this.user) return
      try {
        const docRef = doc(db, 'users', this.user.uid)
        await setDoc(docRef, {
          dailyTasks: this.dailyTasks,
          customCategories: this.customCategories,
          walkTrackerData: this.walkTrackerData,
          gymTrackerData: this.gymTrackerData,
          gymCheckedItems: this.gymCheckedItems,
          fitnessStepGoal: this.fitnessStepGoal,
          financeTransactions: this.financeTransactions,
          savingsContributions: this.savingsContributions,
          savingsGoals: this.savingsGoals,
          animeWatchlist: this.animeWatchlist,
          eventsList: this.eventsList,
          longtermGoalsList: this.longtermGoalsList,
          studyBooksList: this.studyBooksList,
          studySessionNotes: this.studySessionNotes,
          studyTotalTime: this.studyTotalTime,
          waterIntakeLog: this.waterIntakeLog,
          waterDailyTarget: this.waterDailyTarget,
          workTimeLogs: this.workTimeLogs,
          isClockedIn: this.isClockedIn,
          activeClockInLogId: this.activeClockInLogId,
          dailyStreak: this.dailyStreak,
          lastStreakDate: this.lastStreakDate
        }, { merge: true })
      } catch (err) {
        console.error('Error syncing all data to cloud:', err)
      }
    },
    saveAllDataToLocalStorage() {
      localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks))
      localStorage.setItem('customCategories', JSON.stringify(this.customCategories))
      localStorage.setItem('walkTrackerData', JSON.stringify(this.walkTrackerData))
      localStorage.setItem('gymTrackerData', JSON.stringify(this.gymTrackerData))
      localStorage.setItem('gymCheckedItems', JSON.stringify(this.gymCheckedItems))
      localStorage.setItem('fitnessStepGoal', this.fitnessStepGoal.toString())
      localStorage.setItem('financeTransactions', JSON.stringify(this.financeTransactions))
      localStorage.setItem('savingsContributions', JSON.stringify(this.savingsContributions))
      localStorage.setItem('savingsGoals', JSON.stringify(this.savingsGoals))
      localStorage.setItem('animeWatchlist', JSON.stringify(this.animeWatchlist))
      localStorage.setItem('eventsList', JSON.stringify(this.eventsList))
      localStorage.setItem('longtermGoalsList', JSON.stringify(this.longtermGoalsList))
      localStorage.setItem('studyBooksList', JSON.stringify(this.studyBooksList))
      localStorage.setItem('studySessionNotes', this.studySessionNotes)
      localStorage.setItem('studyTotalTime', this.studyTotalTime.toString())
      localStorage.setItem('waterIntakeLog', JSON.stringify(this.waterIntakeLog))
      localStorage.setItem('waterDailyTarget', this.waterDailyTarget.toString())
      localStorage.setItem('workTimeLogs', JSON.stringify(this.workTimeLogs))
      localStorage.setItem('isClockedIn', this.isClockedIn ? 'true' : 'false')
      if (this.activeClockInLogId) {
        localStorage.setItem('activeClockInLogId', this.activeClockInLogId)
      } else {
        localStorage.removeItem('activeClockInLogId')
      }
      localStorage.setItem('dailyStreak', this.dailyStreak.toString())
      localStorage.setItem('lastStreakDate', this.lastStreakDate)
    },
    resetStoreData() {
      this.dailyTasks = []
      this.customCategories = []
      this.walkTrackerData = {}
      this.gymTrackerData = {}
      this.gymCheckedItems = {}
      this.fitnessStepGoal = 10000
      this.financeTransactions = []
      this.savingsContributions = []
      this.savingsGoals = []
      this.animeWatchlist = []
      this.eventsList = []
      this.longtermGoalsList = []
      this.studyBooksList = []
      this.studySessionNotes = ''
      this.studyTotalTime = 0
      this.waterIntakeLog = {}
      this.waterDailyTarget = 2000
      this.workTimeLogs = []
      this.isClockedIn = false
      this.activeClockInLogId = null
      this.dailyStreak = 0
      this.lastStreakDate = ''

      localStorage.removeItem('dailyTasks')
      localStorage.removeItem('customCategories')
      localStorage.removeItem('walkTrackerData')
      localStorage.removeItem('gymTrackerData')
      localStorage.removeItem('gymCheckedItems')
      localStorage.removeItem('fitnessStepGoal')
      localStorage.removeItem('financeTransactions')
      localStorage.removeItem('savingsContributions')
      localStorage.removeItem('savingsGoals')
      localStorage.removeItem('animeWatchlist')
      localStorage.removeItem('eventsList')
      localStorage.removeItem('longtermGoalsList')
      localStorage.removeItem('studyBooksList')
      localStorage.removeItem('studySessionNotes')
      localStorage.removeItem('studyTotalTime')
      localStorage.removeItem('waterIntakeLog')
      localStorage.removeItem('waterDailyTarget')
      localStorage.removeItem('workTimeLogs')
      localStorage.removeItem('isClockedIn')
      localStorage.removeItem('activeClockInLogId')
      localStorage.removeItem('dailyStreak')
      localStorage.removeItem('lastStreakDate')
    },
    initializeAuth() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          this.isAuthLoading = true
          if (firebaseUser) {
            this.user = firebaseUser
            this.isAuthenticated = true
            await this.fetchUserData()
          } else {
            this.user = null
            this.isAuthenticated = false
          }
          this.isAuthLoading = false
          resolve(firebaseUser)
        })
      })
    }
  }
})
