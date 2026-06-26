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
      </div>

    </nav>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'
const store = useAppStore()
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
</style>
