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
    storageBucket: "puthal--healh-care.appspot.com",
    messagingSenderId: "428251037073",
    appId: "1:428251037073:web:f374cff997e926d7af6e30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Helper functions to open and close a modal
function openModal(modal) {
    if (modal) {
        modal.classList.add('open');
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('open');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');

    // --- Mobile Navigation Menu ---
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

    // Event listeners for the navigation menu
    if (navToggle && navList && navOverlay && navCloseBtn) {
        navToggle.addEventListener('click', openNavMenu);
        navCloseBtn.addEventListener('click', closeNavMenu);
        navOverlay.addEventListener('click', closeNavMenu);
        // Close menu when a link is clicked
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNavMenu);
        });
    }

    // --- Modal Triggers and Handling ---
    document.body.addEventListener('click', e => {
        // Modal open triggers
        if (e.target.id === 'nav-signup') { e.preventDefault(); openModal(signupModal); }
        if (e.target.id === 'nav-login') { e.preventDefault(); openModal(loginModal); }

        // Modal close triggers
        if (e.target.id === 'signup-close') { closeModal(signupModal); }
        if (e.target.id === 'login-close') { closeModal(loginModal); }
        if (e.target === signupModal) { closeModal(signupModal); } // Click outside to close
        if (e.target === loginModal) { closeModal(loginModal); } // Click outside to close

        // Switch between login/signup modals
        if (e.target.id === 'show-login') { e.preventDefault(); closeModal(signupModal); openModal(loginModal); }
        if (e.target.id === 'show-signup') { e.preventDefault(); closeModal(loginModal); openModal(signupModal); }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeModal(signupModal);
            closeModal(loginModal);
        }
    });

    // --- Signup Form Logic ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async e => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const mobile = document.getElementById('signup-mobile').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            const errorMsg = document.getElementById('signup-error');
            errorMsg.style.color = "#e14444";

            if (!name || !email || !mobile || !password || !confirm) {
                errorMsg.textContent = 'All fields are required.';
                return;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                errorMsg.textContent = 'Invalid email format.';
                return;
            }
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
                errorMsg.style.color = "#11b878";
                errorMsg.textContent = "Signup successful! Redirecting...";
                setTimeout(() => {
                    closeModal(signupModal);
                    errorMsg.textContent = "";
                    location.reload();
                }, 1500);
            } catch (err) {
                errorMsg.textContent = err.code === "auth/email-already-in-use"
                    ? "Email already in use."
                    : err.message;
            }
        });
    }

    // --- Login Form Logic ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async e => {
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
            if (!/^\d{10}$/.test(mobile)) {
                errorMsg.textContent = 'Mobile number must be exactly 10 digits.';
                return;
            }

            try {
                const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
                await setPersistence(auth, persistence);

                const userCred = await signInWithEmailAndPassword(auth, email, password);
                errorMsg.style.color = "#11b878";
                const userName = userCred.user.displayName || "User";
                errorMsg.textContent = `Welcome back, ${userName}!`;

                setTimeout(() => {
                    closeModal(loginModal);
                    errorMsg.textContent = "";
                    window.location.href = "dashboard.html"; // Redirect to a dashboard page
                }, 1200);
            } catch (err) {
                errorMsg.textContent = (err.code === "auth/wrong-password" || err.code === "auth/user-not-found" || err.code === "auth/invalid-credential")
                    ? "Invalid credentials provided."
                    : err.message;
            }
        });
    }
});