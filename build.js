// Generates static HTML pages for each article.
// Sources: articles/data.json (primary) + Firestore REST API (fallback for older articles)
// Run: node build.js
// Vercel runs this automatically on every deploy (via vercel.json buildCommand)

const fs   = require('fs');
const path = require('path');
const https = require('https');

const FS_URL = 'https://firestore.googleapis.com/v1/projects/elishai-zizov/databases/(default)/documents/articles?pageSize=200&key=AIzaSyDmEpaog0ZVYI4ZU87IfcjiSbRizQITn5o';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

function parseFirestoreDoc(doc) {
  const f = doc.fields; if (!f) return null;
  const sv = v => (v && v.stringValue) ? v.stringValue : '';
  const iv = v => (v && v.integerValue) ? Number(v.integerValue) : 0;
  const tr = {};
  if (f.translations && f.translations.mapValue) {
    const langs = f.translations.mapValue.fields || {};
    Object.keys(langs).forEach(lang => {
      const lf = langs[lang].mapValue && langs[lang].mapValue.fields;
      if (lf) tr[lang] = { title: sv(lf.title), text: sv(lf.text) };
    });
  }
  let createdAt = null;
  if (f.createdAt && f.createdAt.timestampValue) {
    createdAt = { seconds: Math.floor(new Date(f.createdAt.timestampValue).getTime() / 1000) };
  } else if (f.createdAt && f.createdAt.mapValue && f.createdAt.mapValue.fields && f.createdAt.mapValue.fields.seconds) {
    createdAt = { seconds: iv(f.createdAt.mapValue.fields.seconds) };
  }
  return {
    id: (doc.name || '').split('/').pop(),
    title: sv(f.title), text: sv(f.text),
    date: sv(f.date), image: sv(f.image),
    book: sv(f.book), parasha: sv(f.parasha), hag: sv(f.hag),
    translations: tr, createdAt
  };
}

const SITE_URL   = 'https://elishaizizov.com';
const CSS_VER    = '33';
const FONTS_URL  = 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Source+Serif+4:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@400;500;600;700&family=Frank+Ruhl+Libre:wght@700;900&display=swap';

function stripHtml(html) {
  return html ? html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}
function esc(str) {
  return str ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';
}
function isoDate(createdAt) {
  if (!createdAt) return '';
  const s = createdAt.seconds || createdAt._seconds;
  return s ? new Date(s * 1000).toISOString().slice(0,10) : '';
}

