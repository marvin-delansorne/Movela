document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
    const BASE_URL = 'https://api.themoviedb.org/3';
    const nowPlayingEndpoint = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fr-FR&page=1`;

    let currentIndex = 0; // Index du film actuellement affiché
    let movies = []; // Liste des films récupérés
    let autoSlideInterval; // Référence pour l'intervalle automatique

    async function fetchNowPlayingMovies() {
        try {
            const response = await fetch(nowPlayingEndpoint);
            const data = await response.json();
            movies = data.results.slice(0, 5); // Prendre les 5 premiers films
            updateHeroSection();
            createIndicators();
            startAutoSlide();
        } catch (error) {
            console.error('Erreur lors de la récupération des films récents :', error);
        }
    }

    function updateHeroSection() {
        if (movies.length === 0) return;

        const movie = movies[currentIndex];
        const heroSection = document.querySelector('.imgheropage');
        const titleElement = document.querySelector('.heropage_content h1');
        const descriptionElement = document.querySelector('.heropage_content p');

        // Mettre à jour l'image de fond, le titre et la description
        heroSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        titleElement.textContent = movie.title;
        descriptionElement.textContent = movie.overview;

        // Mettre à jour les indicateurs
        updateIndicators();
    }

    function createIndicators() {
        const indicatorsContainer = document.querySelector('.hero-indicators');
        indicatorsContainer.innerHTML = ''; // Réinitialiser les indicateurs

        movies.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === currentIndex) indicator.classList.add('active');

            // Ajouter un gestionnaire de clic pour changer manuellement le film
            indicator.addEventListener('click', () => {
                currentIndex = index; // Mettre à jour l'index actuel
                updateHeroSection();
                resetAutoSlide(); // Réinitialiser l'intervalle automatique
            });

            indicatorsContainer.appendChild(indicator);
        });
    }

    function updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % movies.length; // Passer au film suivant
            updateHeroSection();
        }, 10000); // Changer toutes les 10 secondes
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval); // Arrêter l'intervalle actuel
        startAutoSlide(); // Redémarrer l'intervalle
    }

    fetchNowPlayingMovies();
});