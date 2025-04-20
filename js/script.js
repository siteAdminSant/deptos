    function openPopup(id) {
      document.getElementById('popup' + id).style.display = 'flex';
    }

    function closePopup(id) {
      document.getElementById('popup' + id).style.display = 'none';
    }
    function showFullImage(src) {
      const modal = document.getElementById("fullscreenModal");
      const image = document.getElementById("fullscreenImage");
      image.src = src;
      modal.style.display = "flex";
    }
    
    function closeFullImage() {
      document.getElementById("fullscreenModal").style.display = "none";
    }
    let currentImages = [];
    let currentIndex  = 0;

    // Cuando abras el popup1, rellena el array con sus imágenes:
    function openPopup(id) {
      document.getElementById('popup' + id).style.display = 'flex';
      // recolecta URLs de las miniaturas
      currentImages = Array.from(
        document.querySelectorAll('#popup' + id + ' .horizontal-scroll img')
      ).map(img => img.src);
    }

    // Muestra imagen ampliada y guarda índice
    function showFullImage(src) {
      currentIndex = currentImages.indexOf(src);
      document.getElementById('fullscreenImage').src = src;
      document.getElementById('fullscreenModal').style.display = 'flex';
    }

    // Navegación
    function prevImage() {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      document.getElementById('fullscreenImage').src = currentImages[currentIndex];
    }
    function nextImage() {
      currentIndex = (currentIndex + 1) % currentImages.length;
      document.getElementById('fullscreenImage').src = currentImages[currentIndex];
    }
    
    // Cierra la vista ampliada
    function closeFullImage() {
      document.getElementById('fullscreenModal').style.display = 'none';
    }


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

      const imagenesHTML = depto.imagenes.map(img => `
        <img src="${depto.directorio}${img}" alt="Foto" onclick="showFullImage(this.src)" />
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

