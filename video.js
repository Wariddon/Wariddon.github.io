(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const video = $('#experience-video');
  if (!video) return;
  const cutButtons = [...document.querySelectorAll('[data-cut]')];
  const status = $('#playback-status');
  const screen = $('.film-screen');
  const loading = $('.loading-note');
  const error = $('#media-error');
  const captions = $('#captions');
  const fullChapters = window.experienceVideoChapters;
  const shortSegments = window.experienceVideoShortSegments;
  const params = new URLSearchParams(location.search);
  const language = 'en';
  let cut = params.get('cut') === 'short' ? 'short' : 'full';
  let pending = null;
  let formats = [];
  let formatIndex = 0;
  let chapterButtons = [];
  let currentChapter = null;
  let transcriptButtons = [];
  let transcriptCues = [];
  let activeSentence = -1;
  const track = video.addTextTrack('captions', 'English', 'en');
  const clock = time => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;
  const cueData = () => cut === 'short' ? window.experienceVideoHighlights : window.experienceVideoContent;
  const chapters = () => {
    const list = cut === 'short' ? shortSegments.map(segment => ({ ...fullChapters.find(c => c.key === segment.key), ...segment })) : fullChapters;
    return list;
  };
  const prefix = () => cut === 'short' ? 'highlight' : 'experience';
  const mediaVersion = () => '?v=rights-20261126';
  const timeFromAddress = () => {
    const value = Number(params.get('t'));
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  };
  if (params.get('embed') === '1') document.body.classList.add('embedded-video');

  function updateAddress(time) {
    params.set('lang', language); params.set('cut', cut);
    if (time !== undefined) params.set('t', String(Math.round(time * 1000) / 1000));
    if (location.protocol !== 'file:') history.replaceState(null, '', `${location.pathname}?${params}${location.hash}`);
  }
  function updateCaptions() {
    track.mode = captions.value === 'off' ? 'disabled' : 'showing';
    $('#subtitle-file').href = 'assets/video/'+prefix()+'-en.srt'+mediaVersion();
  }
  function rebuildCaptions() {
    track.mode = 'hidden';
    while (track.cues.length) track.removeCue(track.cues[0]);
    for (const cue of cueData().en) track.addCue(new VTTCue(cue.start, cue.end, cue.text));
    updateCaptions();
  }
  function busy(value) {
    screen.setAttribute('aria-busy', String(value)); loading.hidden = !value;
    cutButtons.forEach(button => { button.disabled = value; });
  }
  function updateStatus() {
    if (pending) return;
    status.textContent = (video.ended ? 'Finished' : video.paused ? 'Press Play to watch' : 'Playing');
  }
  function shareChapter(chapter) {
    const address = new URL('video.html', location.protocol === 'file:' ? 'https://wariddon.github.io/' : location.href);
    address.searchParams.set('cut', cut); address.searchParams.set('lang', language); address.searchParams.set('t', String(chapter.start));
    address.searchParams.set('v', '20261126-motion');
    $('#chapter-url').value = address.href; $('#share-chapter-title').textContent = chapter.title;
  }
  function showRelated(chapter) {
    $('#related-company').textContent = chapter.company;
    $('#related-title').textContent = chapter.heading;
    $('#related-description').textContent = chapter.description;
    const links = chapter.links.map(([href, label], index) => {
      const link = document.createElement('a'); link.href = href;
      const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
      link.append(document.createTextNode(chapter.linkLabels?.[index] || label), arrow); return link;
    });
    $('#related-links').replaceChildren(...links);
  }
  function updateChapter() {
    const list = chapters(); let active = list[0];
    for (const chapter of list) if (chapter.start <= video.currentTime + 0.05) active = chapter;
    for (const button of chapterButtons) {
      if (button.dataset.chapter === active.key) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current');
    }
    if (currentChapter !== active.key) { currentChapter = active.key; showRelated(active); shareChapter(active); }
  }
  function seek(time, play = true) {
    updateAddress(time);
    if (pending) { pending.time = time; pending.play = play; return; }
    video.currentTime = Math.min(time, Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.05) : time);
    if (play) video.play().catch(() => { status.textContent = `Ready at ${clock(time)} · Press Play to continue`; });
    updateChapter(); updateTranscript();
  }
  function buildChapters() {
    chapterButtons = chapters().map(chapter => {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.chapter = chapter.key; button.dataset.seek = String(chapter.start);
      const time = document.createElement('span'); time.className = 'chapter-time'; time.textContent = clock(chapter.start).padStart(5, '0');
      const label = document.createElement('span'); label.textContent = chapter.title;
      button.append(time, label); button.addEventListener('click', () => seek(chapter.start)); return button;
    });
    $('.chapter-grid').replaceChildren(...chapterButtons.map(button => { const item = document.createElement('li'); item.append(button); return item; }));
    $('#chapter-count').textContent = chapterButtons.length + ' chapters'; currentChapter = null;
  }
  function buildTranscript() {
    const lang = 'en';
    transcriptCues = cueData()[lang];
    transcriptButtons = transcriptCues.map(cue => {
      const button = document.createElement('button'); button.type = 'button';
      const time = document.createElement('span'); time.className = 'transcript-time'; time.textContent = clock(cue.start).padStart(5, '0');
      const text = document.createElement('span'); text.textContent = cue.text;
      button.append(time, text); button.addEventListener('click', () => seek(cue.start)); return button;
    });
    $('#transcript-list').lang = lang; $('#transcript-list').replaceChildren(...transcriptButtons); activeSentence = -1; updateTranscript();
  }
  function updateTranscript() {
    const index = transcriptCues.findIndex(cue => video.currentTime >= cue.start && video.currentTime < cue.end);
    if (index === activeSentence) return;
    activeSentence = index;
    transcriptButtons.forEach((button, i) => { if (i === index) button.setAttribute('aria-current', 'time'); else button.removeAttribute('aria-current'); });
    if (index >= 0 && $('#follow-transcript').checked && $('#read-along').open && !video.paused) {
      const list = $('#transcript-list'); list.scrollTo({ top: transcriptButtons[index].offsetTop - 25, behavior: 'auto' });
    }
  }
  function mappedTime(target) {
    const time = video.currentTime || 0;
    if (target === 'full') {
      let segment = shortSegments[0]; for (const item of shortSegments) if (item.start <= time) segment = item;
      return segment.source + Math.min(segment.duration, time - segment.start);
    }
    const exact = shortSegments.find(segment => time >= segment.source && time < segment.source + segment.duration);
    if (exact) return exact.start + time - exact.source;
    let chapter = fullChapters[0]; for (const item of fullChapters) if (item.start <= time) chapter = item;
    return (shortSegments.find(segment => segment.key === (chapter.key === 'backend' ? 'scb' : chapter.key)) || shortSegments[0]).start;
  }
  function startSource() { video.poster = 'assets/video/'+('poster.jpg')+mediaVersion(); video.src = `assets/video/${prefix()}-${language}.${formats[formatIndex]}${mediaVersion()}`; video.load(); }
  function selectMedia(edition, initial = false) {
    if (pending || (!initial && edition === cut)) return;
    const changedCut = cut !== edition;
    pending = { time: initial ? timeFromAddress() : changedCut ? mappedTime(edition) : (video.currentTime || 0), play: !initial && !video.paused && !video.ended };
    video.pause(); cut = edition; error.hidden = true; busy(true);
    status.textContent = 'Preparing English narration…'; loading.textContent = status.textContent;
    cutButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cut === edition)));
    $('#download-video').href = $('#fallback-link').href = `assets/video/${prefix()}-${language}.mp4${mediaVersion()}`;
    $('#transcript-link').href = `assets/video/${cut === 'short' ? 'highlight-' : ''}transcript-${language}.txt${mediaVersion()}`;
    $('#film-duration').textContent = cut === 'short' ? '00:45' : '02:21';
    $('#film-scope').textContent = cut === 'short' ? 'Current roles' : '5 companies';
    $('#quality-duration').textContent = cut === 'short' ? '45 sec' : '2 min 21 sec';
    if (initial || changedCut) rebuildCaptions();
    buildChapters();
    buildTranscript(); updateCaptions(); updateAddress(pending.time);
    formats = video.canPlayType('video/webm; codecs="vp9,opus"') ? ['webm', 'mp4'] : ['mp4', 'webm']; formatIndex = 0; startSource();
  }
  video.addEventListener('loadedmetadata', () => {
    if (!pending) return;
    const restore = pending; const maxTime = Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.05) : restore.time;
    if (restore.time > 0) video.currentTime = Math.min(restore.time, maxTime);
    pending = null; busy(false); updateCaptions(); updateChapter(); updateTranscript(); updateStatus();
    shareChapter(chapters().find(c => c.key === currentChapter) || chapters()[0]);
    if (restore.play) video.play().catch(() => { status.textContent = `English narration ready · Press Play to continue at ${clock(video.currentTime)}`; });
  });
  video.addEventListener('error', () => {
    if (formatIndex + 1 < formats.length) { pending ||= { time: video.currentTime || 0, play: !video.paused }; busy(true); formatIndex += 1; startSource(); return; }
    pending = null; busy(false); error.hidden = false; status.textContent = 'Video unavailable · Use the direct video link below.';
  });
  cutButtons.forEach(button => button.addEventListener('click', () => selectMedia(button.dataset.cut)));
  captions.addEventListener('change', updateCaptions);
  for (const event of ['play', 'pause', 'ended']) video.addEventListener(event, updateStatus);
  video.addEventListener('timeupdate', () => { updateChapter(); updateTranscript(); });
  $('#copy-chapter').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#chapter-url').value); $('#share-status').textContent = 'Chapter link copied.'; }
    catch { $('#chapter-url').focus(); $('#chapter-url').select(); $('#share-status').textContent = 'Select Copy or press Ctrl+C to copy the link.'; }
  });
  window.addEventListener('message', event => {
    if (event.source === window.parent && event.origin === location.origin && event.data?.type === 'portfolio:pause') { if (pending) pending.play = false; video.pause(); }
  });
  selectMedia(cut, true);
})();
