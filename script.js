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
  all: { projects: [0,1,2,3,4,5,6,7,8], skills: [0,1,2,3], note: 'All projects and skills.' },
  backend: { projects: [0,1,2,4,7,8,6,3,5], skills: [0,2,3,1], note: 'Java services, cloud integrations, and data work appear first.' },
  fullstack: { projects: [2,3,5,6,4,8,0,1,7], skills: [1,0,2,3], note: 'Staff applications and their backend services appear first.' }
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

function openLinkedCase(hash) {
  const project = document.getElementById(hash.slice(1));
  if (!projects.includes(project)) return;
  if (project.hidden) {
    activeCategory = 'all';
    if (activeCompany !== 'all' && activeCompany !== project.dataset.company) activeCompany = project.dataset.company;
    filterWork(true);
  }
  project.querySelector('details').open = true;
  return project;
}

document.querySelectorAll('.work-previews a[href^="#case-"]').forEach(link => {
  link.addEventListener('click', () => openLinkedCase(link.hash));
});
function openCaseFromAddress() {
  openLinkedCase(location.hash)?.scrollIntoView();
}
window.addEventListener('hashchange', openCaseFromAddress);
openCaseFromAddress();
