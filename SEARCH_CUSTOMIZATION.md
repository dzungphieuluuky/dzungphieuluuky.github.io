# Search Modal Developer Quick Reference

## 🔧 Quick Customization Guide

### 1. Change Semantic Intent Matching Rules

**File**: `assets/js/custom-script.js` (Line ~900)

```javascript
_matchesSemanticIntent(query, item) {
  const intentMap = {
    'grow|scale|expand|business|revenue': ['marketing', 'sales', 'strategy', 'hiring'],
    'learn|teach|tutorial|guide': ['educational', 'learning', 'beginner'],
    'debug|error|fix|issue': ['troubleshoot', 'solution', 'workaround'],
    'performance|speed|optimize': ['efficiency', 'optimization', 'fast'],
    // ADD YOUR OWN PATTERNS HERE:
    'machine|learning|neural': ['deep learning', 'AI', 'tensorflow'],
    'deploy|production|scale': ['docker', 'kubernetes', 'devops']
  };
  // ... rest of method
}
```

### 2. Adjust Reading Time Thresholds

**File**: `assets/js/custom-script.js` (Lines ~890-900 in _applyReadingTimeFilter)

```javascript
// Current: short < 5, medium 5-15, long > 15
if (this.currentFilters.readingTime === 'short') return time < 3;    // Change to 3
if (this.currentFilters.readingTime === 'medium') return time >= 3 && time < 10;  // 3-10
if (this.currentFilters.readingTime === 'long') return time >= 10;   // > 10
```

### 3. Change Default Trending Display Count

**File**: `assets/js/custom-script.js` (Line ~950)

```javascript
_showTrendingAndPopular() {
  // Shows top 6 by default
  html += this.trendingTerms.slice(0, 6).map((term) => ...
  // Change 6 to any number for more/fewer suggestions
}
```

### 4. Modify Max Results Displayed

**File**: `assets/js/custom-script.js` (Line ~1030)

```javascript
_displayResults(results) {
  // Limit to top 8 results by default
  const displayResults = results.slice(0, 8);
  // Change 8 to show more/fewer results
}
```

### 5. Add New Content Types

**File**: `assets/js/custom-script.js` and `_includes/search.html`

In JavaScript (`_detectContentType` method):
```javascript
_detectContentType(item) {
  const url = item.url.toLowerCase();
  // Add this:
  if (url.includes('/podcast')) return 'Podcast';
  if (url.includes('/video')) return 'Video';
  if (url.includes('/interview')) return 'Interview';
  // ... rest
}
```

In HTML (`_includes/search.html`):
```html
<!-- Content Type Filter -->
<div class="search-filter-checkbox">
  <input type="checkbox" class="content-type-filter" value="Podcast"> Podcast
</div>
<div class="search-filter-checkbox">
  <input type="checkbox" class="content-type-filter" value="Video"> Video
</div>
<div class="search-filter-checkbox">
  <input type="checkbox" class="content-type-filter" value="Interview"> Interview
</div>
```

### 6. Change Words Per Minute (Reading Time Calculation)

**File**: `assets/js/custom-script.js` (Line ~780)

```javascript
_computeReadingTime(content) {
  const wordsPerMinute = 200;  // Change this to 150, 250, etc.
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

### 7. Customize Stop Words for Keyword Extraction

**File**: `assets/js/custom-script.js` (Line ~810)

```javascript
_extractKeywords(item) {
  const stopWords = new Set([
    'the', 'a', 'an', // ... existing words
    'mycompanyname', 'special-word'  // Add your domain-specific words
  ]);
  // ... rest
}
```

---

## 📊 Event Listeners & Hooks

### Listen to Search Events

```javascript
// Customize what happens when modal opens
EnhancedSearch.open = function() {
  // Your custom logic here
  // Then call original
  Object.getPrototypeOf(this).open.call(this);
}

