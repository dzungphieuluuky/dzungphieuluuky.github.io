// ====================================
// 0. Enable Transitions on First Interaction
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

  init() {
    this.bar = document.getElementById('reading-progress');
    if (!this.bar) {
      this.bar = document.createElement('div');
      this.bar.id = 'reading-progress';
      document.body.appendChild(this.bar);
    }
    this.update();
  },

  update() {
    if (!this.bar || !window.anime) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
    
    // Only animate if ratio has changed significantly
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
  THRESHOLD: 380,
  isVisible: false,

  init() {
    this.btn = document.createElement('button');
    this.btn.id = 'scroll-to-top';
    this.btn.setAttribute('aria-label', 'Scroll to top');
    this.btn.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>';
    document.body.appendChild(this.btn);

    this.btn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  },

  toggle() {
    if (!this.btn || !window.anime) return;
    const shouldBeVisible = window.scrollY > this.THRESHOLD;
    
    if (shouldBeVisible && !this.isVisible) {
      this.isVisible = true;
      anime.to(this.btn, {
        opacity: 1,
        scale: 1,
        duration: 380,
        easing: 'easeOutElastic(1, 0.6)'
      });
    } else if (!shouldBeVisible && this.isVisible) {
      this.isVisible = false;
      anime.to(this.btn, {
        opacity: 0,
        scale: 0.3,
        duration: 250,
        easing: 'easeInQuad',
        complete: () => {
          this.btn.classList.remove('visible');
        }
      });
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
  tocSelectors: '.inline-toc a, .toc-container a, .post-toc-box a',
  navbarHeight: 58,

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

    // Use Intersection Observer for efficient scroll tracking
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { 
        rootMargin: `-${this.navbarHeight + 20}px 0px -60% 0px`,
        threshold: 0
      }
    );

    headings.forEach((h) => this.observer.observe(h));
  },

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');

      // Clear previous active states
      document
        .querySelectorAll(this.tocSelectors)
        .forEach((l) => {
          if (window.anime && l.classList.contains('active')) {
            // Animate out the previous link
            anime.to(l, {
              opacity: 0.6,
              duration: 200,
              easing: 'easeOutQuad'
            });
          }
          l.classList.remove('active');
        });

      // Set new active state with animation
      document
        .querySelectorAll(`.inline-toc a[href="#${id}"], .toc-container a[href="#${id}"], .post-toc-box a[href="#${id}"]`)
        .forEach((link) => {
          link.classList.add('active');
          
          if (window.anime) {
            anime.to(link, {
              opacity: 1,
              duration: 300,
              easing: 'easeOutQuad'
            });
          }
          
          this.autoScrollTocContainer(link);
        });
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
    if (!this.lightbox || !window.anime) return;
    
    this.lightbox.querySelector('img').src = img.src;
    this.lightbox.querySelector('img').alt = img.alt || 'Image';
    this.lightbox.querySelector('.lightbox-caption').textContent = img.alt || '';
    this.lightbox.classList.add('active');
    document.body.classList.add('overflow-hidden');
    this.isOpen = true;

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
    if (!this.lightbox || !window.anime || !this.isOpen) return;
    
    this.isOpen = false;
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
      }
    });
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
// 8. Post Table of Contents (Inline Box)
// Efficiently builds TOC for article headers, avoiding duplicate code
// through a shared HTML generation function.
// ====================================

