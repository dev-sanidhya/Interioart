(function () {
  // ---- Collection tabs ----
  const collections = {
    home: {
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      alt: 'Full home interior',
      text: 'Turnkey packages covering every room — planned, sourced and delivered end to end, with nothing left for you to chase.',
      spec: 'Type — Residential',
    },
    modular: {
      img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1400&q=80',
      alt: 'Modular kitchen',
      text: 'Kitchens, wardrobes and storage fitted to how you actually move through your home, not a catalogue layout.',
      spec: 'Type — Fitted',
    },
    office: {
      img: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1400&q=80',
      alt: 'Office interior',
      text: 'Workspaces built for focus and clients alike — considered, not just furnished.',
      spec: 'Type — Commercial',
    },
    reno: {
      img: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?auto=format&fit=crop&w=1400&q=80',
      alt: 'Renovation interior',
      text: 'Elevate an existing space without starting from zero — new life for rooms that already have good bones.',
      spec: 'Type — Refit',
    },
  };

  const tabs = document.querySelectorAll('.ctab');
  const cImg = document.getElementById('cImg');
  const cText = document.getElementById('cText');
  const cSpec = document.getElementById('cSpec');

  if (tabs.length && cImg) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.key;
        const data = collections[key];
        if (!data) return;

        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const stage = cImg.closest('.cstage');
        if (stage) stage.style.opacity = '0.35';

        setTimeout(() => {
          cImg.src = data.img;
          cImg.alt = data.alt;
          cText.textContent = data.text;
          cSpec.textContent = data.spec;
          if (stage) stage.style.opacity = '1';
        }, 180);
      });
    });
  }

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
    // straight to the target — CSS scroll-snap-behavior still handles the
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
