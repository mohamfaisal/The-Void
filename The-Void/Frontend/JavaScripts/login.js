/* --- CUSTOM NOTIFICATION FUNCTIONS --- */
const notificationOverlay = document.getElementById('custom-notification');
const notificationMessage = document.getElementById('notification-message');
const notificationCloseBtn = document.getElementById('notification-close-btn');

function showNotification(message) {
  notificationMessage.textContent = message;
  notificationOverlay.style.display = 'flex';
}

function hideNotification() {
  notificationOverlay.style.display = 'none';
}

// Close popup when button is clicked
if (notificationCloseBtn) {
  notificationCloseBtn.addEventListener('click', hideNotification);
}

/* --- NAVIGATION LOGIC --- */
const navButtons = document.querySelectorAll(".card-nav button");
const cardForms = document.querySelector(".card-form .forms");
const activeBar = document.querySelector(".active-bar");
const cardHeroInner = document.querySelector(".card-hero-inner");

const selectView = (view) => {
    navButtons.forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.${view}`);
    if(activeBtn) activeBtn.classList.add("active");

    if (view === "signin") {
        cardForms.style.top = "0";
        activeBar.style.top = "33.33%";
        cardHeroInner.style.top = "0";
    } else {
        cardForms.style.top = "-100%";
        activeBar.style.top = "66.66%";
        cardHeroInner.style.top = "-100%";
    }
};

/* --- ANIMATIONS (Stars & Mouse) --- */
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    starsContainer.appendChild(star);
}

const mouseFollower = document.getElementById('mouseFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    if(mouseFollower) {
        mouseFollower.style.left = followerX + 'px';
        mouseFollower.style.top = followerY + 'px';
    }
    requestAnimationFrame(animateFollower);
}
animateFollower();


/* --- AUTHENTICATION LOGIC --- */
const API_URL = "https://the-void-backend.onrender.com/api";

// 1. SIGN UP
const signupForm = document.getElementById('signup');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page reload

    // Get inputs
    const inputs = signupForm.querySelectorAll('input');
    const username = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value.trim();

    if(!username || !email || !password) {
        showNotification("Please fill all fields."); // Custom alert for validation
        return;
    }

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if(res.ok) {
            // ✅ SUCCESS: Show Custom Popup
            showNotification("Registration successful! Initiating login sequence...");
            
            // Wait 2 seconds so the user can read it, then switch to Sign In view
            setTimeout(() => {
                hideNotification(); // Close the popup
                selectView('signin'); // Switch to the Sign In tab
                inputs.forEach(i => i.value = ''); // Clear the form
            }, 2000);
            
        } else {
            // ❌ ERROR: Show Custom Popup
            showNotification("Registration Failed: " + data.error);
        }
    } catch (err) {
        console.error(err);
        showNotification("Critical Error: Server not responding.");
    }
});

// 2. SIGN IN
const signinForm = document.getElementById('signin');
const signinBtn = signinForm.querySelector('.signinup');

signinBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Stop page reload

    // Get inputs
    const inputs = signinForm.querySelectorAll('input');
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    // Validation Error
    if(!email || !password) {
        showNotification("Please fill in both email and password.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if(res.ok) {
            // ✅ SUCCESS
            showNotification("Welcome back, " + data.username + "! Establishing connection...");
            
            // Save Token
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            
            // Redirect after 2 seconds so user sees the message
            setTimeout(() => {
                // Redirect Admin to Admin Panel, others to Home
                if(data.role === 'admin') {
                    window.location.href = "/The-Void/Frontend/Pages/admin.html";
                    } else {
                        window.location.href = "/The-Void/Frontend/index.html";
                    }
            }, 2000); 
        } else {
            // ❌ ERROR (User not found / Invalid credentials)
            // This replaces the browser alert with your custom popup
            showNotification(data.error || "Login failed. Check credentials.");
        }
    } catch (err) {
        console.error(err);
        showNotification("Server error. Please try again later.");
    }
});

/* --- GOOGLE LOGIN LOGIC --- */
function handleGoogleLogin(response) {
    // 'response.credential' is the Google Token
    const googleToken = response.credential;

    // Send it to Backend
    fetch(`${API_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            // Login Success!
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
showNotification("Google Login Successful! Welcome " + data.username + ". Redirecting...");
setTimeout(() => {
    window.location.href = "/The-Void/Frontend/index.html";
}, 2000);
            window.location.href = "/The-Void/Frontend/index.html";
        } else {
            alert("Google Login Failed: " + data.error);
        }
    })
    .catch(err => console.error("Error:", err));
}

/* --- GOOGLE LOGIN INITIALIZATION --- */
window.onload = function () {
    // 1. Initialize the Client
    google.accounts.id.initialize({
        client_id: "354057449258-lm2pm5cu81g6bpbf11nnqlqfci58o0mt.apps.googleusercontent.com",
        callback: handleGoogleLogin
    });

    // 2. Render SIGN UP Button (Long)
    const signupContainer = document.getElementById("google-btn-container");
    if (signupContainer) {
        google.accounts.id.renderButton(
            signupContainer,
            { 
                theme: "outline", 
                size: "large", 
                type: "standard", 
                width: signupContainer.offsetWidth 
            } 
        );
    }

    // 3. Render SIGN IN Button (Small Circle Icon)
    const signinContainer = document.getElementById("google-signin-circle");
    if (signinContainer) {
        google.accounts.id.renderButton(
            signinContainer,
            { 
                theme: "outline", 
                size: "medium", 
                type: "icon",   // <--- This makes it an icon only
                shape: "circle" // <--- This makes it round
            } 
        );
    }
};