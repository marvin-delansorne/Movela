document.addEventListener('DOMContentLoaded', () => {

const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
const BASE_URL = 'https://api.themoviedb.org/3';

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
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.release_date?.substring(0, 4) || 'N/A'}</p>
                    <p class="rating"><i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1) || 'N/A'}/10</p>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });

        // Initialiser Swiper.js
        new Swiper('.swiper-container', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des films :', error);
    }
}

fetchMoviePosters();

async function fetchTopRatedTVShows() {
    const tvEndpoint = `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=fr-FR&page=1`;

    try {
        const response = await fetch(tvEndpoint);
        const data = await response.json();
        const tvShows = data.results;

        const swiperWrapper = document.querySelector('.swiper-container-tv .swiper-wrapper');

        tvShows.forEach(show => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" />
                <div class="serie-info">
                    <h3><stong>${show.name}<stong></h3>
                    <p>${show.first_air_date?.substring(0, 4) || 'N/A'}</p>
                    <p class="rating"><i class="fas fa-star"></i> ${show.vote_average?.toFixed(1) || 'N/A'}/10</p>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });

        // Initialiser Swiper.js
        new Swiper('.swiper-container-tv', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next-tv',
                prevEl: '.swiper-button-prev-tv',
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des séries :', error);
    }
}

fetchTopRatedTVShows();

async function fetchLatestReleases() {
    const latestEndpoint = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fr-FR&page=1`;

    try {
        const response = await fetch(latestEndpoint);
        const data = await response.json();
        const movies = data.results;

        const swiperWrapper = document.querySelector('.swiper-container-latest .swiper-wrapper');

        movies.forEach(movie => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p> ${movie.release_date?.substring(0, 4) || 'N/A'}</p>
                    <p class="rating"><i class="fas fa-star"></i>${movie.vote_average?.toFixed(1) || 'N/A'}/10</p>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });

        // Initialiser Swiper.js pour les dernières sorties
        new Swiper('.swiper-container-latest', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next-latest',
                prevEl: '.swiper-button-prev-latest',
            },
            autoplay: {
                delay: 5000, // Changement automatique toutes les 5 secondes
                disableOnInteraction: false,
            },
            slidesPerView: 5, // Nombre de films visibles
            spaceBetween: 20, // Espacement entre les slides
            breakpoints: {
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des dernières sorties :', error);
    }
}

// Appeler la fonction pour récupérer les dernières sorties
fetchLatestReleases();

const root = document.documentElement;
const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");
const marqueeContent = document.querySelector("ul.marquee-content");

root.style.setProperty("--marquee-elements", marqueeContent.children.length);

for(let i=0; i<marqueeElementsDisplayed; i++) {
  marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}

});