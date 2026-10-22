// ====================================
// 0. Configuration
// ====================================
const CONFIG = {
  WORDS_PER_MINUTE: 238,
  THEME_STORAGE_KEY: 'sjbz-theme-preference',
  ANNOUNCE_TO_SCREEN_READERS: true,
};

const escapeHtml = (value) => (value || '').toString()
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

// Strip diacritics so "thach" finds "thách".
const normalize = (value) => (value || '').toString()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/\s+/g, ' ')
  .trim();

// ====================================
// 1. Dark Mode
// ====================================
const DarkMode = {
  init() {
    this.btn = document.querySelector('#theme-toggle');
    this.apply(this.preferred());
    if (!this.btn) return;
    this.btn.addEventListener('click', () => {
      const isDark = !document.documentElement.classList.contains('dark-mode');
      this.apply(isDark);
      localStorage.setItem(CONFIG.THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
      this.announce(isDark);
    });
  },

  preferred() {
    const stored = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
    return stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  apply(isDark) {
    const root = document.documentElement;
    root.classList.toggle('dark-mode', isDark);
    root.classList.toggle('light-mode', !isDark);
    this.btn?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  },

  announce(isDark) {
    if (!CONFIG.ANNOUNCE_TO_SCREEN_READERS) return;
    const live = document.createElement('div');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    live.textContent = isDark ? 'Switched to dark mode' : 'Switched to light mode';
    document.body.appendChild(live);
    setTimeout(() => live.remove(), 1000);
  },
};

// Apply the stored theme before paint to avoid a flash.
(() => {
  const stored = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
  const isDark = stored
    ? stored === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.add(isDark ? 'dark-mode' : 'light-mode');
})();

// ====================================
// 2. Code Copy Button
// ====================================
const CodeCopy = {
  init() {
    document.querySelectorAll('pre code').forEach((block) => {
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
        setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
      } catch {
        btn.textContent = 'Error';
      }
    });
  },
};

// ====================================
// 3. Image Lightbox
// ====================================
const ImageLightbox = {
  init() {
    const images = document.querySelectorAll('article img, .post-content img');
    if (!images.length) return;
    this.create();
    images.forEach((img) => { img.style.cursor = 'zoom-in'; });
    document.addEventListener('click', (e) => {
      const img = e.target.closest('article img, .post-content img');
      if (img && !img.closest('.lightbox')) this.open(img);
    });
  },

  create() {
    this.el = document.createElement('div');
    this.el.className = 'lightbox';
    this.el.innerHTML = `
      <div class="lightbox-close">×</div>
      <div class="lightbox-content"><img src="" alt=""><div class="lightbox-caption"></div></div>
    `;
    document.body.appendChild(this.el);
    this.el.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.el.addEventListener('click', (e) => { if (e.target === this.el) this.close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.el.classList.contains('active')) this.close();
    });
  },

  open(img) {
    const target = this.el.querySelector('img');
    target.src = img.src;
    target.alt = img.alt || '';
    this.el.querySelector('.lightbox-caption').textContent = img.alt || '';
    this.el.classList.add('active');
    document.body.classList.add('overflow-hidden');
  },

  close() {
    this.el.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  },
};

// ====================================
// 4. Post Table of Contents
// ====================================
const PostTableOfContents = {
  init() {
    const article = document.querySelector('article');
    const headings = article?.querySelectorAll('h1[id], h2[id], h3[id]') || [];
    if (!headings.length) return;

    const box = document.createElement('details');
    box.className = 'post-toc-box';
    box.open = true;
    box.innerHTML = `
      <summary class="post-toc-title">Contents</summary>
      <ul class="post-toc-list">
        ${Array.from(headings).map((h) => `
          <li class="toc-${h.tagName.toLowerCase()}">
            <a href="#${h.id}">${h.textContent.replace(/^\d+\.?\s*/, '').trim()}</a>
          </li>`).join('')}
      </ul>
    `;

    const anchor = article.querySelector(':scope > .metadata-bar');
    if (anchor) anchor.insertAdjacentElement('afterend', box);
    else article.prepend(box);
  },
};

// ====================================
// 5. External Links
// ====================================
const ExternalLinks = {
  init() {
    document.querySelectorAll('a[href]').forEach((link) => {
      try {
        const url = new URL(link.href, document.baseURI);
        if (url.origin === window.location.origin || link.target === '_self') return;
        link.setAttribute('target', '_blank');
        const rel = new Set((link.getAttribute('rel') || '').split(/\s+/));
        rel.add('noopener');
        rel.add('noreferrer');
        link.setAttribute('rel', Array.from(rel).join(' '));
      } catch {}
    });
  },
};

