/* --- START MERGED NAVBAR JS --- */
(function() {
    document.addEventListener('DOMContentLoaded', function() {

        // --- DESKTOP LOGIC ---
        var header = document.querySelector('#merged-navbar-container #myHeader');
        var openMenuButton = document.querySelector('#merged-navbar-container #openmenu');
        var desktopLinks = document.querySelectorAll('#merged-navbar-container nav.desktop-nav a[href^="#"]');

        function initDesktopNav() {
            if (!header || !openMenuButton) {
                console.warn("Desktop navbar elements not found.");
                return;
            }

            // Desktop: Sticky scroll logic
            window.addEventListener('scroll', function() {
                if (window.innerWidth <= 992) return; // Don't run on mobile

                if (window.scrollY >= 100) {
                    header.classList.add('sticky');
                } else {
                    header.classList.remove('sticky');
                }
            });

            // Desktop: Event listener for the "open" button (center circle)
            openMenuButton.addEventListener('click', function() {
                if (window.innerWidth <= 992) return; // Don't run on mobile
                header.classList.remove('sticky');
            });

            // Desktop: Smooth scroll for desktop anchor links
            desktopLinks.forEach(function(link) {
                link.addEventListener('click', function(event) {
                    if (window.innerWidth <= 992) return; // Don't run on mobile

                    event.preventDefault();
                    var targetId = this.getAttribute('href');
                    try {
                        var targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }
                    } catch (e) {
                        console.log("Could not scroll to target: " + targetId);
                    }
                });
            });
        }

        // --- MOBILE LOGIC ---
        var mobileToggle = document.querySelector('#mobile-menu-toggle');
        var sidebar = document.querySelector('#mobile-sidebar');
        var overlay = document.querySelector('#sidebar-overlay');
        var mobileLinks = document.querySelectorAll('#mobile-sidebar .mobile-nav-links a');

        function initMobileNav() {
            if (!mobileToggle || !sidebar || !overlay) {
                console.warn("Mobile navbar elements not found.");
                return;
            }

            // Function to toggle the sidebar
            function toggleSidebar() {
                sidebar.classList.toggle('sidebar-open');
                overlay.classList.toggle('sidebar-open');
            }

            // Open/Close sidebar with hamburger button
            mobileToggle.addEventListener('click', toggleSidebar);

            // Close sidebar by clicking overlay
            overlay.addEventListener('click', toggleSidebar);

            // Close sidebar when a link is clicked
            mobileLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    // Check if the link is an on-page anchor
                    if (link.getAttribute('href').startsWith('#')) {
                        // Only close sidebar if it's an anchor link
                        toggleSidebar();
                        // Handle smooth scrolling for mobile anchors
                        var targetId = this.getAttribute('href');
                        try {
                            var targetElement = document.querySelector(targetId);
                            if (targetElement) {
                                targetElement.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }
                        } catch (e) {
                            console.log("Could not scroll to target: " + targetId);
                        }
                    }
                    // If it's a link to another page (like index.html),
                    // the sidebar will close automatically on page load.
                });
            });
        }

        initDesktopNav();
        initMobileNav();

    });
})(); 
/* --- END MERGED NAVBAR JS --- */

// Mouse follower
const mouseFollower = document.getElementById('mouseFollower');
let mouseX = 0,
   mouseY = 0;
let followerX = 0,
   followerY = 0;

document.addEventListener('mousemove', (e) => {
   mouseX = e.clientX;
   mouseY = e.clientY;
});

// Generate stars
const starsContainer = document.getElementById('stars');
const numStars = 100;

for (let i = 0; i < numStars; i++) {
   const star = document.createElement('div');
   star.className = 'star';
   star.style.left = Math.random() * 100 + '%';
   star.style.top = Math.random() * 100 + '%';
   star.style.animationDelay = Math.random() * 3 + 's';
   star.style.animationDuration = (Math.random() * 3 + 2) + 's';
   starsContainer.appendChild(star);
}


// Smooth animation for mouse follower
function animateFollower() {
   followerX += (mouseX - followerX) * 0.1;
   followerY += (mouseY - followerY) * 0.1;

   mouseFollower.style.left = followerX + 'px';
   mouseFollower.style.top = followerY + 'px';

   requestAnimationFrame(animateFollower);
}
animateFollower();

// --- CONSTANTS ---
const SPACEX_API_UPCOMING = 'https://api.spacexdata.com/v4/launches/upcoming';
const SPACEX_API_PAST = 'https://api.spacexdata.com/v4/launches/past';
const SPACEX_API_ROCKETS = 'https://api.spacexdata.com/v4/rockets';

// --- BACKEND URL ---
const API_URL = 'http://127.0.0.1:5002/api/missions';

