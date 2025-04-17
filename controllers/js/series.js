document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
    const BASE_URL = 'https://api.themoviedb.org/3';
    const categoriesContainer = document.getElementById('categories-container');
    const genreButton = document.getElementById('genre-filter-button');
    const genreDropdown = document.getElementById('genre-dropdown');
    
    let allGenres = [];
    let selectedGenreId = null;
    let allSeries = [];

    // Catégories principales à afficher par défaut
    const featuredCategories = [
        { id: 10759, name: 'Action & Aventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comédie' },
        { id: 80, name: 'Crime' },
        { id: 18, name: 'Drame' },
        { id: 10765, name: 'Science-Fiction & Fantastique' },
        { id: 9648, name: 'Mystère' },
        { id: 10751, name: 'Familial' },
        { id: 10762, name: 'Jeunesse' },
        { id: 10763, name: 'News' },
        { id: 10764, name: 'Reality' },
        { id: 10766, name: 'Soap' },
        { id: 10767, name: 'Talk' },
        { id: 10768, name: 'Politique' }
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
        categoriesContainer.innerHTML = '<div class="loading">Chargement des séries...</div>';
        
        try {
            // Charger tous les genres disponibles
            const genresResponse = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=fr-FR`);
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
        
        // Si un genre est sélectionné, afficher seulement les séries de ce genre
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
                <div class="movies-row" id="series-${genre.id}"></div>
            </div>
        `;
        
        categoriesContainer.appendChild(section);
        loadSeriesForGenre(genre.id);
    }

    function createCategorySection(category) {
        const section = document.createElement('section');
        section.className = 'category-section';
        section.innerHTML = `
            <h2 class="category-title">${category.name}</h2>
            <div class="movies-scroll-container" id="scroll-${category.id}">
                <div class="movies-row" id="series-${category.id}"></div>
            </div>
        `;
        
        categoriesContainer.appendChild(section);
        loadSeriesForCategory(category.id);
    }

    async function loadSeriesForGenre(genreId) {
        const seriesContainer = document.getElementById(`series-${genreId}`);
        seriesContainer.innerHTML = '<div>Chargement...</div>';
        
        try {
            const response = await fetch(
                `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=fr-FR` +
                `&sort_by=popularity.desc&page=1&with_genres=${genreId}`
            );
            const data = await response.json();
            
            if (data.results?.length > 0) {
                displaySeries(data.results, seriesContainer);
            }
        } catch (error) {
            console.error(`Erreur genre ${genreId}:`, error);
        }
    }

    async function loadSeriesForCategory(categoryId) {
        const seriesContainer = document.getElementById(`series-${categoryId}`);
        seriesContainer.innerHTML = '<div>Chargement...</div>';
        
        try {
            const response = await fetch(
                `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=fr-FR` +
                `&sort_by=popularity.desc&page=1&with_genres=${categoryId}`
            );
            const data = await response.json();
            
            if (data.results?.length > 0) {
                displaySeries(data.results, seriesContainer);
            }
        } catch (error) {
            console.error(`Erreur catégorie ${categoryId}:`, error);
        }
    }

    function displaySeries(series, container) {
        container.innerHTML = '';
        
        series.forEach(serie => {
            const serieCard = document.createElement('div');
            serieCard.className = 'serie-card';
            
            const posterPath = serie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=Image+indisponible';
            
            serieCard.innerHTML = `
                <img src="${posterPath}" alt="${serie.name}" loading="lazy">
                <div class="serie-info">
                    <h3>${serie.name}</h3>
                    <p>${serie.first_air_date?.substring(0, 4) || 'N/A'}</p>
                    <p class="rating"><i class="fas fa-star"></i> ${serie.vote_average?.toFixed(1) || 'N/A'}/10</p>
                </div>
            `;
            
            serieCard.addEventListener('click', () => {
                window.location.href = `serie-details.html?id=${serie.id}`;
            });
            
            container.appendChild(serieCard);
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