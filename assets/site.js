const localPreview = !['elishaizizov.com', 'www.elishaizizov.com', 'elishaizizov-web.github.io'].includes(location.hostname);
const options = new URLSearchParams(location.search);
const development = localPreview && options.get('entwicklung') === '1';
const fixedMotion = localPreview && options.get('bewegung') === 'aus';
document.documentElement.classList.toggle('preview', development);
document.documentElement.classList.toggle('static-motion', fixedMotion);

const communityInvite = 'https://chat.whatsapp.com/FBDpMKzc82RFgZtLysJnXh?mode=gi_t';
if (communityInvite) {
  for (const placeholder of document.querySelectorAll('.pending')) {
    const invite = document.createElement('a');
    const inMenu = placeholder.classList.contains('nav-community');
    invite.className = inMenu ? 'nav-community' : 'button button-light';
    invite.href = communityInvite;
    invite.textContent = placeholder.firstChild.textContent;
    placeholder.replaceWith(invite);
  }
  document.querySelector('.community')?.classList.add('community-connected');
}

const guideSearch = document.querySelector('#guide-search');
if (guideSearch) {
  const input = guideSearch.querySelector('input');
  const cards = [...document.querySelectorAll('.category-card')];
  const answers = cards.map(card => document.getElementById(card.hash.slice(1)));
  const status = document.querySelector('#search-result');
  const example = document.querySelector('#category-example');
  const noResults = document.querySelector('#guide-no-results');
  const reset = guideSearch.querySelector('[type="reset"]');
  const filters = document.querySelector('.guide-filters');
  const groupButtons = [...filters.querySelectorAll('button[data-group]')];
  let group = 'all';
  filters.hidden = false;

  function selectGroup(value) {
    group = value;
    for (const button of groupButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.group === group));
    }
  }
  const normalize = (value) => value.toLocaleLowerCase('de')
    .replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü')
    .normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ').trim();
  const searchTerms = cards.map((card, index) => ({
    names: normalize(card.textContent + ' ' + card.dataset.search),
    details: normalize(answers[index].textContent),
  }));

  function showAnswer(index, isExample = false) {
    for (const [position, card] of cards.entries()) {
      const selected = position === index;
      answers[position].classList.toggle('answer-enter', selected && answers[position].hidden);
      answers[position].hidden = !selected;
      if (selected && !isExample) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
    }
    example.hidden = !isExample;
  }

  function filter(preferred = -1) {
    const term = input.value.trim();
    const words = normalize(term).split(' ').filter(Boolean);
    const matches = searchTerms.map(({names, details}, index) => {
      if (group !== 'all' && cards[index].dataset.group !== group) return null;
      if (term && !words.length) return null;
      if (!words.every(word => names.includes(word) || details.includes(word))) return null;
      return {index, score: words.filter(word => names.includes(word)).length};
    }).filter(Boolean).sort((left, right) => right.score - left.score);
    const matchingIndices = new Set(matches.map(match => match.index));
    for (const [index, card] of cards.entries()) {
      card.hidden = matches.length
        ? !matchingIndices.has(index)
        : group !== 'all' && card.dataset.group !== group;
    }
    reset.hidden = !term;
    status.hidden = !term;
    noResults.hidden = !term || matches.length > 0;
    status.textContent = matches.length
      ? `${matches.length} passende ${matches.length === 1 ? 'Kategorie' : 'Kategorien'} gefunden.`
      : 'Keine passende Kategorie gefunden.';
    const selected = matchingIndices.has(preferred) ? preferred : matches[0]?.index ?? -1;
    showAnswer(selected, !term && preferred === -1 && group === 'all');
  }

  function applyLocation(initial = false) {
    const term = new URLSearchParams(location.search).get('suche');
    if (term !== null || !initial) input.value = term ?? '';
    const index = cards.findIndex(card => card.hash === location.hash);
    filter(index);
    if (index !== -1 && (cards[index].hidden || !noResults.hidden)) {
      input.value = '';
      selectGroup('all');
      filter(index);
    }
  }

  function saveLocation(hash) {
    if (location.protocol === 'file:') return;
    const url = new URL(location.href);
    url.searchParams.delete('suche');
    if (input.value.trim()) url.searchParams.set('suche', input.value.trim());
    url.hash = hash;
    history.replaceState(null, '', url);
  }

  applyLocation(true);
  window.addEventListener('hashchange', () => applyLocation());
  guideSearch.addEventListener('input', () => {
    selectGroup('all');
    filter();
    saveLocation('einkaufskorb');
  });
  for (const button of groupButtons) {
    button.addEventListener('click', () => {
      input.value = '';
      selectGroup(button.dataset.group);
      filter();
      saveLocation('einkaufskorb');
    });
  }
  guideSearch.addEventListener('submit', event => {
    event.preventDefault();
    filter();
    saveLocation('einkaufskorb');
    if (input.value.trim()) {
      const result = answers.find(answer => !answer.hidden) || status;
      input.blur();
      result.scrollIntoView({block: 'start'});
    }
  });
  guideSearch.addEventListener('reset', event => {
    event.preventDefault();
    input.value = '';
    selectGroup('all');
    filter();
    saveLocation('einkaufskorb');
    input.focus();
  });
  input.addEventListener('search', () => {
    if (!input.value) guideSearch.requestSubmit();
  });

  for (const [index, card] of cards.entries()) {
    card.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (noResults.hidden) showAnswer(index);
      else {
        input.value = '';
        filter(index);
      }
      saveLocation(card.hash);
      answers[index].focus({preventScroll: true});
      answers[index].scrollIntoView({block: 'start'});
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

if ('IntersectionObserver' in window) {
  const storyUnderlines = document.querySelectorAll('.story-underline');
  if (storyUnderlines.length) {
    const underlineObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.dataset.draw = 'visible';
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.6 });
    for (const underline of storyUnderlines) {
      underline.dataset.draw = 'waiting';
      underlineObserver.observe(underline);
    }
  }
}

const homeHeader = document.querySelector('.home-theme .top');
if (homeHeader && 'ResizeObserver' in window) {
  new ResizeObserver(() => {
    document.body.style.setProperty('--home-header-height', `${homeHeader.getBoundingClientRect().height}px`);
  }).observe(homeHeader);
}
