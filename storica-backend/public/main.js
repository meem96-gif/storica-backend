// ===================================================
// Storica Architects — main.js
// Shared JavaScript for all pages
// ===================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------------------------------------------------
  // 1. MOBILE MENU TOGGLE
  // (works even without the inline onclick in the HTML)
  // ---------------------------------------------------
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    // Close the menu if someone clicks a link inside it
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // ---------------------------------------------------
  // 2. SMOOTH SCROLL for in-page anchor links (href="#something")
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // 3. ANIMATED COUNTERS ("Some Facts" numbers count up)
  // ---------------------------------------------------
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

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    const raw = el.textContent.replace(/,/g, '');       // "22,578" -> "22578"
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

  // ---------------------------------------------------
  // 4. SCROLL-REVEAL for sections (fade + slide up)
  // Adds ".reveal" class handling; any element with
  // class="reveal-on-scroll" will animate in.
  // ---------------------------------------------------
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

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ---------------------------------------------------
  // 5. GALLERY LIGHTBOX (only runs if a .gallery-grid exists)
  // ---------------------------------------------------
  const galleryGrid = document.querySelector('.gallery-grid');

  if (galleryGrid) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<img src="" alt=""><span class="lightbox-close">&times;</span>';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');

    galleryGrid.addEventListener('click', function (e) {
      if (e.target.tagName === 'IMG') {
        lightboxImg.src = e.target.src;
        lightboxImg.alt = e.target.alt;
        lightbox.classList.add('open');
      }
    });

    lightbox.addEventListener('click', function () {
      lightbox.classList.remove('open');
    });
  }

  // ---------------------------------------------------
  // 6. CONTACT FORM VALIDATION (only runs if .contact-form exists)
  // ---------------------------------------------------
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
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

      if (isValid) {
        alert('Thanks! This form is a demo — no message was actually sent.');
        contactForm.reset();
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
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.style.borderColor = '';
    });
  }

});