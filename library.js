const query = document.querySelector('#query');
const entries = [...document.querySelectorAll('.entry')];
const filters = [...document.querySelectorAll('[data-filter]')];
const reset = document.querySelector('#reset');
let shelf = '-1';
const normalize = value => value.normalize('NFC').toLowerCase().trim();
const index = entries.map(entry => {
  const content = entry.cloneNode(true);
  content.querySelectorAll('.lesson-neighbors, .permalink').forEach(link => link.remove());
  return normalize([content.textContent, entry.dataset.terms].join(' '));
});
const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('th',{granularity:'word'}) : null;
const stop = new Set(['ทำไม','อย่างไร','ทำยังไง','ยังไง','อะไร','คือ','ทำ','การ','ใน','ที่','แล้ว','ต้อง','ได้','อยาก','ให้','เมื่อ','ถึง','จึง','ควร','มี','ไหม','ทำอย่างไร','แก้','จะ','กับ','ของ','ผม','ครับ','มาก']);
function words(text) {
  const tokens = segmenter ? [...segmenter.segment(text)].filter(s => s.isWordLike).map(s => s.segment) : text.split(/\s+/);
  return tokens.filter(token => !stop.has(token));
}
function queryMatcher() {
  const phrase = normalize(query.value);
  const tokens = words(phrase);
  return text => text.includes(phrase) || (tokens.length > 0 && tokens.every(token => text.includes(token)));
}
function saveFilters({ keepLesson = false } = {}) {
  const url = new URL(location.href);
  if (!keepLesson) url.hash = '';
  for (const [key, value] of [['q', query.value.trim()], ['shelf', shelf === '-1' ? '' : shelf]]) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  history.replaceState(null, '', url);
}
function update() {
  const matches = queryMatcher();
  let total = 0;
  entries.forEach((entry,i) => {
    entry.hidden = !(matches(index[i]) && (shelf === '-1' || entry.dataset.shelf === shelf));
    if (!entry.hidden) total++;
  });
  filters.forEach(b => b.setAttribute('aria-pressed',String(b.dataset.filter === shelf)));
  const selected = filters.find(b => b.dataset.filter === shelf);
  const resultTitle = document.querySelector('#result-title');
  resultTitle.lang = 'en';
  resultTitle.textContent = shelf !== '-1' ? selected.firstElementChild.textContent : query.value.trim() ? 'Search results' : 'Lessons';
  document.querySelector('#count').textContent = total + (total === 1 ? ' lesson' : ' lessons');
  document.querySelector('#empty').hidden = total !== 0;
  reset.hidden = !query.value.trim() && shelf === '-1';
}
function applyFilters() {
  update();
  saveFilters();
}
function openAddress() {
  const params = new URLSearchParams(location.search);
  const category = params.get('shelf');
  shelf = filters.some(button => button.dataset.filter === category) ? category : '-1';
  query.value = params.get('q') || '';

  const entry = document.getElementById(location.hash.slice(1));
  if (entry?.matches('.entry')) {
    if (shelf !== '-1' && entry.dataset.shelf !== shelf) shelf = '-1';
    if (!queryMatcher()(index[entries.indexOf(entry)])) query.value = '';
    saveFilters({ keepLesson: true });
    entry.open = true;
    update();
    entry.scrollIntoView();
  } else {
    update();
  }
}
const shelves = document.querySelector('.shelves details');
const small = matchMedia('(max-width:760px)');
shelves.open = !small.matches;
small.addEventListener('change',()=>{shelves.open=!small.matches});
filters.forEach(b=>b.addEventListener('click',()=>{shelf=b.dataset.filter;applyFilters();if(small.matches){shelves.open=false;shelves.querySelector('summary').focus()}}));
query.addEventListener('input', applyFilters);
query.form.addEventListener('submit',event=>{event.preventDefault();applyFilters();document.querySelector('#catalog').scrollIntoView()});
reset.addEventListener('click',()=>{query.value='';shelf='-1';applyFilters();query.focus()});
openAddress();
window.addEventListener('hashchange', openAddress);
window.addEventListener('popstate', openAddress);

const readerShortcuts = document.querySelector('.reader-rail details');
const narrowDesk = matchMedia('(max-width:1100px)');
readerShortcuts.open = !narrowDesk.matches;
narrowDesk.addEventListener('change', () => { readerShortcuts.open = !narrowDesk.matches; });

document.querySelectorAll('.language-answer[data-filename]').forEach(panel => {
  const snippet = panel.querySelector('pre code');
  const file = new Blob([snippet.textContent + '\n'], {type: 'text/plain;charset=utf-8'});
  const download = document.createElement('a');
  download.download = panel.dataset.filename;
  download.href = URL.createObjectURL(file);
  download.textContent = 'ดาวน์โหลด ' + download.download;
  panel.querySelector('figcaption').append(' · ', download);
});
