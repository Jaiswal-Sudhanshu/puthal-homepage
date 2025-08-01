// Import the functions you need from the SDKs you need
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

// Your web app's Firebase configuration
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

// Modal helper functions
function openModal(modal) { modal.classList.add('open'); }
function closeModal(modal) { modal.classList.remove('open'); }

document.addEventListener('DOMContentLoaded', () => {
  const signupModal = document.getElementById('signup-modal');
  const loginModal = document.getElementById('login-modal');

  // Mobile nav menu code (if from previous instructions)
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const navOverlay = document.querySelector('.nav-overlay');
  const navCloseBtn = document.querySelector('.nav-close');

  function openNavMenu() {
    navList.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }
  function closeNavMenu() {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', openNavMenu);
  navCloseBtn.addEventListener('click', closeNavMenu);
  navOverlay.addEventListener('click', closeNavMenu);
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNavMenu);
  });

  // Modal triggers
  document.body.addEventListener('click', e => {
    if (e.target.id === 'nav-signup') { e.preventDefault(); openModal(signupModal); }
    if (e.target.id === 'nav-login') { e.preventDefault(); openModal(loginModal); }
    if (e.target.id === 'signup-close') { closeModal(signupModal); }
    if (e.target.id === 'login-close') { closeModal(loginModal); }
    if (e.target.id === 'show-login') { e.preventDefault(); closeModal(signupModal); openModal(loginModal); }
    if (e.target.id === 'show-signup') { e.preventDefault(); closeModal(loginModal); openModal(signupModal); }
    if (e.target === signupModal) closeModal(signupModal);
    if (e.target === loginModal) closeModal(loginModal);
  });

  // --- Signup form ---
  document.getElementById('signupForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const mobile = document.getElementById('signup-mobile').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const errorMsg = document.getElementById('signup-error');
    errorMsg.style.color = "#e14444";

    // Basic validations
    if (!name || !email || !mobile || !password || !confirm) {
      errorMsg.textContent = 'All fields are required.';
      return;
    }
    // Email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errorMsg.textContent = 'Invalid email format.';
      return;
    }
    // Mobile 10 digit check
    if (!/^\d{10}$/.test(mobile)) {
      errorMsg.textContent = 'Mobile number must be exactly 10 digits.';
      return;
    }
    if (password.length < 6) {
      errorMsg.textContent = 'Password must be at least 6 characters.';
      return;
    }
    if (password !== confirm) {
      errorMsg.textContent = 'Passwords do not match.';
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      // You can store mobile number to Firestore here if you want (not covered now)
      errorMsg.style.color = "#11b878";
      errorMsg.textContent = "Signup successful!";
      setTimeout(() => { closeModal(signupModal); errorMsg.textContent = ""; location.reload(); }, 1200);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        errorMsg.textContent = "Email already in use.";
      } else {
        errorMsg.textContent = err.message;
      }
    }
  });

  // --- Login form ---
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const mobile = document.getElementById('login-mobile').value.trim();
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('rememberMe').checked;
    const errorMsg = document.getElementById('login-error');
    errorMsg.style.color = "#e14444";

    if (!email || !mobile || !password) {
      errorMsg.textContent = 'All fields are required.';
      return;
    }
    // Mobile 10 digit check
    if (!/^\d{10}$/.test(mobile)) {
      errorMsg.textContent = 'Mobile number must be exactly 10 digits.';
      return;
    }

    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      errorMsg.style.color = "#11b878";
      const userName = userCred.user.displayName || "User";
      errorMsg.textContent = `Welcome back, ${userName}!`;

      if (remember) localStorage.setItem("puthal_remember", "yes");

      setTimeout(() => {
        closeModal(loginModal);
        errorMsg.textContent = "";
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

  // --- Protect dashboard ---
  if (window.location.pathname.endsWith("dashboard.html")) {
    onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "index.html"; // redirect if not logged in
      // no user greeting here, per instruction
    });
  }
});
