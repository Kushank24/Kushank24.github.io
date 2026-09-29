/* ─────────────────────────────────────────────
   LOADER
   ───────────────────────────────────────────── */
(function () {
  const loader  = document.getElementById('loader');
  const counter = document.getElementById('loaderCounter');
  const bar     = document.getElementById('loaderBar');

  if (!loader) return;

  const DURATION = 1800; // ms
  const start    = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / DURATION, 1);
    // Ease out quart
    const eased = 1 - Math.pow(1 - p, 4);
    const count = Math.round(eased * 100);
    counter.textContent = String(count).padStart(3, '0');
    bar.style.width = count + '%';

    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      loader.classList.add('done');
      setTimeout(() => {
        loader.style.display = 'none';
        document.body.style.overflow = '';
      }, 800);
    }
  }

  document.body.style.overflow = 'hidden';
  requestAnimationFrame(tick);
})();

/* ─────────────────────────────────────────────
   NAV — scroll shadow + active link highlight
   ───────────────────────────────────────────── */
const navPill = document.getElementById('navPill');

window.addEventListener('scroll', () => {
  navPill?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Highlight active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => sectionObserver.observe(s));

/* ─────────────────────────────────────────────
   COUNTER ANIMATION
   ───────────────────────────────────────────── */
function animateCount(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start    = performance.now();

  function step(now) {
    const p     = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER — fade-up + counters
   ───────────────────────────────────────────── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach((el) => {
  // Stagger siblings
  const siblings = [...(el.parentElement?.querySelectorAll('.fade-up') || [])];
  const idx      = siblings.indexOf(el);
  el.style.transitionDelay = idx * 80 + 'ms';
  fadeObserver.observe(el);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.count').forEach(animateCount);
        countObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.6 }
);

const statsEl = document.querySelector('.hero-stats');
if (statsEl) countObserver.observe(statsEl);

/* ─────────────────────────────────────────────
   STOCK CHART (Canvas — purple accent line)
   ───────────────────────────────────────────── */
function drawChart() {
  const canvas = document.getElementById('stockChart');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.offsetWidth  || 280;
  const H   = canvas.offsetHeight || 160;

  canvas.width  = W * dpr;
  canvas.height = H * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cs     = getComputedStyle(document.documentElement);
  const purple = cs.getPropertyValue('--purple').trim() || '#A78BFA';
  const border = cs.getPropertyValue('--border').trim() || '#272727';
  const muted  = cs.getPropertyValue('--muted').trim()  || '#888';
  const muted2 = cs.getPropertyValue('--muted2').trim() || '#555';
  const green  = cs.getPropertyValue('--green').trim()  || '#4ADE80';
  const a1     = cs.getPropertyValue('--a1').trim()     || '#89AACC';

  const PL = 38, PR = 16, PT = 28, PB = 30;
  const CW = W - PL - PR;
  const CH = H - PT - PB;

  // Raw price points — relative (0 = top, 1 = bottom)
  const pts = [
    [0,    0.82], [0.08, 0.74], [0.15, 0.88],
    [0.25, 0.58], [0.33, 0.63], [0.42, 0.46],
    [0.5,  0.38], [0.58, 0.30], [0.67, 0.24],
    [0.76, 0.18], [0.85, 0.12], [0.92, 0.08],
    [1.0,  0.05],
  ];

  function pt(nx, ny) {
    return [PL + nx * CW, PT + ny * CH];
  }

  ctx.clearRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = border;
  ctx.lineWidth   = 0.5;
  [0.25, 0.5, 0.75, 1].forEach((t) => {
    const y = PT + t * CH;
    ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke();
  });

  // Area gradient
  const grad = ctx.createLinearGradient(0, PT, 0, PT + CH);
  grad.addColorStop(0,   purple + '55');
  grad.addColorStop(0.8, purple + '00');

  ctx.beginPath();
  pts.forEach(([nx, ny], i) => {
    const [x, y] = pt(nx, ny);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  const [lx] = pt(pts[pts.length - 1][0], pts[pts.length - 1][1]);
  const [fx] = pt(pts[0][0], pts[0][1]);
  ctx.lineTo(lx, PT + CH);
  ctx.lineTo(fx, PT + CH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  pts.forEach(([nx, ny], i) => {
    const [x, y] = pt(nx, ny);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = purple;
  ctx.lineWidth   = 1.8;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  ctx.stroke();

  // End dot + glow
  const [ex, ey] = pt(pts[pts.length - 1][0], pts[pts.length - 1][1]);
  const glow     = ctx.createRadialGradient(ex, ey, 0, ex, ey, 12);
  glow.addColorStop(0, purple + 'aa');
  glow.addColorStop(1, purple + '00');
  ctx.beginPath(); ctx.arc(ex, ey, 12, 0, Math.PI * 2);
  ctx.fillStyle = glow; ctx.fill();
  ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = purple; ctx.fill();

  // Y labels
  const prices = ['₹22k', '₹20k', '₹18k', '₹16k'];
  ctx.fillStyle    = muted2;
  ctx.font         = `500 8px 'Courier New', monospace`;
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'middle';
  [0, 0.33, 0.67, 1].forEach((t, i) => ctx.fillText(prices[i], PL - 4, PT + t * CH));

  // X labels
  const months = ['Jan', 'Apr', 'Jul', 'Oct'];
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';
  months.forEach((m, i) => {
    ctx.fillText(m, PL + (i / (months.length - 1)) * CW, PT + CH + 6);
  });

  // Title
  ctx.fillStyle    = muted;
  ctx.font         = `400 italic 10px 'Instrument Serif', serif`;
  ctx.textAlign    = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('NIFTY 50  ·  YTD', PL, 10);

  ctx.fillStyle    = green;
  ctx.font         = `600 9px 'Courier New', monospace`;
  ctx.textAlign    = 'right';
  ctx.fillText('+18.4%', W - PR, 10);
}

document.fonts.ready.then(drawChart);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawChart, 120);
}, { passive: true });
