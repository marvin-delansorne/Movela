const API_KEY = "d5260b04c6e68e0208451efc8904628c";
const BASE_URL = 'https://api.themoviedb.org/3';
const endpoint = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`;

async function fetchAllTopRatedMovies() {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(data.results);
}

fetchAllTopRatedMovies();