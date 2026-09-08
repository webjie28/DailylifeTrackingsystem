import { createRouter, createWebHashHistory } from 'vue-router'
const HomeView = () => import('../views/HomeView.vue')
const FitnessView = () => import('../views/FitnessView.vue')
const FinanceView = () => import('../views/FinanceView.vue')
const SavingsView = () => import('../views/SavingsView.vue')
const StudyView = () => import('../views/StudyView.vue')
const AnimeView = () => import('../views/AnimeView.vue')
const EventsView = () => import('../views/EventsView.vue')
const GoalsView = () => import('../views/GoalsView.vue')
const WaterView = () => import('../views/WaterView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
import { useAppStore } from '../stores/appStore'

const router = createRouter({
  history: createWebHashHistory(), // Hash history works flawlessly in local Electron bundle (file:///)
  routes: [
    { path: '/habits', name: 'habits', component: () => import('../views/HabitsView.vue') },
    { path: '/check-in', name: 'check-in', component: () => import('../views/CheckInView.vue') },
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
