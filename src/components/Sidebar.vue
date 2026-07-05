<template>
  <!-- Sidebar navigation layout with responsive collapse controls -->
  <div class="sidebar-wrapper" :class="{ 'collapsed': store.isSidebarCollapsed }">
    <!-- Floating Collapsible Arrow Button -->
    <button type="button" class="sidebar-collapse-toggle" @click="store.toggleSidebar()" aria-label="Toggle Sidebar">
      <svg v-if="!store.isSidebarCollapsed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>

    <nav class="sidebar-nav" aria-label="Main navigation">
      <!-- ── Top Profile Card ── -->
      <div class="profile-card">
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
        <div class="profile-text" v-if="!store.isSidebarCollapsed">
          <span class="profile-role">Product Member</span>
          <span class="profile-display-name">{{ displayName }}</span>
        </div>
      </div>

      <div class="nav-divider"></div>

      <!-- ── Navigation Sections ── -->
      <div class="nav-menu">
        <!-- PRODUCTIVITY SECTION -->
        <div class="nav-section">
          <div class="nav-section-header">
            <span class="section-title">Overview</span>
          </div>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" exact-active-class="active" class="nav-link">
                <div class="nav-icon-wrap">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="9" y2="17"/>
                    <line x1="15" y1="13" x2="15" y2="17"/>
                    <line x1="9" y1="9" x2="15" y2="13"/>
                  </svg>
                </div>
                <span class="nav-label">Dashboard</span>
                <span class="sidebar-tooltip">Dashboard</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="nav-divider-thin" v-if="!store.isSidebarCollapsed"></div>

        <!-- STUDY & WATCHLIST SECTION (Focus & Leisure) -->
        <div class="nav-section">
          <div class="nav-section-header">
            <span class="section-title">Focus &amp; Leisure</span>
          </div>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/study" active-class="active" class="nav-link">
                <div class="nav-icon-wrap">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/>
                  </svg>
                </div>
                <span class="nav-label">Study Hub</span>
                <span class="sidebar-tooltip">Study Hub</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/anime" active-class="active" class="nav-link">
                <div class="nav-icon-wrap">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                    <line x1="7" y1="2" x2="7" y2="22"/>
                    <line x1="17" y1="2" x2="17" y2="22"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <line x1="2" y1="7" x2="7" y2="7"/>
                    <line x1="2" y1="17" x2="7" y2="17"/>
                    <line x1="17" y1="17" x2="22" y2="17"/>
                    <line x1="17" y1="7" x2="22" y2="7"/>
                  </svg>
                </div>
                <span class="nav-label">Watchlist</span>
                <span class="sidebar-tooltip">Watchlist</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="nav-divider-thin" v-if="!store.isSidebarCollapsed"></div>

        <!-- HEALTH & FITNESS SECTION -->
        <div class="nav-section">
          <div class="nav-section-header">
            <span class="section-title">Health</span>
          </div>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/fitness" active-class="active" class="nav-link">
                <div class="nav-icon-wrap">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                    <path d="M2 8h16v8H2z"/>
                    <line x1="6" y1="8" x2="6" y2="16"/>
                    <line x1="10" y1="8" x2="10" y2="16"/>
                  </svg>
                </div>
                <span class="nav-label">Fitness</span>
                <span class="sidebar-tooltip">Fitness</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/water" active-class="active" class="nav-link">
                <div class="nav-icon-wrap">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                </div>
                <span class="nav-label">Water Intake</span>
                <span class="sidebar-tooltip">Water Intake</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="nav-divider-thin" v-if="!store.isSidebarCollapsed"></div>

        <!-- FINANCE SECTION -->
        <div class="nav-section">
          <div class="nav-section-header">
            <span class="section-title">Finance</span>
          </div>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/finance" active-class="active" class="nav-link">
                <div class="nav-icon-wrap">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <span class="nav-label">Expenses</span>
                <span class="sidebar-tooltip">Expenses</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/savings" active-class="active" class="nav-link">
                <div class="nav-icon-wrap">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 22v-4h18v4H3zM12 2L2 7h20L12 2zM5 17v-7h2v7H5zm5 0v-7h2v7h-2zm5 0v-7h2v7h-2zm5 0v-7h2v7h-2z"/>
                  </svg>
                </div>
                <span class="nav-label">Savings Tracking</span>
                <span class="sidebar-tooltip">Savings</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="nav-divider-thin" v-if="!store.isSidebarCollapsed"></div>

        <!-- ENTERTAINMENT SECTION -->
        <div class="nav-section">
          <div class="nav-section-header">
            <span class="section-title">Planning</span>
          </div>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/events" active-class="active" class="nav-link">
                <div class="nav-icon-wrap">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <span class="nav-label">Events</span>
                <span class="sidebar-tooltip">Events</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/goals" active-class="active" class="nav-link">
                <div class="nav-icon-wrap">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <span class="nav-label">Goals</span>
                <span class="sidebar-tooltip">Goals</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- ── Bottom Options & Settings ── -->
      <div class="sidebar-footer">
        <div class="settings-section" v-if="!store.isSidebarCollapsed">
          <span class="settings-hdr">Theme Options</span>
          
          <!-- Segmented Control for 3 Themes (Color Picker circles) -->
          <div class="mode-toggle-row">
            <div class="mode-segmented-control-three">
              <button 
                type="button" 
                class="mode-btn-three" 
                :class="{ active: store.theme === 'light' }" 
                @click="store.setTheme('light')"
                title="White Mode"
              >
                <span class="color-dot light-dot"></span>
              </button>
              <button 
                type="button" 
                class="mode-btn-three" 
                :class="{ active: store.theme === 'navy' }" 
                @click="store.setTheme('navy')"
                title="Dark Blue Mode"
              >
                <span class="color-dot navy-dot"></span>
              </button>
              <button 
                type="button" 
                class="mode-btn-three" 
                :class="{ active: store.theme === 'dark' }" 
                @click="store.setTheme('dark')"
                title="Dark Mode"
              >
                <span class="color-dot dark-dot"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Collapsed Compact Settings Controls -->
        <div class="settings-section-collapsed" v-else>
          <button 
            type="button" 
            class="collapsed-settings-btn"
            @click="store.setTheme(store.theme === 'light' ? 'navy' : store.theme === 'navy' ? 'dark' : 'light')"
            :title="store.theme === 'light' ? 'Switch to DarkBlue' : store.theme === 'navy' ? 'Switch to Dark' : 'Switch to White'"
          >
            <div class="theme-indicator-dot" :class="store.theme"></div>
          </button>
        </div>

        <button type="button" class="btn-logout-sidebar" @click="handleLogout" title="Sign Out">
          <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span v-if="!store.isSidebarCollapsed">Sign Out</span>
        </button>
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

