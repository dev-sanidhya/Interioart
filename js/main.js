// Smooth scroll (Lenis) — Framer/Linear-style buttery scroll
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Nav shrink on scroll — switch once the hero has mostly scrolled past
const nav = document.getElementById('nav');
lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > window.innerHeight * 0.7);
});

// Hero parallax
gsap.to('.hero-bg img', {
  scale: 1,
  yPercent: 12,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

// Reveal-on-scroll — slow and understated, not a stagger effect
document.querySelectorAll('[data-reveal]').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 92%',
    },
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// Smooth anchor scrolling via Lenis
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -20 });
    }
  });
});
