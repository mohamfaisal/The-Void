/* --- CONFIGURATION --- */
const API_URL = 'https://the-void-backend.onrender.com/api/news';

/* --- MOCK DATA (Article Source) --- */
const categories = ["Space", "Technology", "Science", "Entertainment", "World", "Sports", "Health", "Business"];
const mockData = [
    { id: 101, title: "Starship Successfully Reaches Orbit", category: "Space", image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", content: "SpaceX's massive rocket has finally achieved orbit, marking a new era in interplanetary travel. The launch took place at Starbase, Texas, under clear skies.", timestamp: "2 hours ago", trending: true },
    { id: 102, title: "New Exoplanet Found in Goldilocks Zone", category: "Science", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "Astronomers using the James Webb Telescope have identified a planet with water vapor signatures just 40 light years away. It sits perfectly within the habitable zone.", timestamp: "4 hours ago", trending: true },
    { id: 103, title: "Quantum Computing Breakthrough", category: "Technology", image: "https://i.pinimg.com/736x/ef/40/6d/ef406d0600e96e75185d4f8e23c3c663.jpg", content: "Scientists have stabilized qubits for record time, bringing us closer to uncrackable encryption and super-fast processing speeds.", timestamp: "6 hours ago", trending: false },
    { id: 104, title: "NASA Announces Return to Moon Crew", category: "Space", image: "https://images.unsplash.com/photo-1541873676-a18131494184?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", content: "The Artemis II crew has been selected. Four astronauts will orbit the moon next year, paving the way for the first landing in over 50 years.", timestamp: "1 day ago", trending: true },
    { id: 105, title: "Virtual Reality Cinema Takes Over", category: "Entertainment", image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", content: "The latest blockbuster wasn't on a screen, but inside a headset. VR movies are becoming the new standard for immersive storytelling.", timestamp: "12 hours ago", trending: false },
    { id: 106, title: "Global Markets Rally on Tech Earnings", category: "Business", image: "https://images.unsplash.com/photo-1703994643766-f9d2d35548a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D", content: "Tech giants posted record profits this quarter, driving the S&P 500 to new heights despite inflation concerns.", timestamp: "5 hours ago", trending: false },
    { id: 107, title: "Mars Colony Prototypes Unveiled", category: "Space", image: "https://cff2.earth.com/uploads/2024/09/06095734/Mars-water-loss.jpg", content: "Architects have released designs for the first permanent habitats on Mars, utilizing 3D printed regolith.", timestamp: "30 mins ago", trending: false },
    { id: 108, title: "New Vaccine for Common Cold?", category: "Health", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", content: "Researchers are testing a universal vaccine that targets the protein structure of Rhinovirus.", timestamp: "8 hours ago", trending: false },
    { id: 109, title: "Championship Finals Break Viewer Records", category: "Sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", content: "Over 1 billion people tuned in to watch the final match, setting a new global broadcasting record.", timestamp: "1 day ago", trending: false }
];

/* --- STATE MANAGEMENT --- */
let currentFilter = 'All';
let activeModalId = null;
let currentUsername = localStorage.getItem('username'); // Get logged in user

/* --- 1. DATABASE FUNCTIONS (New) --- */

// Fetch Likes & Comments for a specific article
async function getInteractions(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        // Check if current user is in the likes array
        const isLiked = data.likes && data.likes.includes(currentUsername);
        return { 
            liked: isLiked, 
            comments: data.comments || [],
            likeCount: data.likes ? data.likes.length : 0 
        };
    } catch (err) {
        console.error("Error fetching interactions:", err);
        return { liked: false, comments: [], likeCount: 0 };
    }
}

/* --- 2. RENDER LOGIC --- */

async function loadNews() {
    const grid = document.getElementById('news-grid');
    // Show spinner while loading
    grid.innerHTML = '<div style="grid-column: 1 / -1; display:flex; justify-content:center; padding: 5rem;"><i class="fa-solid fa-circle-notch fa-spin text-4xl text-accent"></i></div>';

    // Filter local mock data first
    const filtered = currentFilter === 'All' ? mockData : mockData.filter(item => item.category === currentFilter);

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-gray); padding: 3rem;">No signals detected in this sector.</div>`;
        return;
    }

    grid.innerHTML = ''; // Clear spinner

    // Loop through articles and fetch DB data for each
    for (const item of filtered) {
        const interactions = await getInteractions(item.id);
        
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${item.image}" class="card-img" loading="lazy">
                <span class="card-category">${item.category}</span>
            </div>
            <div class="card-body">
                <div class="card-meta"><span><i class="fa-regular fa-clock" style="margin-right: 4px;"></i> ${item.timestamp}</span></div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-excerpt">${item.content}</p>
                <div class="card-footer">
                    <button onclick="openModal(${item.id})" class="btn-link">Read More</button>
                    <div class="interaction-btns">
                        <button onclick="handleLike(${item.id}, this)" class="btn-icon ${interactions.liked ? 'liked' : ''}">
                            <i class="${interactions.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                        <button onclick="openModal(${item.id})" class="btn-icon">
                            <i class="fa-regular fa-comment"></i>
                            <span style="font-size: 0.75rem;">${interactions.comments.length}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    }
}

