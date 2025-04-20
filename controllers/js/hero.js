document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
    const BASE_URL = 'https://api.themoviedb.org/3';
    const nowPlayingEndpoint = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fr-FR&page=1`;

    let currentIndex = 0;
    let movies = [];
    let autoSlideInterval;
    const SLIDE_DURATION = 10000;

    // Initialisation des favoris
    function initializeFavorites() {
        if (!localStorage.getItem('favorites')) {
            localStorage.setItem('favorites', JSON.stringify([]));
        }
    }

    // Vérifie si un film est dans les favoris
    function isFavorite(movieId) {
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        return favorites.includes(movieId);
    }

    // Ajoute ou retire un film des favoris
    function toggleFavorite(movieId) {
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        const index = favorites.indexOf(movieId);
        
        if (index === -1) {
            favorites.push(movieId);
        } else {
            favorites.splice(index, 1);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteButton(movieId);
    }

    // Met à jour l'apparence du bouton favori
    function updateFavoriteButton(movieId) {
        const favoriteBtn = document.getElementById('hero-favorite-btn');
        if (!favoriteBtn) return;

        if (isFavorite(movieId)) {
            favoriteBtn.innerHTML = '<i class="fa fa-check" style="font-size:40px;color:#4CAF50"></i>';
            favoriteBtn.classList.add('added');
        } else {
            favoriteBtn.innerHTML = '<i class="fa fa-plus" style="font-size:40px;color:var(--cta-color)"></i>';
            favoriteBtn.classList.remove('added');
        }
    }

    // Récupère les films actuellement au cinéma
    async function fetchNowPlayingMovies() {
        try {
            const response = await fetch(nowPlayingEndpoint);
            const data = await response.json();
            movies = data.results.slice(0, 5);
            updateHeroSection();
            createIndicators();
            startAutoSlide();
        } catch (error) {
            console.error('Erreur lors de la récupération des films récents :', error);
        }
    }

    // Met à jour la section hero avec le film actuel
    function updateHeroSection() {
        if (movies.length === 0) return;

        const movie = movies[currentIndex];
        const heroSection = document.querySelector('.imgheropage');
        const titleElement = document.querySelector('.heropage_content h1');
        const descriptionElement = document.querySelector('.heropage_content p');
        const favoriteBtn = document.getElementById('hero-favorite-btn');

        heroSection.style.opacity = 0;
        setTimeout(() => {
            heroSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            titleElement.textContent = movie.title;
            descriptionElement.textContent = movie.overview;
            heroSection.style.opacity = 1;
            updateIndicators();
            
            // Met à jour le bouton favori
            updateFavoriteButton(movie.id);
            
            // Ajoute l'événement click
            if (favoriteBtn) {
                favoriteBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(movie.id);
                };
            }
        }, 500);
        heroSection.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-favorites')) {
                window.location.href = `views/details.html?id=${movie.id}&type=movie`;
            }
        });
    }

    // Crée les indicateurs de slide
    function createIndicators() {
        const indicatorsContainer = document.querySelector('.hero-indicators');
        indicatorsContainer.innerHTML = '';

        movies.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            
            const bubble = document.createElement('div');
            bubble.className = 'indicator-bubble';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'indicator-progress';
            
            bubble.appendChild(progressBar);
            indicator.appendChild(bubble);
            indicatorsContainer.appendChild(indicator);

            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateHeroSection();
                resetAutoSlide();
            });
        });
        
        updateIndicators();
    }

    // Anime la barre de progression
    function startProgressAnimation(progressBar) {
        progressBar.style.width = '0%';
        progressBar.style.transition = 'none';
        
        void progressBar.offsetWidth;
        
        progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
        progressBar.style.width = '100%';
    }

    // Met à jour les indicateurs
    function updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        
        indicators.forEach((indicator, index) => {
            const progressBar = indicator.querySelector('.indicator-progress');
            
            if (index < currentIndex) {
                indicator.classList.add('completed');
                progressBar.style.width = '100%';
                progressBar.style.transition = 'none';
            } else if (index === currentIndex) {
                indicator.classList.remove('completed');
                indicator.classList.add('active');
                startProgressAnimation(progressBar);
            } else {
                indicator.classList.remove('completed');
                indicator.classList.remove('active');
                progressBar.style.width = '0%';
                progressBar.style.transition = 'none';
            }
        });
    }

    // Démarre le défilement automatique
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % movies.length;
            updateHeroSection();
        }, SLIDE_DURATION);
    }

    // Réinitialise le défilement automatique
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Initialisation
    initializeFavorites();
    fetchNowPlayingMovies();
    setupPauseOnHover();
});