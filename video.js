(() => {
  'use strict';
  const video = document.querySelector('#experience-video');
  if (!video) return;
  const buttons = [...document.querySelectorAll('[data-language]')];
  const chapters = [...document.querySelectorAll('[data-seek]')];
  const status = document.querySelector('#playback-status');
  const screen = document.querySelector('.film-screen');
  const loading = document.querySelector('.loading-note');
  const error = document.querySelector('#media-error');
  const captions = document.querySelector('#captions');
  const download = document.querySelector('#download-video');
  const transcript = document.querySelector('#transcript-link');
  const fallback = document.querySelector('#fallback-link');
  const content = window.experienceVideoContent || { en: [], th: [] };
  const tracks = {};
  for (const lang of ['en', 'th']) {
    const track = video.addTextTrack('captions', lang === 'en' ? 'English' : 'ไทย', lang);
    for (const cue of content[lang]) track.addCue(new VTTCue(cue.start, cue.end, cue.text));
    track.mode = 'disabled';
    tracks[lang] = track;
  }
  const params = new URLSearchParams(location.search);
  let language = params.get('lang') === 'th' ? 'th' : 'en';
  let pending = null;
  let formats = [];
  let formatIndex = 0;
  const names = { en: 'English', th: 'ไทย' };
  const clock = time => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;
  function updateCaptions() {
    const chosen = captions.value === 'auto' ? language : captions.value;
    for (const lang of ['en', 'th']) tracks[lang].mode = chosen === lang ? 'showing' : 'disabled';
  }
  function busy(value) {
    screen.setAttribute('aria-busy', String(value));
    loading.hidden = !value;
    buttons.forEach(button => { button.disabled = value; });
  }
  function updateStatus() {
    if (pending) return;
    const action = video.ended ? 'Finished' : video.paused ? 'Press Play to watch' : 'Playing';
    status.textContent = `${names[language]} narration · ${action}`;
  }
  function updateChapter() {
    let active = chapters[0];
    for (const button of chapters) if (Number(button.dataset.seek) <= video.currentTime + 0.05) active = button;
    for (const button of chapters) {
      if (button === active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    }
  }
  function startSource() {
    video.src = `assets/video/experience-${language}.${formats[formatIndex]}`;
    video.load();
  }
  function selectLanguage(lang, initial = false) {
    if (pending || (!initial && lang === language)) return;
    pending = { time: Number.isFinite(video.currentTime) ? video.currentTime : 0, play: !video.paused && !video.ended };
    video.pause();
    language = lang;
    error.hidden = true;
    busy(true);
    status.textContent = lang === 'th' ? 'กำลังเตรียมเสียงภาษาไทย…' : 'Preparing English narration…';
    loading.textContent = status.textContent;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === lang)));
    download.href = fallback.href = `assets/video/experience-${lang}.mp4`;
    transcript.href = `assets/video/transcript-${lang}.txt`;
    updateCaptions();
    params.set('lang', lang);
    if (location.protocol !== 'file:') history.replaceState(null, '', `${location.pathname}?${params}${location.hash}`);
    const webm = video.canPlayType('video/webm; codecs="vp9,opus"');
    formats = webm ? ['webm', 'mp4'] : ['mp4', 'webm'];
    formatIndex = 0;
    startSource();
  }
  video.addEventListener('loadedmetadata', () => {
    if (!pending) return;
    const restore = pending;
    const maxTime = Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.05) : restore.time;
    if (restore.time > 0) video.currentTime = Math.min(restore.time, maxTime);
    pending = null;
    busy(false);
    updateCaptions();
    updateChapter();
    updateStatus();
    if (restore.play) video.play().catch(() => { status.textContent = `${names[language]} narration ready · Press Play to continue at ${clock(video.currentTime)}`; });
  });
  video.addEventListener('error', () => {
    if (formatIndex + 1 < formats.length) {
      pending ||= { time: video.currentTime || 0, play: !video.paused };
      busy(true);
      formatIndex += 1;
      startSource();
      return;
    }
    pending = null;
    busy(false);
    error.hidden = false;
    status.textContent = 'Video unavailable · Use the direct video link below.';
  });
  buttons.forEach(button => button.addEventListener('click', () => selectLanguage(button.dataset.language)));
  captions.addEventListener('change', updateCaptions);
  for (const event of ['play', 'pause', 'ended']) video.addEventListener(event, updateStatus);
  video.addEventListener('timeupdate', updateChapter);
  chapters.forEach(button => button.addEventListener('click', () => {
    const time = Number(button.dataset.seek);
    if (pending) { pending.time = time; pending.play = true; return; }
    video.currentTime = time;
    video.play().catch(() => { status.textContent = `Chapter ready at ${clock(time)} · Press Play to continue`; });
    updateChapter();
  }));
  selectLanguage(language, true);
})();
