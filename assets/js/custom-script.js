// ====================================
// 0. CENTRALIZED CONFIGURATION
// Performance, accessibility, and behavior constants
// ==================================== 

const CONFIG = {
  // Performance
  WORDS_PER_MINUTE: 238,
  SCROLL_TO_TOP_THRESHOLD: 380,
  NAVBAR_HEIGHT: 58,
  TOC_ITEM_MARGIN: 40,
  
  // Accessibility
  FOCUS_TRAP_ENABLED: true,
  ANNOUNCE_TO_SCREEN_READERS: true,
  
  // Search
  SEARCH_MAX_RESULTS: 8,
  SEARCH_TRENDING_COUNT: 6,
  SEARCH_CORPUS_LAZY_LOAD: true,
  
  // Tooltips & Previews
  TOOLTIP_OFFSET: 8,
  LINK_PREVIEW_TIMEOUT: 5000,
  LINK_PREVIEW_DEBOUNCE: 300,
  
  // Animations
  ANIMATION_DURATION_FAST: 150,
  ANIMATION_DURATION_NORMAL: 300,
  ANIMATION_DURATION_SLOW: 500,
  
  // Theme
  THEME_STORAGE_KEY: 'sjbz-theme-preference',
  PREFER_DARK_MEDIA: '(prefers-color-scheme: dark)'
};

// ====================================
// 0.1 Dark Mode / Light Mode Toggle
// Handles system theme detection, localStorage persistence, and smooth transitions
// ====================================

const DarkMode = {
  isDark: false,
  toggleBtn: null,
  mediaQuery: null,

  init() {
    // Detect system preference or load stored preference
    const stored = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
    
    if (stored) {
      this.isDark = stored === 'dark';
    } else {
      // Use system preference as default
      this.mediaQuery = window.matchMedia(CONFIG.PREFER_DARK_MEDIA);
      this.isDark = this.mediaQuery.matches;
      
      // Listen for system theme changes
      if (this.mediaQuery.addEventListener) {
        this.mediaQuery.addEventListener('change', (e) => {
          if (!localStorage.getItem(CONFIG.THEME_STORAGE_KEY)) {
            this.setTheme(e.matches);
          }
        });
      }
    }

    // Apply theme immediately (prevents FOUC - flash of unstyled content)
    this.applyTheme();

    // Find or create toggle button in navbar
    this._setupToggleButton();
  },

  _setupToggleButton() {
    // Select the existing theme toggle button in navbar
    this.toggleBtn = document.querySelector('#theme-toggle');
    
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
      this._updateToggleState();
    }
  },

  _updateToggleState() {
    if (!this.toggleBtn) return;
    
    this.toggleBtn.setAttribute('aria-label', this.isDark ? 'Switch to light mode' : 'Switch to dark mode');
    this.toggleBtn.setAttribute('aria-pressed', this.isDark.toString());
    
    // Add rotation animation to icons
    const icons = this.toggleBtn.querySelectorAll('svg');
    icons.forEach((icon) => {
      icon.classList.add('icon-rotate');
      setTimeout(() => icon.classList.remove('icon-rotate'), 300);
    });
  },

  /**
   * Apply theme to document
   */
  applyTheme() {
    const root = document.documentElement;
    
    if (this.isDark) {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  },

  /**
   * Toggle between dark and light mode
   */
  toggle() {
    this.setTheme(!this.isDark);
  },

  /**
   * Set theme to specific mode
   * @param {boolean} isDark - true for dark mode, false for light mode
   */
  setTheme(isDark) {
    this.isDark = isDark;
    
    // Persist preference
    localStorage.setItem(CONFIG.THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    
    // Apply theme with smooth transition
    if (window.anime) {
      // Fade transition using anime.js
      anime.to(document.documentElement, {
        opacity: [1, 0.7, 1],
        duration: CONFIG.ANIMATION_DURATION_FAST,
        easing: 'easeInOutQuad',
        begin: () => this.applyTheme(),
      });
    } else {
      // Immediate transition if anime.js not available
      this.applyTheme();
    }

    // Update toggle button state
    this._updateToggleState();

    // Announce to screen readers
    if (CONFIG.ANNOUNCE_TO_SCREEN_READERS) {
      const announcement = isDark ? 'Switched to dark mode' : 'Switched to light mode';
      this._announceToScreenReader(announcement);
    }
    
    // Dispatch custom event for other modules to listen to
    document.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { isDark, theme: isDark ? 'dark' : 'light' } 
    }));
  },

  /**
   * Announce theme change to screen readers
   */
  _announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => announcement.remove(), 1000);
  }
};

// Apply initial theme as early as possible to prevent flash
(() => {
  const stored = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
  const isDark = stored ? stored === 'dark' : window.matchMedia(CONFIG.PREFER_DARK_MEDIA).matches;
  const root = document.documentElement;
  
  if (isDark) {
    root.classList.add('dark-mode');
  } else {
    root.classList.add('light-mode');
  }
})();

// ====================================
// 1. Enable Transitions on First Interaction
// Defers CSS animations until the user interacts with the page.
// This eliminates unnecessary animations on page load.
// ====================================

const InteractionManager = {
  initialized: false,

  init() {
    if (this.initialized) return;
    const body = document.body;
    const enable = () => {
      if (!body.classList.contains('user-interactive')) {
        body.classList.add('user-interactive');
        this.initialized = true;
        // Remove listeners after initialization
        (listener) => {
          ['click', 'mousemove', 'scroll', 'keydown'].forEach((evt) =>
            document.removeEventListener(evt, listener, { passive: true })
          );
        };
      }
    };
    ['click', 'mousemove', 'scroll', 'keydown'].forEach((evt) =>
      document.addEventListener(evt, enable, { once: true, passive: true })
    );
  }
};

// ====================================
// 1. Reading Progress Bar
// Enhanced with anime.js for smooth easing animations
// ====================================

const ReadingProgress = {
  bar: null,
  currentRatio: 0,
  cachedTotal: 0,

  init() {
    this.bar = document.getElementById('reading-progress');
    if (!this.bar) {
      this.bar = document.createElement('div');
      this.bar.id = 'reading-progress';
      document.body.appendChild(this.bar);
    }
    this._updateCachedDimensions();
    this.update();
    // Update cache on resize (debounced via unified RAF)
    window.addEventListener('resize', () => this._updateCachedDimensions(), { passive: true });
  },

  _updateCachedDimensions() {
    // Cache these expensive DOM reads; they rarely change mid-scroll
    this.cachedTotal = document.documentElement.scrollHeight - window.innerHeight;
  },

  update() {
    if (!this.bar || !window.anime) return;
    // Use cached dimensions instead of reading DOM on every scroll
    const ratio = this.cachedTotal > 0 ? Math.min(window.scrollY / this.cachedTotal, 1) : 0;
    
    // Only animate if ratio has changed significantly (prevents layout thrashing)
    if (Math.abs(ratio - this.currentRatio) > 0.01) {
      anime.to(this.bar, {
        scaleX: ratio,
        duration: 300,
        easing: 'easeOutQuad'
      });
      this.currentRatio = ratio;
    }
  }
};

// ====================================
// 2. Scroll-To-Top Button
// Enhanced with anime.js pop-in and fade animations
// ====================================

const ScrollToTop = {
  btn: null,
  THRESHOLD: CONFIG.SCROLL_TO_TOP_THRESHOLD,
  isVisible: false,

  init() {
    this.btn = document.createElement('button');
    this.btn.id = 'scroll-to-top';
    this.btn.setAttribute('aria-label', 'Scroll to top');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z');
    svg.appendChild(path);
    this.btn.appendChild(svg);
    document.body.appendChild(this.btn);

    this.btn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  },

  toggle() {
    if (!this.btn) return;
    const shouldBeVisible = window.scrollY > this.THRESHOLD;
    
    if (shouldBeVisible && !this.isVisible) {
      this.isVisible = true;
      // Use CSS transitions instead of anime.js for simple visibility toggle
      // This offloads animation to GPU and is more performant
      this.btn.classList.add('visible');
    } else if (!shouldBeVisible && this.isVisible) {
      this.isVisible = false;
      this.btn.classList.remove('visible');
    }
  }
};

// ====================================
// 3. Smooth Anchor Navigation
// Handles hash links with respect to navbar height and smooth scrolling.
// ====================================

const SmoothAnchors = {
  navbarHeight: 58,

  init() {
    // Cache navbar height on init for better performance
    this.navbarHeight = Math.max(
      58,
      parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height') || '58',
        10
      )
    );

    document.addEventListener('click', (e) => this.handleAnchorClick(e), false);
  },

  handleAnchorClick(e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id = decodeURIComponent(anchor.getAttribute('href').slice(1));
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - this.navbarHeight - 16,
      behavior: 'smooth'
    });
    // Update URL without triggering navigation
    history.pushState(null, '', '#' + id);
  }
};

// ====================================
// 4. TOC Active Section Highlighting
// Updates TOC links as user scrolls, with automatic scrolling of TOC
// container to keep active link visible.
// ====================================

