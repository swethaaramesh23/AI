/* ============================================================
   STACKLY AI — Main Website JavaScript
   Version: 1.0.0
   All features: Preloader, Sticky Nav, Scroll Reveal, Counter,
   Typing Effect, Testimonial Slider, FAQ, Newsletter, Blog Filter,
   Chatbot, Smooth Scroll, Back to Top, Contact Form, Parallax
   ============================================================ */

'use strict';

/* ---------------------------------------------------------------
   1. PRELOADER
   --------------------------------------------------------------- */
(function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const percentEl = document.getElementById('preloader-percent');
  let percent = 0;
  let interval;
  
  if (percentEl) {
    interval = setInterval(() => {
      percent += Math.floor(Math.random() * 15) + 5;
      if (percent >= 100) {
        percent = 100;
        clearInterval(interval);
      }
      percentEl.textContent = percent;
    }, 30);
  }

  function hidePreloader() {
    if (preloader.classList.contains('loaded')) return;
    
    if (percentEl) {
      clearInterval(interval);
      percentEl.textContent = '100';
    }
    
    preloader.classList.add('loaded');
    preloader.addEventListener('transitionend', () => {
      preloader.style.display = 'none';
    }, { once: true });
    
    // Fallback if transitionend doesn't fire
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }

  // Hide preloader when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(hidePreloader, 300);
  });

  // Fallback: Force preloader to close after 1.5 seconds max
  setTimeout(hidePreloader, 1500);
})();

/* ---------------------------------------------------------------
   2. STICKY NAVIGATION
   --------------------------------------------------------------- */
function initStickyNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const hamburger = document.querySelector('.hamburger, .nav-toggle, .mobile-toggle');
  const navMenuDesktop = document.querySelector('.nav-menu, .nav-links');
  const navLinks = document.querySelectorAll('.nav-menu a, .nav-links a');
  
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu-links a');

  // Sticky on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.add('active');
      mobileMenu.classList.add('active');
      document.body.classList.add('menu-open');
    });
  }

  // Mobile close button
  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  }

  // Close mobile menu on link click
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('active');
      if (mobileMenu) mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Highlight active nav link based on current page URL
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href === './' + currentPage)) {
      link.classList.add('active');
    }
  });
}

/* ---------------------------------------------------------------
   3. SCROLL REVEAL (AOS-style with Intersection Observer)
   --------------------------------------------------------------- */
function initScrollReveal() {
  const aosElements = document.querySelectorAll('[data-aos]');
  if (!aosElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-aos-delay'), 10) || 0;

          setTimeout(() => {
            el.classList.add('aos-animate');
          }, delay);

          // One-time reveal — stop observing after animation
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  aosElements.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------------
   4. COUNTER ANIMATION
   --------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number, [data-count]');
  if (!counters.length) return;

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function animateCounter(el) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target = parseInt(el.getAttribute('data-count') || el.textContent, 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      const current = Math.floor(eased * target);

      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(counter => observer.observe(counter));
}

/* ---------------------------------------------------------------
   5. TYPING TEXT EFFECT
   --------------------------------------------------------------- */
function initTypingEffect() {
  const typingEl = document.querySelector('.typing-text');
  if (!typingEl) return;

  const strings = [
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Generative AI',
    'Computer Vision',
    'Natural Language Processing'
  ];

  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const current = strings[stringIndex];

    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(type, 500);
      return;
    }

    if (!isDeleting) {
      // Typing forward
      typingEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(type, 2000); // Pause at end
        return;
      }
      setTimeout(type, 50); // Typing speed
    } else {
      // Deleting
      typingEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        setTimeout(type, 300); // Pause before next string
        return;
      }
      setTimeout(type, 30); // Delete speed
    }
  }

  type();
}

