/* --- CONFIGURATION --- */
const API_URL = 'https://the-void-backend.onrender.com/api/gallery';

/* --- UI ELEMENTS --- */
const chooseBtn = document.getElementById('chooseBtn');
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const uploadBtn = document.getElementById('uploadBtn');
const clearBtn = document.getElementById('clearBtn');
const titleEl = document.getElementById('title');
const descEl = document.getElementById('description');
const catEl = document.getElementById('category');

const masonry = document.getElementById('masonry');
const totalCount = document.getElementById('totalCount');
const search = document.getElementById('search');
const filter = document.getElementById('filter');

// Modal Elements
const modalWrap = document.getElementById('modalWrap');
const modalImage = document.getElementById('modalImage');
const modalCategoryDisplay = document.getElementById('modalCategoryDisplay');
const modalCreated = document.getElementById('modalCreated');
const editTitle = document.getElementById('editTitle');
const editDesc = document.getElementById('editDesc');
const editCategory = document.getElementById('editCategory');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const downloadBtn = document.getElementById('downloadBtn');
const closeModalBtn = document.getElementById('closeModal');

// State
let items = [];
let activeId = null;
let selectedFile = null;

/* --- INITIAL LOAD (READ) --- */
document.addEventListener('DOMContentLoaded', () => {
    fetchImages();
});

async function fetchImages() {
    try {
        const res = await fetch(API_URL);
        items = await res.json();
        renderMasonry();
    } catch (err) {
        console.error("Error fetching images:", err);
        masonry.innerHTML = '<div class="empty">Error loading gallery. Is the server running?</div>';
    }
}

/* --- FILE SELECTION & PREVIEW --- */
chooseBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    handleFileSelect(e.target.files[0]);
});

// Drag & Drop
dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('drag'); });
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag'));
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag');
    handleFileSelect(e.dataTransfer.files[0]);
});

function handleFileSelect(file) {
    if (!file) return;
    selectedFile = file;
    
    // Preview the image immediately
    const reader = new FileReader();
    reader.onload = (e) => {
        dropArea.style.backgroundImage = `url(${e.target.result})`;
        dropArea.style.backgroundSize = 'cover';
        dropArea.style.backgroundPosition = 'center';
        dropArea.textContent = '';
    };
    reader.readAsDataURL(file);
}

/* --- UPLOAD (CREATE) --- */
uploadBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        return alert('Please select an image or drop one in the box!');
    }

    const formData = new FormData();
    formData.append('image', selectedFile); // Matches backend upload.single('image')
    formData.append('title', titleEl.value.trim() || 'Untitled');
    formData.append('desc', descEl.value.trim() || '');
    formData.append('category', catEl.value || 'Other');

    // UI Feedback
    const originalText = uploadBtn.innerText;
    uploadBtn.innerText = 'Uploading to Cloud...';
    uploadBtn.disabled = true;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            await fetchImages(); // Refresh Grid
            clearForm();
        } else {
            alert('Upload failed. Check console.');
        }
    } catch (err) {
        console.error(err);
        alert('Error uploading image.');
    } finally {
        uploadBtn.innerText = originalText;
        uploadBtn.disabled = false;
    }
});

function clearForm() {
    selectedFile = null;
    dropArea.style.backgroundImage = '';
    dropArea.textContent = 'Drop image here, paste URL (Ctrl+V) or click Choose';
    titleEl.value = '';
    descEl.value = '';
    fileInput.value = '';
    catEl.value = 'Planet';
}

clearBtn.addEventListener('click', clearForm);

