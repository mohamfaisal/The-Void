const API_URL = 'https://the-void-backend.onrender.com/api/admin';
const AUTH_URL = 'https://the-void-backend.onrender.com/api'; // For creating users

// Variables for Models
let userIdToDelete = null;
let commentToDelete = { interactionId: null, commentId: null };

// --- 1. SECURITY CHECK ---
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    // If not logged in OR not admin, kick them out
    if (!token || role !== 'admin') {
        alert("ACCESS DENIED: Commanders Only.");
        window.location.href = "/The-Void/Frontend/Pages/login.html";
        return;
    }

    // Load Initial Data
    loadStats();
    loadUsers();
    loadComments();
    loadRecentActivity();

    // --- LOAD DASHBOARD ACTIVITY (Newest 5 items) ---
async function loadRecentActivity() {
    // 1. Load Recent Users
    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();
        
        // Get last 5 users (assuming backend sends them in order, we reverse to see newest)
        // If your backend sends oldest first, use .slice(-5).reverse()
        const recentUsers = users.reverse().slice(0, 5); 
        
        const userList = document.getElementById('recent-users-list');
        userList.innerHTML = '';

        recentUsers.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <span class="activity-user" style="color: ${user.role === 'admin' ? '#00d9ff' : 'white'}">
                        ${user.username}
                    </span>
                    <div class="activity-meta">${user.email}</div>
                </div>
                <span class="activity-meta">${user.role.toUpperCase()}</span>
            `;
            userList.appendChild(li);
        });
    } catch (err) { console.error("Recent Users Error:", err); }

    // 2. Load Recent Comments
    try {
        const res = await fetch(`${API_URL}/comments`);
        const comments = await res.json();
        
        // Get last 5 comments
        const recentComments = comments.reverse().slice(0, 5);
        
        const commentList = document.getElementById('recent-comments-list');
        commentList.innerHTML = '';

        if(recentComments.length === 0) {
            commentList.innerHTML = '<li style="color:grey; font-style:italic;">No signals detected.</li>';
        } else {
            recentComments.forEach(c => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div style="width: 100%;">
                        <div style="display:flex; justify-content:space-between;">
                            <span class="activity-user">${c.user}</span>
                            <span class="activity-meta">${c.date}</span>
                        </div>
                        <span class="activity-text">"${c.text}"</span>
                    </div>
                `;
                commentList.appendChild(li);
            });
        }
    } catch (err) { console.error("Recent Comments Error:", err); }
}
});

// --- 2. NAVIGATION LOGIC ---
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));

    // Show target section
    document.getElementById(sectionId).classList.add('active');
    
    // Update Active Nav State (Simple loop match)
    const navItems = document.querySelectorAll('.nav-links li');
    if(sectionId === 'dashboard') navItems[0].classList.add('active');
    if(sectionId === 'users') navItems[1].classList.add('active');
    if(sectionId === 'comments') navItems[2].classList.add('active');
}

// --- 3. FETCH FUNCTIONS ---

async function loadStats() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();
        document.getElementById('stat-users').innerText = data.users;
        document.getElementById('stat-missions').innerText = data.missions;
        document.getElementById('stat-gallery').innerText = data.gallery;
        document.getElementById('stat-diary').innerText = data.diary;
    } catch (err) { console.error("Stats Error:", err); }
}

async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '';

        users.forEach(user => {
            // Prevent deleting yourself
            const isMe = user.username === localStorage.getItem('username');
            const deleteBtn = isMe ? '<span style="color:gray;">(You)</span>' : 
                `<button class="btn-delete" onclick="deleteUser('${user._id}', '${user.username}')">Ban</button>`;

            const row = `
                <tr>
                    <td style="color: #666; font-size: 0.8rem;">${user._id}</td>
                    <td style="font-weight: bold; color: ${user.role === 'admin' ? '#00d9ff' : 'white'}">${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${deleteBtn}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (err) { console.error("Users Error:", err); }
}

async function loadComments() {
    try {
        const res = await fetch(`${API_URL}/comments`);
        const comments = await res.json();
        const tbody = document.getElementById('comments-table-body');
        tbody.innerHTML = '';

        if(comments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No communications intercepted.</td></tr>';
            return;
        }

        comments.forEach(c => {
            const row = `
                <tr>
                    <td style="color: var(--primary);">${c.user}</td>
                    <td>${c.text}</td>
                    <td>${c.articleId}</td>
                    <td>${c.date}</td>
                    <td><button class="btn-delete" onclick="deleteComment('${c.interactionId}', '${c.commentId}')">Delete</button></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (err) { console.error("Comments Error:", err); }
}

// --- 4. ACTION FUNCTIONS ---

// CREATE USER (Manual)
document.getElementById('admin-signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;

    try {
        const res = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            alert('Cadet recruited successfully!');
            document.getElementById('admin-signup-form').reset();
            loadUsers(); // Refresh list
            loadStats(); // Refresh stats
        } else {
            alert('Recruitment Failed: ' + data.error);
        }
    } catch (err) { alert('Error contacting mainframe.'); }
});

