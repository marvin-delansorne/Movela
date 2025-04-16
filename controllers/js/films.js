document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
    const BASE_URL = 'https://api.themoviedb.org/3';
    const categoriesContainer = document.getElementById('categories-container');
    const genreButton = document.getElementById('genre-filter-button');
    const genreDropdown = document.getElementById('genre-dropdown');
    
    let allGenres = [];
    let selectedGenreId = null;

    const featuredCategories = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Aventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comédie' },
        { id: 80, name: 'Crime' },
        { id: 18, name: 'Drame' },
        { id: 14, name: 'Fantastique' },
        { id: 27, name: 'Horreur' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science-Fiction' },
        { id: 53, name: 'Thriller' },
        { id: 37, name: 'Western' }
    ];

    // Initialisation
    initGenreFilter();
    loadAllCategories();

    function initGenreFilter() {
        genreButton.addEventListener('click', toggleGenreDropdown);
        
        // Fermer le dropdown quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!genreButton.contains(e.target) && !genreDropdown.contains(e.target)) {
                genreDropdown.classList.remove('show');
            }
        });
    }

    function toggleGenreDropdown() {
        genreDropdown.classList.toggle('show');
    }

    async function loadAllCategories() {
        categoriesContainer.innerHTML = '<div class="loading">Chargement des films...</div>';
        
        try {
            // Charger tous les genres disponibles
            const genresResponse = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`);
            const genresData = await genresResponse.json();
            allGenres = genresData.genres;
            
            // Remplir le dropdown des genres
            populateGenreDropdown();
            
            // Afficher les catégories par défaut
            displayCategories();
            
            // Configurer le scroll horizontal
            setupHorizontalScroll();
            
        } catch (error) {
            console.error('Erreur:', error);
            categoriesContainer.innerHTML = '<div class="loading">Erreur de chargement</div>';
        }
    }

    function populateGenreDropdown() {
        genreDropdown.innerHTML = '';
        
        // Bouton "Tous les genres"
        const allGenresItem = document.createElement('div');
        allGenresItem.className = 'genre-item show-all-genres';
        allGenresItem.textContent = 'Tous les genres';
        allGenresItem.addEventListener('click', () => {
            selectedGenreId = null;
            displayCategories();
            genreDropdown.classList.remove('show');
            updateActiveGenre();
        });
        genreDropdown.appendChild(allGenresItem);
        
        // Ajouter chaque genre
        allGenres.forEach(genre => {
            const genreItem = document.createElement('div');
            genreItem.className = 'genre-item';
            genreItem.textContent = genre.name;
            genreItem.dataset.genreId = genre.id;
            
            genreItem.addEventListener('click', () => {
                selectedGenreId = genre.id;
                displayCategories();
                genreDropdown.classList.remove('show');
                updateActiveGenre();
            });
            
            genreDropdown.appendChild(genreItem);
        });
    }

    function updateActiveGenre() {
        document.querySelectorAll('.genre-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.genreId && parseInt(item.dataset.genreId) === selectedGenreId) {
                item.classList.add('active');
            } else if (!item.dataset.genreId && !selectedGenreId) {
                item.classList.add('active');
            }
        });
    }

    function displayCategories() {
        categoriesContainer.innerHTML = '';
        
        // Si un genre est sélectionné, afficher seulement les films de ce genre
        if (selectedGenreId) {
            const genre = allGenres.find(g => g.id === selectedGenreId);
            if (!genre) return;
            
            createSingleGenreSection(genre);
        } else {
            // Sinon, afficher toutes les catégories comme avant
            featuredCategories.forEach(category => {
                createCategorySection(category);
            });
        }
    }

    function createSingleGenreSection(genre) {
        const section = document.createElement('section');
        section.className = 'category-section';
        section.innerHTML = `
            <h2 class="category-title">${genre.name}</h2>
            <div class="movies-scroll-container" id="scroll-${genre.id}">
                <div class="movies-row" id="movies-${genre.id}"></div>
            </div>
        `;
        
        categoriesContainer.appendChild(section);
        loadMoviesForGenre(genre.id);
    }

    function createCategorySection(category) {
        const section = document.createElement('section');
        section.className = 'category-section';
        section.innerHTML = `
            <h2 class="category-title">${category.name}</h2>
            <div class="movies-scroll-container" id="scroll-${category.id}">
                <div class="movies-row" id="movies-${category.id}"></div>
            </div>
        `;
        
        categoriesContainer.appendChild(section);
        loadMoviesForCategory(category.id);
    }

    async function loadMoviesForGenre(genreId) {
        const moviesContainer = document.getElementById(`movies-${genreId}`);
        moviesContainer.innerHTML = '<div>Chargement...</div>';
        
        try {
            const response = await fetch(
                `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR` +
                `&sort_by=popularity.desc&page=2&with_genres=${genreId}`
            );
            const data = await response.json();
            
            if (data.results?.length > 0) {
                displayMovies(data.results, moviesContainer);
            }
        } catch (error) {
            console.error(`Erreur genre ${genreId}:`, error);
        }
    }
    
    async function loadMoviesForCategory(genreId) {
        const moviesContainer = document.getElementById(`movies-${genreId}`);
        moviesContainer.innerHTML = '<div>Chargement...</div>';
        
        try {
            const response = await fetch(
                `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR` +
                `&sort_by=popularity.desc&page=1&with_genres=${genreId}`
            );
            const data = await response.json();
            
            if (data.results?.length > 0) {
                displayMovies(data.results, moviesContainer);
            }
        } catch (error) {
            console.error(`Erreur genre ${genreId}:`, error);
        }
    }
    
    function displayMovies(movies, container) {
        container.innerHTML = '';
        
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            
            const posterPath = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=Image+indisponible';
            
            movieCard.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}" loading="lazy">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.release_date?.substring(0, 4) || 'N/A'}</p>
                    <p class="rating"><i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1) || 'N/A'}/10</p>
                </div>
            `;
            
            movieCard.addEventListener('click', () => {
                window.location.href = `details.html?id=${movie.id}`;
            });
            
            container.appendChild(movieCard);
        });
    }
    
    function setupHorizontalScroll() {
        const scrollContainers = document.querySelectorAll('.movies-scroll-container');
        
        scrollContainers.forEach(container => {
            let isDown = false;
            let startX;
            let scrollLeft;
            
            container.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            });
            
            container.addEventListener('mouseleave', () => {
                isDown = false;
            });
            
            container.addEventListener('mouseup', () => {
                isDown = false;
            });
            
            container.addEventListener('mousemove', (e) => {
                if(!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            });
        });
    }
});