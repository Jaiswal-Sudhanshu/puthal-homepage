import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDjqT8Bf3XARYLdD0pU8CQ6Y9NRnT-OsRc",
    authDomain: "puthal--healh-care.firebaseapp.com",
    projectId: "puthal--healh-care",
    storageBucket: "puthal--healh-care.appspot.com",
    messagingSenderId: "428251037073",
    appId: "1:428251037073:web:f374cff997e926d7af6e30"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
    const forgotPasswordModal = document.getElementById('forgot-password-modal');

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

    if (navToggle && navList && navOverlay && navCloseBtn) {
        navToggle.addEventListener('click', openNavMenu);
        navCloseBtn.addEventListener('click', closeNavMenu);
        navOverlay.addEventListener('click', closeNavMenu);
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNavMenu);
        });
    }

    document.body.addEventListener('click', e => {
        // Modal open triggers
        if (e.target.id === 'nav-signup') { e.preventDefault(); openModal(signupModal); }
        if (e.target.id === 'nav-login') { e.preventDefault(); openModal(loginModal); }
        if (e.target.id === 'show-forgot-password') { e.preventDefault(); closeModal(loginModal); openModal(forgotPasswordModal); }

        if (e.target.id === 'signup-close') { closeModal(signupModal); }
        if (e.target.id === 'login-close') { closeModal(loginModal); }
        if (e.target.id === 'forgot-password-close') { closeModal(forgotPasswordModal); }
        if (e.target === signupModal) { closeModal(signupModal); }
        if (e.target === loginModal) { closeModal(loginModal); }
        if (e.target === forgotPasswordModal) { closeModal(forgotPasswordModal); }

        // Switch between auth modals
        if (e.target.id === 'show-login') { e.preventDefault(); closeModal(signupModal); openModal(loginModal); }
        if (e.target.id === 'show-signup') { e.preventDefault(); closeModal(loginModal); openModal(signupModal); }
        if (e.target.id === 'back-to-login') { e.preventDefault(); closeModal(forgotPasswordModal); openModal(loginModal); }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeModal(signupModal);
            closeModal(loginModal);
            closeModal(forgotPasswordModal);
        }
    });
    onAuthStateChanged(auth, (user) => {
        
        if (user && window.location.pathname.endsWith('index.html')) {
            window.location.href = 'dashboard.html';
        }
    });

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async e => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            const errorMsg = document.getElementById('signup-error');
            errorMsg.style.color = "#e14444";
            errorMsg.textContent = "";

            if (!name || !email || !password || !confirm) {
                errorMsg.textContent = 'All fields are required.';
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
                errorMsg.textContent = "Signup successful! Redirecting to dashboard...";
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1500);
            } catch (err) {
                errorMsg.textContent = err.code === "auth/email-already-in-use"
                    ? "Email already in use."
                    : err.message;
            }
        });
    }
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async e => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('rememberMe').checked;
            const errorMsg = document.getElementById('login-error');
            errorMsg.style.color = "#e14444";
            errorMsg.textContent = "";

            if (!email || !password) {
                errorMsg.textContent = 'All fields are required.';
                return;
            }

            try {
                const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
                await setPersistence(auth, persistence);
                await signInWithEmailAndPassword(auth, email, password);
            } catch (err) {
                errorMsg.textContent = (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found")
                    ? "Invalid email or password."
                    : err.message;
            }
        });
    }
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async e => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value.trim();
            const messageDiv = document.getElementById('forgot-password-message');
            messageDiv.textContent = "";

            if (!email) {
                messageDiv.style.color = "#e14444";
                messageDiv.textContent = "Please enter your email address.";
                return;
            }

            try {
                await sendPasswordResetEmail(auth, email);
                messageDiv.style.color = "#11b878";
                messageDiv.textContent = "If an account exists, a reset link has been sent to your email.";
            } catch (err) {
                messageDiv.style.color = "#e14444";
                // Keep the error message generic for security
                messageDiv.textContent = "An error occurred. Please try again later.";
            }
        });
    }
});