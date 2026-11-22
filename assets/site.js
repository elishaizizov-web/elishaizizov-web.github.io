const localPreview = !['elishaizizov.com', 'www.elishaizizov.com', 'elishaizizov-web.github.io'].includes(location.hostname);
const fixedMotion = localPreview && new URLSearchParams(location.search).get('bewegung') === 'aus';
document.documentElement.classList.toggle('preview', localPreview);
document.documentElement.classList.toggle('static-motion', fixedMotion);

const communityInvite = '';
if (communityInvite) {
  for (const placeholder of document.querySelectorAll('.pending')) {
    const invite = document.createElement('a');
    invite.className = 'button';
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
      const lead = start + 54 + position * 1.06;
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
  const cards = [...document.querySelectorAll('.categories details')];
  const status = document.querySelector('#search-result');
  const normalize = value => value.toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/ß/g, 'ss').trim();

  function filter() {
    const words = normalize(input.value).split(/\s+/);
    let visible = 0;
    for (const card of cards) {
      const haystack = normalize(card.textContent + ' ' + card.dataset.search);
      card.hidden = !words.every(word => haystack.includes(word));
      if (!card.hidden) visible++;
    }
    status.textContent = visible ? `${visible} passende ${visible === 1 ? 'Kategorie' : 'Kategorien'} gefunden.` : 'Keine passende Kategorie gefunden.';
    status.hidden = !input.value.trim();
  }

  function openTopic() {
    const card = cards.find(item => '#' + item.id === location.hash);
    if (card) {
      if (card.hidden) {
        input.value = '';
        filter();
      }
      card.open = true;
    }
  }

  input.value = new URLSearchParams(location.search).get('suche') || '';
  filter();
  openTopic();
  window.addEventListener('hashchange', openTopic);
  input.addEventListener('search', filter);
  guideSearch.addEventListener('submit', event => {
    event.preventDefault();
    filter();
    const url = new URL(location.href);
    url.searchParams.delete('suche');
    if (input.value.trim()) url.searchParams.set('suche', input.value.trim());
    url.hash = 'einkaufskorb';
    if (location.protocol !== 'file:') history.replaceState(null, '', url);
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
