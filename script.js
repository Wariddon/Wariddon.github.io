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

// Reorder existing, factual contributions for the role being discussed.
const roleButtons = [...document.querySelectorAll('[data-role-focus]')];
const projectList = document.querySelector('.projects');
const toolkit = document.querySelector('.toolkit');
const skillGroups = [...toolkit.children];
const roleViews = {
  all: { projects: [0,1,2,3,4,5], skills: [0,1,2,3], note: 'The complete engineering portfolio.' },
  backend: { projects: [0,1,2,4,3,5], skills: [0,2,3,1], note: 'Backend focus: Java, cloud integration and data integrity come first.' },
  fullstack: { projects: [2,3,5,4,0,1], skills: [1,0,2,3], note: 'Full-stack focus: staff applications and connected services come first.' }
};
function applyRole(role, updateAddress = true) {
  const key = Object.hasOwn(roleViews, role) ? role : 'all';
  const view = roleViews[key];
  view.projects.forEach(i => projectList.append(projects[i]));
  view.skills.forEach(i => toolkit.append(skillGroups[i]));
  roleButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.roleFocus === key)));
  document.querySelector('#focus-note').textContent = view.note;
  if (updateAddress) {
    const url = new URL(location.href);
    if (key === 'all') url.searchParams.delete('focus'); else url.searchParams.set('focus', key);
    history.replaceState(null, '', url);
  }
}
roleButtons.forEach(button => button.addEventListener('click', () => applyRole(button.dataset.roleFocus)));
window.addEventListener('popstate', () => applyRole(new URL(location.href).searchParams.get('focus'), false));
applyRole(new URL(location.href).searchParams.get('focus'), false);

document.querySelectorAll('.work-previews a[href^="#case-"]').forEach(link => link.addEventListener('click', () => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  if (target.hidden) filters.find(button => button.dataset.filter === 'all').click();
  target.querySelector('details').open = true;
}));
