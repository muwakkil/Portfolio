document.addEventListener('DOMContentLoaded', () => {
  // Initialize every carousel on the page
  document.querySelectorAll('.carousel').forEach(carousel => {
    initCarousel(carousel);
  });
});

function initCarousel(carousel) {
  const track = carousel.querySelector('.carousel-track');
  const images = track.querySelectorAll('img');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');

  if (images.length === 0) return;

  // Hide controls if only one image
  if (images.length === 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  let current = 0;

  // Build dots
  if (dotsContainer) {
    images.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + images.length) % images.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard navigation when carousel is focused/hovered
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      goTo(current + (delta > 0 ? 1 : -1));
    }
  }, { passive: true });
}
