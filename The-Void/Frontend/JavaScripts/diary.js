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

// Parallax scrolling effect
const layers = document.querySelectorAll('.parallax-layer');
const heroContent = document.querySelector('.hero-content1');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Move hero content
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
        heroContent.style.opacity = 1 - (scrolled / 800);
    }

    if (scrolled < window.innerHeight) {
        layers.forEach((layer, index) => {
            const speed = (index + 1) * 0.2;
            layer.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

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

// Smooth animation for mouse follower
function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    mouseFollower.style.left = followerX + 'px';
    mouseFollower.style.top = followerY + 'px';

    requestAnimationFrame(animateFollower);
}
animateFollower();

// Interactive hover effects for rectangles
const rectangles = document.querySelectorAll('.rect');

rectangles.forEach(rect => {
    rect.addEventListener('mousemove', (e) => {
        const boundingRect = rect.getBoundingClientRect();
        const x = e.clientX - boundingRect.left;
        const y = e.clientY - boundingRect.top;

        const centerX = boundingRect.width / 2;
        const centerY = boundingRect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        rect.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    rect.addEventListener('mouseleave', () => {
        rect.style.transform = '';
    });
});


/* --- DATABASE LOGIC STARTS HERE --- */
document.addEventListener('DOMContentLoaded', () => {

    const addNoteBtn = document.getElementById('add-note-btn');
    const modal = document.getElementById('note-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const noteForm = document.getElementById('note-form');
    const modalTitle = document.getElementById('modal-title');
    const notesGrid = document.getElementById('notes-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');

    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const noteTagInput = document.getElementById('note-tag');
    const noteIdInput = document.getElementById('note-id');
    const tagContainer = document.getElementById('tag-container');
    const tagButtons = tagContainer.querySelectorAll('.tag-btn');

    // Store notes here
    let notes = [];
    
    // YOUR BACKEND URL
    const API_URL = 'https://the-void-backend.onrender.com/api/entries';

    const tagColors = {
        'Work': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Missions' },
        'Personal': { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Observations' },
        'Ideas': { bg: 'bg-green-100', text: 'text-green-700', label: 'Ideas' },
        'Reminders': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Phenomena' }
    };

    const tagIcons = {
        'Work': `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v1H2a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V6a1 1 0 00-1-1h-2V4a2 2 0 00-2-2H6zm8 4H6v1h8V6z" clip-rule="evenodd" /></svg>`,
        'Personal': `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>`,
        'Ideas': `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>`,
        'Reminders': `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clip-rule="evenodd" /></svg>`
    };

    // --- Modal Functions ---
    const openModal = () => {
        modal.classList.add('open');
        overlay.classList.add('open');
    };

    const closeModal = () => {
        modal.classList.remove('open');
        overlay.classList.remove('open');
        setTimeout(() => {
            noteForm.reset();
            noteIdInput.value = '';
            resetTagButtons();
        }, 300); 
    };

    const resetTagButtons = () => {
        tagButtons.forEach(btn => btn.classList.remove('selected'));
        noteTagInput.value = '';
    };

    // --- NEW FETCH FUNCTIONS (Replaces LocalStorage) ---

    // 1. GET ALL NOTES
    const loadNotes = async () => {
        try {
            const response = await fetch(API_URL);
            notes = await response.json();
            renderNotes();
        } catch (error) {
            console.error("Error loading notes:", error);
        }
    };

    const renderNotes = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filterTag = filterSelect.value;

        notesGrid.innerHTML = '';

        const filteredNotes = notes.filter(note => {
            const matchesSearch = note.title.toLowerCase().includes(searchTerm) ||
                note.content.toLowerCase().includes(searchTerm);
            const matchesTag = filterTag === 'All' || note.tag === filterTag;
            return matchesSearch && matchesTag;
        });

        if (filteredNotes.length === 0 && searchTerm === '' && filterTag === 'All') {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }

        // Reverse to show newest first
        filteredNotes.slice().reverse().forEach(note => {
            const tagData = tagColors[note.tag] || { bg: 'bg-gray-100', text: 'text-gray-700', label: note.tag };
            const tagBg = tagData.bg;
            const tagText = tagData.text;
            const tagLabel = tagData.label; 
            const tagIcon = tagIcons[note.tag] || '';

            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            
            // IMPORTANT: Using note._id (MongoDB ID) instead of note.id
            noteCard.innerHTML = `
                <div class="note-card-header">
                    <h3 class="note-card-title">${note.title}</h3>
                    <div class="note-card-buttons">
                        <button class="icon-btn edit-note-btn" data-id="${note._id}" title="Edit note">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button class="icon-btn delete-note-btn" data-id="${note._id}" title="Delete note">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                <p class="note-card-content">${note.content}</p>
                <div class="note-card-footer">
                    <span class="tag-display ${tagBg} ${tagText}">
                        ${tagIcon}
                        ${tagLabel}
                    </span>
                    <span class="note-timestamp">${note.date || 'Just now'}</span>
                </div>
            `;

            // Add edit listener
            noteCard.querySelector('.edit-note-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                handleEditNote(note._id);
            });

            // Add delete listener
            noteCard.querySelector('.delete-note-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                handleDeleteNote(note._id);
            });

            notesGrid.appendChild(noteCard);
        });
    };

    /* CREATE / UPDATE (Using Fetch) */
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const id = noteIdInput.value;
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();
        const tag = noteTagInput.value;

        // Manual Validation
        if (!title || !content || !tag) {
            alert('Please fill in all fields and select a tag.');
            return; 
        }

        const noteData = {
            title,
            content,
            tag,
            date: new Date().toLocaleString('en-GB', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            })
        };

        try {
            if (id) {
                // UPDATE (PUT)
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteData)
                });
            } else {
                // CREATE (POST)
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteData)
                });
            }
            // Reload notes from DB after saving
            loadNotes();
            closeModal();
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Failed to save note. Check console.");
        }
    };

    /* Set up modal for UPDATE */
    const handleEditNote = (id) => {
        // Use _id to find the note
        const note = notes.find(note => note._id == id);
        if (!note) return;

        modalTitle.textContent = 'Edit Note';
        noteIdInput.value = note._id; // Set hidden ID field
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        noteTagInput.value = note.tag;

        // Select the correct tag button
        tagButtons.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.tag === note.tag);
        });

        openModal();
    };

    /* DELETE */