// ====================================
// 6. Search (modal and /search/ page share this)
// ====================================
const EnhancedSearch = {
  index: -1,
  corpus: [],
  loaded: false,

  init() {
    this.modal = document.getElementById('search-modal');
    this.input = this.modal?.querySelector('.search-input');
    this.results = document.getElementById('search-results');
    if (!this.modal || !this.input || !this.results) return;

    document.querySelectorAll('.search-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => { e.preventDefault(); this.open(); });
    });
    this.modal.querySelector('.search-modal-close')?.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => { if (e.target === this.modal) this.close(); });
    this.input.addEventListener('input', () => { this.index = -1; this.render(); });
    this.input.addEventListener('keydown', (e) => this.onKey(e));
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    window.SiteSearch = this;
    document.dispatchEvent(new Event('sitesearch:ready'));
  },

  isOpen() { return this.modal.classList.contains('active'); },

  async open() {
    this.modal.classList.add('active');
    document.body.classList.add('overflow-hidden');
    this.input.focus();
    await this.load();
    this.render();
  },

  close() {
    this.modal.classList.remove('active');
    if (!document.querySelector('.lightbox.active')) {
      document.body.classList.remove('overflow-hidden');
    }
    this.index = -1;
  },

  async load() {
    if (this.loaded) return;
    this.loaded = true;
    const base = (document.querySelector('meta[name="baseurl"]')?.content || '').replace(/\/$/, '');
    try {
      const res = await fetch(`${base}/assets/data/searchcorpus.json`);
      this.corpus = res.ok ? await res.json() : [];
    } catch {
      this.corpus = [];
    }
  },

  search(query) {
    const q = normalize(query);
    if (!q) return [];
    return this.corpus
      .map((item) => ({
        item,
        rank: normalize(item.title).includes(q) ? 2
          : normalize(`${item.excerpt} ${item.category}`).includes(q) ? 1 : 0,
      }))
      .filter((r) => r.rank)
      .sort((a, b) => b.rank - a.rank)
      .map((r) => r.item);
  },

  render() {
    this.results.classList.add('active');
    const query = this.input.value.trim();
    if (!query) {
      this.results.innerHTML = '<div class="search-empty-state">Type to search posts.</div>';
      return;
    }
    const items = this.search(query);
    if (!items.length) {
      this.results.innerHTML = '<div class="search-empty-state">No matching posts.</div>';
      return;
    }
    this.results.innerHTML = items.slice(0, 20).map((item, i) => `
      <a class="search-result-item${i === this.index ? ' is-active' : ''}" href="${escapeHtml(item.url)}">
        <div class="search-result-title">${escapeHtml(item.title || 'Untitled')}</div>
        <div class="search-result-excerpt">${escapeHtml(item.excerpt || '')}</div>
        <div class="search-result-meta">
          ${item.date ? `<span>${escapeHtml(item.date)}</span>` : ''}
          ${item.category ? `<span>${escapeHtml(item.category)}</span>` : ''}
        </div>
      </a>`).join('');
    this.results.querySelectorAll('.search-result-item').forEach((el, i) => {
      el.addEventListener('mouseenter', () => { this.index = i; this.sync(); });
    });
  },

  escape(value) { return escapeHtml(value); },

  sync() {
    this.results.querySelectorAll('.search-result-item')
      .forEach((el, i) => el.classList.toggle('is-active', i === this.index));
  },

  onKey(e) {
    if (e.key === 'Escape') return this.close();
    const items = this.results.querySelectorAll('.search-result-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.index = e.key === 'ArrowDown'
        ? (this.index + 1) % items.length
        : (this.index - 1 + items.length) % items.length;
      this.sync();
      items[this.index].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && this.index >= 0) {
      e.preventDefault();
      items[this.index].click();
    }
  },
};

// ====================================
// 7. Schema Markup (JSON-LD)
// ====================================
const SchemaMarkup = {
  init() {
    if (!document.querySelector('article')) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: document.querySelector('h1')?.textContent || document.title,
      url: window.location.href,
      author: { '@type': 'Person', name: 'dzungphieuluuky' },
    });
    document.head.appendChild(script);
  },
};

// ====================================
// Main Initialization
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  DarkMode.init();
  CodeCopy.init();
  ImageLightbox.init();
  PostTableOfContents.init();
  ExternalLinks.init();
  EnhancedSearch.init();
  SchemaMarkup.init();
});
