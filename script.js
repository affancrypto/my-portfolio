/* =========================================================
   AFFAN — PORTFOLIO SCRIPT
   Vanilla JS only — no frameworks, no dependencies
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initHamburgerMenu();
  initActiveNavLink();
  initScrollReveal();
  initTypingEffect();
  initProjectDetails();
  init();
});

/* ---------------------------------------------------------
   1. Sticky navbar background on scroll
--------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------------------------------------------------
   2. Mobile hamburger menu
--------------------------------------------------------- */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---------------------------------------------------------
   3. Highlight active nav link based on section in view
--------------------------------------------------------- */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------
   4. Scroll reveal animations (IntersectionObserver)
--------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  items.forEach((el) => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));

  // Skill bars fill when their card enters view
  document.querySelectorAll('.skill-card').forEach((card) => {
    const barObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    barObserver.observe(card);
  });
}

/* ---------------------------------------------------------
   5. Typing effect inside the hero "code window"
--------------------------------------------------------- */
function initTypingEffect() {
  const target = document.getElementById('typedCode');
  if (!target) return;

  const snippet =
`const affan = {
  role: "Web Developer",
  stack: ["HTML", "CSS", "JavaScript"],
  focus: "Business & Portfolio Sites",
  availability: "Open for projects"
};`;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    target.textContent = snippet;
    return;
  }

  let i = 0;
  const speed = 22;

  const type = () => {
    if (i <= snippet.length) {
      target.textContent = snippet.slice(0, i);
      i++;
      setTimeout(type, speed);
    }
  };

  // Start once the hero is visible
  const heroObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          type();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) heroObserver.observe(heroVisual);
  else type();
}

/* ---------------------------------------------------------
   6. Project "View Details" expand/collapse
--------------------------------------------------------- */
function initProjectDetails() {
  const buttons = document.querySelectorAll('.details-toggle');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;

      const isExpanded = card.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', String(isExpanded));
      btn.textContent = isExpanded ? 'Hide Details' : 'View Details';
    });
  });
}

/* ---------------------------------------------------------
   7. Contact form validation + submit)
--------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (field, message) => {
    const { input, error } = fields[field];
    const row = input.closest('.form-row');
    row.classList.toggle('invalid', Boolean(message));
    error.textContent = message || '';
  };

  const validate = () => {
    let valid = true;

    if (!fields.name.input.value.trim()) {
      setFieldError('name', 'Please enter your name.');
      valid = false;
    } else {
      setFieldError('name', '');
    }

    const emailValue = fields.email.input.value.trim();
    if (!emailValue) {
      setFieldError('email', 'Please enter your email.');
      valid = false;
    } else if (!emailPattern.test(emailValue)) {
      setFieldError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      setFieldError('email', '');
    }

    if (!fields.message.input.value.trim()) {
      setFieldError('message', 'Please write a short message.');
      valid = false;
    } else {
      setFieldError('message', '');
    }

    return valid;
  };

  Object.values(fields).forEach(({ input }) => {
    input.addEventListener('input', () => {
      if (input.closest('.form-row').classList.contains('invalid')) validate();
    });
  });

  form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validate()) {
    status.textContent = 'Please fix the highlighted fields.';
    status.style.color = '#e2645c';
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  status.textContent = '';
  status.style.color = '';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      status.textContent = "Thanks! Your message has been sent successfully.";
      status.style.color = '';
      form.reset();
    } else {
      status.textContent = "Something went wrong. Please try again.";
      status.style.color = '#e2645c';
    }
  } catch (error) {
    status.textContent = "Something went wrong. Please try again.";
    status.style.color = '#e2645c';
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Send Message';
});
}
initContactForm();