/* --- 3. HANDLE LIKES --- */
async function handleLike(id, btnElement) {
    if (!currentUsername) {
        alert("Please login to like articles.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUsername })
        });
        const updatedDoc = await res.json();
        const isLiked = updatedDoc.likes.includes(currentUsername);

        if (btnElement) {
            const icon = btnElement.querySelector('i');
            if (isLiked) {
                btnElement.classList.add('liked');
                icon.className = 'fa-solid fa-heart';
            } else {
                btnElement.classList.remove('liked');
                icon.className = 'fa-regular fa-heart';
            }
        } else {
            updateModalLikeBtn(isLiked);
            loadNews(); // Refresh grid to sync count
        }
    } catch (err) { console.error(err); }
}

/* --- 4. MODAL, COMMENTS & LOGIN LOGIC --- */

// --- A. LOGIN MODAL LOGIC ---
function showLoginModal() {
    const modal = document.getElementById('login-required-modal');
    if(modal) {
        modal.style.display = 'flex';
        // Make sure it sits on top
        modal.style.zIndex = '20000'; 
    }
}

// Login Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-redirect-btn');
    const cancelBtn = document.getElementById('login-cancel-btn');
    const modal = document.getElementById('login-required-modal');

    if (loginBtn) {
        loginBtn.onclick = () => {
            window.location.href = "login.html"; 
        };
    }

    if (cancelBtn) {
        cancelBtn.onclick = () => {
            if(modal) modal.style.display = 'none';
        };
    }
});

// --- B. NEWS MODAL LOGIC ---

// 1. OPEN MODAL (Instant Version)
async function openModal(id) {
    console.log("Open Modal Clicked for ID:", id); 

    activeModalId = id; 
    const modal = document.getElementById('news-modal'); 

    if (!modal) {
        console.error("ERROR: Could not find element with id='news-modal'");
        return;
    }

    // A. Find the local article data (Instant)
    const item = mockData.find(i => i.id === id); 
    
    if (item) {
        // B. Populate visual elements immediately
        const titleEl = document.getElementById('modal-title');
        const imgEl = document.getElementById('modal-image');
        const descEl = document.getElementById('modal-content');
        const catEl = document.getElementById('modal-category'); 

        if(titleEl) titleEl.innerText = item.title;
        if(imgEl) imgEl.src = item.image;
        if(descEl) descEl.innerText = item.content;
        if(catEl) catEl.innerText = item.category || "News";

        // C. Show the modal NOW (Don't wait for server!)
        modal.classList.remove('hidden'); // Remove hidden class if present
        modal.style.display = 'flex';
        console.log("Modal opened instantly");

        // D. Show "Loading..." in comments while we fetch
        const list = document.getElementById('comments-list');
        if(list) list.innerHTML = '<p style="text-align:center; padding:20px; color:#00d9ff;"><i class="fa-solid fa-circle-notch fa-spin"></i> Establishing Uplink...</p>';

        // E. NOW fetch the data in the background
        try {
            const interactions = await getInteractions(id);
            renderComments(interactions.comments);
            updateModalLikeBtn(interactions.liked);
        } catch (error) {
            console.error("Server fetch failed:", error);
            if(list) list.innerHTML = '<p style="text-align:center; color:red;">Connection Signal Weak.</p>';
        }
    }
}

// 2. CLOSE MODAL
function closeModal() {
    const modal = document.getElementById('news-modal');
    if(modal) modal.style.display = 'none';
    activeModalId = null;
}

