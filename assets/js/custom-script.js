// ====================================
// 0. Enable Transitions on First Interaction
// ====================================

const InteractionManager = {
  initialized: false,

  init() {
    if (this.initialized) return;
    const enable = () => {
      if (!document.body.classList.contains('user-interactive')) {
        document.body.classList.add('user-interactive');
        this.initialized = true;
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

/*
 * BEFORE: ScrollToTop attached its own window 'scroll' listener inside init(),
 *         AND the shared rAF loop in DOMContentLoaded also called toggle().
 *         That meant toggle() ran twice per scroll event.
 * AFTER:  Removed the internal listener entirely. toggle() is only called
 *         from the single shared rAF loop.
 */

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

    // No scroll listener here — driven exclusively by the shared rAF loop
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
// ====================================

const SmoothAnchors = {
  init() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = decodeURIComponent(anchor.getAttribute('href').slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navbarH = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height') || '58',
        10
      );
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navbarH - 16,
        behavior: 'smooth'
      });
      history.pushState(null, '', '#' + id);
    });
  }
};

// ====================================
// 4. TOC Active Section Highlighting
// ====================================

/*
 * BEFORE: querySelectorAll('h2[id], h3[id]') — h1 section headings were never
 *         observed, so TOC links for h1 entries never received the .active class.
 *         Also used link.offsetTop (relative to nearest positioned ancestor)
 *         to scroll the TOC panel, which gave wrong values when the TOC itself
 *         was position:fixed or deeply nested.
 *
 * AFTER:  Observes h1[id], h2[id], h3[id].
 *         Uses getBoundingClientRect() relative to the TOC container for
 *         accurate scroll-into-view behaviour.
 */

const TocHighlight = {
  observer: null,

  init() {
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id]');
    if (!headings.length) return;

    const navbarH = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--navbar-height') || '58',
      10
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');

          document
            .querySelectorAll('.inline-toc a, .toc-container a, .post-toc-box a')
            .forEach((l) => l.classList.remove('active'));

          document
            .querySelectorAll(
              `.inline-toc a[href="#${id}"],
               .toc-container a[href="#${id}"],
               .post-toc-box a[href="#${id}"]`
            )
            .forEach((link) => {
              link.classList.add('active');
              // Scroll TOC panel using bounding-rect math (accurate for fixed/sticky panels)
              const toc = link.closest('.inline-toc, .toc-container, .post-toc-box');
              if (toc) {
                const tocRect  = toc.getBoundingClientRect();
                const linkRect = link.getBoundingClientRect();
                const relative = linkRect.top - tocRect.top;
                if (relative < 0 || relative > tocRect.height - 40) {
                  toc.scrollTo({
                    top: toc.scrollTop + relative - tocRect.height / 2,
                    behavior: 'smooth'
                  });
                }
              }
            });
        });
      },
      { rootMargin: `-${navbarH + 20}px 0px -60% 0px`, threshold: 0 }
    );

    headings.forEach((h) => this.observer.observe(h));
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
// ====================================

