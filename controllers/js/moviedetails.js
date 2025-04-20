document.addEventListener("DOMContentLoaded", async () => {
    const API_KEY = "8c4b867188ee47a1d4e40854b27391ec";
    const BASE_URLmovie = 'https://api.themoviedb.org/3/movie/';
    const BASE_URLtv = 'https://api.themoviedb.org/3/tv/';
    const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const serieId = new URLSearchParams(window.location.search).get('id');
    const movieId = new URLSearchParams(window.location.search).get('id');
    const type = new URLSearchParams(window.location.search).get('type');
    const endpointM = `${BASE_URLmovie}${movieId}?api_key=${API_KEY}&language=fr-FR`;
    const endpointS = `${BASE_URLtv}${serieId}?api_key=${API_KEY}&language=fr-FR`;
    // console.log("lien de l'api :", endpointM)

    try {
        if (type === "movie") {
            const query = await fetch(endpointM);
            const result = await query.json();
            // console.log(result, 'Résultat du fetch de films');

            async function getMovieDetails(BASE_URLmovie, API_KEY, movieId) {
                const req = await fetch(`${BASE_URLmovie}${movieId}?api_key=${API_KEY}&language=fr-FR`);
                // console.log("rep à la requete :", req)
                return await req.json();
            }
        
            async function getMovieCredits(movieId) {
                const req = await fetch(`${BASE_URLmovie}${movieId}/credits?api_key=${API_KEY}&language=en-US`);
                return await req.json();
            }

            async function getMovieReco(movieId) {
                const req = await fetch(`${BASE_URLmovie}${movieId}/similar?api_key=${API_KEY}&language=fr-FR`);
                return await req.json();
            }

            async function displayMoviesDetails(movieId) {
                try {
                    const movie = await getMovieDetails(BASE_URLmovie, API_KEY, movieId);
                    const credits = await getMovieCredits(movieId);
            
                    if (!movie || movie.success === false || !movie.genres) {
                        document.querySelector("main").innerHTML = "<p class='text-red-500'>Film introuvable.</p>";
                        return;
                    }
            
                    const img = document.getElementById("contentImg");
                    img.src = `${IMG_BASE_URL}${movie.poster_path}`;
                    img.alt = `Affiche du film ${movie.title}`;
                    
                    document.getElementById('contentTitle').textContent = movie.title;
                    
                    const rawDate = movie.release_date;
                    const [year, month, day] = rawDate.split('-');
                    document.getElementById('releaseDate').textContent = `sorti le ${day}/${month}/${year}`;
        
                    document.getElementById('DOMtitle').textContent = `MOVELA - ${movie.title}`;
            
                    const genresDiv = document.getElementById("contentGenresDiv");
                    movie.genres.forEach(genre => {
                        const li = document.createElement("li");
                        li.setAttribute("class", "p-5px bg-little-btn text-cta-color rounded")
                        li.textContent = genre.name;
                        genresDiv.appendChild(li);
                    });
                    
                    const reviewList = document.getElementById("contentReviewList");
                    displayStarRating(movie.vote_average, reviewList);
                    function displayStarRating(rateOn10, starsDiv) {
                        const rateOn5 = rateOn10 / 2;
                        const fullStars = Math.floor(rateOn5);
                        const hasHalfStar = (rateOn5 - fullStars) >= 0.25 && (rateOn5 - fullStars) < 0.75;
                        
                        starsDiv.innerHTML = '';
                    
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
                        const reviewDiv = document.getElementById("contentReview")
                        const rateAvg = document.createElement("span")
                        rateAvg.setAttribute("class", "text-sm")
                        rateAvg.textContent = `${movie.vote_average}/10`;
                        reviewDiv.appendChild(rateAvg)
                    }
                    
                    document.getElementById('contentDescD').textContent = movie.overview;
                    document.getElementById('contentDescM').textContent = movie.overview;
            
                    const actorListD = document.getElementById("contentActorListD");
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
                    const actorListM = document.getElementById("contentActorListM");
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
        
            async function getMovieReviews(BASE_URLmovie, API_KEY, movieId) {
                const req = await fetch(`${BASE_URLmovie}${movieId}/reviews?api_key=${API_KEY}&language=en-US`);
                return await req.json();
            }
            
            async function displayMovieReviews(movieId) {
                try {
                    const reviews = await getMovieReviews(BASE_URLmovie, API_KEY, movieId);
                    const comList = document.getElementById("comList");
            
                    reviews.results.forEach(review => {
                        const li = document.createElement("li");
                        li.setAttribute("class", "bg-gray-800 text-white p-2 rounded mb-2");
            
                        const date = new Date(review.created_at);
                        const formattedDate = date.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        }).replace(/\//g, "/"); // Format DD/MM/AAAA
                        const formattedTime = date.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        }); // format 24h
            
                        const maxLength = 200;
                        const isLongReview = review.content.length > maxLength;
                        const truncatedContent = isLongReview ? review.content.slice(0, maxLength) + "..." : review.content;
            
                        li.innerHTML = `
                            <p><strong>${review.author}</strong> (${formattedDate} | ${formattedTime}) :</p>
                            <p class="review-content">${truncatedContent}</p>
                            ${isLongReview ? '<button class="toggle-btn text-cta-color mt-2">Voir plus</button>' : ''}
                        `;
            
                        if (isLongReview) {
                            const toggleBtn = li.querySelector(".toggle-btn");
                            toggleBtn.addEventListener("click", () => {
                                const contentElement = li.querySelector(".review-content");
                                if (toggleBtn.textContent === "Voir plus") {
                                    contentElement.textContent = review.content;
                                    toggleBtn.textContent = "Voir moins";
                                } else {
                                    contentElement.textContent = truncatedContent;
                                    toggleBtn.textContent = "Voir plus";
                                }
                            });
                        }
            
                        comList.appendChild(li);
                    });
                } catch (err) {
                    console.error("Erreur lors de la récupération des commentaires :", err);
                }
            }

            async function displayMovieReco() {
                try {
                    const recos = await getMovieReco(movieId)
                    const recoList = document.getElementById("contentRecoList");

                    recos.results.forEach(result => {
                        const li = document.createElement("li");
                        li.setAttribute("class", "shrink-0 cursor-pointer h-auto w-32 rounded-t-lg rounded-b-lg bg-little-btn")
                        li.innerHTML = `
                        <img class="h-auto w-full rounded-t-lg pointer-events-none" src="${IMG_BASE_URL}${result.poster_path}" alt="poster de ${result.title}">
                        <div class="text-center mt-4 mb-2 w-32">
                        <span class="block font-semibold break-words text-cta-color">${result.title}</span>
                        </div>
                        `;
                        li.addEventListener('click', (e) => {
                            if (!e.target.closest('.add-to-favorites')) {
                                window.location.href = `details.html?id=${result.id}&type=movie`;
                            }
                        });
                        recoList.appendChild(li)
                    });
                } catch (err) {
                    console.error("Erreur lors de la récupération des recommendations :", err);
                }
            }
            displayMoviesDetails(movieId);
            displayMovieReco(movieId)
            displayMovieReviews(movieId);
        } else if (type === "tv") {
            const query = await fetch(endpointS);
            const result = await query.json();
            // console.log(result, 'Résultat du fetch de séries')

            async function getSerieDetails(BASE_URLtv, API_KEY, serieId) {
                const req = await fetch(`${BASE_URLtv}${serieId}?api_key=${API_KEY}&language=fr-FR`);
                return await req.json()
            }
            async function getSerieCredits(serieId) {
                const req = await fetch(`${BASE_URLtv}${serieId}/credits?api_key=${API_KEY}&language=en-US`);
                return await req.json();
            }

            async function getSerieReco(serieId) {
                const req = await fetch(`${BASE_URLtv}${serieId}/recommendations?api_key=${API_KEY}&language=fr-FR`);
                return await req.json();
            }
            
            async function displaySerieDetails() {
                try {
                    const serie = await getSerieDetails(BASE_URLtv, API_KEY, serieId);
                    const credits = await getSerieCredits(serieId);
            
                    if (!serie || serie.success === false || !serie.genres) {
                        document.querySelector("main").innerHTML = "<p class='text-red-500'>Film introuvable.</p>";
                        return;
                    }
            
                    const img = document.getElementById("contentImg");
                    img.src = `${IMG_BASE_URL}${serie.poster_path}`;
                    img.alt = `Affiche du film ${serie.original_name}`;
            
                    document.getElementById('contentTitle').textContent = serie.original_name;
                    const releaseDate = serie.first_air_date;
                    const [year, month, day] = releaseDate.split('-');
                    document.getElementById('releaseDate').textContent = `sorti le ${day}/${month}/${year}`;
                    
                    document.getElementById('DOMtitle').textContent = `MOVELA - ${serie.original_name}`;
            
                    const genresDiv = document.getElementById("contentGenresDiv");
                    serie.genres.forEach(genre => {
                        const li = document.createElement("li");
                        li.setAttribute("class", "p-5px bg-little-btn text-cta-color rounded")
                        li.textContent = genre.name;
                        genresDiv.appendChild(li);
                    });
                    
                    const reviewList = document.getElementById("contentReviewList");
                    displayStarRating(serie.vote_average, reviewList);
                    function displayStarRating(rateOn10, starsDiv) {
                        const rateOn5 = rateOn10 / 2;
                        const fullStars = Math.floor(rateOn5);
                        const hasHalfStar = (rateOn5 - fullStars) >= 0.25 && (rateOn5 - fullStars) < 0.75;
                        
                        starsDiv.innerHTML = '';
                        
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
                        const reviewDiv = document.getElementById("contentReview")
                        const rateAvg = document.createElement("span")
                        rateAvg.setAttribute("class", "text-sm")
                        rateAvg.textContent = `${serie.vote_average}/10`;
                        reviewDiv.appendChild(rateAvg)
                    }
                    
        
                    document.getElementById('contentDescD').textContent = serie.overview;
                    document.getElementById('contentDescM').textContent = serie.overview;
            
                    const actorListD = document.getElementById("contentActorListD");
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
                    const actorListM = document.getElementById("contentActorListM");
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
                    document.querySelector("main").innerHTML = "<p class='text-red-500'>Erreur de chargement de la série.</p>";
                }
            }
            async function getSerieReviews(BASE_URLtv, API_KEY, serieId) {
                const req = await fetch(`${BASE_URLtv}${serieId}/reviews?api_key=${API_KEY}&language=en-US`);
                return await req.json();
            }
            
            async function displaySerieReviews(serieId) {
                try {
                    const reviews = await getSerieReviews(BASE_URLtv, API_KEY, serieId);
                    const comList = document.getElementById("comList");
                    
                    reviews.results.forEach(review => {
                        const li = document.createElement("li");
                        li.setAttribute("class", "bg-gray-800 text-white p-2 rounded mb-2");
            
                        const date = new Date(review.created_at);
                        const formattedDate = date.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }).replace(/\//g, "/"); // Format DD/MM/YYYY
                        const formattedTime = date.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        }); // Format HH:mm et 24h
            
                        const maxLength = 200;
                        const isLongReview = review.content.length > maxLength;
                        const truncatedContent = isLongReview ? review.content.slice(0, maxLength) + "..." : review.content;
            
                        li.innerHTML = `
                            <p><strong>${review.author}</strong> (${formattedDate} ${formattedTime}) :</p>
                            <p class="review-content">${truncatedContent}</p>
                            ${isLongReview ? '<button class="toggle-btn text-cta-color mt-2">Voir plus</button>' : ''}
                        `;
            
                        
                        if (isLongReview) {
                            const toggleBtn = li.querySelector(".toggle-btn");
                            toggleBtn.addEventListener("click", () => {
                                const contentElement = li.querySelector(".review-content");
                                if (toggleBtn.textContent === "Voir plus") {
                                    contentElement.textContent = review.content; 
                                    toggleBtn.textContent = "Voir moins"; 
                                } else {
                                    contentElement.textContent = truncatedContent;
                                    toggleBtn.textContent = "Voir plus";
                                }
                            });
                        }
            
                        comList.appendChild(li);
                    });
                } catch (err) {
                    console.error("Erreur lors de la récupération des commentaires :", err);
                }
            }

            async function displaySerieReco() {
                try {
                    const recos = await getSerieReco(serieId)
                    const recoList = document.getElementById("contentRecoList");

                    recos.results.forEach(result => {
                        const li = document.createElement("li");
                        li.setAttribute("class", "shrink-0 cursor-pointer h-auto w-32 rounded-t-lg rounded-b-lg bg-little-btn")
                        li.innerHTML = `
                        <img class="h-auto w-full rounded-t-lg pointer-events-none" src="${IMG_BASE_URL}${result.poster_path}" alt="poster de ${result.name}">
                        <div class="text-center mt-4 mb-2 w-32">
                        <span class="block font-semibold break-words text-cta-color">${result.name}</span>
                        </div>
                        `;
                        li.addEventListener('click', (e) => {
                            if (!e.target.closest('.add-to-favorites')) {
                                window.location.href = `details.html?id=${result.id}&type=tv`;
                            }
                        });
                        recoList.appendChild(li)
                    });
                } catch (err) {
                    console.error("Erreur lors de la récupération des recommendations :", err);
                }
            }
            displaySerieDetails(serieId);
            displaySerieReco(serieId);
            displaySerieReviews(serieId);
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
                const formattedTime = now.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }); // format 24h
    
                li.innerHTML = `
                    <p><strong>${pseudo}</strong> <span class="text-gray-400 text-sm">(${formattedDate} | ${formattedTime})</span> :</p>
                    <p style="white-space: pre-wrap; word-wrap: break-word;">${commentaire}</p>
                `;
                comList.appendChild(li);
        
                e.target.reset();
            }
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
    }
});