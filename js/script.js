// --- Menú Hamburguesa ---
const toggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu');
const iconPath = document.getElementById('menu-icon-path');

toggle.addEventListener('click', () => {
  mobileMenu.classList.remove('hidden');
  iconPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
});

closeMenuBtn.addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
  mobileMenu.classList.add('hidden');
  iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
}

// --- Galería Dinámica ---
let departamentos = [];
let currentImageIndex = 0;
let currentImageList = [];

fetch('./data/info.json')
  .then(response => response.json())
  .then(data => {
    departamentos = data;
    renderDepartments(departamentos);
  });

function renderDepartments(data) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  data.forEach(depto => {
    const card = document.createElement('div');
    card.className = 'card bg-white rounded shadow overflow-hidden transform hover:scale-105 transition-all fade-in';
    card.innerHTML = `
      <img src="${depto.imagen}" alt="${depto.titulo}" loading="lazy" class="w-full h-48 object-cover">
      <div class="p-4">
        <h2 class="font-bold text-lg mb-2">${depto.titulo}</h2>
        <p class="text-gray-600 text-sm mb-1">${depto.ubicacion}</p>
        <p class="text-gray-600 text-sm mb-1">👥 ${depto.capacidad} personas</p>
        <p class="text-indigo-600 font-semibold">Desde $${parseInt(depto.precio).toLocaleString('es-CL')}</p>
      </div>
    `;
    card.addEventListener('click', () => openPopup(depto.id));
    gallery.appendChild(card);
  });
}

// --- Popup de Departamento ---
function openPopup(id) {
  const depto = departamentos.find(d => d.id == id);
  if (!depto) return console.error('Departamento no encontrado');

  const popupContent = document.getElementById('popup-content');
  const fullImageList = depto.imagenes?.map(img => `${depto.directorio}${img}`) || [];
  currentImageList = fullImageList;

  popupContent.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">${depto.titulo}</h2>
    ${fullImageList.length > 0 ? `
      <div class="flex overflow-x-auto space-x-4 mb-4 popup-thumbnails">
        ${fullImageList.map((img, i) => `<img src="${img}" loading="lazy" class="h-40 cursor-pointer" onclick="openLightbox(currentImageList, ${i})">`).join('')}
      </div>
    ` : `<p class="mb-4 text-red-500">No hay imágenes disponibles.</p>`}
    <p class="mb-4">${depto.descripcion}</p>
    <a href="${depto.link}" target="_blank" class="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_Bélo.svg/20px-Airbnb_Logo_Bélo.svg.png" alt="Airbnb" class="w-5 h-5 mr-2">
      Ver en Airbnb
    </a>
  `;

  document.getElementById('popup').classList.remove('hidden');
  setTimeout(() => document.getElementById('popup').classList.add('show'), 10);
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  const popup = document.getElementById('popup');
  popup.classList.remove('show');
  setTimeout(() => popup.classList.add('hidden'), 300);
  document.body.style.overflow = 'auto';
}

// Cierra popup si haces click fuera
document.getElementById('popup').addEventListener('click', function (e) {
  if (e.target === this) closePopup();
});

// --- Lightbox ---
function openLightbox(images, index) {
  currentImageList = images;
  currentImageIndex = index;
  updateLightboxImage();
  document.getElementById('lightbox').classList.remove('hidden');
  setTimeout(() => document.getElementById('lightbox').classList.add('show'), 10);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('show');
  setTimeout(() => lightbox.classList.add('hidden'), 300);
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
  img.style.opacity = 0;
  setTimeout(() => {
    img.src = currentImageList[currentImageIndex];
    img.style.opacity = 1;
  }, 200);
}

// --- Filtros ---
document.getElementById('capacity-filter').addEventListener('change', applyFilters);
document.getElementById('price-filter').addEventListener('change', applyFilters);
document.getElementById('reset-filters').addEventListener('click', () => {
  document.getElementById('capacity-filter').value = '';
  document.getElementById('price-filter').value = '';
  renderDepartments(departamentos);
});

function applyFilters() {
  const selectedCapacity = parseInt(document.getElementById('capacity-filter').value);
  const selectedPrice = parseInt(document.getElementById('price-filter').value);

  const filtered = departamentos.filter(d => {
    const matchesCapacity = isNaN(selectedCapacity) || parseInt(d.capacidad) >= selectedCapacity;
    const matchesPrice = isNaN(selectedPrice) || parseInt(d.precio) <= selectedPrice;
    return matchesCapacity && matchesPrice;
  });

  renderDepartments(filtered);
}

// --- Formulario de Contacto ---
const form = document.getElementById('contact-form');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const formStatus = document.getElementById('form-status');

emailInput.addEventListener('input', () => {
  if (!emailInput.validity.valid) {
    emailError.classList.remove('hidden');
    emailInput.classList.add('border-red-500');
  } else {
    emailError.classList.add('hidden');
    emailInput.classList.remove('border-red-500');
  }
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!emailInput.validity.valid) {
    emailError.classList.remove('hidden');
    emailInput.classList.add('border-red-500');
    return;
  }

  const formData = new FormData(form);

  try {
    const response = await fetch('https://formspree.io/f/tu-codigo-formspree', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    if (response.ok) {
      formStatus.textContent = '¡Mensaje enviado correctamente!';
      formStatus.classList.remove('hidden');
      form.reset();
    } else {
      formStatus.textContent = 'Hubo un error al enviar el formulario. Intenta nuevamente.';
      formStatus.classList.remove('hidden');
      formStatus.classList.add('text-red-500');
    }

  } catch (error) {
    formStatus.textContent = 'Error de conexión. Intenta más tarde.';
    formStatus.classList.remove('hidden');
    formStatus.classList.add('text-red-500');
  }
});