const ImageLightbox = {
  lightbox: null,

  init() {
    const images = document.querySelectorAll('article img, .post-content img, main img');
    if (!images.length) return;
    this._create();
    images.forEach((img) => img.addEventListener('click', () => this.open(img)));
  },

  _create() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox-close" role="button" aria-label="Close">×</div>
      <div class="lightbox-content">
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>`;
    document.body.appendChild(this.lightbox);

    this.lightbox
      .querySelector('.lightbox-close')
      .addEventListener('click', () => this.close());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active'))
        this.close();
    });
  },

  open(img) {
    this.lightbox.querySelector('img').src = img.src;
    this.lightbox.querySelector('img').alt = img.alt || '';
    this.lightbox.querySelector('.lightbox-caption').textContent = img.alt || '';
    this.lightbox.classList.add('active');
    document.body.classList.add('overflow-hidden');
  },

  close() {
    this.lightbox.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }
};

// ====================================
// 7. Navbar Scroll Effect
// ====================================

const NavbarScroll = {
  init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            navbar.classList.toggle('scrolled', window.scrollY > 80);
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }
};

// ====================================
// 8. Post Table of Contents (Inline Box)
// ====================================

/*
 * BEFORE: querySelectorAll('h2[id], h3[id]') — h1 section headings inside the
 *         post body were silently dropped from the TOC.
 *         The nesting state machine also produced invalid HTML when the first
 *         header encountered was an h3 (it opened a nested <ul> with no parent
 *         <li> to attach to).
 *
 * AFTER:  Includes h1[id], h2[id], h3[id].
 *         h1 entries get .toc-h1 for distinct CSS styling (bolder, slightly
 *         larger per custom-styles.css).
 *         State machine is rewritten with an explicit level tracker so nesting
 *         is always structurally valid regardless of heading order.
 */

const PostTableOfContents = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;

    const headers = article.querySelectorAll('h1[id], h2[id], h3[id]');
    if (headers.length < 2) return;

    const levelOf = { H1: 1, H2: 2, H3: 3 };

    // ── Build inline TOC box (top of post) ──────────────────
    let html = `
      <div class="post-toc-box">
        <details open>
          <summary>▼ Table of Contents</summary>
          <ul class="post-toc-list">`;

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
    html += '</ul></details></div>';
    article.insertAdjacentHTML('afterbegin', html);

    // ── Populate sidebar TOC ─────────────────────────────────
    const sidebar = document.querySelector('.inline-toc ul');
    if (!sidebar) return;

    let sidebarHtml = '';
    let sidebarOpenChild = false;

    headers.forEach((header) => {
      const id    = header.getAttribute('id');
      const text  = header.textContent.replace(/^\d+\.?\s*/, '').trim();
      const level = levelOf[header.tagName];

      if (level === 1) {
        if (sidebarOpenChild) { sidebarHtml += '</ul></li>'; sidebarOpenChild = false; }
        sidebarHtml += `<li class="toc-h1"><a href="#${id}">${text}</a></li>`;
      } else if (level === 2) {
        if (sidebarOpenChild) { sidebarHtml += '</ul></li>'; }
        sidebarHtml += `<li><a href="#${id}">${text}</a><ul>`;
        sidebarOpenChild = true;
      } else if (level === 3) {
        if (!sidebarOpenChild) { sidebarHtml += '<li><ul>'; sidebarOpenChild = true; }
        sidebarHtml += `<li><a href="#${id}">${text}</a></li>`;
      }
    });

    if (sidebarOpenChild) sidebarHtml += '</ul></li>';
    sidebar.innerHTML = sidebarHtml;
  }
};


// ====================================
// 9. Reading Time
// ====================================

/*
 * BEFORE: 200 wpm — commonly cited but low; research average is ~238 wpm.
 * AFTER:  238 wpm.
 */

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
// ====================================

/*
 * BEFORE: Only numbered h2/h3. h1 section headings had no auto-id
 *         and were skipped by both the TOC builder and TocHighlight observer.
 *
 * AFTER:  Numbers h1, h2, h3. h1 resets the h2 and h3 counters.
 *         IDs are added if missing so TocHighlight can observe them.
 */

const AutoNumbering = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;

    let h1n = 0, h2n = 0, h3n = 0;

    article.querySelectorAll('h1, h2, h3').forEach((header) => {
      if (header.classList.contains('subtitle')) return;

      if (header.tagName === 'H1') {
        h1n++; h2n = 0; h3n = 0;
        if (!header.id) header.id = `section-${h1n}`;
      } else if (header.tagName === 'H2') {
        h2n++; h3n = 0;
        if (!header.id) header.id = `section-${h1n > 0 ? h1n + '-' : ''}${h2n}`;
      } else if (header.tagName === 'H3') {
        h3n++;
        if (!header.id)
          header.id = `section-${h1n > 0 ? h1n + '-' : ''}${h2n}-${h3n}`;
      }
    });
  }
};

// ====================================
// 11. Post Preview Click + Substack Layout
// ====================================

/*
 * BEFORE: _injectMonthGroups used new Date(rawString) where rawString might be
 *         plain text like "February 12, 2026". While V8 handles this,
 *         the spec doesn't guarantee it — the datetime attribute is more reliable.
 *
 * AFTER:  Prefers the datetime attribute on <time> elements; falls back to
 *         textContent only when no datetime is present, and guards against
 *         invalid dates explicitly before using them.
 */

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

      // Prefer the machine-readable datetime attribute
      const raw = timeEl?.getAttribute('datetime') || metaEl?.textContent.trim();
      if (!raw) return;

      const date = new Date(raw);
      // Guard: skip if the date is not valid
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

/*
 * BEFORE: _preload was declared as `_preload: async function ()` inside an
 *         object literal — that syntax is valid, but calling it via
 *         `this._preload()` without await means errors were silently swallowed.
 *         The fire-and-forget call is intentional (preload on init), but the
 *         internal try/catch was missing the error parameter.
 *
 * AFTER:  Kept fire-and-forget preload (intentional UX: don't block init),
 *         fixed error parameter in catch, added a corpus-loading state flag
 *         so the UI shows a "Loading…" hint while the fetch is in flight.
 */

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
// 15. Reveal-on-Scroll Animations  ← NEW
// ====================================

/*
 * BEFORE: custom-styles.css defines .reveal and .reveal.active transitions
 *         but no JS ever added the .active class — elements with .reveal
 *         were permanently invisible (opacity:0, translateY(18px)).
 *
 * AFTER:  IntersectionObserver adds .active when an element crosses
 *         20% into the viewport. Works for any element with class="reveal".
 */

const RevealOnScroll = {
  init() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.2 }
    );

    targets.forEach((el) => observer.observe(el));
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

  // Single shared rAF scroll loop
  (() => {
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            ReadingProgress.update();
            ScrollToTop.toggle();   // only place toggle() is called
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
  RevealOnScroll.init();   // ← new

  // Post-only features (safe to run on all pages — guard is inside each init)
  AutoNumbering.init();          // must run before PostTableOfContents
  PostTableOfContents.init();    // must run after AutoNumbering sets IDs
  ReadingTime.init();
  TocHighlight.init();

  // Navigation & search
  EnhancedSearch.init();
  PostPreviewClick.init();
});