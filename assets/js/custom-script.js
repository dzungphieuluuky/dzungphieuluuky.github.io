// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
  // Add loading animation
  document.body.classList.add('page-loading');
  
  // Smooth scroll for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(44, 62, 80, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
      } else {
        navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        navbar.style.backdropFilter = 'none';
      }
    });
  }
  
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe post previews
  const posts = document.querySelectorAll('.post-preview');
  posts.forEach(post => {
    post.style.opacity = '0';
    post.style.transform = 'translateY(30px)';
    observer.observe(post);
  });
});

// Add typing effect to title (optional)
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Apply typing effect to main title if exists
window.addEventListener('load', function() {
  const mainTitle = document.querySelector('.intro-header h1');
  if (mainTitle && mainTitle.textContent) {
    const originalText = mainTitle.textContent;
    typeWriter(mainTitle, originalText, 80);
  }
});

// ...existing code up to line 80...

// Modern Search Implementation
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('#search-input, .search-input, input[type="search"]');
  
  if (searchInput) {
    initModernSearch(searchInput);
  }
});

function initModernSearch(searchInput) {
  // Create modern search interface
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'modern-search-wrapper';
  
  // Replace original search with custom UI
  const originalParent = searchInput.parentNode;
  originalParent.insertBefore(searchWrapper, searchInput);
  
  // Create components
  const searchContainer = document.createElement('div');
  searchContainer.className = 'modern-search-container';
  
  // Add search icon
  const searchIcon = document.createElement('div');
  searchIcon.className = 'modern-search-icon';
  searchIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
  
  // Create clean input field
  const modernInput = document.createElement('input');
  modernInput.type = 'search';
  modernInput.className = 'modern-search-input';
  modernInput.placeholder = 'Search documentation...';
  modernInput.setAttribute('aria-label', 'Search');
  
  // Create results container with sections
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'modern-search-results';
  
  // Add keyboard shortcut hint
  const shortcutHint = document.createElement('div');
  shortcutHint.className = 'search-shortcut-hint';
  shortcutHint.innerHTML = '<span>Press</span> <kbd>/</kbd> <span>to search</span>';
  
  // Close button
  const closeButton = document.createElement('button');
  closeButton.className = 'modern-search-close';
  closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  closeButton.setAttribute('aria-label', 'Close search');
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'modern-search-overlay';
  
  // Assemble the components
  searchContainer.appendChild(searchIcon);
  searchContainer.appendChild(modernInput);
  searchContainer.appendChild(closeButton);
  searchWrapper.appendChild(searchContainer);
  searchWrapper.appendChild(resultsContainer);
  document.body.appendChild(overlay);
  document.body.appendChild(shortcutHint);
  
  // Remove the original search input
  if (originalParent) {
    if (searchInput.parentNode) {
      searchInput.parentNode.removeChild(searchInput);
    }
  }
  
  // Load search data
  let searchIndex = [];
  let searchCategories = {};
  
  fetch('/search-data.json')
    .then(response => response.json())
    .then(data => {
      searchIndex = data;
      // Organize data by categories
      searchIndex.forEach(item => {
        const category = item.category || 'Uncategorized';
        if (!searchCategories[category]) {
          searchCategories[category] = [];
        }
        searchCategories[category].push(item);
      });
    })
    .catch(error => {
      console.log('Search data not available, using fallback method');
      searchIndex = generateFallbackSearchData();
    });
  
  // Search activation events
  document.addEventListener('keydown', function(e) {
    // '/' key to focus search (unless in an input/textarea)
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      modernInput.focus();
      shortcutHint.style.opacity = '0';
    }
    
    // Escape to close search
    if (e.key === 'Escape') {
      closeSearch();
    }
  });
  
  // Open search on icon click
  searchIcon.addEventListener('click', function() {
    modernInput.focus();
  });
  
  // Close search when clicking close button
  closeButton.addEventListener('click', closeSearch);
  
  // Close search when clicking overlay
  overlay.addEventListener('click', closeSearch);
  
  // Input handler with debouncing
  let searchTimeout;
  modernInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    
    const query = this.value.trim();
    
    if (query.length < 2) {
      clearResults();
      hideResults();
      return;
    }
    
    // Show "searching" indicator
    resultsContainer.innerHTML = '<div class="search-loading"><div class="search-loading-spinner"></div><p>Searching...</p></div>';
    showResults();
    
    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 150); // Reduced debounce time for faster response
  });
  
  // Handle focus and blur
  modernInput.addEventListener('focus', function() {
    document.body.classList.add('search-active');
    searchWrapper.classList.add('focused');
    overlay.classList.add('visible');
    shortcutHint.style.opacity = '0';
    
    if (this.value.trim().length >= 2) {
      showResults();
    }
  });
  
  // Navigate results with keyboard
  modernInput.addEventListener('keydown', function(e) {
    const results = resultsContainer.querySelectorAll('.search-result-item');
    const activeResult = resultsContainer.querySelector('.search-result-item.active');
    
    if (results.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateResults(results, activeResult, 'next');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateResults(results, activeResult, 'prev');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeResult) {
        activeResult.click();
      }
    }
  });
  
  function performSearch(query) {
    if (searchIndex.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">Search data is still loading...</div>';
      return;
    }
    
    // Perform search with scoring
    const results = searchWithScoring(query, searchIndex);
    
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          <p>No results found for <strong>"${escapeHtml(query)}"</strong></p>
          <p>Try using different keywords or check spelling</p>
        </div>
      `;
      return;
    }
    
    // Group results by category
    const groupedResults = groupResultsByCategory(results);
    
    // Build results HTML
    renderGroupedResults(groupedResults, query);
    
    // Add click events to results
    addResultClickHandlers();
  }
  
  function searchWithScoring(query, data) {
    const terms = query.toLowerCase().split(/\s+/);
    
    return data
      .map(item => {
        // Calculate scores for different fields
        const titleScore = scoreMatches(item.title, terms) * 3; // Title matches are weighted higher
        const contentScore = scoreMatches(item.content, terms);
        const tagScore = item.tags ? scoreArrayMatches(item.tags, terms) * 2 : 0;
        
        // Combined score
        const score = titleScore + contentScore + tagScore;
        
        // Only return items with a score above zero
        return score > 0 ? { ...item, score } : null;
      })
      .filter(item => item !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15); // Limit to top 15 results
  }
  
  function scoreMatches(text, terms) {
    if (!text) return 0;
    
    const lowercaseText = text.toLowerCase();
    let score = 0;
    
    terms.forEach(term => {
      // Exact matches
      if (lowercaseText.includes(term)) {
        score += 10;
        
        // Bonus for word boundary matches
        const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i');
        if (wordBoundaryRegex.test(text)) {
          score += 5;
        }
      }
      
      // Partial matches (for longer terms)
      if (term.length > 3) {
        // Check for partial matches, minimum 3 characters
        for (let i = 3; i < term.length; i++) {
          const partial = term.substring(0, i);
          if (lowercaseText.includes(partial)) {
            score += i / term.length * 3;
            break;
          }
        }
      }
    });
    
    return score;
  }
  
  function scoreArrayMatches(array, terms) {
    if (!array || !array.length) return 0;
    
    let score = 0;
    terms.forEach(term => {
      array.forEach(item => {
        if (item.toLowerCase().includes(term)) {
          score += 5;
          
          // Exact tag match bonus
          if (item.toLowerCase() === term) {
            score += 5;
          }
        }
      });
    });
    
    return score;
  }
  
  function groupResultsByCategory(results) {
    const grouped = {};
    
    results.forEach(result => {
      const category = result.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(result);
    });
    
    return grouped;
  }
  
  function renderGroupedResults(groupedResults, query) {
    let html = '';
    
    // Count total results
    let totalResults = 0;
    Object.values(groupedResults).forEach(group => {
      totalResults += group.length;
    });
    
    html += `<div class="search-results-count">${totalResults} results found</div>`;
    
    // Add each category section
    Object.keys(groupedResults).forEach(category => {
      const results = groupedResults[category];
      
      html += `
        <div class="search-category">
          <h3 class="search-category-title">${category} (${results.length})</h3>
          <div class="search-category-results">
      `;
      
      // Add results in this category
      results.forEach(result => {
        const highlightedTitle = highlightTerms(result.title, query);
        const highlightedExcerpt = highlightTerms(truncateText(result.content || '', 150), query);
        
        html += `
          <a href="${result.url}" class="search-result-item" data-score="${result.score.toFixed(1)}">
            <div class="search-result-title">${highlightedTitle}</div>
            <div class="search-result-excerpt">${highlightedExcerpt}</div>
            ${result.tags && result.tags.length ? `
              <div class="search-result-tags">
                ${result.tags.slice(0, 3).map(tag => `<span class="search-tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </a>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    resultsContainer.innerHTML = html;
  }
  
  function highlightTerms(text, query) {
    if (!text) return '';
    
    const terms = query.toLowerCase().split(/\s+/).filter(term => term.length >= 2);
    let highlightedText = escapeHtml(text);
    
    terms.forEach(term => {
      const regex = new RegExp(escapeRegExp(term), 'gi');
      highlightedText = highlightedText.replace(regex, match => `<mark>${match}</mark>`);
    });
    
    return highlightedText;
  }
  
  function navigateResults(results, activeResult, direction) {
    if (activeResult) {
      activeResult.classList.remove('active');
    }
    
    let nextIndex = 0;
    
    if (activeResult) {
      const currentIndex = Array.from(results).indexOf(activeResult);
      if (direction === 'next') {
        nextIndex = (currentIndex + 1) % results.length;
      } else {
        nextIndex = (currentIndex - 1 + results.length) % results.length;
      }
    }
    
    results[nextIndex].classList.add('active');
    results[nextIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  
  function showResults() {
    resultsContainer.style.display = 'block';
    overlay.classList.add('visible');
  }
  
  function hideResults() {
    resultsContainer.style.display = 'none';
    overlay.classList.remove('visible');
  }
  
  function clearResults() {
    resultsContainer.innerHTML = '';
  }
  
  function closeSearch() {
    modernInput.value = '';
    clearResults();
    hideResults();
    document.body.classList.remove('search-active');
    searchWrapper.classList.remove('focused');
    modernInput.blur();
    setTimeout(() => {
      shortcutHint.style.opacity = '1';
    }, 300);
  }
  
  function addResultClickHandlers() {
    const resultItems = resultsContainer.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // Track analytics if needed
        // analyticsTrackSearchClick(item.getAttribute('href'), modernInput.value);
      });
    });
  }
  
  function generateFallbackSearchData() {
    const posts = document.querySelectorAll('article, .post-preview, .post');
    return Array.from(posts).map(post => {
      const titleEl = post.querySelector('h1, h2, h3, .post-title');
      const contentEl = post.querySelector('p, .post-content, .post-excerpt');
      const linkEl = post.querySelector('a');
      const dateEl = post.querySelector('.post-date, .date, time');
      const tagsEl = post.querySelectorAll('.tag, .post-tag');
      
      return {
        title: titleEl ? titleEl.textContent.trim() : 'Untitled',
        content: contentEl ? contentEl.textContent.trim() : '',
        url: linkEl ? linkEl.href : '#',
        date: dateEl ? dateEl.textContent.trim() : '',
        tags: tagsEl ? Array.from(tagsEl).map(tag => tag.textContent.trim()) : [],
        category: 'Blog Posts'
      };
    });
  }
  
  // Helper functions
  function truncateText(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}