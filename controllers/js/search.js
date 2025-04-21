document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.navbar')) {
      enhanceSearchFunction();
    } else {
      const originalInitNavbar = window.initNavbar;
      
      window.initNavbar = function(containerId = 'navbar-container') {
        originalInitNavbar(containerId);
        enhanceSearchFunction();
      };
    }
  });
  
  function enhanceSearchFunction() {
    const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
    const BASE_URL = "https://api.themoviedb.org/3";
    const searchInput = document.querySelector('.input-search');
    const navbar = document.querySelector('.navbar');

    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.display = 'none';
    navbar.parentNode.insertBefore(searchResults, navbar.nextSibling);
    
    function debounce(func, delay) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    const searchMovies = async (query) => {
      if (!query || query.trim() === '') {
        searchResults.style.display = 'none';
        return;
      }
      
      try {
        const response = await fetch(
          `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          displaySearchResults(data.results.slice(0, 5));
        } else {
          searchResults.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
          searchResults.style.display = 'block';
        }
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        searchResults.innerHTML = '<div class="no-results">Une erreur est survenue</div>';
        searchResults.style.display = 'block';
      }
    };

    const displaySearchResults = (movies) => {
      searchResults.innerHTML = '';
      
      movies.forEach(movie => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        
        const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
        const posterPath = movie.poster_path 
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : 'https://via.placeholder.com/50x75?text=No+Image';

        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        
        resultItem.innerHTML = `
          <img src="${posterPath}" alt="${movie.title}">
          <div class="search-result-info">
            <h4>${movie.title}</h4>
            <p>${releaseYear}</p>
            <div class="search-result-rating">
              <i class="fas fa-star"></i> ${rating}/10
            </div>
          </div>
        `;
        
        resultItem.addEventListener('click', () => {
          window.location.href = `/Movela/views/details.html?id=${movie.id}&type=movie`;
        });
        
        searchResults.appendChild(resultItem);
      });
      
      searchResults.style.display = 'block';
    };

    const debouncedSearch = debounce((value) => {
      searchMovies(value);
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });
    
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim() !== '') {
        searchMovies(searchInput.value);
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      const items = searchResults.querySelectorAll('.search-result-item');
      
      if (items.length === 0) return;

      if (e.key === 'Enter' && items.length > 0) {
        e.preventDefault();
        const firstItemLink = items[0].getAttribute('data-movie-id');
        if (firstItemLink) {
          window.location.href = `details.html?id=${firstItemLink}`;
        }
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[0].focus();
      } else if (e.key === 'Escape') {
        searchResults.style.display = 'none';
      }
    });
    
    searchResults.addEventListener('keydown', (e) => {
      const items = Array.from(searchResults.querySelectorAll('.search-result-item'));
      const currentIndex = items.indexOf(document.activeElement);
      
      if (currentIndex !== -1) {
        if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
          e.preventDefault();
          items[currentIndex + 1].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (currentIndex > 0) {
            items[currentIndex - 1].focus();
          } else {
            searchInput.focus();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          items[currentIndex].click();
        }
      }
    });
  }