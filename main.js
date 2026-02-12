
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

function nextSlide() {
  updateGallery(currentIndex + 1, 1);
}

function prevSlide() {
  updateGallery(currentIndex - 1, -1);
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayInterval = setInterval(nextSlide, 5000);
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
  });
});

document.addEventListener('click', (e) => {
  if (floatingMenu && !floatingMenu.contains(e.target) && floatingMenu.classList.contains('active')) {
    floatingMenu.classList.remove('active');
    menuTrigger.setAttribute('aria-expanded', 'false');
  }
});

// Initialize
if (wrappers.length > 0) {
  updateWhatsAppLink(heroConsultBtn, wrappers[0].getAttribute('data-title'));
  startAutoPlay();
}
