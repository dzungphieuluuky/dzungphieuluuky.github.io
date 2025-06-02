// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
  // Add loading animation
  document.body.classList.add('page-loading');
  
  // Smooth scroll for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
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
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(44, 62, 80, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
      } else {
        navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        navbar.style.backdropFilter = 'none';
      }
    });
  }
  
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }
    });
  }, observerOptions);
  
  // Observe post previews
  const posts = document.querySelectorAll('.post-preview');
  posts.forEach(post => {
    post.style.opacity = '0';
    post.style.transform = 'translateY(30px)';
    post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(post);
  });
  
  // Remove loading class after page is fully loaded
  window.addEventListener('load', function() {
    document.body.classList.remove('page-loading');
  });
});

// Add typing effect to title (optional)
function typeWriter(element, text, speed = 100) {
  if (!element || !text) return;
  
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Apply typing effect to main title if exists
window.addEventListener('load', function() {
  const mainTitle = document.querySelector('.intro-header h1');
  if (mainTitle && mainTitle.textContent) {
    const originalText = mainTitle.textContent;
    typeWriter(mainTitle, originalText, 80);
  }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Apply throttling to scroll-heavy operations
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = throttle(function() {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(44, 62, 80, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
      } else {
        navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        navbar.style.backdropFilter = 'none';
      }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll);
  }
});

// Add error handling and fallbacks
(function() {
  'use strict';
  
  // Check for browser support
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported, falling back to basic animations');
    // Fallback for older browsers
    document.querySelectorAll('.post-preview').forEach(post => {
      post.style.opacity = '1';
      post.style.transform = 'translateY(0)';
    });
  }
  
  // Error handling for smooth scroll
  if (!('scrollBehavior' in document.documentElement.style)) {
    console.warn('Smooth scrolling not supported');
  }
  
})();