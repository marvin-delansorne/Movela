document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
    const BASE_URL = 'https://api.themoviedb.org/3';
    let favorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];

    // Fonction pour basculer l'état favori
    function toggleFavorite(favori, button) {
        const favoris = JSON.parse(localStorage.getItem('movieFavorites')) || [];
        const index = favoris.findIndex(f => f.id === favori.id);

        if (index === -1) {
            // Ajouter aux favoris
            favoris.push(favori);
            localStorage.setItem('movieFavorites', JSON.stringify(favoris));
            button.classList.add('added');
            button.innerHTML = '<i class="fas fa-check"></i> Ajouté';
        } else {
            // Supprimer des favoris
            favoris.splice(index, 1);
            localStorage.setItem('movieFavorites', JSON.stringify(favoris));
            button.classList.remove('added');
            button.innerHTML = '<i class="fas fa-plus"></i> Favoris';
        }
    }

    // Fonction pour mettre à jour les boutons de favoris
    function updateFavoriteButtons() {
        const favoris = JSON.parse(localStorage.getItem('movieFavorites')) || [];
        const buttons = document.querySelectorAll('.add-to-favorites');

        buttons.forEach(button => {
            const movieId = button.dataset.id;
            const isFavorited = favoris.some(favori => favori.id === movieId);

            if (isFavorited) {
                button.classList.add('added');
                button.innerHTML = '<i class="fas fa-check"></i> Ajouté';
            } else {
                button.classList.remove('added');
                button.innerHTML = '<i class="fas fa-plus"></i> Favoris';
            }
        });
    }

    // Gestionnaire d'événements pour les favoris
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-favorites')) {
            e.preventDefault();
            e.stopPropagation();
            const button = e.target.closest('.add-to-favorites');
            const movieId = button.dataset.movieId;
            const title = button.dataset.title;
            const image = button.dataset.image;
            const year = button.dataset.year;

            toggleFavorite({ id: movieId, title, image, year }, button);
        }
    });

    // Fonction pour créer une carte de film
    function createMovieCard(media, container, isTvShow = false) {
        const mediaCard = document.createElement('div');
        mediaCard.className = 'swiper-slide';
        mediaCard.dataset.id = media.id;

        const posterPath = media.poster_path 
            ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
            : 'https://via.placeholder.com/500x750?text=Image+indisponible';

        const favoris = JSON.parse(localStorage.getItem('movieFavorites')) || [];
        const isFavorite = favoris.some(favori => favori.id === media.id);
        const title = isTvShow ? media.name : media.title;
        const releaseDate = isTvShow ? media.first_air_date : media.release_date;
        const favButtonClass = isFavorite ? 'add-to-favorites added' : 'add-to-favorites';
        const favButtonContent = isFavorite ? '<i class="fas fa-check"></i> Ajouté' : '<i class="fas fa-plus"></i> Favoris';

        mediaCard.innerHTML = `
            <img src="${posterPath}" alt="${title}" loading="lazy">
            <div class="movie-info">
                <h3>${title}</h3>
                <p>${releaseDate?.substring(0, 4) || 'N/A'}</p>
                <p class="rating"><i class="fas fa-star"></i> ${media.vote_average?.toFixed(1) || 'N/A'}/10</p>
            </div>
            <button class="${favButtonClass}" data-id="${media.id}" data-title="${title}" data-image="${posterPath}" data-year="${releaseDate?.substring(0, 4) || 'N/A'}">
                ${favButtonContent}
            </button>
        `;

        // Gestionnaire d'événements pour le bouton "Ajouter aux favoris"
        mediaCard.querySelector('.add-to-favorites').addEventListener('click', (e) => {
            e.stopPropagation();
            const button = e.target.closest('.add-to-favorites');
            const movieId = button.dataset.id;
            const title = button.dataset.title;
            const image = button.dataset.image;
            const year = button.dataset.year;
            const voteAverage = media.vote_average?.toFixed(1) || '0';

            toggleFavorite({ id: movieId, title, image, year, vote_average: voteAverage }, button);
        });

        container.querySelector('.swiper-wrapper').appendChild(mediaCard);
    }

    // Configuration Swiper commune
    const swiperConfig = {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
        }
    };

    // Fonction pour charger et afficher les films
    async function fetchAndDisplay(endpoint, containerSelector, isTvShow = false) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=fr-FR`);
            const data = await response.json();
            const container = document.querySelector(containerSelector);
            
            // Effacer le contenu existant
            container.querySelector('.swiper-wrapper').innerHTML = '';
            
            // Ajouter les nouveaux éléments
            data.results.slice(0, 10).forEach(media => {
                createMovieCard(media, container, isTvShow);
            });

            // Mettre à jour l'état des boutons après le chargement des cartes
            updateFavoriteButtons();
            
            // Initialiser Swiper
            new Swiper(containerSelector, {
                ...swiperConfig,
                navigation: {
                    nextEl: `${containerSelector} .swiper-button-next`,
                    prevEl: `${containerSelector} .swiper-button-prev`,
                },
            });
        } catch (error) {
            console.error(`Erreur lors de la récupération des données :`, error);
        }
    }

    // Charger les trois sections
    fetchAndDisplay('/movie/now_playing', '.swiper-container-latest');
    fetchAndDisplay('/movie/top_rated', '.swiper-container');
    fetchAndDisplay('/tv/top_rated', '.swiper-container-tv', true);

    // Fonction pour récupérer et afficher les affiches de films
    async function fetchMoviePosters() {
        const movieEndpoint = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR&page=1`;

        try {
            const response = await fetch(movieEndpoint);
            const data = await response.json();
            const movies = data.results;

            const swiperWrapper = document.querySelector('.swiper-container .swiper-wrapper');

            movies.forEach(movie => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `
                    <div class="movie-card">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        <button class="add-to-favorites" data-id="${movie.id}" data-title="${movie.title}" data-image="https://image.tmdb.org/t/p/w500${movie.poster_path}" data-year="${movie.release_date?.substring(0, 4) || 'N/A'}">Ajouter aux favoris</button>
                    </div>
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <p>${movie.release_date?.substring(0, 4) || 'N/A'}</p>
                        <p class="rating"><i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1) || 'N/A'}/10</p>
                    </div>
                `;
                swiperWrapper.appendChild(slide);
            });

            // Mettre à jour l'état des boutons après le chargement des films
            updateFavoriteButtons();

            // Ajouter un gestionnaire pour le bouton "Ajouter aux favoris"
            document.querySelectorAll('.add-to-favorites').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const title = e.target.dataset.title;
                    const image = e.target.dataset.image;
                    const year = e.target.dataset.year;

                    addToFavoris({ id, title, image, year });
                    updateFavoriteButtons(); // Mettre à jour l'état après un clic
                });
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des films :', error);
        }
    }

    // Fonction pour ajouter un film aux favoris
    function addToFavoris(favori) {
        const favoris = JSON.parse(localStorage.getItem('movieFavorites')) || [];
        if (!favoris.some(f => f.id === favori.id)) {
            favoris.push(favori);
            localStorage.setItem('movieFavorites', JSON.stringify(favoris));
            alert(`${favori.title} a été ajouté aux favoris !`);
        } else {
            alert(`${favori.title} est déjà dans vos favoris.`);
        }
    }

    // Animation du marquee
    const root = document.documentElement;
    const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");
    const marqueeContent = document.querySelector("ul.marquee-content");

    if (marqueeContent) {
        root.style.setProperty("--marquee-elements", marqueeContent.children.length);
        for (let i = 0; i < marqueeElementsDisplayed; i++) {
            marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
        }
    }

    const someElement = document.querySelector('#some-id');
    if (someElement) {
        someElement.addEventListener('click', () => {
            // Votre logique ici
        });
    }
});