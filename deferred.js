
// Portfolio Viewer Logic
(function () {
  const portfolioMainImg = document.getElementById('portfolioMainImg');
  const portfolioTitle = document.getElementById('portfolioTitle');
  const portfolioDesc = document.getElementById('portfolioDesc');
  const portfolioConsultBtn = document.querySelector('.portfolio-btn');
  const thumbItems = document.querySelectorAll('.thumb-item');
  const portfolioTabs = document.getElementById('portfolioTabs');
  const portfolioImageContainer = document.getElementById('portfolioImageContainer');
  const portfolioTech = document.getElementById('portfolioTech');
  const btnShowGallery = document.getElementById('btnShowGallery');
  const btnShowTech = document.getElementById('btnShowTech');

  function updateWhatsAppLinkLocal(btn, title) {
    if (!btn) return;
    const WHATSAPP_NUMBER = "5491150997333";
    const message = encodeURIComponent(`Hola Biko Inventor! Quiero consultar por la bicicleta: ${title}`);
    btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  }

  function showTab(type) {
    if (type === 'gallery') {
      portfolioImageContainer.style.display = 'flex';
      portfolioTech.style.display = 'none';
      btnShowGallery.classList.add('active');
      btnShowTech.classList.remove('active');
    } else {
      portfolioImageContainer.style.display = 'none';
      portfolioTech.style.display = 'flex';
      btnShowGallery.classList.remove('active');
      btnShowTech.classList.add('active');
    }
  }

  if (btnShowGallery) btnShowGallery.addEventListener('click', () => showTab('gallery'));
  if (btnShowTech) btnShowTech.addEventListener('click', () => showTab('tech'));

  if (thumbItems.length > 0) {
    const initialTitle = thumbItems[0].getAttribute('data-title');
    updateWhatsAppLinkLocal(portfolioConsultBtn, initialTitle);

    if (portfolioTabs) {
      portfolioTabs.style.display = 'flex';
    }
  }

  thumbItems.forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (thumb.classList.contains('active')) return;
      thumbItems.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const title = thumb.getAttribute('data-title');
      const desc = thumb.getAttribute('data-desc');
      const img = thumb.getAttribute('data-img');

      // Reset to gallery view when changing bike
      showTab('gallery');

      // Tabs are always visible now
      if (portfolioTabs) {
        portfolioTabs.style.display = 'flex';
      }

      portfolioMainImg.style.transform = 'scale(1.05)';
      portfolioMainImg.style.opacity = 0;
      portfolioTitle.style.opacity = 0;
      portfolioDesc.style.opacity = 0;

      setTimeout(() => {
        portfolioMainImg.src = img;
        portfolioTitle.textContent = title;
        portfolioDesc.textContent = desc;
        updateWhatsAppLinkLocal(portfolioConsultBtn, title);
        portfolioMainImg.style.transform = 'scale(1)';
        portfolioMainImg.style.opacity = 1;
        portfolioTitle.style.opacity = 1;
        portfolioDesc.style.opacity = 1;
      }, 300);
    });
  });

  // Draggable Portfolio Thumbnails (INSIDE SCOPE)
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
})();

// Blog Expansion Logic
document.querySelectorAll('.read-more').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const post = btn.closest('.blog-post');
    const postTitle = post.querySelector('h3').textContent.trim();
    const isExpanded = post.classList.toggle('expanded');

    // Update text and accessibility label
    btn.textContent = isExpanded ? 'Cerrar historia' : 'Leer historia';
    btn.setAttribute('aria-label', isExpanded ?
      `Cerrar historia sobre ${postTitle}` :
      `Leer historia completa sobre ${postTitle}`);

    if (isExpanded) {
      setTimeout(() => {
        post.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 400);
    }
  });
});

// Optimization: Lite YouTube and Lazy Map
const initOptimizations = () => {
  // Lite YouTube Embeds Logic
  const liteYoutubes = document.querySelectorAll('.lite-youtube');

  liteYoutubes.forEach(el => {
    el.addEventListener('click', () => {
      if (el.classList.contains('lyt-activated')) return;

      const videoId = el.getAttribute('data-id');
      const iframe = document.createElement('iframe');

      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('title', el.querySelector('.lyt-visually-hidden')?.textContent || 'Reproducir Video');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);

      el.appendChild(iframe);
      el.classList.add('lyt-activated');
    });
  });

  // Intersection Observer for Lazy Map
  const lazyMaps = document.querySelectorAll('.lazy-map');
  if (lazyMaps.length > 0 && 'IntersectionObserver' in window) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const map = entry.target;
          const src = map.getAttribute('data-src');
          if (src) {
            map.src = src;
            map.removeAttribute('data-src');
          }
          mapObserver.unobserve(map);
        }
      });
    }, { rootMargin: '300px' });

    lazyMaps.forEach(map => mapObserver.observe(map));
  } else {
    lazyMaps.forEach(map => {
      const src = map.getAttribute('data-src');
      if (src) map.src = src;
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOptimizations);
} else {
  initOptimizations();
}
