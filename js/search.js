// Search Functionality
class SearchEngine {
    constructor() {
        this.searchData = {
            courses: [
                {
                    title: 'Computer Science Engineering',
                    description: 'Programming, Data Structures, Algorithms, Web Development',
                    type: 'Course',
                    fee: '₹46,000',
                    duration: '4 Years',
                    url: 'subjects/computer_courses.html'
                },
                {
                    title: 'Agriculture Science',
                    description: 'Modern farming, crop management, soil science, irrigation',
                    type: 'Course',
                    fee: '₹40,000',
                    duration: '4 Years',
                    url: 'subjects/agriculture.html'
                },
                {
                    title: 'Commerce',
                    description: 'Accounting, Business Studies, Economics, Banking',
                    type: 'Course',
                    fee: '₹35,000',
                    duration: '3 Years',
                    url: 'subjects/commerce.html'
                },
                {
                    title: 'Science',
                    description: 'Physics, Chemistry, Mathematics, Biology, Research',
                    type: 'Course',
                    fee: '₹38,000',
                    duration: '3 Years',
                    url: 'subjects/science.html'
                }
            ],
            colleges: [
                {
                    title: 'Government College, Jaipur',
                    description: 'Arts, Science and Commerce Faculty - 2,500+ Students',
                    type: 'College',
                    location: 'Jaipur',
                    url: 'college-details.html?college=jaipur'
                },
                {
                    title: 'Maharana Pratap College, Udaipur',
                    description: 'Technical and Vocational Education - 1,800+ Students',
                    type: 'College',
                    location: 'Udaipur',
                    url: 'college-details.html?college=udaipur'
                },
                {
                    title: 'Rajasthan Agriculture College, Bikaner',
                    description: 'Agricultural Science and Rural Development - 1,200+ Students',
                    type: 'College',
                    location: 'Bikaner',
                    url: 'college-details.html?college=bikaner'
                },
                {
                    title: 'Jodhpur Rural College',
                    description: 'Arts and Social Sciences - 1,500+ Students',
                    type: 'College',
                    location: 'Jodhpur',
                    url: 'college-details.html?college=jodhpur'
                },
                {
                    title: 'Kota Engineering College',
                    description: 'Engineering and Technology - 2,200+ Students',
                    type: 'College',
                    location: 'Kota',
                    url: 'college-details.html?college=kota'
                },
                {
                    title: 'Ajmer Medical College',
                    description: 'Medical and Health Sciences - 800+ Students',
                    type: 'College',
                    location: 'Ajmer',
                    url: 'college-details.html?college=ajmer'
                }
            ],
            services: [
                {
                    title: 'Live Classes',
                    description: 'Real-time interactive classes with Google Meet',
                    type: 'Service',
                    url: 'services/live-classes.html'
                },
                {
                    title: 'Recorded Lectures',
                    description: 'Download compressed videos for offline learning',
                    type: 'Service',
                    url: 'recorded-lectures.html'
                },
                {
                    title: 'Digital Library',
                    description: 'Thousands of books and resources',
                    type: 'Service',
                    url: 'services/digital-library.html'
                },
                {
                    title: 'Payment Portal',
                    description: 'Secure online fee payment with multiple options',
                    type: 'Service',
                    url: 'payment-page.html'
                }
            ]
        };
        
        this.setupSearchListeners();
    }

    setupSearchListeners() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        if (searchInput) {
            // Search on typing
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    this.performSearch(query);
                } else {
                    this.hideSearchResults();
                }
            });

            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value.trim());
                }
            });

            // Hide results when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    this.hideSearchResults();
                }
            });
        }
    }

    performSearch(query) {
        if (!query || query.length < 2) return;

        const results = this.searchInData(query);
        this.displaySearchResults(results);
        
        // Track search
        if (window.analytics) {
            window.analytics.trackSearch(query);
        }
    }

    searchInData(query) {
        const lowerQuery = query.toLowerCase();
        let results = [];

        // Search in all categories
        Object.values(this.searchData).forEach(category => {
            category.forEach(item => {
                const titleMatch = item.title.toLowerCase().includes(lowerQuery);
                const descMatch = item.description.toLowerCase().includes(lowerQuery);
                const typeMatch = item.type.toLowerCase().includes(lowerQuery);
                
                if (titleMatch || descMatch || typeMatch) {
                    results.push({
                        ...item,
                        relevance: titleMatch ? 3 : (descMatch ? 2 : 1)
                    });
                }
            });
        });

        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);
        
        return results.slice(0, 8); // Limit to 8 results
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('search-results');
        
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-result-item text-center">
                    <p class="text-muted mb-0">No results found</p>
                    <small class="text-muted">Try searching for courses, colleges, or services</small>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" onclick="window.location.href='${result.url}'">
                    <div class="search-result-title">${result.title}</div>
                    <p class="search-result-desc">${result.description}</p>
                    <span class="search-result-type">${result.type}</span>
                    ${result.fee ? `<span class="search-result-type ms-1">${result.fee}</span>` : ''}
                    ${result.location ? `<span class="search-result-type ms-1">${result.location}</span>` : ''}
                </div>
            `).join('');
        }

        searchResults.style.display = 'block';
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
}

// Global search function
function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput && window.searchEngine) {
        window.searchEngine.performSearch(searchInput.value.trim());
    }
}

// Initialize search engine
document.addEventListener('DOMContentLoaded', () => {
    window.searchEngine = new SearchEngine();
});