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
  const normalize = value => value.toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/ß/g, 'ss').trim();

  function showAnswer(index, isExample = false) {
    for (const [position, card] of cards.entries()) {
      if (position === index && answers[position].hidden) {
        answers[position].classList.add('answer-enter');
      }
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
