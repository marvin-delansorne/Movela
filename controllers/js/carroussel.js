document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
    const BASE_URL = 'https://api.themoviedb.org/3';
    let favorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];

    // Fonction pour basculer l'état favori
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

    // Gestionnaire d'événements pour les favoris
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-favorites')) {
            e.preventDefault();
            e.stopPropagation();
            const button = e.target.closest('.add-to-favorites');
            const movieId = button.dataset.movieId;
            toggleFavorite(movieId, button);
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
        
        const isFavorite = favorites.includes(media.id.toString());
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
            <button class="${favButtonClass}" data-movie-id="${media.id}">
                ${favButtonContent}
            </button>
        `;

        mediaCard.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-favorites')) {
                const mediaType = isTvShow ? 'tv' : 'movie';
                window.location.href = `details.html?id=${media.id}&type=${mediaType}`;
            }
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
});