// DELETE USER
async function deleteUser(id, username) {
    userIdToDelete = id;
    document.getElementById('ban-username-display').textContent = username;

    // Show the modal
    const modal = document.getElementById('admin-ban-modal');
    if (modal) modal.style.display = 'flex';
}

// DELETE COMMENT
function deleteComment(interactionId, commentId) {
    commentToDelete = { interactionId, commentId };

    // Show the modal
    const modal = document.getElementById('admin-comment-modal');
    if (modal) modal.style.display = 'flex';
}

// LOGOUT

// 1. Trigger the Modal
function handleLogout() {
    const modal = document.getElementById('admin-logout-modal');
    if(modal) modal.style.display = 'flex';
}

// 2. Setup Listeners (Run on load)
document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('logout-confirm-btn');
    const cancelBtn = document.getElementById('logout-cancel-btn');
    const modal = document.getElementById('admin-logout-modal');

    if(confirmBtn) {
        confirmBtn.onclick = () => {
            // Actual Logout Logic
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = "/The-Void/Frontend/index.html";
        };
    }

    if(cancelBtn) {
        cancelBtn.onclick = () => {
            if(modal) modal.style.display = 'none';
        };
    }

    // --- USER BAN MODAL HANDLERS ---
    const banConfirmBtn = document.getElementById('ban-confirm-btn');
    const banCancelBtn = document.getElementById('ban-cancel-btn');
    const banModal = document.getElementById('admin-ban-modal');

    if (banConfirmBtn) {
        banConfirmBtn.onclick = async () => {
            if (userIdToDelete) {
                try {
                    // Actual Deletion Logic
                    await fetch(`${API_URL}/users/${userIdToDelete}`, { method: 'DELETE' });
                    
                    // Hide modal and refresh list
                    if (banModal) banModal.style.display = 'none';
                    alert(`User ${document.getElementById('ban-username-display').textContent} has been successfully deleted.`);
                    loadUsers();
                    loadStats();
                    userIdToDelete = null; // Reset ID
                } catch (err) { 
                    alert("Deletion failed."); 
                }
            }
        };
    }

    if (banCancelBtn) {
        banCancelBtn.onclick = () => {
            if (banModal) banModal.style.display = 'none';
            userIdToDelete = null; // Reset ID
        };
    }

    // --- COMMENT DELETION MODAL HANDLERS ---
    const comConfirmBtn = document.getElementById('comment-confirm-btn');
    const comCancelBtn = document.getElementById('comment-cancel-btn');
    const comModal = document.getElementById('admin-comment-modal');

    if (comConfirmBtn) {
        comConfirmBtn.onclick = async () => {
            if (commentToDelete.interactionId && commentToDelete.commentId) {
                try {
                    // Actual Deletion Logic
                    await fetch(`${API_URL}/comments/${commentToDelete.interactionId}/${commentToDelete.commentId}`, { method: 'DELETE' });
                    
                    // Hide modal and refresh list
                    if (comModal) comModal.style.display = 'none';
                    loadComments();
                    loadStats(); // Update dashboard count
                    commentToDelete = { interactionId: null, commentId: null }; // Reset
                } catch (err) { 
                    alert("Deletion failed."); 
                }
            }
        };
    }

    if (comCancelBtn) {
        comCancelBtn.onclick = () => {
            if (comModal) comModal.style.display = 'none';
            commentToDelete = { interactionId: null, commentId: null }; // Reset
        };
    }
});

/* --- MOBILE MENU LOGIC --- */
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('admin-mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('admin-overlay');
    const navLinks = document.querySelectorAll('.nav-links li');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Change Icon 
        const icon = mobileToggle.querySelector('i');
        if(sidebar.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    }

    // Toggle on click
    if(mobileToggle) mobileToggle.addEventListener('click', toggleMenu);
    
    // Close when clicking overlay
    if(overlay) overlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });
});