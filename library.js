const query = document.querySelector('#query');
const entries = [...document.querySelectorAll('.entry')];
const filters = [...document.querySelectorAll('[data-filter]')];
const reset = document.querySelector('#reset');
const params = new URLSearchParams(location.search);
let shelf = filters.some(b => b.dataset.filter === params.get('shelf')) ? params.get('shelf') : '-1';
query.value = params.get('q') || '';
const normalize = value => value.normalize('NFC').toLowerCase().trim();
const index = entries.map(entry => normalize([entry.textContent, entry.dataset.terms].join(' ')));
const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('th',{granularity:'word'}) : null;
const stop = new Set(['ทำไม','อย่างไร','ทำยังไง','ยังไง','อะไร','คือ','ทำ','การ','ใน','ที่','แล้ว','ต้อง','ได้','อยาก','ให้','เมื่อ','ถึง','จึง','ควร','มี','ไหม','ทำอย่างไร','แก้','จะ','กับ','ของ','ผม','ครับ','มาก']);
function words(text) {
  const tokens = segmenter ? [...segmenter.segment(text)].filter(s => s.isWordLike).map(s => s.segment) : text.split(/\s+/);
  return tokens.filter(token => !stop.has(token));
}
function update(save = true) {
  const phrase = normalize(query.value);
  const tokens = words(phrase);
  let total = 0;
  entries.forEach((entry,i) => {
    const match = index[i].includes(phrase) || (tokens.length > 0 && tokens.every(t => index[i].includes(t)));
    entry.hidden = !(match && (shelf === '-1' || entry.dataset.shelf === shelf));
    if (!entry.hidden) total++;
  });
  filters.forEach(b => b.setAttribute('aria-pressed',String(b.dataset.filter === shelf)));
  const selected = filters.find(b => b.dataset.filter === shelf);
  document.querySelector('#result-title').textContent = shelf !== '-1' ? selected.firstElementChild.textContent : phrase ? 'ผลการค้นหา' : 'ทุกหัวข้อ';
  document.querySelector('#count').textContent = total+' หัวข้อ';
  document.querySelector('#empty').hidden = total !== 0;
  reset.hidden = !phrase && shelf === '-1';
  if(save){const url=new URL(location.href);url.hash='';for(const [key,value] of [['q',query.value.trim()],['shelf',shelf==='-1'?'':shelf]]){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key)}history.replaceState(null,'',url)}
}
const shelves = document.querySelector('.shelves details');
const small = matchMedia('(max-width:760px)');
shelves.open = !small.matches;
small.addEventListener('change',()=>{shelves.open=!small.matches});
filters.forEach(b=>b.addEventListener('click',()=>{shelf=b.dataset.filter;update();if(small.matches){shelves.open=false;shelves.querySelector('summary').focus()}}));
query.addEventListener('input',()=>update());
query.form.addEventListener('submit',event=>{event.preventDefault();update();document.querySelector('#catalog').scrollIntoView()});
reset.addEventListener('click',()=>{query.value='';shelf='-1';update();query.focus()});
function openLink(){const entry=document.getElementById(location.hash.slice(1));if(!entry?.matches('.entry'))return;if(entry.hidden){query.value='';shelf='-1';update(false)}entry.open=true;entry.scrollIntoView()}
update(false);openLink();window.addEventListener('hashchange',openLink);

const readerShortcuts = document.querySelector('.reader-rail details');
const narrowDesk = matchMedia('(max-width:1100px)');
readerShortcuts.open = !narrowDesk.matches;
narrowDesk.addEventListener('change', () => { readerShortcuts.open = !narrowDesk.matches; });
