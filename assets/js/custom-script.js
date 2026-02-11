// ====================================
// 0. Enable Transitions on First Interaction
// ====================================

const InteractionManager = {
  initialized: false,
  
  init: function() {
    if (this.initialized) return;
    
    // Enable transitions on first user interaction
    const enableInteractiveMode = () => {
      if (!document.body.classList.contains('user-interactive')) {
        document.body.classList.add('user-interactive');
        this.initialized = true;
      }
    };
    
    // Listen for interactions
    document.addEventListener('click', enableInteractiveMode, { once: true, passive: true });
    document.addEventListener('mousemove', enableInteractiveMode, { once: true, passive: true });
    document.addEventListener('scroll', enableInteractiveMode, { once: true, passive: true });
    document.addEventListener('keydown', enableInteractiveMode, { once: true, passive: true });
  }
};

// ====================================
// 1. Reading Progress Bar (NO ANIMATION)
// ====================================

const ReadingProgress = {
  init: function() {
    if (!document.getElementById('reading-progress')) {
      const progressBar = document.createElement('div');
      progressBar.id = 'reading-progress';
      document.body.appendChild(progressBar);
    }
    
    this.updateProgress();
    window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
  },
  
  updateProgress: function() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
};

// ====================================
// 2. Code Copy to Clipboard
// ====================================

const CodeCopy = {
  init: function() {
    const codeBlocks = document.querySelectorAll('pre code');
    if (codeBlocks.length === 0) return;
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.tagName !== 'PRE') return;
      
      if (pre.querySelector('.copy-btn')) return;
      
      const meta = document.createElement('div');
      meta.className = 'code-meta';
      const lang = (codeBlock.className.match(/language-([^\s]+)/) || [])[1];
      meta.textContent = lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : '';
      pre.appendChild(meta);
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('type', 'button');
      pre.appendChild(copyBtn);
      
      copyBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const code = codeBlock.textContent;
        
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 1500);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    });
  }
};

// ====================================
// 3. Image Lightbox (Lazy Init)
// ====================================

const ImageLightbox = {
  lightbox: null,
  
  init: function() {
    const images = document.querySelectorAll('article img, .post-content img, main img');
    if (images.length === 0) return;
    
    this.createLightbox();
    
    images.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => this.open(img), { once: false });
    });
  },
  
  createLightbox: function() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox-close">×</div>
      <div class="lightbox-content">
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(this.lightbox);
    
    const closeBtn = this.lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => this.close());
    
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.close();
      }
    });
  },
  
  open: function(img) {
    const lightboxImg = this.lightbox.querySelector('img');
    const caption = this.lightbox.querySelector('.lightbox-caption');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    caption.textContent = img.alt || '';
    
    this.lightbox.classList.add('active');
    document.body.classList.add('overflow-hidden');
  },
  
  close: function() {
    this.lightbox.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }
};

// ====================================
// 4. Navbar Scroll Effect (Optimized)
// ====================================

const NavbarScroll = {
  lastScrollY: 0,
  
  init: function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 100;
          navbar.classList.toggle('scrolled', scrolled);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
};

// ====================================
// 5. Post Table of Contents
// ====================================

const PostTableOfContents = {
  init: function() {
    const article = document.querySelector('article');
    if (!article) return;
    
    const headers = article.querySelectorAll('h2[id], h3[id]');
    if (headers.length < 2) return;
    
    let tocHTML = '<div class="post-toc-box"><details open><summary>▼ Table of Contents</summary><ul class="post-toc-list">';
    let currentH2 = null;
    
    headers.forEach((header) => {
      const id = header.getAttribute('id');
      const text = header.textContent.replace(/^\d+\.?\s*/, '').trim();
      const tag = header.tagName;
      
      if (tag === 'H2') {
        if (currentH2 !== null) tocHTML += '</ul></li>';
        tocHTML += '<li><a href="#' + id + '">' + text + '</a><ul>';
        currentH2 = id;
      } else if (tag === 'H3') {
        tocHTML += '<li><a href="#' + id + '">' + text + '</a></li>';
      }
    });
    
    if (currentH2 !== null) tocHTML += '</ul></li>';
    tocHTML += '</ul></details></div>';
    
    article.insertAdjacentHTML('afterbegin', tocHTML);
  }
};

// ====================================
// 6. Reading Time Calculation
// ====================================

const ReadingTime = {
  init: function() {
    const article = document.querySelector('article');
    if (!article) return;
    
    const text = article.textContent || article.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    let metadataBar = document.querySelector('.metadata-bar');
    
    if (!metadataBar) {
      metadataBar = document.createElement('div');
      metadataBar.className = 'metadata-bar';
      
      const title = document.querySelector('h1');
      if (title && title.parentElement) {
        title.parentElement.insertBefore(metadataBar, title.nextSibling);
      } else {
        article.insertBefore(metadataBar, article.firstChild);
      }
    }
    
    const existingReadingTime = metadataBar.querySelector('[data-reading-time]');
    if (!existingReadingTime) {
      const readingTimeHTML = `
        <div class="metadata-item" data-reading-time="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Estimated Reading Time: <strong>${readingTime}</strong> min</span>
        </div>
      `;
      metadataBar.insertAdjacentHTML('afterbegin', readingTimeHTML);
    }
  }
};

// ====================================
// 7. Auto-Numbering Headers
// ====================================

