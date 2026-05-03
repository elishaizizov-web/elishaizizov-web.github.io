// ════════════════════════════════════════════════════════
// ARTICLES.JS — Firebase, Articles, Torah Nav, Admin Panel
// Loaded only on articles.html
// ════════════════════════════════════════════════════════

function switchTab(tab) {
  document.getElementById('panel-parasha').style.display = tab === 'parasha' ? 'block' : 'none';
  document.getElementById('panel-hagim').style.display   = tab === 'hagim'   ? 'block' : 'none';
  document.getElementById('tab-parasha').classList.toggle('active', tab === 'parasha');
  document.getElementById('tab-hagim').classList.toggle('active',   tab === 'hagim');
  document.getElementById('art-empty-msg').style.display = 'none';
}


// Torah & Hagim navigation — multilingual
const TORAH_NAMES = {
  de: { books: ['Bereschit','Schemot','Wajikra','Bamidbar','Dewarim'], back: '← Zurück',    tab_p: 'Paraschot', tab_h: 'Chagim' },
  en: { books: ['Bereshit','Shemot','Vayikra','Bamidbar','Devarim'],   back: '← Back',      tab_p: 'Paraschot', tab_h: 'Holidays' },
  fr: { books: ['Bereshit','Shemot','Vayikra','Bamidbar','Devarim'],   back: '← Retour',    tab_p: 'Paraschot', tab_h: 'Fêtes' },
  es: { books: ['Bereshit','Shemot','Vayikra','Bamidbar','Devarim'],   back: '← Volver',    tab_p: 'Paraschot', tab_h: 'Festividades' },
  ru: { books: ['Берешит','Шемот','Ваикра','Бемидбар','Дварим'],       back: '← Назад',     tab_p: 'Парашот', tab_h: 'Праздники' },
  he: { books: ['בראשית','שמות','ויקרא','במדבר','דברים'],             back: '← חזרה',      tab_p: 'פרשיות', tab_h: 'חגים' }
};
const BOOK_KEYS = ['Bereshit','Shemot','Vayikra','Bamidbar','Devarim'];
const TORAH = {
  'Bereshit': { de:['Bereshit','Noach','Lech Lecha','Vayera','Chayei Sara','Toldot','Vayetzé','Vayishlach','Vayeshev','Miketz','Vayigash','Vayechi'], de_display:['Bereschit','Noach','Lech Lecha','Wajera','Chajje Sara','Toldot','Wajeze','Wajischlach','Wajeschew','Mikez','Wajiggasch','Wajchi'], he:['בראשית','נח','לך לך','וירא','חיי שרה','תולדות','ויצא','וישלח','וישב','מקץ','ויגש','ויחי'], ru:['Берешит','Ноах','Лех Леха','Вайера','Хайей Сара','Толдот','Ваетце','Вайишлах','Вайешев','Микец','Вайигаш','Вайехи'] },
  'Shemot':   { de:['Shemot','Vaera','Bo','Beshalach','Yitro','Mishpatim','Teruma','Tetzavé','Ki Tissa','Vayakhel','Pekudei'], de_display:['Schemot','Waera','Bo','Beschallach','Jitro','Mischpatim','Teruma','Tezawwe','Ki Tissa','Wajakhel','Pekude'], he:['שמות','וארא','בא','בשלח','יתרו','משפטים','תרומה','תצוה','כי תשא','ויקהל','פקודי'], ru:['Шмот','Ваэра','Бо','Бешалах','Итро','Мишпатим','Трума','Тецаве','Ки Тиса','Ваякхель','Пкудей'] },
  'Vayikra':  { de:['Vayikra','Tzav','Shemini','Tazria','Metzora','Acharei Mot','Kedoshim','Emor','Behar','Bechukotai'], de_display:['Wajikra','Zaw','Schemini','Tazria','Mezora','Achare Mot','Kedoschim','Emor','Behar','Bechukotai'], he:['ויקרא','צו','שמיני','תזריע','מצורע','אחרי מות','קדושים','אמור','בהר','בחוקותי'], ru:['Ваикра','Цав','Шмини','Тазриа','Мецора','Ахарей Мот','Кдошим','Эмор','Бехар','Бехукотай'] },
  'Bamidbar': { de:['Bamidbar','Nasso','Behaalotcha','Shelach','Korach','Chukat','Balak','Pinchas','Matot','Massei'], de_display:['Bamidbar','Nasso','Beaalotcha','Schelach','Korach','Chukkat','Balak','Pinchas','Mattot','Masse'], he:['במדבר','נשא','בהעלותך','שלח','קורח','חוקת','בלק','פינחס','מטות','מסעי'], ru:['Бемидбар','Насо','Бехалотха','Шлах','Корах','Хукат','Балак','Пинхас','Матот','Масей'] },
  'Devarim':  { de:['Devarim','Vaetchanan','Ekev','Ree','Shoftim','Ki Tetze','Ki Tavo','Nitzavim','Vayelech','Haazinu','Vezot Habracha'], de_display:['Dewarim','Waetchanan','Ekew','Ree','Schoftim','Ki Teze','Ki Tawo','Nizawim','Wajelech','Haasinu','Wesot Habracha'], he:['דברים','ואתחנן','עקב','ראה','שופטים','כי תצא','כי תבוא','נצבים','וילך','האזינו','וזאת הברכה'], ru:['Дварим','Ваэтханан','Экев','Рее','Шофтим','Ки Тецэ','Ки Таво','Ницавим','Вайелех','Хаазину','Везот а-Браха'] }
};
const HAG_KEYS = ['Rosh Hashanah','Yom Kippur','Sukkot','Shemini Atzeret','Chanukah','Asarah BeTevet','Tu BiShvat','Purim','Pesach','Sefirat HaOmer','Yom HaShoah','Yom HaZikaron','Yom HaAtzmaut','Lag BaOmer','Yom Yerushalayim','Shavuot','Shiva Asar BeTammuz','Tisha BAv'];
const HAGIM_NAMES = {
  de: ['Rosch Haschana','Jom Kipur','Sukkot','Schemini Azeret','Chanukka','Asara beTebet','Tu biSchewat','Purim','Pessach','Sefirat HaOmer','Jom HaSchoah','Jom HaZikaron','Jom HaAzmaut','Lag baOmer','Jom Jeruschalajim','Schawuot','17. Tammus','Tischa beAw'],
  en: ['Rosh Hashanah','Yom Kippur','Sukkot','Shemini Atzeret','Hanukkah','Asarah BeTevet','Tu BiShvat','Purim','Passover','Sefirat HaOmer','Yom HaShoah','Yom HaZikaron','Yom HaAtzmaut','Lag BaOmer','Yom Yerushalayim','Shavuot','17th of Tammuz',"Tisha B'Av"],
  fr: ['Roch Hachana','Yom Kippour','Souccot','Chemini Atseret','Hanoukka','Assara BéTévet','Tou BiChvat','Pourim',"Pessa'h",'Sefirat HaOmer','Yom HaShoah','Yom HaZikaron','Yom HaAtzmaut','Lag BaOmer','Yom Yérouchalayim','Chavouot','17 Tamouz','Tisha BeAv'],
  es: ['Rosh Hashaná','Yom Kipur','Sucot','Shemini Atzeret','Janucá','Asará BeTevet','Tu BiShvat','Purim','Pésaj','Sefirat HaOmer','Yom HaShoá','Yom HaZikaron','Yom HaAtzmaut','Lag BaOmer','Yom Yerushalayim','Shavuot','17 de Tamuz','Tisha BeAv'],
  ru: ['Рош ха-Шана','Йом Кипур','Суккот','Шмини Ацерет','Ханука','Асара бе-Тевет','Ту би-Шват','Пурим','Песах','Счёт Омера','Йом ха-Шоа','Йом ха-Зикарон','Йом ха-Ацмаут','Лаг ба-Омер','Йом Йерушалаим','Шавуот','17 Тамуза','Тиша бе-Ав'],
  he: ['ראש השנה','יום כיפור','סוכות','שמיני עצרת','חנוכה','עשרה בטבת','ט"ו בשבט','פורים','פסח','ספירת העומר','יום השואה','יום הזיכרון','יום העצמאות','ל"ג בעומר','יום ירושלים','שבועות','שבעה עשר בתמוז','תשעה באב']
};

let currentBook = null;

function getArticles() { return window._articles || []; }
function getLang() { return currentLang; }
function getTN() { return TORAH_NAMES[currentLang] || TORAH_NAMES.de; }

// Returns the German display name for a parasha key (used for URL slugs — always German)
function parashaDisplayName(parashaKey) {
  if (!parashaKey) return '';
  for (const book of Object.keys(TORAH)) {
    const idx = (PARASHA_MAP[book] || []).indexOf(parashaKey);
    if (idx !== -1 && TORAH[book].de_display) return TORAH[book].de_display[idx] || parashaKey;
  }
  return parashaKey;
}

// Returns parasha name in the given language
function parashaNameForLang(parashaKey, lang) {
  if (!parashaKey) return '';
  for (const book of Object.keys(TORAH)) {
    const idx = (PARASHA_MAP[book] || []).indexOf(parashaKey);
    if (idx !== -1) {
      if (lang === 'he' && TORAH[book].he) return TORAH[book].he[idx] || parashaKey;
      if (lang === 'de' && TORAH[book].de_display) return TORAH[book].de_display[idx] || parashaKey;
      // en, fr, es, ru — standard transliteration (de array contains English-style keys)
      return TORAH[book].de[idx] || parashaKey;
    }
  }
  return parashaKey;
}

// Returns hag name in the given language
function hagNameForLang(hagKey, lang) {
  if (!hagKey) return '';
  const idx = HAG_KEYS.indexOf(hagKey);
  if (idx === -1) return hagKey;
  return (HAGIM_NAMES[lang] || HAGIM_NAMES.de)[idx] || hagKey;
}

// Returns a readable URL slug like "wajikra-2026"; falls back to Firestore ID
function _articleBaseSlug(a) {
  const year = a.date ? a.date.split('.').pop().trim() : '';
  const rawName = a.parasha ? parashaDisplayName(a.parasha) : (a.hag || '');
  if (!rawName || !year) return null;
  return rawName.toLowerCase()
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
    .replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') + '-' + year;
}
function articleSlug(a) {
  const base = _articleBaseSlug(a);
  if (!base) return a.id;
  // Conflict check — compute base slugs without recursion
  const conflicts = getArticles().filter(x => x.id !== a.id && _articleBaseSlug(x) === base);
  return conflicts.length ? base + '-' + (conflicts.length + 1) : base;
}

// Finds an article by Firestore ID or by slug (for backward-compatible links)
function findArticle(idOrSlug) {
  const all = getArticles();
  return all.find(x => x.id === idOrSlug) || all.find(x => articleSlug(x) === idOrSlug);
}

function updateNavLabels() {
  const tn = getTN();
  const tabP = document.getElementById('tab-parasha');
  const tabH = document.getElementById('tab-hagim');
  if (tabP) tabP.textContent = tn.tab_p;
  if (tabH) tabH.textContent = tn.tab_h;
  document.querySelectorAll('.back-btn').forEach(b => b.textContent = tn.back);
}

function renderBooks() {
  const tn = getTN();
  const nav = document.getElementById('torah-nav');
  if (!nav) return;
  const arts = getArticles();
  nav.innerHTML = BOOK_KEYS.map((k, i) => {
    const n = arts.filter(a => a.book === k).length;
    const badge = n > 0 ? `<span class="nav-count">${n}</span>` : '';
    return `<button class="book-btn" onclick="showBook('${k}')">${tn.books[i]}${badge}</button>`;
  }).join('');
}