/* ---------------------------------------------------------------
   6. TESTIMONIAL SLIDER
   --------------------------------------------------------------- */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide, .testimonial-card');
  const prevBtn = document.querySelector('.testimonial-prev, .slider-prev');
  const nextBtn = document.querySelector('.testimonial-next, .slider-next');
  const dotsContainer = document.querySelector('.testimonial-dots, .slider-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  let touchStartX = 0;
  let touchEndX = 0;
  let isPaused = false;

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Auto-rotate
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (!isPaused) nextSlide();
    }, 5000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Button controls
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

  // Pause on hover
  track.addEventListener('mouseenter', () => { isPaused = true; });
  track.addEventListener('mouseleave', () => { isPaused = false; });

  // Touch / swipe support
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      startAutoPlay();
    }
  }, { passive: true });

  startAutoPlay();
}

/* ---------------------------------------------------------------
   7. FAQ ACCORDION
   --------------------------------------------------------------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------------------------------------------------------------
   8. NEWSLETTER FORM
   --------------------------------------------------------------- */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"], input[name="email"]');
    if (!emailInput) return;

    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      showMainToast('Please enter a valid email address.', 'error');
      emailInput.classList.add('error');
      return;
    }

    emailInput.classList.remove('error');
    showMainToast('Thank you for subscribing! 🎉', 'success');
    form.reset();
  });
}

/* ---------------------------------------------------------------
   9. BLOG CATEGORY FILTER
   --------------------------------------------------------------- */
/* ---------------------------------------------------------------
   9. BLOG CATEGORY FILTER & PAGINATION
   --------------------------------------------------------------- */
function initBlogFilter() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  const searchInput = document.querySelector('.blog-search-input');
  const pagePrev = document.querySelector('.blog-page-prev');
  const pageNext = document.querySelector('.blog-page-next');
  const pageNums = document.querySelectorAll('.blog-page-num');

  if (!blogCards.length) return;

  let currentPage = 1;
  const postsPerPage = 2;
  let currentFilter = 'all';
  let searchQuery = '';

  function updateBlogView() {
    // 1. Filter by category and search
    const filteredCards = Array.from(blogCards).filter(card => {
      const category = card.getAttribute('data-category') || '';
      const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
      const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
      const matchesFilter = (currentFilter === 'all' || category === currentFilter);
      const matchesSearch = (!searchQuery || title.includes(searchQuery) || excerpt.includes(searchQuery));
      return matchesFilter && matchesSearch;
    });

    // 2. Paginate filtered list
    const totalPages = Math.ceil(filteredCards.length / postsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * postsPerPage;
    const endIdx = startIdx + postsPerPage;

    // Show/hide cards
    blogCards.forEach(card => {
      const isFiltered = filteredCards.includes(card);
      if (isFiltered) {
        const idx = filteredCards.indexOf(card);
        if (idx >= startIdx && idx < endIdx) {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      } else {
        card.style.display = 'none';
      }
    });

    // 3. Update pagination buttons
    if (pagePrev) {
      pagePrev.disabled = (currentPage === 1);
      pagePrev.style.opacity = (currentPage === 1) ? '0.5' : '1';
      pagePrev.style.pointerEvents = (currentPage === 1) ? 'none' : 'auto';
    }
    if (pageNext) {
      pageNext.disabled = (currentPage === totalPages);
      pageNext.style.opacity = (currentPage === totalPages) ? '0.5' : '1';
      pageNext.style.pointerEvents = (currentPage === totalPages) ? 'none' : 'auto';
    }

    pageNums.forEach(btn => {
      const pageVal = parseInt(btn.getAttribute('data-page'), 10);
      if (pageVal > totalPages) {
        btn.style.display = 'none';
      } else {
        btn.style.display = '';
        if (pageVal === currentPage) {
          btn.className = 'btn btn-primary blog-page-num';
        } else {
          btn.className = 'btn btn-outline blog-page-num';
        }
      }
    });
  }

  // Event Listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      currentPage = 1;
      updateBlogView();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      currentPage = 1;
      updateBlogView();
    });
  }

  pageNums.forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.getAttribute('data-page'), 10);
      updateBlogView();
    });
  });

  if (pagePrev) {
    pagePrev.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateBlogView();
      }
    });
  }

  if (pageNext) {
    pageNext.addEventListener('click', () => {
      const filteredCards = Array.from(blogCards).filter(card => {
        const category = card.getAttribute('data-category') || '';
        const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
        const matchesFilter = (currentFilter === 'all' || category === currentFilter);
        const matchesSearch = (!searchQuery || title.includes(searchQuery) || excerpt.includes(searchQuery));
        return matchesFilter && matchesSearch;
      });
      const totalPages = Math.ceil(filteredCards.length / postsPerPage) || 1;
      if (currentPage < totalPages) {
        currentPage++;
        updateBlogView();
      }
    });
  }

  // Initialize view
  updateBlogView();
}

