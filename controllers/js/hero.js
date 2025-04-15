
document.addEventListener('DOMContentLoaded', () => {
const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
const BASE_URL = 'https://api.themoviedb.org/3';
const nowPlayingEndpoint = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fr-FR&page=1`;

async function updateHeroSection() {
    try {
        const response = await fetch(nowPlayingEndpoint);
        const data = await response.json();
        const movies = data.results;

        if (movies.length > 0) {
            
            const movie = movies[0];

            const heroSection = document.querySelector('.imgheropage');
            heroSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';

            const titleElement = document.querySelector('.heropage_content h1');
            const descriptionElement = document.querySelector('.heropage_content p');

            titleElement.textContent = movie.title;
            descriptionElement.textContent = movie.overview;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des films récents :', error);
    }
}


updateHeroSection();
});