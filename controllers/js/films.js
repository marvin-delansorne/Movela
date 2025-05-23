document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
    const BASE_URL = 'https://api.themoviedb.org/3';
    const categoriesContainer = document.getElementById('categories-container');
    const genreButton = document.getElementById('genre-filter-button');
    const genreDropdown = document.getElementById('genre-dropdown');
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    document.querySelector('.films-main').appendChild(paginationContainer);
    
    let allGenres = [];
    let selectedGenreId = null;
    let currentPage = 1;
    const itemsPerPage = 20;
    let totalPages = 1;
    let favorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];

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
    setupFavoritesListener();

    function initGenreFilter() {
        genreButton.addEventListener('click', toggleGenreDropdown);
        
        document.addEventListener('click', (e) => {
            if (!genreButton.contains(e.target) && !genreDropdown.contains(e.target)) {
                genreDropdown.classList.remove('show');
            }
        });
    }

    function toggleGenreDropdown() {
        genreDropdown.classList.toggle('show');
    }

    function setupFavoritesListener() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-favorites')) {
                const button = e.target.closest('.add-to-favorites');
                const movieId = button.dataset.movieId;
                toggleFavorite(movieId, button);
            }
        });
    }

    function toggleFavorite(movieId, button) {
        const index = favorites.indexOf(movieId);
        if (index === -1) {
            favorites.push(movieId);
            button.classList.add('added');
            button.innerHTML = '<i class="fas fa-check"></i> Ajouté';
        } else {
            favorites.splice(index, 1);
            button.classList.remove('added');
            button.innerHTML = '<i class="fas fa-plus"></i> Favoris';
        }
        localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    }

    async function loadAllCategories() {
        categoriesContainer.innerHTML = '<div class="loading">Chargement des films...</div>';
        paginationContainer.innerHTML = '';
        
        try {
            const genresResponse = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`);
            const genresData = await genresResponse.json();
            allGenres = genresData.genres;
            
            populateGenreDropdown();
            displayCategories();
            setupHorizontalScroll();
            
        } catch (error) {
            console.error('Erreur:', error);
            categoriesContainer.innerHTML = '<div class="loading">Erreur de chargement</div>';
        }
    }

    function populateGenreDropdown() {
        genreDropdown.innerHTML = '';
        
        const allGenresItem = document.createElement('div');
        allGenresItem.className = 'genre-item show-all-genres';
        allGenresItem.textContent = 'Tous les genres';
        allGenresItem.addEventListener('click', () => {
            selectedGenreId = null;
            currentPage = 1;
            displayCategories();
            genreDropdown.classList.remove('show');
            updateActiveGenre();
        });
        genreDropdown.appendChild(allGenresItem);
        
        allGenres.forEach(genre => {
            const genreItem = document.createElement('div');
            genreItem.className = 'genre-item';
            genreItem.textContent = genre.name;
            genreItem.dataset.genreId = genre.id;
            
            genreItem.addEventListener('click', () => {
                selectedGenreId = genre.id;
                currentPage = 1;
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
        
        if (selectedGenreId) {
            const genre = allGenres.find(g => g.id === selectedGenreId);
            if (!genre) return;
            
            createSingleGenreSection(genre);
        } else {
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
                `&sort_by=popularity.desc&page=${currentPage}&with_genres=${genreId}`
            );
            const data = await response.json();
            totalPages = data.total_pages > 500 ? 500 : data.total_pages;
            
            if (data.results?.length > 0) {
                displayMovies(data.results, moviesContainer);
                updatePagination();
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
                `&sort_by=popularity.desc&page=${currentPage}&with_genres=${genreId}`
            );
            const data = await response.json();
            totalPages = data.total_pages > 500 ? 500 : data.total_pages;
            
            if (data.results?.length > 0) {
                displayMovies(data.results, moviesContainer);
                updatePagination();
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
            movieCard.dataset.id = movie.id;
            
            const posterPath = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=Image+indisponible';
            
            const isFavorite = favorites.includes(movie.id.toString());
            
            movieCard.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}" loading="lazy">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.release_date?.substring(0, 4) || 'N/A'}</p>
                    <p class="rating"><i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1) || 'N/A'}/10</p>
                </div>
                <button class="add-to-favorites" data-movie-id="${movie.id}">
                    <i class="fas fa-plus"></i> Favoris
                </button>
            `;
            
            if (isFavorite) {
                const favButton = movieCard.querySelector('.add-to-favorites');
                favButton.classList.add('added');
                favButton.innerHTML = '<i class="fas fa-check"></i> Ajouté';
            }
            
            movieCard.addEventListener('click', (e) => {
                if (!e.target.closest('.add-to-favorites')) {
                    window.location.href = `details.html?id=${movie.id}&type=movie`;
                }
            });
            
            container.appendChild(movieCard);
        });
    }

    function updatePagination() {
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) return;

        // Bouton Précédent
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&laquo;';
        prevButton.className = 'pagination-button';
        prevButton.disabled = currentPage === 1;
        if (currentPage === 1) prevButton.classList.add('disabled');
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                reloadContent();
            }
        });
        paginationContainer.appendChild(prevButton);
        
        // Première page
        if (currentPage > 2) {
            const firstPage = document.createElement('button');
            firstPage.textContent = '1';
            firstPage.className = 'pagination-button';
            firstPage.addEventListener('click', () => {
                currentPage = 1;
                reloadContent();
            });
            paginationContainer.appendChild(firstPage);
            
            if (currentPage > 3) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'pagination-dots';
                paginationContainer.appendChild(dots);
            }
        }
        
        // Pages autour de la page actuelle
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = 'pagination-button';
            if (i === currentPage) pageButton.classList.add('active');
            pageButton.addEventListener('click', () => {
                currentPage = i;
                reloadContent();
            });
            paginationContainer.appendChild(pageButton);
        }
        
        // Dernière page
        if (currentPage < totalPages - 1) {
            if (currentPage < totalPages - 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'pagination-dots';
                paginationContainer.appendChild(dots);
            }
            
            const lastPage = document.createElement('button');
            lastPage.textContent = totalPages;
            lastPage.className = 'pagination-button';
            lastPage.addEventListener('click', () => {
                currentPage = totalPages;
                reloadContent();
            });
            paginationContainer.appendChild(lastPage);
        }
        
        // Bouton Suivant
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '&raquo;';
        nextButton.className = 'pagination-button';
        nextButton.disabled = currentPage === totalPages;
        if (currentPage === totalPages) nextButton.classList.add('disabled');
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                reloadContent();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    function reloadContent() {
        if (selectedGenreId) {
            loadMoviesForGenre(selectedGenreId);
        } else {
            displayCategories();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
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