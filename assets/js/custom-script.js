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
// ====================================

const ReadingProgress = {
  bar: null,

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
    if (!this.bar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
    this.bar.style.transform = `scaleX(${ratio})`;
  }
};

// ====================================
// 2. Scroll-To-Top Button
// ====================================

const ScrollToTop = {
  btn: null,
  THRESHOLD: 380,

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
    if (!this.btn) return;
    this.btn.classList.toggle('visible', window.scrollY > this.THRESHOLD);
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
        .forEach((l) => l.classList.remove('active'));

      // Set new active state
      document
        .querySelectorAll(`.inline-toc a[href="#${id}"], .toc-container a[href="#${id}"], .post-toc-box a[href="#${id}"]`)
        .forEach((link) => {
          link.classList.add('active');
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
// Provides full-screen image viewing with caption support.
// Supports keyboard navigation (Esc to close, Click backdrop to close).
// ====================================

const ImageLightbox = {
  lightbox: null,

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
      if (e.key === 'Escape' && this.lightbox?.classList.contains('active')) {
        this.close();
      }
    }, false);
  },

  open(img) {
    if (!this.lightbox) return;
    
    this.lightbox.querySelector('img').src = img.src;
    this.lightbox.querySelector('img').alt = img.alt || 'Image';
    this.lightbox.querySelector('.lightbox-caption').textContent = img.alt || '';
    this.lightbox.classList.add('active');
    document.body.classList.add('overflow-hidden');
  },

  close() {
    if (!this.lightbox) return;
    
    this.lightbox.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
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
    setTimeout(() => this.input.focus(), 60);
  },

  close() {
    this.modal.classList.remove('active');
    this.input.value = '';
    this.results.classList.remove('active');
    this.matches  = [];
    this.selected = -1;
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
// ====================================

const RevealOnScroll = {
  init() {
    const targets = document.querySelectorAll('.reveal, .reveal-group');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
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

    // Copy link logic
    document.getElementById('share-copy-link')?.addEventListener('click', async () => {
      const btn = document.getElementById('share-copy-link');
      try {
        await navigator.clipboard.writeText(window.location.href);
        const original = btn.innerHTML;
        btn.innerHTML = btn.innerHTML.replace('Copy link', 'Copied!');
        btn.classList.add('copied');
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
    this.tooltip.style.opacity = '0';
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

    requestAnimationFrame(() => { this.tooltip.style.opacity = '1'; });
  },

  _hide() {
    this.hideTimer = setTimeout(() => {
      this.tooltip.style.opacity = '0';
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

  // Navigation & search
  EnhancedSearch.init();
  PostPreviewClick.init();
});