const PostTableOfContents = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;

    const headers = article.querySelectorAll('h1[id], h2[id], h3[id]');
    if (headers.length < 2) return;

    const levelOf = { H1: 1, H2: 2, H3: 3 };
    
    // Shared function to build TOC HTML - avoids duplication
    const buildTocHtml = () => {
      let html = '<ul class="post-toc-list">';
      let openChildUl = false;

      headers.forEach((header) => {
        const id    = header.getAttribute('id');
        const text  = header.textContent.replace(/^\d+\.?\s*/, '').trim();
        const level = levelOf[header.tagName];

        if (level === 1) {
          if (openChildUl) { html += '</ul></li>'; openChildUl = false; }
          html += `<li class="toc-h1"><a href="#${id}">${text}</a></li>`;
        } else if (level === 2) {
          if (openChildUl) { html += '</ul></li>'; }
          html += `<li><a href="#${id}">${text}</a><ul>`;
          openChildUl = true;
        } else if (level === 3) {
          if (!openChildUl) { html += '<li><ul>'; openChildUl = true; }
          html += `<li><a href="#${id}">${text}</a></li>`;
        }
      });

      if (openChildUl) html += '</ul></li>';
      html += '</ul>';
      return html;
    };

    // Inject post-level TOC (collapsible box)
    const tocHtml = buildTocHtml();
    const postTocHTML = `<div class="post-toc-box">
      <details open>
        <summary>▼ Table of Contents</summary>
        ${tocHtml}
      </details>
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
  WPM: 238,

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
        existingImg.classList.add('post-thumbnail');
        preview.appendChild(existingImg);
        return;
      }
      preview.style.gridTemplateColumns = '1fr';
    });
  }
};

// ====================================
// 12. Enhanced Search Modal
// ====================================

const EnhancedSearch = {
  input:    null,
  results:  null,
  modal:    null,
  trigger:  null,
  corpus:   null,
  matches:  [],
  selected: -1,
  loading:  false,

  init() {
    this.input   = document.querySelector('.search-input');
    this.results = document.querySelector('.search-results');
    this.modal   = document.getElementById('search-modal');
    this.trigger = document.getElementById('search-trigger');
    if (!this.input || !this.results || !this.modal || !this.trigger) return;

    this._preload();

    this.trigger.addEventListener('click', (e) => { e.preventDefault(); this.open(); });
    this.input.addEventListener('input',   (e) => this._search(e));
    this.input.addEventListener('keydown', (e) => this._keyboard(e));

    document.querySelector('.search-modal-close')
      ?.addEventListener('click', () => this.close());

    document.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault(); this.open();
      }
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  },

  async _preload() {
    this.loading = true;
    try {
      const base = document.querySelector('meta[name="baseurl"]')?.content || '';
      const res  = await fetch(`${base}/assets/data/searchcorpus.json`);
      if (res.ok) this.corpus = await res.json();
    } catch (err) {
      console.warn('Search corpus unavailable:', err);
    } finally {
      this.loading = false;
    }
  },

  open() {
    this.modal.classList.add('active');
    
    if (window.anime) {
      // Animate modal entrance with slide-up effect
      anime.set(this.modal, { opacity: 0 });
      anime.to(this.modal, {
        opacity: 1,
        duration: 300,
        easing: 'easeOutQuad'
      });

      const searchBox = this.modal.querySelector('.search-box');
      anime.set(searchBox, { opacity: 0, translateY: 20 });
      anime.to(searchBox, {
        opacity: 1,
        translateY: 0,
        duration: 380,
        easing: 'easeOutCubic',
        delay: 100
      });
    }
    
    setTimeout(() => this.input.focus(), 60);
  },

  close() {
    if (window.anime && this.modal.classList.contains('active')) {
      anime.to(this.modal, {
        opacity: 0,
        duration: 200,
        easing: 'easeInQuad',
        complete: () => {
          this.modal.classList.remove('active');
          this.input.value = '';
          this.results.classList.remove('active');
          this.matches  = [];
          this.selected = -1;
        }
      });
    } else {
      this.modal.classList.remove('active');
      this.input.value = '';
      this.results.classList.remove('active');
      this.matches  = [];
      this.selected = -1;
    }
  },

  _search(e) {
    const q = e.target.value.trim().toLowerCase();
    if (q.length < 2) {
      this.results.classList.remove('active');
      this.matches = []; this.selected = -1;
      return;
    }
    if (this.loading) {
      this.results.innerHTML = '<div class="search-no-results">Loading search index…</div>';
      this.results.classList.add('active');
      return;
    }
    if (!this.corpus) {
      this.results.innerHTML = '<div class="search-no-results">Search unavailable</div>';
      this.results.classList.add('active');
      return;
    }
    this.matches = this.corpus
      .filter((item) =>
        item.title.toLowerCase().includes(q)    ||
        item.excerpt.toLowerCase().includes(q)  ||
        item.content.toLowerCase().includes(q)  ||
        item.category.toLowerCase().includes(q)
      )
      .slice(0, 10);
    this.selected = -1;
    this._render();
    this.results.classList.add('active');
  },

  _render() {
    if (!this.matches.length) {
      this.results.innerHTML = '<div class="search-no-results">No results found</div>';
      return;
    }
    this.results.innerHTML = this.matches
      .map((r, i) => {
        const excerpt = r.excerpt.length > 90
          ? r.excerpt.substring(0, 90) + '…'
          : r.excerpt;
        const tags = r.category
          ? r.category.split(',').slice(0, 2)
              .map((t) =>
                `<span class="search-result-category">${this._esc(t.trim())}</span>`
              ).join('')
          : '';
        return `
          <div class="search-result-item${i === this.selected ? ' selected' : ''}"
               data-index="${i}" data-url="${r.url}">
            <div class="search-result-title">${this._esc(r.title)}</div>
            <div class="search-result-excerpt">${this._esc(excerpt)}</div>
            ${tags ? `<div class="search-result-tags">${tags}</div>` : ''}
          </div>`;
      })
      .join('');

    this.results.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        window.location.href = item.dataset.url;
        this.close();
      });
      item.addEventListener('mouseenter', () => {
        this.selected = parseInt(item.dataset.index, 10);
        this._updateSelection();
      });
    });
  },

  _keyboard(e) {
    if (!this.matches.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selected = Math.min(this.selected + 1, this.matches.length - 1);
      this._updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selected = Math.max(this.selected - 1, -1);
      this._updateSelection();
    } else if (e.key === 'Enter' && this.selected >= 0) {
      e.preventDefault();
      window.location.href = this.matches[this.selected].url;
      this.close();
    }
  },

  _updateSelection() {
    this.results.querySelectorAll('.search-result-item').forEach((item, i) => {
      item.classList.toggle('selected', i === this.selected);
      if (i === this.selected)
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  },

  _esc(text) {
    return text.replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]
    );
  }
};

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
// 14. Dark Mode
// ====================================

const DarkMode = {
  init() {
    const stored      = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark))
      document.documentElement.classList.add('dark-mode');

    document.getElementById('theme-toggle')
      ?.addEventListener('click', () => this.toggle());

    document.addEventListener('keydown', (e) => {
      if (e.key !== 't' && e.key !== 'T') return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      this.toggle();
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'theme')
        document.documentElement.classList.toggle('dark-mode', e.newValue === 'dark');
    });
  },

  toggle() {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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

    // Copy link logic
    document.getElementById('share-copy-link')?.addEventListener('click', async () => {
      const btn = document.getElementById('share-copy-link');
      try {
        await navigator.clipboard.writeText(window.location.href);
        const original = btn.innerHTML;
        btn.innerHTML = btn.innerHTML.replace('Copy link', 'Copied!');
        btn.classList.add('copied');
        
        if (window.anime) {
          anime.to(btn, {
            scale: [1, 1.15, 1],
            duration: 400,
            easing: 'easeInOutQuad'
          });
        }
        
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        // Fallback: select + copy
        const el = document.createElement('textarea');
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
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
  cache:      new Map(),
  isLoading:  false,

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
      // Fetch preview using Microlink API (no CORS issues, free tier available)
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`);
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
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
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
  WPM: 238,

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
    window.addEventListener('scroll', () => this._update(), { passive: true });
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
      if (e.key === '?') this.isOpen ? this.close() : this.open();
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
    this.panel.classList.add('open');
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
        complete: () => this.panel.classList.remove('open')
      });
    } else {
      this.panel.classList.remove('open');
    }
  }
};