/* ---------------------------------------------------------------
   10. AI CHATBOT WIDGET
   --------------------------------------------------------------- */
function initChatbot() {
  const chatToggle = document.querySelector('.chatbot-toggle');
  const chatWindow = document.querySelector('.chatbot-window, .chatbot-container');
  const chatClose = document.querySelector('.chatbot-close');
  const chatForm = document.querySelector('.chatbot-form');
  const chatInput = document.querySelector('.chatbot-input');
  const chatMessages = document.querySelector('.chatbot-messages');

  if (!chatToggle || !chatWindow) return;

  const botResponses = {
    'hello': 'Hello! Welcome to STACKLY AI. How can I help you today?',
    'hi': 'Hi there! I\'m STACKLY AI\'s AI assistant. What would you like to know?',
    'hey': 'Hey! Great to see you. How can I assist you today?',
    'services': 'We offer Machine Learning, Deep Learning, Generative AI, Computer Vision, NLP, AI Chatbots, Predictive Analytics, AI Automation, Recommendation Systems, and Data Intelligence.',
    'pricing': 'We have three plans: Starter ($49/mo), Professional ($149/mo), and Enterprise (custom). Visit our pricing page for details!',
    'contact': 'You can reach us at hello@stackly.ai or visit our contact page. We\'d love to hear from you!',
    'demo': 'We offer free demos for all our AI solutions! Fill out our contact form and we\'ll get back to you within 24 hours.',
    'about': 'STACKLY AI is a premium AI solutions provider specializing in cutting-edge artificial intelligence services for businesses worldwide.',
    'help': 'I can help you with information about our services, pricing, demos, and contact details. Just ask!',
    'thanks': 'You\'re welcome! Is there anything else I can help you with?',
    'thank you': 'You\'re welcome! Feel free to ask if you need anything else.',
    'bye': 'Goodbye! Have a great day. Feel free to come back anytime!',
    'default': 'Thanks for your message! Our team will get back to you soon. In the meantime, explore our services and solutions.'
  };

  let isFirstOpen = true;

  function addMessage(text, sender) {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');

    const avatar = document.createElement('div');
    avatar.classList.add('chat-avatar');
    avatar.innerHTML = sender === 'user'
      ? '<i class="fas fa-user"></i>'
      : '<i class="fas fa-robot"></i>';

    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble');
    bubble.textContent = text;

    const time = document.createElement('span');
    time.classList.add('chat-time');
    const now = new Date();
    time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    msgDiv.appendChild(time);
    chatMessages.appendChild(msgDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    if (!chatMessages) return;
    const typing = document.createElement('div');
    typing.classList.add('chat-message', 'bot-message', 'typing-indicator');
    typing.innerHTML = `
      <div class="chat-avatar"><i class="fas fa-robot"></i></div>
      <div class="chat-bubble">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>`;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  }

  function getBotResponse(input) {
    const lower = input.toLowerCase().trim();
    // Check for keyword matches
    for (const key of Object.keys(botResponses)) {
      if (key === 'default') continue;
      if (lower.includes(key)) {
        return botResponses[key];
      }
    }
    return botResponses['default'];
  }

  function handleSend() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    // Show typing indicator, then bot response
    const typingEl = showTypingIndicator();
    setTimeout(() => {
      if (typingEl) typingEl.remove();
      addMessage(getBotResponse(text), 'bot');
    }, 1000);
  }

  // Toggle chat window
  chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    chatToggle.classList.toggle('active');

    if (chatWindow.classList.contains('active') && isFirstOpen) {
      isFirstOpen = false;
      setTimeout(() => {
        addMessage('Hello! 👋 Welcome to STACKLY AI. How can I help you today?', 'bot');
      }, 500);
    }

    if (chatInput && chatWindow.classList.contains('active')) {
      setTimeout(() => chatInput.focus(), 300);
    }
  });

  // Close chatbot
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('active');
      chatToggle.classList.remove('active');
    });
  }

  // Send on form submit
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSend();
    });
  }

  // Send on Enter key
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }
}

