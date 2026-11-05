const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('[data-category]')];
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let visible = 0;
  projects.forEach(project => { const show = category === 'all' || project.dataset.category === category; project.hidden = !show; if (show) visible++; });
  document.querySelector('#filter-status').textContent = `${visible} case ${visible === 1 ? 'study' : 'studies'} shown.`;
}));
document.querySelector('#copy-email').addEventListener('click', async () => {
  const output = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('wrd8856@hotmail.com'); output.textContent = 'Email copied'; }
  catch { output.textContent = 'Please copy the email address above.'; }
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
