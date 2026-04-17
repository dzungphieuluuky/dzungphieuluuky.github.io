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
// 7. Navbar Scroll Effect
// ====================================
const NavbarScroll = {
  init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }
};

// ====================================
// 8. Post Table of Contents (HedgeDoc/HackMD style)
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
// 9. Reading Time & Word Count
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
// 10. Auto‑Numbering Headers
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
// 11. Post Preview Click (archive)
// ====================================
const PostPreviewClick = {
  init() {
    document.querySelectorAll('.post-preview').forEach(preview => {
      const link = preview.querySelector('a[href]');
      if (!link) return;
      preview.addEventListener('click', (e) => {
        if (e.target.closest('a') && e.target.closest('a') !== link) return;
        window.location.href = link.href;
      });
    });
  }
};

// ====================================
// 12. External Links Security
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
// 13. Image Protection (prevent drag/right-click)
// ====================================
const ImageProtection = {
  init() {
    document.querySelectorAll('article img, .post-content img').forEach(img => {
      img.setAttribute('draggable', 'false');
      img.addEventListener('dragstart', e => e.preventDefault());
      img.addEventListener('contextmenu', e => e.preventDefault());
    });
  }
};

// ====================================
// 14. Font Loader Check (optional fallback)
// ====================================
const FontLoaderCheck = { init: () => {} }; // stub – keep if you like

// ====================================
// 15. SVGDashboardRenderer (stub)
// ====================================
const SVGDashboardRenderer = { init: () => {} };

// ====================================
// 16. Schema Markup (JSON‑LD)
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
// 17. Related Posts (optional stub)
// ====================================
const RelatedPosts = { init: () => {} };

// ====================================
// 18. Breadcrumb Navigation (optional)
// ====================================
const BreadcrumbNav = { init: () => {} };

// ====================================
// Main Initialization
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  // Core reading experience
  ReadingProgress.init();
  ScrollToTop.init();
  SmoothAnchors.init();
  DarkMode.init();
  PostPreviewClick.init();
  CodeCopy.init();
  ImageLightbox.init();
  NavbarScroll.init();
  AutoNumbering.init();
  PostTableOfContents.init();
  TocHighlight.init();
  ReadingTime.init();
  ExternalLinks.init();
  ImageProtection.init();
  FontLoaderCheck.init();
  SVGDashboardRenderer.init();
  SchemaMarkup.init();
  RelatedPosts.init();
  BreadcrumbNav.init();
});