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
                    <a href="/Movela/index.html">Accueil</a>
                    <a href="/Movela/views/films.html">Films</a>
                    <a href="/Movela/views/series.html">Séries</a>
                    <a href="/Movela/views/favoris.html">Favoris</a>
                </div>
            </div>
            
            <div class="logo-container">
                <div class="logo"><img src="/movela/public/assets/logo.png" alt="MOVELA Logo"></div>
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
                <li class="menu-item"><a href="/Movela/index.html">Accueil</a></li>
                <li class="menu-item"><a href="/Movela/views/films.html">Films</a></li>
                <li class="menu-item"><a href="/Movela/views/series.html">Séries</a></li>
                <li class="menu-item"><a href="/Movela/views/favoris.html">Favoris</a></li>
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

const menuLinks = document.querySelectorAll('.menu-item a, .desktop-nav a');
menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        menuLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const menu = document.querySelector('.burger-menu');
        const overlay = document.querySelector('.overlay');
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});