// 3. SUBMIT COMMENT
async function submitComment() {
    if (!currentUsername) {
        showLoginModal();
        return;
    }
    
    if (!activeModalId) return;

    const input = document.getElementById('comment-input');
    const text = input.value.trim();

    if (!text) return; 

    try {
        const res = await fetch(`${API_URL}/${activeModalId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user: currentUsername, 
                text: text, 
                date: new Date().toLocaleDateString() 
            })
        });
        
        const updatedDoc = await res.json();
        renderComments(updatedDoc.comments || []);
        input.value = ''; 
        loadNews(); // Refresh grid counts
    } catch (err) { 
        console.error("Comment failed:", err); 
    }
}

// 4. HELPER: Update Like Button
function updateModalLikeBtn(isLiked) {
    const btn = document.getElementById('modal-like-btn');
    if(!btn) return;
    
    const icon = btn.querySelector('i');
    if (isLiked) {
        btn.classList.add('liked');
        icon.className = 'fa-solid fa-heart';
    } else {
        btn.classList.remove('liked');
        icon.className = 'fa-regular fa-heart';
    }
    
    // Allow clicking the heart inside the modal
    btn.onclick = () => handleLike(activeModalId, null); 
}

// 5. HELPER: Render Comments
function renderComments(comments) {
    const list = document.getElementById('comments-list');
    if(!list) return;

    list.innerHTML = '';
    
    if (!comments || comments.length === 0) {
        list.innerHTML = '<p style="color: var(--text-gray); font-style: italic; text-align:center;">No signals received yet.</p>';
        return;
    }

    comments.slice().reverse().forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `
            <div class="comment-meta">
                <span class="comment-user" style="color: #00d9ff; font-weight: bold;">${c.user}</span>
                <span style="font-size: 0.75rem; color: #666;">${c.date}</span>
            </div>
            <p class="comment-text" style="color: #ddd;">${c.text}</p>
        `;
        list.appendChild(div);
    });
}

// --- CRITICAL: MAKE FUNCTIONS VISIBLE TO HTML ---
window.openModal = openModal;
window.closeModal = closeModal;
window.submitComment = submitComment;
window.handleLike = handleLike;
window.showLoginModal = showLoginModal;

/* --- UPDATED INTERACTION FUNCTIONS --- */

async function handleLike(id, btnElement) {
    // 1. CHECK LOGIN STATUS
    if (!currentUsername) {
        showLoginModal(); 
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUsername })
        });
        const updatedDoc = await res.json();
        const isLiked = updatedDoc.likes.includes(currentUsername);

        // Update UI
        if (btnElement) {
            const icon = btnElement.querySelector('i');
            if (isLiked) {
                btnElement.classList.add('liked');
                icon.className = 'fa-solid fa-heart';
            } else {
                btnElement.classList.remove('liked');
                icon.className = 'fa-regular fa-heart';
            }
        } else {
            updateModalLikeBtn(isLiked);
            loadNews();
        }
    } catch (err) { console.error(err); }
}

async function submitComment() {
    // 1. CHECK LOGIN STATUS
    if (!currentUsername) {
        showLoginModal(); 
        return;
    }
    
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (!text || !activeModalId) return;

    try {
        const res = await fetch(`${API_URL}/${activeModalId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user: currentUsername, 
                text: text, 
                date: new Date().toLocaleDateString() 
            })
        });
        const updatedDoc = await res.json();
        
        renderComments(updatedDoc.comments);
        input.value = ''; 
        loadNews(); 
    } catch (err) { console.error(err); }
}

function renderComments(comments) {
    const list = document.getElementById('comments-list');
    list.innerHTML = '';
    
    if (comments.length === 0) {
        list.innerHTML = '<p style="color: var(--text-gray); font-style: italic;">No comments yet. Be the first!</p>';
        return;
    }

    // Show newest comments first
    comments.slice().reverse().forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `
            <div class="comment-meta">
                <span class="comment-user" style="color: var(--primary); font-weight: bold;">${c.user}</span>
                <span style="font-size: 0.75rem; color: #666;">${c.date}</span>
            </div>
            <p class="comment-text" style="color: #ddd;">${c.text}</p>
        `;
        list.appendChild(div);
    });
}

/* --- 5. INITIALIZATION & UTILS --- */
window.onload = () => {
    createStars();
    renderFilters();
    renderCarousel();
    loadNews();
    currentUsername = localStorage.getItem('username');
};

