document.addEventListener('DOMContentLoaded', () => {
  // Initialize every carousel on the page
  document.querySelectorAll('.carousel').forEach(carousel => {
    initCarousel(carousel);
  });

  // Scroll hint arrow — only on project pages
  initScrollHint();
});

function initScrollHint() {
  if (!document.querySelector('.project-page, .ah-page')) return;

  const hint = document.createElement('div');
  hint.className = 'scroll-hint bounce-down';
  hint.textContent = '↓';
  document.body.appendChild(hint);

  function updateHint() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
    const atTop = window.scrollY <= 10;

    hint.classList.remove('bounce-down', 'bounce-up');

    if (atBottom) {
      hint.textContent = '↑';
      hint.classList.add('bounce-up');
    } else if (atTop) {
      hint.textContent = '↓';
      hint.classList.add('bounce-down');
    } else {
      hint.textContent = '↓';
    }
  }

  function triggerDoubleBounce() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
    const bounceClass = atBottom ? 'double-bounce-up' : 'double-bounce-down';

    hint.classList.remove('bounce-down', 'bounce-up');
    hint.classList.add(bounceClass);

    hint.addEventListener('animationend', () => {
      hint.classList.remove(bounceClass);
      updateHint();
      resetIdleTimer();
    }, { once: true });
  }

  let idleTimer;

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(triggerDoubleBounce, 8000);
  }

  window.addEventListener('scroll', () => {
    updateHint();
    resetIdleTimer();
  }, { passive: true });

  resetIdleTimer();
}

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
