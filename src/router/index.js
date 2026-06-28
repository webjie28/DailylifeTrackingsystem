import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FitnessView from '../views/FitnessView.vue'
import FinanceView from '../views/FinanceView.vue'
import SavingsView from '../views/SavingsView.vue'
import StudyView from '../views/StudyView.vue'
import AnimeView from '../views/AnimeView.vue'
import EventsView from '../views/EventsView.vue'
import GoalsView from '../views/GoalsView.vue'
import WaterView from '../views/WaterView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useAppStore } from '../stores/appStore'

const router = createRouter({
  history: createWebHashHistory(), // Hash history works flawlessly in local Electron bundle (file:///)
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { isGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { isGuest: true }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/fitness',
      name: 'fitness',
      component: FitnessView
    },
    {
      path: '/finance',
      name: 'finance',
      component: FinanceView
    },
    {
      path: '/savings',
      name: 'savings',
      component: SavingsView
    },
    {
      path: '/study',
      name: 'study',
      component: StudyView
    },
    {
      path: '/anime',
      name: 'anime',
      component: AnimeView
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView
    },
    {
      path: '/goals',
      name: 'goals',
      component: GoalsView
    },
    {
      path: '/water',
      name: 'water',
      component: WaterView
    }
  ]
})

// Authentication guard
router.beforeEach(async (to, from, next) => {
  const store = useAppStore()
  
  // Wait for Firebase auth to initialize on first load
  if (store.isAuthLoading) {
    await store.initializeAuth()
  }
  
  if (to.meta.isGuest) {
    if (store.isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    if (!store.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router


