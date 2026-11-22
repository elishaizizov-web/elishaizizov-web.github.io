const localPreview = !['elishaizizov.com', 'www.elishaizizov.com', 'elishaizizov-web.github.io'].includes(location.hostname);
const options = new URLSearchParams(location.search);
const development = localPreview && options.get('entwicklung') === '1';
const fixedMotion = localPreview && options.get('bewegung') === 'aus';
document.documentElement.classList.toggle('preview', development);
document.documentElement.classList.toggle('static-motion', fixedMotion);

const communityInvite = '';
if (communityInvite) {
  for (const placeholder of document.querySelectorAll('.pending')) {
    const invite = document.createElement('a');
    const inMenu = placeholder.classList.contains('nav-community');
    invite.className = inMenu ? 'nav-community' : 'button button-gold';
    invite.href = communityInvite;
    invite.textContent = placeholder.firstChild.textContent;
    placeholder.replaceWith(invite);
  }
  document.querySelector('.community')?.classList.add('community-connected');
}

const narrative = document.querySelector('.narrative');
if (narrative) {
  const thread = narrative.querySelector('.thread-line');
  const narrow = matchMedia('(max-width: 720px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let bridgeStart = 0;
  let start = 0;
  let verticalLength = 0;
  let length = 0;
  let bridgeScrollSpan = 1;
  let frame = 0;
  let layoutPending = true;

  function layout() {
    const top = narrative.getBoundingClientRect().top;
    const hero = narrative.querySelector('.hero').getBoundingClientRect();
    const title = narrative.querySelector('h1').getBoundingClientRect();
    const drawing = narrative.querySelector('.bridge-drawing').getBoundingClientRect();
    const end = narrative.querySelector('.bridge-steps').getBoundingClientRect();
    const gutter = hero.left - (narrow.matches ? 16 : 27);
    start = title.top - top + 7;
    bridgeStart = drawing.top - top + (narrow.matches ? 0 : 80);
    const stem = `M ${gutter} ${start} V ${bridgeStart}`;
    verticalLength = bridgeStart - start;

    if (narrow.matches) {
      const bottom = end.bottom - top;
      const curve = Math.min(20, (bottom - bridgeStart) / 18);
      const segments = [...narrative.querySelectorAll('.bridge-steps li')].map(step => step.getBoundingClientRect().top - top);
      const arches = segments.map(y => `V ${y} q -10 ${curve} 0 ${2 * curve}`).join(' ');
      thread.setAttribute('d', `${stem} ${arches} V ${bottom}`);
    } else {
      const x = drawing.left;
      const y = bridgeStart;
      const span = drawing.width / 3;
      const arches = Array.from({length: 3}, (_, i) => {
        const a = x + i * span;
        return `C ${a + span * .16} ${y}, ${a + span * .22} ${y - 48}, ${a + span * .5} ${y - 48} S ${a + span * .84} ${y}, ${a + span} ${y}`;
      }).join(' ');
      const bend = 21;
      verticalLength -= bend;
      thread.setAttribute('d', `M ${gutter} ${start} V ${y - bend} Q ${gutter} ${y} ${gutter + bend} ${y} H ${x} ${arches}`);
    }
    length = thread.getTotalLength();
    bridgeScrollSpan = narrow.matches
      ? length - verticalLength
      : Math.max(1, Math.min(innerHeight * .44, (end.bottom - top - bridgeStart) * .8));
  }

  function draw() {
    if (layoutPending) {
      layout();
      layoutPending = false;
    }
    if (reduced.matches || fixedMotion) {
      thread.style.removeProperty('stroke-dasharray');
    } else {
      const position = -narrative.getBoundingClientRect().top;
      const narrativeTop = scrollY - position;
      const availableScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight - narrativeTop - 2);
      const scrollRate = Math.max(1.06, (verticalLength + bridgeScrollSpan - 54) / availableScroll);
      const lead = start + 54 + position * scrollRate;
      const beforeBridge = Math.max(16, Math.min(verticalLength, lead - start));
      const afterBridge = Math.max(0, lead - start - verticalLength);
      const shown = beforeBridge + (length - verticalLength) * Math.min(1, afterBridge / bridgeScrollSpan);
      thread.style.strokeDasharray = `${shown} ${length + 1}`;
    }
    frame = 0;
  }

  function schedule(needsLayout = false) {
    layoutPending ||= needsLayout;
    if (!frame) frame = requestAnimationFrame(draw);
  }

  draw();
  window.addEventListener('scroll', () => schedule(), {passive: true});
  window.addEventListener('resize', () => schedule(true));
  reduced.addEventListener('change', () => schedule());
  new ResizeObserver(() => schedule(true)).observe(narrative);
  document.fonts.ready.then(() => schedule(true));
}