const TocHighlight = {
  observer: null,
  tocLinkMap: new Map(),  // Cache: id -> Array of link elements
  navbarHeight: 58,
  updateScheduled: false, // RAF batching flag

  init() {
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id]');
    if (!headings.length) return;

    // Cache navbar height for intersection observer margin
    this.navbarHeight = Math.max(
      58,
      parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height') || '58',
        10
      )
    );

    // Pre-build Map of TOC links by heading ID for O(1) lookups
    // This avoids expensive querySelectorAll on every intersection
    document.querySelectorAll('.inline-toc a, .toc-container a, .post-toc-box a')
      .forEach((link) => {
        const id = link.getAttribute('href')?.slice(1);
        if (!id) return;
        if (!this.tocLinkMap.has(id)) this.tocLinkMap.set(id, []);
        this.tocLinkMap.get(id).push(link);
      });

    // Simplified IntersectionObserver: reduce complex rootMargin to decrease callbacks
    // Original: -${this.navbarHeight + 20}px 0px -60% 0px (causes many triggers)
    // New: simpler 0px 0px -50% 0px (triggers when section enters top 50% of viewport)
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { 
        rootMargin: '0px 0px -50% 0px',
        threshold: 0
      }
    );

    headings.forEach((h) => this.observer.observe(h));
  },

  handleIntersection(entries) {
    // Batch DOM updates with RAF to avoid layout thrashing
    if (this.updateScheduled) return;
    this.updateScheduled = true;

    requestAnimationFrame(() => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        if (!id) return;

        // Remove active from all links (cached, not via selector)
        this.tocLinkMap.forEach((links) => {
          links.forEach((l) => l.classList.remove('active'));
        });

        // Set new active state (direct Map lookup, not selector query)
        const activeLinks = this.tocLinkMap.get(id);
        if (activeLinks) {
          activeLinks.forEach((link) => {
            link.classList.add('active');
            // Use CSS for opacity animation instead of anime.js to reduce JS overhead
            this.autoScrollTocContainer(link);
          });
        }
      });
      this.updateScheduled = false;
    });
  },

  autoScrollTocContainer(link) {
    const toc = link.closest('.inline-toc, .toc-container, .post-toc-box');
    if (!toc) return;

    const tocRect  = toc.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const relative = linkRect.top - tocRect.top;

    // Only scroll if link is outside visible TOC area
    if (relative < 0 || relative > tocRect.height - 40) {
      toc.scrollTo({
        top: toc.scrollTop + relative - tocRect.height / 2,
        behavior: 'smooth'
      });
    }
  }
};

// ====================================
// 5. Code Copy to Clipboard
// ====================================

const CodeCopy = {
  init() {
    document.querySelectorAll('pre code').forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.tagName !== 'PRE') return;
      if (pre.querySelector('.copy-btn')) return;

      const lang = (codeBlock.className.match(/language-([^\s]+)/) || [])[1];
      const meta = document.createElement('div');
      meta.className = 'code-meta';
      meta.textContent = lang
        ? lang.charAt(0).toUpperCase() + lang.slice(1)
        : '';
      pre.appendChild(meta);

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'Copy';
      pre.appendChild(btn);

      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(codeBlock.textContent);
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          
          if (window.anime) {
            // Pulse animation on successful copy
            anime.to(btn, {
              scale: [1, 1.1, 1],
              duration: 500,
              easing: 'easeInOutQuad'
            });
          }
          
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 1600);
        } catch {
          btn.textContent = 'Error';
        }
      });
    });
  }
};

// ====================================
// 6. Image Lightbox
// Enhanced with anime.js for sophisticated animations
// Supports keyboard navigation (Esc to close, Click backdrop to close).
// ====================================

const ImageLightbox = {
  lightbox: null,
  isOpen: false,
  lastFocusedElement: null,

  init() {
    const images = document.querySelectorAll('article img, .post-content img, main img');
    if (!images.length) return;

    // Create lightbox only once
    this._create();

    // Add click listeners to all images
    images.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => this.open(img), false);
    });
  },

  _create() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.role = 'dialog';
    this.lightbox.ariaLabel = 'Image lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox-close" role="button" aria-label="Close image viewer">×</div>
      <div class="lightbox-content">
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>`;

    document.body.appendChild(this.lightbox);

    // Event delegation for close button and backdrop
    this.lightbox
      .querySelector('.lightbox-close')
      .addEventListener('click', () => this.close(), false);

    this.lightbox.addEventListener('click', (e) => {
      // Close only if clicking the backdrop, not the content
      if (e.target === this.lightbox) this.close();
    }, false);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    }, false);
  },

  open(img) {
    if (!this.lightbox) return;
    
    // Store focus to return later
    this.lastFocusedElement = document.activeElement;
    
    this.lightbox.querySelector('img').src = img.src;
    this.lightbox.querySelector('img').alt = img.alt || 'Image';
    this.lightbox.querySelector('.lightbox-caption').textContent = img.alt || '';
    this.lightbox.classList.add('active');
    document.body.classList.add('overflow-hidden');
    this.isOpen = true;

    // Focus close button for accessibility
    const closeBtn = this.lightbox.querySelector('.lightbox-close');
    setTimeout(() => closeBtn.focus(), 300);

    // Continue with animations only if anime.js is available
    if (!window.anime) {
      return; // Just show the lightbox without animation
    }
    
    // Animate backdrop and content
    anime.set(this.lightbox, { opacity: 0 });
    anime.to(this.lightbox, {
      opacity: 1,
      duration: 300,
      easing: 'easeOutQuad'
    });

    const content = this.lightbox.querySelector('.lightbox-content');
    anime.set(content, { scale: 0.7, opacity: 0 });
    anime.to(content, {
      scale: 1,
      opacity: 1,
      duration: 380,
      easing: 'easeOutElastic(1, 0.5)'
    });
  },

  close() {
    if (!this.lightbox || !this.isOpen) return;
    
    this.isOpen = false;
    
    if (window.anime) {
      // Animate out if anime.js is available
      const content = this.lightbox.querySelector('.lightbox-content');
      
      anime.to(content, {
        scale: 0.7,
        opacity: 0,
        duration: 250,
        easing: 'easeInQuad'
      });

      anime.to(this.lightbox, {
        opacity: 0,
        duration: 250,
        easing: 'easeInQuad',
        complete: () => {
          this.lightbox.classList.remove('active');
          document.body.classList.remove('overflow-hidden');
          // Return focus to the image that was clicked
          if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
          }
        }
      });
    } else {
      // Graceful fallback without anime.js
      this.lightbox.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
      // Return focus
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
    }
  }
};

// ====================================
// 7. Navbar Scroll Effect
// Uses shared RAF loop for optimal performance (see init section).
// ====================================

const NavbarScroll = {
  threshold: 80,
  
  init() {
    this.navbar = document.querySelector('.navbar');
    if (!this.navbar) return;
  },

  update() {
    if (!this.navbar) return;
    this.navbar.classList.toggle('scrolled', window.scrollY > this.threshold);
  }
};

// ====================================
// 8. Post Table of Contents (Left Sidebar)
// Efficiently builds TOC for article headers with minimal styling (LessWrong-inspired).
// Text-focused, no decorative elements, clean hierarchy through typography only.
// ====================================

const PostTableOfContents = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;

    const headers = article.querySelectorAll('h1[id], h2[id], h3[id]');
    if (headers.length < 1) return;

    const levelOf = { H1: 1, H2: 2, H3: 3 };
    
    // Shared function to build TOC HTML - avoids duplication
    const buildTocHtml = () => {
      let html = '<ul class="post-toc-list">';
      let h2Open = false;

      headers.forEach((header) => {
        const id    = header.getAttribute('id');
        const text  = header.textContent.replace(/^\d+\.?\s*/, '').trim();
        const level = levelOf[header.tagName];

        if (level === 1) {
          if (h2Open) { html += '</ul></li>'; h2Open = false; }
          // H1 items: no bullet, just a link (no nested structure)
          html += `<div class="toc-h1"><a href="#${id}">${text}</a></div>`;
        } else if (level === 2) {
          if (!h2Open) {
            html += `<ul class="toc-h2-list">`;
            h2Open = true;
          }
          // H2 items: nested under H1, will get list styling
          html += `<li class="toc-h2"><a href="#${id}">${text}</a></li>`;
        } else if (level === 3 && h2Open) {
          html += `<li class="toc-h3"><a href="#${id}">${text}</a></li>`;
        }
      });

      if (h2Open) html += '</ul>';
      html += '</ul>';
      return html;
    };

    // Build TOC HTML
    const tocHtml = buildTocHtml();
    
    // Inject top-of-post TOC box
    const postTocHTML = `<div class="post-toc-box">
      <h3 class="post-toc-title">Contents</h3>
      ${tocHtml}
    </div>`;
    article.insertAdjacentHTML('afterbegin', postTocHTML);
    
    // Populate sidebar TOC (if exists)
    const sidebar = document.querySelector('.inline-toc ul');
    if (sidebar) {
      sidebar.innerHTML = tocHtml.replace(/post-toc-list/g, '');
    }
  }
};

// ====================================
// 9. Reading Time
// ====================================

const ReadingTime = {
  WPM: CONFIG.WORDS_PER_MINUTE,

  init() {
    const article = document.querySelector('article');
    if (!article) return;

    const words   = (article.textContent || '').trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / this.WPM));
    let   metaBar = document.querySelector('.metadata-bar');

    if (!metaBar) {
      metaBar = document.createElement('div');
      metaBar.className = 'metadata-bar';
      const h1 = document.querySelector('h1');
      if (h1?.parentElement) {
        h1.parentElement.insertBefore(metaBar, h1.nextSibling);
      } else {
        article.insertBefore(metaBar, article.firstChild);
      }
    }

    if (!metaBar.querySelector('[data-reading-time]')) {
      metaBar.insertAdjacentHTML(
        'afterbegin',
        `<div class="metadata-item" data-reading-time="true">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <circle cx="12" cy="12" r="10"></circle>
             <polyline points="12 6 12 12 16 14"></polyline>
           </svg>
           <span>Estimated Reading Time: <strong>${minutes}</strong> min</span>
         </div>`
      );
    }
  }
};

// ====================================
// 9. Word Count Display
// Counts total words in article and displays in metadata bar
// ====================================

const WordCount = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;

    const words = (article.textContent || '').trim().split(/\s+/).length;
    let metaBar = document.querySelector('.metadata-bar');

    if (!metaBar) {
      metaBar = document.createElement('div');
      metaBar.className = 'metadata-bar';
      const h1 = document.querySelector('h1');
      if (h1?.parentElement) {
        h1.parentElement.insertBefore(metaBar, h1.nextSibling);
      } else {
        article.insertBefore(metaBar, article.firstChild);
      }
    }

    if (!metaBar.querySelector('[data-word-count]')) {
      metaBar.insertAdjacentHTML(
        'beforeend',
        `<div class="metadata-item" data-word-count="true">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
             <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
           </svg>
           <span><strong>${words.toLocaleString()}</strong> words</span>
         </div>`
      );
    }
  }
};

// ====================================
// 10. Auto-Numbering Headers
// Assigns sequential IDs to headers for anchor linking and TOC navigation.
// Skips headers marked with "subtitle" class. Resets counters on each level change.
// ====================================

const AutoNumbering = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;

    let h1Counter = 0, h2Counter = 0, h3Counter = 0;

    article.querySelectorAll('h1, h2, h3').forEach((header) => {
      // Skip subtitles (e.g., post bylines)
      if (header.classList.contains('subtitle')) return;

      const tagName = header.tagName;

      // Reset counters and assign ID based on header level
      if (tagName === 'H1') {
        h1Counter++;
        h2Counter = 0;
        h3Counter = 0;
        if (!header.id) header.id = `section-${h1Counter}`;
      } else if (tagName === 'H2') {
        h2Counter++;
        h3Counter = 0;
        if (!header.id) {
          header.id = `section-${h1Counter > 0 ? h1Counter + '-' : ''}${h2Counter}`;
        }
      } else if (tagName === 'H3') {
        h3Counter++;
        if (!header.id) {
          header.id = `section-${h1Counter > 0 ? h1Counter + '-' : ''}${h2Counter}-${h3Counter}`;
        }
      }
    });
  }
};

// ====================================
// 11. Post Preview Click + Substack Layout
// ====================================

const PostPreviewClick = {
  init() {
    const previews = Array.from(document.querySelectorAll('.post-preview'));
    if (!previews.length) return;
    this._injectMonthGroups(previews);
    this._wireClicks(previews);
    this._injectThumbnailPlaceholders(previews);
  },

  _wireClicks(previews) {
    previews.forEach((preview) => {
      const link = preview.querySelector('a[href]');
      if (!link) return;
      preview.addEventListener('click', (e) => {
        if (e.target.closest('a') && e.target.closest('a') !== link) return;
        window.location.href = link.href;
      });
    });
  },

  _injectMonthGroups(previews) {
    const MONTHS = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    let lastKey = null;

    previews.forEach((preview) => {
      const timeEl = preview.querySelector('time');
      const metaEl = preview.querySelector('.post-meta');

      const raw = timeEl?.getAttribute('datetime') || metaEl?.textContent.trim();
      if (!raw) return;

      const date = new Date(raw);
      if (isNaN(date.getTime())) return;

      const key   = `${date.getFullYear()}-${date.getMonth()}`;
      const label = `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

      if (key !== lastKey) {
        lastKey = key;
        const groupEl = document.createElement('div');
        groupEl.className   = 'post-month-group';
        groupEl.textContent = label;
        preview.parentNode.insertBefore(groupEl, preview);
      }
    });
  },

  _injectThumbnailPlaceholders(previews) {
    previews.forEach((preview) => {
      if (preview.querySelector('.post-thumbnail')) return;
      const existingImg = preview.querySelector('img');
      if (existingImg) {
        // Add class without moving the element (preserve layout)
        existingImg.classList.add('post-thumbnail');
        return;
      }
      preview.style.gridTemplateColumns = '1fr';
    });
  }
};

