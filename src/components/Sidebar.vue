<template>
  <div class="sidebar">
    <nav class="page-nav vertical" aria-label="Main navigation">
      
      <div class="nav-section">
        <div class="nav-section-header">Productivity</div>
        <ul>
          <li>
            <router-link to="/" exact-active-class="active">
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/study" active-class="active">
              Study &amp; Books
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-divider" aria-hidden="true"></div>

      <div class="nav-section">
        <div class="nav-section-header">Health &amp; Fitness</div>
        <ul>
          <li>
            <router-link to="/fitness" active-class="active">
              Fitness Tracker
            </router-link>
          </li>
          <li>
            <router-link to="/water" active-class="active">
              Water Intake
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-divider" aria-hidden="true"></div>

      <div class="nav-section">
        <div class="nav-section-header">Finance</div>
        <ul>
          <li>
            <router-link to="/finance" active-class="active">
              Expenses
            </router-link>
          </li>
          <li>
            <router-link to="/savings" active-class="active">
              Savings Tracking
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-divider" aria-hidden="true"></div>

      <div class="nav-section">
        <div class="nav-section-header">Entertainment &amp; Planning</div>
        <ul>
          <li>
            <router-link to="/anime" active-class="active">
              Anime Watchlist
            </router-link>
          </li>
          <li>
            <router-link to="/events" active-class="active">
              Events
            </router-link>
          </li>
          <li>
            <router-link to="/goals" active-class="active">
              Goals
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-divider" aria-hidden="true"></div>

      <div class="nav-section sidebar-bottom">
        <div class="theme-selector-sidebar">
          <span class="theme-select-title">Appearance</span>
          <div class="theme-segmented-control">
            <button 
              type="button"
              class="theme-seg-btn" 
              :class="{ active: store.theme === 'light' }" 
              @click="store.setTheme('light')"
            >
              Light
            </button>
            <button 
              type="button"
              class="theme-seg-btn" 
              :class="{ active: store.theme === 'navy' }" 
              @click="store.setTheme('navy')"
            >
              Navy
            </button>
            <button 
              type="button"
              class="theme-seg-btn" 
              :class="{ active: store.theme === 'dark' }" 
              @click="store.setTheme('dark')"
            >
              Dark
            </button>
          </div>
        </div>

        <!-- User Profile & Logout section -->
        <div class="user-profile-sidebar" v-if="store.isAuthenticated">
          <div class="user-info-wrap">
            <div class="user-avatar-placeholder">👤</div>
            <div class="user-details">
              <span class="user-name-title">Active Account</span>
              <span class="user-email-text" :title="store.user?.email">{{ store.user?.email }}</span>
            </div>
          </div>
          <button type="button" class="btn-logout" @click="handleLogout">
            <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>

    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()
const router = useRouter()

async function handleLogout() {
  if (confirm('Are you sure you want to sign out?')) {
    await store.logoutUser()
    router.push('/login')
  }
}
</script>

<style scoped>
/* Scoped overrides if needed, global sidebar styling is inherited from index.css */
.sidebar a {
  display: block;
  text-decoration: none;
}

.theme-selector-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  width: 100%;
}
.theme-select-title {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 11px;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}
.theme-segmented-control {
  display: flex;
  background: var(--bg-subtle, rgba(0,0,0,0.05));
  border: 1px solid var(--border-color);
  padding: 3px;
  border-radius: 12px;
  width: 100%;
}
.theme-seg-btn {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 6px 0;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}
.theme-seg-btn:hover {
  color: var(--text-primary);
}
.theme-seg-btn.active {
  background: var(--bg-card, #ffffff);
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* User profile details */
.user-profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  width: 100%;
}
.user-info-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
}
.user-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-purple-light);
  color: var(--accent-purple);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.user-name-title {
  font-size: 10px;
  font-weight: 750;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}
.user-email-text {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-logout {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid var(--border-color-strong);
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-logout:hover {
  background: var(--accent-red-bg, rgba(239, 68, 68, 0.08));
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}
.logout-icon {
  width: 14px;
  height: 14px;
}
</style>
