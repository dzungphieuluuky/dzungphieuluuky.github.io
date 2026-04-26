// ====================================
// 0. CENTRALIZED CONFIGURATION
// ====================================
const CONFIG = {
  WORDS_PER_MINUTE: 238,
  SCROLL_TO_TOP_THRESHOLD: 380,
  NAVBAR_HEIGHT: 58,
  THEME_STORAGE_KEY: 'sjbz-theme-preference',
  PREFER_DARK_MEDIA: '(prefers-color-scheme: dark)',
  ANNOUNCE_TO_SCREEN_READERS: true,
};

// ====================================
// 0.1 Dark Mode Toggle
// ====================================
const DarkMode = {
  isDark: false,
  toggleBtn: null,
  init() {
    const stored = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
    if (stored) {
      this.isDark = stored === 'dark';
    } else {
      this.isDark = window.matchMedia(CONFIG.PREFER_DARK_MEDIA).matches;
    }
    this.applyTheme();
    this.toggleBtn = document.querySelector('#theme-toggle');
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
      this._updateToggleState();
    }
  },
  applyTheme() {
    const root = document.documentElement;
    if (this.isDark) {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    }
  },
  toggle() {
    this.isDark = !this.isDark;
    localStorage.setItem(CONFIG.THEME_STORAGE_KEY, this.isDark ? 'dark' : 'light');
    this.applyTheme();
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('aria-label', this.isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (CONFIG.ANNOUNCE_TO_SCREEN_READERS) {
      const msg = this.isDark ? 'Switched to dark mode' : 'Switched to light mode';
      const live = document.createElement('div');
      live.className = 'sr-only';
      live.setAttribute('aria-live', 'polite');
      live.textContent = msg;
      document.body.appendChild(live);
      setTimeout(() => live.remove(), 1000);
    }
  },
  _updateToggleState() {
    if (!this.toggleBtn) return;
    this.toggleBtn.setAttribute('aria-label', this.isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
};

// Apply theme immediately to avoid flash
(() => {
  const stored = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
  const isDark = stored ? stored === 'dark' : window.matchMedia(CONFIG.PREFER_DARK_MEDIA).matches;
  if (isDark) document.documentElement.classList.add('dark-mode');
  else document.documentElement.classList.add('light-mode');
})();

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
    window.addEventListener('scroll', () => this.update(), { passive: true });
    this.update();
  },
  update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    this.bar.style.transform = `scaleX(${progress})`;
  }
};

// ====================================
// 2. Scroll To Top Button
// ====================================
const ScrollToTop = {
  btn: null,
  init() {
    this.btn = document.createElement('button');
    this.btn.id = 'scroll-to-top';
    this.btn.setAttribute('aria-label', 'Scroll to top');
    this.btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>';
    document.body.appendChild(this.btn);
    this.btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => this.toggle(), { passive: true });
    this.toggle();
  },
  toggle() {
    if (!this.btn) return;
    const visible = window.scrollY > CONFIG.SCROLL_TO_TOP_THRESHOLD;
    this.btn.classList.toggle('visible', visible);
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
      const offset = CONFIG.NAVBAR_HEIGHT + 16;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
      history.pushState(null, '', '#' + id);
    });
  }
};

// ====================================
// 4. TOC Active Highlight & Auto-scroll
// ====================================
const TocHighlight = {
  observer: null,
  tocLinkMap: new Map(),
  init() {
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id]');
    if (!headings.length) return;
    document.querySelectorAll('.inline-toc a, .toc-container a, .post-toc-box a').forEach(link => {
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      if (!this.tocLinkMap.has(id)) this.tocLinkMap.set(id, []);
      this.tocLinkMap.get(id).push(link);
    });
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute('id');
          if (!id) continue;
          this.tocLinkMap.forEach(links => links.forEach(l => l.classList.remove('active')));
          const activeLinks = this.tocLinkMap.get(id);
          if (activeLinks) activeLinks.forEach(l => l.classList.add('active'));
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );
    headings.forEach(h => this.observer.observe(h));
  }
};

