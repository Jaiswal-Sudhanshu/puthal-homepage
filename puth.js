
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// our web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjqT8Bf3XARYLdD0pU8CQ6Y9NRnT-OsRc",
  authDomain: "puthal--healh-care.firebaseapp.com",
  projectId: "puthal--healh-care",
  storageBucket: "puthal--healh-care.firebasestorage.app",
  messagingSenderId: "428251037073",
  appId: "1:428251037073:web:f374cff997e926d7af6e30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ----- Modal UI logic -----
function openModal(modal) { modal.classList.add('open'); }
function closeModal(modal) { modal.classList.remove('open'); }

document.addEventListener('DOMContentLoaded', () => {
  // Modal elements
  const signupModal = document.getElementById('signup-modal');
  const loginModal = document.getElementById('login-modal');

  // Modal triggers
  document.body.addEventListener('click', function(e) {
    if (e.target.id === 'nav-signup') { e.preventDefault(); openModal(signupModal); }
    if (e.target.id === 'nav-login') { e.preventDefault(); openModal(loginModal); }
    if (e.target.id === 'signup-close') { closeModal(signupModal); }
    if (e.target.id === 'login-close') { closeModal(loginModal); }
    if (e.target.id === 'show-login') { e.preventDefault(); closeModal(signupModal); openModal(loginModal); }
    if (e.target.id === 'show-signup') { e.preventDefault(); closeModal(loginModal); openModal(signupModal); }
    if (e.target === signupModal) closeModal(signupModal);
    if (e.target === loginModal) closeModal(loginModal);
  });

  // Signup form logic
  document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const errorMsg = document.getElementById('signup-error');
    errorMsg.style.color = "#e14444";

    //--- validation ---
    if (!name || !email || !password || !confirm)   return errorMsg.textContent = 'All fields are required.';
    if (!/^\S+@\S+\.\S+$/.test(email))              return errorMsg.textContent = 'Invalid email format.';
    if (password.length < 6)                        return errorMsg.textContent = 'Password must be at least 6 characters.';
    if (password !== confirm)                       return errorMsg.textContent = 'Passwords do not match.';

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      errorMsg.style.color = "#11b878";
      errorMsg.textContent = "Signup successful!";
      setTimeout(() => { closeModal(signupModal); errorMsg.textContent = ""; location.reload(); }, 1200);
    } catch (err) {
      if (err.code && err.code === "auth/email-already-in-use") {
        errorMsg.textContent = "Email already in use.";
      } else {
        errorMsg.textContent = err.message;
      }
    }
  });

  // Login form logic
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('rememberMe').checked;
    const errorMsg = document.getElementById('login-error');
    errorMsg.style.color = "#e14444";
    if (!email || !password)           return errorMsg.textContent = 'Both fields are required.';


    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // Show welcome message S
      errorMsg.style.color = "#11b878";
      const userName = userCred.user.displayName || "User";
      errorMsg.textContent = `Welcome back, ${userName}!`;

      if (remember) localStorage.setItem("puthal_remember", "yes");

      setTimeout(() => {
        closeModal(loginModal);
        errorMsg.textContent = "";
        // Redirect to dashboard (no name shown there)
        window.location.href = "dashboard.html"; 
      }, 1200);

    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errorMsg.textContent = "Invalid Credentials";
      } else {
        errorMsg.textContent = err.message;
      }
    }
  });

  if (window.location.pathname.endsWith("dashboard.html")) {
    onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "index.html"; // Not logged in
      // DO NOT show user name here
    });
  }
});
