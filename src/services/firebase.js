import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyClUlfeU8qovcZKqg_gwkV1IFOoBQJFsOE",
  authDomain: "dailylifetrackingsystem.firebaseapp.com",
  projectId: "dailylifetrackingsystem",
  storageBucket: "dailylifetrackingsystem.firebasestorage.app",
  messagingSenderId: "631675349603",
  appId: "1:631675349603:web:052c3e441f56ce5ccea656",
  measurementId: "G-7S3RHEGWFH"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Services
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
