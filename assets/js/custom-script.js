// ====================================
// 1. Reading Progress Bar
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
// 2. Intersection Observer (Fade-Up Animation)
// ====================================

const ScrollReveal = {
  init: function() {
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver not supported');
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    const elements = document.querySelectorAll('.post-preview, .glass-card, .bento-item, article h2, article h3, main h2, main h3');
    elements.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
    
    console.log('✅ Scroll reveal initialized for', elements.length, 'elements');
  }
};

// ====================================
// 3. Custom Cursor (Desktop Only)
// ====================================

const CustomCursor = {
  dot: null,
  
  init: function() {
    if (window.innerWidth < 768 || 'ontouchstart' in window) {
      console.log('⚠️ Custom cursor disabled on mobile/touch devices');
      return;
    }
    
    this.dot = document.createElement('div');
    this.dot.className = 'custom-cursor-dot';
    
    document.body.appendChild(this.dot);
    document.body.classList.add('custom-cursor');
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    const animateCursor = () => {
      dotX = mouseX;
      dotY = mouseY;
      
      this.dot.style.left = `${dotX}px`;
      this.dot.style.top = `${dotY}px`;
      
      requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    const interactiveElements = 'a, button, .btn-primary, .btn-glow, .copy-btn, input, textarea, .search-input';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches(interactiveElements)) {
        this.dot.style.transform = 'scale(1.5)';
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.matches(interactiveElements)) {
        this.dot.style.transform = 'scale(1)';
      }
    });
    
    console.log('✅ Custom cursor initialized');
  }
};

// ====================================
// 4. Code Copy to Clipboard
// ====================================

const CodeCopy = {
  init: function() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.tagName !== 'PRE') return;
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('title', 'Copy code to clipboard');
      
      pre.style.position = 'relative';
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
          }, 2000);
          
          console.log('✅ Code copied to clipboard');
        } catch (err) {
          console.error('❌ Failed to copy:', err);
          copyBtn.textContent = 'Failed';
        }
      });
    });
    
    console.log('✅ Code copy initialized for', codeBlocks.length, 'blocks');
  }
};

// ====================================
// 5. Image Lightbox
// ====================================

const ImageLightbox = {
  lightbox: null,
  
  init: function() {
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
    
    const images = document.querySelectorAll('article img, .post-content img, .content img, main img');
    
    images.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => this.open(img));
    });
    
    const closeBtn = this.lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => this.close());
    
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.close();
      }
    });
    
    console.log('✅ Image lightbox initialized for', images.length, 'images');
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
// 6. Navbar Scroll Effect
// ====================================

const NavbarScroll = {
  init: function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(() => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, 50), { passive: true });
    
    console.log('✅ Navbar scroll effect initialized');
  }
};

// ====================================
// 7. Post Table of Contents (At Start of Post Only)
// ====================================

const PostTableOfContents = {
  init: function() {
    // IMPORTANT: Only run on actual post pages with <article> tag
    const article = document.querySelector('article');
    if (!article) {
      console.log('⚠️ No article tag found - skipping TOC (likely a listing page)');
      return;
    }
    
    // Get all headers within the article
    const headers = article.querySelectorAll('h2[id], h3[id]');
    if (headers.length < 2) {
      console.log('⚠️ Not enough headers for TOC');
      return;
    }
    
    // Build TOC HTML
    let tocHTML = '<div class="post-toc-box">';
    tocHTML += '<details open>';
    tocHTML += '<summary>▼ Table of Contents</summary>';
    tocHTML += '<ul class="post-toc-list">';
    
    let currentH2 = null;
    
    headers.forEach((header) => {
      const id = header.getAttribute('id');
      const text = header.textContent.replace(/^\d+\.?\s*/, '').trim();
      const tag = header.tagName;
      
      if (tag === 'H2') {
        if (currentH2 !== null) {
          tocHTML += '</ul></li>';
        }
        tocHTML += '<li><a href="#' + id + '">' + text + '</a><ul>';
        currentH2 = id;
      } else if (tag === 'H3') {
        tocHTML += '<li><a href="#' + id + '">' + text + '</a></li>';
      }
    });
    
    if (currentH2 !== null) {
      tocHTML += '</ul></li>';
    }
    tocHTML += '</ul>';
    tocHTML += '</details>';
    tocHTML += '</div>';
    
    // Insert TOC after H1 (inside article)
    article.insertAdjacentHTML('afterbegin', tocHTML);
    
    console.log('✅ Post table of contents initialized with', headers.length, 'sections');
  }
};

// ====================================
// 8. Calculate Reading Time
// ====================================

const ReadingTime = {
  init: function() {
    // Only run on post pages
    const article = document.querySelector('article');
    if (!article) {
      console.log('⚠️ No article found - skipping reading time');
      return;
    }
    
    const text = article.textContent || article.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Find or create metadata bar
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
    
    // Check if reading time already exists
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
    
    console.log(`✅ Reading time calculated: ${readingTime} minutes (${wordCount} words)`);
  }
};

// ====================================
// 9. Auto-Numbering Headers (Post Pages Only)
// ====================================