// ====================================
// 12. Enhanced Search Modal with Faceted Filtering & Semantic Search
// Features:
// - Full-text search across titles, content, tags, meta-descriptions
// - Faceted filtering: date range, content type, reading time
// - Keyword highlighting in results snippets
// - Trending/Popular suggestions
// - Semantic search with NLP-based intent understanding
// - Search analytics for content gap analysis
// - Rich autocomplete with previews
// - Keyboard navigation support
// ====================================

const EnhancedSearch = {
  modal: null,
  input: null,
  resultsContainer: null,
  closeBtn: null,
  searchTrigger: null,
  corpus: [],
  corpusProcessed: [], // Processed corpus with metadata
  selectedIndex: 0,
  isOpen: false,
  searchAnalytics: {}, // Track search queries for content gap analysis
  currentFilters: {
    dateRange: { from: null, to: null },
    contentType: [],
    readingTime: null // 'short', 'medium', 'long'
  },
  trendingTerms: [], // Popular keywords extracted from corpus

  init() {
    this.modal = document.getElementById('search-modal');
    if (!this.modal) return;

    this.input = this.modal.querySelector('.search-input');
    this.resultsContainer = this.modal.querySelector('#search-results');
    this.closeBtn = this.modal.querySelector('.search-modal-close');
    this.searchTrigger = document.getElementById('search-trigger');

    if (!this.input || !this.resultsContainer) return;

    // Load and process search corpus
    this._loadCorpus();

    // Event listeners
    this.input.addEventListener('input', (e) => this._handleSearch(e), false);
    this.input.addEventListener('keydown', (e) => this._handleKeyboard(e), false);
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    }, false);

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close(), false);
    }

    // Wire up faceted filter UI
    this._setupFilters();

    // Trigger buttons (navbar icon) — navigate to dedicated search page
    if (this.searchTrigger) {
      this.searchTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/search/';
      }, false);
    }

    // Keyboard shortcut: Cmd+K / Ctrl+K — navigate to search page
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.location.href = '/search/';
      }
      // Esc to close (only close if modal is open, which is now disabled)
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    }, false);

    // Load search analytics from localStorage
    this.searchAnalytics = JSON.parse(localStorage.getItem('searchAnalytics') || '{}');
  },

  /**
   * Setup faceted filter UI: wire up radio buttons, checkboxes, and change handlers
   */
  _setupFilters() {
    // Date range filter
    this.modal.querySelectorAll('input[name="date-range"]').forEach((radio) => {
      radio.addEventListener('change', (e) => this._applyDateRangeFilter(e.target.value), false);
    });

    // Reading time filter
    this.modal.querySelectorAll('input[name="reading-time"]').forEach((radio) => {
      radio.addEventListener('change', (e) => this._applyReadingTimeFilter(e.target.value), false);
    });

    // Content type filter (checkboxes)
    this.modal.querySelectorAll('.content-type-filter').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => this._applyContentTypeFilter(), false);
    });
  },

  /**
   * Apply date range filter
   */
  _applyDateRangeFilter(range) {
    const now = new Date();
    this.currentFilters.dateRange = { from: null, to: null };

    if (range === 'week') {
      const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.currentFilters.dateRange = { from, to: now };
    } else if (range === 'month') {
      const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      this.currentFilters.dateRange = { from, to: now };
    } else if (range === 'year') {
      const from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      this.currentFilters.dateRange = { from, to: now };
    }

    // Re-run search with new filters
    this._handleSearch();
  },

  /**
   * Apply reading time filter
   */
  _applyReadingTimeFilter(range) {
    this.currentFilters.readingTime = range === 'any' ? null : range;
    this._handleSearch();
  },

  /**
   * Apply content type filter (checkboxes - can select multiple)
   */
  _applyContentTypeFilter() {
    const checked = Array.from(this.modal.querySelectorAll('.content-type-filter:checked'))
      .map((cb) => cb.value);
    this.currentFilters.contentType = checked;
    this._handleSearch();
  },

  /**
   * Load search corpus from JSON file (searchcorpus.json)
   */
  async _loadCorpus() {
    try {
      const baseUrl = document.querySelector('meta[name="baseurl"]')?.content || '';
      const url = `${baseUrl}/assets/data/searchcorpus.json`;
      const response = await fetch(url);
      this.corpus = await response.json();

      // Process corpus: extract metadata, compute reading time, detect content type
      this.corpusProcessed = this.corpus.map((item) => ({
        ...item,
        title_lower: item.title.toLowerCase(),
        content_lower: item.content.toLowerCase(),
        excerpt_lower: item.excerpt.toLowerCase(),
        category_lower: item.category.toLowerCase(),
        readingTime: this._computeReadingTime(item.content),
        contentType: this._detectContentType(item),
        keywords: this._extractKeywords(item)
      }));

      // Extract and rank trending terms
      this._computeTrendingTerms();
    } catch (error) {
      console.error('Failed to load search corpus:', error);
    }
  },

  /**
   * Compute reading time in minutes
   */
  _computeReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },

  /**
   * Detect content type from URL and metadata
   */
  _detectContentType(item) {
    const url = item.url.toLowerCase();
    
    if (url.includes('/tutorial')) return 'Tutorial';
    if (url.includes('/guide')) return 'Guide';
    if (url.includes('/case-study')) return 'Case Study';
    if (url.includes('/video')) return 'Video Guide';
    if (url.includes('/quick-tip')) return 'Quick Tip';
    if (item.category === 'page' || !item.date) return 'Page';
    return 'Article';
  },

  /**
   * Extract keywords from title, excerpt, and first 200 words of content
   * Uses simple but effective stop-word filtering
   */
  _extractKeywords(item) {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
      'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'for', 'to',
      'of', 'in', 'on', 'at', 'by', 'from', 'with', 'as', 'that', 'this',
      'it', 'its', 'if', 'else', 'what', 'which', 'who', 'where', 'when',
      'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most'
    ]);

    const text = (item.title + ' ' + item.excerpt).toLowerCase();
    const words = (text.match(/\b\w+\b/g) || [])
      .filter((w) => w.length > 3 && !stopWords.has(w))
      .slice(0, 10);
    return words;
  },

  /**
   * Compute trending terms across entire corpus (top 20)
   * Used for "Popular Suggestions"
   */
  _computeTrendingTerms() {
    const termFreq = {};
    
    this.corpusProcessed.forEach((item) => {
      item.keywords.forEach((kw) => {
        termFreq[kw] = (termFreq[kw] || 0) + 1;
      });
    });

    // Sort by frequency and take top 20
    this.trendingTerms = Object.entries(termFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([term]) => term);
  },

  /**
   * Main search handler with faceted filtering
   */
  _handleSearch(e) {
    const query = this.input.value.trim();
    this.selectedIndex = 0;

    if (!query) {
      this._showTrendingAndPopular();
      return;
    }

    // Record search query for analytics
    this.searchAnalytics[query] = (this.searchAnalytics[query] || 0) + 1;
    localStorage.setItem('searchAnalytics', JSON.stringify(this.searchAnalytics));

    let results = this._performSearch(query);
    results = this._applyFilters(results);
    this._displayResults(results);
  },

  /**
   * Perform semantic + full-text search
   * Includes keyword highlighting, intent matching, and relevance ranking
   */
  _performSearch(query) {
    const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 0);
    
    // Score each document
    let results = this.corpusProcessed.map((item) => {
      let score = 0;
      let highlightedExcerpt = item.excerpt;

      queryTerms.forEach((term) => {
        // Title match (highest weight)
        if (item.title_lower.includes(term)) score += 100;

        // Exact phrase in title (even higher)
        if (item.title_lower === term) score += 200;

        // Keywords match
        if (item.keywords.some((kw) => kw.includes(term))) score += 50;

        // Category/Tags match
        if (item.category_lower.includes(term)) score += 40;

        // Content match (lower weight due to volume)
        const contentMatches = (item.content_lower.match(new RegExp(term, 'g')) || []).length;
        score += Math.min(contentMatches, 10) * 2; // Cap at 20 points

        // Highlight keyword in excerpt
        highlightedExcerpt = this._highlightKeyword(highlightedExcerpt, term);
      });

      // Semantic intent matching: related terms
      // Example: "grow business" should match "marketing", "scaling", "hiring"
      if (this._matchesSemanticIntent(query, item)) {
        score += 30;
      }

      return { ...item, score, highlightedExcerpt };
    });

    // Filter out zero-score results and sort by score
    return results
      .filter((r) => r.score > 0)
      .map((r) => {
        // Truncate excerpt to reduce visual density (max 120 characters)
        if (r.highlightedExcerpt.length > 120) {
          r.highlightedExcerpt = r.highlightedExcerpt.substring(0, 120).trim() + '…';
        }
        return r;
      })
      .sort((a, b) => b.score - a.score);
  },

  /**
   * Simple semantic intent matching
   * Maps common phrases to related keywords
   */
  _matchesSemanticIntent(query, item) {
    const intentMap = {
      'grow|scale|expand|business|revenue': ['marketing', 'sales', 'strategy', 'hiring'],
      'learn|teach|tutorial|guide': ['educational', 'learning', 'beginner'],
      'debug|error|fix|issue': ['troubleshoot', 'solution', 'workaround'],
      'performance|speed|optimize': ['efficiency', 'optimization', 'fast']
    };

    for (const [pattern, relatedTerms] of Object.entries(intentMap)) {
      if (new RegExp(pattern, 'i').test(query)) {
        return relatedTerms.some((term) => 
          item.content_lower.includes(term) || item.keywords.includes(term)
        );
      }
    }

    return false;
  },

  /**
   * Highlight keyword in text (case-insensitive)
   * Escapes regex special characters to prevent ReDoS attacks
   */
  _highlightKeyword(text, keyword) {
    // Escape special regex characters to prevent injection
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedKeyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  /**
   * Apply current faceted filters to results
   */
  _applyFilters(results) {
    let filtered = [...results]; // Create a copy to avoid mutation

    if (this.currentFilters.dateRange.from || this.currentFilters.dateRange.to) {
      filtered = filtered.filter((item) => {
        if (!item.date) return true;
        const itemDate = new Date(item.date);
        if (this.currentFilters.dateRange.from && itemDate < this.currentFilters.dateRange.from) {
          return false;
        }
        if (this.currentFilters.dateRange.to && itemDate > this.currentFilters.dateRange.to) {
          return false;
        }
        return true;
      });
    }

    if (this.currentFilters.contentType.length > 0) {
      filtered = filtered.filter((item) =>
        this.currentFilters.contentType.includes(item.contentType)
      );
    }

    if (this.currentFilters.readingTime) {
      filtered = filtered.filter((item) => {
        const time = item.readingTime;
        if (this.currentFilters.readingTime === 'short') return time < 5;
        if (this.currentFilters.readingTime === 'medium') return time >= 5 && time < 15;
        if (this.currentFilters.readingTime === 'long') return time >= 15;
        return true;
      });
    }

    return filtered;
  },

  /**
   * Display search results with rich formatting
   * Sanitizes title to prevent XSS, uses safe HTML for highlighted excerpt
   */
  _displayResults(results) {
    this.resultsContainer.classList.add('active');

    if (results.length === 0) {
      this._showNoResults();
      return;
    }

    // Limit to top 8 results
    const displayResults = results.slice(0, CONFIG.SEARCH_MAX_RESULTS);
    const html = displayResults
      .map(
        (result, index) => `
      <div class="search-result-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
        <div class="search-result-title">${this._sanitizeHTML(result.title)}</div>
        <div class="search-result-excerpt">${result.highlightedExcerpt}</div>
        <div class="search-result-tags">
          ${result.contentType ? `<span class="search-result-category">${this._sanitizeHTML(result.contentType)}</span>` : ''}
          ${result.readingTime ? `<span class="search-result-category">${result.readingTime} min read</span>` : ''}
          ${result.date ? `<span class="search-result-category">${this._sanitizeHTML(result.date)}</span>` : ''}
        </div>
      </div>
    `
      )
      .join('');

    this.resultsContainer.innerHTML = html;

    // Add click handlers to results
    this.resultsContainer.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'));
        window.location.href = displayResults[index].url;
      }, false);
    });
  },

  /**
   * Show trending and popular suggestions when search is empty
   */
  _showTrendingAndPopular() {
    this.resultsContainer.classList.remove('active');
    
    // Create a simple trending section
    let html = '<div class="search-trending"><div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">';
    html += '<strong>Popular searches:</strong><br>';
    html += this.trendingTerms.slice(0, CONFIG.SEARCH_TRENDING_COUNT).map((term) => 
      `<span style="display: inline-block; margin: 0.4rem 0.4rem 0 0; padding: 0.4rem 0.8rem; background: rgba(0,0,0,0.06); border-radius: 4px; cursor: pointer; font-size: 0.85rem;" class="trending-term">${term}</span>`
    ).join('');
    html += '</div></div>';

    this.resultsContainer.innerHTML = html;
    this.resultsContainer.classList.add('active');

    // Make trending terms clickable
    this.resultsContainer.querySelectorAll('.trending-term').forEach((term) => {
      term.addEventListener('click', () => {
        this.input.value = term.textContent;
        this._handleSearch();
      }, false);
    });
  },

  /**
   * Smart "no results" experience with suggestions
   */
  _showNoResults() {
    const query = this.input.value.trim();
    const suggestion = this._getSuggestionForNoResults(query);

    let html = `
      <div class="search-no-results">
        <p><strong>No results found for "${query}"</strong></p>
        <p style="margin-top: 0.75rem; font-size: 0.85rem;">
          Try adjusting your search terms, or explore these alternatives:
        </p>
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
          ${suggestion.similarTerms.map((term) => `
            <button class="search-suggestion-btn" style="background: none; border: 1px solid rgba(0,0,0,0.1); padding: 0.5rem; cursor: pointer; border-radius: 4px; text-align: left; color: var(--text-primary); text-decoration: underline; font-size: 0.9rem;">
              Try: <strong>${term}</strong>
            </button>
          `).join('')}
        </div>
        <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">
          <p><a href="/" style="text-decoration: underline;">Back to homepage</a> | <a href="/tags.html" style="text-decoration: underline;">Browse by tags</a></p>
        </div>
      </div>
    `;

    this.resultsContainer.innerHTML = html;

    // Add click handlers to suggestion buttons
    this.resultsContainer.querySelectorAll('.search-suggestion-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.input.value = btn.querySelector('strong').textContent;
        this._handleSearch();
      }, false);
    });
  },

  /**
   * Generate smart suggestions when no results are found
   */
  _getSuggestionForNoResults(query) {
    const searchAnalyticsSorted = Object.entries(this.searchAnalytics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([term]) => term);

    // Suggest popular searches + trending terms
    const suggestions = [
      ...searchAnalyticsSorted,
      ...this.trendingTerms.slice(0, 3)
    ].filter((term) => term.toLowerCase() !== query.toLowerCase()).slice(0, 4);

    return {
      similarTerms: suggestions.length > 0 ? suggestions : ['design', 'tutorial', 'guide']
    };
  },

  /**
   * Handle keyboard navigation through results
   */
  _handleKeyboard(e) {
    const selectedItem = this.resultsContainer.querySelector('.search-result-item.selected');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const items = this.resultsContainer.querySelectorAll('.search-result-item');
      if (items.length === 0) return;

      let nextIndex = this.selectedIndex + 1;
      if (nextIndex >= items.length) nextIndex = 0;

      this._updateSelection(items, nextIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const items = this.resultsContainer.querySelectorAll('.search-result-item');
      if (items.length === 0) return;

      let prevIndex = this.selectedIndex - 1;
      if (prevIndex < 0) prevIndex = items.length - 1;

      this._updateSelection(items, prevIndex);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedItem) {
        selectedItem.click();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  },

  /**
   * Update keyboard selection
   */
  _updateSelection(items, index) {
    items.forEach((item) => item.classList.remove('selected'));
    if (items[index]) {
      items[index].classList.add('selected');
      items[index].scrollIntoView({ block: 'nearest' });
      this.selectedIndex = index;
    }
  },

  /**
   * Open search modal
   */
  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Preserve scroll position when modal opens (CSS overflow:hidden prevents scrolling)
    this.scrollPosition = window.scrollY;
    this.bodyScrollTop = document.body.scrollTop;
    
    this.modal.classList.add('active');
    document.body.classList.add('search-modal-open');
    
    // Focus management: trap focus in modal
    if (CONFIG.FOCUS_TRAP_ENABLED) {
      this._trapFocus();
    }
    
    this.input.focus();
    this._showTrendingAndPopular();
    
    // Lazy-load corpus only when modal opens (avoid blocking page load)
    if (CONFIG.SEARCH_CORPUS_LAZY_LOAD && 
        this.corpusProcessed.length === 0 && 
        this.corpus.length === 0) {
      this._loadCorpus();
    }
  },

  /**
   * Close search modal
   */
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.modal.classList.remove('active');
    document.body.classList.remove('search-modal-open');
    this.input.value = '';
    this.resultsContainer.classList.remove('active');
    
    // Restore scroll position after modal closes
    if (this.scrollPosition !== undefined) {
      window.scrollTo(0, this.scrollPosition);
    }
    
    // Return focus to trigger element
    if (this.searchTrigger) {
      this.searchTrigger.focus();
    }
  },

  /**
   * Enable focus trap: prevent focus from leaving the modal
   */
  _trapFocus() {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    this.modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift+Tab on first element → focus last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab on last element → focus first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  /**
   * Sanitize HTML to prevent XSS attacks
   * Escapes HTML special characters
   */
  _sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Expose EnhancedSearch globally for search results page
window.EnhancedSearch = EnhancedSearch;

// ====================================
// 13. Mermaid Diagram Support
// ====================================

const MermaidSupport = {
  init() {
    document.querySelectorAll('pre > code.language-mermaid').forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      const div = document.createElement('div');
      div.className   = 'mermaid';
      div.textContent = codeBlock.textContent;
      pre.parentNode.replaceChild(div, pre);
    });
    if (window.mermaid) mermaid.init(undefined, document.querySelectorAll('.mermaid'));
  }
};

