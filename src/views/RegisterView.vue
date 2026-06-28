<template>
  <div class="auth-view animate-in">
    <div class="auth-glass-container">
      <div class="auth-header">
        <h1 class="auth-logo">DLT</h1>
        <p class="auth-subtitle">Daily Life Tracker</p>
      </div>

      <h3 class="auth-title">Create Account</h3>

      <!-- Alert Message -->
      <div v-if="errorMessage" class="auth-alert error">
        <span class="alert-icon">⚠️</span>
        <span class="alert-text">{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="auth-input-group">
          <input 
            type="text" 
            id="username-input"
            v-model="username" 
            placeholder=" " 
            required 
            :disabled="isLoading"
          />
          <label for="username-input">Username</label>
          <svg class="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <div class="auth-input-group">
          <input 
            type="email" 
            id="email-input"
            v-model="email" 
            placeholder=" " 
            required 
            :disabled="isLoading"
          />
          <label for="email-input">Email Address</label>
          <svg class="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <div class="auth-input-group">
          <input 
            type="password" 
            id="password-input"
            v-model="password" 
            placeholder=" " 
            required 
            :disabled="isLoading"
          />
          <label for="password-input">Password</label>
          <svg class="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <div class="auth-input-group">
          <input 
            type="password" 
            id="confirm-password-input"
            v-model="confirmPassword" 
            placeholder=" " 
            required 
            :disabled="isLoading"
          />
          <label for="confirm-password-input">Confirm Password</label>
          <svg class="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <button type="submit" class="btn-auth-submit" :disabled="isLoading">
          <span v-if="isLoading" class="auth-spinner"></span>
          <span v-else>Register</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Already have an account? <router-link to="/login" class="auth-link">Sign In here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'

const store = useAppStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleRegister() {
  if (!username.value || !email.value || !password.value || !confirmPassword.value) return
  
  const usernameClean = username.value.trim().toLowerCase()
  // Validate username format (no spaces, only letters, numbers, and underscores, between 3 and 15 chars)
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/
  if (!usernameRegex.test(usernameClean)) {
    errorMessage.value = 'Username must be 3-15 characters and contain only letters, numbers, or underscores.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }
  
  if (password.value.length < 6) {
    errorMessage.value = 'Password should be at least 6 characters.'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 1. Check if username is already taken
    const usernameDocRef = doc(db, 'usernames', usernameClean)
    const usernameDocSnap = await getDoc(usernameDocRef)
    
    if (usernameDocSnap.exists()) {
      errorMessage.value = 'Username is already taken.'
      isLoading.value = false
      return
    }

    // 2. Proceed with registration
    await store.registerUser(email.value.trim(), password.value, username.value.trim())
    router.push('/')
  } catch (err) {
    console.error('Registration error:', err)
    if (err.code === 'auth/email-already-in-use') {
      errorMessage.value = 'Email address is already registered.'
    } else if (err.code === 'auth/invalid-email') {
      errorMessage.value = 'Please enter a valid email address.'
    } else if (err.code === 'auth/weak-password') {
      errorMessage.value = 'Password is too weak. Make it at least 6 characters.'
    } else {
      errorMessage.value = 'Failed to create account. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-view {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-glass-container {
  background: var(--bg-card);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-color-strong);
  border-radius: 28px;
  padding: 40px 32px;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-xl);
  text-align: center;
}

.auth-header {
  margin-bottom: 28px;
}

.auth-logo {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 38px;
  font-weight: 800 !important;
  letter-spacing: 0.15em;
  background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 4px 0;
  text-transform: uppercase;
}

.auth-subtitle {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin: 0;
}

.auth-title {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
}

.auth-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 13px;
  text-align: left;
}

.auth-alert.error {
  background: var(--accent-red-bg);
  border: 1px solid var(--accent-red-border);
  color: var(--accent-red-text);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-input-group {
  position: relative;
  margin-top: 10px; /* add spacing at the top so the floating label has room */
  margin-bottom: 8px;
}

.auth-input-group input {
  width: 100%;
  padding: 12px 14px 12px 42px; /* centered vertical padding */
  border-radius: 14px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-input-inset);
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
}

.auth-input-group label {
  position: absolute;
  left: 42px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left top;
}

/* Floating Label Animation: floats completely outside the input box */
.auth-input-group input:focus ~ label,
.auth-input-group input:not(:placeholder-shown) ~ label {
  top: -14px; /* moves completely above the input border */
  left: 12px; /* aligns to the left edge of the input box */
  transform: scale(0.8);
  font-weight: 750;
  color: var(--accent-purple);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.auth-input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
  transition: all 0.2s ease;
}

.auth-input-group input:focus ~ .auth-input-icon {
  color: var(--accent-purple);
}

.auth-input-group input:focus {
  border-color: var(--accent-purple);
  box-shadow: 0 0 0 3px var(--accent-purple-light);
}

.btn-auth-submit {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-purple-hover) 100%);
  color: #ffffff;
  border: none;
  outline: none;
  border-radius: 14px;
  padding: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px var(--accent-purple-light);
  margin-top: 6px;
}

.btn-auth-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px var(--accent-purple-mid);
}

.btn-auth-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.auth-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: authSpin 0.8s linear infinite;
}

@keyframes authSpin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  margin-top: 24px;
  font-size: 13px;
  color: var(--text-secondary);
}

.auth-link {
  color: var(--accent-purple);
  text-decoration: none;
  font-weight: 700;
  transition: opacity 0.2s ease;
}

.auth-link:hover {
  text-decoration: underline;
  opacity: 0.85;
}
</style>
