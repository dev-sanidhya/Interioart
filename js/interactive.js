(function () {
  // ---- VR walkthrough pan viewer: move the cursor to look around ----
  const vrPan = document.getElementById('vrPan');
  const vrPanImg = document.getElementById('vrPanImg');

  if (vrPan && vrPanImg) {
    const panTo = (clientX) => {
      const rect = vrPan.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const imgWidth = vrPanImg.getBoundingClientRect().width;
      const maxOffset = (imgWidth - rect.width) / 2;
      const offset = (ratio - 0.5) * 2 * maxOffset;
      vrPanImg.style.transform = `translateX(calc(-50% - ${offset}px))`;
    };

    vrPan.addEventListener('mousemove', (e) => panTo(e.clientX));
    vrPan.addEventListener('mouseleave', () => {
      vrPanImg.style.transform = 'translateX(-50%)';
    });
    vrPan.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches[0]) panTo(e.touches[0].clientX);
      },
      { passive: true }
    );
  }

  // ---- Testimonial carousel ----
  const carousel = document.getElementById('testiCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (carousel && prevBtn && nextBtn) {
    // scroll-snap-type fights any animated scrollLeft change (native smooth
    // scroll and GSAP tweens both get snapped back mid-flight), so jump
    // straight to the target. CSS scroll-snap-behavior still handles the
    // settle, and drag/swipe scrolling is unaffected and stays native-smooth.
    const scrollByCard = (dir) => {
      const card = carousel.querySelector('.carousel-item');
      const style = getComputedStyle(carousel);
      const gap = parseFloat(style.columnGap || style.gap) || 24;
      const amount = card ? card.getBoundingClientRect().width + gap : 400;
      const max = carousel.scrollWidth - carousel.clientWidth;
      carousel.scrollLeft = Math.max(0, Math.min(max, carousel.scrollLeft + dir * amount));
    };
    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
  }
})();