// ====================================
// 15. Reveal-on-Scroll Animations
// Enhanced with anime.js for staggered entrance effects
// ====================================

const RevealOnScroll = {
  init() {
    const targets = document.querySelectorAll('.reveal, .reveal-group');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            if (window.anime) {
              // Staggered animation for reveal groups
              anime.to(entry.target, {
                opacity: [0, 1],
                translateY: [40, 0],
                duration: 600,
                easing: 'easeOutCubic',
                delay: index * 100
              });
            }
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
  }
};

// ====================================
// 16. NEW: Post Share Bar
// Injects a share strip after the post content with copy-link,
// Twitter/X, and LinkedIn buttons.
// ====================================

const PostShareBar = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;

    const bar = document.createElement('div');
    bar.className = 'post-share-bar';

    const url   = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    bar.innerHTML = `
      <span class="post-share-label">Share</span>
      <button class="share-btn" id="share-copy-link" title="Copy link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        Copy link
      </button>
      <a class="share-btn"
         href="https://twitter.com/intent/tweet?url=${url}&text=${title}"
         target="_blank" rel="noopener noreferrer" title="Share on X">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </a>
      <a class="share-btn"
         href="https://www.linkedin.com/sharing/share-offsite/?url=${url}"
         target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </a>`;

    // Append after last child of article
    article.appendChild(bar);

    // Animate share bar entrance with staggered buttons
    if (window.anime) {
      anime.set(bar, { opacity: 0 });
      anime.to(bar, {
        opacity: 1,
        duration: 400,
        easing: 'easeOutQuad'
      });

      const buttons = bar.querySelectorAll('.share-btn');
      anime.set(buttons, { opacity: 0, scale: 0.8 });
      anime.to(buttons, {
        opacity: 1,
        scale: 1,
        duration: 500,
        easing: 'easeOutElastic(1, 0.5)',
        delay: anime.stagger(80)
      });
    }

    // Copy link logic with improved error handling and accessibility
    document.getElementById('share-copy-link')?.addEventListener('click', async () => {
      const btn = document.getElementById('share-copy-link');
      if (!btn) return;
      
      // Announce to screen readers
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.className = 'sr-only';
      
      try {
        await navigator.clipboard.writeText(window.location.href);
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        btn.setAttribute('aria-label', 'Link copied to clipboard');
        liveRegion.textContent = 'Link copied to clipboard';
        
        if (window.anime) {
          anime.to(btn, {
            scale: [1, 1.15, 1],
            duration: 400,
            easing: 'easeInOutQuad'
          });
        }
        
        document.body.appendChild(liveRegion);
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
          btn.setAttribute('aria-label', 'Copy link');
          liveRegion.remove();
        }, 2000);
      } catch (err) {
        // Fallback: select + copy (older browsers)
        console.warn('Clipboard API failed, using fallback:', err);
        const el = document.createElement('textarea');
        el.value = window.location.href;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand('copy');
          liveRegion.textContent = 'Link copied to clipboard';
          btn.setAttribute('aria-label', 'Link copied to clipboard');
        } catch {
          liveRegion.textContent = 'Failed to copy link';
          btn.setAttribute('aria-label', 'Failed to copy link');
        }
        document.body.removeChild(el);
        document.body.appendChild(liveRegion);
        setTimeout(() => liveRegion.remove(), 2000);
      }
    });
  }
};

