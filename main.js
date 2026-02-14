
const wrappers = document.querySelectorAll('.img-wrapper');
const mainTitle = document.getElementById('main-title');
const descText = document.getElementById('main-description');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const heroConsultBtn = document.getElementById('heroConsultBtn');
const WHATSAPP_NUMBER = "5491150997333";
const wheelFrame = document.querySelector('.wheel-gallery');
const floatingMenu = document.getElementById('floatingMenu');
const menuTrigger = document.getElementById('menuTrigger');
const menuItemsLinks = document.querySelectorAll('.menu-items a');
const techSpecBtn = document.getElementById('techSpecBtn');

let currentIndex = 0;
let autoPlayInterval;
let currentRotation = 0;

function updateWhatsAppLink(btn, title) {
  if (!btn) return;
  const message = encodeURIComponent(`Hola Biko Inventor! Quiero consultar por la bicicleta: ${title}`);
  btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

function updateGallery(index, direction = 1) {
  wrappers.forEach(w => w.classList.remove('active'));
  currentRotation += (360 * direction);
  wheelFrame.style.transform = `rotate(${currentRotation}deg)`;
  currentIndex = (index + wrappers.length) % wrappers.length;
  wrappers[currentIndex].classList.add('active');

  const title = wrappers[currentIndex].getAttribute('data-title');
  const desc = wrappers[currentIndex].getAttribute('data-desc');

  mainTitle.style.opacity = 0;
  descText.style.opacity = 0;

  setTimeout(() => {
    mainTitle.textContent = title;
    descText.textContent = desc;
    updateWhatsAppLink(heroConsultBtn, title);

    if (techSpecBtn) {
      techSpecBtn.style.display = (title === "Bici Canguro") ? "inline-flex" : "none";
    }

    mainTitle.style.opacity = 1;
    descText.style.opacity = 1;
  }, 300);
}

function nextSlide(auto = false) {
  if (auto && currentIndex === wrappers.length - 1) {
    stopAutoPlay();
    return;
  }
  updateGallery(currentIndex + 1, 1);
}

function prevSlide() {
  updateGallery(currentIndex - 1, -1);
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayInterval = setInterval(() => nextSlide(true), 5000);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

// Event Listeners for Hero
if (nextBtn) nextBtn.addEventListener('click', () => {
  nextSlide();
  startAutoPlay();
});

if (prevBtn) prevBtn.addEventListener('click', () => {
  prevSlide();
  startAutoPlay();
});

// Menu Logic
if (menuTrigger) {
  menuTrigger.addEventListener('click', () => {
    const isExpanded = floatingMenu.classList.toggle('active');
    menuTrigger.setAttribute('aria-expanded', isExpanded);
  });
}

menuItemsLinks.forEach(link => {
  link.addEventListener('click', () => {
    floatingMenu.classList.remove('active');
    menuTrigger.setAttribute('aria-expanded', 'false');
    handleMenuVisibility();
  });
});

// Menu Scroll Visibility Logic
let scrollTimeout;
function handleMenuVisibility() {
  if (!floatingMenu) return;

  // Si el menú está abierto (activo), no lo ocultamos
  if (floatingMenu.classList.contains('active')) {
    floatingMenu.classList.remove('menu-hidden');
    return;
  }

  // Siempre visible en la primera parte (Hero)
  const isAtTop = window.scrollY < window.innerHeight * 0.8;

  if (isAtTop) {
    floatingMenu.classList.remove('menu-hidden');
    clearTimeout(scrollTimeout);
  } else {
    // Si estamos desplazándonos, lo mostramos
    floatingMenu.classList.remove('menu-hidden');

    // Programamos ocultarlo después de un tiempo de inactividad
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Doble check: no ocultar si el menú se abrió mientras esperábamos
      if (!floatingMenu.classList.contains('active') && window.scrollY >= window.innerHeight * 0.5) {
        floatingMenu.classList.add('menu-hidden');
      }
    }, 2500); // 2.5 segundos de inactividad para ocultar
  }
}

window.addEventListener('scroll', handleMenuVisibility, { passive: true });

document.addEventListener('click', (e) => {
  if (floatingMenu && !floatingMenu.contains(e.target) && floatingMenu.classList.contains('active')) {
    floatingMenu.classList.remove('active');
    menuTrigger.setAttribute('aria-expanded', 'false');
    // Al cerrar, re-evaluar visibilidad
    handleMenuVisibility();
  }
});

// Initialize
if (wrappers.length > 0) {
  updateWhatsAppLink(heroConsultBtn, wrappers[0].getAttribute('data-title'));
  startAutoPlay();
}
handleMenuVisibility();
