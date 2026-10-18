// ===================================================
// Storica Architects — main.js
// Shared JavaScript for all pages
// ===================================================

document.addEventListener('DOMContentLoaded', function () {

  // 1. MOBILE MENU TOGGLE
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // 2. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 3. ANIMATED COUNTERS
  const counters = document.querySelectorAll('.fact-card strong');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  function animateCounter(el) {
    const raw = el.textContent.replace(/,/g, '');
    const target = parseInt(raw, 10);
    if (isNaN(target)) return;
    const duration = 1200;
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  // 4. SCROLL-REVEAL
  const revealTargets = document.querySelectorAll('.reveal-on-scroll');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

    // ---------------------------------------------------
  // 5. GALLERY LIGHTBOX WITH SWIPE/DRAG NAVIGATION
  // ---------------------------------------------------
  const galleryGrid = document.querySelector('.gallery-grid');

  if (galleryGrid) {
    let lightbox = document.getElementById('galleryLightbox');
    if (lightbox) lightbox.remove();

    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'galleryLightbox';
    lightbox.innerHTML = `
      <img src="" alt="">
      <span class="lightbox-close">&times;</span>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    lightboxImg.addEventListener('click', function (e) {
      e.stopPropagation(); // don't trigger the close-on-background-click
      lightboxImg.classList.toggle('zoomed');
    });

    let currentIndex = 0;
    let allImages = [];

  function showImage(index) {
   if (index < 0) index = allImages.length - 1;
   if (index >= allImages.length) index = 0;
   currentIndex = index;
   lightboxImg.src = allImages[currentIndex].src;
   lightboxImg.alt = allImages[currentIndex].alt;
   lightboxImg.classList.remove('zoomed'); // reset zoom on image change
  }

    galleryGrid.addEventListener('click', function (e) {
      if (e.target.tagName === 'IMG') {
        allImages = Array.from(galleryGrid.querySelectorAll('img'));
        currentIndex = allImages.indexOf(e.target);
        showImage(currentIndex);
        lightbox.classList.add('open');
      }
    });

    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      lightbox.classList.remove('open');
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'Escape') lightbox.classList.remove('open');
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
    
      

        // Swipe (touch) support
    let startX = 0;
    let isDragging = false;

    lightbox.addEventListener('touchstart', function (e) {
      if (e.touches.length > 1) {
        isDragging = false; // multi-touch = pinch zoom, not a swipe
        return;
      }
      startX = e.changedTouches[0].screenX;
      isDragging = true;
    });

    lightbox.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      const endX = e.changedTouches[0].screenX;
      const distance = endX - startX;
      if (Math.abs(distance) > 50) {
        if (distance > 0) {
          showImage(currentIndex - 1);
        } else {
          showImage(currentIndex + 1);
        }
      }
      isDragging = false;
    });

    // Drag (mouse) support for desktop
    lightbox.addEventListener('mousedown', function (e) {
      startX = e.screenX;
      isDragging = true;
    });

    lightbox.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      const distance = e.screenX - startX;
      if (Math.abs(distance) > 50) {
        if (distance > 0) {
          showImage(currentIndex - 1);
        } else {
          showImage(currentIndex + 1);
        }
      }
      isDragging = false;
    });
  }
  // 6. CONTACT FORM — CONNECTED TO BACKEND
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      let isValid = true;
      clearErrors(contactForm);

      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');

      if (!name.value.trim()) {
        showError(name, 'Please enter your name.');
        isValid = false;
      }
      if (!email.value.trim()) {
        showError(email, 'Please enter your email.');
        isValid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }
      if (!message.value.trim()) {
        showError(message, 'Please write a short message.');
        isValid = false;
      }
      if (!isValid) return;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            message: message.value.trim()
          })
        });
        const data = await response.json();
        if (data.success) {
          alert(data.message);
          contactForm.reset();
        } else {
          alert(data.error || 'Something went wrong. Please try again.');
        }
      } catch (err) {
        alert('Could not reach the server. Please try again later.');
      }
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  function showError(field, text) {
    field.style.borderColor = '#e04b4b';
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = text;
    errorEl.style.color = '#e04b4b';
    errorEl.style.fontSize = '12.5px';
    errorEl.style.marginTop = '-8px';
    field.insertAdjacentElement('afterend', errorEl);
  }
  function clearErrors(form) {
    form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
    form.querySelectorAll('input, textarea').forEach(function (el) { el.style.borderColor = ''; });
  }
});