const gravatarUrl = computed(() => {
  const name = encodeURIComponent(displayName.value)
  return `https://api.dicebear.com/8.x/initials/svg?seed=${name}&backgroundColor=e65c00,6366f1,3b82f6&backgroundType=gradientLinear&fontSize=36&fontWeight=700`
})

const displayName = computed(() => {
  if (store.username) return store.username
  const email = store.user?.email || ''
  return email.split('@')[0] || 'User'
})

function onAvatarError(e) {
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
/* ── Main Sidebar Layout ────────────────────────────────── */
.sidebar-wrapper {
  position: relative;
  height: calc(100vh - 30px);
  width: 260px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  margin: 15px;
  padding: 24px 16px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.sidebar-wrapper.collapsed {
  width: 78px;
  padding: 24px 12px;
}

/* ── Collapsible Sliding Arrow Button ───────────────────── */
.sidebar-collapse-toggle {
  position: absolute;
  top: 30px;
  right: -13px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color-strong);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  z-index: 100;
  transition: transform 0.2s, background-color 0.2s;
}
.sidebar-collapse-toggle:hover {
  background: var(--bg-hover);
  transform: scale(1.1);
}
.sidebar-collapse-toggle svg {
  width: 14px;
  height: 14px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ── Top Profile Card ───────────────────────────────────── */
.profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 16px;
  transition: all 0.3s;
  overflow: hidden;
}
.profile-avatar-wrap {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}
.profile-avatar-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color-strong);
  box-shadow: var(--shadow-sm);
  background: var(--bg-subtle);
}
.profile-online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid var(--bg-card);
}
.profile-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.profile-role {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.profile-display-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Diviners & Separators ──────────────────────────────── */
.nav-divider {
  height: 1px;
  background: var(--border-color-strong);
  opacity: 0.4;
  margin: 16px 8px;
}
.nav-divider-thin {
  height: 1px;
  background: var(--border-color-subtle);
  margin: 8px 12px;
  opacity: 0.3;
}

/* ── Nav Menu Scroller ──────────────────────────────────── */
.nav-menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
}
/* Hide scrollbar for nav-menu */
.nav-menu::-webkit-scrollbar {
  width: 0px;
}

