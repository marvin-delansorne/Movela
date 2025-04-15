document.addEventListener('DOMContentLoaded', () => {

const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
const BASE_URL = 'https://api.themoviedb.org/3';
const endpoint = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR&page=1`;

async function fetchMoviePosters() {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const movies = data.results;

        const swiperWrapper = document.querySelector('.swiper-wrapper');

        movies.forEach(movie => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                <p>${movie.title}</p>
            `;
            swiperWrapper.appendChild(slide);
        });

      
        new Swiper('.swiper-container', {
            loop: true, 
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
        console.error('Erreur lors de la récupération des affiches :', error);
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
                <p>${show.name}</p>
            `;
            swiperWrapper.appendChild(slide);
        });
        new Swiper('.swiper-container-tv', {
            loop: true,
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

const root = document.documentElement;
const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");
const marqueeContent = document.querySelector("ul.marquee-content");

root.style.setProperty("--marquee-elements", marqueeContent.children.length);

for(let i=0; i<marqueeElementsDisplayed; i++) {
  marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}

});