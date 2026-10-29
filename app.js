(() => {
  'use strict';
  const data = window.RECIFE_DATA;
  if (!data || data.photos.length !== 16) {
    document.getElementById('movements').textContent = 'O ensaio está sendo preparado. Atualize a página em instantes.';
    return;
  }
  const photos = data.photos;
  const movements = data.movements;
  const pad = n => String(n).padStart(2, '0');
  const escape = text => String(text || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateLabel = p => p.date ? String(p.date).slice(0, 4) : 'data não informada';
  document.getElementById('movements').innerHTML = movements.map((movement, groupIndex) => {
    const cards = photos.slice(groupIndex * 4, groupIndex * 4 + 4).map((photo, j) => {
      const index = groupIndex * 4 + j;
      return '<figure class="photo-card"><button class="photo-open" type="button" data-photo="' + index + '" aria-label="Abrir fotografia ' + pad(index + 1) + ': ' + escape(photo.title) + '"><img src="' + escape(photo.src) + '" alt="' + escape(photo.alt) + '" loading="lazy"><span class="expand" aria-hidden="true">↗</span></button><figcaption class="photo-caption"><span>' + pad(index + 1) + '</span><div><h3>' + escape(photo.title) + '</h3><p>' + escape(photo.caption) + '</p><small>' + escape(photo.author) + ' · arquivo, ' + escape(dateLabel(photo)) + '</small></div></figcaption></figure>';
    }).join('');
    return '<section class="movement" aria-labelledby="movement-' + groupIndex + '"><div class="movement-header"><span class="movement-number">' + escape(movement.number) + '</span><h2 id="movement-' + groupIndex + '">' + escape(movement.title) + '</h2><p>' + escape(movement.intro) + '</p></div><div class="photo-grid">' + cards + '</div></section>';
  }).join('');
  document.getElementById('poem').innerHTML = movements.map(movement => '<article class="poem-part"><span>' + escape(movement.number) + ' / ' + escape(movement.title) + '</span><div class="stanza">' + movement.stanza.map(line => '<p>' + escape(line) + '</p>').join('') + '</div></article>').join('');
  document.getElementById('credits-list').innerHTML = photos.map(photo => '<li><strong>' + escape(photo.title) + '</strong> — ' + escape(photo.author) + '. <a href="' + escape(photo.sourceUrl) + '" target="_blank" rel="noopener">Fonte original ↗</a> · <a href="' + escape(photo.licenseUrl) + '" target="_blank" rel="noopener">' + escape(photo.license) + '</a><small>' + escape(photo.location) + ' · ' + escape(dateLabel(photo)) + '. ' + escape(photo.modifications) + '</small></li>').join('');
  const dialog = document.getElementById('photo-dialog');
  let currentPhoto = 0;
  function showPhoto(index) {
    currentPhoto = (index + photos.length) % photos.length;
    const photo = photos[currentPhoto];
    const image = document.getElementById('lightbox-image');
    image.src = photo.src;
    image.alt = photo.alt;
    document.getElementById('photo-counter').textContent = pad(currentPhoto + 1) + ' / 16';
    document.getElementById('lightbox-title').textContent = photo.title;
    document.getElementById('lightbox-description').textContent = photo.alt;
    document.getElementById('lightbox-credit').innerHTML = escape(photo.author) + ' · ' + escape(dateLabel(photo)) + '<br>' + escape(photo.location) + '<br><a href="' + escape(photo.sourceUrl) + '" target="_blank" rel="noopener">Fonte original ↗</a> · <a href="' + escape(photo.licenseUrl) + '" target="_blank" rel="noopener">' + escape(photo.license) + '</a>';
  }
  document.querySelectorAll('.photo-open').forEach(button => button.addEventListener('click', () => { showPhoto(Number(button.dataset.photo)); dialog.showModal(); }));
  document.getElementById('photo-close').addEventListener('click', () => dialog.close());
  document.getElementById('photo-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
  document.getElementById('photo-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentPhoto - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentPhoto + 1); }
  });
  const audio = document.getElementById('background-music');
  const musicToggle = document.getElementById('music-toggle');
  const volume = document.getElementById('volume');
  const stopButton = document.getElementById('reading-stop');
  const toast = document.getElementById('toast');
  const synth = window.speechSynthesis;
  let reading = false;
  let readingPaused = false;
  let utterance = null;
  let timer;
  audio.volume = Number(volume.value) / 100;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('visible'), 6000);
  }
  function musicUI() {
    const playing = !audio.paused;
    document.body.classList.toggle('is-playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
    musicToggle.setAttribute('aria-label', playing ? 'Pausar música de fundo' : 'Tocar música de fundo');
  }
  async function playMusic() {
    try { await audio.play(); } catch { notify('Toque no botão de música para iniciar a trilha.'); }
  }
  musicToggle.addEventListener('click', () => { if (audio.paused) playMusic(); else audio.pause(); });
  audio.addEventListener('play', musicUI);
  audio.addEventListener('pause', musicUI);
  audio.addEventListener('error', () => notify('A trilha não carregou. Tente atualizar a página.'));
  audio.addEventListener('timeupdate', () => {
    const seconds = Math.floor(audio.currentTime || 0);
    document.getElementById('music-time').textContent = Math.floor(seconds / 60) + ':' + pad(seconds % 60);
  });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });
  function readingUI() {
    document.querySelectorAll('.narration-label').forEach(label => { label.textContent = reading ? 'Parar a leitura' : 'Ouvir o cordel'; });
    stopButton.hidden = !reading;
    document.getElementById('reading-pause').hidden = !reading;
    document.querySelector('.sound-player').classList.toggle('is-reading', reading);
  }
  function stopReading() {
    reading = false;
    readingPaused = false;
    if (synth) synth.cancel();
    utterance = null;
    audio.pause();
    readingUI();
  }
  document.querySelectorAll('.narration-trigger').forEach(button => button.addEventListener('click', async () => {
    if (reading) { stopReading(); return; }
    await playMusic();
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') { notify('A leitura automática não está disponível neste navegador. O poema está na seção O cordel.'); return; }
    synth.cancel();
    const text = movements.map(movement => movement.stanza.join('. ')).join('. ');
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.83;
    utterance.pitch = 0.95;
    const voices = synth.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase().replace('_','-') === 'pt-br') || voices.find(v => v.lang.toLowerCase().startsWith('pt'));
    if (voice) utterance.voice = voice;
    reading = true;
    readingPaused = false;
    document.getElementById('reading-pause').setAttribute('aria-label', 'Pausar leitura do cordel');
    document.getElementById('reading-pause').setAttribute('aria-pressed', 'false');
    document.getElementById('reading-pause').querySelector('span').textContent = 'Ⅱ';
    readingUI();
    utterance.onend = () => { reading = false; readingUI(); notify('A leitura terminou. A música continua para acompanhar as fotografias.'); };
    utterance.onerror = event => {
      if (!reading || event.error === 'canceled' || event.error === 'interrupted') return;
      reading = false;
      readingUI();
      notify('A voz de demonstração não está disponível neste navegador. A trilha e o poema continuam acessíveis.');
    };
    synth.speak(utterance);
    notify('Leitura automática de demonstração, com música instrumental de fundo.');
  }));
  document.getElementById('reading-pause').addEventListener('click', () => {
    if (!reading || !synth) return;
    readingPaused = !readingPaused;
    if (readingPaused) { synth.pause(); audio.pause(); } else { synth.resume(); playMusic(); }
    const button = document.getElementById('reading-pause');
    button.setAttribute('aria-label', readingPaused ? 'Continuar leitura do cordel' : 'Pausar leitura do cordel');
    button.setAttribute('aria-pressed', String(readingPaused));
    button.querySelector('span').textContent = readingPaused ? '▶' : 'Ⅱ';
  });
  stopButton.addEventListener('click', stopReading);
  if (synth && 'onvoiceschanged' in synth) synth.onvoiceschanged = () => synth.getVoices();
  window.addEventListener('pagehide', () => { if (synth) synth.cancel(); audio.pause(); });
})();
