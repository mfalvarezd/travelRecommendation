// Función para obtener y mostrar recomendaciones
async function fetchRecommendations() {
    try {
        // Obtener datos del archivo JSON
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        const data = await response.json();
        console.log('Datos obtenidos:', data); // Verificar en la consola

        // Mostrar recomendaciones en la página
        displayRecommendations(data);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Función para mostrar recomendaciones en la página
function displayRecommendations(data, searchTerm = '') {
    const recommendationsContainer = document.getElementById('recommendations');
    recommendationsContainer.innerHTML = ''; // Limpiar antes de añadir

    searchTerm = searchTerm.toLowerCase();

    const categories = [
        { key: 'countries', title: 'Países' },
        { key: 'temples', title: 'Templos' },
        { key: 'beaches', title: 'Playas' }
    ];

    categories.forEach(category => {
        if (data[category.key] && data[category.key].length > 0 && (searchTerm === '' || category.key.includes(searchTerm))) {
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = category.title;
            sectionTitle.className = 'category-title';
            recommendationsContainer.appendChild(sectionTitle);

            data[category.key].forEach(item => {
                let cardData = item;
                if (category.key === 'countries' && item.cities && item.cities.length > 0) {
                    cardData = {
                        name: `${item.name} - ${item.cities[0].name}`,
                        imageUrl: item.cities[0].imageUrl,
                        description: `${item.description || ''} ${item.cities[0].description}`
                    };
                }
                const card = createCard(cardData);
                recommendationsContainer.appendChild(card);
            });
        }
    });
}

// Función para crear una tarjeta de recomendación
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    const image = document.createElement('img');
    image.src = item.imageUrl;
    image.alt = item.name;
    card.appendChild(image);

    const title = document.createElement('h3');
    title.textContent = item.name;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = item.description;
    card.appendChild(description);

    return card;
}

// Evento para realizar búsqueda
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchInput === '') {
        alert('Por favor, ingresa un término de búsqueda.'); // Validación
        return;
    }

    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        displayRecommendations(data, searchInput);
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar las recomendaciones.');
    }
});

// Función para limpiar los resultados y el campo de búsqueda
function clearResults() {
    document.getElementById('searchInput').value = ''; // Limpiar el campo de búsqueda
    document.getElementById('recommendations').innerHTML = ''; // Limpiar los resultados
}

// Evento para limpiar la búsqueda
document.getElementById('clearButton').addEventListener('click', clearResults);

// Llamar a la función para obtener y mostrar recomendaciones
fetchRecommendations();