function createStars() { 
    const container = document.getElementById('starfield');
    for(let i=0; i<100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = star.style.height = `${Math.random() * 2 + 1}px`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        container.appendChild(star);
    }
}

function renderFilters() {
    const container = document.getElementById('filter-container');
    container.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = currentFilter === 'All' ? 'filter-btn active' : 'filter-btn';
    allBtn.onclick = () => { currentFilter = 'All'; renderFilters(); loadNews(); };
    container.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = currentFilter === cat ? 'filter-btn active' : 'filter-btn';
        btn.onclick = () => { currentFilter = cat; renderFilters(); loadNews(); };
        container.appendChild(btn);
    });
}

function renderCarousel() {
    const container = document.getElementById('featured-carousel');
    const trending = mockData.filter(d => d.trending).slice(0, 3);
    let currentIndex = 0;
    if(trending.length === 0) return;

    function updateSlide() {
        const item = trending[currentIndex];
        container.innerHTML = `
            <div class="carousel-slide animate-fade-in">
                <img src="${item.image}" class="carousel-image">
                <div class="carousel-overlay"></div>
            </div>
            <div class="carousel-content animate-fade-in">
                <span class="tag">Trending in ${item.category}</span>
                <h2 class="carousel-title">${item.title}</h2>
                <p class="carousel-desc">${item.content}</p>
                <button onclick="openModal(${item.id})" class="btn-cta">
                    Read Article <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
            <div class="carousel-dots">
                ${trending.map((_, idx) => `<div class="dot ${idx === currentIndex ? 'active' : ''}"></div>`).join('')}
            </div>
        `;
    }
    setInterval(() => { currentIndex = (currentIndex + 1) % trending.length; updateSlide(); }, 5000);
    updateSlide();
}

window.onclick = (e) => {
    const modal = document.getElementById('news-modal');
    if (e.target == modal) closeModal();
}

// Mouse Follower
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

/* --- MERGED NAVBAR & AUTH JS --- */
(function() { 
    document.addEventListener('DOMContentLoaded', function() {
        var header = document.querySelector('#merged-navbar-container #myHeader');
        var openMenuButton = document.querySelector('#merged-navbar-container #openmenu');
        var desktopLinks = document.querySelectorAll('#merged-navbar-container nav.desktop-nav a[href^="#"]');
        function initDesktopNav() {
            if (!header || !openMenuButton) return;
            window.addEventListener('scroll', function() {
                if (window.innerWidth <= 992) return;
                if (window.scrollY >= 100) header.classList.add('sticky');
                else header.classList.remove('sticky');
            });
            openMenuButton.addEventListener('click', function() {
                if (window.innerWidth <= 992) return;
                header.classList.remove('sticky');
            });
        }
        var mobileToggle = document.querySelector('#mobile-menu-toggle');
        var sidebar = document.querySelector('#mobile-sidebar');
        var overlay = document.querySelector('#sidebar-overlay');
        function initMobileNav() {
            if (!mobileToggle || !sidebar || !overlay) return;
            function toggleSidebar() {
                sidebar.classList.toggle('sidebar-open');
                overlay.classList.toggle('sidebar-open');
            }
            mobileToggle.addEventListener('click', toggleSidebar);
            overlay.addEventListener('click', toggleSidebar);
        }
        initDesktopNav();
        initMobileNav();
        checkLoginStatus(); // Run Auth Check
    });
})(); 

function checkLoginStatus() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const logoutModal = document.getElementById('logout-modal');
    
    // Only proceed if user is logged in
    if (!username || !token) return;

    const loginLinks = document.querySelectorAll('a[href*="login.html"]');
    loginLinks.forEach(link => {
        link.textContent = username;
        link.href = "#";
        link.style.color = "#00d9ff";
        link.style.fontWeight = "bold";
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if(logoutModal) logoutModal.style.display = 'flex';
            else if(confirm("Logout?")) handleLogout();
        });
    });
    
    // Setup Custom Logout Modal
    const confirmBtn = document.getElementById('logout-confirm-btn');
    const cancelBtn = document.getElementById('logout-cancel-btn');
    if(confirmBtn) confirmBtn.onclick = () => { handleLogout(); };
    if(cancelBtn) cancelBtn.onclick = () => { logoutModal.style.display = 'none'; };
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
}