const AutoNumbering = {
  init: function() {
    const article = document.querySelector('article');
    if (!article) return;
    
    const headers = article.querySelectorAll('h2, h3');
    if (headers.length === 0) return;
    
    let h2Count = 0;
    let h3Count = 0;
    
    headers.forEach(header => {
      if (header.classList.contains('subtitle')) return;
      
      if (header.tagName === 'H2') {
        h2Count++;
        h3Count = 0;
        if (!header.id) header.id = 'section-' + h2Count;
      } else if (header.tagName === 'H3') {
        h3Count++;
        if (!header.id) header.id = 'section-' + h2Count + '-' + h3Count;
      }
    });
  }
};

// ====================================
// 8. Enhanced Search Modal
// ====================================

const EnhancedSearch = {
  searchInput: null,
  searchResults: null,
  searchModal: null,
  searchTrigger: null,
  allResults: [],
  selectedIndex: -1,
  corpusCache: null,
  
  init: function() {
    this.searchInput = document.querySelector('.search-input');
    this.searchResults = document.querySelector('.search-results');
    this.searchModal = document.getElementById('search-modal');
    this.searchTrigger = document.getElementById('search-trigger');
    
    if (!this.searchInput || !this.searchResults || !this.searchModal || !this.searchTrigger) {
      return;
    }
    
    this.preloadCorpus();
    
    this.searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.openModal();
    });
    
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
    this.searchInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    document.addEventListener('click', (e) => this.handleClickOutside(e));
    document.querySelector('.search-modal-close')?.addEventListener('click', () => this.closeModal());
    
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openModal();
      }
    });
  },
  
  preloadCorpus: async function() {
    try {
      const baseurl = document.querySelector('meta[name="baseurl"]')?.content || '';
      const response = await fetch(baseurl + '/assets/data/searchcorpus.json');
      if (response.ok) {
        this.corpusCache = await response.json();
      }
    } catch (err) {
      console.warn('Could not preload search corpus:', err);
    }
  },
  
  openModal: function() {
    this.searchModal.classList.add('active');
    this.searchInput.focus();
  },
  
  closeModal: function() {
    this.searchModal.classList.remove('active');
    this.searchInput.value = '';
    this.searchResults.classList.remove('active');
    this.allResults = [];
    this.selectedIndex = -1;
  },
  
  handleSearch: function(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      this.searchResults.classList.remove('active');
      this.allResults = [];
      this.selectedIndex = -1;
      return;
    }
    
    if (!this.corpusCache) {
      this.searchResults.innerHTML = '<div class="search-no-results">Search unavailable</div>';
      return;
    }
    
    this.allResults = this.corpusCache.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    ).slice(0, 10);
    
    this.selectedIndex = -1;
    this.renderResults();
    this.searchResults.classList.add('active');
  },

  renderResults: function() {
    if (this.allResults.length === 0) {
      this.searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      return;
    }
    
    let html = '';
    this.allResults.forEach((result, index) => {
      const isSelected = index === this.selectedIndex ? 'selected' : '';
      html += `
        <div class="search-result-item ${isSelected}" data-index="${index}">
          <div class="search-result-title">${this.escapeHtml(result.title)}</div>
          <div class="search-result-excerpt">${this.escapeHtml(result.excerpt)}</div>
          ${result.category ? `
            <div class="search-result-tags">
              ${result.category.split(',').slice(0, 2).map(tag => `
                <span class="search-result-category">${this.escapeHtml(tag.trim())}</span>
              `).join('')}
            </div>
          ` : ''}
          <a href="${result.url}" class="search-result-link"></a>
        </div>
      `;
    });
    
    this.searchResults.innerHTML = html;
    this.attachResultClickListeners();
  },
  
  attachResultClickListeners: function() {
    const items = this.searchResults.querySelectorAll('.search-result-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.selectResult(index);
      });
      
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = parseInt(item.dataset.index);
        this.updateSelection();
      });
    });
  },
  
  handleKeyboard: function(e) {
    if (this.allResults.length === 0) return;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.allResults.length - 1);
        this.updateSelection();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateSelection();
        break;
        
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectResult(this.selectedIndex);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        this.closeModal();
        break;
    }
  },
  
  updateSelection: function() {
    const items = this.searchResults.querySelectorAll('.search-result-item');
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  },
  
  selectResult: function(index) {
    if (index >= 0 && index < this.allResults.length) {
      const result = this.allResults[index];
      this.closeModal();
      window.location.href = result.url;
    }
  },
  
  handleClickOutside: function(e) {
    if (e.target === this.searchModal) {
      this.closeModal();
    }
  },
  
  escapeHtml: function(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
};

const PostPreviewClick = {
  init: function() {
    const previews = document.querySelectorAll('.post-preview');
    if (previews.length === 0) return;
    
    previews.forEach(preview => {
      const link = preview.querySelector('a');
      if (link) {
        preview.addEventListener('click', () => {
          window.location.href = link.href;
        });
      }
    });
  }
};

// ====================================
// Main Initialization
// ====================================

document.addEventListener('DOMContentLoaded', function() {
  // Enable transitions on interaction
  InteractionManager.init();
  
  // Initialize all modules
  ReadingProgress.init();
  NavbarScroll.init();
  CodeCopy.init();
  ImageLightbox.init();
  EnhancedSearch.init();
  PostPreviewClick.init();
  
  // Post-only features
  ReadingTime.init();
  AutoNumbering.init();
  PostTableOfContents.init();

  // Mermaid support
  document.querySelectorAll('pre > code.language-mermaid').forEach(function(codeBlock) {
    const pre = codeBlock.parentElement;
    const mermaidCode = codeBlock.textContent;
    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.textContent = mermaidCode;
    pre.parentNode.replaceChild(mermaidDiv, pre);
  });

  if (window.mermaid) {
    mermaid.init(undefined, document.querySelectorAll('.mermaid'));
  }
});