// ====================================
// 5. Code Copy Button
// ====================================
const CodeCopy = {
  init() {
    document.querySelectorAll('pre code').forEach(block => {
      const pre = block.parentElement;
      if (!pre || pre.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      pre.appendChild(btn);
    });
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('.copy-btn');
      if (!btn) return;
      const code = btn.parentElement?.querySelector('code');
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.textContent);
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1600);
      } catch {
        btn.textContent = 'Error';
      }
    });
  }
};

// ====================================
// 6. Image Lightbox
// ====================================
const ImageLightbox = {
  lightbox: null,
  init() {
    const images = document.querySelectorAll('article img, .post-content img');
    if (!images.length) return;
    this._create();
    images.forEach(img => {
      img.classList.add('lightbox-img');
      img.style.cursor = 'zoom-in';
    });
    document.addEventListener('click', (e) => {
      const img = e.target.closest('article img, .post-content img');
      if (img && !img.closest('.lightbox')) this.open(img);
    });
  },
  _create() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <div class="lightbox-close">×</div>
      <div class="lightbox-content"><img src="" alt=""><div class="lightbox-caption"></div></div>
    `;
    document.body.appendChild(this.lightbox);
    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.lightbox.addEventListener('click', (e) => { if (e.target === this.lightbox) this.close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.lightbox.classList.contains('active')) this.close(); });
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
// 7. Post Table of Contents (HedgeDoc/HackMD style)
// ====================================
const PostTableOfContents = {
  allExpanded: false,
  init() {
    const article = document.querySelector('article');
    if (!article) return;

    // Use template structure when present; only create missing pieces.
    const blogPost = article.closest('.blog-post') || article.parentElement;
    if (!blogPost) return;

    let tocWrapper = blogPost.querySelector('.toc-wrapper');
    if (!tocWrapper) {
      tocWrapper = document.createElement('div');
      tocWrapper.className = 'toc-wrapper';
      blogPost.appendChild(tocWrapper);
    }

    let inlineToc = tocWrapper.querySelector('.inline-toc');
    if (!inlineToc) {
      inlineToc = document.createElement('nav');
      inlineToc.id = 'inline-toc';
      inlineToc.className = 'inline-toc';
      inlineToc.setAttribute('aria-label', 'Table of contents');
      inlineToc.innerHTML = '<div class="inline-toc-title">Contents</div><ul></ul>';
      tocWrapper.appendChild(inlineToc);
    }

    // Guarantee a root list container for TOC items.
    let tocList = inlineToc.querySelector(':scope > ul');
    if (!tocList) {
      tocList = document.createElement('ul');
      inlineToc.appendChild(tocList);
    }

    const headers = article.querySelectorAll('h1[id], h2[id], h3[id]');
    if (headers.length < 1) return;
    const levelOf = { H1: 1, H2: 2, H3: 3 };
    const buildTocItemsHtml = () => {
      let html = '';
      let h2Open = false;
      headers.forEach((header, idx) => {
        const id = header.id;
        const text = header.textContent.replace(/^\d+\.?\s*/, '').trim();
        const level = levelOf[header.tagName];
        if (level === 1) {
          if (h2Open) { html += '</ul></li>'; h2Open = false; }
          html += `<li class="toc-h1"><a href="#${id}">${text}</a></li>`;
        } else if (level === 2) {
          if (h2Open) html += '</ul></li>';
          let hasH3 = false;
          for (let i = idx+1; i < headers.length; i++) {
            const next = levelOf[headers[i].tagName];
            if (next === 2 || next === 1) break;
            if (next === 3) { hasH3 = true; break; }
          }
          const toggle = hasH3 ? `<button class="toc-expand-toggle">▼</button>` : '';
          html += `<li class="toc-h2">${toggle}<a href="#${id}">${text}</a>`;
          if (hasH3) { html += '<ul>'; h2Open = true; }
          else html += '</li>';
        } else if (level === 3 && h2Open) {
          html += `<li class="toc-h3"><a href="#${id}">${text}</a></li>`;
        }
      });
      if (h2Open) html += '</ul></li>';
      return html;
    };

    tocList.innerHTML = buildTocItemsHtml();

    inlineToc.addEventListener('click', (e) => {
      const btn = e.target.closest('.toc-expand-toggle');
      if (!btn) return;
      const li = btn.closest('.toc-h2');
      if (!li) return;
      const ul = li.querySelector('ul');
      if (!ul) return;
      const isHidden = ul.style.display === 'none';
      ul.style.display = isHidden ? '' : 'none';
      btn.textContent = isHidden ? '▼' : '▶';
    });
  }
};

// ====================================
// 8. Reading Time & Word Count
// ====================================
const ReadingTime = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;
    const words = article.textContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / CONFIG.WORDS_PER_MINUTE));
    let metaBar = document.querySelector('.metadata-bar');
    if (!metaBar) {
      metaBar = document.createElement('div');
      metaBar.className = 'metadata-bar';
      const h1 = document.querySelector('h1');
      if (h1?.parentElement) h1.parentElement.insertBefore(metaBar, h1.nextSibling);
      else article.insertBefore(metaBar, article.firstChild);
    }
    if (!metaBar.querySelector('[data-reading-time]')) {
      metaBar.insertAdjacentHTML('afterbegin', `<div class="metadata-item" data-reading-time>
        <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span><strong>${minutes}</strong> min read</span>
      </div>`);
    }
    if (!metaBar.querySelector('[data-word-count]')) {
      metaBar.insertAdjacentHTML('beforeend', `<div class="metadata-item" data-word-count>
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <span><strong>${words.toLocaleString()}</strong> words</span>
      </div>`);
    }
  }
};

// ====================================
// 9. Auto‑Numbering Headers
// ====================================
const AutoNumbering = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;
    let h1=0, h2=0, h3=0;
    article.querySelectorAll('h1, h2, h3').forEach(h => {
      if (h.classList.contains('subtitle')) return;
      const tag = h.tagName;
      if (tag === 'H1') { h1++; h2=0; h3=0; if (!h.id) h.id = `section-${h1}`; }
      else if (tag === 'H2') { h2++; h3=0; if (!h.id) h.id = `section-${h1}-${h2}`; }
      else if (tag === 'H3') { h3++; if (!h.id) h.id = `section-${h1}-${h2}-${h3}`; }
    });
  }
};

// ====================================
// ====================================
// 10. External Links Security
// ====================================
const ExternalLinks = {
  init() {
    document.querySelectorAll('a[href]').forEach(link => {
      try {
        const url = new URL(link.href, document.baseURI);
        if (url.origin !== window.location.origin && link.target !== '_self') {
          link.setAttribute('target', '_blank');
          const rel = new Set((link.getAttribute('rel') || '').split(/\s+/));
          rel.add('noopener'); rel.add('noreferrer');
          link.setAttribute('rel', Array.from(rel).join(' '));
        }
      } catch (e) {}
    });
  }
};

// ====================================
// 11. Enhanced Search Modal
// ====================================
const EnhancedSearch = {
  modal: null,
  input: null,
  results: null,
  closeBtn: null,
  triggerBtns: [],
  corpus: [],
  visibleResults: [],
  selectedIndex: -1,
  loaded: false,
  loading: false,

  init() {
    this.modal = document.getElementById('search-modal');
    this.input = this.modal?.querySelector('.search-input') || null;
    this.results = document.getElementById('search-results');
    this.closeBtn = this.modal?.querySelector('.search-modal-close') || null;
    this.triggerBtns = Array.from(document.querySelectorAll('.search-trigger'));

    if (!this.modal || !this.input || !this.results || this.triggerBtns.length === 0) return;

    this.triggerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    this.input.addEventListener('input', () => {
      this.selectedIndex = -1;
      this.runSearch();
    });

    this.input.addEventListener('keydown', (e) => this.onKeydown(e));
    this.results.addEventListener('keydown', (e) => this.onKeydown(e));

    this.modal.querySelectorAll('input[name="date-range"], input[name="reading-time"], .content-type-filter').forEach(control => {
      control.addEventListener('change', () => this.runSearch());
    });

    document.addEventListener('keydown', (e) => {
      const isCmdOrCtrlK = (e.key.toLowerCase() === 'k') && (e.metaKey || e.ctrlKey);
      if (isCmdOrCtrlK) {
        e.preventDefault();
        this.open();
      }
    });
  },

  onKeydown(e) {
    if (!this.isOpen()) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }

    if (e.key === 'ArrowDown') {
      if (!this.visibleResults.length) return;
      e.preventDefault();
      this.moveSelection(1);
    } else if (e.key === 'ArrowUp') {
      if (!this.visibleResults.length) return;
      e.preventDefault();
      this.moveSelection(-1);
    } else if (e.key === 'Enter') {
      if (!this.visibleResults.length) return;
      e.preventDefault();
      this.activateSelected();
    }
  },

  moveSelection(delta) {
    if (!this.visibleResults.length) return;

    if (this.selectedIndex < 0) {
      this.selectedIndex = delta > 0 ? 0 : this.visibleResults.length - 1;
    } else {
      this.selectedIndex = (this.selectedIndex + delta + this.visibleResults.length) % this.visibleResults.length;
    }

    this.syncSelection();
  },

  activateSelected() {
    const index = this.selectedIndex >= 0 ? this.selectedIndex : 0;
    const selected = this.visibleResults[index];
    if (selected?.url) {
      window.location.href = selected.url;
    }
  },

  isOpen() {
    return this.modal?.classList.contains('active') || false;
  },

  async open() {
    this.modal.classList.add('active');
    document.body.classList.add('overflow-hidden');
    this.input.focus();

    if (!this.loaded && !this.loading) {
      await this.loadCorpus();
    }

    this.runSearch();
  },

  close() {
    this.modal.classList.remove('active');
    if (!document.querySelector('.lightbox.active')) {
      document.body.classList.remove('overflow-hidden');
    }
    this.selectedIndex = -1;
  },

  getCorpusUrl() {
    const baseMeta = document.querySelector('meta[name="baseurl"]')?.content || '';
    const normalizedBase = (baseMeta === '/' ? '' : baseMeta).replace(/\/$/, '');
    return `${normalizedBase}/assets/data/searchcorpus.json`;
  },

  async loadCorpus() {
    this.loading = true;
    this.renderStatus('Loading search index...');

    try {
      const response = await fetch(this.getCorpusUrl(), { cache: 'no-store' });
      if (!response.ok) throw new Error(`Search index HTTP ${response.status}`);

      const raw = await response.json();
      this.corpus = Array.isArray(raw) ? raw.map(item => this.normalizeItem(item)) : [];
      this.loaded = true;
      this.renderStatus('Start typing to search posts...');
    } catch (error) {
      this.renderStatus('Search is temporarily unavailable. Please refresh the page.');
      this.corpus = [];
    } finally {
      this.loading = false;
    }
  },

  normalizeItem(item) {
    const title = (item?.title || '').toString().trim();
    const content = (item?.content || '').toString().replace(/\s+/g, ' ').trim();
    const excerptRaw = (item?.excerpt || '').toString().trim() || content;
    const excerpt = excerptRaw.length > 220 ? `${excerptRaw.slice(0, 220).trim()}...` : excerptRaw;
    const url = (item?.url || '#').toString();
    const date = (item?.date || '').toString();
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / CONFIG.WORDS_PER_MINUTE));

    const tags = (item?.category || '')
      .toString()
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .filter(tag => tag.toLowerCase() !== 'page');

    const contentType = this.inferContentType(title, tags, url, date);
    const titleNormalized = this.normalizeText(title);
    const tagsNormalized = this.normalizeText(tags.join(' '));
    const excerptNormalized = this.normalizeText(excerpt);
    const contentNormalized = this.normalizeText(content);
    const searchBlobNormalized = this.normalizeText(`${title} ${content} ${excerpt} ${tags.join(' ')} ${contentType}`);

    return {
      title,
      content,
      excerpt,
      url,
      date,
      tags,
      words,
      minutes,
      contentType,
      titleNormalized,
      tagsNormalized,
      excerptNormalized,
      contentNormalized,
      searchBlobNormalized
    };
  },

  inferContentType(title, tags, url, date) {
    const haystack = `${title} ${tags.join(' ')}`.toLowerCase();
    if (haystack.includes('tutorial')) return 'Tutorial';
    if (haystack.includes('guide')) return 'Guide';
    if (haystack.includes('case study') || haystack.includes('case-study')) return 'Case Study';
    if (date || /\/\d{4}\//.test(url)) return 'Article';
    return 'Page';
  },

  runSearch() {
    if (!this.loaded) return;

    const query = this.input.value.trim();
    const queryNormalized = this.normalizeText(query);
    const queryTokens = this.tokenizeQuery(queryNormalized);
    const filtered = this.applyFilters(this.corpus);

    if (!queryNormalized && !this.hasActiveFilter()) {
      this.visibleResults = [];
      this.selectedIndex = -1;
      this.renderStatus('Start typing to search posts...');
      return;
    }

    const ranked = queryNormalized
      ? this.rankResults(filtered, queryNormalized, queryTokens)
      : filtered.map(item => ({ item, score: 0 }));
    this.visibleResults = ranked.slice(0, 24).map(result => result.item);
    if (this.selectedIndex < 0 || this.selectedIndex >= this.visibleResults.length) {
      this.selectedIndex = this.visibleResults.length ? 0 : -1;
    }
    this.renderResults();
  },

  rankResults(items, queryNormalized, queryTokens) {
    const ranked = [];

    items.forEach(item => {
      const title = item.titleNormalized;
      const tags = item.tagsNormalized;
      const excerpt = item.excerptNormalized;
      const content = item.contentNormalized;
      const blob = item.searchBlobNormalized;

      let score = 0;
      let matchedTokenCount = 0;

      if (title.includes(queryNormalized)) score += 80;
      if (tags.includes(queryNormalized)) score += 45;
      if (excerpt.includes(queryNormalized)) score += 25;
      if (content.includes(queryNormalized)) score += 12;
      if (title.startsWith(queryNormalized)) score += 20;

      queryTokens.forEach(token => {
        const inTitle = title.includes(token);
        const inTags = tags.includes(token);
        const inExcerpt = excerpt.includes(token);
        const inContent = content.includes(token);

        if (inTitle || inTags || inExcerpt || inContent) {
          matchedTokenCount += 1;
        }

        if (inTitle) score += 18;
        if (inTags) score += 10;
        if (inExcerpt) score += 6;
        if (inContent) score += 3;

        if (title.includes(` ${token} `) || title.startsWith(`${token} `) || title.endsWith(` ${token}`)) {
          score += 6;
        }
      });

      if (queryTokens.length) {
        const requiredMatches = Math.max(1, Math.ceil(queryTokens.length * 0.6));
        if (matchedTokenCount < requiredMatches && !blob.includes(queryNormalized)) return;

        const coverage = matchedTokenCount / queryTokens.length;
        score += Math.round(coverage * 30);
        if (matchedTokenCount === queryTokens.length) score += 12;
      }

      if (score <= 0) return;
      ranked.push({ item, score });
    });

    return ranked.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  },

  applyFilters(items) {
    const dateRange = this.modal.querySelector('input[name="date-range"]:checked')?.value || 'any';
    const readingTime = this.modal.querySelector('input[name="reading-time"]:checked')?.value || 'any';
    const contentTypes = Array.from(this.modal.querySelectorAll('.content-type-filter:checked')).map(el => el.value);

    const now = Date.now();

    return items.filter(item => {
      // Only include items from _posts folder (items with a date)
      if (!item.date) return false;

      if (readingTime === 'short' && item.minutes >= 5) return false;
      if (readingTime === 'medium' && (item.minutes < 5 || item.minutes > 15)) return false;
      if (readingTime === 'long' && item.minutes <= 15) return false;

      if (dateRange !== 'any') {
        const ts = Date.parse(item.date);
        if (Number.isNaN(ts)) return false;
        const day = 24 * 60 * 60 * 1000;
        const diff = now - ts;
        if (dateRange === 'week' && diff > 7 * day) return false;
        if (dateRange === 'month' && diff > 31 * day) return false;
        if (dateRange === 'year' && diff > 365 * day) return false;
      }

      if (contentTypes.length && !contentTypes.includes(item.contentType)) return false;

      return true;
    });
  },

  normalizeText(value) {
    return (value || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  tokenizeQuery(queryNormalized) {
    const unique = new Set(
      queryNormalized
        .split(/\s+/)
        .map(token => token.trim())
        .filter(Boolean)
        .filter(token => token.length > 1)
    );
    return Array.from(unique);
  },

  hasActiveFilter() {
    const dateRange = this.modal.querySelector('input[name="date-range"]:checked')?.value || 'any';
    const readingTime = this.modal.querySelector('input[name="reading-time"]:checked')?.value || 'any';
    const hasContentType = this.modal.querySelectorAll('.content-type-filter:checked').length > 0;
    return dateRange !== 'any' || readingTime !== 'any' || hasContentType;
  },

  renderStatus(message) {
    this.results.classList.add('active');
    this.results.innerHTML = `<div class="search-empty-state">${this.escapeHtml(message)}</div>`;
  },

  renderResults() {
    this.results.classList.add('active');

    if (!this.visibleResults.length) {
      this.results.innerHTML = '<div class="search-empty-state">No matching posts found.</div>';
      return;
    }

    this.results.innerHTML = this.visibleResults.map((item, index) => {
      const tagsHtml = item.tags.length
        ? `<div class="search-result-tags">${item.tags.map(tag => `<span class="search-result-tag">${this.escapeHtml(tag)}</span>`).join('')}</div>`
        : '';

      const dateHtml = item.date ? `<span class="search-result-date">${this.escapeHtml(item.date)}</span>` : '';

      return `
        <a class="search-result-item ${index === this.selectedIndex ? 'is-active' : ''}" data-index="${index}" href="${this.escapeAttr(item.url)}">
          <div class="search-result-title">${this.escapeHtml(item.title || 'Untitled')}</div>
          <div class="search-result-excerpt">${this.escapeHtml(item.excerpt || '')}</div>
          <div class="search-result-meta">
            <span class="search-result-category">${this.escapeHtml(item.contentType)}</span>
            <span>${item.words.toLocaleString()} words</span>
            <span>${item.minutes} min read</span>
            ${dateHtml}
          </div>
          ${tagsHtml}
        </a>
      `;
    }).join('');

    this.syncSelection();

    this.results.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const idx = Number(el.getAttribute('data-index'));
        if (Number.isNaN(idx)) return;
        this.selectedIndex = idx;
        this.syncSelection();
      });

      el.addEventListener('focus', () => {
        const idx = Number(el.getAttribute('data-index'));
        if (Number.isNaN(idx)) return;
        this.selectedIndex = idx;
        this.syncSelection();
      });
    });
  },

  syncSelection() {
    const nodes = Array.from(this.results.querySelectorAll('.search-result-item'));
    nodes.forEach((node, idx) => {
      node.classList.toggle('is-active', idx === this.selectedIndex);
      node.setAttribute('aria-selected', idx === this.selectedIndex ? 'true' : 'false');
    });
    const activeNode = nodes[this.selectedIndex];
    if (activeNode) activeNode.scrollIntoView({ block: 'nearest' });
  },

  escapeHtml(value) {
    if (!value) return '';
    return value
      .toString()
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  },

  escapeAttr(value) {
    return this.escapeHtml(value);
  }
};

// ====================================
// ====================================
// 12. Schema Markup (JSON‑LD)
// ====================================
const SchemaMarkup = {
  init() {
    if (!document.querySelector('article')) return;
    const title = document.querySelector('h1')?.textContent || document.title;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "url": window.location.href,
      "author": { "@type": "Person", "name": "dzungphieuluuky" }
    });
    document.head.appendChild(script);
  }
};

// ====================================
// Main Initialization
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  // Core reading experience
  ReadingProgress.init();
  ScrollToTop.init();
  SmoothAnchors.init();
  DarkMode.init();
  CodeCopy.init();
  ImageLightbox.init();
  AutoNumbering.init();
  PostTableOfContents.init();
  TocHighlight.init();
  ReadingTime.init();
  ExternalLinks.init();
  EnhancedSearch.init();
  SchemaMarkup.init();
});