function buildPage(article) {
  const tr   = article.translations || {};
  const langs = ['de','en','he'].filter(l => tr[l] && tr[l].title);
  if (!langs.length) return null;

  const def     = langs.includes('de') ? 'de' : langs[0];
  const title   = tr[def].title;
  const excerpt = stripHtml(tr[def].text || '').slice(0, 160);
  const slug    = article.id;
  const url     = `${SITE_URL}/articles/${slug}`;
  const date    = isoDate(article.createdAt);
  const cat     = article.parasha || article.hag || '';

  const titleBlocks = langs.map(l =>
    `<h1 id="ap-title" data-lang="${l}" style="display:${l===def?'block':'none'}">${esc(tr[l].title)}</h1>`
  ).join('\n    ');

  const textBlocks = langs.map(l => {
    const rtl = l === 'he';
    return `<div id="ap-text" class="${rtl?'ap-rtl':''}" data-lang="${l}" style="display:${l===def?'block':'none'};direction:${rtl?'rtl':'ltr'}">${tr[l].text||''}</div>`;
  }).join('\n    ');

  const langBtns = langs.map(l => {
    const lbl = {de:'DE',en:'EN',he:'עב'}[l];
    return `<button class="ap-lang-btn${l===def?' active':''}" onclick="switchLang('${l}')">${lbl}</button>`;
  }).join('');

  const mhLangs = ['de','en','he'].filter(l => langs.includes(l)).map(l => {
    const lbl = {de:'DE',en:'EN',he:'עב'}[l];
    return `<button class="lang-btn${l===def?' active':''}" id="lb-${l}" onclick="switchLang('${l}')">${lbl}</button>`;
  }).join('');

  const imgHtml = article.image
    ? `<div class="ap-img-wrap"><img id="ap-img" src="${esc(article.image)}" alt="${esc(title)}" loading="lazy"></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="${def}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Rabbiner Elishai Zizov</title>
<meta name="description" content="${esc(excerpt)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(excerpt)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/logo.png">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#1a2b4a">
<link rel="canonical" href="${url}">
${langs.map(l=>`<link rel="alternate" hreflang="${l}" href="${url}${l!=='de'?'?lang='+l:''}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="icon" type="image/png" href="/logo.png">
<link rel="apple-touch-icon" href="/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<link rel="stylesheet" href="/css/global.css?v=${CSS_VER}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":${JSON.stringify(title)},"description":${JSON.stringify(excerpt)},"author":{"@type":"Person","name":"Rabbiner Elishai Zizov","url":"${SITE_URL}"},"publisher":{"@type":"Organization","name":"Rabbiner Elishai Zizov","url":"${SITE_URL}","logo":{"@type":"ImageObject","url":"${SITE_URL}/logo.png"}}${date?`,"datePublished":"${date}"`:''},"url":"${url}"}
</script>
</head>
<body>
<header class="main-header" id="main-header">
  <div class="mh-inner">
    <button class="hamburger-btn" onclick="toggleMenu()" id="hamburger-btn" aria-label="Menu" aria-expanded="false" aria-controls="hmenu"><span></span><span></span><span></span></button>
    <a class="mh-logo" href="/"><img src="/logo.png" alt="Rabbiner Elishai Zizov" loading="lazy"></a>
    <nav class="mh-nav" aria-label="Main navigation">
      <a class="mh-nav-link" href="/">Biografie</a>
      <a class="mh-nav-link active" href="/articles.html">Beiträge</a>
      <a class="mh-nav-link" href="/contact.html">Anfragen</a>
    </nav>
    <div class="mh-langs">${mhLangs}</div>
    <a href="/articles.html" class="mh-back-btn" style="display:inline-flex;margin-left:auto;" aria-label="Zurück zu Beiträge">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </a>
  </div>
</header>

<div id="ap-progress"></div>
<div id="article-page" style="display:block; padding-top:56px;">
    ${cat?`<div id="ap-parasha">${esc(cat)}</div>`:''}
    <div class="ap-topbar">
      <div class="ap-lang-bar">${langBtns}</div>
      ${date?`<span id="ap-date">${date}</span>`:''}
    </div>
    ${titleBlocks}
    ${imgHtml}
    ${textBlocks}
    <div style="margin-top:48px;padding-top:24px;border-top:1px solid #e0ddd6;">
      <a href="/articles.html" style="font-family:Raleway,sans-serif;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#b8952a;text-decoration:none;">← Alle Beiträge</a>
    </div>
</div>

<footer class="main-footer">
  <div class="mf-bottom">
    <span class="mf-copy">© ${new Date().getFullYear()} Rabbiner Elishai Zizov &nbsp;·&nbsp; <a href="/articles.html" style="color:inherit;opacity:0.5;text-decoration:none;">Alle Beiträge</a></span>
  </div>
</footer>

<script>
var _langs = ${JSON.stringify(langs)};
var _cur = '${def}';

function switchLang(lang) {
  if (!_langs.includes(lang)) return;
  _cur = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach(function(el) {
    el.style.display = el.dataset.lang === lang ? 'block' : 'none';
  });
  document.querySelectorAll('.lang-btn,.ap-lang-btn').forEach(function(btn) {
    var map = {DE:'de',EN:'en','עב':'he'};
    btn.classList.toggle('active', map[btn.textContent.trim()] === lang);
  });
  if (lang === 'he') {
    document.getElementById('article-page').style.direction = 'rtl';
  } else {
    document.getElementById('article-page').style.direction = '';
  }
  history.replaceState({}, '', lang !== 'de' ? '?lang=' + lang : window.location.pathname);
}

(function() {
  var p = new URLSearchParams(window.location.search).get('lang');
  if (p && p !== _cur) switchLang(p);
})();

window.addEventListener('scroll', function() {
  var prog = document.getElementById('ap-progress');
  if (prog) {
    var d = document.documentElement;
    var pct = d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight);
    prog.style.width = (pct * 100) + '%';
    prog.classList.toggle('visible', pct > 0.01);
  }
  document.getElementById('main-header').classList.toggle('scrolled', window.scrollY > 10);
});
</script>
</body>
</html>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async function() {
  // 1. Load from data.json (primary — includes all admin-published articles)
  let ghArticles = [];
  try {
    ghArticles = JSON.parse(fs.readFileSync('./articles/data.json', 'utf-8'));
    if (!Array.isArray(ghArticles)) ghArticles = [];
    console.log(`data.json: ${ghArticles.length} article(s)`);
  } catch(e) {
    console.log('data.json not found or empty.');
  }

  // 2. Load from Firestore (catches older articles not yet in data.json)
  let fsArticles = [];
  try {
    const data = await httpsGet(FS_URL);
    fsArticles = (data.documents || []).map(parseFirestoreDoc).filter(Boolean);
    console.log(`Firestore: ${fsArticles.length} article(s)`);
  } catch(e) {
    console.log('Firestore fetch failed (continuing with data.json only):', e.message);
  }

  // 3. Merge: data.json takes priority, Firestore fills in any missing IDs
  const seen = new Set(ghArticles.map(a => a.id));
  const merged = [...ghArticles, ...fsArticles.filter(a => !seen.has(a.id))];
  console.log(`Total unique articles: ${merged.length}`);

  // 4. Generate a static page for each article
  let count = 0;
  for (const a of merged) {
    if (!a.id) continue;
    const html = buildPage(a);
    if (!html) { console.log(`  ⚠ skipped ${a.id} (no translations)`); continue; }
    const dir = path.join('articles', a.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
    console.log(`  ✓ /articles/${a.id}`);
    count++;
  }
  console.log(`Done. Generated ${count} page(s).`);
})();
