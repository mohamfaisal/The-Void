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
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
   const scrolled = window.pageYOffset;

   // Move hero content
   if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
      heroContent.style.opacity = 1 - (scrolled / 800);
   }

   // Apply different speeds to each layer in hero section only
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

// 3D Carousel Controls
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');
const featureCards = document.querySelectorAll('.feature-card-3d');

let currentRotation = 0;
let currentIndex = 0;

// Create indicators
featureCards.forEach((_, index) => {
   const indicator = document.createElement('div');
   indicator.className = 'indicator';
   if (index === 0) indicator.classList.add('active');
   indicator.addEventListener('click', () => goToSlide(index));
   indicatorsContainer.appendChild(indicator);
});

const indicators = document.querySelectorAll('.indicator');

// Update view - always use 3D rotation
function updateView() {
   carousel.style.transform = `rotateY(${currentRotation}deg)`;
   updateIndicators();
}

// Update indicators
function updateIndicators() {
   indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
   });
}

// Go to specific slide
function goToSlide(index) {
   currentIndex = index;
   currentRotation = -index * 60;
   updateView();
}

// Previous button
prevBtn.addEventListener('click', () => {
   currentIndex = (currentIndex - 1 + featureCards.length) % featureCards.length;
   currentRotation += 60;
   updateView();
});

// Next button
nextBtn.addEventListener('click', () => {
   currentIndex = (currentIndex + 1) % featureCards.length;
   currentRotation -= 60;
   updateView();
});

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
   touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
   touchEndX = e.changedTouches[0].screenX;
   handleSwipe();
});

function handleSwipe() {
   if (touchEndX < touchStartX - 50) {
      // Swipe left - next
      nextBtn.click();
   }
   if (touchEndX > touchStartX + 50) {
      // Swipe right - previous
      prevBtn.click();
   }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
         target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });
      }
   });
});

// Intersection Observer for fade-in animations
const observerOptions = {
   threshold: 0.1,
   rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         entry.target.style.opacity = '1';
         entry.target.style.transform = 'translateY(0)';
      }
   });
}, observerOptions);

// Observe feature cards and gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
   item.style.opacity = '0';
   item.style.transform = 'translateY(30px)';
   item.style.transition = 'all 0.6s ease';
   observer.observe(item);
});

// Form submission effect
const submitBtn = document.querySelector('.submit-btn');
if (submitBtn) {
   submitBtn.addEventListener('click', (e) => {

      // Create ripple effect
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'ripple 0.6s ease-out';

      const rect = submitBtn.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';

      submitBtn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
   });
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
            @keyframes ripple {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);

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
                             targetElement.scrollIntoView({ behavior: 'smooth' });
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
                                 targetElement.scrollIntoView({ behavior: 'smooth' });
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

/* --- START NEW HERO SECTION JS --- */
(function() {
    // Wait for libraries to load
    window.addEventListener('load', function() {
        // --- THREE.JS Animation ---
        function main() {
            let container = document.querySelector("#new-hero-section #WebGL-output");
            if (!container || typeof THREE === 'undefined') return;

            let scene = new THREE.Scene();
            let camera = new THREE.PerspectiveCamera(
                45,
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            let webGLRenderer = new THREE.WebGLRenderer({ alpha: true });
            webGLRenderer.setClearColor(new THREE.Color(0x000000, 0.0));
            webGLRenderer.setSize(container.clientWidth, container.clientHeight);
            webGLRenderer.shadowMapEnabled = true;

            camera.position.x = -30;
            camera.position.y = 40;
            camera.position.z = 50;
            camera.lookAt(new THREE.Vector3(10, 0, 0));

            container.appendChild(webGLRenderer.domElement);

            let step = 0;
            let knot;

            let controls = new (function () {
                this.radius = 40;
                this.tube = 17;
                this.radialSegments = 186;
                this.tubularSegments = 4;
                this.p = 9;
                this.q = 1;
                this.heightScale = 4;
                this.asParticles = true;
                this.rotate = true;

                this.redraw = function () {
                    if (knot) scene.remove(knot);

                    let geom = new THREE.TorusKnotGeometry(
                        controls.radius,
                        controls.tube,
                        Math.round(controls.radialSegments),
                        Math.round(controls.tubularSegments),
                        Math.round(controls.p),
                        Math.round(controls.q),
                        controls.heightScale
                    );

                    if (controls.asParticles) {
                        knot = createParticleSystem(geom);
                    } else {
                        knot = createMesh(geom);
                    }

                    scene.add(knot);
                };
            })();

            controls.redraw();
            render();

            function generateSprite() {
                let canvas = document.createElement("canvas");
                canvas.width = 16;
                canvas.height = 16;

                let context = canvas.getContext("2d");
                let gradient = context.createRadialGradient(
                    canvas.width / 2,
                    canvas.height / 2,
                    0,
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.width / 2
                );
                gradient.addColorStop(0, "rgba(255,255,255,1)");
                gradient.addColorStop(0.2, "rgba(0,255,255,1)");
                gradient.addColorStop(0.4, "rgba(0,0,64,1)");
                gradient.addColorStop(1, "rgba(0,0,0,1)");

                context.fillStyle = gradient;
                context.fillRect(0, 0, canvas.width, canvas.height);

                let texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;
                return texture;
            }

            function createParticleSystem(geom) {
                let material = new THREE.ParticleBasicMaterial({
                    color: 0xffffff,
                    size: 2,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    map: generateSprite()
                });

                let system = new THREE.ParticleSystem(geom, material);
                system.sortParticles = true;
                return system;
            }

            function createMesh(geom) {
                let meshMaterial = new THREE.MeshNormalMaterial({});
                meshMaterial.side = THREE.DoubleSide;
                let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);
                return mesh;
            }

            function render() {
                if (controls.rotate && knot) {
                    knot.rotation.y = step += 0.00058;
                }
                requestAnimationFrame(render);
                webGLRenderer.render(scene, camera);
            }

            window.addEventListener('resize', function() {
                if (container) {
                     camera.aspect = container.clientWidth / container.clientHeight;
                     camera.updateProjectionMatrix();
                     webGLRenderer.setSize(container.clientWidth, container.clientHeight);
                }
            });
        }

        main();
    });
})();
/* --- END NEW HERO SECTION JS --- */

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