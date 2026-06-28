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
        <div class="form-group">
          <label>Email Address</label>
          <div class="auth-input-wrapper">
            <svg class="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input 
              type="email" 
              v-model="email" 
              placeholder="name@example.com" 
              required 
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Password</label>
          <div class="auth-input-wrapper">
            <svg class="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input 
              type="password" 
              v-model="password" 
              placeholder="Min. 6 characters" 
              required 
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <div class="auth-input-wrapper">
            <svg class="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input 
              type="password" 
              v-model="confirmPassword" 
              placeholder="Re-type password" 
              required 
              :disabled="isLoading"
            />
          </div>
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

const store = useAppStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleRegister() {
  if (!email.value || !password.value || !confirmPassword.value) return
  
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
    await store.registerUser(email.value.trim(), password.value)
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.form-group label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.auth-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-input-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}

.auth-input-wrapper input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border-radius: 14px;
  border: 1px solid var(--border-color-strong);
  background: var(--bg-input-inset);
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
}

.auth-input-wrapper input:focus {
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
