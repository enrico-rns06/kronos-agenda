import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyDYBC1OhreNLe9RSAmfCkoQ3HKZbYy4Yfs",
  authDomain: "kronos-agenda-e2dd1.firebaseapp.com",
  projectId: "kronos-agenda-e2dd1",
  storageBucket: "kronos-agenda-e2dd1.firebasestorage.app",
  messagingSenderId: "224650667260",
  appId: "1:224650667260:web:f92ad73f40b0e48f5aa379"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)