/**
 * Burra Kirani - Portfolio Interactive Scripts
 * Pure Modern JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initNavbar();
  initTypingEffect();
  initScrollSpy();
  initProjectTabs();
  initScrollAnimations();
  initContactForm();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Handle Sticky Navbar Background on Scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   2. SCROLLSPY (ACTIVE LINK ON SCROLL)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

/* ==========================================================================
   3. DYNAMIC TYPING EFFECT (HERO SECTION)
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const roles = [
    'Python Full-Stack Developer Trainee',
    'Django Backend Developer',
    'Web Application Developer',
    'Computer Science Graduate (2026)'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next role
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. PROJECT SUB-APPLICATIONS TAB SWITCHER
   ========================================================================== */
function initProjectTabs() {
  const tabs = document.querySelectorAll('.app-tab');
  const panels = document.querySelectorAll('.app-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      // Update tabs state
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panels state
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   5. IMAGE LIGHTBOX / MODAL
   ========================================================================== */
function openLightbox(imageSrc, captionText) {
  const modal = document.getElementById('imageLightbox');
  const modalImg = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');

  if (!modal || !modalImg || !caption) return;

  modalImg.src = imageSrc;
  modalImg.alt = captionText || 'Project Screenshot Preview';
  caption.textContent = captionText || '';

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('imageLightbox');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

/* ==========================================================================
   6. COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function copyToClipboard(text, btnElement) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied "${text}" to clipboard!`);
      triggerCopyFeedback(btnElement);
    }).catch(err => {
      fallbackCopyText(text, btnElement);
    });
  } else {
    fallbackCopyText(text, btnElement);
  }
}

function fallbackCopyText(text, btnElement) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`Copied "${text}" to clipboard!`);
    triggerCopyFeedback(btnElement);
  } catch (err) {
    showToast(`Unable to copy text: ${text}`);
  }
  document.body.removeChild(textArea);
}

function triggerCopyFeedback(btnElement) {
  if (!btnElement) return;
  const originalHTML = btnElement.innerHTML;
  btnElement.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;
  setTimeout(() => {
    btnElement.innerHTML = originalHTML;
  }, 1800);
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ==========================================================================
   7. HONEST CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedbackBox = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    let isValid = true;

    // Reset error states
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      const parent = input.closest('.form-group');
      if (parent) parent.classList.remove('has-error');
    });

    // Validate Name
    if (!nameInput.value.trim()) {
      showFieldError(nameInput);
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      showFieldError(emailInput);
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      showFieldError(subjectInput);
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showFieldError(messageInput);
      isValid = false;
    }

    if (!isValid) {
      if (feedbackBox) {
        feedbackBox.className = 'form-feedback-box info';
        feedbackBox.textContent = 'Please fill in all required fields with valid details.';
      }
      return;
    }

    const name = encodeURIComponent(nameInput.value.trim());
    const email = encodeURIComponent(emailInput.value.trim());
    const subject = encodeURIComponent(`[Portfolio Contact] ${subjectInput.value.trim()} - from ${nameInput.value.trim()}`);
    const body = encodeURIComponent(
      `Hello Burra Kirani,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}\n\nBest regards,\n${nameInput.value.trim()}`
    );

    const recipient = 'burrakranthi41@gmail.com';
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    // Display honest feedback to user
    if (feedbackBox) {
      feedbackBox.className = 'form-feedback-box success';
      feedbackBox.innerHTML = `
        <strong>Email Prepared!</strong> Launching your email client to send to <em>${recipient}</em>.<br>
        If your email client did not open automatically, 
        <a href="${mailtoUrl}" style="color: #ff1744; text-decoration: underline; font-weight: bold;">click here to open manually</a>.
      `;
    }

    // Attempt to open mail client
    window.location.href = mailtoUrl;

    showToast('Launching email client with your message...');
  });
}

function showFieldError(inputElement) {
  const group = inputElement.closest('.form-group');
  if (group) {
    group.classList.add('has-error');
    inputElement.focus();
  }
}

/* ==========================================================================
   8. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.reveal-fade, .reveal-up, .reveal-left, .reveal-right, .reveal-scale'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target); // Reveal only once for performance
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}