const guideSearch = document.querySelector('#guide-search');
if (guideSearch) {
  const input = guideSearch.querySelector('input');
  const cards = [...document.querySelectorAll('.category-card')];
  const answers = cards.map(card => document.getElementById(card.hash.slice(1)));
  const status = document.querySelector('#search-result');
  const example = document.querySelector('#category-example');
  const normalize = value => value.toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/ß/g, 'ss').trim();

  function showAnswer(index, isExample = false) {
    for (const [position, card] of cards.entries()) {
      answers[position].hidden = position !== index;
      if (position === index) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
    }
    example.hidden = !isExample;
  }

  function filter(preferred = -1) {
    const words = normalize(input.value).split(/\s+/);
    let visible = 0;
    let first = -1;
    for (const [index, card] of cards.entries()) {
      const haystack = normalize(answers[index].textContent + ' ' + card.dataset.search);
      card.hidden = !words.every(word => haystack.includes(word));
      if (!card.hidden) {
        if (first === -1) first = index;
        visible++;
      }
    }
    status.textContent = visible ? `${visible} passende ${visible === 1 ? 'Kategorie' : 'Kategorien'} gefunden.` : 'Keine passende Kategorie gefunden.';
    status.hidden = !input.value.trim();
    const selectPreferred = preferred !== -1 && !cards[preferred].hidden;
    showAnswer(selectPreferred ? preferred : first, !input.value.trim() && !selectPreferred);
  }

  function applyLocation() {
    input.value = new URLSearchParams(location.search).get('suche') || '';
    const index = cards.findIndex(card => card.hash === location.hash);
    filter(index);
    if (index !== -1 && cards[index].hidden) {
      input.value = '';
      filter(index);
    }
  }

  applyLocation();
  window.addEventListener('hashchange', applyLocation);
  guideSearch.addEventListener('submit', event => {
    event.preventDefault();
    filter();
    const url = new URL(location.href);
    url.searchParams.delete('suche');
    if (input.value.trim()) url.searchParams.set('suche', input.value.trim());
    url.hash = 'einkaufskorb';
    if (location.protocol !== 'file:') history.replaceState(null, '', url);
  });
  input.addEventListener('search', () => {
    if (!input.value) guideSearch.requestSubmit();
  });

  for (const [index, card] of cards.entries()) {
    card.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      showAnswer(index);
      answers[index].focus({preventScroll: true});
    });
  }

  const copyButton = document.querySelector('#copy-guide');
  const shareStatus = document.querySelector('#share-status');
  const shareAddress = document.querySelector('#share-address');
  shareAddress.value = document.querySelector('link[rel="canonical"]').href;
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    shareStatus.hidden = false;
    try {
      await navigator.clipboard.writeText(shareAddress.value);
      shareAddress.hidden = true;
      shareStatus.textContent = 'Adresse kopiert.';
    } catch {
      shareAddress.hidden = false;
      shareAddress.focus();
      shareAddress.select();
      shareStatus.textContent = 'Du kannst die markierte Adresse kopieren.';
    }
  });

  const mobileToc = document.querySelector('.toc-mobile');
  mobileToc.addEventListener('click', event => {
    if (event.target.closest('a')) mobileToc.open = false;
  });
}

const contact = document.querySelector('#inquiry-form');
if (contact) {
  contact.addEventListener('submit', async event => {
    event.preventDefault();
    const button = contact.querySelector('button[type=submit]');
    const error = document.querySelector('#form-error');
    const success = document.querySelector('#form-success');
    if (button.disabled) return;
    button.disabled = true;
    error.hidden = true;
    try {
      const response = await fetch(contact.action, {
        method: 'POST',
        body: new FormData(contact),
        headers: {Accept: 'application/json'}
      });
      if (!response.ok) throw new Error('Formspree rejected the request');
      contact.hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      error.hidden = false;
      button.disabled = false;
    }
  });
}

if ('serviceWorker' in navigator && !localPreview && navigator.serviceWorker.controller) {
  navigator.serviceWorker.getRegistration().then(registration => registration?.update()).catch(() => {});
}
