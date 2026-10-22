---
layout: page
title: Search
permalink: /search/
---

<div class="search-results-page">
  <input
    type="text"
    id="search-results-input"
    class="search-results-input"
    placeholder="Search posts..."
    autocomplete="off">

  <div id="search-results-container" class="search-results-container"></div>
</div>

<script>
  // Uses the shared module in custom-script.js (loaded after this page).
  const startSearchPage = async () => {
    const search = window.SiteSearch;
    const input = document.getElementById('search-results-input');
    const out = document.getElementById('search-results-container');
    if (!search || !input || !out) return;

    await search.load();
    input.value = new URLSearchParams(location.search).get('q') || '';

    const draw = () => {
      const query = input.value.trim();
      const items = search.search(query);
      out.innerHTML = !query
        ? '<p class="search-empty-state">Type to search posts.</p>'
        : items.length === 0
          ? '<p class="search-empty-state">No matching posts.</p>'
          : items.map((item) => `
            <a class="search-result-item" href="${search.escape(item.url)}">
              <div class="search-result-title">${search.escape(item.title || 'Untitled')}</div>
              <div class="search-result-excerpt">${search.escape(item.excerpt || '')}</div>
              <div class="search-result-meta">
                ${item.date ? `<span>${search.escape(item.date)}</span>` : ''}
                ${item.category ? `<span>${search.escape(item.category)}</span>` : ''}
              </div>
            </a>`).join('');
      history.replaceState(null, '', query ? `?q=${encodeURIComponent(query)}` : location.pathname);
    };

    input.addEventListener('input', draw);
    draw();
  };

  if (window.SiteSearch) {
    startSearchPage();
  } else {
    document.addEventListener('sitesearch:ready', startSearchPage, { once: true });
  }
</script>