/* ---------------------------------------------------------------
   11. SMOOTH SCROLL
   --------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbar = document.querySelector('.navbar');
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ---------------------------------------------------------------
   12. BACK TO TOP BUTTON
   --------------------------------------------------------------- */
function initBackToTop() {
  let btn = document.querySelector('.back-to-top');

  // Create button if it doesn't exist
  if (!btn) {
    btn = document.createElement('button');
    btn.classList.add('back-to-top');
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------------
   13. CONTACT FORM VALIDATION
   --------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form, #contact-form');
  if (!form) return;

  function showFieldError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('error');
    let errorEl = group.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.classList.add('form-error');
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.remove('error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';
  }

  function validateField(field, rules) {
    const value = field.value.trim();

    if (rules.required && !value) {
      showFieldError(field, rules.requiredMsg || 'This field is required');
      return false;
    }
    if (rules.minLength && value.length < rules.minLength) {
      showFieldError(field, rules.minLengthMsg || `Minimum ${rules.minLength} characters required`);
      return false;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      showFieldError(field, rules.patternMsg || 'Invalid format');
      return false;
    }

    clearFieldError(field);
    return true;
  }

  // Real-time validation on input
  const fields = form.querySelectorAll('input, textarea, select');
  fields.forEach(field => {
    field.addEventListener('blur', () => {
      const name = field.getAttribute('name') || field.id || '';
      if (name.includes('name')) {
        validateField(field, { required: true, minLength: 2, requiredMsg: 'Name is required', minLengthMsg: 'Name must be at least 2 characters' });
      } else if (name.includes('email')) {
        validateField(field, { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, requiredMsg: 'Email is required', patternMsg: 'Please enter a valid email' });
      } else if (name.includes('subject')) {
        validateField(field, { required: true, requiredMsg: 'Subject is required' });
      } else if (name.includes('message')) {
        validateField(field, { required: true, minLength: 10, requiredMsg: 'Message is required', minLengthMsg: 'Message must be at least 10 characters' });
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nameField = form.querySelector('[name="name"], #name');
    const emailField = form.querySelector('[name="email"], #email');
    const subjectField = form.querySelector('[name="subject"], #subject');
    const messageField = form.querySelector('[name="message"], #message');

    if (nameField) {
      if (!validateField(nameField, { required: true, minLength: 2, requiredMsg: 'Name is required', minLengthMsg: 'Name must be at least 2 characters' })) isValid = false;
    }
    if (emailField) {
      if (!validateField(emailField, { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, requiredMsg: 'Email is required', patternMsg: 'Please enter a valid email address' })) isValid = false;
    }
    if (subjectField) {
      if (!validateField(subjectField, { required: true, requiredMsg: 'Subject is required' })) isValid = false;
    }
    if (messageField) {
      if (!validateField(messageField, { required: true, minLength: 10, requiredMsg: 'Message is required', minLengthMsg: 'Message must be at least 10 characters' })) isValid = false;
    }

    if (isValid) {
      showMainToast('Message sent successfully! We\'ll get back to you soon. 🚀', 'success');
      form.reset();
      // Clear all error states
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    } else {
      showMainToast('Please fix the errors in the form.', 'error');
    }
  });
}

/* ---------------------------------------------------------------
   14. PARALLAX EFFECT
   --------------------------------------------------------------- */
function initParallax() {
  const hero = document.querySelector('.hero, .hero-section');
  if (!hero) return;

  const parallaxElements = hero.querySelectorAll('.hero-bg, .hero-shape, .hero-particle, .parallax-element');
  if (!parallaxElements.length) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) * 0.02;
    const y = (e.clientY - window.innerHeight / 2) * 0.02;

    parallaxElements.forEach((el, index) => {
      const multiplier = (index + 1) * 0.5;
      const offsetX = x * multiplier;
      const offsetY = y * multiplier;
      el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  }, { passive: true });
}

/* ---------------------------------------------------------------
   TOAST HELPER (Main site version)
   --------------------------------------------------------------- */
function showMainToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('toast-container');
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }

  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l6.59-6.59L17 7l-8 8z" fill="currentColor"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5 13.59L13.59 15 10 11.41 6.41 15 5 13.59 8.59 10 5 6.41 6.41 5 10 8.59 13.59 5 15 6.41 11.41 10 15 13.59z" fill="currentColor"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9V9h2v6zm0-8H9V5h2v2z" fill="currentColor"/></svg>'
  };

  const colors = {
    success: '#22C55E',
    error: '#EF4444',
    info: '#3B82F6'
  };

  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${type}`);
  toast.style.cssText = `
    display:flex;align-items:center;gap:12px;padding:14px 20px;
    background:#1E293B;border-left:4px solid ${colors[type] || colors.info};
    border-radius:8px;color:#fff;font-size:14px;min-width:300px;max-width:420px;
    box-shadow:0 10px 40px rgba(0,0,0,0.3);transform:translateX(120%);
    transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);pointer-events:all;
  `;

  const iconSpan = document.createElement('span');
  iconSpan.style.cssText = `color:${colors[type] || colors.info};flex-shrink:0;display:flex;`;
  iconSpan.innerHTML = icons[type] || icons.info;

  const textSpan = document.createElement('span');
  textSpan.style.cssText = 'flex:1;line-height:1.4;';
  textSpan.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'background:none;border:none;color:#94A3B8;cursor:pointer;font-size:18px;padding:0;line-height:1;flex-shrink:0;';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => dismissToast(toast));

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  // Slide in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });
  });

  // Auto dismiss
  const timer = setTimeout(() => dismissToast(toast), duration);
  toast.addEventListener('mouseenter', () => clearTimeout(timer));

  function dismissToast(el) {
    el.style.transform = 'translateX(120%)';
    el.addEventListener('transitionend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 500); // Fallback
  }
}

// Make toast globally available
window.showMainToast = showMainToast;

/* ---------------------------------------------------------------
   17. WEBSITE DARK / LIGHT THEME TOGGLE
   --------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('stackly_theme') || 'light';
  applyTheme(currentTheme);

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('stackly_theme', theme);
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
}

/* ---------------------------------------------------------------
   18. AI TOOL SEARCH FILTER
   --------------------------------------------------------------- */
function initAIQuery() {
  const searchInput = document.getElementById('aiToolSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.ai-tool-card');
    
    cards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(query) || desc.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* ---------------------------------------------------------------
   INITIALIZE ALL
   --------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initScrollReveal();
  initCounters();
  initTypingEffect();
  initTestimonialSlider();
  initFAQ();
  initNewsletter();
  initBlogFilter();
  initChatbot();
  initSmoothScroll();
  initBackToTop();
  initContactForm();
  initParallax();
  initThemeToggle();
  initAIQuery();
});
