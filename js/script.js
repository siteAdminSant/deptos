
// Carga deptos dinamicamente

fetch('./data/info.json')
  .then(response => response.json())
  .then(departamentos => {
    const gallery = document.getElementById('gallery');
    const popupsContainer = document.getElementById('popups-container');

    departamentos.forEach(depto => {
      // Crear tarjeta
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('onclick', `openPopup(${depto.id})`);
      card.innerHTML = `
        <img src="${depto.imagen}" alt="${depto.titulo}">
        <div class="card-content">
          <div class="card-title">${depto.titulo}</div>
          <div class="card-location">${depto.ubicacion}</div>
        </div>
      `;
      gallery.appendChild(card);

      // Crear popup dinámico
      const popup = document.createElement('div');
      popup.className = 'popup';
      popup.id = `popup${depto.id}`;

      /*const imagenesHTML = depto.imagenes.map(img => `
        <img src="${depto.directorio}${img}" alt="Foto" onclick="showFullImage(this.src)" />
      `).join('');*/
      const imagenesHTML = depto.imagenes.map((img, index) => `
        <img src="${depto.directorio}${img}" alt="Foto" onclick="openLightbox(${JSON.stringify(
          depto.imagenes.map(imgName => depto.directorio + imgName)
        )}, ${index})" />
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

function openPopup(id) {
  document.getElementById(`popup${id}`).style.display = 'flex';
}

function closePopup(id) {
  document.getElementById(`popup${id}`).style.display = 'none';
}

function showFullImage(src) {
  const win = window.open("", "_blank");
  win.document.write(`<img src="${src}" style="width:100%">`);
}

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

// Cerrar con ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeLightbox();
  }
});


