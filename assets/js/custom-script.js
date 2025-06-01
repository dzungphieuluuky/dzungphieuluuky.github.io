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

// Enhanced Search Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create enhanced search if search input exists
  const searchInput = document.querySelector('#search-input, .search-input, input[type="search"]');
  
  if (searchInput) {
    createEnhancedSearch(searchInput);
  }
});

function createEnhancedSearch(searchInput) {
  // Create search container
  const searchContainer = document.createElement('div');
  searchContainer.className = 'enhanced-search-container';
  searchInput.parentNode.insertBefore(searchContainer, searchInput);
  searchContainer.appendChild(searchInput);
  
  // Create search results dropdown
  const resultsDropdown = document.createElement('div');
  resultsDropdown.className = 'search-results-dropdown';
  searchContainer.appendChild(resultsDropdown);
  
  // Create search overlay
  const searchOverlay = document.createElement('div');
  searchOverlay.className = 'search-overlay';
  document.body.appendChild(searchOverlay);
  
  // Load posts data for search
  let postsData = [];
  
  // Fetch posts data (you'll need to create this JSON file)
  fetch('/search-data.json')
    .then(response => response.json())
    .then(data => {
      postsData = data;
    })
    .catch(error => {
      console.log('Search data not found, using fallback');
      // Fallback: scrape existing post links
      postsData = scrapePostsFromPage();
    });
  
  // Enhanced search with debouncing
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    const query = this.value.trim();
    
    if (query.length < 2) {
      hideSearchResults();
      return;
    }
    
    // Add loading state
    searchInput.classList.add('searching');
    
    searchTimeout = setTimeout(() => {
      performSearch(query, postsData, resultsDropdown);
      searchInput.classList.remove('searching');
    }, 300);
  });
  
  // Handle search focus/blur
  searchInput.addEventListener('focus', function() {
    this.parentElement.classList.add('search-focused');
    if (this.value.length >= 2) {
      showSearchResults();
    }
  });
  
  searchInput.addEventListener('blur', function() {
    setTimeout(() => {
      this.parentElement.classList.remove('search-focused');
      hideSearchResults();
    }, 200);
  });
  
  // Keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    const results = resultsDropdown.querySelectorAll('.search-result-item');
    const activeItem = resultsDropdown.querySelector('.search-result-item.active');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateResults(results, activeItem, 'down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateResults(results, activeItem, 'up');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeItem) {
        activeItem.click();
      }
    } else if (e.key === 'Escape') {
      hideSearchResults();
      this.blur();
    }
  });
  
  function performSearch(query, data, container) {
    const results = fuzzySearch(query, data);
    displaySearchResults(results, container, query);
  }
  
  function fuzzySearch(query, data) {
    const lowerQuery = query.toLowerCase();
    
    return data.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const contentMatch = post.content && post.content.toLowerCase().includes(lowerQuery);
      const tagMatch = post.tags && post.tags.some(tag => 
        tag.toLowerCase().includes(lowerQuery)
      );
      const categoryMatch = post.category && post.category.toLowerCase().includes(lowerQuery);
      
      return titleMatch || contentMatch || tagMatch || categoryMatch;
    }).slice(0, 8); // Limit results
  }
  
  function displaySearchResults(results, container, query) {
    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-no-results">
          <i class="fas fa-search"></i>
          <p>No results found for "${query}"</p>
        </div>
      `;
    } else {
      container.innerHTML = results.map(post => `
        <a href="${post.url}" class="search-result-item">
          <div class="search-result-content">
            <h4 class="search-result-title">${highlightText(post.title, query)}</h4>
            <p class="search-result-excerpt">${highlightText(post.excerpt || '', query)}</p>
            <div class="search-result-meta">
              <span class="search-result-date">${post.date}</span>
              ${post.tags ? `<div class="search-result-tags">
                ${post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>` : ''}
            </div>
          </div>
        </a>
      `).join('');
    }
    
    showSearchResults();
  }
  
  function highlightText(text, query) {
    if (!text) return '';
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  function navigateResults(results, activeItem, direction) {
    if (activeItem) {
      activeItem.classList.remove('active');
    }
    
    let newIndex = 0;
    if (activeItem) {
      const currentIndex = Array.from(results).indexOf(activeItem);
      newIndex = direction === 'down' 
        ? (currentIndex + 1) % results.length
        : (currentIndex - 1 + results.length) % results.length;
    }
    
    if (results[newIndex]) {
      results[newIndex].classList.add('active');
      results[newIndex].scrollIntoView({ block: 'nearest' });
    }
  }
  
  function showSearchResults() {
    resultsDropdown.style.display = 'block';
    searchOverlay.style.display = 'block';
    setTimeout(() => {
      resultsDropdown.classList.add('show');
      searchOverlay.classList.add('show');
    }, 10);
  }
  
  function hideSearchResults() {
    resultsDropdown.classList.remove('show');
    searchOverlay.classList.remove('show');
    setTimeout(() => {
      resultsDropdown.style.display = 'none';
      searchOverlay.style.display = 'none';
    }, 300);
  }
  
  function scrapePostsFromPage() {
    const postElements = document.querySelectorAll('.post-preview, article');
    return Array.from(postElements).map(post => ({
      title: post.querySelector('h1, h2, h3, .post-title')?.textContent || 'Untitled',
      url: post.querySelector('a')?.href || '#',
      excerpt: post.querySelector('.post-subtitle, .excerpt, p')?.textContent?.slice(0, 150) || '',
      date: post.querySelector('.post-meta, .date')?.textContent || '',
      tags: []
    }));
  }
}