function renderHagim() {
  const nav = document.getElementById('hagim-nav');
  if (!nav) return;
  const names = HAGIM_NAMES[currentLang] || HAGIM_NAMES.de;
  const articles = getArticles();
  nav.innerHTML = HAG_KEYS.map((key, i) => {
    const n = articles.filter(a => a.hag === key).length;
    const badge = n > 0 ? `<span class="nav-count">${n}</span>` : '';
    const label = names[i].replace(/'/g, "\\'");
    return `<button class="parasha-btn ${n > 0 ? 'has-articles' : ''}" onclick="showHag('${key}','${label}')">${names[i]}${badge}</button>`;
  }).join('');
}

function renderLatestArticle() {
  const articles = getArticles();
  const block = document.getElementById('latest-article-block');
  const card = document.getElementById('latest-article-card');
  if (!block || !card) return;
  // Only hide if no articles AND the card has no pre-rendered static HTML
  if (!articles.length) { if (!card.innerHTML.trim()) block.style.display = 'none'; return; }
  block.style.display = 'block';
  // Show up to 4 most recent articles
  const recent = articles.slice(0, 4);
  card.innerHTML = recent.map(a => renderCard(a)).join('');
  card.style.display = 'grid';
  card.style.gridTemplateColumns = recent.length > 1 ? 'repeat(auto-fill,minmax(260px,1fr))' : '1fr';
  card.style.gap = '20px';
}

function showBooks() {
  document.getElementById('torah-nav').style.display = 'grid';
  document.getElementById('parasha-nav').style.display = 'none';
  document.getElementById('articles-list').style.display = 'none';
  currentBook = null;
  renderBooks();
}

function showBook(book) {
  currentBook = book;
  const articles = getArticles();
  const isHe = currentLang === 'he';
  const parashiot_de = TORAH[book].de;
  const parashiot_display = isHe ? TORAH[book].he :
    (currentLang === 'de' && TORAH[book].de_display ? TORAH[book].de_display :
    (TORAH[book][currentLang] || TORAH[book].de));

  document.getElementById('torah-nav').style.display = 'none';
  document.getElementById('articles-list').style.display = 'none';
  document.getElementById('parasha-nav').style.display = 'block';
  document.querySelectorAll('#parasha-nav .back-btn').forEach(b => b.textContent = getTN().back);

  const list = document.getElementById('parasha-list');
  list.innerHTML = parashiot_de.map((pDe, i) => {
    const pDisplay = parashiot_display[i];
    const n = articles.filter(a => a.book === book && a.parasha === pDe).length;
    const badge = n > 0 ? `<span class="nav-count">${n}</span>` : '';
    return `<button class="parasha-btn ${n > 0 ? 'has-articles' : ''}" onclick="showParasha('${pDe}','${pDisplay}')">${pDisplay}${badge}</button>`;
  }).join('');
}

function showParashiot() { showBook(currentBook); }

function showParasha(parashaKey, parashaDisplay) {
  const articles = getArticles().filter(a => a.book === currentBook && a.parasha === parashaKey);
  document.getElementById('parasha-nav').style.display = 'none';
  document.getElementById('articles-list').style.display = 'block';
  document.getElementById('articles-list-title').textContent = parashaDisplay || parashaKey;
  document.querySelectorAll('#articles-list .back-btn').forEach(b => b.textContent = getTN().back);

  const grid = document.getElementById('articles-grid');
  const empty = document.getElementById('art-empty-msg');
  if (articles.length === 0) { grid.innerHTML = ''; empty.style.display = 'block'; }
  else {
    empty.style.display = 'none';
    grid.innerHTML = articles.map(a => renderCard(a)).join('');
  }
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.textContent || tmp.innerText || '';
}
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
// Convert Gregorian date string "DD.MM.YYYY" to Hebrew year string (e.g. "תשפ״ו")
function toHebrewYear(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('.');
  if (parts.length < 3) return '';
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  if (!year || year < 100) return '';
  // Hebrew year: after Rosh Hashana (approx Sep/Oct) it's year+3761, otherwise year+3760
  const hebrewYear = year + (month >= 9 ? 3761 : 3760);
  return hebrewYearToLetters(hebrewYear);
}

function hebrewYearToLetters(year) {
  const thou = Math.floor(year / 1000);
  year = year % 1000;
  const hundreds = Math.floor(year / 100);
  year = year % 100;
  const tens = Math.floor(year / 10);
  const ones = year % 10;
  const letters1 = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const letters10 = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const letters100 = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
  // avoid yud-heh (יה) and yud-vav (יו) — use ט״ו and ט״ז instead
  let s = letters100[hundreds] + letters10[tens] + letters1[ones];
  if (tens === 1 && ones === 5) s = letters100[hundreds] + 'ט״ו';
  else if (tens === 1 && ones === 6) s = letters100[hundreds] + 'ט״ז';
  else if (s.length > 1) s = s.slice(0, -1) + '״' + s.slice(-1);
  else if (s.length === 1) s += '׳';
  return 'ה׳' + (thou > 5 ? letters1[thou] : '') + s;
}

function readingTime(html, lang) {
  const words = stripHtml(html).trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  const labels = {
    de: `Geschätzte Lesezeit: ${mins} Min.`,
    en: `Estimated reading time: ${mins} min`,
    fr: `Temps de lecture estimé : ${mins} min`,
    es: `Tiempo de lectura estimado: ${mins} min`,
    ru: `Примерное время чтения: ${mins} мин.`,
    he: `זמן קריאה משוערך: ${mins} דק'`
  };
  return labels[lang] || labels.de;
}

function renderCard(a, noClick) {
  const l = currentLang;
  const t = (a.translations && a.translations[l]) ? a.translations[l] : { title: a.title, text: a.text };
  const img = a.image ? `<img class="article-card-img" src="${escHtml(a.image)}" alt="${escHtml(t.title)}" loading="lazy">` : `<div class="article-card-img-placeholder"></div>`;
  const excerpt = stripHtml(t.text).substring(0, 200).trim();
  const excerptHtml = excerpt ? `<p class="article-card-excerpt">${escHtml(excerpt)}${excerpt.length >= 200 ? '…' : ''}</p>` : '';
  const readMoreLabel = { de: 'Weiterlesen', en: 'Read more', fr: 'Lire la suite', es: 'Leer más', ru: 'Читать', he: 'קרא עוד' }[l] || 'Weiterlesen';
  const readMoreHtml = noClick ? '' : `<span class="article-card-readmore">${readMoreLabel} <span>→</span></span>`;
  const cat = a.parasha ? parashaNameForLang(a.parasha, l) : (a.hag ? hagNameForLang(a.hag, l) : '');
  const tagHtml = cat ? `<span class="article-card-tag">${escHtml(cat)}</span>` : '';
  const heYear = toHebrewYear(a.date);
  const dateStr = a.date + (heYear ? ' · ' + heYear : '');
  if (noClick) {
    return `<div class="article-card">${img}<div class="article-card-body">${tagHtml}<span class="article-card-date">${escHtml(dateStr)}</span><h3 class="article-card-title">${escHtml(t.title)}</h3>${excerptHtml}</div></div>`;
  }
  const slug = articleSlug(a);
  const langParam = l !== 'de' ? '?lang=' + l : '';
  const safeId = escHtml(a.id).replace(/'/g, '&#39;');
  return `<a href="/${slug}${langParam}" data-article-id="${escHtml(a.id)}" onclick="event.preventDefault();openArticle(this.dataset.articleId);" style="text-decoration:none;color:inherit;display:block;cursor:pointer;"><div class="article-card">${img}<div class="article-card-body">${tagHtml}<span class="article-card-date">${escHtml(dateStr)}</span><h3 class="article-card-title">${escHtml(t.title)}</h3>${excerptHtml}${readMoreHtml}</div></div></a>`;
}

function showHagim() {
  document.getElementById('hagim-nav').style.display = 'grid';
  document.getElementById('hag-articles-list').style.display = 'none';
  renderHagim();
}

function showHag(hagKey, hagDisplay) {
  const articles = getArticles().filter(a => a.hag === hagKey);
  document.getElementById('hagim-nav').style.display = 'none';
  document.getElementById('hag-articles-list').style.display = 'block';
  document.getElementById('hag-articles-title').textContent = hagDisplay || hagKey;
  document.querySelectorAll('#hag-articles-list .back-btn').forEach(b => b.textContent = getTN().back);

  const grid = document.getElementById('hag-articles-grid');
  const empty = document.getElementById('art-empty-msg');
  if (articles.length === 0) { grid.innerHTML = ''; empty.style.display = 'block'; }
  else {
    empty.style.display = 'none';
    grid.innerHTML = articles.map(a => renderCard(a)).join('');
  }
}


// Back to top + reading progress bar
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
  const prog = document.getElementById('ap-progress');
  if (prog) {
    const ap = document.getElementById('article-page');
    if (ap && ap.style.display !== 'none') {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (total > 0 ? Math.min(scrolled / total * 100, 100) : 0) + '%';
      prog.classList.add('visible');
    } else {
      prog.classList.remove('visible');
    }
  }
});

// Search
function inlineSearch(q) {
  const resultsEl = document.getElementById('articles-inline-results');
  const noResultsEl = document.getElementById('articles-search-no-results');
  const tabsEl = document.getElementById('articles-tabs');
  const panelParasha = document.getElementById('panel-parasha');
  const panelHagim = document.getElementById('panel-hagim');
  const latestBlock = document.getElementById('latest-article-block');
  if (!q || !q.trim()) {
    resultsEl.style.display = 'none';
    noResultsEl.style.display = 'none';
    if (tabsEl) tabsEl.style.display = '';
    // Restore panels based on which tab is active (not blindly to '' which breaks panel-hagim)
    const activeTab = document.querySelector('#articles-tabs .tab-btn.active')?.id;
    if (panelParasha) panelParasha.style.display = (!activeTab || activeTab === 'tab-parasha') ? 'block' : 'none';
    if (panelHagim)   panelHagim.style.display   = activeTab === 'tab-hagim' ? 'block' : 'none';
    if (latestBlock && latestBlock._wasVisible) latestBlock.style.display = 'block';
    return;
  }
  if (tabsEl) tabsEl.style.display = 'none';
  if (panelParasha) panelParasha.style.display = 'none';
  if (panelHagim) panelHagim.style.display = 'none';
  if (latestBlock) { latestBlock._wasVisible = latestBlock.style.display !== 'none'; latestBlock.style.display = 'none'; }
  const lower = q.toLowerCase();
  const results = getArticles().filter(a => {
    const t = (a.translations && a.translations[currentLang]) ? a.translations[currentLang] : { title: a.title || '', text: a.text || '' };
    return (t.title || '').toLowerCase().includes(lower) || stripHtml(t.text || '').toLowerCase().includes(lower);
  });
  if (results.length === 0) {
    resultsEl.style.display = 'none';
    noResultsEl.style.display = 'block';
  } else {
    noResultsEl.style.display = 'none';
    resultsEl.innerHTML = results.map(a => renderCard(a)).join('');
    resultsEl.style.display = 'grid';
  }
}

function searchArticles(q) {
  const articles = getArticles();
  const l = currentLang;
  const results = document.getElementById('search-results');
  const noRes = document.getElementById('search-no-results');
  if (!q.trim()) { results.innerHTML = ''; noRes.style.display = 'none'; return; }
  const filtered = articles.filter(a => {
    const t = (a.translations && a.translations[l]) ? a.translations[l] : { title: a.title, text: a.text };
    return t.title.toLowerCase().includes(q.toLowerCase()) || t.text.toLowerCase().includes(q.toLowerCase());
  });
  if (filtered.length === 0) { results.innerHTML = ''; noRes.style.display = 'block'; return; }
  noRes.style.display = 'none';
  results.innerHTML = filtered.map(a => renderCard(a, true)).join('');
}

// Article full view
function openArticle(id) {
  let a = findArticle(id);
  // Fallback: search _fallbackArticles in case window._articles isn't populated yet
  if (!a && window._fallbackArticles) a = window._fallbackArticles.find(x => x.id === id);
  if (!a) { console.warn('Article not found:', id); return false; }
  window._currentArticle = a;
  _renderArticlePage(a, currentLang);
  // URL — use clean path like /wajikra-2026
  const slug = articleSlug(a);
  const langQ = currentLang !== 'de' ? '?lang=' + currentLang : '';
  window.history.pushState({ articleId: slug }, '', '/' + slug + langQ);
  // switch views
  const _ph = document.querySelector('.page-band'); if (_ph) _ph.style.display = 'none';
  document.querySelector('.page-body').style.display   = 'none';
  const _sf = document.querySelector('.main-footer');if (_sf) _sf.style.display = 'none';
  document.getElementById('article-page').style.display = 'block';
  document.getElementById('lang-back-btn').style.display = 'inline-flex';
  window.scrollTo(0, 0);
  return true;
}

