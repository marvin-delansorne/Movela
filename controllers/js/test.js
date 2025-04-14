const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
const BASE_URL = 'https://api.themoviedb.org/3';
const endpoint = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR&page=1`;

async function fetchAllTopRatedMovies() {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(data.results);
}

fetchAllTopRatedMovies();