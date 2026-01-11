// ====================================
// 1. Reading Progress Bar
// ====================================

const ReadingProgress = {
  init: function() {
    // Create progress bar if it doesn't exist
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
    
    // Observe elements - fixed selector for post-preview compatibility
    const elements = document.querySelectorAll('.post-preview, .glass-card, .bento-item, article h2, article h3, main h2, main h3');
    elements.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
    
    console.log('✅ Scroll reveal initialized for', elements.length, 'elements');
  }
};

// ====================================
// 3. Custom Cursor with Trail (Dot Only)
// ====================================

const CustomCursor = {
  dot: null,
  
  init: function() {
    // Only enable on desktop
    if (window.innerWidth < 768 || 'ontouchstart' in window) {
      console.log('⚠️ Custom cursor disabled on mobile/touch devices');
      return;
    }
    
    // Create cursor elements
    this.dot = document.createElement('div');
    this.dot.className = 'custom-cursor-dot';
    
    document.body.appendChild(this.dot);
    document.body.classList.add('custom-cursor');
    
    // Track mouse movement
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Smooth animation
    const animateCursor = () => {
      dotX = mouseX;
      dotY = mouseY;
      
      this.dot.style.left = `${dotX}px`;
      this.dot.style.top = `${dotY}px`;
      
      requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // Scale on hover over links/buttons - fixed selector
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
// 4. Particle Canvas Effect
// ====================================

const ParticleEffect = {
  canvas: null,
  ctx: null,
  particles: [],
  mouse: { x: null, y: null, radius: 150 },
  
  init: function() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    
    // Create particles
    this.createParticles();
    
    // Track mouse
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
    
    window.addEventListener('resize', () => this.resize());
    
    // Start animation
    this.animate();
    
    console.log('✅ Particle effect initialized');
  },
  
  resize: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },
  
  createParticles: function() {
    const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    
    for (let i = 0; i < numberOfParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        baseX: null,
        baseY: null,
        density: Math.random() * 30 + 1
      });
    }
    
    // Set base positions
    this.particles.forEach(particle => {
      particle.baseX = particle.x;
      particle.baseY = particle.y;
    });
  },
  
  drawParticles: function() {
    this.particles.forEach(particle => {
      // Updated color to match custom-styles.css accent-teal
      this.ctx.fillStyle = 'rgba(42, 157, 143, 0.3)';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fill();
    });
  },
  
  connectParticles: function() {
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a + 1; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const opacity = 1 - (distance / 100);
          this.ctx.strokeStyle = `rgba(42, 157, 143, ${opacity * 0.15})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
          this.ctx.stroke();
        }
      }
    }
  },
  
  moveParticles: function() {
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x > this.canvas.width || particle.x < 0) {
        particle.speedX *= -1;
      }
      if (particle.y > this.canvas.height || particle.y < 0) {
        particle.speedY *= -1;
      }
      
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = this.mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * particle.density * 0.5;
          const directionY = forceDirectionY * force * particle.density * 0.5;
          
          particle.x -= directionX;
          particle.y -= directionY;
        }
      }
    });
  },
  
  animate: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.moveParticles();
    this.drawParticles();
    this.connectParticles();
    
    requestAnimationFrame(() => this.animate());
  }
};

// ====================================
// 5. Copy to Clipboard for Code Blocks
// ====================================

const CodeCopy = {
  init: function() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.tagName !== 'PRE') return;
      
      // Create copy button
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
// 6. Image Lightbox
// ====================================

const ImageLightbox = {
  lightbox: null,
  
  init: function() {
    // Create lightbox HTML
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
    
    // Find all images in articles - improved selector
    const images = document.querySelectorAll('article img, .post-content img, .content img, main img');
    
    images.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => this.open(img));
    });
    
    // Close handlers
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
// 7. Navbar Scroll Effect
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
// 8. Post Table of Contents (At Start of Post)
// ====================================

const PostTableOfContents = {
  init: function() {
    const content = document.querySelector('article, .post-content, .content, main');
    if (!content) return;
    
    // Get all headers
    const headers = content.querySelectorAll('h2[id], h3[id]');
    if (headers.length < 2) return;
    
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
    
    // Insert TOC at the beginning of content
    const firstHeading = content.querySelector('h2, h3');
    if (firstHeading) {
      firstHeading.insertAdjacentHTML('beforebegin', tocHTML);
    } else {
      content.insertAdjacentHTML('afterbegin', tocHTML);
    }
    
    console.log('✅ Post table of contents initialized with', headers.length, 'sections');
  }
};

// ====================================
// 9. Calculate Reading Time & Add to Post
// ====================================

const ReadingTime = {
  init: function() {
    const content = document.querySelector('article, .post-content, .content, main');
    if (!content) return;
    
    const text = content.textContent || content.innerText;
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
        content.insertBefore(metadataBar, content.firstChild);
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
// 10. Auto-Numbering Headers (Post Pages Only)
// ====================================

const AutoNumbering = {
  init: function() {
    const content = document.querySelector('article, .post-content, .content, main');
    if (!content) return;
    
    const headers = content.querySelectorAll('h2, h3');
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
  ReadingTime.init();
  AutoNumbering.init();
  PostTableOfContents.init();
  
  // Custom cursor (desktop only)
  if (window.innerWidth > 768) {
    CustomCursor.init();
  }
  
  // Optional: Particle effect
  // Uncomment if you want particles:
  // ParticleEffect.init();
  
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

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}