// --- STATE ---
let rocketsMap = {};
let userMissions = JSON.parse(localStorage.getItem('spaceMissions')) || [];
let currentEditIndex = null;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load User Missions (Local CRUD)
    renderUserMissions();
    
    // 2. Fetch SpaceX Data
    initializeSpaceXData();
});

// --- SPACEX API LOGIC ---

async function initializeSpaceXData() {
    try {
        
        const rocketsRes = await fetch(SPACEX_API_ROCKETS);
        const rocketsData = await rocketsRes.json();
        
        rocketsData.forEach(rocket => {
            rocketsMap[rocket.id] = rocket.name;
        });

        // Fetch Launches
        fetchUpcomingLaunches();
        fetchPastLaunches();

    } catch (error) {
        console.error("Error fetching SpaceX data:", error);
    }
}

async function fetchUpcomingLaunches() {
    try {
        const res = await fetch(SPACEX_API_UPCOMING);
        let data = await res.json();
        
        // Sort by date (nearest first)
        data.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
        
        // Take top 5
        const upcoming = data.slice(0, 5);
        renderUpcomingTable(upcoming);

    } catch (err) {
        console.error(err);
    }
}

async function fetchPastLaunches() {
    try {
        const res = await fetch(SPACEX_API_PAST);
        let data = await res.json();
        
        // Sort by date (newest first)
        data.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
        
        // 1. Render "Ongoing/Recent" Section using the very latest launch
        if(data.length > 0) {
            renderOngoingMission(data[0]);
        }

        // 2. Render Past Table (Take next 10)
        const past = data.slice(0, 10);
        renderPastTable(past);
        
        // Enable Search
        setupSearch(data);

    } catch (err) {
        console.error(err);
    }
}

