
const POKEMON_PER_PAGE = 20;
const cards = Array.from(document.querySelectorAll(".poke-card"));
const searchInput = document.getElementById("searchInput");
const typeButtons = document.querySelectorAll(".type-btn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const pokemonModalEl = document.getElementById('pokemonModal');
const pokemonModal = new bootstrap.Modal(pokemonModalEl);
const modalName = document.getElementById("modalName");
const modalImage = document.getElementById("modalImage");
const modalTypes = document.getElementById("modalTypes");
const modalStats = document.getElementById("modalStats");
const modalAbilities = document.getElementById("modalAbilities");


let currentPage = 1;
let selectedType = null;
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

/**
 * Helper function to determine a color for the type badge.
 * @param {string} type - The Pokémon type.
 * @returns {string} The CSS color code.
 */
function getTypeColor(type) {

    const typeColors = {
        normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
        grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
        ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
        rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', steel: '#B7B7CE',
        fairy: '#D685AD', dark: '#705746'
    };
    return typeColors[type.toLowerCase()] || '#777';
}


function renderPage() {
    cards.forEach(c => c.parentElement.style.display = "none"); 


    let filtered = cards.filter(card => {
        const name = card.getAttribute("data-name");
        return name.includes(searchInput.value.toLowerCase());
    });

    if (selectedType) {
        filtered = filtered.filter(card => {
            const types = card.getAttribute("data-types").split(",");
            return types.includes(selectedType);
        });
    }

    const totalPages = Math.ceil(filtered.length / POKEMON_PER_PAGE);
 
    if (currentPage > totalPages) {
        currentPage = totalPages || 1; 
    }
    
    const start = (currentPage - 1) * POKEMON_PER_PAGE;
    const end = start + POKEMON_PER_PAGE;

    
    filtered.slice(start, end).forEach(card => {
        card.parentElement.style.display = "block";

        const favIcon = card.querySelector(".fav-icon");
        if (favorites.includes(card.getAttribute("data-name"))) {
            favIcon.classList.add("active");
          
            favIcon.style.color = 'var(--poke-yellow)'; 
        } else {
            favIcon.classList.remove("active");
            favIcon.style.color = 'var(--poke-red)';
        }
    });


    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
}




searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderPage();
});

prevBtn.addEventListener("click", () => { 
    if (currentPage > 1) {
        currentPage--; 
        renderPage(); 
    }
});
nextBtn.addEventListener("click", () => { 
    
    currentPage++; 
    renderPage(); 
});

document.getElementById("typeFilters").addEventListener("click", (e) => {
    const btn = e.target.closest(".type-btn");
    if (!btn) return;

    typeButtons.forEach(b => b.classList.remove("active"));

    if (selectedType === btn.dataset.type) {
        selectedType = null;
    } else {
        selectedType = btn.dataset.type;
        btn.classList.add("active");
    }

    currentPage = 1;
    renderPage();
});

cards.forEach(card => {
    const favIcon = card.querySelector(".fav-icon");
    favIcon.addEventListener("click", e => {
        e.stopPropagation(); 
        const name = card.getAttribute("data-name");

        if (favorites.includes(name)) {
            favorites = favorites.filter(f => f !== name);
        } else {
            favorites.push(name);
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderPage(); 
    });
});


cards.forEach(card => {
    card.addEventListener("click", () => {

        const name = card.getAttribute("data-name").toUpperCase();
        const image = card.querySelector("img").src;
        const types = card.getAttribute("data-types").split(",");
   
        const statsData = JSON.parse(card.getAttribute("data-stats") || "[]");
        const abilitiesData = JSON.parse(card.getAttribute("data-abilities") || "[]");

     
        modalName.textContent = name;
        modalImage.src = image;
        modalImage.alt = name;
       
        modalTypes.innerHTML = types.map(type => 
            `<span class="badge me-1 text-uppercase" style="background-color: ${getTypeColor(type)}; color: black; text-shadow: none;">${type}</span>`
        ).join('');
       
        const formattedStats = statsData.map(s => {
            
            const statName = s.stat ? s.stat.name.replace(/-/g, ' ') : (s.name || 'Stat');
            const statValue = s.base_stat !== undefined ? s.base_stat : (s.value !== undefined ? s.value : 'N/A');
            return `<span class="text-capitalize">${statName}:</span> ${statValue}`;
        }).join('<br>');

        modalStats.innerHTML = '<strong>Stats:</strong><br>' + formattedStats;

        
        const formattedAbilities = abilitiesData.map(a => {
          
            const abilityName = a.ability ? a.ability.name : a;
            return abilityName.replace(/-/g, ' ');
        }).join(', ');
        
        modalAbilities.innerHTML = '<strong>Abilities:</strong><br>' + formattedAbilities;

        pokemonModal.show();
    });
});

renderPage();