---
layout: page
title: Search Results
permalink: /search/
---

<div id="search-results-page" class="search-results-page">
  <div class="search-results-header">
    <h1>Search Results</h1>
    <div class="search-results-query">
      <input 
        type="text" 
        id="search-results-input" 
        class="search-results-input" 
        placeholder="Search articles and posts...">
      <span id="search-results-count" class="search-results-count"></span>
    </div>
  </div>

  <!-- Search Results Container -->
  <div id="search-results-container" class="search-results-container"></div>

  <!-- No Results Message -->
  <div id="search-no-results" class="search-no-results" style="display: none;">
    <p>No results found. Try a different search term.</p>
  </div>

  <!-- Empty State (before search) -->
  <div id="search-empty-state" class="search-empty-state">
    <p>Enter a search term above to find posts and articles.</p>
  </div>
</div>

<script>
// Dedicated search results page logic
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-results-input');
  const resultsContainer = document.getElementById('search-results-container');
  const noResultsMsg = document.getElementById('search-no-results');
  const emptyState = document.getElementById('search-empty-state');
  const resultCountSpan = document.getElementById('search-results-count');

  // Get query from URL parameters
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  if (query) {
    searchInput.value = query;
    performSearch(query);
  } else {
    emptyState.style.display = 'block';
  }

  // Handle input changes
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm) {
      performSearch(searchTerm);
      // Update URL without reloading
      window.history.replaceState(null, '', `/search/?q=${encodeURIComponent(searchTerm)}`);
    } else {
      resultsContainer.innerHTML = '';
      noResultsMsg.style.display = 'none';
      emptyState.style.display = 'block';
      resultCountSpan.textContent = '';
    }
  });

  function performSearch(searchTerm) {
    emptyState.style.display = 'none';
    resultsContainer.innerHTML = '<p class="loading">Loading results...</p>';
    
    // Load search corpus from the global EnhancedSearch module if available
    if (window.EnhancedSearch && window.EnhancedSearch.corpus && window.EnhancedSearch.corpus.length > 0) {
      displayResults(window.EnhancedSearch.corpus, searchTerm);
    } else {
      // Fallback: wait for EnhancedSearch to initialize
      const checkEnhancedSearch = setInterval(() => {
        if (window.EnhancedSearch && window.EnhancedSearch.corpus && window.EnhancedSearch.corpus.length > 0) {
          clearInterval(checkEnhancedSearch);
          displayResults(window.EnhancedSearch.corpus, searchTerm);
        }
      }, 100);
      setTimeout(() => clearInterval(checkEnhancedSearch), 5000);
    }
  }

  function displayResults(corpus, searchTerm) {
    const lowerQuery = searchTerm.toLowerCase();
    const results = corpus.filter(item => {
      const text = `${item.title} ${item.excerpt} ${item.tags || ''}`.toLowerCase();
      return text.includes(lowerQuery);
    }).slice(0, 50); // Show up to 50 results

    resultsContainer.innerHTML = '';
    noResultsMsg.style.display = results.length === 0 ? 'block' : 'none';
    resultCountSpan.textContent = results.length > 0 ? `${results.length} result${results.length !== 1 ? 's' : ''}` : '';

    if (results.length === 0) return;

    results.forEach(item => {
      const resultEl = document.createElement('div');
      resultEl.className = 'search-result-item';
      resultEl.innerHTML = `
        <a href="${item.url}" class="search-result-link">
          <h3 class="search-result-title">${item.title}</h3>
          <p class="search-result-excerpt">${item.excerpt}</p>
          <div class="search-result-meta">
            <span class="search-result-date">${item.date}</span>
            ${item.tags ? `<span class="search-result-tags">${item.tags}</span>` : ''}
          </div>
        </a>
      `;
      resultsContainer.appendChild(resultEl);
    });
  }
});
</script>

<style>
.search-results-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.search-results-header {
  margin-bottom: 3rem;
}

.search-results-header h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-family: var(--font-serif);
}

.search-results-query {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-results-input {
  flex: 1;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  transition: border-color 0.2s;
}

.search-results-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.08);
}

.search-results-count {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.search-results-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-result-item {
  padding: 1.5rem;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  transition: all 0.2s;
  cursor: pointer;
}

.search-result-item:hover {
  border-color: var(--accent-primary);
  background: rgba(63, 81, 181, 0.02);
  transform: translateX(4px);
}

.search-result-link {
  text-decoration: none;
  color: inherit;
}

.search-result-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--text-primary);
  font-family: var(--font-serif);
}

.search-result-excerpt {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0.5rem 0;
  line-height: 1.6;
  font-family: var(--font-serif);
}

.search-result-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.search-result-date {
  font-family: var(--font-sans);
}

.search-result-tags {
  font-family: var(--font-sans);
}

.search-no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
  font-family: var(--font-serif);
  font-style: italic;
}

.search-empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
  font-family: var(--font-serif);
}

.loading {
  text-align: center;
  color: var(--text-muted);
  font-family: var(--font-sans);
}
</style>
