
// Portfolio Viewer Logic
const portfolioMainImg = document.getElementById('portfolioMainImg');
const portfolioTitle = document.getElementById('portfolioTitle');
const portfolioDesc = document.getElementById('portfolioDesc');
const portfolioConsultBtn = document.querySelector('.portfolio-btn');
const thumbItems = document.querySelectorAll('.thumb-item');

function updateWhatsAppLink(btn, title) {
  if (!btn) return;
  const WHATSAPP_NUMBER = "5491150997333";
  const message = encodeURIComponent(`Hola Biko Inventor! Quiero consultar por la bicicleta: ${title}`);
  btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

if (thumbItems.length > 0) {
  updateWhatsAppLink(portfolioConsultBtn, thumbItems[0].getAttribute('data-title'));
}

thumbItems.forEach(thumb => {
  thumb.addEventListener('click', () => {
    if (thumb.classList.contains('active')) return;
    thumbItems.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    const title = thumb.getAttribute('data-title');
    const desc = thumb.getAttribute('data-desc');
    const img = thumb.getAttribute('data-img');

    portfolioMainImg.style.transform = 'scale(1.05)';
    portfolioMainImg.style.opacity = 0;
    portfolioTitle.style.opacity = 0;
    portfolioDesc.style.opacity = 0;

    setTimeout(() => {
      portfolioMainImg.src = img;
      portfolioTitle.textContent = title;
      portfolioDesc.textContent = desc;
      updateWhatsAppLink(portfolioConsultBtn, title);
      portfolioMainImg.style.transform = 'scale(1)';
      portfolioMainImg.style.opacity = 1;
      portfolioTitle.style.opacity = 1;
      portfolioDesc.style.opacity = 1;
    }, 300);
  });
});

// Draggable Portfolio Thumbnails
const slider = document.querySelector('.viewer-thumbnails');
if (slider) {
  let isDown = false;
  let startX;
  let scrollLeft;
  let isDragging = false;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    isDragging = false;
    slider.style.scrollBehavior = 'auto';
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
    slider.style.scrollBehavior = 'smooth';
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 5) isDragging = true;
    slider.scrollLeft = scrollLeft - walk;
  });

  thumbItems.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      if (isDragging) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);
  });
}

// Blog Expansion Logic
document.querySelectorAll('.read-more').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const post = btn.closest('.blog-post');
    const isExpanded = post.classList.toggle('expanded');
    btn.textContent = isExpanded ? 'Cerrar historia' : 'Leer historia';
    if (isExpanded) {
      setTimeout(() => {
        post.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 400);
    }
  });
});
