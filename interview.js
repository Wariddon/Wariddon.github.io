(() => {
  const steps = [
    { key: 'film', name: 'Career film', title: 'Start with a 45-second overview.', href: 'video.html?cut=short' },
    { key: 'slides', name: 'Presentation', title: 'Walk through the engineering experience.', href: 'presentation.html?deck=short' },
    { key: 'work', name: 'Selected work', title: 'Explore the decisions behind the implementation.', href: 'index.html#work' },
    { key: 'resume', name: 'Resume', title: 'Review the experience and continue the conversation.', href: 'resume.html' }
  ];
  const tabs = [...document.querySelectorAll('[data-step]')];
  const shell = document.querySelector('#interview-shell');
  const previous = document.querySelector('#interview-previous');
  const next = document.querySelector('#interview-next');
  const present = document.querySelector('#interview-present');
  let current = 0;
  const loading = document.querySelector('#interview-loading');
  let loadingFrame = null;
  function frameReady(frame) {
    try {
      const expected = frame.id === 'interview-video' ? '#experience-video' : frame.id === 'interview-slides' ? '#slide-image' : '#resume-pages';
      return frame.contentDocument?.readyState === 'complete' && !!frame.contentDocument.querySelector(expected);
    } catch { return false; }
  }
  function showFrameState(frame) {
    loadingFrame = frame;
    loading.hidden = !frame || frameReady(frame);
    if (frame) document.querySelector('#interview-loading-text').textContent = `Preparing ${steps[current].name.toLowerCase()}… If it does not appear, reload this view or open it separately.`;
  }
  document.querySelectorAll('.interview-stage iframe').forEach(frame => frame.addEventListener('load', () => {
    if (frame === loadingFrame) showFrameState(frame);
  }));
  document.querySelector('#reload-material').addEventListener('click', () => {
    if (!loadingFrame) return;
    const frame = loadingFrame;
    frame.src = frame.dataset.src || frame.getAttribute('src');
    loading.hidden = false;
  });
  function show(index, update = true) {
    const position = Math.max(0, Math.min(steps.length - 1, index));
    if (position !== 0) document.querySelector('#interview-video').contentWindow?.postMessage({ type: 'portfolio:pause' }, location.origin);
    current = position;
    steps.forEach((step, i) => {
      const active = i === current;
      tabs[i].setAttribute('aria-selected', String(active)); tabs[i].tabIndex = active ? 0 : -1;
      const panel = document.querySelector(`#panel-${step.key}`); panel.hidden = !active;
      if (active) panel.querySelectorAll('iframe[data-src]').forEach(frame => { if (!frame.getAttribute('src')) frame.src = frame.dataset.src; });
    });
    document.querySelector('#interview-position').textContent = `Step ${current + 1} of 4 · ${steps[current].name}`;
    document.querySelector('#interview-step-title').textContent = steps[current].title;
    document.querySelector('#open-material').href = steps[current].href;
    showFrameState(document.querySelector(`#panel-${steps[current].key} iframe`));
    previous.disabled = current === 0; next.disabled = current === steps.length - 1;
    next.textContent = current < steps.length - 1 ? `Next: ${steps[current + 1].name} →` : 'Finished';
    if (update) history.replaceState(null, '', `${location.pathname}${location.search}#${steps[current].key}`);
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(i));
    tab.addEventListener('keydown', event => {
      let index = i;
      if (event.key === 'ArrowRight') index = (i + 1) % steps.length;
      else if (event.key === 'ArrowLeft') index = (i + steps.length - 1) % steps.length;
      else if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = steps.length - 1;
      else return;
      event.preventDefault(); show(index); tabs[index].focus();
    });
  });
  previous.addEventListener('click', () => show(current - 1)); next.addEventListener('click', () => show(current + 1));
  function setPresenting(value) { shell.classList.toggle('interview-presenting', value); present.setAttribute('aria-pressed', String(value)); present.textContent = value ? 'Exit presentation' : 'Present'; }
  async function leave() { setPresenting(false); if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} } }
  present.addEventListener('click', async () => {
    if (shell.classList.contains('interview-presenting')) { await leave(); return; }
    setPresenting(true);
    if (document.fullscreenEnabled && shell.requestFullscreen) { try { await shell.requestFullscreen(); } catch {} }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') leave(); });
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) setPresenting(false); });
  const fromAddress = () => { const found = steps.findIndex(step => `#${step.key}` === location.hash); show(found < 0 ? 0 : found, false); };
  window.addEventListener('hashchange', fromAddress); fromAddress();
})();
