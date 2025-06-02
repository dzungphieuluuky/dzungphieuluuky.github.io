// Performance optimization: Throttle function
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

// Search functionality
function initializeSearch() {
  const searchTrigger = document.getElementById('search-trigger');
  const searchModal = document.getElementById('search-modal');
  const searchBackdrop = document.getElementById('search-backdrop');
  const searchInput = document.getElementById('nav-search-input');
  
  if (!searchTrigger || !searchModal) {
    console.log('Search elements not found, skipping search initialization');
    return;
  }
  
  // Open search modal
  function openSearch() {
    searchModal.style.display = 'flex';
    setTimeout(() => {
      searchModal.classList.add('active');
      if (searchInput) {
        searchInput.focus();
      }
    }, 10);
    document.body.style.overflow = 'hidden';
  }
  
  // Close search modal
  function closeSearch() {
    searchModal.classList.remove('active');
    setTimeout(() => {
      searchModal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
  
  // Event listeners
  searchTrigger.addEventListener('click', openSearch);
  
  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', closeSearch);
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Open search with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    
    // Close search with Escape
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });
  
  console.log('Search functionality initialized');
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('Custom script initializing...');
  
  // Add loading animation
  document.body.classList.add('page-loading');
  
  // Smooth scroll for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      // Add validation for the href value
      if (href && href.length > 1) {
        try {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        } catch (error) {
          console.warn('Invalid selector for smooth scroll:', href, error);
        }
      }
    });
  });
  
  // Throttled navbar scroll effect
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
    console.log('Navbar scroll handler added');
  }
  
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  // Check for IntersectionObserver support
  if (window.IntersectionObserver) {
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
    console.log(`Observing ${posts.length} post previews`);
  } else {
    console.warn('IntersectionObserver not supported, falling back to basic animations');
    // Fallback for older browsers
    document.querySelectorAll('.post-preview').forEach(post => {
      post.style.opacity = '1';
      post.style.transform = 'translateY(0)';
    });
  }
  
  // Initialize search functionality
  initializeSearch();
  
  console.log('Custom script initialization complete');
});

// Apply typing effect and remove loading after page loads - SINGLE HANDLER
window.addEventListener('load', function() {
  // Remove loading class
  document.body.classList.remove('page-loading');
  
  // Apply typing effect to main title
  const mainTitle = document.querySelector('.intro-header h1');
  if (mainTitle && mainTitle.textContent) {
    const originalText = mainTitle.textContent;
    typeWriter(mainTitle, originalText, 80);
    console.log('Typing effect applied to title');
  }
  
  // Debug search elements
  setTimeout(() => {
    console.log('Debug check:');
    console.log('Search trigger:', document.getElementById('search-trigger'));
    console.log('Search modal:', document.getElementById('search-modal'));
    console.log('Search input:', document.getElementById('nav-search-input'));
  }, 1000);
  
  console.log('Page loading complete');
});

// Add error handling for uncaught errors
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
});