function renderUpcomingTable(launches) {
    const tbody = document.getElementById('upcoming-table-body');
    tbody.innerHTML = '';

    launches.forEach(launch => {
        const rocketName = rocketsMap[launch.rocket] || "Falcon 9"; 
        const date = new Date(launch.date_utc);
        const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${launch.name}</td>
            <td>${rocketName}</td>
            <td>${launch.launchpad ? 'CCAFS / KSC' : 'Unknown'}</td> <!-- Simplification for demo -->
            <td style="font-family:monospace; color:#fff;">${dateStr}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderPastTable(launches) {
    const tbody = document.getElementById('past-table-body');
    tbody.innerHTML = '';

    launches.forEach(launch => {
        const rocketName = rocketsMap[launch.rocket] || "Falcon 9";
        const date = new Date(launch.date_utc).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const success = launch.success ? '<span class="status-success">SUCCESS</span>' : '<span class="status-fail">FAILURE</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${launch.name}</td>
            <td>${rocketName}</td>
            <td>${launch.launchpad ? 'CCAFS / KSC' : 'Unknown'}</td>
            <td>${date}</td>
            <td>${success}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderOngoingMission(mission) {
    const container = document.getElementById('ongoing-mission');
    const rocketName = rocketsMap[mission.rocket] || "Falcon 9";
    const launchDate = new Date(mission.date_utc);
    
    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
            <div>
                <div class="og-label">MISSION</div>
                <div class="og-mission">${mission.name}</div>
                <div class="og-label" style="margin-top:10px;">VEHICLE: ${rocketName}</div>
            </div>
            <div style="text-align:right;">
                <div class="og-label">TIME SINCE LAUNCH</div>
                <div id="orbit-timer" class="og-timer">00D 00H 00M 00S</div>
            </div>
        </div>
        <div style="margin-top:20px; color:#888;">
            ${mission.details ? mission.details : 'No mission details available for this launch.'}
        </div>
    `;

    // Start Timer
    setInterval(() => {
        const now = new Date();
        const diff = now - launchDate; 
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const timerEl = document.getElementById('orbit-timer');
        if(timerEl) {
            timerEl.innerText = `T+${days}D ${hours.toString().padStart(2,'0')}H ${minutes.toString().padStart(2,'0')}M ${seconds.toString().padStart(2,'0')}S`;
        }
    }, 1000);
}

function setupSearch(allPastData) {
    const searchInput = document.getElementById('searchPast');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allPastData.filter(m => m.name.toLowerCase().includes(term));
        renderPastTable(filtered.slice(0, 10));
    });
}


// --- USER MISSION CRUD (FOR MONGODB) ---

// 1. READ
async function fetchUserMissions() {
    try {
        const res = await fetch(API_URL);
        userMissions = await res.json();
        renderUserMissions();
    } catch (error) {
        console.error("Error fetching user missions:", error);
    }
}

// 2. CREATE
async function createMission() {
    const pilot = document.getElementById('pilotName').value;
    const mission = document.getElementById('missionName').value;
    const date = document.getElementById('launchDate').value;
    const desc = document.getElementById('missionDesc').value;

    if(!pilot || !mission || !date || !desc) { 
        alert("Please fill in all fields."); return; 
    }

    const newMission = { pilot, mission, date, desc };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMission)
        });
        fetchUserMissions(); // Refresh list
        clearForm();
        document.getElementById('missionGrid').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("Error creating mission:", error);
    }
}

function renderUserMissions() {
    const grid = document.getElementById('missionGrid');
    grid.innerHTML = '';
    if(userMissions.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #555;">No user missions scheduled. Initialize one above.</p>';
        return;
    }
    // Reverse to show newest first
    userMissions.slice().reverse().forEach((item) => {
        const card = document.createElement('div');
        card.className = 'mission-card';
        // Note: passing item._id
        card.onclick = () => openEditModal(item._id);
        card.innerHTML = `
            <span class="m-date">Target: ${item.date}</span>
            <div class="m-name">${item.mission}</div>
            <div class="m-pilot">Cmdr. ${item.pilot}</div>
            <p class="m-desc">${item.desc}</p>
            <div style="margin-top:15px; font-size: 0.8rem; color: #666;">Tap to Edit</div>
        `;
        grid.appendChild(card);
    });
}

function openEditModal(id) {
    currentEditId = id;
    const item = userMissions.find(m => m._id === id);
    if (!item) return;

    document.getElementById('editPilotName').value = item.pilot;
    document.getElementById('editMissionName').value = item.mission;
    document.getElementById('editLaunchDate').value = item.date;
    document.getElementById('editMissionDesc').value = item.desc;
    document.getElementById('editModal').style.display = 'flex';
}

// 3. UPDATE
async function saveEdit() {
    if (!currentEditId) return;
    const updatedMission = {
        pilot: document.getElementById('editPilotName').value,
        mission: document.getElementById('editMissionName').value,
        date: document.getElementById('editLaunchDate').value,
        desc: document.getElementById('editMissionDesc').value
    };

    try {
        await fetch(`${API_URL}/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMission)
        });
        fetchUserMissions();
        closeModal();
    } catch (error) {
        console.error("Error updating mission:", error);
    }
}

// 4. DELETE

/* --- CUSTOM ABORT MODAL LOGIC --- */

// Open the Modal
function deleteMission() {
    if (!currentEditId) return;
    
    // Show the custom modal instead of window.confirm
    const abortModal = document.getElementById('abort-modal');
    if (abortModal) {
        abortModal.style.display = 'flex';
    }
}

// Setup Buttons
document.addEventListener('DOMContentLoaded', () => {
    const abortModal = document.getElementById('abort-modal');
    const confirmBtn = document.getElementById('abort-confirm-btn');
    const cancelBtn = document.getElementById('abort-cancel-btn');

    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            // --- ACTUAL DELETE LOGIC ---
            if (!currentEditId) return;
            try {
                await fetch(`${API_URL}/${currentEditId}`, {
                    method: 'DELETE'
                });
                fetchUserMissions(); // Refresh Grid
                
                // Close both modals
                if(abortModal) abortModal.style.display = 'none';
                closeModal(); // Close the Edit form
            } catch (error) {
                console.error("Error deleting mission:", error);
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            // Just close the warning, keep the edit form open
            if(abortModal) abortModal.style.display = 'none';
        });
    }
});

function clearForm() {
    document.getElementById('pilotName').value = '';
    document.getElementById('missionName').value = '';
    document.getElementById('launchDate').value = '';
    document.getElementById('missionDesc').value = '';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({behavior: 'smooth'});
}

window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
}

// FORCE DATA LOAD
console.log("🚀 Mission Control: Requesting data...");
fetchUserMissions();

/* --- AUTH STATE MANAGEMENT --- */

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

function checkLoginStatus() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    // Get Modal Elements
    const logoutModal = document.getElementById('logout-modal');
    const confirmBtn = document.getElementById('logout-confirm-btn');
    const cancelBtn = document.getElementById('logout-cancel-btn');

    if (!username || !token) return;

    // Update Links
    const loginLinks = document.querySelectorAll('a[href*="login.html"]');
    loginLinks.forEach(link => {
        link.textContent = username;
        link.href = "#";
        link.style.color = "#00d9ff";
        link.style.fontWeight = "bold";

        // Click Event: Open Custom Modal
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if(logoutModal) {
                logoutModal.style.display = 'flex'; // Show popup
            } else {
                // Fallback if HTML is missing
                if(confirm("Logout?")) handleLogout(); 
            }
        });
    });

    // Modal Actions
    if(confirmBtn) {
        confirmBtn.onclick = () => {
            handleLogout();
            logoutModal.style.display = 'none';
        };
    }

    if(cancelBtn) {
        cancelBtn.onclick = () => {
            logoutModal.style.display = 'none';
        };
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
}