// Track custom search events
EnhancedSearch._handleSearch = function(e) {
  const query = this.input.value.trim();
  // Send to analytics service
  gtag('event', 'search', { search_term: query });
  // ... rest of original
}
```

### Access Analytics Data

```javascript
// Get all searches
console.log(EnhancedSearch.searchAnalytics);

// Find most popular
const popular = Object.entries(EnhancedSearch.searchAnalytics)
  .sort(([,a], [,b]) => b - a)[0];

// Export to server
fetch('/api/analytics', {
  method: 'POST',
  body: JSON.stringify(EnhancedSearch.searchAnalytics)
});
```

---

## 🎨 CSS Customization

### Change Filter Panel Colors

**File**: `assets/css/custom-styles.css`

```css
.search-modal .search-filters-toggle {
  /* Hover background */
  background: rgba(0, 0, 0, 0.04);
}

.search-modal .search-filters-toggle:hover {
  background: rgba(0, 0, 0, 0.08);  /* Make darker */
}
```

### Customize Keyword Highlight Color

```css
.search-modal .search-result-excerpt mark {
  background: rgba(92, 138, 60, 0.25);  /* Change this color */
  padding: 0.1em 0.2em;
}
```

### Style Trending Terms Differently

```css
.search-modal .trending-term {
  background: linear-gradient(to right, #f0f0f0, #fafafa);  /* Add gradient */
  border: 2px solid #ddd;  /* Thicker border */
  transform: scale(1);
  transition: transform 0.2s;
}

.search-modal .trending-term:hover {
  transform: scale(1.05);  /* Grow on hover */
}
```

---

## 🧪 Testing & Debugging

### Enable Debug Mode

```javascript
// In browser console
const originalLog = console.log;
EnhancedSearch.debug = true;

// Patch search to log scores
EnhancedSearch._performSearch = function(query) {
  const results = /* ... computation ... */;
  if (this.debug) {
    results.forEach(r => console.log(`${r.title}: ${r.score}`));
  }
  return results;
}
```

### Inspect Search Corpus

```javascript
// In browser console
console.table(EnhancedSearch.corpusProcessed.slice(0, 5));

// See trending terms
console.log(EnhancedSearch.trendingTerms);

// See filter state
console.log(EnhancedSearch.currentFilters);

// See all searches logged
console.log(JSON.parse(localStorage.getItem('searchAnalytics')));
```

### Test Semantic Matching

```javascript
// Test if query matches semantic intent
const testItem = EnhancedSearch.corpusProcessed[0];
const matches = EnhancedSearch._matchesSemanticIntent('grow a business', testItem);
console.log('Semantic match:', matches);
```

---

## 🔌 Integration Points

### Send Searches to External Analytics

```javascript
// Add this to _handleSearch():
const query = this.input.value.trim();

// Send to Google Analytics
gtag('event', 'search', { search_term: query });

// Send to Mixpanel
mixpanel.track('Search', { query: query });

// Send to custom server
fetch('/api/search-log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, timestamp: new Date().toISOString() })
});
```

### Integrate with External Search Service

```javascript
// Replace _performSearch with Algolia call:
async _performSearch(query) {
  const results = await algoliasearch.search(query, {
    facets: ['contentType', 'readingTime']
  });
  return results.hits;
}
```

### Connect to Recommendation Engine

```javascript
// Show "related posts" based on search
_displayResults(results) {
  if (results.length > 0) {
    const topResult = results[0];
    // Call recommendation API
    fetch(`/api/related?to=${topResult.url}`)
      .then(r => r.json())
      .then(related => {
        // Show related posts below top result
      });
  }
}
```

---

## ⚡ Performance Optimization

### For Large Corpus (> 1000 items)

```javascript
// Add debouncing to search input
let searchTimeout;
this.input.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    this._handleSearch(e);
  }, 300);  // Wait 300ms before searching
});

// Or use Worker for heavy computation
const searchWorker = new Worker('search-worker.js');
searchWorker.postMessage({ corpus: this.corpus, query });
searchWorker.onmessage = (e) => this._displayResults(e.data);
```

### Cache Scoring Results

```javascript
this.scoreCache = new Map();

