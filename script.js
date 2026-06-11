// ============================================================
// ODIN'S EYE APPS — interactions
// ============================================================

// ----- Falling rune particles in the hero -----
(function runeRain() {
  const canvas = document.getElementById("runeCanvas");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const count = Math.min(40, Math.floor(canvas.width / 30));
    particles = Array.from({ length: count }, () => spawn(true));
  }

  function spawn(anywhere) {
    return {
      x: Math.random() * canvas.width,
      y: anywhere ? Math.random() * canvas.height : -20,
      speed: 0.2 + Math.random() * 0.5,
      size: 10 + Math.random() * 14,
      alpha: 0.04 + Math.random() * 0.12,
      glyph: RUNES[Math.floor(Math.random() * RUNES.length)],
      drift: (Math.random() - 0.5) * 0.15,
    };
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speed;
      p.x += p.drift;
      if (p.y > canvas.height + 24) particles[i] = spawn(false);
      ctx.font = p.size + "px serif";
      ctx.fillStyle = "rgba(212, 175, 55, " + p.alpha + ")";
      ctx.fillText(p.glyph, p.x, p.y);
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();
})();

// ----- Navbar background on scroll -----
(function navScroll() {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ----- Mobile menu -----
(function mobileMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );
})();

// ----- Scroll reveal -----
(function scrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

// ----- Animated stat counters -----
(function statCounters() {
  const stats = document.querySelectorAll(".stat-number");
  if (!stats.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  stats.forEach((el) => observer.observe(el));
})();

// ----- Contact form (front-end only) -----
(function contactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // No backend yet — wire this to your email service or API endpoint.
    note.hidden = false;
    form.reset();
  });
})();

// ----- Footer year -----
document.getElementById("year").textContent = new Date().getFullYear();