// ====================================
// 17. NEW: Footnote Tooltips
// Wraps .footnote-ref links with a hover tooltip showing the
// referenced footnote text inline, so readers don't need to
// scroll to the bottom for short notes.
// ====================================

const FootnoteTooltips = {
  tooltip: null,
  hideTimer: null,

  init() {
    const refs = document.querySelectorAll('.footnote-ref');
    if (!refs.length) return;

    this.tooltip = document.createElement('div');
    this.tooltip.id = 'footnote-tooltip';
    Object.assign(this.tooltip.style, {
      position:      'absolute',
      zIndex:        '5000',
      maxWidth:      '320px',
      background:    'var(--bg-elevated)',
      border:        '1px solid var(--border-primary)',
      borderRadius:  'var(--radius-md)',
      padding:       '0.75rem 1rem',
      fontSize:      '0.82rem',
      lineHeight:    '1.6',
      color:         'var(--text-secondary)',
      boxShadow:     'var(--shadow-lg)',
      pointerEvents: 'none',
      opacity:       '0',
      transition:    'opacity 140ms ease',
      fontFamily:    "'Source Serif 4', 'Lora', serif",
    });
    document.body.appendChild(this.tooltip);

    refs.forEach((ref) => {
      ref.addEventListener('mouseenter', (e) => this._show(e, ref));
      ref.addEventListener('mouseleave', ()  => this._hide());
      ref.addEventListener('focus',      (e) => this._show(e, ref));
      ref.addEventListener('blur',       ()  => this._hide());
    });
  },

  _show(e, ref) {
    clearTimeout(this.hideTimer);
    const href   = ref.getAttribute('href');
    if (!href) return;
    const target = document.querySelector(href);
    if (!target) return;

    // Get the text content of the footnote (strip back-link)
    const clone = target.cloneNode(true);
    clone.querySelector('.footnote-backref, a[href^="#fnref"]')?.remove();
    const text = clone.textContent.trim();
    if (!text) return;

    this.tooltip.textContent = text;
    document.body.appendChild(this.tooltip); // ensure attached

    // Position near the reference
    const rect = ref.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const tipW  = this.tooltip.offsetWidth  || 320;
    const tipH  = this.tooltip.offsetHeight || 80;
    const margin = 8;

    let top  = rect.bottom + scrollY + margin;
    let left = rect.left   + scrollX - 12;

    // Flip up if too close to bottom
    if (rect.bottom + margin + tipH > window.innerHeight)
      top = rect.top + scrollY - tipH - margin;

    // Clamp to viewport
    if (left + tipW > window.innerWidth - 16)
      left = window.innerWidth - tipW - 16;
    if (left < 8) left = 8;

    this.tooltip.style.top  = `${top}px`;
    this.tooltip.style.left = `${left}px`;

    if (window.anime) {
      anime.to(this.tooltip, {
        opacity: 1,
        duration: 220,
        easing: 'easeOutQuad'
      });
    } else {
      this.tooltip.style.opacity = '1';
    }
  },

  _hide() {
    this.hideTimer = setTimeout(() => {
      if (window.anime) {
        anime.to(this.tooltip, {
          opacity: 0,
          duration: 150,
          easing: 'easeInQuad'
        });
      } else {
        this.tooltip.style.opacity = '0';
      }
    }, 120);
  }
};

// ====================================
// 18. NEW: Callout Block Auto-Icons
// Scans for .callout elements that don't have a .callout-icon
// child and injects the appropriate SVG icon based on variant class.
// ====================================

