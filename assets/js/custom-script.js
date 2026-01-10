// Enhanced Modern Search with Whale Ocean Theme
// Optimized and visually enhanced version
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
    
    console.log('🌊 Initializing Modern Search with Ocean Theme...');
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
    
    // Create modern ocean-themed search interface
    const modernHTML = `
      <style>
        /* Ocean Theme Variables */
        :root {
          --ocean-primary: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          --ocean-secondary: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%);
          --ocean-accent: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          --ocean-text: #0f172a;
          --ocean-text-light: #64748b;
          --ocean-surface: #ffffff;
          --ocean-surface-hover: #f1f5f9;
          --ocean-border: #e2e8f0;
        }

        /* Overlay Backdrop */
        #beautifuljekyll-search-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: none;
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(6, 95, 70, 0.4) 100%);
          backdrop-filter: blur(8px);
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Search Container */
        .modern-search-container {
          position: absolute;
          top: 10vh;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 700px;
          background: var(--ocean-surface);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Decorative Gradient Bar */
        .search-gradient-bar {
          height: 4px;
          background: var(--ocean-primary);
        }

        /* Search Header */
        .search-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid var(--ocean-border);
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: var(--ocean-text-light);
        }

        #modern-search-input {
          width: 100%;
          padding: 14px 48px 14px 48px;
          font-size: 16px;
          border: 2px solid transparent;
          border-radius: 12px;
          background: #f8fafc;
          color: var(--ocean-text);
          outline: none;
          transition: all 0.3s ease;
        }

        #modern-search-input:focus {
          background: var(--ocean-surface);
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }

        #modern-search-input::placeholder {
          color: var(--ocean-text-light);
        }

        .search-loading {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e2e8f0;
          border-top-color: #0ea5e9;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .search-close {
          padding: 8px;
          background: var(--ocean-surface-hover);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--ocean-text-light);
        }

        .search-close:hover {
          background: #e2e8f0;
          color: var(--ocean-text);
          transform: scale(1.05);
        }

        /* Search Results */
        .search-results {
          max-height: 60vh;
          overflow-y: auto;
          padding: 8px;
        }

        .search-results::-webkit-scrollbar {
          width: 8px;
        }

        .search-results::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .search-results::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .search-results::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Suggestions */
        .search-suggestions {
          padding: 16px;
        }

        .suggestion-item {
          padding: 16px;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 12px;
          color: var(--ocean-text);
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .suggestion-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
        }

        /* Result Items */
        .search-result-item {
          padding: 16px;
          margin-bottom: 6px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .search-result-item:hover {
          background: var(--ocean-surface-hover);
          transform: translateX(4px);
        }

        .search-result-item.selected {
          background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
          border-color: #0ea5e9;
          box-shadow: 0 4px 16px rgba(14, 165, 233, 0.2);
          transform: scale(1.02);
        }

        .result-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--ocean-text);
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .result-title::before {
          content: '✨';
          font-size: 14px;
        }

        .result-excerpt {
          font-size: 14px;
          color: var(--ocean-text-light);
          line-height: 1.5;
          margin-bottom: 6px;
        }

        .result-meta {
          font-size: 12px;
          color: #94a3b8;
        }

        .highlight {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 600;
        }

        /* Footer */
        .search-footer {
          padding: 12px 16px;
          background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
          border-top: 1px solid var(--ocean-border);
        }

        .search-shortcuts {
          display: flex;
          justify-content: center;
          gap: 24px;
          font-size: 12px;
          color: var(--ocean-text-light);
        }

        .search-shortcuts span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .key-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: var(--ocean-text);
          background: var(--ocean-surface);
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05), inset 0 -2px 0 rgba(0, 0, 0, 0.05);
          margin: 0 2px;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .modern-search-container {
            top: 5vh;
            width: 95%;
            max-width: none;
          }

          .search-results {
            max-height: 70vh;
          }

          .search-shortcuts {
            flex-wrap: wrap;
            gap: 12px;
          }
        }
      </style>

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
              placeholder="🌊 Accio! Something is coming to you..." 
              autocomplete="off"
              spellcheck="false"
            >
            <div class="search-loading" id="search-loading" style="display: none;">
              <div class="loading-spinner"></div>
            </div>
          </div>
          <button class="search-close" id="modern-search-close" aria-label="Close search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="search-results" id="modern-search-results">
          <div class="search-suggestions">
            <div class="suggestion-item">🌊 Accio! Something is coming to you...</div>
            <div class="suggestion-item">🐋 Reverio! Discover ideas, magics, spells...</div>
            <div class="suggestion-item">⚡ Quantum teleportation with keyboard shortcuts</div>
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
    console.log('✅ Enhanced ocean-themed UI created');
  },
  
  bindEvents: function() {
    const searchInput = document.getElementById('modern-search-input');
    const searchClose = document.getElementById('modern-search-close');
    const overlay = document.getElementById('beautifuljekyll-search-overlay');
    
    if (!searchInput) {
      console.warn('⚠️ Search input not found');
      return;
    }
    
    // Search input with optimized debouncing
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
          <div class="suggestion-item">🔍 OOPS, no sign of existence for "${this.escapeHtml(query)}"</div>
          <div class="suggestion-item">💡 Rephrase the finding spell to reveal it...</div>
          <div class="suggestion-item">🎯 Try different keywords or check for typos</div>
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
          <div class="suggestion-item">🌊 Accio! Something is coming to you...</div>
          <div class="suggestion-item">🐋 Reverio! Discover ideas, magics, spells...</div>
          <div class="suggestion-item">⚡ Quantum teleportation with keyboard shortcuts</div>
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
      overlay.style.display = 'block';
      setTimeout(() => {
        input.focus();
        this.showSuggestions();
      }, 100);
      document.body.style.overflow = 'hidden';
    }
  },
  
  closeSearch: function() {
    const overlay = document.getElementById('beautifuljekyll-search-overlay');
    const input = document.getElementById('modern-search-input');
    
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      
      if (input) {
        input.value = '';
        this.showSuggestions();
      }
    }
  }
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Enhanced search script loading...');
  
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
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
  
  // Enhanced navbar scroll effect with ocean gradient
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let ticking = false;
    
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            navbar.style.background = 'linear-gradient(135deg, rgba(14, 165, 233, 0.95) 0%, rgba(6, 182, 212, 0.95) 100%)';
            navbar.style.backdropFilter = 'blur(12px)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
          } else {
            navbar.style.background = '';
            navbar.style.backdropFilter = '';
            navbar.style.boxShadow = '';
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  // Animate posts on scroll with ocean wave effect
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.post-preview').forEach((post, index) => {
      post.style.opacity = '0';
      post.style.transform = 'translateY(30px)';
      post.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, 
                               transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
      observer.observe(post);
    });
  }
  
  console.log('✅ Enhanced search script initialization complete');
});
