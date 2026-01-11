// ====================================
// Modern Blog Search Script
// Minimal animations with smooth transitions
// ====================================

const ModernSearch = {
  searchData: [],
  searchIndex: null,
  currentResults: [],
  selectedIndex: -1,
  debounceTimer: null,
  
  init: function() {
    if (!document.getElementById("beautifuljekyll-search-overlay")) {
      console.log('Search overlay not found');
      return;
    }
    
    console.log('🔍 Initializing Modern Search...');
    this.loadSearchData();
    this.enhanceSearchUI();
    this.bindEvents();
    this.initKeyboardShortcuts();
  },
  
  loadSearchData: async function() {
    try {
      const baseurl = document.querySelector('meta[name="baseurl"]')?.content || '';
      const response = await fetch(`${baseurl}/assets/data/searchcorpus.json`);
      
      if (response.ok) {
        this.searchData = await response.json();
        console.log('✅ Search data loaded:', this.searchData.length, 'items');
      } else {
        console.warn('⚠️ Search corpus not found, extracting from page');
        this.extractPageData();
      }
      
      this.buildSearchIndex();
    } catch (error) {
      console.warn('⚠️ Search data loading failed:', error);
      this.extractPageData();
      this.buildSearchIndex();
    }
  },
  
  extractPageData: function() {
    console.log('📚 Extracting page data...');
    
    const posts = document.querySelectorAll('.post-preview, article, .blog-post');
    
    this.searchData = Array.from(posts).map((post, index) => {
      const titleEl = post.querySelector('h2 a, h1, .post-title, .post-title a');
      const contentEl = post.querySelector('.post-content, .post-excerpt, p');
      const linkEl = post.querySelector('h2 a, .post-title a, a[href*="/"]');
      const dateEl = post.querySelector('.post-meta, .post-date, time');
      
      const title = titleEl?.textContent?.trim() || `Post ${index + 1}`;
      const content = contentEl?.textContent?.trim() || '';
      const url = linkEl?.getAttribute('href') || '#';
      const date = dateEl?.textContent?.trim() || '';
      
      return {
        title,
        content,
        url: url.startsWith('http') ? url : (window.location.origin + url),
        date,
        excerpt: content.length > 150 ? content.substring(0, 150) + '...' : content
      };
    }).filter(item => item.title && !item.title.startsWith('Post '));
    
    console.log('✅ Extracted', this.searchData.length, 'items');
  },
  
  buildSearchIndex: function() {
    this.searchIndex = this.searchData.map((item, index) => ({
      ...item,
      searchText: [
        item.title || '',
        item.content || '',
        item.excerpt || ''
      ].join(' ').toLowerCase(),
      index
    }));
    
    console.log('🔍 Search index built with', this.searchIndex.length, 'items');
  },
  
  enhanceSearchUI: function() {
    const searchOverlay = document.getElementById("beautifuljekyll-search-overlay");
    if (!searchOverlay) return;
    
    // Hide fallback
    const fallback = searchOverlay.querySelector('.fallback-search');
    if (fallback) fallback.style.display = 'none';
    
    // Create modern search interface
    const modernHTML = `
      <div class="modern-search-container">
        <div class="search-gradient-bar"></div>
        
        <div class="search-header">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              id="modern-search-input" 
              placeholder="Search articles, ideas, thoughts..." 
              autocomplete="off"
              spellcheck="false"
            >
            <div class="search-loading" id="search-loading" style="display: none;">
              <div class="loading-spinner"></div>
            </div>
          </div>
          <button class="search-close" id="modern-search-close" aria-label="Close search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="search-results" id="modern-search-results">
          <div class="search-suggestions">
            <div class="suggestion-item">💡 Start typing to search through articles</div>
            <div class="suggestion-item">🔍 Find posts by title, content, or keywords</div>
            <div class="suggestion-item">⌨️ Use keyboard arrows to navigate results</div>
          </div>
        </div>
        
        <div class="search-footer">
          <div class="search-shortcuts">
            <span><kbd class="key-button">↑</kbd><kbd class="key-button">↓</kbd> Navigate</span>
            <span><kbd class="key-button">Enter</kbd> Select</span>
            <span><kbd class="key-button">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    `;
    
    searchOverlay.innerHTML = modernHTML;
    console.log('✅ Modern search UI created');
  },
  
  bindEvents: function() {
    const searchInput = document.getElementById('modern-search-input');
    const searchClose = document.getElementById('modern-search-close');
    const overlay = document.getElementById('beautifuljekyll-search-overlay');
    
    if (!searchInput) {
      console.warn('⚠️ Search input not found');
      return;
    }
    
    // Search input with debouncing
    searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      const query = e.target.value.trim();
      
      if (query.length === 0) {
        this.showSuggestions();
        return;
      }
      
      // Show loading
      const loadingEl = document.getElementById('search-loading');
      if (loadingEl) loadingEl.style.display = 'block';
      
      this.debounceTimer = setTimeout(() => {
        this.performSearch(query);
        if (loadingEl) loadingEl.style.display = 'none';
      }, 250);
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.navigateResults(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigateResults(-1);
          break;
        case 'Enter':
          e.preventDefault();
          this.selectResult();
          break;
        case 'Escape':
          e.preventDefault();
          this.closeSearch();
          break;
      }
    });
    
    // Close button
    if (searchClose) {
      searchClose.addEventListener('click', () => this.closeSearch());
    }
    
    // Close on backdrop click
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeSearch();
        }
      });
    }
    
    // Override search link
    const searchLink = document.getElementById('nav-search-link');
    if (searchLink) {
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSearch();
      });
    }
    
    console.log('✅ Search events bound');
  },
  
  initKeyboardShortcuts: function() {
    // CMD/Ctrl + K to open search
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }
    });
    
    console.log('⌨️ Keyboard shortcuts initialized (⌘K to search)');
  },
  
  performSearch: function(query) {
    if (!query || query.length < 2) {
      this.showSuggestions();
      return;
    }
    
    const queryLower = query.toLowerCase();
    const results = this.searchIndex
      .filter(item => item.searchText.includes(queryLower))
      .slice(0, 8);
    
    this.currentResults = results;
    this.selectedIndex = -1;
    this.displayResults(results, query);
  },
  
  displayResults: function(results, query) {
    const container = document.getElementById('modern-search-results');
    if (!container) return;
    
    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-suggestions">
          <div class="suggestion-item">🔍 No results found for "${this.escapeHtml(query)}"</div>
          <div class="suggestion-item">💡 Try different keywords or check spelling</div>
          <div class="suggestion-item">🎯 Search is case-insensitive and matches partial words</div>
        </div>
      `;
      return;
    }
    
    const resultsHTML = results.map((item, index) => `
      <div class="search-result-item" data-index="${index}" data-url="${this.escapeHtml(item.url)}">
        <div class="result-title">${this.highlightText(item.title, query)}</div>
        <div class="result-excerpt">${this.highlightText(item.excerpt, query)}</div>
        ${item.date ? `<div class="result-meta">📅 ${this.escapeHtml(item.date)}</div>` : ''}
      </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
    
    // Add click handlers
    container.querySelectorAll('.search-result-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        const url = item.getAttribute('data-url');
        if (url && url !== '#') {
          window.location.href = url;
        }
      });
      
      // Hover to select
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });
    });
  },
  
  highlightText: function(text, query) {
    if (!query || !text) return this.escapeHtml(text);
    
    const escapedText = this.escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    
    return escapedText.replace(regex, '<span class="highlight">$1</span>');
  },
  
  escapeHtml: function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  showSuggestions: function() {
    const container = document.getElementById('modern-search-results');
    if (container) {
      container.innerHTML = `
        <div class="search-suggestions">
          <div class="suggestion-item">💡 Start typing to search through articles</div>
          <div class="suggestion-item">🔍 Find posts by title, content, or keywords</div>
          <div class="suggestion-item">⌨️ Use keyboard arrows to navigate results</div>
        </div>
      `;
    }
  },
  
  navigateResults: function(direction) {
    const items = document.querySelectorAll('.search-result-item');
    if (items.length === 0) return;
    
    this.selectedIndex += direction;
    
    if (this.selectedIndex < 0) {
      this.selectedIndex = items.length - 1;
    } else if (this.selectedIndex >= items.length) {
      this.selectedIndex = 0;
    }
    
    this.updateSelection();
    items[this.selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  },
  
  updateSelection: function() {
    const items = document.querySelectorAll('.search-result-item');
    items.forEach((item, index) => {
      item.classList.toggle('selected', index === this.selectedIndex);
    });
  },
  
  selectResult: function() {
    const selected = document.querySelector('.search-result-item.selected');
    if (selected) {
      selected.click();
    }
  },
  
  openSearch: function() {
    const overlay = document.getElementById('beautifuljekyll-search-overlay');
    const input = document.getElementById('modern-search-input');
    
    if (overlay && input) {
      overlay.style.display = 'flex';
      setTimeout(() => {
        input.focus();
        this.showSuggestions();
      }, 100);
      document.body.classList.add('overflow-hidden');
    }
  },
  
  closeSearch: function() {
    const overlay = document.getElementById('beautifuljekyll-search-overlay');
    const input = document.getElementById('modern-search-input');
    
    if (overlay) {
      overlay.style.display = 'none';
      document.body.classList.remove('overflow-hidden');
      
      if (input) {
        input.value = '';
        this.showSuggestions();
      }
    }
  }
};

// ====================================
// Page Enhancements
// ====================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing page enhancements...');
  
  // Initialize search after a short delay
  setTimeout(() => {
    ModernSearch.init();
  }, 500);
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    });
  });
  
  // Enhanced navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    let ticking = false;
    
    function handleScroll() {
      const currentScroll = window.scrollY;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          if (currentScroll > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          
          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  // Animate posts on scroll (minimal, subtle)
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add small delay based on index for stagger effect
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 50); // Reduced delay for subtlety
          
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    });
    
    // Observe post previews
    document.querySelectorAll('.post-preview').forEach((post) => {
      post.style.opacity = '0';
      post.style.transform = 'translateY(20px)';
      post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(post);
    });
  }
  
  // Add stagger animation to tags
  document.querySelectorAll('.post-tag').forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.05}s`;
  });
  
  console.log('✅ Page enhancements initialized');
});

// ====================================
// Utility Functions
// ====================================

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce function for search input
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