// ====================================
// 23. Table of Contents Reading Progress Dots
// Adds a small filled-circle indicator next to each TOC link to
// visually show which sections have been read (scrolled past).
// ====================================

const TocProgressDots = {
  init() {
    const tocLinks = document.querySelectorAll('.post-toc-box a, .toc-container a, .inline-toc a');
    if (!tocLinks.length) return;

    tocLinks.forEach((link) => {
      const dot = document.createElement('span');
      dot.className = 'toc-dot';
      link.insertBefore(dot, link.firstChild);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          const links = document.querySelectorAll(
            `.post-toc-box a[href="#${id}"], .toc-container a[href="#${id}"], .inline-toc a[href="#${id}"]`
          );
          links.forEach((link) => {
            const dot = link.querySelector('.toc-dot');
            if (!dot) return;
            if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
              // Section scrolled past → mark as read
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
    window.addEventListener('scroll', () => this._onScroll(), { passive: true });
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
// Main Initialization
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  InteractionManager.init();

  // Core UI
  ReadingProgress.init();
  ScrollToTop.init();
  NavbarScroll.init();
  SmoothAnchors.init();
  DarkMode.init();

  // Performance: Unified scroll RAF loop for critical scroll handlers
  // This consolidates multiple scroll listeners into one efficient RAF loop
  // to avoid layout thrashing and improve rendering performance.
  (() => {
    let ticking = false;
    const scrollHandlers = [
      () => ReadingProgress.update(),
      () => ScrollToTop.toggle(),
      () => NavbarScroll.update()
    ];

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            scrollHandlers.forEach((handler) => handler());
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  })();

  // Content enhancements
  CodeCopy.init();
  ImageLightbox.init();
  MermaidSupport.init();
  RevealOnScroll.init();
  CalloutIcons.init();

  // Post-only features
  AutoNumbering.init();           // must run before PostTableOfContents
  PostTableOfContents.init();     // must run after AutoNumbering sets IDs
  ReadingTime.init();
  TocHighlight.init();
  PostShareBar.init();
  FootnoteTooltips.init();
  LinkPreview.init();

  // Navigation & search
  EnhancedSearch.init();
  PostPreviewClick.init();
  MultilingualTranslation.init();
  ReadCompletionTimer.init();
  KeyboardShortcuts.init();
  TocProgressDots.init();
  AmbientBackground.init();

});