/* --- CUSTOM DELETE MODAL LOGIC --- */
    let noteToDeleteId = null; 

    // open the modal
    const handleDeleteNote = (id) => {
        noteToDeleteId = id;
        const deleteModal = document.getElementById('delete-diary-modal');
        if (deleteModal) {
            deleteModal.style.display = 'flex';
        }
    };

    // Modal Buttons (Confirm & Cancel)
    const deleteModal = document.getElementById('delete-diary-modal');
    const confirmDeleteBtn = document.getElementById('diary-confirm-btn');
    const cancelDeleteBtn = document.getElementById('diary-cancel-btn');

    // Confirm Logic
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            if (!noteToDeleteId) return;

            try {
                // The actual deletion happens here
                await fetch(`${API_URL}/${noteToDeleteId}`, {
                    method: 'DELETE'
                });
                
                loadNotes(); // Reload the grid
                
                // Close modal and reset
                if (deleteModal) deleteModal.style.display = 'none';
                noteToDeleteId = null;
            } catch (error) {
                console.error("Error deleting note:", error);
                alert("Deletion failed.");
            }
        });
    }

    // Cancel Logic
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            if (deleteModal) deleteModal.style.display = 'none';
            noteToDeleteId = null;
        });
    }

    // --- Event Listeners ---

    // Open modal for new note
    addNoteBtn.addEventListener('click', () => {
        modalTitle.textContent = 'New Note';
        openModal();
    });

    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Handle tag selection in modal
    tagContainer.addEventListener('click', (e) => {
        const clickedTag = e.target.closest('.tag-btn');
        if (!clickedTag) return;

        resetTagButtons();

        clickedTag.classList.add('selected');
        noteTagInput.value = clickedTag.dataset.tag;
    });

    // Handle form submission (Create & Update)
    noteForm.addEventListener('submit', handleFormSubmit);

    // Search and Filter listeners
    searchInput.addEventListener('input', renderNotes);
    filterSelect.addEventListener('change', renderNotes);

    // --- Initial Load ---
    loadNotes();
});

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