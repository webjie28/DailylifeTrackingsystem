<template>
  <div class="sidebar">
    <nav class="page-nav vertical" aria-label="Main navigation">

      <!-- ── Top Profile Card ── -->
      <div class="sidebar-profile-card" v-if="store.isAuthenticated">
        <div class="profile-avatar-wrap">
          <img 
            :src="gravatarUrl" 
            :alt="displayName"
            class="profile-avatar-img"
            @error="onAvatarError"
            referrerpolicy="no-referrer"
          />
          <div class="profile-online-dot"></div>
        </div>
        <div class="profile-text">
          <span class="profile-display-name">{{ displayName }}</span>
          <span class="profile-email-text" :title="store.user?.email">{{ store.user?.email }}</span>
        </div>
      </div>

      <div class="nav-divider" aria-hidden="true" v-if="store.isAuthenticated"></div>

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

        <!-- Sign Out button -->
        <div class="sidebar-signout-wrap" v-if="store.isAuthenticated">
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()
const router = useRouter()

// Generate Gravatar URL from email using MD5 hash
// We use a simple approach: Gravatar via DiceBear (no hash needed) as fallback
const gravatarUrl = computed(() => {
  const email = store.user?.email || ''
  // Use DiceBear initials avatar as primary (works without MD5)
  const name = encodeURIComponent(displayName.value)
  return `https://api.dicebear.com/8.x/initials/svg?seed=${name}&backgroundColor=6366f1,8b5cf6,a78bfa&backgroundType=gradientLinear&fontSize=36&fontWeight=700`
})

const displayName = computed(() => {
  // Show username if available, otherwise derive initials from email
  if (store.username) return store.username
  const email = store.user?.email || ''
  return email.split('@')[0] || 'User'
})

function onAvatarError(e) {
  // Fallback to a plain colored circle with initials if image fails
  e.target.style.display = 'none'
}

async function handleLogout() {
  if (confirm('Are you sure you want to sign out?')) {
    await store.logoutUser()
    router.push('/login')
  }
}
</script>

<style scoped>
.sidebar a {
  display: block;
  text-decoration: none;
}

/* ── Top Profile Card ───────────────────────────────────── */
.sidebar-profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 16px;
  text-align: center;
}

.profile-avatar-wrap {
  position: relative;
  display: inline-block;
}

.profile-avatar-img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-purple-light);
  box-shadow: 0 4px 20px var(--accent-purple-light), 0 0 0 1px var(--border-color-strong);
  background: var(--accent-purple-light);
  transition: box-shadow 0.3s ease;
}

.profile-avatar-img:hover {
  box-shadow: 0 6px 28px var(--accent-purple-mid), 0 0 0 1px var(--accent-purple-light);
}

.profile-online-dot {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #22c55e;
  border: 2.5px solid var(--sidebar-bg, #ffffff);
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
}

.profile-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  width: 100%;
}

.profile-display-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-heading);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-email-text {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Theme Selector ────────────────────────────────────── */
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

/* ── Sign Out ──────────────────────────────────────────── */
.sidebar-signout-wrap {
  width: 100%;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
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
