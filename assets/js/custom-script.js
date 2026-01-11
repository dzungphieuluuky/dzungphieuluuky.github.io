// ====================================
// Modern Minimal Portfolio Scripts
// Inspired by Anthropic & ThinkingMachines
// ====================================

// Reading Progress Bar
const ReadingProgress = {
  init() {
    if (!document.getElementById('reading-progress')) {
      const bar = document.createElement('div');
      bar.id = 'reading-progress';
      document.body.appendChild(bar);
    }
    
    this.update();
    window.addEventListener('scroll', () => this.update(), { passive: true });
  },
  
  update() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / height) * 100;
    bar.style.width = `${Math.min(progress, 100)}%`;
  }
};

// Scroll Reveal Animation
const ScrollReveal = {
  init() {
    if (!window.IntersectionObserver) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    const elements = document.querySelectorAll('.post-preview, .glass-card, article h2, article h3');
    elements.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }
};

// Custom Cursor (Desktop Only)
const CustomCursor = {
  init() {
    if (window.innerWidth < 768 || 'ontouchstart' in window) return;
    
    this.dot = document.createElement('div');
    this.dot.className = 'custom-cursor-dot';
    document.body.appendChild(this.dot);
    document.body.classList.add('custom-cursor');
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    const animate = () => {
      this.dot.style.left = `${mouseX}px`;
      this.dot.style.top = `${mouseY}px`;
      requestAnimationFrame(animate);
    };
    animate();
    
    const interactive = 'a, button, .btn-primary, .copy-btn, input, textarea';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches(interactive)) {
        this.dot.style.transform = 'scale(1.5)';
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.matches(interactive)) {
        this.dot.style.transform = 'scale(1)';
      }
    });
  }
};

// Code Copy to Clipboard
const CodeCopy = {
  init() {
    const blocks = document.querySelectorAll('pre code');
    
    blocks.forEach((block) => {
      const pre = block.parentElement;
      if (!pre || pre.tagName !== 'PRE') return;
      
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      
      pre.style.position = 'relative';
      pre.appendChild(btn);
      
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        try {
          await navigator.clipboard.writeText(block.textContent);
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          btn.textContent = 'Failed';
          console.error('Copy failed:', err);
        }
      });
    });
  }
};

// Image Lightbox
const ImageLightbox = {
  init() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox-close" aria-label="Close lightbox">×</div>
      <div class="lightbox-content">
        <img src="" alt="">
      </div>
    `;
    document.body.appendChild(this.lightbox);
    
    const images = document.querySelectorAll('article img, .post-content img, main img');
    images.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => this.open(img));
    });
    
    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.close();
      }
    });
  },
  
  open(img) {
    const lightboxImg = this.lightbox.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    this.lightbox.classList.add('active');
    document.body.classList.add('overflow-hidden');
  },
  
  close() {
    this.lightbox.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }
};

// Navbar Scroll Effect
const NavbarScroll = {
  init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 100), { passive: true });
  }
};

// ====================================
// 8. Post Table of Contents (At Start of Post)
// ====================================
const PostTableOfContents = {
  init: function() {
    // Only run on post pages, not on blog listing pages
    const content = document.querySelector('article');
    if (!content) {
      console.log('⚠️ No article found - TOC not initialized (likely a listing page)');
      return;
    }
    
    // Get all headers
    const headers = content.querySelectorAll('h2[id], h3[id]');
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
    
    // Insert TOC at the beginning of content (after h1)
    const h1 = content.querySelector('h1');
    if (h1) {
      h1.insertAdjacentHTML('afterend', tocHTML);
    } else {
      content.insertAdjacentHTML('afterbegin', tocHTML);
    }
    
    console.log('✅ Post table of contents initialized with', headers.length, 'sections');
  }
};

// Reading Time Calculator
const ReadingTime = {
  init() {
    const content = document.querySelector('article, .post-content, main');
    if (!content) return;
    
    const text = content.textContent || content.innerText;
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
        content.insertBefore(metadataBar, content.firstChild);
      }
    }
    
    const existing = metadataBar.querySelector('[data-reading-time]');
    if (!existing) {
      const html = `
        <div class="metadata-item" data-reading-time="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span><strong>${readingTime}</strong> min read</span>
        </div>
      `;
      metadataBar.insertAdjacentHTML('afterbegin', html);
    }
  }
};

// Auto-Number Headers (Add IDs)
const AutoNumbering = {
  init() {
    const content = document.querySelector('article, .post-content, main');
    if (!content) return;
    
    const headers = content.querySelectorAll('h2, h3');
    let h2Count = 0;
    let h3Count = 0;
    
    headers.forEach(header => {
      if (header.classList.contains('subtitle')) return;
      
      if (header.tagName === 'H2') {
        h2Count++;
        h3Count = 0;
        if (!header.id) header.id = `section-${h2Count}`;
      } else if (header.tagName === 'H3') {
        h3Count++;
        if (!header.id) header.id = `section-${h2Count}-${h3Count}`;
      }
    });
  }
};

// Sidebar TOC Highlight on Scroll
const SidebarTOC = {
  init() {
    const toc = document.querySelector('.inline-toc');
    if (!toc) return;
    
    const links = toc.querySelectorAll('a');
    const sections = Array.from(links).map(link => {
      const id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    }).filter(Boolean);
    
    window.addEventListener('scroll', throttle(() => {
      let current = '';
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = section.id;
        }
      });
      
      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, 100), { passive: true });
  }
};

// ====================================
// Main Initialization
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  ReadingProgress.init();
  ScrollReveal.init();
  NavbarScroll.init();
  CodeCopy.init();
  ImageLightbox.init();
  ReadingTime.init();
  AutoNumbering.init();
  PostTableOfContents.init();
  SidebarTOC.init();
  
  if (window.innerWidth > 768) {
    CustomCursor.init();
  }
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
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}