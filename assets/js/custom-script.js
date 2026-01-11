// ====================================
// Modern Dark Portfolio JavaScript
// Intersection Observer • Custom Cursor • Particles
// ====================================

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
          // Optionally unobserve after reveal
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe elements
    const elements = document.querySelectorAll('.post-preview, .glass-card, .bento-item, h2, h3');
    elements.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
    
    console.log('✅ Scroll reveal initialized for', elements.length, 'elements');
  }
};

// ====================================
// 3. Custom Cursor with Trail
// ====================================

const CustomCursor = {
  dot: null,
  outline: null,
  
  init: function() {
    // Only enable on desktop
    if (window.innerWidth < 768 || 'ontouchstart' in window) {
      console.log('⚠️ Custom cursor disabled on mobile/touch devices');
      return;
    }
    
    // Create cursor elements
    this.dot = document.createElement('div');
    this.dot.className = 'custom-cursor-dot';
    
    this.outline = document.createElement('div');
    this.outline.className = 'custom-cursor-outline';
    
    document.body.appendChild(this.dot);
    document.body.appendChild(this.outline);
    document.body.classList.add('custom-cursor');
    
    // Track mouse movement
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Smooth animation
    const animateCursor = () => {
      // Dot follows immediately
      dotX = mouseX;
      dotY = mouseY;
      
      // Outline follows with delay
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      
      this.dot.style.left = `${dotX}px`;
      this.dot.style.top = `${dotY}px`;
      
      this.outline.style.left = `${outlineX - 20}px`;
      this.outline.style.top = `${outlineY - 20}px`;
      
      requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // Expand on hover over links/buttons
    const interactiveElements = 'a, button, .btn-primary, .btn-glow, input, textarea';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches(interactiveElements)) {
        this.outline.classList.add('expand');
        this.dot.style.transform = 'scale(1.5)';
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.matches(interactiveElements)) {
        this.outline.classList.remove('expand');
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
      this.ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
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
          this.ctx.strokeStyle = `rgba(0, 255, 65, ${opacity * 0.2})`;
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
      // Move particle
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x > this.canvas.width || particle.x < 0) {
        particle.speedX *= -1;
      }
      if (particle.y > this.canvas.height || particle.y < 0) {
        particle.speedY *= -1;
      }
      
      // Mouse interaction
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
// 5. Table of Contents Active Section Highlighting
// ====================================

const TOCHighlight = {
  sections: [],
  
  init: function() {
    const toc = document.querySelector('.toc');
    if (!toc) return;
    
    // Get all sections
    const headers = document.querySelectorAll('h2[id], h3[id]');
    this.sections = Array.from(headers);
    
    if (this.sections.length === 0) return;
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const tocLink = document.querySelector(`.toc a[href="#${id}"]`);
        
        if (entry.isIntersecting) {
          // Remove active from all
          document.querySelectorAll('.toc a').forEach(link => {
            link.classList.remove('active');
          });
          
          // Add active to current
          if (tocLink) {
            tocLink.classList.add('active');
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-100px 0px -66% 0px'
    });
    
    // Observe all sections
    this.sections.forEach(section => observer.observe(section));
    
    console.log('✅ TOC highlighting initialized for', this.sections.length, 'sections');
  }
};

// ====================================
// 6. Copy to Clipboard for Code Blocks
// ====================================

const CodeCopy = {
  init: function() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.tagName !== 'PRE') return;
      
      // Make pre clickable
      pre.style.cursor = 'pointer';
      pre.setAttribute('title', 'Click to copy code');
      
      pre.addEventListener('click', async () => {
        const code = codeBlock.textContent;
        
        try {
          await navigator.clipboard.writeText(code);
          
          // Visual feedback
          const originalBefore = window.getComputedStyle(pre, '::before').content;
          pre.style.setProperty('--copy-text', '"Copied!"');
          
          // Change the pseudo-element content
          pre.classList.add('copied');
          
          setTimeout(() => {
            pre.classList.remove('copied');
            pre.style.removeProperty('--copy-text');
          }, 2000);
          
          console.log('✅ Code copied to clipboard');
        } catch (err) {
          console.error('❌ Failed to copy:', err);
        }
      });
    });
    
    // Add CSS for copied state
    const style = document.createElement('style');
    style.textContent = `
      pre.copied::before {
        content: 'Copied!' !important;
        background: var(--accent-green) !important;
        color: var(--bg-primary) !important;
        border-color: var(--accent-green) !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Code copy initialized for', codeBlocks.length, 'blocks');
  }
};

// ====================================
// 7. Image Lightbox
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
    
    // Find all images in articles
    const images = document.querySelectorAll('article img, .post-content img, .content img');
    
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
// 8. Navbar Scroll Effect
// ====================================

const NavbarScroll = {
  init: function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
    
    console.log('✅ Navbar scroll effect initialized');
  }
};

// ====================================
// 9. Calculate Reading Time
// ====================================

const ReadingTime = {
  init: function() {
    const content = document.querySelector('article, .post-content, .content');
    if (!content) return;
    
    const text = content.textContent || content.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    
    // Find or create metadata bar
    let metadataBar = document.querySelector('.metadata-bar');
    
    if (!metadataBar) {
      metadataBar = document.createElement('div');
      metadataBar.className = 'metadata-bar';
      
      // Insert after title or at beginning of content
      const title = document.querySelector('h1');
      if (title && title.parentElement) {
        title.parentElement.insertBefore(metadataBar, title.nextSibling);
      } else {
        content.insertBefore(metadataBar, content.firstChild);
      }
    }
    
    // Add reading time
    const readingTimeHTML = `
      <div class="metadata-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span><strong>${readingTime}</strong> min read</span>
      </div>
    `;
    
    metadataBar.insertAdjacentHTML('beforeend', readingTimeHTML);
    
    console.log(`✅ Reading time calculated: ${readingTime} minutes (${wordCount} words)`);
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
  TOCHighlight.init();
  ReadingTime.init();
  
  // Optional: Custom cursor (desktop only)
  if (window.innerWidth > 768) {
    CustomCursor.init();
  }
  
  // Optional: Particle effect (can be performance-intensive)
  // Uncomment if you want particles:
  // ParticleEffect.init();
  
  console.log('✅ All features initialized');
});

// ====================================
// Utility Functions
// ====================================

// Throttle function
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

// Debounce function
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