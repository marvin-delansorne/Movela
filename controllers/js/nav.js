function createNavbar() {
    return `
        <div class="overlay"></div>
        
        <nav class="navbar">
            <div class="nav-section left">
                <div class="burger-icon" onclick="toggleMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="desktop-nav">
                    <a href="index.html">Accueil</a>
                    <a href="films.html">Films</a>
                    <a href="series.html">Séries</a>
                    <a href="#">Favoris</a>
                </div>
            </div>
            
            <div class="logo-container">
                <div class="logo">MOVELA</div>
            </div>
            
            <div class="nav-section right">
                <div class="search-box">
                    <button class="btn-search"><i class="fas fa-search"></i></button>
                    <input type="text" class="input-search" placeholder="Rechercher...">
                </div>
            </div>
        </nav>

        <div class="burger-menu">
            <div class="menu-header">
                <div class="menu-header-text">Menu</div>
            </div>
            <ul class="menu-list">
                <li class="menu-item"><a href="#" class="active">Accueil</a></li>
                <li class="menu-item"><a href="#">Films</a></li>
                <li class="menu-item"><a href="#">Séries</a></li>
                <li class="menu-item"><a href="#">Favoris</a></li>
            </ul>
        </div>
    `;
}

function initNavbar(containerId = 'navbar-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = createNavbar();
    }
}

function toggleMenu() {
    const menu = document.querySelector('.burger-menu');
    const overlay = document.querySelector('.overlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}

document.querySelector('.overlay').addEventListener('click', function() {
    const menu = document.querySelector('.burger-menu');
    const overlay = document.querySelector('.overlay');
    menu.classList.remove('active');
    overlay.classList.remove('active');
});

// Gestion de l'activation des liens
const menuLinks = document.querySelectorAll('.menu-item a, .desktop-nav a');
menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Retirer la classe active de tous les liens
        menuLinks.forEach(l => l.classList.remove('active'));
        
        // Ajouter la classe active au lien cliqué
        this.classList.add('active');
        
        // Si c'est un lien du menu burger, fermer le menu
        const menu = document.querySelector('.burger-menu');
        const overlay = document.querySelector('.overlay');
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});