const CalloutIcons = {
  icons: {
    default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    tip:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
    warn:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },

  init() {
    document.querySelectorAll('.callout').forEach((el) => {
      if (el.querySelector('.callout-icon')) return;

      let variant = 'default';
      if (el.classList.contains('callout-tip'))  variant = 'tip';
      if (el.classList.contains('callout-warn')) variant = 'warn';

      const iconEl = document.createElement('div');
      iconEl.className = 'callout-icon';
      iconEl.innerHTML = this.icons[variant];
      el.insertBefore(iconEl, el.firstChild);
    });
  }
};

// ====================================
// 19. NEW: Link Preview Tooltip
// Displays website preview (title, description, image) when hovering
// over external hyperlinks in posts. Uses Microlink API for preview data.
// Keyboard accessible with focus support.
// ====================================

const LinkPreview = {
  tooltip:    null,
  hideTimer:  null,
  showTimer:  null,
  cache:      new Map(),
  isLoading:  false,
  debounceWait: CONFIG.LINK_PREVIEW_DEBOUNCE,

  init() {
    const article = document.querySelector('article');
    if (!article) return;

    const links = article.querySelectorAll('a[href^="http"]');
    if (!links.length) return;

    // Create tooltip container
    this.tooltip = document.createElement('div');
    this.tooltip.id = 'link-preview-tooltip';
    Object.assign(this.tooltip.style, {
      position:       'absolute',
      zIndex:         '5000',
      maxWidth:       '360px',
      background:     'var(--bg-elevated)',
      border:         '1px solid var(--border-primary)',
      borderRadius:   'var(--radius-md)',
      padding:        '0.75rem',
      fontSize:       '0.85rem',
      lineHeight:     '1.5',
      color:          'var(--text-secondary)',
      boxShadow:      'var(--shadow-lg)',
      pointerEvents:  'none',
      opacity:        '0',
      transition:     'opacity 150ms ease',
      fontFamily:     "'Segoe UI', Tahoma, Geneva, sans-serif",
    });
    document.body.appendChild(this.tooltip);

    // Attach hover listeners to links
    links.forEach((link) => {
      link.addEventListener('mouseenter', (e) => this._show(e, link));
      link.addEventListener('mouseleave', ()  => this._hide());
      link.addEventListener('focus',      (e) => this._show(e, link));
      link.addEventListener('blur',       ()  => this._hide());
    });
  },

  async _show(e, link) {
    clearTimeout(this.hideTimer);
    const url = link.getAttribute('href');
    if (!url) return;

    // Check cache first
    if (this.cache.has(url)) {
      this._renderPreview(this.cache.get(url), link);
      return;
    }

    // Show loading state
    this.tooltip.innerHTML = '<div style="display: flex; align-items: center; gap: 0.5rem;"><span>Loading preview…</span></div>';
    this._position(link);
    this._show_tooltip();

    try {
      this.isLoading = true;
      // Fetch preview using Microlink API with timeout (no CORS issues, free tier available)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Preview fetch failed');

      const data = await response.json();
      if (data.status === 'success' && data.data) {
        this.cache.set(url, data.data);
        this._renderPreview(data.data, link);
      } else {
        this._renderError(url);
      }
    } catch (err) {
      console.warn('Link preview error:', err);
      // Show graceful fallback instead of just error
      this._renderFallback(url, link);
    } finally {
      this.isLoading = false;
    }
  },

  _renderPreview(data, link) {
    const desc = data.description || data.title || '';
    const descShort = desc.length > 120 ? desc.substring(0, 120) + '…' : desc;
    const domain = new URL(data.url || link.getAttribute('href')).hostname;

    let html = '<div style="display: flex; gap: 0.75rem;">';
    
    // Thumbnail
    if (data.image?.url) {
      html += `<img src="${this._esc(data.image.url)}" alt="" style="
        width: 80px; height: 80px; object-fit: cover; border-radius: 4px;
        flex-shrink: 0; background: var(--bg-light);
      "/>`;
    }

    // Content
    html += '<div style="flex: 1; min-width: 0;">';
    if (data.title) {
      html += `<div style="font-weight: 600; color: var(--text-primary); white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
        ${this._esc(data.title)}
      </div>`;
    }
    if (descShort) {
      html += `<div style="margin-top: 0.25rem; color: var(--text-tertiary); font-size: 0.8rem;">
        ${this._esc(descShort)}
      </div>`;
    }
    html += `<div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-quaternary);">
      ${this._esc(domain)}
    </div>`;
    html += '</div></div>';

    this.tooltip.innerHTML = html;
    this._position(link);
    this._show_tooltip();
  },

  _renderFallback(url, link) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      this.tooltip.innerHTML = `
        <div style="color: var(--text-secondary);">
          <div style="font-weight: 600; color: var(--text-primary);">${this._esc(domain)}</div>
          <div style="margin-top: 0.25rem; font-size: 0.8rem; color: var(--text-tertiary);">
            ${this._esc(urlObj.pathname || '/')}
          </div>
        </div>`;
      this._position(link);
      this._show_tooltip();
    } catch {
      this._renderError(url);
    }
  },

  _renderError(url) {
    this.tooltip.innerHTML = `<div style="color: var(--text-tertiary);">Unable to load preview</div>`;
    this._position_tooltip();
    this._show_tooltip();
  },

  _position(link) {
    const rect = link.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const tipW = 360;
    const tipH = this.tooltip.offsetHeight || 120;
    const margin = 8;

    let top  = rect.bottom + scrollY + margin;
    let left = rect.left + scrollX;

    // Flip up if too close to bottom
    if (rect.bottom + margin + tipH > window.innerHeight) {
      top = rect.top + scrollY - tipH - margin;
    }

    // Clamp to viewport
    if (left + tipW > window.innerWidth - 16) {
      left = window.innerWidth - tipW - 16;
    }
    if (left < 8) left = 8;

    this.tooltip.style.top  = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  },

  _show_tooltip() {
    if (window.anime) {
      anime.to(this.tooltip, {
        opacity: 1,
        duration: 250,
        easing: 'easeOutQuad'
      });
    } else {
      this.tooltip.style.opacity = '1';
    }
  },

  _hide() {
    this.hideTimer = setTimeout(() => {
      if (window.anime) {
        anime.to(this.tooltip, {
          opacity: 0,
          duration: 150,
          easing: 'easeInQuad'
        });
      } else {
        this.tooltip.style.opacity = '0';
      }
    }, 120);
  },

  _esc(text) {
    return text.replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]
    );
  }
};

// ====================================
// 20. Multilingual Translation Widget
// Adds a floating language selector button that translates the
// entire page content using the Google Translate API (no key needed
// via the free widget embed). Falls back to Google Translate URL.
// ====================================

const MultilingualTranslation = {
  LANGUAGES: [
    { code: 'en', label: 'English',    flag: 'en' },
    { code: 'vi', label: 'Tiếng Việt', flag: 'vi' },
    { code: 'fr', label: 'Français',   flag: 'fr' },
    { code: 'de', label: 'Deutsch',    flag: 'de' },
    { code: 'es', label: 'Español',    flag: 'es' },
    { code: 'zh', label: '中文',        flag: 'zh' },
    { code: 'ja', label: '日本語',      flag: 'ja' },
    { code: 'ko', label: '한국어',      flag: 'ko' },
    { code: 'ar', label: 'العربية',    flag: 'ar' },
    { code: 'pt', label: 'Português',  flag: 'pt' },
  ],
  current: 'en',
  btn: null,
  panel: null,

  init() {
    this._injectGoogleTranslate();
    this._buildUI();
    this._restore();
  },

  _injectGoogleTranslate() {
    // Inject the hidden Google Translate element
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);

    window.googleTranslateElementInit = () => {
      if (!window.google || !window.google.translate) {
        console.warn('Google Translate library failed to load');
        return;
      }
      try {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google_translate_element'
        );
      } catch (err) {
        console.error('Google Translate initialization failed:', err);
      }
    };

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => console.warn('Failed to load Google Translate script');
    document.head.appendChild(script);
  },

  _buildUI() {
    // Floating button
    this.btn = document.createElement('button');
    this.btn.id = 'lang-toggle';
    this.btn.setAttribute('aria-label', 'Change language');
    this.btn.innerHTML = `<span class="lang-icon">🌐</span><span class="lang-label">EN</span>`;
    document.body.appendChild(this.btn);

    // Dropdown panel
    this.panel = document.createElement('div');
    this.panel.id = 'lang-panel';
    this.panel.innerHTML = this.LANGUAGES.map(l => `
      <button class="lang-option${l.code === this.current ? ' active' : ''}"
              data-lang="${l.code}">
        <span class="lang-flag">${l.flag}</span>
        <span class="lang-name">${l.label}</span>
      </button>`).join('');
    document.body.appendChild(this.panel);

    this.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = this.panel.classList.toggle('open');
      this.btn.setAttribute('aria-expanded', open);
      if (open && window.anime) {
        anime.set(this.panel, { opacity: 0, translateY: 8 });
        anime.to(this.panel, { opacity: 1, translateY: 0, duration: 220, easing: 'easeOutQuad' });
      }
    });

    this.panel.addEventListener('click', (e) => {
      const opt = e.target.closest('.lang-option');
      if (!opt) return;
      this._setLanguage(opt.dataset.lang);
    });

    document.addEventListener('click', () => this.panel.classList.remove('open'));
  },

  _setLanguage(code) {
    this.current = code;
    localStorage.setItem('preferred-lang', code);

    // Update active state
    this.panel.querySelectorAll('.lang-option').forEach(o => {
      o.classList.toggle('active', o.dataset.lang === code);
    });

    const label = this.LANGUAGES.find(l => l.code === code);
    this.btn.querySelector('.lang-label').textContent = label.code.toUpperCase();
    this.panel.classList.remove('open');

    // Trigger Google Translate cookie-based switch
    if (code === 'en') {
      // Remove translation
      const iframe = document.querySelector('.goog-te-banner-frame');
      if (iframe) {
        const restore = iframe.contentDocument?.querySelector('.goog-te-button button');
        if (restore) restore.click();
      }
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      location.reload();
      return;
    }
    document.cookie = `googtrans=/en/${code}; path=/`;
    location.reload();
  },

  _restore() {
    const saved = localStorage.getItem('preferred-lang');
    if (saved && saved !== 'en') {
      this.current = saved;
      const label = this.LANGUAGES.find(l => l.code === saved);
      if (label) this.btn.querySelector('.lang-label').textContent = label.code.toUpperCase();
      this.panel.querySelectorAll('.lang-option').forEach(o => {
        o.classList.toggle('active', o.dataset.lang === saved);
      });
    }
  }
};


