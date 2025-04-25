fetch('./data/info.json')
  .then(response => response.json())
  .then(departamentos => {
    const gallery = document.getElementById('gallery');
    const popupsContainer = document.getElementById('popups-container');

    departamentos.forEach(depto => {
      // Crear tarjeta
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${depto.imagen}" alt="${depto.titulo}">
        <div class="card-content">
          <div class="card-title">${depto.titulo}</div>
          <div class="card-location">${depto.ubicacion}</div>
          <div class="depto-capacidad"><i class="fas fa-users"></i> ${depto.capacidad}</div>
          <div class="card-price">Desde $${depto.precio.toLocaleString('es-CL')} CLP</div>
        </div>
      `;
      card.addEventListener('click', () => openPopup(depto.id));
      gallery.appendChild(card);

      // Crear popup
      const popup = document.createElement('div');
      popup.className = 'popup';
      popup.id = `popup-${depto.id}`;

      const fullImageList = depto.imagenes.map(img => `${depto.directorio}${img}`);
      const imagenesHTML = fullImageList.map((imgSrc, index) => `
        <img src="${imgSrc}" alt="Foto" onclick='openLightbox(${JSON.stringify(fullImageList)}, ${index})' />
      `).join('');

      popup.innerHTML = `
        <div class="popup-content">
          <button class="popup-close" onclick="closePopup(${depto.id})">×</button>
          <h2>${depto.titulo}</h2>
          <div class="popup-images horizontal-scroll">
            ${imagenesHTML}
          </div>
          <p>${depto.descripcion}</p>
          <a href="${depto.link}" target="_blank">Ver en Airbnb</a>
        </div>
      `;
      popupsContainer.appendChild(popup);
    });
  })
  .catch(error => console.error('Error al cargar los departamentos:', error));

// Funciones para abrir/cerrar popups
function openPopup(id) {
  const popup = document.getElementById(`popup-${id}`);
  if (popup) {
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closePopup(id) {
  const popup = document.getElementById(`popup-${id}`);
  if (popup) {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Cerrar popup haciendo clic fuera del contenido
document.addEventListener('click', function (event) {
  const activePopup = [...document.querySelectorAll('.popup')].find(p => p.style.display === 'flex');
  if (
    activePopup &&
    !activePopup.querySelector('.popup-content').contains(event.target) &&
    !event.target.closest('.card')
  ) {
    activePopup.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// ============================
// Lightbox / Carrusel
// ============================

let currentImageIndex = 0;
let currentImageList = [];

function openLightbox(images, index) {
  currentImageList = images;
  currentImageIndex = index;
  updateLightboxImage();
  document.getElementById('lightbox').style.display = 'flex';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentImageList.length) % currentImageList.length;
  updateLightboxImage();
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentImageList.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img = document.getElementById('lightbox-img');
  if (img && currentImageList.length) {
    img.src = currentImageList[currentImageIndex];
  }
}

// Cerrar todo con ESC
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeLightbox();
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
    document.body.style.overflow = 'auto';
  }
});

document.getElementById('capacity-filter').addEventListener('change', function() {
  const selectedCapacity = parseInt(this.value);
  filterDepartmentsByCapacity(selectedCapacity);
});

function filterDepartmentsByCapacity(capacity) {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    const deptoCapacity = parseInt(card.querySelector('.depto-capacidad').value);
    
    if (capacity === 4 && deptoCapacity >= 4 || deptoCapacity === capacity || deptoCapacity === 0) {
      card.style.display = 'block';  // Mostrar el departamento
    } else {
      card.style.display = 'none';  // Ocultar el departamento
    }
  });
}


document.getElementById('price-filter').addEventListener('change', function() {
  const selectedPrice = parseInt(this.value);
  filterDepartmentsByPrice(selectedPrice);
});

function filterDepartmentsByPrice(price) {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    const deptoPrice = parseInt(card.querySelector('.card-price').textContent.replace(/\D/g, ''));
    
    if (deptoPrice <= price || deptoPrice === 0) {
      card.style.display = 'block';  // Mostrar el departamento
    } else {
      card.style.display = 'none';  // Ocultar el departamento
    }
  });
}
