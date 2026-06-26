<template>
  <div class="sidebar">
    <nav class="page-nav vertical" aria-label="Main navigation">
      
      <div class="nav-section">
        <div class="nav-section-header">Productivity</div>
        <ul>
          <li>
            <router-link to="/" exact-active-class="active">
              📊 Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/study" active-class="active">
              📚 Study &amp; Books
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
              🏋 Fitness Tracker
            </router-link>
          </li>
          <li>
            <router-link to="/water" active-class="active">
              💧 Water Intake
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
              💰 Expenses
            </router-link>
          </li>
          <li>
            <router-link to="/savings" active-class="active">
              🏦 Savings Tracking
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
              🎬 Anime Watchlist
            </router-link>
          </li>
          <li>
            <router-link to="/events" active-class="active">
              📅 Events
            </router-link>
          </li>
          <li>
            <router-link to="/goals" active-class="active">
              🎯 Goals
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-divider" aria-hidden="true"></div>

      <div class="nav-section sidebar-bottom">
        <div class="dark-mode-toggle">
          <span class="toggle-label">🌙 Dark Mode</span>
          <label class="toggle-switch">
            <input 
              type="checkbox" 
              id="darkModeToggle" 
              :checked="store.theme === 'dark'"
              @change="store.toggleTheme()"
            />
            <span class="toggle-slider"></span>
          </label>
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
</style>
