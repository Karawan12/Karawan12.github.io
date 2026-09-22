(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;

  /* ---------- navbar ---------- */
  const nav = $('#nav'), menu = $('#menu'), burger = $('#burger');
  burger.onclick = () => { menu.classList.toggle('open'); burger.classList.toggle('open'); };
  $$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.classList.remove('open'); }));

  /* scroll progress bar */
  const bar = document.createElement('div'); bar.id = 'progress'; document.body.prepend(bar);
  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 30);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
  }, { passive: true });

  /* active link on scroll */
  const links = $$('#menu a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => spy.observe(s));

  /* ---------- hero title: words rise in ---------- */
  const h1 = $('.hero h1');
  if (h1) {
    [...h1.childNodes].forEach(n => {
      if (n.nodeType === 3 && n.textContent.trim()) {
        const w = document.createElement('span'); w.className = 'w'; w.textContent = n.textContent.trim() + ' ';
        n.replaceWith(w);
      }
    });
  }

  /* ---------- typing effect ---------- */
  const roles = ['IT Systems Engineer', 'Windows Deployment Automation', 'Network & SD-WAN', 'Cisco Networking Academy Instructor'];
  const el = $('#typing');
  if (el) {
    let r = 0, c = 0, del = false;
    (function type() {
      const word = roles[r];
      el.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(type, 1500); }
      if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
      c += del ? -1 : 1;
      setTimeout(type, del ? 35 : 80);
    })();
  }

  /* ---------- orbiting tech chips around the photo ---------- */
  const hp = $('.hero-photo');
  if (hp) {
    const o = document.createElement('div'); o.className = 'orbit';
    ['PowerShell', 'Ansible', 'SD-WAN', 'Cisco', 'Linux'].forEach((t, i) => {
      const a = document.createElement('div'); a.className = 'arm'; a.style.setProperty('--a', i * 72 + 'deg');
      const c = document.createElement('span'); c.className = 'chip'; c.textContent = t;
      a.appendChild(c); o.appendChild(a);
    });
    hp.prepend(o);
  }

  /* ---------- floating shapes behind everything ---------- */
  const bg = $('.bg');
  if (bg && !reduce) {
    const cols = ['#00f5a0', '#00b8ff', '#8a5cff'];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('i'); s.className = 'shape';
      const size = 14 + Math.random() * 40;
      Object.assign(s.style, {
        width: size + 'px', height: size + 'px', left: Math.random() * 100 + '%',
        borderColor: cols[i % 3], borderRadius: ['50%', '8px', '0'][i % 3],
        animationDuration: 16 + Math.random() * 22 + 's', animationDelay: -Math.random() * 30 + 's'
      });
      bg.appendChild(s);
    }
  }

  /* ---------- network canvas with moving data packets ---------- */
  const cv = document.createElement('canvas'); cv.id = 'net'; document.body.prepend(cv);
  const ctx = cv.getContext('2d');
  const glow = document.createElement('div'); glow.id = 'glow'; document.body.prepend(glow);
  let W, H, nodes = [], packets = [];
  const mouse = { x: -999, y: -999 }, g = { x: innerWidth / 2, y: innerHeight / 3 };
  const LINK = 145;

  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(95, Math.floor(W * H / 16000));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: 1 + Math.random() * 1.8
    }));
    packets = [];
  }
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 200); });
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 130 && d > 0) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(0,184,255,${(1 - d / LINK) * .3})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(0,245,160,.75)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
    }
    /* packets travelling along links */
    if (!reduce && packets.length < 18 && Math.random() < .08 && nodes.length) {
      const a = nodes[Math.random() * nodes.length | 0];
      const near = nodes.filter(b => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < LINK);
      if (near.length) packets.push({ a, b: near[Math.random() * near.length | 0], t: 0, s: .01 + Math.random() * .014, c: Math.random() < .5 ? '0,245,160' : '138,92,255' });
    }
    packets = packets.filter(p => p.t < 1);
    for (const p of packets) {
      p.t += p.s;
      const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.fillStyle = `rgba(${p.c},.18)`; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
      ctx.fillStyle = `rgba(${p.c},1)`; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.283); ctx.fill();
    }
    /* soft glow that follows the cursor */
    if (mouse.x > -900) { g.x += (mouse.x - g.x) * .1; g.y += (mouse.y - g.y) * .1; }
    glow.style.transform = `translate(${g.x}px,${g.y}px)`;
    if (!reduce) requestAnimationFrame(frame);
  }
  size(); frame();

  /* ---------- reveal on scroll (staggered) ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target; t.classList.add('show'); io.unobserve(t);
    setTimeout(() => t.style.transitionDelay = '', 1600);
  }), { threshold: .05, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(t => {
    const sibs = [...t.parentElement.children].filter(c => c.classList.contains('reveal'));
    t.style.transitionDelay = Math.min(sibs.indexOf(t), 8) * 90 + 'ms';
    io.observe(t);
  });

  /* ---------- animated counters ---------- */
  $$('.stat').forEach(s => {
    const sp = $('span', s), b = $('b', s);
    if (sp && b && /^\s*%/.test(sp.textContent)) { b.dataset.suf = '%'; sp.textContent = sp.textContent.replace(/^\s*%\s*/, ''); }
  });
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const b = e.target, end = +b.dataset.count, suf = b.dataset.suf || '';
    let n = 0; const step = Math.max(1, Math.ceil(end / 55));
    const t = setInterval(() => { n = Math.min(end, n + step); b.textContent = n + suf; if (n === end) clearInterval(t); }, 28);
    cio.unobserve(b);
  }), { threshold: .6 });
  $$('[data-count]').forEach(b => cio.observe(b));

  /* ---------- 3D tilt + spotlight on cards ---------- */
  if (!touch && !reduce) {
    $$('.card,.stat,.cert,.cv-card,.contact').forEach(c => {
      c.classList.add('tilt');
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
        c.style.transform = `perspective(800px) rotateX(${(.5 - y) * 10}deg) rotateY(${(x - .5) * 12}deg) translateY(-6px)`;
      });
      c.addEventListener('pointerleave', () => c.style.transform = '');
    });
    /* magnetic buttons */
    $$('.btn,.f,#menu li:last-child a').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * .22) + 'px ' + ((e.clientY - r.top - r.height / 2) * .3) + 'px';
      });
      b.addEventListener('pointerleave', () => b.style.translate = '');
    });
  }

  /* ---------- click ripple on buttons ---------- */
  $$('.btn,.f,.cv-card').forEach(b => b.addEventListener('pointerdown', e => {
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * .6;
    const s = document.createElement('span'); s.className = 'ripple';
    Object.assign(s.style, { width: d + 'px', height: d + 'px', left: e.clientX - r.left - d / 2 + 'px', top: e.clientY - r.top - d / 2 + 'px' });
    b.appendChild(s); setTimeout(() => s.remove(), 800);
  }));

  /* ---------- certificate filters ---------- */
  const fb = $$('.f'), certs = $$('.cert');
  fb.forEach(b => b.addEventListener('click', () => {
    fb.forEach(x => x.classList.remove('active')); b.classList.add('active');
    let i = 0;
    certs.forEach(c => {
      const ok = b.dataset.f === 'all' || c.dataset.c === b.dataset.f;
      c.classList.toggle('hide', !ok);
      c.classList.remove('pop');
      if (ok) { c.classList.add('show'); c.style.animationDelay = (i++ * 60) + 'ms'; void c.offsetWidth; c.classList.add('pop'); }
    });
  }));
})();