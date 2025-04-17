document.addEventListener("DOMContentLoaded", () => {
        const API_KEY = "d5260b04c6e68e0208451efc8904628c";
        const BASE_URL = 'https://api.themoviedb.org/3';
        const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
        const endpoint = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR&page=1`;
    
        fetch(endpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des données JSON");
                }
                return response.json();
            })
            .then(data => {
                // console.log("Données chargées :", data);
                
                const movieId = 27205;

                async function getMovieDetails(id) {
                    const req = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR`);
                    return await req.json()
                }

                async function getMovieCredits(id) {
                    const req = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`);
                    return await req.json();
                }

                async function displayMoviesDetails() {
                    try {
                        const movie = await getMovieDetails(movieId);
                        const credits = await getMovieCredits(movieId);
                
                        if (!movie || movie.success === false || !movie.genres) {
                            document.querySelector("main").innerHTML = "<p class='text-red-500'>Film introuvable.</p>";
                            return;
                        }
                
                        const img = document.getElementById("movieImg");
                        img.src = `${IMG_BASE_URL}${movie.poster_path}`;
                        img.alt = `Affiche du film ${movie.title}`;
                
                        document.getElementById('movieTitle').textContent = movie.title;
                        const rawDate = movie.release_date;
                        const [year, month, day] = rawDate.split('-');
                        document.getElementById('releaseDate').textContent = `sorti le ${day}/${month}/${year}`;

                        document.getElementById('DOMtitle').textContent = `MOVELA - ${movie.title}`;
                
                        const genresDiv = document.getElementById("movieGenresDiv");
                        movie.genres.forEach(genre => {
                            const li = document.createElement("li");
                            li.setAttribute("class", "p-5px bg-little-btn text-cta-color rounded")
                            li.textContent = genre.name;
                            genresDiv.appendChild(li);
                        });
                        
                        const reviewList = document.getElementById("movieReviewList");
                        displayStarRating(movie.vote_average, reviewList);
                        function displayStarRating(rateOn10, starsDiv) {
                            const rateOn5 = rateOn10 / 2;
                            const fullStars = Math.floor(rateOn5);
                            const hasHalfStar = (rateOn5 - fullStars) >= 0.25 && (rateOn5 - fullStars) < 0.75;
                            
                            starsDiv.innerHTML = ''; // reset du contenu précédent
                        
                            for (let i = 0; i < 5; i++) {
                                const li = document.createElement("li");
                                if (i < fullStars) {
                                    li.innerHTML= `<img class="star-img-wh20px" src="/Movela/public/assets/fullStar.png">`;
                                } else if (i === fullStars && hasHalfStar) {
                                    li.innerHTML= `<img class="star-img-wh20px" src="/Movela/public/assets/halfStar.png">`;
                                } else {
                                    li.innerHTML= `<img class="star-img-wh20px" src="/Movela/public/assets/emptyStar.png">`;
                                }
                                starsDiv.appendChild(li);
                            }
                            const reviewDiv = document.getElementById("movieReview")
                            const rateAvg = document.createElement("span")
                            rateAvg.setAttribute("class", "text-sm")
                            rateAvg.textContent = `${movie.vote_average}/10`;
                            reviewDiv.appendChild(rateAvg)
                        }
                        

                        document.getElementById('movieDescD').textContent = movie.overview;
                        document.getElementById('movieDescM').textContent = movie.overview;
                
                        const actorListD = document.getElementById("movieActorListD");
                        credits.cast.slice(0, 10).forEach(actor => {
                            const li = document.createElement("li");
                            li.setAttribute("class", "shrink-0 h-auto w-32 rounded-t-lg rounded-b-lg bg-little-btn")
                            li.innerHTML = `
                                <img class="h-auto w-full rounded-t-lg" src="${IMG_BASE_URL}${actor.profile_path}" alt="Photo de ${actor.name}">
                                <div class="text-center mt-4 mb-2 w-32">
                                    <span class="block font-semibold break-words text-cta-color">${actor.name}</span>
                                    <span class="text-sm text-gray-300 mb-1">${actor.character}</span>
                                </div>
                            `;
                            actorListD.appendChild(li);
                        });
                        const actorListM = document.getElementById("movieActorListM");
                        credits.cast.slice(0, 10).forEach(actor => {
                            const li = document.createElement("li");
                            li.setAttribute("class", "shrink-0 h-auto w-32 rounded-t-lg rounded-b-lg bg-little-btn")
                            li.innerHTML = `
                                <img class="h-auto w-full rounded-t-lg pointer-events-none" src="${IMG_BASE_URL}${actor.profile_path}" alt="Photo de ${actor.name}">
                                <div class="text-center mt-4 mb-2 w-32">
                                    <span class="block font-semibold break-words text-cta-color">${actor.name}</span>
                                    <span class="text-sm text-gray-300">${actor.character}</span>
                                </div>
                            `;
                            actorListM.appendChild(li);
                        });
                    } catch (err) {
                        console.error("Erreur lors de la récupération du film :", err);
                        document.querySelector("main").innerHTML = "<p class='text-red-500'>Erreur de chargement du film.</p>";
                    }
                }

                async function getMovieReviews(id) {
                    const req = await fetch(`${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}&language=fr-FR`);
                    return await req.json();
                }
                
                async function displayMovieReviews() {
                    try {
                        const reviews = await getMovieReviews(movieId);
                        const comList = document.getElementById("comList");
                
                        reviews.results.forEach(review => {
                            const li = document.createElement("li");
                            li.setAttribute("class", "bg-gray-800 text-white p-2 rounded mb-2");
                            li.innerHTML = `
                                <p><strong>${review.author}</strong> :</p>
                                <p>${review.content}</p>
                            `;
                            comList.appendChild(li);
                        });
                    } catch (err) {
                        console.error("Erreur lors de la récupération des commentaires :", err);
                    }
                }
                
                document.querySelector("form").addEventListener("submit", (e) => {
                    e.preventDefault();
                    const pseudo = e.target[0].value.trim();
                    const commentaire = e.target[1].value.trim();
                
                    if (pseudo && commentaire) {
                        const comList = document.getElementById("comList");
                        const li = document.createElement("li");
                        li.setAttribute("class", "bg-gray-800 text-white p-2 rounded mb-2");

                        const now = new Date();
                        const formattedDate = now.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        });

                        li.innerHTML = `
                            <p><strong>${pseudo}</strong> <span class="text-gray-400 text-sm">(${formattedDate})</span> :</p>
                            <p>${commentaire}</p>
                        `;
                        comList.appendChild(li);
                
                        e.target.reset();
                    }
                });
                
                displayMovieReviews();
                
                displayMoviesDetails();
            })
            .catch(error => {
                console.error("Erreur :", error);
            });
    });