// ====================================
// 21. Estimated Read Completion Timer
// Shows a live countdown "X min left" that updates as the user
// scrolls, complementing the existing ReadingTime badge.
// ====================================

const ReadCompletionTimer = {
  el: null,
  totalWords: 0,
  WPM: CONFIG.WORDS_PER_MINUTE,

  init() {
    const article = document.querySelector('article');
    if (!article) return;

    this.totalWords = (article.textContent || '').trim().split(/\s+/).length;
    const totalMin  = Math.max(1, Math.ceil(this.totalWords / this.WPM));

    let metaBar = document.querySelector('.metadata-bar');
    if (!metaBar) return; // ReadingTime must run first

    this.el = document.createElement('div');
    this.el.className = 'metadata-item';
    this.el.setAttribute('data-completion-timer', 'true');
    this.el.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>Time left: <strong id="time-left">${totalMin} min</strong></span>`;
    metaBar.appendChild(this.el);

    this._update();
    // NOTE: Scroll listener removed - now consolidated in unified RAF loop for better performance
  },

  _update() {
    if (!this.el) return;
    const total   = document.documentElement.scrollHeight - window.innerHeight;
    const ratio   = total > 0 ? window.scrollY / total : 0;
    const wordsLeft = Math.round(this.totalWords * (1 - ratio));
    const minsLeft  = Math.max(0, Math.ceil(wordsLeft / this.WPM));
    const el        = document.getElementById('time-left');
    if (el) el.textContent = minsLeft === 0 ? 'Done!' : `${minsLeft} min`;
  }
};


// ====================================
// 22. Keyboard Shortcuts Help Panel
// Press '?' to open a floating cheatsheet of all keyboard shortcuts
// available across ReadingProgress, DarkMode, EnhancedSearch, etc.
// ====================================

const KeyboardShortcuts = {
  panel: null,
  isOpen: false,
  lastFocusedElement: null,

  SHORTCUTS: [
    { key: '?',        desc: 'Show / hide this shortcuts panel' },
    { key: 'T',        desc: 'Toggle dark / light mode' },
    { key: '⌘ K',      desc: 'Open search modal' },
    { key: 'Esc',      desc: 'Close modals, lightbox, or panels' },
    { key: '↑ / ↓',   desc: 'Navigate search results' },
    { key: 'Enter',    desc: 'Open selected search result' },
  ],

  init() {
    this._build();
    document.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      
      if (e.key === '?') {
        this.isOpen ? this.close() : this.open();
      } else if (e.key === 't' || e.key === 'T') {
        // Toggle dark mode
        DarkMode.toggle();
      }
    });
  },

  _build() {
    this.panel = document.createElement('div');
    this.panel.id = 'kb-shortcuts-panel';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-label', 'Keyboard shortcuts');

    const rows = this.SHORTCUTS.map(s => `
      <div class="kb-row">
        <kbd class="kb-key">${s.key}</kbd>
        <span class="kb-desc">${s.desc}</span>
      </div>`).join('');

    this.panel.innerHTML = `
      <div class="kb-header">
        <span class="kb-title">Keyboard Shortcuts</span>
        <button class="kb-close" aria-label="Close">×</button>
      </div>
      <div class="kb-body">${rows}</div>
      <div class="kb-footer">Press <kbd>?</kbd> or <kbd>Esc</kbd> to close</div>`;

    document.body.appendChild(this.panel);

    this.panel.querySelector('.kb-close').addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  },

  open() {
    this.isOpen = true;
    this.lastFocusedElement = document.activeElement;
    this.panel.classList.add('open');
    
    // Focus close button for accessibility
    const closeBtn = this.panel.querySelector('.kb-close');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 100);
    }
    
    if (window.anime) {
      anime.set(this.panel, { opacity: 0, scale: 0.95 });
      anime.to(this.panel, { opacity: 1, scale: 1, duration: 280, easing: 'easeOutCubic' });
    }
  },

  close() {
    this.isOpen = false;
    if (window.anime) {
      anime.to(this.panel, {
        opacity: 0, scale: 0.95, duration: 200, easing: 'easeInQuad',
        complete: () => {
          this.panel.classList.remove('open');
          // Return focus to trigger element
          if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
          }
        }
      });
    } else {
      this.panel.classList.remove('open');
      // Return focus immediately if anime.js not available
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
    }
  }
};


// ====================================
// 23. Table of Contents Reading Progress Dots
// Adds a small filled-circle indicator next to each TOC link to
// visually show which sections have been read (scrolled past).
// ====================================

const TocProgressDots = {
  tocLinkMap: new Map(),
  
  init() {
    const tocLinks = document.querySelectorAll('.post-toc-box a, .toc-container a, .inline-toc a');
    if (!tocLinks.length) return;

    // Memoize link references: id -> Array of links (O(1) lookups in observer)
    tocLinks.forEach((link) => {
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      if (!this.tocLinkMap.has(id)) this.tocLinkMap.set(id, []);
      this.tocLinkMap.get(id).push(link);
      
      const dot = document.createElement('span');
      dot.className = 'toc-dot';
      link.insertBefore(dot, link.firstChild);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          if (!id) return;
          
          // Use Map lookup instead of querySelectorAll (much faster)
          const links = this.tocLinkMap.get(id);
          if (!links) return;
          
          links.forEach((link) => {
            const dot = link.querySelector('.toc-dot');
            if (!dot) return;
            if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
              dot.classList.add('read');
            } else {
              dot.classList.remove('read');
            }
          });
        });
      },
      { threshold: 0, rootMargin: '0px 0px -95% 0px' }
    );

    document.querySelectorAll('h1[id], h2[id], h3[id]').forEach((h) => observer.observe(h));
  }
};


// ====================================
// 24. Ambient Background Color Shift
// Subtly shifts the page's background hue as the user scrolls,
// creating a calming depth effect. Entirely CSS-variable driven,
// so it respects dark mode automatically.
// ====================================

const AmbientBackground = {
  ticking: false,

  STOPS: [
    { ratio: 0,    hue: 230 },   // top      → cool indigo-blue
    { ratio: 0.25, hue: 210 },   // quarter  → softer blue
    { ratio: 0.5,  hue: 180 },   // mid      → teal
    { ratio: 0.75, hue: 200 },   // three-q  → blue-teal
    { ratio: 1,    hue: 240 },   // bottom   → deeper indigo
  ],

  init() {
    // Only active on post/article pages for subtlety
    if (!document.querySelector('article')) return;
    // NOTE: Scroll listener removed - now consolidated in unified RAF loop for better performance
    this._apply(0);
  },

  _onScroll() {
    if (this.ticking) return;
    requestAnimationFrame(() => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      this._apply(ratio);
      this.ticking = false;
    });
    this.ticking = true;
  },

  _apply(ratio) {
    // Find surrounding stops
    let lo = this.STOPS[0], hi = this.STOPS[this.STOPS.length - 1];
    for (let i = 0; i < this.STOPS.length - 1; i++) {
      if (ratio >= this.STOPS[i].ratio && ratio <= this.STOPS[i + 1].ratio) {
        lo = this.STOPS[i];
        hi = this.STOPS[i + 1];
        break;
      }
    }
    const t   = (ratio - lo.ratio) / (hi.ratio - lo.ratio || 1);
    const hue = lo.hue + (hi.hue - lo.hue) * t;

    document.documentElement.style.setProperty(
      '--bg-primary',
      `hsl(${Math.round(hue)}, 14%, 98%)`
    );
  }
};


// ====================================
// 25. Schema.org JSON-LD Structured Data
// Injects JSON-LD for Article schema, Author schema, and Organization info.
// Improves SEO and social media preview cards.
// ====================================

const SchemaMarkup = {
  init() {
    const article = document.querySelector('article');
    if (!article) return; // Only on post pages
    
    const title = document.querySelector('h1[id]')?.textContent || document.title;
    const url = window.location.href;
    const description = document.querySelector('meta[name="description"]')?.content || '';
    const datePublished = document.querySelector('[data-publish-date]')?.dataset.publishDate 
      || document.querySelector('meta[property="og:article:published_time"]')?.content 
      || new Date().toISOString();
    
    const article_schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': title,
      'description': description,
      'url': url,
      'datePublished': datePublished,
      'author': {
        '@type': 'Person',
        'name': 'dzungphieuluuky',
        'url': window.location.origin
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'dzungphieuluuky\'s Blog',
        'url': window.location.origin
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(article_schema);
    document.head.appendChild(script);
  }
};

// ====================================
// 26. Related Posts Discovery
// Displays related articles based on shared tags at end of post.
// Improves internal navigation and time-on-site.
// ====================================

const RelatedPosts = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;
    
    const currentTags = this._getCurrentTags();
    if (currentTags.length === 0) return;
    
    const relatedPosts = this._findRelatedPosts(currentTags);
    if (relatedPosts.length === 0) return;
    
    this._injectRelatedSection(relatedPosts);
  },
  
  _getCurrentTags() {
    const tagsEl = document.querySelector('.post-preview-tags, [data-tags]');
    if (!tagsEl) return [];
    
    // Try to extract tags from the article metadata
    if (window.pageData?.tags) return window.pageData.tags;
    
    // Fallback: extract from tag elements
    const tags = [];
    document.querySelectorAll('.tag-pill, [data-tag]').forEach(el => {
      const tag = el.textContent?.trim() || el.dataset.tag;
      if (tag) tags.push(tag.toLowerCase());
    });
    return [...new Set(tags)];
  },
  
  _findRelatedPosts(currentTags) {
    // This is a client-side implementation
    // For better results, tags would be exposed in page data via Jekyll
    // For now, return empty - site owner can populate window.pageData.relatedPosts
    return window.pageData?.relatedPosts || [];
  },
  
  _injectRelatedSection(posts) {
    const section = document.createElement('section');
    section.className = 'related-posts-section';
    section.innerHTML = `
      <hr>
      <h3>Related Articles</h3>
      <div class="related-posts-grid">
        ${posts.map(post => `
          <a href="${post.url}" class="related-post-card">
            <h4>${post.title}</h4>
            <p>${post.excerpt || ''}</p>
            <span class="related-post-date">${new Date(post.date).toLocaleDateString()}</span>
          </a>
        `).join('')}
      </div>
    `;
    
    document.querySelector('article')?.appendChild(section);
  }
};

// ====================================
// 27. Breadcrumb Navigation
// Shows hierarchical path (Home > Category > Post) at top of posts.
// Improves navigation and SEO through link structure.
// ====================================

const BreadcrumbNav = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;
    
    const breadcrumbs = this._buildBreadcrumbs();
    if (!breadcrumbs) return;
    
    const nav = document.createElement('nav');
    nav.className = 'breadcrumb-nav';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.innerHTML = breadcrumbs;
    
    article.insertAdjacentElement('beforebegin', nav);
  },
  
  _buildBreadcrumbs() {
    const isPost = !!document.querySelector('article');
    if (!isPost) return null;
    
    const title = document.querySelector('h1[id]')?.textContent || '';
    const category = window.pageData?.category || 'Articles';
    
    return `
      <ol class="breadcrumb-list">
        <li><a href="/">Home</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><span>${title}</span></li>
      </ol>
    `;
  }
};

// ====================================
// 28. Semantic Zoom & Collapsible Sections
// Implements gwern.net-style progressive disclosure
// Allows readers to expand only sections they're interested in
// Improves skimmability while preserving depth for interested readers
// ====================================

const SemanticZoom = {
  init() {
    // Add keyboard support to details elements (already works in modern browsers)
    // Enhance with click handler for mobile accessibility
    document.querySelectorAll('details').forEach((details) => {
      const summary = details.querySelector('summary');
      if (summary) {
        summary.addEventListener('keypress', (e) => {
          // Allow Enter/Space to toggle on summary (already works, but ensure it does)
          if (e.key === ' ' || e.key === 'Enter') {
            // Let native behavior handle it
            return;
          }
        }, false);

        // Track expansion state in sessionStorage for persistence
        const detailsId = details.id || `details-${Math.random().toString(36).substr(2, 9)}`;
        if (!details.id) details.id = detailsId;

        const savedState = sessionStorage.getItem(`${detailsId}-expanded`);
        if (savedState === 'true') {
          details.open = true;
        }

        details.addEventListener('toggle', () => {
          sessionStorage.setItem(`${detailsId}-expanded`, details.open.toString());
        }, false);
      }
    });

    // Support for .summary-text class - show summary on collapsed, hide on expanded
    this._initSummaryToggle();
  },

  _initSummaryToggle() {
    document.querySelectorAll('details').forEach((details) => {
      const summary = details.querySelector('summary');
      if (!summary) return;

      // Check for summary text element
      const summaryText = summary.querySelector('.summary-text');
      if (!summaryText) return;

      // Hide summary text when details are open, show when closed
      const updateSummaryVisibility = () => {
        if (details.open) {
          summaryText.style.display = 'none';
        } else {
          summaryText.style.display = 'inline';
        }
      };

      updateSummaryVisibility();
      details.addEventListener('toggle', updateSummaryVisibility, false);
    });
  }
};

// ====================================
// 29. Section Depth Indicator
// Shows reading depth at current scroll position
// Visual indicator of how deep reader is exploring sections
// ====================================

const SectionDepthIndicator = {
  init() {
    // Create depth indicator element
    const indicator = document.createElement('div');
    indicator.id = 'section-depth-indicator';
    indicator.setAttribute('aria-label', 'Section depth indicator');
    document.body.appendChild(indicator);

    // NOTE: Scroll listener removed - now consolidated in unified RAF loop for better performance
    this._updateDepth();
  },

  _updateDepth() {
    const indicator = document.getElementById('section-depth-indicator');
    if (!indicator) return;

    // Find all headings and details that are currently visible
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentDepth = 0;
    let visibleHeadings = 0;

    headings.forEach((h) => {
      const rect = h.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visibleHeadings++;
        // Get heading level (h1 = 1, h2 = 2, etc.)
        const level = parseInt(h.tagName[1]);
        currentDepth = Math.max(currentDepth, level);
      }
    });

    // Count expanded details in viewport
    const expandedDetails = Array.from(
      document.querySelectorAll('details[open]')
    ).filter((d) => {
      const rect = d.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }).length;

    const depthLevel = currentDepth + (expandedDetails > 0 ? 1 : 0);

    // Store depth for potential styling/analytics
    indicator.dataset.depth = depthLevel;
    indicator.dataset.expandedSections = expandedDetails;
  }
};

// ====================================
// 30. Progressive Enhancement Check
// Verifies that core content is readable without JavaScript
// Logs warnings if JavaScript-dependent content exists without fallback
// ====================================

const ProgressiveEnhancementCheck = {
  init() {
    // This runs after DOM is ready to verify progressive enhancement
    this._checkInteractiveFallbacks();
  },

  _checkInteractiveFallbacks() {
    // Check for modals without native HTML equivalents
    const modals = document.querySelectorAll('.modal, [role="dialog"]');
    modals.forEach((modal) => {
      if (!modal.querySelector('details') && !modal.querySelector('summary')) {
        // Modal exists but has no details/summary equivalent - log warning
        if (process.env.NODE_ENV === 'development') {
          console.warn('Modal found without details/summary fallback:', modal);
        }
      }
    });

    // Verify that all interactive controls have keyboard support
    const interactiveElements = document.querySelectorAll('[onclick], .clickable, [role="button"]');
    interactiveElements.forEach((el) => {
      if (el.tagName !== 'BUTTON' && el.tagName !== 'A' && !el.hasAttribute('tabindex')) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Interactive element missing keyboard support:', el);
        }
      }
    });
  }
};

// ====================================
// Main Initialization
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  InteractionManager.init();

  // ====== CRITICAL: Load immediately (required for user interaction) ======
  ReadingProgress.init();
  ScrollToTop.init();
  NavbarScroll.init();
  SmoothAnchors.init();
  DarkMode.init();
  EnhancedSearch.init();       // Search modal must be ready
  PostPreviewClick.init();     // Navigation interactions

  // Performance: Unified scroll RAF loop for critical scroll handlers
  // This consolidates multiple scroll listeners into one efficient RAF loop
  // to avoid layout thrashing and improve rendering performance.
  // Uses passive listeners and requestAnimationFrame for silky-smooth scrolling.
  (() => {
    let ticking = false;
    
    // Bind methods to their objects to preserve context
    const scrollHandlers = [
      () => ReadingProgress.update(),
      () => ScrollToTop.toggle(),
      () => NavbarScroll.update(),
      () => AmbientBackground._onScroll.call(AmbientBackground),
      // Consolidated scroll handlers from individual listeners:
      () => SectionDepthIndicator._updateDepth.call(SectionDepthIndicator),
      () => ReadCompletionTimer._update.call(ReadCompletionTimer)
    ];

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          scrollHandlers.forEach((handler) => {
            try {
              handler();
            } catch (e) {
              console.error('Scroll handler error:', e);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listener for best scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
  })();

  // ====== BATCH DOM-MUTATING modules in a single RAF frame ======
  // Wraps all DOM-intensive inits in requestAnimationFrame to batch reflows
  requestAnimationFrame(() => {
    // Content enhancements
    CodeCopy.init();
    ImageLightbox.init();
    MermaidSupport.init();
    CalloutIcons.init();

    // Semantic zoom & progressive enhancement (gwern.net principles)
    SemanticZoom.init();
    SectionDepthIndicator.init();
    ProgressiveEnhancementCheck.init();

    // Post-only features (order matters: AutoNumbering → PostTableOfContents)
    AutoNumbering.init();
    PostTableOfContents.init();
    WordCount.init();
    ReadingTime.init();
    TocHighlight.init();
    PostShareBar.init();
    FootnoteTooltips.init();
    LinkPreview.init();
    RevealOnScroll.init();
    TocProgressDots.init();
    AmbientBackground.init();
  });

  // ====== DEFER: Load idle modules (requestIdleCallback with 2s timeout fallback) ======
  function initLazyModules() {
    MultilingualTranslation.init();   // Only used on language button click
    ReadCompletionTimer.init();       // Supplementary reading timer
    KeyboardShortcuts.init();         // Keyboard help overlay
    SchemaMarkup.init();              // JSON-LD for SEO
    RelatedPosts.init();              // Related articles section
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initLazyModules, { timeout: 2000 });
  } else {
    setTimeout(initLazyModules, 2000);
  }
});