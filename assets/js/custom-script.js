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

// Modern Enhanced Search Functionality
const ModernSearch = {
  searchData: [],
  searchIndex: null,
  currentResults: [],
  selectedIndex: -1,
  
  init: function() {
    // Only initialize if search overlay exists
    if (!document.getElementById("beautifuljekyll-search-overlay")) {
      return;
    }
    
    this.loadSearchData();
    this.enhanceSearchUI();
    this.bindEvents();
    console.log('Modern search initialized');
  },
  
  loadSearchData: async function() {
    try {
      // Try to fetch search data from Jekyll's search corpus (Beautiful Jekyll format)
      const response = await fetch('{{ site.baseurl }}/assets/data/searchcorpus.json');
      if (response.ok) {
        this.searchData = await response.json();
        console.log('Search data loaded:', this.searchData.length, 'items');
      } else {
        console.warn('Search corpus not found, using fallback extraction');
        // Fallback: extract data from current page
        this.extractPageData();
      }
      this.buildSearchIndex();
    } catch (error) {
      console.warn('Search data loading failed, using fallback:', error);
      this.extractPageData();
      this.buildSearchIndex();
    }
  },
  
  extractPageData: function() {
    // Extract searchable content from the current page
    const posts = document.querySelectorAll('.post-preview, article');
    this.searchData = Array.from(posts).map((post, index) => {
      const title = post.querySelector('h2, h1, .post-title')?.textContent?.trim() || `Post ${index + 1}`;
      const content = post.querySelector('.post-content, .post-excerpt, p')?.textContent?.trim() || '';
      const link = post.querySelector('a')?.getAttribute('href') || '#';
      const date = post.querySelector('.post-meta, .post-date')?.textContent?.trim() || '';
      
      return {
        title: title,
        content: content,
        url: link,
        date: date,
        excerpt: content.substring(0, 150) + '...'
      };
    });
  },
  
  buildSearchIndex: function() {
    // Create a simple search index for better performance
    this.searchIndex = this.searchData.map((item, index) => ({
      ...item,
      searchText: (item.title + ' ' + item.content + ' ' + item.date).toLowerCase(),
      index: index
    }));
  },
  
  enhanceSearchUI: function() {
    const searchOverlay = document.getElementById("beautifuljekyll-search-overlay");
    if (!searchOverlay) return;
    
    // Hide fallback search
    const fallback = searchOverlay.querySelector('.fallback-search');
    if (fallback) {
      fallback.style.display = 'none';
    }
    
    // Add modern search HTML
    const modernSearchHTML = `
      <div class="modern-search-container">
        <div class="search-header">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" id="modern-search-input" placeholder="Search posts, content, and more..." autocomplete="off">
            <div class="search-loading" id="search-loading" style="display: none;">
              <div class="loading-spinner"></div>
            </div>
          </div>
          <button class="search-close" id="modern-search-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="search-results" id="modern-search-results">
          <div class="search-suggestions">
            <div class="suggestion-item">Try searching for topics, titles, or keywords</div>
          </div>
        </div>
        <div class="search-footer">
          <div class="search-shortcuts">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>Enter</kbd> Select</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    `;
    
    // Replace content but keep the overlay structure
    searchOverlay.innerHTML = modernSearchHTML;
    
    // Add modern search styles
    this.addSearchStyles();
  },
  
  addSearchStyles: function() {
    const styles = `
      <style id="modern-search-styles">
        #beautifuljekyll-search-overlay {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          animation: fadeIn 0.3s ease;
        }
        
        .modern-search-container {
          max-width: 600px;
          margin: 5% auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }
        
        .search-header {
          display: flex;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e1e5e9;
        }
        
        .search-input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          color: #6b7280;
          z-index: 1;
        }
        
        #modern-search-input {
          width: 100%;
          padding: 15px 50px 15px 50px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          background: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        #modern-search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .search-loading {
          position: absolute;
          right: 15px;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e1e5e9;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .search-close {
          background: none;
          border: none;
          padding: 10px;
          margin-left: 15px;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s ease;
        }
        
        .search-close:hover {
          background: #f1f3f4;
        }
        
        .search-results {
          max-height: 400px;
          overflow-y: auto;
          padding: 10px 0;
        }
        
        .search-result-item {
          padding: 15px 20px;
          border-bottom: 1px solid #f1f3f4;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .search-result-item:hover,
        .search-result-item.selected {
          background: #f8f9ff;
        }
        
        .result-title {
          font-weight: 600;
          font-size: 16px;
          color: #1a202c;
          margin-bottom: 5px;
        }
        
        .result-excerpt {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.4;
        }
        
        .result-meta {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 5px;
        }
        
        .search-suggestions {
          padding: 20px;
          text-align: center;
          color: #6b7280;
        }
        
        .suggestion-item {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          margin: 5px 0;
        }
        
        .search-footer {
          padding: 15px 20px;
          background: #f8f9fa;
          border-top: 1px solid #e1e5e9;
        }
        
        .search-shortcuts {
          display: flex;
          gap: 20px;
          font-size: 12px;
          color: #6b7280;
        }
        
        .search-shortcuts kbd {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 3px;
          padding: 2px 6px;
          font-size: 11px;
          margin: 0 2px;
        }
        
        .highlight {
          background: #fef3c7;
          padding: 1px 2px;
          border-radius: 2px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .modern-search-container {
            margin: 20px;
            max-width: none;
          }
          
          .search-shortcuts {
            flex-direction: column;
            gap: 10px;
          }
        }
      </style>
    `;
    
    if (!document.getElementById('modern-search-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  },
  
  bindEvents: function() {
    const searchInput = document.getElementById('modern-search-input');
    const searchClose = document.getElementById('modern-search-close');
    const searchResults = document.getElementById('modern-search-results');
    
    if (!searchInput) return;
    
    // Input event with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length === 0) {
        this.showSuggestions();
        return;
      }
      
      // Show loading
      const loadingElement = document.getElementById('search-loading');
      if (loadingElement) {
        loadingElement.style.display = 'block';
      }
      
      searchTimeout = setTimeout(() => {
        this.performSearch(query);
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
      }, 300);
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateResults(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateResults(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.selectResult();
      }
    });
    
    // Close button
    if (searchClose) {
      searchClose.addEventListener('click', () => {
        this.closeSearch();
      });
    }
    
    // Override original search link behavior
    const searchLink = document.getElementById('nav-search-link');
    if (searchLink) {
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSearch();
      });
    }
  },
  
  performSearch: function(query) {
    if (!query || query.length < 2) {
      this.showSuggestions();
      return;
    }
    
    const results = this.searchIndex.filter(item => {
      return item.searchText.includes(query.toLowerCase());
    }).slice(0, 10); // Limit to 10 results
    
    this.currentResults = results;
    this.selectedIndex = -1;
    this.displayResults(results, query);
  },
  
  displayResults: function(results, query) {
    const resultsContainer = document.getElementById('modern-search-results');
    if (!resultsContainer) return;
    
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-suggestions">
          <div class="suggestion-item">No results found for "${query}"</div>
          <div class="suggestion-item">Try different keywords or check spelling</div>
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
    
    resultsContainer.innerHTML = resultsHTML;
    
    // Add click handlers
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.getAttribute('data-url');
        if (url && url !== '#') {
          window.location.href = url;
        }
      });
    });
  },
  
  highlightText: function(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  },
  
  showSuggestions: function() {
    const resultsContainer = document.getElementById('modern-search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="search-suggestions">
          <div class="suggestion-item">🔍 Start typing to search posts and content</div>
          <div class="suggestion-item">💡 Try searching for topics, titles, or keywords</div>
          <div class="suggestion-item">⚡ Use keyboard shortcuts to navigate quickly</div>
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
    
    // Update selected index
    this.selectedIndex += direction;
    
    if (this.selectedIndex < 0) {
      this.selectedIndex = items.length - 1;
    } else if (this.selectedIndex >= items.length) {
      this.selectedIndex = 0;
    }
    
    // Add new selection
    items[this.selectedIndex]?.classList.add('selected');
    items[this.selectedIndex]?.scrollIntoView({ block: 'nearest' });
  },
  
  selectResult: function() {
    const selectedItem = document.querySelector('.search-result-item.selected');
    if (selectedItem) {
      selectedItem.click();
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
  console.log('Custom script initializing...');
  
  // Initialize modern search
  setTimeout(() => {
    ModernSearch.init();
  }, 100);

  // Smooth scroll for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
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
  
  // Enhanced navbar scroll effect (only if navbar exists)
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
    }, 16);
    
    window.addEventListener('scroll', handleScroll);
    console.log('Navbar scroll handler added');
  }
  
  // Animate elements on scroll
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe post previews
    const posts = document.querySelectorAll('.post-preview');
    posts.forEach(post => {
      post.style.opacity = '0';
      post.style.transform = 'translateY(30px)';
      post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(post);
    });
    console.log(`Observing ${posts.length} post previews`);
  }
  
  console.log('Custom script initialization complete');
});

// Apply typing effect after page loads
window.addEventListener('load', function() {
  // Apply typing effect to main title
  const mainTitle = document.querySelector('.intro-header h1');
  if (mainTitle && mainTitle.textContent) {
    const originalText = mainTitle.textContent;
    typeWriter(mainTitle, originalText, 80);
    console.log('Typing effect applied to title');
  }
  
  console.log('Page loading complete');
});