// Click handling is via inline onclick on each card (see renderCard)

function _renderArticlePage(a, l) {
  const tr = (a.translations && a.translations[l]) ? a.translations[l] : { title: a.title || '', text: a.text || '' };
  const isRTL = (l === 'he');
  const dir   = isRTL ? 'rtl' : 'ltr';
  // content
  const _heYear = toHebrewYear(a.date);
  document.getElementById('ap-date').textContent = (a.date || '') + (_heYear ? ' · ' + _heYear : '');
  const parashaEl = document.getElementById('ap-parasha');
  const parashaDisplay = a.parasha ? parashaNameForLang(a.parasha, l) : (a.hag ? hagNameForLang(a.hag, l) : '');
  parashaEl.textContent = parashaDisplay;
  parashaEl.style.display = parashaDisplay ? 'block' : 'none';
  a._parashaDisplay = parashaDisplay;
  // reading time
  const rtEl = document.getElementById('ap-reading-time');
  if (rtEl) rtEl.textContent = readingTime(tr.text || a.text || '', l);
  // breadcrumb
  const bcEl = document.getElementById('ap-breadcrumb');
  if (bcEl) {
    const homeLabels = { de:'Start', en:'Home', fr:'Accueil', es:'Inicio', ru:'Главная', he:'ראשי' };
    const home = homeLabels[l] || 'Home';
    let parts = `<span class="ap-breadcrumb-item">${escHtml(home)}</span>`;
    if (parashaDisplay) {
      parts += `<span class="ap-breadcrumb-sep">›</span><span class="ap-breadcrumb-item">${escHtml(parashaDisplay)}</span>`;
    }
    bcEl.innerHTML = parts;
  }
  document.getElementById('ap-title').textContent = tr.title || '';
  document.getElementById('ap-title').style.direction  = dir;
  document.getElementById('ap-title').style.textAlign  = isRTL ? 'right' : 'left';
  const cleanedText = (tr.text || '')
    .replace(/font-family:[^;"']*/gi, '')
    .replace(/font-size:\s*\d+(\.\d+)?(px|pt|em|rem)[^;"']*/gi, '')
    .replace(/font-weight:\s*(?:normal|bold|bolder|lighter|\d+)[^;"']*/gi, '')
    .replace(/line-height:\s*[\d.]+[^;"']*/gi, '')
    .replace(/(<p><br\s*\/?><\/p>\s*){2,}/gi, '<p><br></p>')
    .replace(/<p><br\s*\/?><\/p>/gi, '<div class="art-spacer"></div>');
  const apTextEl = document.getElementById('ap-text');
  apTextEl.innerHTML = cleanedText + '<hr class="ap-end-rule">';
  apTextEl.style.direction = dir;
  apTextEl.style.textAlign = isRTL ? 'right' : 'left';
  apTextEl.classList.toggle('ap-rtl', isRTL);
  // Drop cap: find first non-empty <p> and wrap first letter in span
  {
    const firstP = Array.from(apTextEl.querySelectorAll('p')).find(p => p.textContent.trim().length > 1);
    if (firstP) {
      const html = firstP.innerHTML;
      let firstCharIdx = -1, inTag = false;
      if (isRTL) {
        // Hebrew: first character in logical order = beginning of HTML string
        for (let i = 0; i < html.length; i++) {
          if (html[i] === '<') { inTag = true; continue; }
          if (html[i] === '>') { inTag = false; continue; }
          if (!inTag && html[i].trim()) { firstCharIdx = i; break; }
        }
        if (firstCharIdx >= 0) {
          firstP.innerHTML = '<span class="drop-cap drop-cap-rtl">' + html[firstCharIdx] + '</span>' + html.slice(firstCharIdx + 1);
        }
      } else {
        for (let i = 0; i < html.length; i++) {
          if (html[i] === '<') { inTag = true; continue; }
          if (html[i] === '>') { inTag = false; continue; }
          if (!inTag && html[i].trim()) { firstCharIdx = i; break; }
        }
        if (firstCharIdx >= 0) {
          firstP.innerHTML = '<span class="drop-cap">' + html[firstCharIdx] + '</span>' + html.slice(firstCharIdx + 1);
        }
      }
    }
  }
  const img = document.getElementById('ap-img');
  if (a.image) { img.src = a.image; img.alt = tr.title || a.title || ''; img.style.display = 'block'; } else { img.style.display = 'none'; }
  // Update OG meta tags so WhatsApp/Telegram use the article URL when shared
  const pageUrl   = window.location.origin + '/' + articleSlug(a);
  const langSuffix = l !== 'de' ? '?lang=' + l : '';
  const shareUrl  = pageUrl + langSuffix;
  document.title = (tr.title || a.title || '') + ' — Rabbiner Elishai Zizov';
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', shareUrl);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', tr.title || a.title || '');
  const desc = stripHtml(tr.text || a.text || '').trim().substring(0, 200);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
  if (a.image) {
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) { ogImg = document.createElement('meta'); ogImg.setAttribute('property','og:image'); document.head.appendChild(ogImg); }
    ogImg.setAttribute('content', a.image);
  }
  // Update <meta name="description"> for Google
  document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
  // Update canonical URL (always points to the base URL without lang for SEO)
  document.getElementById('seo-canonical')?.setAttribute('href', pageUrl);
  // JSON-LD structured data for article (helps Google understand content)
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": tr.title || a.title || '',
    "description": desc,
    "datePublished": a.date || '',
    "author": { "@type": "Person", "name": "Rabbi Elishai Zizov", "url": "https://elishaizizov.com" },
    "publisher": { "@type": "Person", "name": "Rabbi Elishai Zizov", "url": "https://elishaizizov.com" },
    "url": shareUrl,
    "mainEntityOfPage": { "@type": "WebPage", "@id": shareUrl }
  };
  if (a.image) jsonld.image = a.image;
  const jsonldEl = document.getElementById('seo-jsonld');
  if (jsonldEl) jsonldEl.textContent = JSON.stringify(jsonld);

  // share buttons — use article-specific URL with current language
  const _articleTitle = encodeURIComponent(tr.title || a.title || '');
  const _url = encodeURIComponent(shareUrl);
  // For Facebook: always use production domain + language-specific static page (/{slug}-{lang}/)
  const slug = articleSlug(a);
  const fbStaticBase = 'https://elishaizizov.com/' + slug;
  const fbStaticUrl = l === 'de' ? fbStaticBase : (fbStaticBase + '-' + l);
  const fbUrl  = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(fbStaticUrl);
  const xUrl   = 'https://twitter.com/intent/tweet?url=' + _url + '&text=' + _articleTitle;
  const thrUrl = 'https://www.threads.net/intent/post?text=' + encodeURIComponent((tr.title || a.title || '') + '\n\n' + shareUrl);
  const waText = encodeURIComponent((tr.title || a.title || '') + '\n\n' + shareUrl);
  const shareLabels = { de:'Teilen', en:'Share', fr:'Partager', es:'Compartir', ru:'Поделиться', he:'לשתף' };
  const copyTitles  = { de:'Link kopieren', en:'Copy link', fr:'Copier le lien', es:'Copiar enlace', ru:'Скопировать', he:'העתק קישור' };
  const printTitles = { de:'Drucken', en:'Print', fr:'Imprimer', es:'Imprimir', ru:'Печать', he:'הדפס' };
  const safeUrl = shareUrl.replace(/'/g, "\\'");
  const icWA  = '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378L.057 22l1.649-6.079a9.925 9.925 0 0 1-1.334-4.93c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>';
  const icFB  = '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>';
  const icThr = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>';
  const icX   = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
  const icLnk = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  const icPrt = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>';
  const icPdf = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>';
  document.getElementById('ap-share').innerHTML =
    '<div class="ap-share-header"><div class="ap-share-label">' + (shareLabels[l] || 'Teilen') + '</div></div>' +
    '<div class="ap-share-row">' +
    '<a class="share-icon-btn" href="https://wa.me/?text=' + waText + '" target="_blank" rel="noopener" title="WhatsApp">' + icWA + '</a>' +
    '<a class="share-icon-btn" href="' + fbUrl + '" target="_blank" rel="noopener" title="Facebook">' + icFB + '</a>' +
    '<a class="share-icon-btn" href="' + thrUrl + '" target="_blank" rel="noopener" title="Threads">' + icThr + '</a>' +
    '<a class="share-icon-btn" href="' + xUrl + '" target="_blank" rel="noopener" title="X">' + icX + '</a>' +
    '<button class="share-icon-btn" id="copy-link-btn" title="Copy link" onclick="copyShareLink(\'' + safeUrl + '\')">' + icLnk + '</button>' +
    '<button class="share-icon-btn" onclick="window.print()" title="Print">' + icPrt + '</button>' +
    '<button class="share-icon-btn" onclick="downloadArticlePDF()" title="PDF">' + icPdf + '</button>' +
    '</div>';
  // related articles
  const relEl = document.getElementById('ap-related');
  if (relEl) {
    const related = getArticles().filter(x => x.id !== a.id && ((a.parasha && x.parasha === a.parasha) || (a.hag && x.hag === a.hag))).slice(0, 3);
    if (related.length > 0) {
      const relLabels = { de:'Weitere Beiträge', en:'More Articles', fr:'Plus d\'articles', es:'Más artículos', ru:'Ещё статьи', he:'כתבות נוספות' };
      relEl.innerHTML = `<div class="ap-related-title">${relLabels[l] || relLabels.de}</div><div class="articles-grid">${related.map(x => renderCard(x)).join('')}</div>`;
    } else {
      relEl.innerHTML = '';
    }
  }
}

function switchArticleLang(l) {
  if (window._currentArticle) _renderArticlePage(window._currentArticle, l);
}

function copyShareLink(url, copyLabel) {
  var btn = document.getElementById('copy-link-btn');
  if (!btn) return;
  var orig = btn.innerHTML;
  navigator.clipboard.writeText(url).then(function() {
    btn.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"><\/polyline><\/svg>';
    btn.classList.add('btn-copied');
    setTimeout(function() { btn.innerHTML = orig; btn.classList.remove('btn-copied'); }, 2200);
  });
}

function closeArticlePage() {
  document.getElementById('article-page').style.display  = 'none';
  document.getElementById('lang-back-btn').style.display = 'none';
  const prog = document.getElementById('ap-progress');
  if (prog) { prog.style.width = '0%'; prog.classList.remove('visible'); }
  const _ph2 = document.querySelector('.page-band'); if (_ph2) _ph2.style.display = '';
  document.querySelector('.page-body').style.display     = 'block';
  const _sf2 = document.querySelector('.main-footer');if (_sf2) _sf2.style.display = '';
  const previewBanner = document.getElementById('admin-preview-notice');
  if (previewBanner) previewBanner.style.display = 'none';
  if (window._previewMode) {
    window._previewMode = false;
    window._currentArticle = null;
    document.getElementById('admin-overlay').classList.add('open');
    return;
  }
  window.history.pushState({}, '', '/articles.html');
  // Reset meta tags to articles page defaults
  document.title = 'Beiträge — Rabbiner Elishai Zizov';
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', window.location.origin + '/articles.html');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Beiträge — Rabbiner Elishai Zizov');
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Torah-Beiträge und Artikel von Rabbiner Elishai Zizov.');
}

function closeOverlay() { closeArticlePage(); }

function closeArticle(e) { /* handled by full-page nav */ }

// Navigation scroll helper — closes article page first if open, then scrolls
function navScrollTo(id) {
  if (document.getElementById('article-page').style.display !== 'none') closeArticlePage();
  var el = document.getElementById(id);
  if (el) setTimeout(function() { el.scrollIntoView({behavior:'smooth'}); }, 50);
}


// Hamburger menu
function toggleMenu() {
  const isOpen = document.getElementById('hmenu').classList.toggle('open');
  document.getElementById('hmenu-overlay').classList.toggle('open');
  document.getElementById('hamburger-btn').setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
function closeMenu() {
  document.getElementById('hmenu').classList.remove('open');
  document.getElementById('hmenu-overlay').classList.remove('open');
  // reset art sub-menu
  const sub = document.getElementById('hmenu-art-sub');
  const btn = document.getElementById('hmenu-art-btn');
  if (sub) { sub.classList.remove('open'); btn.classList.remove('open'); hmenuBackToL1(); }
  // clear inline search
  const si = document.getElementById('hmenu-search-input');
  const sr = document.getElementById('hmenu-search-results');
  if (si) si.value = '';
  if (sr) sr.innerHTML = '';
  document.getElementById('hamburger-btn').setAttribute('aria-expanded', 'false');
}

function hmenuSearch(q) {
  const container = document.getElementById('hmenu-search-results');
  if (!q.trim()) { container.innerHTML = ''; return; }
  const articles = getArticles();
  const l = currentLang;
  const filtered = articles.filter(a => {
    const t = (a.translations && a.translations[l]) ? a.translations[l] : { title: a.title, text: a.text };
    return (t.title||'').toLowerCase().includes(q.toLowerCase()) || (t.text||'').toLowerCase().includes(q.toLowerCase());
  });
  if (filtered.length === 0) {
    container.innerHTML = '<div class="hmenu-search-none">—</div>';
    return;
  }
  container.innerHTML = filtered.slice(0, 6).map(a => {
    const t = (a.translations && a.translations[l]) ? a.translations[l] : { title: a.title };
    return `<button class="hmenu-search-result" onclick="closeMenu(); openArticle('${escHtml(a.id)}')">
      <div class="hmenu-search-result-title">${escHtml(t.title)}</div>
    </button>`;
  }).join('');
}

// keydown (Escape) handled by shared.js

// ── Hamburger Beiträge sub-navigation ──
function hmenuToggleArt() {
  const sub = document.getElementById('hmenu-art-sub');
  const btn = document.getElementById('hmenu-art-btn');
  const opening = !sub.classList.contains('open');
  sub.classList.toggle('open');
  btn.classList.toggle('open');
  if (opening) hmenuBackToL1();
}
function hmenuBackToL1() {
  document.getElementById('hmenu-l1').style.display = '';
  document.getElementById('hmenu-books-level').style.display = 'none';
  document.getElementById('hmenu-parasha-level').style.display = 'none';
  document.getElementById('hmenu-hagim-level').style.display = 'none';
}
function hmenuShowParashaBooksLevel() {
  document.getElementById('hmenu-l1').style.display = 'none';
  document.getElementById('hmenu-books-level').style.display = '';
  const tn = TORAH_NAMES[currentLang] || TORAH_NAMES['de'];
  const list = document.getElementById('hmenu-books-list');
  list.innerHTML = BOOK_KEYS.map((k, i) =>
    `<button class="hmenu-sub-item" onclick="hmenuShowParashaLevel('${k}')">${tn.books[i]} ›</button>`
  ).join('');
}
function hmenuShowParashaLevel(book) {
  document.getElementById('hmenu-books-level').style.display = 'none';
  document.getElementById('hmenu-parasha-level').style.display = '';
  const btn = document.getElementById('hmenu-parasha-level').querySelector('.hmenu-sub-back');
  btn.onclick = hmenuBackToBooks;
  const tn = TORAH_NAMES[currentLang] || TORAH_NAMES['de'];
  const parashiot = PARASHA_MAP[book] || [];
  const list = document.getElementById('hmenu-parasha-list');
  list.innerHTML = parashiot.map((p, i) => {
    const hasArt = getArticles().some(a => a.parasha === p);
    let label = p;
    if (currentLang === 'de' && TORAH[book] && TORAH[book].de_display && TORAH[book].de_display[i]) label = TORAH[book].de_display[i];
    else if (currentLang === 'he' && TORAH[book] && TORAH[book].he && TORAH[book].he[i]) label = TORAH[book].he[i];
    else if (TORAH[book] && TORAH[book][currentLang] && TORAH[book][currentLang][i]) label = TORAH[book][currentLang][i];
    return `<button class="hmenu-sub-item${hasArt ? ' has-articles' : ''}" onclick="closeMenu(); hmenuSelectParasha('${book}','${p}','${p}')">${label}</button>`;
  }).join('');
  window._hmenuPrevBook = book;
}
function hmenuBackToBooks() {
  document.getElementById('hmenu-parasha-level').style.display = 'none';
  hmenuShowParashaBooksLevel();
}
function hmenuSelectParasha(book, pKey, pDisplay) {
  closeMenu();
  if (document.getElementById('article-page').style.display !== 'none') closeArticlePage();
  switchTab('parasha');
  document.getElementById('torah-nav').style.display = 'none';
  currentBook = book;
  showParasha(pKey, pDisplay);
  setTimeout(function() { document.getElementById('articles-section').scrollIntoView({behavior:'smooth'}); }, 50);
}
function hmenuSelectHag(hagKey, display) {
  closeMenu();
  if (document.getElementById('article-page').style.display !== 'none') closeArticlePage();
  switchTab('hagim');
  showHag(hagKey, display);
  setTimeout(function() { document.getElementById('articles-section').scrollIntoView({behavior:'smooth'}); }, 50);
}
function hmenuShowHagimLevel() {
  document.getElementById('hmenu-l1').style.display = 'none';
  document.getElementById('hmenu-hagim-level').style.display = '';
  const tn = TORAH_NAMES[currentLang] || TORAH_NAMES['de'];
  const names = HAGIM_NAMES[currentLang] || HAGIM_NAMES.de;
  const list = document.getElementById('hmenu-hagim-list');
  list.innerHTML = HAG_KEYS.map((k, i) => {
    const hasArt = getArticles().some(a => a.hag === k);
    const label = names[i] || k;
    return `<button class="hmenu-sub-item${hasArt ? ' has-articles' : ''}" onclick="closeMenu(); hmenuSelectHag('${k}','${label}')">${label}</button>`;
  }).join('');
}
function updateHmenuLangs(l) {
  document.querySelectorAll('.hmenu-lang').forEach(b => {
    const bl = b.id.replace('hm-','');
    b.classList.toggle('active', bl === l);
  });
}
function toggleSearch() {
  const s = document.getElementById('search-float');
  const isHidden = s.style.display === 'none';
  s.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    s.scrollIntoView({behavior:'smooth'});
    setTimeout(() => document.getElementById('search-input').focus(), 300);
  }
}

// setLang initial call handled by shared.js DOMContentLoaded


// ════════════════════════════════════════════════════════
// FIREBASE CONFIG + INIT
// ════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyDmEpaog0ZVYI4ZU87IfcjiSbRizQITn5o",
  authDomain: "elishai-zizov.firebaseapp.com",
  projectId: "elishai-zizov",
  storageBucket: "elishai-zizov.firebasestorage.app",
  messagingSenderId: "336975073982",
  appId: "1:336975073982:web:b4d9f466b7dc476531c4ef",
  measurementId: "G-R4DL0C3PFW"
};

// Initialize Firebase only once — wrapped in try/catch so a Firebase
// failure never crashes the rest of the page (admin login, UI, etc.)
let db, storage, auth;
try {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  db      = firebase.firestore();
  storage = firebase.storage();
  auth    = firebase.auth();
} catch(e) {
  console.error('Firebase init failed:', e);
}



window._articles       = [];
window._currentArticle = null;
window._editingId      = null;
let _loadArticlesInProgress = false;
// Pre-embedded articles (fallback if Firestore is unreachable)
// Updated each deploy — guarantees articles always show even offline
window._fallbackArticles = [];

async function loadArticles(silent) {
  if (_loadArticlesInProgress) return;
  _loadArticlesInProgress = true;
  try { return await _loadArticlesImpl(silent); } finally { _loadArticlesInProgress = false; }
}
async function _loadArticlesImpl(silent) {
  // Helper: parse articles from Firestore REST API response
  function parseRestDocs(json) {
    if (!json.documents) return [];
    return json.documents.map(d => {
      const id = d.name.split('/').pop();
      const fields = d.fields || {};
      function fv(f) {
        if (!f) return '';
        if (f.stringValue !== undefined) return f.stringValue;
        if (f.integerValue !== undefined) return Number(f.integerValue);
        if (f.booleanValue !== undefined) return f.booleanValue;
        if (f.timestampValue !== undefined) return { seconds: Math.floor(new Date(f.timestampValue).getTime()/1000) };
        if (f.mapValue) {
          const m = {};
          Object.entries(f.mapValue.fields||{}).forEach(([k,v]) => { m[k] = fv(v); });
          return m;
        }
        return '';
      }
      const obj = { id };
      Object.entries(fields).forEach(([k,v]) => { obj[k] = fv(v); });
      return obj;
    });
  }

  let articles = null;

  // Show loading indicator
  const loadingEl = document.getElementById('articles-loading-msg');
  if (loadingEl) loadingEl.style.display = 'block';

  // Attempt 1: REST without API key
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch('https://firestore.googleapis.com/v1/projects/elishai-zizov/databases/(default)/documents/articles?pageSize=300', { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) { articles = parseRestDocs(await res.json()); }
    else { console.warn('REST no-key returned', res.status); }
  } catch(e) { console.warn('REST no-key failed:', e.message); }

  // Attempt 2: REST with API key
  if (!articles || !articles.length) {
    try {
      const ctrl2 = new AbortController();
      const timer2 = setTimeout(() => ctrl2.abort(), 12000);
      const res2 = await fetch('https://firestore.googleapis.com/v1/projects/elishai-zizov/databases/(default)/documents/articles?pageSize=300&key=AIzaSyDmEpaog0ZVYI4ZU87IfcjiSbRizQITn5o', { signal: ctrl2.signal });
      clearTimeout(timer2);
      if (res2.ok) { articles = parseRestDocs(await res2.json()); }
      else { console.warn('REST with-key returned', res2.status); }
    } catch(e) { console.warn('REST with-key failed:', e.message); }
  }

  // Attempt 3: Firebase SDK
  if ((!articles || !articles.length) && db) {
    try {
      const snap = await db.collection('articles').get({ source: 'server' });
      articles = [];
      snap.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
    } catch(e) { console.warn('SDK failed:', e.message); }
  }

  if (loadingEl) loadingEl.style.display = 'none';

  const retryBtn = document.getElementById('articles-retry-btn');
  if (!articles || !articles.length) {
    console.warn('loadArticles: Firestore returned no articles — keeping fallback data');
    // Do NOT overwrite window._articles — fallback articles remain visible
    if (!silent && retryBtn && !window._articles.length) retryBtn.style.display = 'inline-block';
    return;
  }
  // Firestore returned real articles — hide retry button
  if (retryBtn) retryBtn.style.display = 'none';

  try {
    window._articles = articles;
    // Sort by createdAt descending; articles without createdAt go to the end
    window._articles.sort((a, b) => {
      const ta = (a.createdAt && a.createdAt.seconds) ? a.createdAt.seconds : 0;
      const tb = (b.createdAt && b.createdAt.seconds) ? b.createdAt.seconds : 0;
      return tb - ta;
    });
    renderBooks();
    renderHagim();
    renderLatestArticle();
    // If admin is open, refresh the list too
    if (document.getElementById('admin-content')?.style.display !== 'none') renderAdminList();
    // Support: sessionStorage redirect (from 404.html), path-based, and old ?article= links
    const redirectSlug = sessionStorage.getItem('redirect_article');
    if (redirectSlug) {
      sessionStorage.removeItem('redirect_article');
      const redirectLang = sessionStorage.getItem('redirect_lang');
      if (redirectLang) { sessionStorage.removeItem('redirect_lang'); setLang(redirectLang); }
      openArticle(redirectSlug);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const langFromUrl = urlParams.get('lang');
      if (langFromUrl && TORAH_NAMES[langFromUrl]) setLang(langFromUrl);
      const slug = window.location.pathname.replace(/^\//, '') || urlParams.get('article');
      const knownPages = ['articles.html', 'index.html', 'contact.html', ''];
      if (slug && !knownPages.includes(slug)) openArticle(slug);
    }
  } catch(e) {
    console.error('Render error after loading articles:', e);
  }
}

window.addEventListener('popstate', () => {
  const popParams = new URLSearchParams(window.location.search);
  const popLang = popParams.get('lang');
  if (popLang && TORAH_NAMES[popLang]) setLang(popLang);
  const slug = window.location.pathname.replace(/^\//, '') ||
               popParams.get('article'); // backward compat
  const knownPages = ['articles.html', 'index.html', 'contact.html', ''];
  if (slug && !knownPages.includes(slug)) { const a = findArticle(slug); if (a) { openArticle(a.id); return; } }
  document.getElementById('article-page').style.display = 'none';
  const _ph3 = document.querySelector('.page-band'); if (_ph3) _ph3.style.display = '';
  document.querySelector('.page-body').style.display    = 'block';
  const _sf3 = document.querySelector('.main-footer');if (_sf3) _sf3.style.display = '';
});

// ════════════════════════════════════════════════════════
// ADMIN
// ════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════
// AUTHENTICATION & ADMIN
// ════════════════════════════════════════════════════════
const PARASHA_MAP = {
  Bereshit: ["Bereshit","Noach","Lech Lecha","Vayera","Chayei Sara","Toldot","Vayetzei","Vayishlach","Vayeshev","Miketz","Vayigash","Vayechi"],
  Shemot:   ["Shemot","Vaera","Bo","Beshalach","Yitro","Mishpatim","Teruma","Tetzaveh","Ki Tisa","Vayakhel","Pekudei"],
  Vayikra:  ["Vayikra","Tzav","Shemini","Tazria","Metzora","Acharei Mot","Kedoshim","Emor","Behar","Bechukotai"],
  Bamidbar: ["Bamidbar","Nasso","Beha'alotcha","Shelach","Korach","Chukat","Balak","Pinchas","Matot","Masei"],
  Devarim:  ["Devarim","Vaetchanan","Eikev","Re'eh","Shoftim","Ki Teitzei","Ki Tavo","Nitzavim","Vayeilech","Ha'azinu","Vezot Habracha"]
};
let quillEditors = {};


// ════════════════════════════════════════════════════════
// ADMIN LOGIN (Hardcoded Password, No Auth)
// ════════════════════════════════════════════════════════



// ── Admin Tab Switching ──
function switchAdminTab(tab) {
  ['articles','hero','dashboard'].forEach(function(t) {
    const btn = document.getElementById('atab-' + t);
    if (btn) btn.classList.toggle('active', t === tab);
  });
  const artPanel  = document.getElementById('admin-articles-panel');
  const heroPanel = document.getElementById('admin-hero-panel');
  const dashPanel = document.getElementById('admin-dashboard-panel');
  if (artPanel)  artPanel.style.display  = tab === 'articles'  ? 'block' : 'none';
  if (heroPanel) heroPanel.style.display = tab === 'hero'      ? 'block' : 'none';
  if (dashPanel) dashPanel.style.display = tab === 'dashboard' ? 'block' : 'none';
  const stickyBar = document.getElementById('admin-sticky-bar');
  if (stickyBar) stickyBar.style.display = tab === 'articles' ? 'flex' : 'none';
  if (tab === 'dashboard') dashboardLoad();
  if (tab === 'hero') heroLoadSlides();
}

// ── Hero Slides (Firestore) ──
var _heroSlideDefaults = {
  'q1-de': 'Wir sind, was wir täglich tun. Exzellenz ist keine Handlung, sondern eine Gewohnheit.',
  'c1-all': 'Rabbiner Elishai Zizov',
  'q2-de': 'Das Studium der Tora ist mehr wert als alle anderen Gebote zusammen.',
  'c2-all': 'Talmud Bavli',
  'q3-de': 'Wer einen einzigen Menschen rettet, dem rechnet es die Schrift an, als hätte er eine ganze Welt gerettet.',
  'c3-all': 'Sanhedrin 37a',
};
function heroLoadSlides() {
  if (!window.firebase || !firebase.firestore) return;
  firebase.firestore().collection('heroSlides').doc('config').get().then(function(doc) {
    if (!doc.exists) return;
    var d = doc.data();
    ['q1-de','q1-he','q1-en','c1-de','c1-he','c1-en',
     'q2-de','q2-he','q2-en','c2-de','c2-he','c2-en',
     'q3-de','q3-he','q3-en','c3-de','c3-he','c3-en'].forEach(function(k) {
      var el = document.getElementById('hero-' + k);
      if (el && d[k] !== undefined) el.value = d[k];
    });
    [1,2,3].forEach(function(n) {
      var imgEl = document.getElementById('hero-img' + n);
      if (imgEl && d['img' + n]) { imgEl.value = d['img' + n]; updateHeroImagePreview(n, d['img' + n]); }
    });
  }).catch(function(e) { console.warn('heroLoadSlides', e); });
}
function heroSaveSlides() {
  var msgEl = document.getElementById('hero-save-msg');
  if (!window.firebase || !firebase.firestore) {
    if (msgEl) { msgEl.textContent = '⚠ Firebase nicht verfügbar.'; msgEl.style.display = 'block'; }
    return;
  }
  var data = {};
  ['q1-de','q1-he','q1-en','c1-de','c1-he','c1-en',
   'q2-de','q2-he','q2-en','c2-de','c2-he','c2-en',
   'q3-de','q3-he','q3-en','c3-de','c3-he','c3-en'].forEach(function(k) {
    var el = document.getElementById('hero-' + k);
    if (el) data[k] = el.value.trim();
  });
  [1,2,3].forEach(function(n) {
    var imgEl = document.getElementById('hero-img' + n);
    if (imgEl) data['img' + n] = imgEl.value;
  });
  data.updated_at = firebase.firestore.FieldValue.serverTimestamp();
  firebase.firestore().collection('heroSlides').doc('config').set(data).then(function() {
    if (msgEl) { msgEl.textContent = '✓ Gespeichert!'; msgEl.style.display = 'block'; setTimeout(function() { msgEl.style.display = 'none'; }, 3000); }
  }).catch(function(e) {
    if (msgEl) { msgEl.textContent = '✗ Fehler: ' + e.message; msgEl.style.display = 'block'; }
  });
}

function updateHeroImagePreview(n, url) {
  var wrap = document.getElementById('hero-img' + n + '-preview');
  var img  = document.getElementById('hero-img' + n + '-preview-img');
  if (wrap && img) {
    if (url && url.length > 10) { img.src = url; wrap.style.display = 'block'; }
    else { wrap.style.display = 'none'; img.src = ''; }
  }
}
function clearHeroImage(n) {
  var imgEl = document.getElementById('hero-img' + n);
  if (imgEl) imgEl.value = '';
  updateHeroImagePreview(n, '');
  var st = document.getElementById('hero-img' + n + '-status');
  if (st) st.style.display = 'none';
}
async function uploadHeroImage(n, input) {
  const file = input.files[0];
  if (!file) return;
  const status = document.getElementById('hero-img' + n + '-status');
  const imgEl  = document.getElementById('hero-img' + n);
  if (status) { status.style.display = 'block'; status.textContent = 'Bild wird vorbereitet...'; status.style.color = '#b8952a'; }
  try {
    const blob = await compressHeroImageToBlob(file);
    if (!window.firebase || !storage) throw new Error('Storage nicht verfügbar');
    if (status) status.textContent = 'Wird hochgeladen...';
    const ref = storage.ref().child('hero/slide' + n + '.jpg');
    const snap = await ref.put(blob, { contentType: 'image/jpeg' });
    const url = await snap.ref.getDownloadURL();
    if (imgEl) imgEl.value = url;
    updateHeroImagePreview(n, url);
    if (status) { status.textContent = '✓ Hochgeladen!'; status.style.color = 'green'; }
  } catch(err) {
    if (status) { status.textContent = '❌ Fehler: ' + err.message; status.style.color = 'red'; }
  }
}
function compressHeroImageToBlob(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function(e) {
      const img = new Image();
      img.onerror = reject;
      img.onload = function() {
        const TW = 1400, TH = 600;
        const srcAR = img.width / img.height, tgtAR = TW / TH;
        let sx, sy, sw, sh;
        if (srcAR > tgtAR) { sh = img.height; sw = sh * tgtAR; sy = 0; sx = (img.width - sw) / 2; }
        else { sw = img.width; sh = sw / tgtAR; sx = 0; sy = (img.height - sh) / 2; }
        const canvas = document.createElement('canvas');
        canvas.width = TW; canvas.height = TH;
        canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, TW, TH);
        canvas.toBlob(function(b) { resolve(b); }, 'image/jpeg', 0.78);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Dashboard ──
function dashboardLoad() {
  var recentEl = document.getElementById('dashboard-recent');
  var artNumEl = document.getElementById('stat-articles-num');
  var nlNumEl  = document.getElementById('stat-nl-num');
  if (!window.firebase || !firebase.firestore) {
    if (recentEl) recentEl.textContent = 'Firebase nicht verbunden.';
    return;
  }
  // Article count
  var arts = window._articles || [];
  if (artNumEl) artNumEl.textContent = arts.length || '—';
  // Newsletter count
  firebase.firestore().collection('newsletterSubscribers').where('is_active','==',true).get().then(function(snap) {
    if (nlNumEl) nlNumEl.textContent = snap.size;
  }).catch(function() { if (nlNumEl) nlNumEl.textContent = '—'; });
  // Recent articles
  if (recentEl && arts.length > 0) {
    var recent = arts.slice(0, 5);
    recentEl.innerHTML = recent.map(function(a) {
      var t = (a.translations && a.translations.de) ? a.translations.de.title : (a.title || '–');
      var cat = a.parasha ? ('Parascha: ' + a.parasha) : (a.hag ? ('Feiertag: ' + a.hag) : '');
      return '<div style="padding:8px 0;border-bottom:1px solid #f0ede8;display:flex;justify-content:space-between;align-items:center;gap:12px;">' +
        '<span style="font-size:13px;color:#333;font-family:serif;">' + t + '</span>' +
        '<span style="font-size:10px;color:#bbb;letter-spacing:.08em;white-space:nowrap;">' + (a.date || '') + '</span>' +
        '</div>';
    }).join('');
  } else if (recentEl) {
    recentEl.textContent = 'Keine Artikel gefunden.';
  }
}
function toggleAdmin() {
  document.getElementById('admin-overlay').classList.toggle('open');
}


function adminLogin() {
  try {
  const pw = (document.getElementById('admin-pw') || {}).value || '';
  const trimmed = pw.trim();
  const err = document.getElementById('admin-login-err');
  if (err) err.style.display = 'none';

  if (!trimmed) {
    if (err) { err.textContent = 'Bitte Passwort eingeben.'; err.style.display = 'block'; }
    return;
  }

  if (checkToken(trimmed)) {
    document.getElementById('admin-pw').value = '';
    // Sign in to Firebase Auth so Firestore/Storage security rules see request.auth != null
    const doOpen = function() {
      document.getElementById('admin-login-screen').style.display = 'none';
      document.getElementById('admin-content').style.display = 'block';
      document.getElementById('admin-sticky-bar').style.display = 'flex';
      initQuillEditors();
      adminUpdateParasha();
      setTodayDate();
      setupDraftAutoSave();
      updateStickyLangs();
      const restored = restoreDraft();
      if (restored) { setTimeout(() => showToast('📋 Entwurf wiederhergestellt', 'info'), 400); }
      renderAdminList();
      checkGitHubTokenSetup();
      const tabBar = document.getElementById('admin-tab-bar');
      if (tabBar) tabBar.style.display = 'flex';
      switchAdminTab('articles');
      setTimeout(() => document.getElementById('af-title-de')?.focus(), 300);
    };
    if (auth) {
      auth.signInAnonymously().then(doOpen).catch(function(e) {
        console.warn('Firebase anonymous sign-in failed, continuing without auth:', e);
        doOpen();
      });
    } else {
      doOpen();
    }
  } else {
    if (err) { err.textContent = 'Falsches Passwort.'; err.style.display = 'block'; }
  }
  } catch(e) {
    const err2 = document.getElementById('admin-login-err');
    if (err2) { err2.textContent = 'Fehler: ' + e.message; err2.style.display = 'block'; }
    console.error('adminLogin error:', e);
  }
}



function adminPreview() {
  var isHag = (document.getElementById('af-cat')||{}).value === 'hag';
  var dv = (document.getElementById('af-date-input')||{}).value;
  var mock = {
    id: '_preview',
    title: (document.getElementById('af-title-de')||{}).value || '(Kein Titel)',
    date: dv ? new Date(dv).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE'),
    parasha: isHag ? '' : ((document.getElementById('af-parasha')||{}).value||''),
    hag: isHag ? ((document.getElementById('af-hag-name')||{}).value||'') : '',
    image: (document.getElementById('af-image')||{}).value||'',
    text: quillEditors.de ? quillEditors.de.root.innerHTML : '',
    translations: {
      de: { title: (document.getElementById('af-title-de')||{}).value||'', text: quillEditors.de ? quillEditors.de.root.innerHTML : '' },
      he: { title: (document.getElementById('af-title-he')||{}).value||'', text: quillEditors.he ? quillEditors.he.root.innerHTML : '' },
      en: { title: (document.getElementById('af-title-en')||{}).value||'', text: quillEditors.en ? quillEditors.en.root.innerHTML : '' }
    }
  };
  window._currentArticle = mock;
  window._previewMode = true;
  document.getElementById('admin-overlay').classList.remove('open');
  _renderArticlePage(mock, currentLang);
  const _ph = document.querySelector('.page-band'); if (_ph) _ph.style.display = 'none';
  document.querySelector('.page-body').style.display = 'none';
  const _sf = document.querySelector('.main-footer'); if (_sf) _sf.style.display = 'none';
  document.getElementById('article-page').style.display = 'block';
  document.getElementById('lang-back-btn').style.display = 'inline-flex';
  var banner = document.getElementById('admin-preview-notice');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'admin-preview-notice';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#b8952a;color:#fff;text-align:center;padding:9px 16px;font-size:11px;font-family:Raleway,sans-serif;font-weight:700;letter-spacing:0.15em;z-index:9999;text-transform:uppercase;';
    banner.textContent = '— Vorschau — Nicht veröffentlicht —';
    document.body.appendChild(banner);
  } else {
    banner.style.display = 'block';
  }
  window.scrollTo(0, 0);
}

function adminLogout() {
  document.getElementById('admin-login-screen').style.display = 'block';
  document.getElementById('admin-content').style.display = 'none';
  document.getElementById('admin-sticky-bar').style.display = 'none';
  const tb = document.getElementById('admin-tab-bar');
  if (tb) tb.style.display = 'none';
  document.getElementById('admin-pw').value = '';
}




// ════════════════════════════════════════════════════════
// IMAGE UPLOAD
// ════════════════════════════════════════════════════════
function updateImagePreview(url) {
  const wrap = document.getElementById('af-image-preview');
  const img  = document.getElementById('af-image-preview-img');
  if (url) { img.src = url; wrap.style.display = 'block'; }
  else { wrap.style.display = 'none'; img.src = ''; }
}

function clearImageUpload() {
  document.getElementById('af-image').value = '';
  updateImagePreview('');
  const status = document.getElementById('upload-status');
  status.style.display = 'none';
}

async function uploadImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const status = document.getElementById('upload-status');
  const urlInput = document.getElementById('af-image');

  status.style.display = 'block';
  status.textContent = 'Bild wird verarbeitet...';
  status.style.color = '#b8952a';

  try {
    const base64 = await compressImageToBase64(file);
    urlInput.value = base64;
    updateImagePreview(base64);
    status.textContent = '✓ Bild erfolgreich hochgeladen!';
    status.style.color = 'green';
  } catch (err) {
    console.error(err);
    status.textContent = '❌ Upload fehlgeschlagen: ' + err.message;
    status.style.color = 'red';
  }
}

function compressImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX_W = 900;
        let w = img.width, h = img.height;
        if (w > MAX_W) { h = Math.round(h * MAX_W / w); w = MAX_W; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function initQuillEditors() {
  if (quillEditors.de) return;
  ['de','he','en'].forEach(l => {
    const el = document.getElementById('q-'+l);
    if (!el) return;
    // Editors are already contenteditable in HTML — just wire up the wrapper object
    quillEditors[l] = {
      root: el,
      _cb: [],
      on(ev, fn) { if (ev === 'text-change') this._cb.push(fn); },
      getText() { const d = document.createElement('div'); d.innerHTML = el.innerHTML; return d.textContent||''; },
      setText(t) { el.innerHTML = t || ''; }
    };
    el.addEventListener('input', () => quillEditors[l]._cb.forEach(fn => fn()));
    quillEditors[l].on('text-change', () => updateWordCount(l));
  });
}

function adminToggleCat() {
  const isHag = document.getElementById('af-cat').value === 'hag';
  document.getElementById('af-book-wrap').style.display    = isHag ? 'none' : '';
  document.getElementById('af-parasha-wrap').style.display = isHag ? 'none' : '';
  document.getElementById('af-hag-wrap').style.display     = isHag ? '' : 'none';
}

function adminUpdateParasha() {
  const book = document.getElementById('af-book') ? document.getElementById('af-book').value : 'Bereshit';
  const keys = PARASHA_MAP[book] || [];
  const displayNames = (TORAH[book] && TORAH[book].de_display) ? TORAH[book].de_display : keys;
  document.getElementById('af-parasha').innerHTML =
    keys.map((p, i) => `<option value="${p}">${displayNames[i] || p}</option>`).join('');
}

async function adminSave() {
  if (!db) { showToast('✗ Firebase nicht verfügbar!', 'error'); return; }
  const msg = document.getElementById('admin-msg');
  const titleDE = document.getElementById('af-title-de').value.trim();
  if (!titleDE) { showToast('⚠ Kein deutscher Titel!', 'error'); return; }
  const btn = document.getElementById('admin-publish-btn');
  if (btn) { btn.classList.add('loading'); btn.disabled = true; }
  msg.textContent = 'Speichere…';
  const isHag = document.getElementById('af-cat').value === 'hag';
  const dv    = document.getElementById('af-date-input').value;
  const docData = {
    book: isHag ? '' : document.getElementById('af-book').value,
    parasha: isHag ? '' : document.getElementById('af-parasha').value,
    hag: isHag ? document.getElementById('af-hag-name').value.trim() : '',
    date: dv ? new Date(dv).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE'),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    image: document.getElementById('af-image').value.trim(),
    title: titleDE,
    text: quillEditors.de ? quillEditors.de.root.innerHTML : '',
    translations: {
      de: { title: titleDE,                                              text: quillEditors.de?.root.innerHTML||'' },
      he: { title: document.getElementById('af-title-he').value.trim(), text: quillEditors.he?.root.innerHTML||'' },
      en: { title: document.getElementById('af-title-en').value.trim(), text: quillEditors.en?.root.innerHTML||'' }
    }
  };
  try {
    if (window._editingId) {
      await db.collection('articles').doc(window._editingId).update(docData);
      // Update local cache immediately
      const idx = window._articles.findIndex(a => a.id === window._editingId);
      if (idx !== -1) window._articles[idx] = { id: window._editingId, ...docData, createdAt: window._articles[idx].createdAt };
      const updatedArticle = idx !== -1 ? window._articles[idx] : { id: window._editingId, ...docData };
      document.getElementById('admin-edit-banner').style.display = 'none';
      window._editingId = null;
      document.getElementById('admin-cancel-btn').style.display = 'none';
      clearDraft();
      updateSitemapOnGitHub(updatedArticle);
      showToast('✓ Artikel aktualisiert!', 'success');
      msg.textContent = '';
    } else {
      const ref = await db.collection('articles').add(docData);
      clearDraft();
      // Add to local cache immediately so the article is visible right away
      const newArticle = { id: ref.id, ...docData, createdAt: { seconds: Date.now()/1000 } };
      window._articles.unshift(newArticle);
      updateSitemapOnGitHub(newArticle);
      showToast('✓ Artikel veröffentlicht!', 'success');
      msg.textContent = '';
    }
    adminClearForm();
    renderBooks(); renderHagim(); renderLatestArticle();
    renderAdminList();
    // Reload from server in background to sync — silent=true prevents error banner
    loadArticles(true).catch(e => console.warn('Background reload failed:', e));
  } catch(e) {
    showToast('✗ Fehler: ' + e.message, 'error');
    console.error(e);
  } finally {
    if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
  }
}

function switchLangTab(lang) {
  document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.lang-panel').forEach(p => p.style.display = 'none');
  document.querySelector(`.lang-tab[data-lang="${lang}"]`).classList.add('active');
  document.getElementById('lpanel-' + lang).style.display = 'block';
  // RTL for Hebrew editor
  const heEditor = document.querySelector('#q-he .ql-editor');
  if (heEditor) { heEditor.style.direction = 'rtl'; heEditor.style.textAlign = 'right'; }
}

function updateTabIndicator(lang) {
  const title = document.getElementById('af-title-' + lang);
  const tab = document.querySelector(`.lang-tab[data-lang="${lang}"]`);
  if (!title || !tab) return;
  tab.classList.toggle('has-content', title.value.trim().length > 0);
  updateLangProgress();
}

function updateAllTabIndicators() {
  ['de','he','en'].forEach(updateTabIndicator);
}

function updateLangProgress() {
  let count = 0;
  ['de','he','en'].forEach(l => {
    if ((document.getElementById('af-title-'+l)?.value||'').trim()) count++;
  });
  const el = document.getElementById('lang-progress-count');
  if (!el) return;
  el.textContent = count + ' / 3';
  el.className = 'lang-progress-count' + (count === 3 ? ' complete' : count > 0 ? ' partial' : '');
  updateStickyLangs();
}

function copyTitleFromDE(lang) {
  const de = document.getElementById('af-title-de')?.value || '';
  const el = document.getElementById('af-title-' + lang);
  if (el && de) { el.value = de; updateTabIndicator(lang); }
}

let _draftTimer = null;
function saveDraft() {
  const data = {
    titles: {}, texts: {},
    cat: document.getElementById('af-cat')?.value||'parasha',
    book: document.getElementById('af-book')?.value||'Bereshit',
    parasha: document.getElementById('af-parasha')?.value||'',
    hag: document.getElementById('af-hag-name')?.value||'',
    date: document.getElementById('af-date-input')?.value||'',
    image: document.getElementById('af-image')?.value||''
  };
  ['de','he','en'].forEach(l => {
    data.titles[l] = document.getElementById('af-title-'+l)?.value||'';
    data.texts[l] = quillEditors[l]?.root.innerHTML||'';
  });
  if (!data.titles.de && !data.texts.de) return;
  try { localStorage.setItem('admin_draft', JSON.stringify(data)); } catch(e) {}
  const badge = document.getElementById('admin-draft-badge');
  if (badge) {
    badge.textContent = '✓ Entwurf gespeichert';
    badge.classList.add('visible');
    clearTimeout(window._draftBadgeTimer);
    window._draftBadgeTimer = setTimeout(()=>badge.classList.remove('visible'), 3000);
  }
}

function clearDraft() {
  try { localStorage.removeItem('admin_draft'); } catch(e) {}
}

function restoreDraft() {
  try {
    const raw = localStorage.getItem('admin_draft');
    if (!raw) return false;
    const d = JSON.parse(raw);
    if (!d.titles?.de) return false;
    ['de','he','en'].forEach(l => {
      const el = document.getElementById('af-title-'+l);
      if (el && d.titles[l]) el.value = d.titles[l];
      if (quillEditors[l] && d.texts[l]) quillEditors[l].root.innerHTML = d.texts[l];
    });
    if (d.cat) { document.getElementById('af-cat').value = d.cat; adminToggleCat(); }
    if (d.book) { document.getElementById('af-book').value = d.book; adminUpdateParasha(); }
    if (d.parasha) setTimeout(()=>{ document.getElementById('af-parasha').value = d.parasha; }, 60);
    if (d.hag) document.getElementById('af-hag-name').value = d.hag;
    if (d.date) document.getElementById('af-date-input').value = d.date;
    else setTodayDate();
    if (d.image) { document.getElementById('af-image').value = d.image; updateImagePreview(d.image); }
    updateAllTabIndicators();
    return true;
  } catch(e) { return false; }
}

function setupDraftAutoSave() {
  const debounced = () => { clearTimeout(_draftTimer); _draftTimer = setTimeout(saveDraft, 1500); };
  ['de','he','en'].forEach(l => {
    const el = document.getElementById('af-title-'+l);
    if (el) el.addEventListener('input', debounced);
    if (quillEditors[l]) quillEditors[l].on('text-change', debounced);
  });
  ['af-cat','af-book','af-parasha','af-hag-name','af-date-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', debounced);
  });
}

function setTodayDate() {
  const di = document.getElementById('af-date-input');
  if (di) di.valueAsDate = new Date();
}

function adminFilterList(query) {
  const q = (query||'').trim().toLowerCase();
  document.querySelectorAll('#admin-art-list .admin-art-item').forEach(el => {
    const title = (el.dataset.title||'');
    el.style.display = (!q || title.includes(q)) ? '' : 'none';
  });
}

// ── TOAST ──
function showToast(msg, type='success') {
  const t = document.getElementById('admin-toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'admin-toast visible ' + type;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { t.className = 'admin-toast'; }, 3500);
}

// ── FULLSCREEN EDITOR ──
function toggleFullscreenEditor(lang) {
  const wrap = document.getElementById('qwrap-' + lang);
  if (!wrap) return;
  const isFs = wrap.classList.toggle('fullscreen');
  const btn = wrap.querySelector('.ql-fullscreen-btn');
  if (btn) { btn.textContent = isFs ? '⤡' : '⤢'; btn.title = isFs ? 'Vollbild beenden (ESC)' : 'Vollbild'; }
  document.body.style.overflow = isFs ? 'hidden' : '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const fs = document.querySelector('.quill-wrapper.fullscreen');
    if (fs) { const lang = fs.id.replace('qwrap-',''); toggleFullscreenEditor(lang); }
  }
});

// ── WORD COUNT ──
function updateWordCount(lang) {
  const q = quillEditors[lang];
  const el = document.getElementById('wc-' + lang);
  if (!q || !el) return;
  const text = q.getText().trim();
  const words = text ? text.split(/\s+/).filter(w => w).length : 0;
  el.textContent = words.toLocaleString() + ' Wörter';
}

// ── STICKY LANG PILLS ──
const LANG_META = [
  {code:'de',flag:'🇩🇪'},{code:'he',flag:'🇮🇱'},{code:'en',flag:'🇬🇧'}
];
function updateStickyLangs() {
  const el = document.getElementById('admin-sticky-langs');
  if (!el) return;
  el.innerHTML = LANG_META.map(l => {
    const has = (document.getElementById('af-title-'+l.code)?.value||'').trim().length > 0;
    return `<span class="admin-lang-pill ${has?'done':''}">${l.flag} ${l.code.toUpperCase()} ${has?'✓':'·'}</span>`;
  }).join('');
}

function adminClearForm() {
  ['af-title-de','af-title-he','af-title-en','af-image','af-hag-name']
    .forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  ['de','he','en'].forEach(l => { if(quillEditors[l]) quillEditors[l].setText(''); });
  ['de','he','en'].forEach(updateWordCount);
  updateImagePreview('');
  const status = document.getElementById('upload-status');
  if (status) status.style.display = 'none';
  setTodayDate();
  clearDraft();
  switchLangTab('de');
  updateAllTabIndicators();
}

function adminCancelEdit() {
  window._editingId = null;
  document.getElementById('admin-cancel-btn').style.display = 'none';
  document.getElementById('admin-msg').textContent = '';
  const banner = document.getElementById('admin-edit-banner');
  if (banner) banner.style.display = 'none';
  adminClearForm();
}

async function adminEdit(id) {
  window._editingId = id;
  const a = window._articles.find(x => x.id === id);
  if (!a) return;
  const banner = document.getElementById('admin-edit-banner');
  const label = document.getElementById('admin-edit-title-label');
  if (banner && label) { label.textContent = a.title||id; banner.style.display = 'flex'; }
  document.getElementById('admin-cancel-btn').style.display = 'inline-flex';
  if (!quillEditors.de) { initQuillEditors(); }
  ['de','he','en'].forEach(l => {
    const tr = (a.translations&&a.translations[l]) ? a.translations[l] : {};
    const el = document.getElementById('af-title-'+l);
    if (el) el.value = tr.title||(l==='de'?a.title:'')||'';
    if (quillEditors[l]) quillEditors[l].root.innerHTML = tr.text||(l==='de'?a.text:'')||'';
  });
  document.getElementById('af-image').value = a.image||'';
  updateImagePreview(a.image||'');
  if (a.book) {
    document.getElementById('af-cat').value = 'parasha'; adminToggleCat();
    document.getElementById('af-book').value = a.book; adminUpdateParasha();
    setTimeout(()=>{ document.getElementById('af-parasha').value = a.parasha; }, 50);
  } else if (a.hag) {
    document.getElementById('af-cat').value = 'hag'; adminToggleCat();
    document.getElementById('af-hag-name').value = a.hag;
  }
  switchLangTab('de');
  updateAllTabIndicators();
  ['de','he','en'].forEach(updateWordCount);
  document.querySelector('.admin-body').scrollTo(0,0);
}

async function adminDelete(id) {
  if (!confirm('Diesen Artikel wirklich löschen?')) return;
  try {
    await db.collection('articles').doc(id).delete();
    await loadArticles(); renderAdminList();
  } catch(e) { alert('Error: '+e.message); }
}


function renderAdminList() {
  const el = document.getElementById('admin-art-list');
  if (!el) return;
  if (!window._articles.length) { el.innerHTML='<p style="color:#bbb; font-style:italic; font-size:13px;">Noch keine Artikel veröffentlicht.</p>'; return; }
  el.innerHTML = window._articles.map(a=>{
    const meta = [a.date, a.parasha||a.hag].filter(Boolean).join(' · ');
    return `<div class="admin-art-item" data-title="${(a.title||'').toLowerCase()}">
      <div class="admin-art-info">
        <div class="admin-art-title">${a.title||a.id}</div>
        ${meta ? `<div class="admin-art-meta">${meta}</div>` : ''}
      </div>
      <div class="admin-art-actions">
        <button class="edit-btn" onclick="adminEdit('${a.id}')">✏ EDIT</button>
        <button class="del-btn" onclick="adminDelete('${a.id}')">✕ DEL</button>
      </div>
    </div>`;
  }).join('');
}
// Load fresh articles from Firestore (updates with images + any new articles)
loadArticles();
window.addEventListener('beforeunload', e => {
  const content = document.getElementById('admin-content');
  if (content && content.style.display !== 'none') {
    const hasContent = (document.getElementById('af-title-de')?.value || '').trim();
    if (hasContent) { e.preventDefault(); e.returnValue = ''; }
  }
});




// ════════════════════════════════════════════════════════
// GITHUB SITEMAP + STATIC SEO PAGES AUTO-UPDATE
// ════════════════════════════════════════════════════════
var GITHUB_REPO = 'elishaizizov-web/elishaizizov-web.github.io';
var SITEMAP_PATH = 'sitemap.xml';

async function saveGitHubToken() {
  var input = document.getElementById('admin-gh-token-input');
  var status = document.getElementById('admin-gh-token-status');
  var token = (input ? input.value : '').trim();
  if (!token.startsWith('ghp_')) { status.textContent = '\u2717 Ung\xfcltiges Token-Format'; status.style.color='#c00'; return; }
  try {
    await db.collection('settings').doc('github').set({ token: token });
    status.textContent = '\u2713 Token gespeichert!'; status.style.color='green';
    input.value = '';
  } catch(e) { status.textContent = '\u2717 Fehler: ' + e.message; status.style.color='#c00'; }
}

async function getGitHubToken() {
  try {
    var doc = await db.collection('settings').doc('github').get();
    return doc.exists ? doc.data().token : null;
  } catch(e) { return null; }
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function generateSitemapXml(articles) {
  var today = new Date().toISOString().split('T')[0];
  var langs = ['de','he','en','fr','es','ru'];
  var urls = '  <url><loc>https://elishaizizov.com/</loc><lastmod>' + today + '</lastmod><priority>1.0</priority></url>\n';
  articles.forEach(function(a) {
    var slug = articleSlug(a);
    if (!slug) return;
    langs.forEach(function(lang) {
      var loc = lang === 'de' ? 'https://elishaizizov.com/' + slug : 'https://elishaizizov.com/' + slug + '?lang=' + lang;
      var prio = lang === 'de' ? '0.8' : '0.6';
      urls += '  <url><loc>' + loc + '</loc><lastmod>' + today + '</lastmod><priority>' + prio + '</priority></url>\n';
    });
  });
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '</urlset>';
}

function generateArticleStaticPage(a, lang) {
  var langs = ['de','he','en','fr','es','ru'];
  var langLabels = { de:'Deutsch', he:'\u05e2\u05d1\u05e8\u05d9\u05ea', en:'English', fr:'Fran\xe7ais', es:'Espa\xf1ol', ru:'\u0420\u0443\u0441\u0441\u043a\u0438\u0439' };
  var openLabel = { de:'Vollst\xe4ndigen Artikel lesen', he:'\u05dc\u05e7\u05e8\u05d9\u05d0\u05ea \u05d4\u05de\u05d0\u05de\u05e8 \u05d4\u05de\u05dc\u05d0', en:'Read full article', fr:"Lire l'article complet", es:'Leer art\xedculo completo', ru:'\u0427\u0438\u0442\u0430\u0442\u044c \u043f\u043e\u043b\u043d\u043e\u0441\u0442\u044c\u044e' };
  var tr = (a.translations && a.translations[lang]) ? a.translations[lang] : { title: a.title || '', text: a.text || '' };
  var title = (tr.title || a.title || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  if (!title) return null;
  var isRTL = (lang === 'he');
  var dir = isRTL ? 'rtl' : 'ltr';
  var textRaw = stripHtml(tr.text || a.text || '');
  var excerpt = textRaw.slice(0, 220).replace(/</g,'&lt;').replace(/>/g,'&gt;');
  var fullText = (tr.text || a.text || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  var slug = articleSlug(a);
  var canonical = lang === 'de' ? 'https://elishaizizov.com/' + slug : 'https://elishaizizov.com/' + slug + '-' + lang;
  var parasha = a.hag ? a.hag : (a.parasha ? a.parasha : '');
  var imgTag = a.image ? '<img src="' + a.image + '" style="width:100%;max-height:320px;object-fit:cover;border-radius:8px;margin-bottom:24px;" alt="' + title + '">' : '';
  var parashaDiv = parasha ? '<div class="eyebrow">' + parasha + '</div>' : '';
  var dateDiv = a.date ? '<div class="meta">' + a.date + '</div>' : '';
  var btnLabel = openLabel[lang] || 'Read full article';
  var btnHref = lang === 'de' ? '/' + slug : '/' + slug + '-' + lang;
  var langBar = langs.map(function(l) {
    var lUrl = l === 'de' ? '/' + slug : '/' + slug + '-' + l;
    var style = l === lang ? 'color:#b8952a;text-decoration:underline;font-weight:700;' : 'color:#b8952a;text-decoration:none;';
    return '<a href="' + lUrl + '" style="' + style + '">' + langLabels[l] + '</a>';
  }).join(' &nbsp;&middot;&nbsp; ');

  return '<!DOCTYPE html>\n'
    + '<html lang="' + lang + '" dir="' + dir + '">\n'
    + '<head>\n'
    + '<meta charset="UTF-8">\n'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
    + '<title>' + title + ' \u2014 Rabbiner Elishai Zizov</title>\n'
    + '<meta name="description" content="' + excerpt + '">\n'
    + '<link rel="canonical" href="' + canonical + '">\n'
    + '<meta property="og:title" content="' + title + '">\n'
    + '<meta property="og:description" content="' + excerpt + '">\n'
    + '<meta property="og:type" content="article">\n'
    + '<meta property="og:url" content="' + canonical + '">\n'
    + '<meta property="og:image" content="' + (a.image || 'https://elishaizizov.com/logo.png') + '">\n'
    + '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    + '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Raleway:wght@400;600&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&family=Frank+Ruhl+Libre:wght@700&display=swap" rel="stylesheet">\n'
    + '<style>\n'
    + '*{box-sizing:border-box;margin:0;padding:0}\n'
    + 'body{font-family:\'Source Serif 4\',Georgia,serif;color:#1a1a1a;background:#faf9f7;direction:' + dir + '}\n'
    + '.wrap{max-width:720px;margin:0 auto;padding:28px 20px 60px}\n'
    + '.top-bar{display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid #e5e7eb;margin-bottom:28px;flex-wrap:wrap;gap:8px}\n'
    + '.logo{height:44px;width:auto}\n'
    + '.open-btn{background:#1a2744;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-family:\'Raleway\',sans-serif;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block}\n'
    + '.open-btn:hover{background:#b8952a}\n'
    + '.eyebrow{font-family:\'Raleway\',sans-serif;font-size:10px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#b8952a;margin-bottom:10px}\n'
    + 'h1{font-family:\'Playfair Display\',serif;font-size:clamp(22px,5vw,34px);font-weight:700;line-height:1.25;color:#1a2744;margin-bottom:14px}\n'
    + '.meta{font-family:\'Raleway\',sans-serif;font-size:11px;color:#999;letter-spacing:.1em;text-transform:uppercase;margin-bottom:24px}\n'
    + '.article-body{font-size:16px;line-height:1.85;color:#444;font-weight:300}\n'
    + '.article-body p{margin-bottom:12px}\n'
    + '.lang-bar{margin-top:36px;padding-top:16px;border-top:1px solid #e5e7eb;font-family:\'Raleway\',sans-serif;font-size:12px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}\n'
    + '</style></head>\n'
    + '<body><div class="wrap">\n'
    + '<div class="top-bar">\n'
    + '  <a href="/"><img src="/logo.png" class="logo" alt="Rabbiner Elishai Zizov"></a>\n'
    + '  <a href="' + btnHref + '" class="open-btn" onclick="openFull(event,\'' + slug + '\',\'' + lang + '\')">' + btnLabel + ' \u2192</a>\n'
    + '</div>\n'
    + parashaDiv
    + '<h1>' + title + '</h1>\n'
    + dateDiv
    + imgTag
    + '<div class="article-body">' + fullText + '</div>\n'
    + '<div class="lang-bar">' + langBar + '</div>\n'
    + '</div>\n'
    + '<scr' + 'ipt>\n'
    + 'function openFull(e,slug,lang){\n'
    + '  e.preventDefault();\n'
    + '  if(lang&&lang!=="de") sessionStorage.setItem("redirect_lang",lang);\n'
    + '  sessionStorage.setItem("redirect_article",slug);\n'
    + '  window.location.href="/";\n'
    + '}\n'
    + '</scr' + 'ipt>\n'
    + '</body></html>';
}

async function pushFileToGitHub(path, content, message, headers) {
  var apiUrl = 'https://api.github.com/repos/' + GITHUB_REPO + '/contents/' + path;
  var sha = null;
  try {
    var r = await fetch(apiUrl, { headers: headers });
    if (r.ok) { var d = await r.json(); sha = d.sha; }
  } catch(e) {}
  var body = { message: message, content: btoa(unescape(encodeURIComponent(content))), branch: 'main' };
  if (sha) body.sha = sha;
  return fetch(apiUrl, { method: 'PUT', headers: headers, body: JSON.stringify(body) });
}

async function updateSitemapOnGitHub(article) {
  try {
    var token = await getGitHubToken();
    if (!token) return;
    var headers = { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' };
    // 1. Update sitemap.xml
    var xml = generateSitemapXml(window._articles || []);
    await pushFileToGitHub(SITEMAP_PATH, xml, 'Auto-update sitemap.xml', headers);
    // 2. Create static SEO pages for the article (all 6 languages)
    if (article) {
      var langs = ['de','he','en','fr','es','ru'];
      for (var i = 0; i < langs.length; i++) {
        var lang = langs[i];
        var html = generateArticleStaticPage(article, lang);
        if (!html) continue;
        var slug = articleSlug(article);
        var filePath = slug + (lang === 'de' ? '' : '-' + lang) + '/index.html';
        await pushFileToGitHub(filePath, html, 'SEO page: ' + slug + ' [' + lang + ']', headers);
      }
    }
    // 3. Ping search engines
    fetch('https://www.google.com/ping?sitemap=https://elishaizizov.com/sitemap.xml', { mode:'no-cors' }).catch(function(){});
    fetch('https://www.bing.com/ping?sitemap=https://elishaizizov.com/sitemap.xml', { mode:'no-cors' }).catch(function(){});
  } catch(e) { console.warn('Sitemap/SEO update failed:', e); }
}

async function checkGitHubTokenSetup() {
  var card = document.getElementById('admin-github-card');
  if (!card) return;
  var token = await getGitHubToken();
  card.style.display = token ? 'none' : 'block';
}

// ════════════════════════════════════════════════════════
// PDF DOWNLOAD — opens a print-ready window (handles all Unicode/German chars)
// ════════════════════════════════════════════════════════
function downloadArticlePDF() {
  const a = window._currentArticle;
  if (!a) return;
  const l = currentLang;
  const tr = (a.translations && a.translations[l]) ? a.translations[l] : { title: a.title || '', text: a.text || '' };
  const title = tr.title || a.title || '';
  const text  = tr.text  || a.text  || '';
  const isRTL = (l === 'he');
  const logoUrl = window.location.origin + '/logo.png';

  // Build drop cap for PDF
  let pdfText = text;
  if (isRTL) {
    pdfText = pdfText.replace(/^(\s*<p[^>]*>)(\s*)([^<\s])/, (m, tag, sp, ch) =>
      tag + sp + '<span class="drop-cap drop-cap-rtl">' + ch + '</span>');
  } else {
    pdfText = pdfText.replace(/^(\s*<p[^>]*>)(\s*)([^<\s])/, (m, tag, sp, ch) =>
      tag + sp + '<span class="drop-cap">' + ch + '</span>');
  }

  const pdfTopicLabel = a._parashaDisplay || '';
  const htmlStr = `<!DOCTYPE html><html lang="${l}" dir="${isRTL?'rtl':'ltr'}"><head>
<meta charset="UTF-8"><title>${title.replace(/</g,'&lt;')}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Raleway:wght@400;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&family=Frank+Ruhl+Libre:wght@700;900&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Source Serif 4',Georgia,serif;color:#1c1c1c;background:#fff;padding:20mm 24mm 18mm;font-size:${isRTL?'12.5':'11.5'}pt;line-height:${isRTL?'2.05':'1.85'};direction:${isRTL?'rtl':'ltr'}}
  /* ── header ── */
  .pdf-header{display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:28px;border-bottom:2px solid #1a2744}
  .pdf-header img{height:52px;width:auto}
  .pdf-header-right{text-align:right;font-family:'Raleway',sans-serif}
  .pdf-site{font-size:7.5pt;letter-spacing:.24em;text-transform:uppercase;color:#1a2744;font-weight:700}
  .pdf-date{font-size:7pt;color:#999;letter-spacing:.1em;margin-top:3px}
  /* ── topic / parasha ── */
  .pdf-topic{font-family:'Raleway',sans-serif;font-size:8pt;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#b8952a;margin-bottom:10px}
  /* ── title ── */
  h1{font-family:'Playfair Display',serif;font-size:${isRTL?'24':'22'}pt;font-weight:700;line-height:1.18;color:#1a2744;margin-bottom:16px}
  /* ── gold rule ── */
  .gold-rule{height:1px;background:linear-gradient(90deg,#b8952a 0%,rgba(184,149,42,.15) 100%);margin-bottom:24px;${isRTL?'background:linear-gradient(270deg,#b8952a 0%,rgba(184,149,42,.15) 100%)':''}}
  /* ── image ── */
  img.art-img{width:100%;max-height:220px;object-fit:cover;display:block;margin-bottom:24px;border-radius:1px}
  /* ── body text ── */
  p{margin-bottom:12px;font-weight:300;font-size:${isRTL?'12.5':'11.5'}pt;line-height:${isRTL?'2.05':'1.85'};text-align:justify}
  /* ── drop caps ── */
  .drop-cap{font-family:'Playfair Display',serif;font-size:5em;font-weight:700;color:#b8952a;float:left;line-height:0.7;margin:0.06em 0.1em 0 0;padding:0}
  .drop-cap-rtl{font-family:'Frank Ruhl Libre',serif;font-size:5em;font-weight:700;color:#b8952a;float:right;line-height:0.7;margin:0.06em 0 0 0.1em;padding:0}
  /* ── footer ── */
  .pdf-footer{margin-top:40px;padding-top:10px;border-top:1px solid #e0e0e0;display:flex;align-items:center;justify-content:space-between;font-family:'Raleway',sans-serif;font-size:7pt;color:#bbb;letter-spacing:.12em;text-transform:uppercase}
  @media print{body{padding:14mm 18mm}@page{size:A4;margin:0}}
</style></head><body>
<div class="pdf-header">
  <img src="${logoUrl}" crossorigin="anonymous" alt="Rabbiner Elishai Zizov">
  <div class="pdf-header-right">
    <div class="pdf-site">Rabbiner Elishai Zizov</div>
    ${a.date ? `<div class="pdf-date">${a.date}</div>` : ''}
  </div>
</div>
${pdfTopicLabel ? `<div class="pdf-topic">${pdfTopicLabel}</div>` : ''}
<h1>${title.replace(/</g,'&lt;')}</h1>
<div class="gold-rule"></div>
${a.image ? `<img class="art-img" src="${a.image}" crossorigin="anonymous">` : ''}
<div>${pdfText}</div>
<div class="pdf-footer">
  <span>elishaizizov.com</span>
  <span>Rabbiner Elishai Zizov</span>
</div>
<script>window.onload=function(){window.print();}<\/script>
</body></html>`;

  // Try popup (desktop/Android); fall back to srcdoc iframe for iOS Safari
  let opened = false;
  try {
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(htmlStr);
      w.document.close();
      opened = true;
    }
  } catch(e) {}

  if (!opened) {
    const frame = document.createElement('iframe');
    frame.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;border:none;';
    document.body.appendChild(frame);
    frame.srcdoc = htmlStr;
    frame.addEventListener('load', function() {
      frame.contentWindow.focus();
      frame.contentWindow.print();
      setTimeout(() => frame.remove(), 2000);
    });
  }
}

async function autoTranslateFree() { // placeholder — not used
  return;
  const deTitle = document.getElementById('af-title-de').value.trim();
  const deText  = quillEditors.de ? quillEditors.de.root.innerHTML : '';
  const keyInput = document.getElementById('deepl-key-input');
  const apiKey   = (keyInput.value || localStorage.getItem('deepl_key') || '').trim();

  if (!deTitle && (!deText || deText === '<p><br></p>')) {
    alert("Bitte schreiben Sie zuerst den Artikel auf Deutsch.");
    return;
  }
  if (!apiKey) {
    alert("Bitte DeepL API Key eingeben (kostenlos auf deepl.com/pro#developer).");
    keyInput.focus();
    return;
  }
  localStorage.setItem('deepl_key', apiKey);
  if (keyInput.value !== apiKey) keyInput.value = apiKey;

  const msg = document.getElementById('admin-msg');
  msg.textContent = 'Übersetze mit DeepL... Bitte warten...';

  const langs = [
    { id: 'en', code: 'EN-GB', name: 'Englisch'    },
    { id: 'fr', code: 'FR',    name: 'Französisch' },
    { id: 'es', code: 'ES',    name: 'Spanisch'    },
    { id: 'ru', code: 'RU',    name: 'Russisch'    }
  ];

  async function translateDeepL(text, targetLang) {
    if (!text || text === '<p><br></p>') return '';
    const res = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ text, source_lang: 'DE', target_lang: targetLang, tag_handling: 'html' })
    });
    if (!res.ok) {
      const err = await res.text().catch(() => res.status);
      throw new Error(`DeepL ${res.status}: ${err}`);
    }
    const data = await res.json();
    return data.translations[0].text;
  }

  try {
    for (const l of langs) {
      msg.textContent = `Übersetze ins ${l.name}...`;
      if (deTitle) {
        document.getElementById('af-title-' + l.id).value = await translateDeepL(deTitle, l.code);
      }
      if (deText && deText !== '<p><br></p>') {
        const translated = await translateDeepL(deText, l.code);
        if (quillEditors[l.id]) quillEditors[l.id].root.innerHTML = translated;
      }
    }
    msg.textContent = '✨ Übersetzung abgeschlossen! Bitte Ergebnis prüfen und auf "Artikel veröffentlichen" klicken.';
  } catch (error) {
    console.error(error);
    msg.textContent = `❌ Übersetzungsfehler: ${error.message}`;
  }
}