/* ── Sidebar Section Group ──────────────────────────────── */
.nav-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}
.nav-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 14px;
  user-select: none;
  margin-bottom: 4px;
}
.section-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-heading);
  letter-spacing: 0.05em;
  text-transform: none; /* Friendly capitalized style */
}

/* ── Navigation Links ───────────────────────────────────── */
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-item {
  margin: 4px 0;
  position: relative;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s ease;
  position: relative;
}
.nav-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
.nav-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.25;
  transition: transform 0.2s;
}

.nav-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.nav-link:hover .nav-icon {
  transform: scale(1.05);
}

/* Active Navigation Menu Style (Matches the high fidelity preview image) */
.nav-link.active {
  background: var(--nav-active-bg, #cbd5e1);
  color: var(--nav-active-color, #0f172a);
  box-shadow: none;
}

/* ── Collapsed Sidebar Tooltips ────────────────────────── */
.sidebar-tooltip {
  display: none;
  position: absolute;
  left: 80px;
  top: 50%;
  transform: translateY(-50%);
  background: #0f172a;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: var(--shadow-lg);
  pointer-events: none;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.sidebar-tooltip::after {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent #0f172a transparent transparent;
}

.collapsed .nav-link {
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
}
.collapsed .nav-label {
  display: none !important;
}
.collapsed .section-title {
  display: block;
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  color: var(--text-secondary);
  max-width: 62px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}
.collapsed .nav-section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  margin: 4px 0;
}

.collapsed .nav-link:hover .sidebar-tooltip {
  display: block;
  opacity: 1;
}

/* ── Sidebar Footer settings ── */
.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.settings-hdr {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding-left: 12px;
}

/* ── Theme Options Styling ── */
.mode-toggle-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  width: 100%;
}
.mode-segmented-control-three {
  display: flex;
  background: var(--bg-input-inset, rgba(0,0,0,0.03));
  border-radius: 99px;
  padding: 4px;
  border: 1px solid var(--border-color);
  width: 100%;
  gap: 4px;
}
.mode-btn-three {
  flex: 1;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  border-radius: 99px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.mode-btn-three.active {
  background: var(--bg-card, #ffffff) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid var(--border-color-strong);
}
.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
}
.light-dot {
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
}
.navy-dot {
  background-color: #3b82f6;
  border: 1px solid #1d4ed8;
}
.dark-dot {
  background-color: #27272a;
  border: 1px solid #52525b;
}
.mode-btn-three:hover .color-dot {
  transform: scale(1.2);
}
.mode-btn-three.active .color-dot {
  transform: scale(1.15);
  outline: 1.5px solid var(--text-muted, #71717a);
  outline-offset: 2px;
}

/* Collapsed Settings UI */
.settings-section-collapsed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.collapsed-settings-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-card);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.collapsed-settings-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.theme-indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}
.theme-indicator-dot.light {
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.theme-indicator-dot.navy {
  background-color: #3b82f6;
}
.theme-indicator-dot.dark {
  background-color: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* ── Sign Out ── */
.btn-logout-sidebar {
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid var(--border-color-strong);
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-logout-sidebar:hover {
  background: var(--accent-red-bg, rgba(239, 68, 68, 0.08));
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}
.logout-icon {
  width: 16px;
  height: 16px;
}

</style>
