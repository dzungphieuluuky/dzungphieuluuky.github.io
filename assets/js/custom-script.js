// Modern Enhanced Search with Whale Ocean Theme
const ModernSearch = {
  searchData: [],
  searchIndex: null,
  currentResults: [],
  selectedIndex: -1,
  
  init: function() {
    if (!document.getElementById("beautifuljekyll-search-overlay")) {
      console.log('Search overlay not found');
      return;
    }
    
    console.log('Initializing Modern Search...');
    this.loadSearchData();
    this.enhanceSearchUI();
    this.bindEvents();
  },
  
  loadSearchData: async function() {
    try {
      const baseurl = document.querySelector('meta[name="baseurl"]')?.content || '';
      const response = await fetch(`${baseurl}/assets/data/searchcorpus.json`);
      
      if (response.ok) {
        this.searchData = await response.json();
        console.log('Search data loaded:', this.searchData.length, 'items');
      } else {
        console.warn('Search corpus not found, extracting from page');
        this.extractPageData();
      }
      
      this.buildSearchIndex();
    } catch (error) {
      console.warn('Search data loading failed:', error);
      this.extractPageData();
      this.buildSearchIndex();
    }
  },
  
  extractPageData: function() {
    console.log('Extracting page data...');
    
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
    
    console.log('Extracted', this.searchData.length, 'items');
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
    
    console.log('Search index built with', this.searchIndex.length, 'items');
  },
  
  enhanceSearchUI: function() {
    const searchOverlay = document.getElementById("beautifuljekyll-search-overlay");
    if (!searchOverlay) return;
    
    // Hide fallback
    const fallback = searchOverlay.querySelector('.fallback-search');
    if (fallback) {
      fallback.style.display = 'none';
    }
    
    // Create modern search interface
    const modernHTML = `
      <div class="modern-search-container">
        <div class="search-header">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" id="modern-search-input" placeholder="May the Force be with you..." autocomplete="off">
            <div class="search-loading" id="search-loading" style="display: none;">
              <div class="loading-spinner"></div>
            </div>
          </div>
          <button class="search-close" id="modern-search-close" aria-label="Close search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="search-results" id="modern-search-results">
          <div class="search-suggestions">
            <div class="suggestion-item">🌊 Accio! Something is coming to you...</div>
            <div class="suggestion-item">🐋 Reverio! Discover ideas, magics, spells,...</div>
            <div class="suggestion-item">⚡ Quantum teleportation with keyboard shortcuts</div>
          </div>
        </div>
        <div class="search-footer">
          <div class="search-shortcuts">
            <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
            <span><kbd>Enter</kbd> Select</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    `;
    
    searchOverlay.innerHTML = modernHTML;
    console.log('Modern search UI created');
  },
  
  bindEvents: function() {
    const searchInput = document.getElementById('modern-search-input');
    const searchClose = document.getElementById('modern-search-close');
    
    if (!searchInput) {
      console.warn('Search input not found');
      return;
    }
    
    // Search input with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length === 0) {
        this.showSuggestions();
        return;
      }
      
      // Show loading
      const loadingEl = document.getElementById('search-loading');
      if (loadingEl) loadingEl.style.display = 'block';
      
      searchTimeout = setTimeout(() => {
        this.performSearch(query);
        if (loadingEl) loadingEl.style.display = 'none';
      }, 300);
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
    
    // Override search link
    const searchLink = document.getElementById('nav-search-link');
    if (searchLink) {
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSearch();
      });
    }
    
    console.log('Search events bound');
  },
  
  performSearch: function(query) {
    if (!query || query.length < 2) {
      this.showSuggestions();
      return;
    }
    
    const results = this.searchIndex.filter(item => 
      item.searchText.includes(query.toLowerCase())
    ).slice(0, 8);
    
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
          <div class="suggestion-item">🔍 OOPS, no sign of existence for "${query}"</div>
          <div class="suggestion-item">💡 Rephrase the finding spell to reveal it...</div>
        </div>
      `;
      return;
    }
    
    const resultsHTML = results.map((item, index) => `
      <div class="search-result-item" data-index="${index}" data-url="${item.url}">
        <div class="result-title">${this.highlightText(item.title, query)}</div>
        <div class="result-excerpt">${this.highlightText(item.excerpt, query)}</div>
        ${item.date ? `<div class="result-meta">${item.date}</div>` : ''}
      </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
    
    // Add click handlers
    container.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.getAttribute('data-url');
        if (url && url !== '#') {
          window.location.href = url;
        }
      });
    });
  },
  
  highlightText: function(text, query) {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  },
  
  showSuggestions: function() {
    const container = document.getElementById('modern-search-results');
    if (container) {
      container.innerHTML = `
        <div class="search-suggestions">
          <div class="suggestion-item">🌊 Accio! Something is coming to you...</div>
          <div class="suggestion-item">🐋 Reverio! Discover ideas, magics, spells,...</div>
          <div class="suggestion-item">⚡ Quantum teleportation with keyboard shortcuts</div>
        </div>
      `;
    }
  },
  
  navigateResults: function(direction) {
    const items = document.querySelectorAll('.search-result-item');
    if (items.length === 0) return;
    
    // Remove current selection
    if (this.selectedIndex >= 0) {
      items[this.selectedIndex]?.classList.remove('selected');
    }
    
    // Update index
    this.selectedIndex += direction;
    
    if (this.selectedIndex < 0) {
      this.selectedIndex = items.length - 1;
    } else if (this.selectedIndex >= items.length) {
      this.selectedIndex = 0;
    }
    
    // Add selection
    items[this.selectedIndex]?.classList.add('selected');
    items[this.selectedIndex]?.scrollIntoView({ block: 'nearest' });
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
      overlay.style.display = 'block';
      setTimeout(() => {
        input.focus();
        this.showSuggestions();
      }, 100);
      document.body.classList.add('overflow-hidden');
    }
  },
  
  closeSearch: function() {
    const overlay = document.getElementById('beautifuljekyll-search-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      document.body.classList.remove('overflow-hidden');
    }
  }
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('Custom script loading...');
  
  // Initialize search after a short delay
  setTimeout(() => {
    ModernSearch.init();
  }, 500);
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let ticking = false;
    
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            navbar.style.background = 'rgba(30, 58, 95, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
          } else {
            navbar.style.background = '';
            navbar.style.backdropFilter = '';
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', handleScroll);
  }
  
  // Animate posts on scroll
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.post-preview').forEach(post => {
      post.style.opacity = '0';
      post.style.transform = 'translateY(30px)';
      post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(post);
    });
  }
  
  console.log('Custom script initialization complete');
});

// Performance utilities
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