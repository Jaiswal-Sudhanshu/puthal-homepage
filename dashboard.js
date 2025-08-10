import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Your web app's Firebase configuration (same as in puth.js)
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

document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Auth Check and Welcome Message ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, display a personalized welcome message.
            const userName = user.displayName || user.email;
            const firstName = userName ? userName.split(' ')[0] : 'User'; // Use first name or fallback
            welcomeMessage.textContent = `Welcome, ${firstName}!`;
        } else {
            // User is signed out, redirect them to the login page.
            window.location.href = 'index.html';
        }
    });

    // --- Logout Functionality ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                alert('You have been successfully logged out.');
                // The onAuthStateChanged listener will handle the redirection.
            } catch (error) {
                console.error("Logout failed:", error);
                alert('Failed to log out. Please try again.');
            }
        });
    }
});