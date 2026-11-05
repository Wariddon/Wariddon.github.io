const titles = ['Wariddon Rattanamalee, Software Engineer','Engineering profile','Professional experience','SCB banking services','Azure Managed Redis modernization','AML report delivery','Customer data correctness','InblackM platforms and automation','Order handover and payment state','Shared staff identity across applications','Read-only admin AI assistant','AI-assisted engineering in both roles','TISCO Financial Group','CAT Telecom','Thai Insurance','Education and professional development','Contact and discussion'];
const image = document.querySelector('#slide-image');
const position = document.querySelector('#slide-position');
const previous = document.querySelector('#previous-slide');
const next = document.querySelector('#next-slide');
const overview = document.querySelector('#slide-overview');
const grid = document.querySelector('#thumbnail-grid');
const shell = document.querySelector('#presentation-shell');
const fullscreen = document.querySelector('#fullscreen-button');
const exitPresentation = document.querySelector('#exit-presentation');
const error = document.querySelector('#slide-error');
const source = index => `assets/slides/slide-${String(index+1).padStart(2,'0')}.png`;
let current = 0;
const buttons = titles.map((title,index) => {
  const button = document.createElement('button');
  button.type = 'button'; button.setAttribute('aria-label',`Slide ${index+1}: ${title}`);
  const preview = document.createElement('img'); preview.src = source(index); preview.alt = ''; preview.loading = 'lazy'; preview.width = 1280; preview.height = 720;
  const caption = document.createElement('span'); const number = document.createElement('strong'); number.textContent = String(index+1).padStart(2,'0'); caption.append(number,document.createTextNode(title));
  button.append(preview,caption); button.addEventListener('click',()=>{ show(index); overview.close(); }); grid.append(button); return button;
});
function show(index,updateAddress=true) {
  current = Math.max(0,Math.min(titles.length-1,Number.isFinite(index)?Math.trunc(index):0));
  error.hidden = true; image.src = source(current); image.alt = `Slide ${current+1}: ${titles[current]}`;
  position.replaceChildren(document.createTextNode(`${current+1} / ${titles.length}`)); const label = document.createElement('span'); label.textContent = titles[current]; position.append(label);
  previous.disabled = current === 0; next.disabled = current === titles.length-1;
  buttons.forEach((button,i)=>{ if(i===current)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current'); });
  if(updateAddress) history.replaceState(null,'',`#slide=${current+1}`);
  document.title = `${current+1}/${titles.length} ${titles[current]} | Wariddon Rattanamalee`;
  [current-1,current+1].filter(i=>i>=0&&i<titles.length).forEach(i=>{ const preload = new Image(); preload.src = source(i); });
}
function fromAddress() { const raw=new URLSearchParams(location.hash.slice(1)).get('slide'); show(raw?Number(raw)-1:0,false); }
previous.addEventListener('click',()=>show(current-1)); next.addEventListener('click',()=>show(current+1));
document.querySelector('#overview-button').addEventListener('click',()=>{ overview.showModal(); buttons[current].focus(); });
document.querySelector('#close-overview').addEventListener('click',()=>overview.close());
overview.addEventListener('click',event=>{ if(event.target===overview){const rect=overview.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)overview.close();} });
function presentationMode(active) { shell.classList.toggle('presenting',active); exitPresentation.hidden=!active; fullscreen.setAttribute('aria-pressed',String(active)); fullscreen.textContent=active?'Exit presentation':'Present'; }
async function leavePresentation() { presentationMode(false); if(document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} } }
async function toggleFullscreen() {
  if(shell.classList.contains('presenting')) { await leavePresentation(); return; }
  presentationMode(true);
  // Keep presentation mode available when a browser declines native full screen.
  if(document.fullscreenEnabled && shell.requestFullscreen) { try { await shell.requestFullscreen(); } catch {} }
}
fullscreen.addEventListener('click',toggleFullscreen);
exitPresentation.addEventListener('click',leavePresentation);
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)presentationMode(false);});
document.addEventListener('keydown',event=>{
  if(overview.open||event.altKey||event.ctrlKey||event.metaKey||event.target.closest('input,textarea,select'))return;
  if(['ArrowRight','PageDown'].includes(event.key)||(event.code==='Space'&&!event.target.closest('button,a'))){event.preventDefault();show(current+1);}
  else if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();show(current-1);}
  else if(event.key==='Home'){event.preventDefault();show(0);}
  else if(event.key==='End'){event.preventDefault();show(titles.length-1);}
  else if(event.key.toLowerCase()==='f'&&!event.repeat&&!fullscreen.hidden){event.preventDefault();toggleFullscreen();}
  else if(event.key==='Escape'&&shell.classList.contains('presenting')){event.preventDefault();leavePresentation();}
});
let touch = null;
document.querySelector('#slide-stage').addEventListener('pointerdown',event=>{if(event.pointerType==='touch')touch={x:event.clientX,y:event.clientY,id:event.pointerId};});
window.addEventListener('pointerup',event=>{if(!touch||touch.id!==event.pointerId)return;const dx=event.clientX-touch.x,dy=event.clientY-touch.y;touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)show(current+(dx<0?1:-1));});
window.addEventListener('pointercancel',()=>{touch=null;});
image.addEventListener('error',()=>{error.hidden=false;}); image.addEventListener('load',()=>{error.hidden=true;});
window.addEventListener('hashchange',fromAddress); fromAddress();
