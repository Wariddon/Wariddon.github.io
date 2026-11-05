const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
window.matchMedia('(min-width: 1001px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('[data-category]')];
const companySelect = document.querySelector('#company-filter');
const featuredViews = [...document.querySelectorAll('[data-preview-company]')];
let activeCategory = 'all';
const companyValues = [...companySelect.options].map(option => option.value);
let activeCompany = new URL(location.href).searchParams.get('company');
if (!companyValues.includes(activeCompany)) activeCompany = 'all';
function filterWork(updateAddress = false) {
  companySelect.value = activeCompany;
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeCategory)));
  let visibleCases = 0, visibleHighlights = 0;
  projects.forEach(project => {
    const show = (activeCategory === 'all' || project.dataset.category === activeCategory) && (activeCompany === 'all' || project.dataset.company === activeCompany);
    project.hidden = !show;
    if (show) visibleCases++;
  });
  featuredViews.forEach(view => {
    const show = activeCompany === 'all' || view.dataset.previewCompany === activeCompany;
    view.hidden = !show;
    if (show) visibleHighlights++;
  });
  const label = activeCompany === 'all' ? 'across 5 companies' : `for ${companySelect.selectedOptions[0].textContent}`;
  document.querySelector('#company-status').textContent = `${visibleHighlights} ${visibleHighlights === 1 ? 'highlight' : 'highlights'} ${label}.`;
  document.querySelector('#filter-status').textContent = `${visibleCases} case ${visibleCases === 1 ? 'study' : 'studies'} shown.`;
  document.querySelector('#case-empty').hidden = visibleCases !== 0;
  if (updateAddress) {
    const url = new URL(location.href);
    if (activeCompany === 'all') url.searchParams.delete('company'); else url.searchParams.set('company', activeCompany);
    history.replaceState(null, '', url);
  }
}
filters.forEach(button => button.addEventListener('click', () => { activeCategory = button.dataset.filter; filterWork(); }));
companySelect.addEventListener('change', () => { activeCompany = companySelect.value; filterWork(true); });
window.addEventListener('popstate', () => {
  const company = new URL(location.href).searchParams.get('company');
  activeCompany = companyValues.includes(company) ? company : 'all'; filterWork();
});
filterWork();
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
  all: { projects: [0,1,2,3,4,5,6,7,8], skills: [0,1,2,3], note: 'The complete engineering portfolio.' },
  backend: { projects: [0,1,2,4,7,8,6,3,5], skills: [0,2,3,1], note: 'Backend focus: Java, cloud integration and data integrity come first.' },
  fullstack: { projects: [2,3,5,6,4,8,0,1,7], skills: [1,0,2,3], note: 'Full-stack focus: staff applications and connected services come first.' }
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
  if (target.hidden) {
    activeCategory = 'all';
    if (activeCompany !== 'all' && activeCompany !== target.dataset.company) activeCompany = target.dataset.company;
    filterWork(true);
  }
  target.querySelector('details').open = true;
}));
