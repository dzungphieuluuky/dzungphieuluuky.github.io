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
// Main Initialization
// ====================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing Modern Portfolio...');
  
  // Core features
  ReadingProgress.init();
  ScrollReveal.init();
  NavbarScroll.init();
  CodeCopy.init();
  ImageLightbox.init();
  
  // Post-only features (only run if <article> tag exists)
  ReadingTime.init();
  AutoNumbering.init();
  PostTableOfContents.init();
  
  // Custom cursor (desktop only)
  if (window.innerWidth > 768) {
    CustomCursor.init();
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