/* =============================================== */
/* BURGER HUB - SCRIPT.JS
/* Premium Flame-Grilled Burgers Website
/* =============================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // ========== SWIPER INITIALIZATION ==========
  const swiper = new Swiper('.mySwiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: { 
      el: '.swiper-pagination', 
      clickable: true 
    },
    navigation: { 
      nextEl: '.swiper-button-next', 
      prevEl: '.swiper-button-prev' 
    },
    breakpoints: { 
      640: { slidesPerView: 2, spaceBetween: 20 }, 
      1024: { slidesPerView: 3, spaceBetween: 25 } 
    }
  });

  // ========== SCROLL PROGRESS BAR ==========
  function updateScrollProgress() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  }
  window.addEventListener('scroll', updateScrollProgress);

  // ========== TOAST NOTIFICATION FUNCTION ==========
  function showToast(msg, isError = false) {
    // Remove existing toast
    const existing = document.querySelector('.toast-custom');
    if (existing) existing.remove();
    
    // Create new toast
    const toastDiv = document.createElement('div');
    toastDiv.className = 'toast-custom';
    toastDiv.innerText = msg;
    if (isError) {
      toastDiv.style.background = "#c0392b";
    }
    document.body.appendChild(toastDiv);
    
    // Auto remove after 3 seconds
    setTimeout(function() {
      toastDiv.style.opacity = '0';
      setTimeout(function() { 
        if (toastDiv.parentNode) toastDiv.remove(); 
      }, 300);
    }, 2800);
  }

  // ========== ORDER BUTTONS HANDLER ==========
  const allOrderBtns = document.querySelectorAll('.slide-order, .bestBtn, .bigBtn, .package-order, #heroMainBtn');
  allOrderBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const pkgName = btn.getAttribute('data-pkg') || 'Burger';
      showToast('🍔 ' + pkgName + ' added to cart! Proceed to checkout.');
      
      // Button ripple effect
      btn.style.transform = 'scale(0.96)';
      setTimeout(function() { 
        btn.style.transform = ''; 
      }, 150);
    });
  });

  // ========== STATISTICS COUNTER WITH INTERSECTION OBSERVER ==========
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const step = Math.ceil(target / 55);
        
        const timer = setInterval(function() {
          current += step;
          if (current >= target) {
            el.innerText = target;
            clearInterval(timer);
          } else {
            el.innerText = current;
          }
        }, 25);
        
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  
  statNumbers.forEach(function(s) { 
    counterObserver.observe(s); 
  });

  // ========== NEWSLETTER SUBSCRIPTION ==========
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = document.getElementById('newsEmail');
      const email = emailInput.value.trim();
      
      if (email.includes('@') && email.includes('.')) {
        showToast('✅ Subscribed! 15% OFF code sent to ' + email);
        emailInput.value = '';
      } else {
        showToast('📧 Please enter a valid email address', true);
      }
    });
  }

  // ========== ACTIVE NAVIGATION HIGHLIGHT ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function updateActiveNav() {
    let current = '';
    const scrollPos = window.scrollY + 120;
    
    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === current) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const offset = 70;
        const elementPosition = targetElem.offsetTop - offset;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navbarCollapse = document.getElementById('mainNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });

  // ========== CHAT BOT FUNCTIONALITY ==========
  const chatToggle = document.getElementById('chatToggle');
  const chatBox = document.getElementById('chatBox');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const chatMsgs = document.getElementById('chatMsgs');
  const chatInput = document.getElementById('chatMsgInput');
  const sendChatBtn = document.getElementById('sendChatMsgBtn');

  function addMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.className = isUser ? 'user-msg' : 'bot-msg';
    msgDiv.innerText = text;
    chatMsgs.appendChild(msgDiv);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function getBotReply(userMsg) {
    const q = userMsg.toLowerCase();
    
    if (q.includes('deal') || q.includes('discount') || q.includes('offer')) {
      return "🔥 Promo code BURGER50 gives you 20% off your entire order! Use at checkout.";
    }
    if (q.includes('menu') || q.includes('burger') || q.includes('food')) {
      return "🍔 Our Signature Burgers:\n• Classic Smash - $9.90\n• Double Cheese - $14.90\n• Bacon Beast - $17.50\n• Veggie Deluxe - $11.90\n\n🔥 Popular Packages from $10!";
    }
    if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
      return "💰 Our burgers start at $9.90. The Family Feast package ($20) includes burgers, fries, and drinks! Best value!";
    }
    if (q.includes('delivery') || q.includes('shipping') || q.includes('ship')) {
      return "🚚 Free delivery on orders above $25. Estimated delivery time: 30-40 minutes. Track your order in real-time!";
    }
    if (q.includes('chef') || q.includes('chefs') || q.includes('cook')) {
      return "👨‍🍳 Our Master Chefs: Gordon Ramsay (Head Chef, 30+ years), Emma Watson (Executive Chef), and Marco Pierre (Sous Chef)! They bring culinary excellence to every bite.";
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greeting')) {
      return "Hey there! 👋 Welcome to Burger Hub! I'm your AI assistant. Ask me about 'Deals', 'Menu', 'Prices', 'Delivery', or 'Chefs'!";
    }
    if (q.includes('thanks') || q.includes('thank you')) {
      return "You're welcome! 🍔 Enjoy your meal! Anything else I can help with?";
    }
    if (q.includes('location') || q.includes('store') || q.includes('outlet')) {
      return "📍 We have 125+ outlets across 48 countries! Use our store locator on the website to find the nearest Blackbar outlet.";
    }
    
    return "🤤 Thanks for reaching out! You can ask me about 'Deals', 'Menu', 'Prices', 'Delivery', 'Chefs', or 'Locations'. Or just click ORDER NOW to place your order!";
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (message === "") return;
    
    addMessage(message, true);
    chatInput.value = '';
    
    // Simulate typing delay
    setTimeout(function() {
      const reply = getBotReply(message);
      addMessage(reply, false);
    }, 500);
  }

  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', sendMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) { 
      if (e.key === 'Enter') sendMessage(); 
    });
  }
  
  if (chatToggle && chatBox) {
    chatToggle.addEventListener('click', function() { 
      if (chatBox.style.display === 'flex') {
        chatBox.style.display = 'none';
      } else {
        chatBox.style.display = 'flex';
      }
    });
  }
  
  if (closeChatBtn && chatBox) {
    closeChatBtn.addEventListener('click', function() { 
      chatBox.style.display = 'none'; 
    });
  }

  // ========== CHEF CARD CLICK INTERACTION ==========
  const chefCards = document.querySelectorAll('.chef-card');
  chefCards.forEach(function(card) {
    card.addEventListener('click', function() {
      const chefName = card.querySelector('h4')?.innerText || 'our chef';
      showToast('👨‍🍳 Meet ' + chefName + '! Ask our chatbot for more details about their specialties!');
    });
  });

  // ========== KEYBOARD SHORTCUTS ==========
  document.addEventListener('keydown', function(e) {
    // Press 'C' to open/close chat
    if (e.key === 'c' || e.key === 'C') {
      if (chatBox) {
        if (chatBox.style.display === 'flex') {
          chatBox.style.display = 'none';
        } else {
          chatBox.style.display = 'flex';
        }
      }
    }
    // Press 'Esc' to close chat
    if (e.key === 'Escape') {
      if (chatBox) chatBox.style.display = 'none';
    }
  });

  // ========== WELCOME TOAST ON PAGE LOAD ==========
  setTimeout(function() {
    showToast('🍔 Welcome to Blackbar! Use code "BURGER50" for 20% off your first order!');
  }, 1000);

  // ========== ADD LAZY LOADING TO IMAGES ==========
  const allImages = document.querySelectorAll('img');
  allImages.forEach(function(img) {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // ========== PARALLAX EFFECT ON HERO IMAGE ==========
  const heroImg = document.querySelector('.hero-img-wrapper img');
  const heroSection = document.querySelector('.hero-section');
  
  if (heroImg && heroSection && !('ontouchstart' in window)) {
    heroSection.addEventListener('mousemove', function(e) {
      const x = (window.innerWidth / 2 - e.pageX) / 60;
      const y = (window.innerHeight / 2 - e.pageY) / 60;
      heroImg.style.transform = "translate(" + (x * 0.3) + "px, " + (y * 0.3) + "px)";
    });
    
    heroSection.addEventListener('mouseleave', function() {
      heroImg.style.transform = 'translate(0, 0)';
    });
  }

  // ========== SCROLL REVEAL ANIMATION ==========
  const revealElements = document.querySelectorAll('.chef-card, .package-card, .stat-card');
  
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  revealElements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    revealObserver.observe(el);
  });

  // ========== CLOSE MOBILE MENU ON WINDOW RESIZE ==========
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768) {
        const navbarCollapse = document.getElementById('mainNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    }, 250);
  });

  // Console logs for debugging
  console.log("🔥 Burger Hub Fully Loaded!");
  console.log("✨ Features: Swiper Slider | AI Chatbot | Scroll Animations | Counter Animation");
  console.log("💡 Tip: Press 'C' to open chat, 'Esc' to close chat!");
});