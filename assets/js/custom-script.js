// ====================================
// 0. Enable Transitions on First Interaction
// ====================================

const InteractionManager = {
  initialized: false,

  init: function () {
    if (this.initialized) return;

    const enable = () => {
      if (!document.body.classList.contains('user-interactive')) {
        document.body.classList.add('user-interactive');
        this.initialized = true;
      }
    };

    document.addEventListener('click',     enable, { once: true, passive: true });
    document.addEventListener('mousemove', enable, { once: true, passive: true });
    document.addEventListener('scroll',    enable, { once: true, passive: true });
    document.addEventListener('keydown',   enable, { once: true, passive: true });
  }
};

// ====================================
// 1. Reading Progress Bar
// ====================================

const ReadingProgress = {
  bar: null,

  init: function () {
    this.bar = document.getElementById('reading-progress');
    if (!this.bar) {
      this.bar = document.createElement('div');
      this.bar.id = 'reading-progress';
      document.body.appendChild(this.bar);
    }
    // No scroll listener here — driven by the shared rAF loop in DOMContentLoaded
    this.update();
  },

  update: function () {
    if (!this.bar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
    // Must use scaleX — matches the CSS transform: scaleX(0) declaration
    this.bar.style.transform = `scaleX(${ratio})`;
  }
};

// ====================================
// 2. Scroll-To-Top Button
// ====================================

const ScrollToTop = {
  btn: null,
  THRESHOLD: 380,

  init: function () {
    this.btn = document.createElement('button');
    this.btn.id = 'scroll-to-top';
    this.btn.setAttribute('aria-label', 'Scroll to top');
    this.btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>';
    document.body.appendChild(this.btn);

    window.addEventListener('scroll', () => this.toggle(), { passive: true });

    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  toggle: function () {
    if (!this.btn) return;
    if (window.scrollY > this.THRESHOLD) {
      this.btn.classList.add('visible');
    } else {
      this.btn.classList.remove('visible');
    }
  }
};

// ====================================
// 3. Smooth Anchor Navigation
//    Overrides default jump for in-page links
// ====================================

const SmoothAnchors = {
  init: function () {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const id     = decodeURIComponent(anchor.getAttribute('href').slice(1));
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      // Compute offset accounting for sticky navbar
      const navbarH  = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '58',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navbarH - 16;

      window.scrollTo({ top, behavior: 'smooth' });

      // Update URL hash without jumping
      history.pushState(null, '', '#' + id);
    });
  }
};

// ====================================
// 4. TOC Active Section Highlighting
//    (works for both .inline-toc and .toc-container)
// ====================================

const TocHighlight = {
  observer: null,

  init: function () {
    const headings = document.querySelectorAll('h2[id], h3[id], h4[id]');
    if (headings.length === 0) return;

    const navbarH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '58',
      10
    );

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');

        // Clear all active states
        document.querySelectorAll('.inline-toc a, .toc-container a').forEach(
          (link) => link.classList.remove('active')
        );

        // Set active on matching links
        document
          .querySelectorAll(
            `.inline-toc a[href="#${id}"], .toc-container a[href="#${id}"]`
          )
          .forEach((link) => {
            link.classList.add('active');
            // Scroll the TOC panel to keep the active item visible
            const toc = link.closest('.inline-toc, .toc-container');
            if (toc) {
              const linkTop    = link.offsetTop;
              const tocScroll  = toc.scrollTop;
              const tocHeight  = toc.clientHeight;
              if (linkTop < tocScroll || linkTop > tocScroll + tocHeight - 40) {
                toc.scrollTo({ top: linkTop - tocHeight / 2, behavior: 'smooth' });
              }
            }
          });
      });
    }, {
      rootMargin: `-${navbarH + 20}px 0px -60% 0px`,
      threshold: 0
    });

    headings.forEach((h) => this.observer.observe(h));
  }
};

// ====================================
// 5. Code Copy to Clipboard
// ====================================