const AutoNumbering = {
  init: function() {
    // Only run on post pages
    const article = document.querySelector('article');
    if (!article) {
      console.log('⚠️ No article found - skipping auto-numbering');
      return;
    }
    
    const headers = article.querySelectorAll('h2, h3');
    let h2Count = 0;
    let h3Count = 0;
    
    headers.forEach(header => {
      // Skip subtitles
      if (header.classList.contains('subtitle')) return;
      
      if (header.tagName === 'H2') {
        h2Count++;
        h3Count = 0;
        
        if (!header.id) {
          header.id = 'section-' + h2Count;
        }
      } else if (header.tagName === 'H3') {
        h3Count++;
        
        if (!header.id) {
          header.id = 'section-' + h2Count + '-' + h3Count;
        }
      }
    });
    
    console.log('✅ Auto-numbering initialized for', headers.length, 'headers');
  }
};

// ====================================
// 10. Enhanced Search with Keyboard Navigation (Modal Version)
// ====================================

const EnhancedSearch = {
  searchInput: null,
  searchResults: null,
  searchModal: null,
  searchTrigger: null,
  allResults: [],
  selectedIndex: -1,
  
  init: function() {
    this.searchInput = document.querySelector('.search-input');
    this.searchResults = document.querySelector('.search-results');
    this.searchModal = document.getElementById('search-modal');
    this.searchTrigger = document.getElementById('search-trigger');
    
    if (!this.searchInput || !this.searchResults || !this.searchModal || !this.searchTrigger) {
      console.log('⚠️ Search elements not found');
      return;
    }
    
    // Event listeners for trigger button
    this.searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.openModal();
    });
    
    // Event listeners for search input
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
    this.searchInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Close modal handlers
    document.addEventListener('click', (e) => this.handleClickOutside(e));
    document.querySelector('.search-modal-close').addEventListener('click', () => this.closeModal());
    
    // Keyboard shortcut to open search (Ctrl/Cmd + K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openModal();
      }
    });
    
    console.log('✅ Enhanced search initialized (Modal)');
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
  
  handleSearch: async function(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      this.searchResults.classList.remove('active');
      this.allResults = [];
      this.selectedIndex = -1;
      return;
    }
    
    try {
      const baseurl = document.querySelector('meta[name="baseurl"]')?.content || '';
      const response = await fetch(baseurl + '/assets/data/searchcorpus.json');
      
      if (!response.ok) {
        console.warn('⚠️ Search corpus not found');
        return;
      }
      
      const data = await response.json();
      
      // Updated filter to match your JSON structure
      this.allResults = data.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      ).slice(0, 10);
      
      this.selectedIndex = -1;
      this.renderResults();
      this.searchResults.classList.add('active');
    } catch (err) {
      console.error('❌ Search error:', err);
      this.searchResults.innerHTML = '<div class="search-no-results">Search unavailable</div>';
    }
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

// ====================================
// Main Initialization (Updated)
// ====================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing Modern Portfolio...');
  
  // Core features
  ReadingProgress.init();
  ScrollReveal.init();
  NavbarScroll.init();
  CodeCopy.init();
  ImageLightbox.init();
  EnhancedSearch.init();
  
  // Post-only features
  ReadingTime.init();
  AutoNumbering.init();
  PostTableOfContents.init();
  
  // Custom cursor (desktop only)
  if (window.innerWidth > 768) {
    CustomCursor.init();
  }

  // Convert <pre><code class="language-mermaid">...</code></pre> to <div class="mermaid">...</div>
  document.querySelectorAll('pre > code.language-mermaid').forEach(function(codeBlock) {
    const pre = codeBlock.parentElement;
    const mermaidCode = codeBlock.textContent;
    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.textContent = mermaidCode;
    pre.parentNode.replaceChild(mermaidDiv, pre);
  });

  // If mermaid is loaded, initialize (optional, if not already done elsewhere)
  if (window.mermaid) {
    mermaid.init(undefined, document.querySelectorAll('.mermaid'));
  }

  console.log('✅ All features initialized');
});

// ====================================
// Utility Functions
// ====================================

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

(function(){
  // attach copy buttons to code blocks
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('pre > code').forEach(function(codeEl){
      var pre = codeEl.parentNode;
      if (pre.querySelector('.copy-btn')) return;
      // add meta label from language class (language-python => Python)
      var meta = document.createElement('div');
      meta.className = 'code-meta';
      var lang = (codeEl.className.match(/language-([^\s]+)/)||[])[1] || '';
      meta.textContent = lang ? lang.replace(/(^\w)/, function(m){return m.toUpperCase();}) : '';
      pre.appendChild(meta);
      // add button
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.innerHTML = 'Copy';
      pre.appendChild(btn);
      btn.addEventListener('click', function(){
        var text = codeEl.innerText.replace(/\u00A0/g,' ');
        navigator.clipboard?.writeText(text).then(function(){
          btn.classList.add('copied');
          btn.innerHTML = 'Copied';
          setTimeout(function(){ btn.classList.remove('copied'); btn.innerHTML = 'Copy'; }, 1800);
        }).catch(function(){
          // fallback: select + execCommand
          var range = document.createRange();
          range.selectNodeContents(codeEl);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          try { document.execCommand('copy'); btn.innerHTML = 'Copied'; setTimeout(()=>btn.innerHTML='Copy',1500); } catch(e){ btn.innerHTML='Copy'; }
          sel.removeAllRanges();
        });
      });
    });
    // Prism highlight (if Prism loaded)
    if (window.Prism) Prism.highlightAll();
  });
})();