/* --- RENDER GALLERY --- */
function renderMasonry() {
    masonry.innerHTML = '';
    const q = (search.value || '').toLowerCase();
    const f = filter.value || '';

    const list = items.filter(i => {
        if (f && i.category !== f) return false;
        if (q && !(i.title.toLowerCase().includes(q) || (i.desc && i.desc.toLowerCase().includes(q)))) return false;
        return true;
    });

    totalCount.textContent = list.length;

    if (list.length === 0) {
        masonry.innerHTML = `<div class="empty">No images found. Upload one to start!</div>`;
        return;
    }

    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'masonry-item';
        card.tabIndex = 0;
        
        // Use Cloudinary URL (imageUrl)
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${esc(item.title)}" loading="lazy" />
            <div class="meta">
                <h4>${esc(item.title)}</h4>
                <p>${esc(item.desc)}</p>
                <div class="tag">${esc(item.category)}</div>
            </div>
        `;
        
        // Open Modal on click (passing MongoDB _id)
        card.onclick = () => openModal(item._id);
        masonry.appendChild(card);
    });
}

/* --- SEARCH & FILTER --- */
search.addEventListener('input', debounce(() => renderMasonry(), 300));
filter.addEventListener('change', renderMasonry);

function debounce(fn, t) { let tm; return (...a) => { clearTimeout(tm); tm = setTimeout(() => fn(...a), t); }; }

/* --- MODAL ACTIONS (UPDATE & DELETE) --- */

function openModal(id) {
    activeId = id;
    const item = items.find(i => i._id === id);
    if (!item) return;

    modalImage.src = item.imageUrl;
    modalCategoryDisplay.textContent = item.category;
    modalCreated.textContent = new Date(item.createdAt).toLocaleDateString();
    
    editTitle.value = item.title;
    editDesc.value = item.desc;
    editCategory.value = item.category;

    modalWrap.style.display = 'flex';
}

function closeModal() {
    modalWrap.style.display = 'none';
    activeId = null;
}

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modalWrap) closeModal(); });

// UPDATE (Text only for now)
saveBtn.addEventListener('click', async () => {
    if (!activeId) return;

    const updatedData = {
        title: editTitle.value,
        desc: editDesc.value,
        category: editCategory.value
    };

    try {
        await fetch(`${API_URL}/${activeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        fetchImages();
        closeModal();
    } catch (err) { console.error(err); alert('Save failed'); }
});

// DELETE
/* --- CUSTOM DELETE MODAL LOGIC --- */

// Setup Elements
const deleteModal = document.getElementById('delete-modal');
const delConfirmBtn = document.getElementById('del-confirm-btn');
const delCancelBtn = document.getElementById('del-cancel-btn');

// Open Modal on Click
deleteBtn.addEventListener('click', () => {
    if (!activeId) return;
    if (deleteModal) {
        deleteModal.style.display = 'flex'; 
    }
});

// Handle Confirm Delete
if (delConfirmBtn) {
    delConfirmBtn.onclick = async () => {
        if (!activeId) return;
        try {
            // Actual API Call
            await fetch(`${API_URL}/${activeId}`, { method: 'DELETE' });
            
            fetchImages(); // Refresh Grid
            
            // Close modals
            if(deleteModal) deleteModal.style.display = 'none';
            closeModal(); 
            
        } catch (err) { 
            console.error(err); 
            alert('Delete failed'); 
        }
    };
}

// 4. Handle Cancel
if (delCancelBtn) {
    delCancelBtn.onclick = () => {
        if(deleteModal) deleteModal.style.display = 'none';
    };
}

// DOWNLOAD
downloadBtn.addEventListener('click', () => {
    if (!activeId) return;
    const item = items.find(i => i._id === activeId);
    if (!item) return;
    
    // Create a temporary link
    const a = document.createElement('a');
    a.href = item.imageUrl;
    a.target = '_blank'; // Cloudinary images usually open in new tab
    a.download = item.title + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// Utilities
function esc(s) { return String(s || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }

/* --- ANIMATIONS & NAVBAR (Kept from original) --- */
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

/* --- START MERGED NAVBAR JS --- */
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
            desktopLinks.forEach(function(link) {
                link.addEventListener('click', function(event) {
                    if (window.innerWidth <= 992) return;
                    event.preventDefault();
                    var targetId = this.getAttribute('href');
                    try {
                        var targetElement = document.querySelector(targetId);
                        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
                    } catch (e) {}
                });
            });
        }
        var mobileToggle = document.querySelector('#mobile-menu-toggle');
        var sidebar = document.querySelector('#mobile-sidebar');
        var overlay = document.querySelector('#sidebar-overlay');
        var mobileLinks = document.querySelectorAll('#mobile-sidebar .mobile-nav-links a');
        function initMobileNav() {
            if (!mobileToggle || !sidebar || !overlay) return;
            function toggleSidebar() {
                sidebar.classList.toggle('sidebar-open');
                overlay.classList.toggle('sidebar-open');
            }
            mobileToggle.addEventListener('click', toggleSidebar);
            overlay.addEventListener('click', toggleSidebar);
            mobileLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    if (link.getAttribute('href').startsWith('#')) {
                        toggleSidebar();
                        var targetId = this.getAttribute('href');
                        try {
                            var targetElement = document.querySelector(targetId);
                            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
                        } catch (e) {}
                    }
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