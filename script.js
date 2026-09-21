// navbar shadow + mobile menu
const nav = document.getElementById('nav');
const menu = document.getElementById('menu');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30));
document.getElementById('burger').onclick = () => menu.classList.toggle('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

// typing effect
const roles = ['IT Systems Engineer', 'Windows Deployment Automation', 'Network & Systems administration', 'Instructeur Cisco NetAcad', 'IT Infrastructure & Cloud'];
const el = document.getElementById('typing');
let r = 0, c = 0, del = false;
(function type() {
  const word = roles[r];
  el.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 40 : 85);
})();

// scroll reveal (with small stagger inside grids)
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach((n, i) => {
  n.style.transitionDelay = (i % 4) * 90 + 'ms';
  io.observe(n);
});

// animated counters
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const b = e.target, end = +b.dataset.count;
    let n = 0;
    const step = Math.max(1, Math.ceil(end / 50));
    const t = setInterval(() => {
      n = Math.min(end, n + step);
      b.textContent = n;
      if (n === end) clearInterval(t);
    }, 30);
    cio.unobserve(b);
  });
}, { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(b => cio.observe(b));

// certificate filters
const btns = document.querySelectorAll('.f');
btns.forEach(b => b.onclick = () => {
  btns.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  document.querySelectorAll('.cert').forEach(c =>
    c.classList.toggle('hide', b.dataset.f !== 'all' && c.dataset.c !== b.dataset.f));
});