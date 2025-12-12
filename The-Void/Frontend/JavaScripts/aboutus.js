$(document).ready(function () {
  $("html,body").addClass("overflow");
  setTimeout(() => {
    $("html,body").removeClass("overflow");
  }, 2500);

  gsap.registerPlugin(ScrollTrigger);

  var $animeCard = document.querySelector(".anime-card-inner");
  //loader img
  gsap.set($animeCard, {
    rotationY: 90,
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
    width: "40vh",
    height: "40vh",
    scale: 1
  });

  //img set
  gsap.set(".anime-card-front img", {
    attr: { src: "https://images.pexels.com/photos/8474708/pexels-photo-8474708.jpeg?_gl=1*1kg7dj3*_ga*NDkwNjg5MjEwLjE3NTMzNDAwMzM.*_ga_8JE65Q40S6*czE3NjMxNDUxNDEkbzQkZzEkdDE3NjMxNDU1NjUkajM5JGwwJGgw" }
  });
  gsap.set(".anime-card-back img", {
    attr: { src: "https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?_gl=1*1dq4glv*_ga*NDkwNjg5MjEwLjE3NTMzNDAwMzM.*_ga_8JE65Q40S6*czE3NjMxNDUxNDEkbzQkZzEkdDE3NjMxNDU0NDQkajU5JGwwJGgw" }
  });

  //Main card-wrapper
  gsap.set(".anime-card", { x: "50%", y: "50%" });

  // Main-text animation
  //Main text load
  gsap.set(".main-txt", { opacity: 0, yPercent: 50 });
  const mainTxt = gsap.timeline();
  mainTxt.to(".main-txt", { opacity: 1, yPercent: -50, duration: 2 });

  //Main text opacity down
  const mainTxt2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".main-txt",
      start: "center center",
      end: "+=50",
      markers: false,
      scrub: 1
    }
  });
  mainTxt2.to(".main-txt", { opacity: 0, ease: "linear" });

  //loader to scale
  const tl = gsap.timeline();
  tl.to($animeCard, {
    rotationY: 0,
    ease: Expo.easeIn,
    duration: 2.5,
    scale: 1,
    width: "100vw",
    height: "100vh"
  });

  //Banner one image scale down
  const t2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner",
      start: "center center",
      end: "+=600",
      markers: false,
      scrub: 1
    }
  });
  if (window.innerWidth >= 1200 && window.innerWidth <= 1499) {
    t2.to($animeCard, {
      height: "60vh",
      width: "472.5px",
      left: "calc(243.75px + (50% - 585px) + 682.5px)"
    });
  } else if (window.innerWidth >= 992 && window.innerWidth <= 1199) {
    t2.to($animeCard, {
      height: "60vh",
      width: "465px",
      left: "calc(240px + (50% - 480px) + 480px)"
    });
  } else if (window.innerWidth >= 768 && window.innerWidth <= 991) {
    t2.to($animeCard, {
      height: "60vh",
      width: "345px",
      left: "calc(180px + (50% - 360px) + 360px)"
    });
  } else if (window.innerWidth <= 767) {
    t2.to($animeCard, {
      height: "calc(100vh - 340px)",
      width: "95%",
      left: "50%",
      top: "calc(100% - 40px)",
      yPercent: -100
    });
  } else {
    t2.to($animeCard, {
      height: "60vh",
      width: "535px",
      left: "calc(275px + (50% - 660px) + 770px)"
    });
  }

  gsap.to(".main-wallpaper", {
    opacity: 0,
    scrollTrigger: {
      trigger: ".banner",
      start: "center+=" + 100 + " center",
      end: "bottom center",
      markers: false,
      scrub: 1
    }
  });

  //Banner text-animation
  gsap.set(".banner-content", { opacity: 0, yPercent: 50 });
  gsap.to(".banner-content", {
    ease: "linear",
    yPercent: 0,
    opacity: 1,
    scrollTrigger: {
      trigger: ".banner",
      start: "center+=" + 300 + " center",
      end: "+=200",
      markers: false,
      scrub: 1
    }
  });

  //Banner animation
  gsap.to(".banner", {
    ease: "linear",
    scrollTrigger: {
      trigger: ".banner",
      start: "center center",
      end: "+=600",
      markers: false,
      pin: true,
      pinSpacing: true,
      scrub: 1
    }
  });

  //Banner two animation
  gsap.to(".banner-two", {
    ease: "linear",
    scrollTrigger: {
      trigger: ".banner-two",
      start: "center center",
      end: "+=600",
      markers: false,
      pin: true,
      pinSpacing: true,
      scrub: 1
    }
  });

  //Banner two image rotation
  const t3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner-two",
      start: "top center",
      end: "+=600",
      markers: false,
      scrub: 1
    }
  });
  if (window.innerWidth <= 767) {
    t3.to($animeCard, {
      rotationY: -180,
      height: "100vh",
      width: "100vw",
      left: "50%",
      top: "50%",
      yPercent: -50
    });
  } else {
    t3.to($animeCard, {
      rotationY: -180,
      height: "100vh",
      width: "100vw",
      left: "50%"
    });
  }

  //Banner three animation
  gsap.to(".banner-three", {
    ease: "linear",
    scrollTrigger: {
      trigger: ".banner-three",
      start: "center center",
      end: "+=600",
      markers: false,
      pin: true,
      pinSpacing: true,
      scrub: 1
    }
  });

  //Banner three image rotation
  const t4 = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner-three",
      start: "top center",
      end: "+=600",
      markers: false,
      scrub: 1
    }
  });
  if (window.innerWidth >= 1200 && window.innerWidth <= 1499) {
    t4.to($animeCard, {
      rotationY: -360,
      height: "60vh",
      width: "472.5px",
      left: "calc((50% - 585px) + 243.75px)"
    });
  } else if (window.innerWidth >= 992 && window.innerWidth <= 1199) {
    t4.to($animeCard, {
      rotationY: -360,
      height: "60vh",
      width: "465px",
      left: "calc((50% - 465px) + 240px)"
    });
  } else if (window.innerWidth >= 768 && window.innerWidth <= 991) {
    t4.to($animeCard, {
      rotationY: -360,
      height: "60vh",
      width: "345px",
      left: "calc((50% - 360px) + 180px)"
    });
  } else if (window.innerWidth <= 767) {
    t4.to($animeCard, {
      rotationY: -360,
      height: "calc(100vh - 340px)",
      width: "95%",
      left: "50%",
      top: "calc(100% - 40px)",
      yPercent: -100
    });
  } else {
    t4.to($animeCard, {
      rotationY: -360,
      height: "60vh",
      width: "535px",
      left: "calc((50% - 660px) + 275px)"
    });
  }

  //Banner four animation
  gsap.to(".banner-four", {
    ease: "linear",
    scrollTrigger: {
      trigger: ".banner-four",
      start: "center center",
      end: "+=600",
      markers: false,
      pin: true,
      pinSpacing: true,
      scrub: 1
    }
  });

  //Banner four image rotation
  const t5 = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner-four",
      start: "top center",
      end: "+=600",
      markers: false,
      scrub: 1
    }
  });
  if (window.innerWidth <= 767) {
    t5.to($animeCard, {
      rotationY: -180,
      height: "100vh",
      width: "100vw",
      left: "50%",
      top: "50%",
      yPercent: -50
    });
  } else {
    t5.to($animeCard, {
      rotationY: -180,
      height: "100vh",
      width: "100vw",
      left: "50%"
    });
  }

  // Main wrapper card
  gsap.to(".anime-card", {
    ease: "linear",
    scrollTrigger: {
      trigger: ".anime-card",
      start: "top top",
      end: "top bottom",
      endTrigger: ".slider-card ",
      markers: false,
      pin: true,
      pinSpacing: false,
      scrub: 1
    }
  });

  //slider-left img animation
  gsap.set(".slider-left img:first-child", { xPercent: 50 });
  gsap.set(".slider-left img:not(:first-child)", { xPercent: 100 });
  gsap.to(".slider-left .img-1", {
    ease: "none",
    xPercent: -95,
    scale: 0.6,
    scrollTrigger: {
      trigger: ".slider-card",
      start: "center+=" + 180 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });
  gsap.to(".slider-left .img-2", {
    ease: "none",
    xPercent: -70,
    scale: 0.7,
    scrollTrigger: {
      trigger: ".slider-card",
      start: "center+=" + 360 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });
  gsap.to(".slider-left .img-3", {
    ease: "none",
    xPercent: -40,
    scale: 0.8,
    scrollTrigger: {
      trigger: ".slider-card",
      start: "center+=" + 540 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });
  gsap.to(".slider-left .img-4", {
    ease: "none",
    xPercent: -10,
    scale: 0.9,
    scrollTrigger: {
      trigger: ".slider-card",
      start: "center+=" + 720 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });
  gsap.to(".slider-left .img-5", {
    ease: "none",
    xPercent: 20,
    scale: 1,
    scrollTrigger: {
      trigger: ".slider-card",
      start: "center+=" + 800 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });

  // slider right img animation
  gsap.set(".slider-right img:first-child", { xPercent: -50 });
  gsap.set(".slider-right img:not(:first-child)", { xPercent: -100 });
  gsap.to(".slider-right .img-1", {
    ease: "none",
    xPercent: 95,
    scale: 0.6,
    scrollTrigger: {
      trigger: ".slider-card ",
      start: "center+=" + 180 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });
  gsap.to(".slider-right .img-2", {
    ease: "none",
    xPercent: 70,
    scale: 0.7,
    scrollTrigger: {
      trigger: ".slider-card ",
      start: "center+=" + 360 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });
  gsap.to(".slider-right .img-3", {
    ease: "none",
    xPercent: 40,
    scale: 0.8,
    scrollTrigger: {
      trigger: ".slider-card ",
      start: "center+=" + 540 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });
  gsap.to(".slider-right .img-4", {
    ease: "none",
    xPercent: 10,
    scale: 0.9,
    scrollTrigger: {
      trigger: ".slider-card ",
      start: "center+=" + 720 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });
  gsap.to(".slider-right .img-5", {
    ease: "none",
    xPercent: -20,
    scale: 1,
    scrollTrigger: {
      trigger: ".slider-card ",
      start: "center+=" + 800 + " center",
      end: "center+=" + 900 + " center",
      markers: false,
      scrub: 1
    }
  });

  //slider card
  gsap.to(".slider-card", {
    ease: "linear",
    scrollTrigger: {
      trigger: ".slider-card",
      start: "center center",
      end: "+=1000",
      markers: false,
      pin: true,
      pinSpacing: true,
      scrub: 1
    }
  });

  gsap.to(".anime-card-front img", {
    attr: {
      src: "https://media.istockphoto.com/id/876612206/photo/space-shuttle-launch-on-blue-background.jpg?s=612x612&w=0&k=20&c=oPcaWUbOXv3HR2AcQxIiQ5drkNV8s5rvY_uahbjiixs="
    },
    scrollTrigger: {
      trigger: ".banner-three",
      start: "top bottom",
      end: "top bottom",
      endTrigger: ".slider-card ",
      markers: false,
      scrub: 1
    }
  });

  gsap.to(".anime-card-back img", {
    attr: { src: "https://images.pexels.com/photos/7170763/pexels-photo-7170763.jpeg?_gl=1*1oi01hn*_ga*NDkwNjg5MjEwLjE3NTMzNDAwMzM.*_ga_8JE65Q40S6*czE3NjMxNDUxNDEkbzQkZzEkdDE3NjMxNDU4NDMkajIkbDAkaDA." },
    scrollTrigger: {
      trigger: ".banner-four",
      start: "top bottom",
      end: "top bottom",
      endTrigger: ".slider-card ",
      markers: false,
      scrub: 1
    }
  });
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