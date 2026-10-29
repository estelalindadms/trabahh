(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const accessDialog = document.getElementById('access-dialog');
  const accessOpen = document.getElementById('access-open');
  const status = document.getElementById('access-status');
  const storageKey = 'recife-access-v1';
  const defaults = {size:1,contrast:false,texture:false,motion:window.matchMedia('(prefers-reduced-motion: reduce)').matches,colors:false,font:false};
  let prefs = {...defaults};
  try { const saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); if (saved && typeof saved === 'object') prefs = {...defaults,...saved}; } catch {}
  if (![1,1.15,1.3].includes(Number(prefs.size))) prefs.size = 1;

  const alive = document.querySelectorAll('.movement')[3];
  let aliveRevealed = false;
  let aliveButton = null;
  let aliveStatus = null;
  if (alive) {
    alive.id = 'recife-vivo';
    alive.tabIndex = -1;
    alive.classList.add('movement-alive');
    const bridge = document.createElement('div');
    bridge.className = 'alive-bridge';
    bridge.innerHTML = '<img class="alive-bridge-art" src="assets/linha-matriz.svg" alt="" aria-hidden="true"><div class="alive-bridge-content"><div><p class="eyebrow">DA FERIDA AO PULSO</p><h2>A mesma cidade.<br><em>Outro pulso.</em></h2></div><div class="alive-bridge-copy"><p>A rua pintada, o corpo que dança, o ritmo que reúne. A arte cria presença; o cuidado sustenta a vida.</p><button id="alive-reveal" class="alive-button" type="button" aria-pressed="false" aria-controls="recife-vivo"><span>Devolver a cor</span><span aria-hidden="true">↗</span></button><p id="alive-status" class="alive-status" role="status" aria-live="polite">O Recife vivo aparece em gestos, encontros e criação.</p></div></div>';
    alive.prepend(bridge);
    aliveButton = document.getElementById('alive-reveal');
    aliveStatus = document.getElementById('alive-status');
    aliveButton.addEventListener('click', () => {
      aliveRevealed = !aliveRevealed;
      renderAlive(true);
    });
  }
  function renderAlive(announce) {
    if (!alive || !aliveButton) return;
    alive.classList.toggle('alive-revealed', aliveRevealed || !!prefs.colors);
    aliveButton.disabled = !!prefs.colors;
    aliveButton.setAttribute('aria-pressed', String(aliveRevealed || !!prefs.colors));
    aliveButton.querySelector('span').textContent = prefs.colors ? 'Cores originais ativadas' : aliveRevealed ? 'Rever em preto e branco' : 'Devolver a cor';
    if (announce) aliveStatus.textContent = aliveRevealed || prefs.colors ? 'A cor retorna às quatro fotografias de arte e convivência deste movimento.' : 'O movimento voltou ao tratamento monocromático.';
  }
  function applyPreferences(announce = false) {
    root.style.setProperty('--reading-scale', String(prefs.size));
    const classes = {contrast:'high-contrast',texture:'clean-view',motion:'reduce-motion',colors:'show-original-colors',font:'simple-type'};
    Object.entries(classes).forEach(([key,name]) => {
      body.classList.toggle(name, !!prefs[key]);
      const field = document.getElementById('access-' + key);
      if (field) field.checked = !!prefs[key];
    });
    root.style.scrollBehavior = prefs.motion ? 'auto' : '';
    document.querySelectorAll('[data-text-size]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.textSize) === Number(prefs.size))));
    try { localStorage.setItem(storageKey, JSON.stringify(prefs)); } catch {}
    renderAlive(false);
    if (announce) status.textContent = 'Preferências aplicadas.';
  }
  applyPreferences();
  accessOpen.addEventListener('click', () => {
    accessDialog.showModal();
    body.classList.add('dialog-open');
    document.getElementById('access-close').focus();
  });
  document.getElementById('access-close').addEventListener('click', () => accessDialog.close());
  accessDialog.addEventListener('close', () => {
    body.classList.remove('dialog-open');
    accessOpen.focus({preventScroll:true});
  });
  accessDialog.addEventListener('click', event => { if (event.target === accessDialog) accessDialog.close(); });
  document.querySelectorAll('[data-text-size]').forEach(button => button.addEventListener('click', () => { prefs.size = Number(button.dataset.textSize); applyPreferences(true); }));
  ['contrast','texture','motion','colors','font'].forEach(key => document.getElementById('access-' + key).addEventListener('change', event => { prefs[key] = event.target.checked; applyPreferences(true); }));
  document.getElementById('access-reset').addEventListener('click', () => { prefs = {...defaults}; applyPreferences(); status.textContent = 'Preferências restauradas.'; });

  let photoTrigger = null;
  const photoDialog = document.getElementById('photo-dialog');
  document.querySelectorAll('.photo-open').forEach((button,index) => {
    const description = button.closest('.photo-card').querySelector('.photo-caption p');
    if (description) {
      description.id = 'photo-caption-' + index;
      button.setAttribute('aria-describedby', description.id);
    }
    button.addEventListener('click', () => {
      photoTrigger = button;
      body.classList.add('dialog-open');
      document.getElementById('photo-close').focus();
      decorateExternalLinks(photoDialog);
    });
  });
  photoDialog.addEventListener('close', () => {
    body.classList.remove('dialog-open');
    if (photoTrigger) photoTrigger.focus({preventScroll:true});
  });
  function decorateExternalLinks(container) {
    container.querySelectorAll('a[target="_blank"]').forEach(link => {
      if (link.querySelector('.newtab-label')) return;
      link.setAttribute('title', link.textContent.trim() + ' — abre em nova aba');
      const note = document.createElement('span');
      note.className = 'sr-only newtab-label';
      note.textContent = ' (abre em nova aba)';
      link.append(note);
    });
  }
  decorateExternalLinks(document);
  ['photo-prev','photo-next'].forEach(id => document.getElementById(id).addEventListener('click', () => decorateExternalLinks(photoDialog)));
  photoDialog.addEventListener('keydown', () => decorateExternalLinks(photoDialog));
  ['ensaio','curta'].forEach(id => { document.getElementById(id).tabIndex = -1; });

  const film = window.RECIFE_DATA?.shortFilm;
  const video = document.getElementById('short-film');
  if (film?.src) {
    video.src = film.src;
    video.poster = film.poster || 'assets/curta-poster.svg';
    video.hidden = false;
    document.getElementById('film-placeholder').hidden = true;
    if (film.captionsSrc) {
      const track = document.createElement('track');
      track.kind = 'captions'; track.label = 'Português'; track.srclang = 'pt-BR'; track.src = film.captionsSrc; track.default = true;
      video.append(track);
    }
    const target = document.getElementById('film-transcript');
    if (film.transcript) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'Ler a transcrição do curta';
      const text = document.createElement('p');
      text.textContent = film.transcript;
      details.append(summary,text); target.append(details); target.hidden = false;
    }
    if (film.audioDescriptionSrc) {
      const link = document.createElement('a');
      link.href = film.audioDescriptionSrc;
      link.className = 'download-link';
      link.textContent = 'Assistir à versão com audiodescrição';
      target.append(link); target.hidden = false;
    }
    const available = [];
    if (film.captionsSrc) available.push('legendas em português');
    if (film.transcript) available.push('transcrição');
    if (film.audioDescriptionSrc) available.push('versão com audiodescrição');
    document.querySelector('.film-access-note').textContent = available.length ? 'Recursos disponíveis: ' + available.join(', ') + '.' : 'Curta disponível. Os recursos de acesso serão indicados quando seus arquivos forem adicionados.';
    document.querySelector('.production-label').textContent = 'CURTA DA EQUIPE';
    video.addEventListener('play', () => {
      document.getElementById('background-music').pause();
      if (!document.getElementById('reading-stop').hidden) document.getElementById('reading-stop').click();
    });
  }
})();
