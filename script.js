document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealTargets = document.querySelectorAll(
  '.section-title, .about-text, .stat, .timeline-item, .skill-card, .achievement-card, .edu-card, .subheading, .contact-lead, .contact-links'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((el) => observer.observe(el));

const netCanvas = document.getElementById('netCanvas');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (netCanvas && !prefersReducedMotion) {
  const ctx = netCanvas.getContext('2d');
  let width, height, nodes;
  const LINK_DIST = 130;
  const NODE_COUNT_DIVISOR = 16000;

  function isDarkTheme() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark') return true;
    if (explicit === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function resize() {
    width = netCanvas.width = window.innerWidth;
    height = netCanvas.height = window.innerHeight;
    const count = Math.min(90, Math.max(28, Math.floor((width * height) / NODE_COUNT_DIVISOR)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  }

  function step() {
    const dark = isDarkTheme();
    const dotColor = dark ? 'rgba(51, 224, 255, 0.65)' : 'rgba(8, 145, 178, 0.55)';
    const lineColor = dark ? '51, 224, 255' : '8, 145, 178';

    ctx.clearRect(0, 0, width, height);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(${lineColor}, ${0.16 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = dotColor;
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(step);
}
