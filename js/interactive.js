(function () {
  // ---- Before/after compare slider ----
  const range = document.getElementById('compareRange');
  const afterImg = document.getElementById('compareAfter');
  const handle = document.getElementById('compareHandle');

  function updateCompare(value) {
    if (afterImg) afterImg.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    if (handle) handle.style.left = value + '%';
  }

  if (range) {
    updateCompare(range.value);
    range.addEventListener('input', (e) => updateCompare(e.target.value));
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
