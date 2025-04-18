document.addEventListener('DOMContentLoaded', () => {
    const favorisContainer = document.getElementById('favoris-container');

    // Charger les favoris depuis le localStorage
    function loadFavoris() {
        const favoris = JSON.parse(localStorage.getItem('movieFavorites')) || [];
        favorisContainer.innerHTML = '';

        if (favoris.length === 0) {
            favorisContainer.innerHTML = '<p>Aucun favori pour le moment.</p>';
            return;
        }

        favoris.forEach(favori => {
            if (!favori.image || !favori.title) {
                console.error('Données manquantes pour le favori :', favori);
                return;
            }

            const card = document.createElement('div');
            card.className = 'favoris-card';
            card.innerHTML = `
                <img src="${favori.image}" alt="${favori.title}">
                <div class="card-info">
                    <h3>${favori.title}</h3>
                    <p class="rating"><i class="fas fa-star"></i> ${favori.vote_average || '0'}/10</p>
                </div>
                <button class="remove-favorite" data-id="${favori.id}">Supprimer</button>
            `;
            favorisContainer.appendChild(card);
        });

        // Ajouter un gestionnaire pour supprimer un favori
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                removeFavori(id);
            });
        });
    }

    // Supprimer un favori
    function removeFavori(id) {
        let favoris = JSON.parse(localStorage.getItem('movieFavorites')) || [];
        favoris = favoris.filter(favori => favori.id !== id);
        localStorage.setItem('movieFavorites', JSON.stringify(favoris));
        loadFavoris();
    }

    loadFavoris();
});