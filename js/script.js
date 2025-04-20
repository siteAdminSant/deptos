fetch('./data/info.json')
  .then(response => response.json())
  .then(departamentos => {
    const gallery = document.getElementById('gallery');
    const popupsContainer = document.getElementById('popups-container');

    departamentos.forEach(depto => {
      // Crear tarjeta
      const card = document.createElement('div');
      card.className = 'card';
      card.addEventListener('click', () => openPopup(depto.id));
      //card.setAttribute('onclick', `openPopup(${depto.id})`);
      card.innerHTML = `
        <img src="${depto.imagen}" alt="${depto.titulo}">
        <div class="card-content">
          <div class="card-title">${depto.titulo}</div>
          <div class="card-location">${depto.ubicacion}</div>
        </div>
      `;
      gallery.appendChild(card);

      // Crear popup
      const popup = document.createElement('div');
      popup.className = 'popup';
      popup.id = `popup${depto.id}`;

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
    document.body.style.overflow = 'hidden'; // Evita scroll de fondo
  }
}

function closePopup(id) {
  document.getElementById(`popup${id}`).style.display = 'none';
}

// Cerrar popup con clic fuera
document.addEventListener('click', function (event) {
  console.log('Abriendo popup de ID:');
  const popups = document.querySelectorAll('.popup');
  popups.forEach(popup => {
    if (popup.style.display === 'flex' &&
        !popup.querySelector('.popup-content').contains(event.target) &&
        !event.target.classList.contains('card')) {
      popup.style.display = 'none';
    }
  });
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
  const imgElement = document.getElementById('lightbox-img');
  imgElement.src = currentImageList[currentImageIndex];
}

// Cerrar lightbox con ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeLightbox();
    // También cerramos cualquier popup abierto
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
  }
});