const CodeCopy = {
  init: function () {
    document.querySelectorAll('pre code').forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.tagName !== 'PRE') return;
      if (pre.querySelector('.copy-btn')) return;

      // Language label
      const lang = (codeBlock.className.match(/language-([^\s]+)/) || [])[1];
      const meta = document.createElement('div');
      meta.className = 'code-meta';
      meta.textContent = lang
        ? lang.charAt(0).toUpperCase() + lang.slice(1)
        : '';
      pre.appendChild(meta);

      // Copy button
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type      = 'button';
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
// ====================================

const ImageLightbox = {
  lightbox: null,

  init: function () {
    const images = document.querySelectorAll('article img, .post-content img, main img');
    if (images.length === 0) return;

    this._create();
    images.forEach((img) => {
      img.addEventListener('click', () => this.open(img));
    });
  },

  _create: function () {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox-close" role="button" aria-label="Close">×</div>
      <div class="lightbox-content">
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>`;
    document.body.appendChild(this.lightbox);

    this.lightbox.querySelector('.lightbox-close')
      .addEventListener('click', () => this.close());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.close();
      }
    });
  },

  open: function (img) {
    this.lightbox.querySelector('img').src           = img.src;
    this.lightbox.querySelector('img').alt           = img.alt || '';
    this.lightbox.querySelector('.lightbox-caption').textContent = img.alt || '';
    this.lightbox.classList.add('active');
    document.body.classList.add('overflow-hidden');
  },

  close: function () {
    this.lightbox.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }
};

// ====================================
// 7. Navbar Scroll Effect
// ====================================

const NavbarScroll = {
  init: function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
};

// ====================================
// 8. Post Table of Contents (Inline Box)
// ====================================

const PostTableOfContents = {
  init: function () {
    const article = document.querySelector('article');
    if (!article) return;

    const headers = article.querySelectorAll('h2[id], h3[id]');
    if (headers.length < 2) return;

    let html = `
      <div class="post-toc-box">
        <details open>
          <summary>▼ Table of Contents</summary>
          <ul class="post-toc-list">`;

    let inH2 = false;

    headers.forEach((header) => {
      const id   = header.getAttribute('id');
      const text = header.textContent.replace(/^\d+\.?\s*/, '').trim();

      if (header.tagName === 'H2') {
        if (inH2) html += '</ul></li>';
        html  += `<li><a href="#${id}">${text}</a><ul>`;
        inH2   = true;
      } else if (header.tagName === 'H3') {
        html  += `<li><a href="#${id}">${text}</a></li>`;
      }
    });

    if (inH2) html += '</ul></li>';
    html += '</ul></details></div>';

    article.insertAdjacentHTML('afterbegin', html);
  }
};

// ====================================
// 9. Reading Time
// ====================================

const ReadingTime = {
  init: function () {
    const article = document.querySelector('article');
    if (!article) return;

    const words       = (article.textContent || '').trim().split(/\s+/).length;
    const minutes     = Math.max(1, Math.ceil(words / 200));
    let   metaBar     = document.querySelector('.metadata-bar');

    if (!metaBar) {
      metaBar = document.createElement('div');
      metaBar.className = 'metadata-bar';
      const h1 = document.querySelector('h1');
      if (h1 && h1.parentElement) {
        h1.parentElement.insertBefore(metaBar, h1.nextSibling);
      } else {
        article.insertBefore(metaBar, article.firstChild);
      }
    }

    if (!metaBar.querySelector('[data-reading-time]')) {
      metaBar.insertAdjacentHTML('afterbegin', `
        <div class="metadata-item" data-reading-time="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Estimated Reading Time: <strong>${minutes}</strong> min</span>
        </div>`);
    }
  }
};

// ====================================
// 10. Auto-Numbering Headers
// ====================================

const AutoNumbering = {
  init: function () {
    const article = document.querySelector('article');
    if (!article) return;

    let h2n = 0, h3n = 0;

    article.querySelectorAll('h2, h3').forEach((header) => {
      if (header.classList.contains('subtitle')) return;

      if (header.tagName === 'H2') {
        h2n++;
        h3n = 0;
        if (!header.id) header.id = `section-${h2n}`;
      } else if (header.tagName === 'H3') {
        h3n++;
        if (!header.id) header.id = `section-${h2n}-${h3n}`;
      }
    });
  }
};

// ====================================
// 11. Post Preview Click + Substack Layout
// ====================================

const PostPreviewClick = {
  init: function () {
    const previews = Array.from(document.querySelectorAll('.post-preview'));
    if (previews.length === 0) return;

    this._injectMonthGroups(previews);
    this._wireClicks(previews);
    this._injectThumbnailPlaceholders(previews);
  },

  _wireClicks: function (previews) {
    previews.forEach((preview) => {
      const link = preview.querySelector('a[href]');
      if (!link) return;
      // Make entire card navigate — but don't intercept inner <a> clicks
      preview.addEventListener('click', (e) => {
        if (e.target.closest('a') && e.target.closest('a') !== link) return;
        window.location.href = link.href;
      });
    });
  },

  _injectMonthGroups: function (previews) {
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];

    let lastKey = null;

    previews.forEach((preview) => {
      // Try to read the ISO date from a data attribute or the meta text
      const metaEl = preview.querySelector('.post-meta, time');
      if (!metaEl) return;

      // Accept both <time datetime="..."> and plain text like "February 12, 2026"
      const raw = metaEl.getAttribute('datetime') || metaEl.textContent.trim();
      const date = new Date(raw);
      if (isNaN(date)) return;

      const key   = `${date.getFullYear()}-${date.getMonth()}`;
      const label = `${months[date.getMonth()]} ${date.getFullYear()}`;

      if (key !== lastKey) {
        lastKey = key;
        const groupEl       = document.createElement('div');
        groupEl.className   = 'post-month-group';
        groupEl.textContent = label;
        preview.parentNode.insertBefore(groupEl, preview);
      }
    });
  },

  _injectThumbnailPlaceholders: function (previews) {
    previews.forEach((preview) => {
      // Skip if thumbnail already exists in markup
      if (preview.querySelector('.post-thumbnail')) return;

      // Look for an img already inside the preview (some themes put it there)
      const existingImg = preview.querySelector('img');
      if (existingImg) {
        existingImg.classList.add('post-thumbnail');
        // Move it to end so CSS grid places it in column 2
        preview.appendChild(existingImg);
        return;
      }

      // No image — leave the grid single-column gracefully
      preview.style.gridTemplateColumns = '1fr';
    });
  }
};

// ...existing code...
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

  init: function () {
    this.input   = document.querySelector('.search-input');
    this.results = document.querySelector('.search-results');
    this.modal   = document.getElementById('search-modal');
    this.trigger = document.getElementById('search-trigger');

    if (!this.input || !this.results || !this.modal || !this.trigger) return;

    this._preload();

    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    });

    this.input.addEventListener('input',   (e) => this._search(e));
    this.input.addEventListener('keydown', (e) => this._keyboard(e));

    document.querySelector('.search-modal-close')
      ?.addEventListener('click', () => this.close());

    document.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  },

  _preload: async function () {
    try {
      const base = document.querySelector('meta[name="baseurl"]')?.content || '';
      const res  = await fetch(base + '/assets/data/searchcorpus.json');
      if (res.ok) this.corpus = await res.json();
    } catch (err) {
      console.warn('Search corpus unavailable:', err);
    }
  },

  open: function () {
    this.modal.classList.add('active');
    // Small delay lets CSS animation finish before focus
    setTimeout(() => this.input.focus(), 60);
  },

  close: function () {
    this.modal.classList.remove('active');
    this.input.value = '';
    this.results.classList.remove('active');
    this.matches  = [];
    this.selected = -1;
  },

  _search: function (e) {
    const q = e.target.value.trim().toLowerCase();

    if (q.length < 2) {
      this.results.classList.remove('active');
      this.matches  = [];
      this.selected = -1;
      return;
    }

    if (!this.corpus) {
      this.results.innerHTML = '<div class="search-no-results">Search unavailable</div>';
      this.results.classList.add('active');
      return;
    }

    this.matches = this.corpus
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 10);

    this.selected = -1;
    this._render();
    this.results.classList.add('active');
  },

  _render: function () {
    if (this.matches.length === 0) {
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
              .map((t) => `<span class="search-result-category">${this._esc(t.trim())}</span>`)
              .join('')
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

  _keyboard: function (e) {
    if (this.matches.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selected = Math.min(this.selected + 1, this.matches.length - 1);
      this._updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selected = Math.max(this.selected - 1, -1);
      this._updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.selected >= 0) {
        window.location.href = this.matches[this.selected].url;
        this.close();
      }
    }
  },

  _updateSelection: function () {
    this.results.querySelectorAll('.search-result-item').forEach((item, i) => {
      item.classList.toggle('selected', i === this.selected);
      if (i === this.selected) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  },

  _esc: function (text) {
    return text.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#039;'
    })[c]);
  }
};

// ====================================
// 13. Mermaid Diagram Support
// ====================================

const MermaidSupport = {
  init: function () {
    document.querySelectorAll('pre > code.language-mermaid').forEach((codeBlock) => {
      const pre     = codeBlock.parentElement;
      const div     = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = codeBlock.textContent;
      pre.parentNode.replaceChild(div, pre);
    });

    if (window.mermaid) {
      mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }
  }
};

// ====================================
// 14. Dark Mode
// ====================================

const DarkMode = {
  init: function () {
    const stored     = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark-mode');
    }

    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => this.toggle());

    // Keyboard shortcut: press T to toggle (only when not typing in an input)
    document.addEventListener('keydown', (e) => {
      if (e.key === 't' || e.key === 'T') {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        this.toggle();
      }
    });

    // Sync across browser tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
        document.documentElement.classList.toggle('dark-mode', e.newValue === 'dark');
      }
    });
  },

  toggle: function () {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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

  // Single shared rAF scroll loop — replaces all individual scroll listeners
  // on ReadingProgress and ScrollToTop
  (() => {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ReadingProgress.update();
          ScrollToTop.toggle();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();

  // Content enhancements
  CodeCopy.init();
  ImageLightbox.init();
  MermaidSupport.init();
  DarkMode.init();

  // Post-only features
  AutoNumbering.init();
  PostTableOfContents.init();
  ReadingTime.init();

  // Navigation & search
  TocHighlight.init();
  EnhancedSearch.init();
  PostPreviewClick.init();
});