_performSearch(query) {
  if (this.scoreCache.has(query)) {
    return this.scoreCache.get(query);
  }
  
  const results = /* ... compute scores ... */;
  this.scoreCache.set(query, results);
  return results;
  
  // Clear cache periodically
  if (this.scoreCache.size > 100) {
    this.scoreCache.clear();
  }
}
```

---

## 🐛 Common Issues & Fixes

### Issue: Search results empty

```javascript
// Check if corpus loaded
console.log(EnhancedSearch.corpusProcessed.length);

// Verify fetch endpoint
fetch('/assets/data/searchcorpus.json')
  .then(r => r.json())
  .then(data => console.log('Corpus loaded:', data.length));
```

### Issue: Filters not working

```javascript
// Ensure _setupFilters() was called
console.log(
  document.querySelectorAll('input[name="date-range"]').length
);

// Re-initialize filters manually
EnhancedSearch._setupFilters();
```

### Issue: Keyword highlighting not showing

```javascript
// Check CSS is loaded
console.log(
  getComputedStyle(document.querySelector('mark')).backgroundColor
);

// Verify results contain HTML
console.log(EnhancedSearch.resultsContainer.innerHTML);
```

---

## 📚 Advanced Customization

### Implement Custom Scoring Algorithm

```javascript
_performSearch(query) {
  let results = this.corpusProcessed.map((item) => {
    let score = 0;
    
    // Your custom scoring logic:
    // - Machine learning ranking
    // - BM25 algorithm
    // - TF-IDF scoring
    // - Your proprietary algorithm
    
    return { ...item, score };
  });
  
  return results.filter(r => r.score > 0).sort((a,b) => b.score - a.score);
}
```

### Add Machine Learning Ranking

```javascript
// Use TensorFlow.js for neural ranking
async _performSearch(query) {
  const model = await tf.loadLayersModel('indexeddb://search-model');
  
  let results = this.corpusProcessed.map((item) => {
    const features = this._extractFeatures(query, item);
    const score = model.predict(features);
    return { ...item, score };
  });
  
  return results.filter(r => r.score > 0).sort((a,b) => b.score - a.score);
}
```

---

## 📖 Reference: Method Signatures

```javascript
// Public methods
EnhancedSearch.init()                           // Initialize module
EnhancedSearch.open()                           // Show modal
EnhancedSearch.close()                          // Hide modal
EnhancedSearch._handleSearch(e)                 // Process search
EnhancedSearch._performSearch(query)            // Score & rank
EnhancedSearch._applyFilters(results)           // Filter results

// Filter methods  
EnhancedSearch._setupFilters()                  // Wire up UI
EnhancedSearch._applyDateRangeFilter(range)     // Date filter
EnhancedSearch._applyReadingTimeFilter(range)   // Time filter
EnhancedSearch._applyContentTypeFilter()        // Type filter

// Semantic methods
EnhancedSearch._matchesSemanticIntent(query, item)
EnhancedSearch._extractKeywords(item)
EnhancedSearch._computeTrendingTerms()

// UI methods
EnhancedSearch._displayResults(results)         // Render UI
EnhancedSearch._showTrendingAndPopular()        // Show suggestions
EnhancedSearch._showNoResults()                 // No results page
EnhancedSearch._handleKeyboard(e)               // Keyboard nav

// Data processing
EnhancedSearch._computeReadingTime(content)
EnhancedSearch._detectContentType(item)
EnhancedSearch._highlightKeyword(text, keyword)
```

---

## 🎯 Next Steps

1. **Test thoroughly** on your site with real content
2. **Customize semantic patterns** for your niche
3. **Set up analytics** to track what readers search for
4. **Iterate based on data** - content gaps → new posts
5. **Consider Algolia** if corpus grows beyond 5000 items
6. **Add A/B testing** for filter UX improvements
7. **Monitor user feedback** on search experience

Enjoy your new search experience! 🚀
