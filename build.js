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
const CSS_VER    = '46';
const FONTS_URL  = 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Source+Serif+4:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@400;500;600;700&family=Frank+Ruhl+Libre:wght@400;700;900&display=swap';

// Parasha key → German display name (matches generate-seo.js TORAH.de_display)
const PARASHA_DISPLAY = {
  Bereshit:'Bereschit',Noach:'Noach','Lech Lecha':'Lech Lecha',Vayera:'Wajera',
  'Chayei Sara':'Chajje Sara',Toldot:'Toldot',Vayetzei:'Wajeze',Vayishlach:'Wajischlach',
  Vayeshev:'Wajeschew',Miketz:'Mikez',Vayigash:'Wajiggasch',Vayechi:'Wajchi',
  Shemot:'Schemot',Vaera:'Waera',Bo:'Bo',Beshalach:'Beschallach',Yitro:'Jitro',
  Mishpatim:'Mischpatim',Teruma:'Teruma',Tetzaveh:'Tezawwe','Ki Tisa':'Ki Tissa',
  Vayakhel:'Wajakhel',Pekudei:'Pekude',
  Vayikra:'Wajikra',Tzav:'Zaw',Shemini:'Schemini',Tazria:'Tazria',Metzora:'Mezora',
  'Acharei Mot':'Achare Mot',Kedoshim:'Kedoschim',Emor:'Emor',Behar:'Behar',Bechukotai:'Bechukotai',
  Bamidbar:'Bamidbar',Nasso:'Nasso',"Beha'alotcha":'Beaalotcha',Shelach:'Schelach',
  Korach:'Korach',Chukat:'Chukkat',Balak:'Balak',Pinchas:'Pinchas',Matot:'Mattot',Masei:'Masse',
  Devarim:'Dewarim',Vaetchanan:'Waetchanan',Eikev:'Ekew',"Re'eh":'Ree',Shoftim:'Schoftim',
  'Ki Teitzei':'Ki Teze','Ki Tavo':'Ki Tawo',Nitzavim:'Nizawim',Vayeilech:'Wajelech',
  "Ha'azinu":'Haasinu','Vezot Habracha':'Wesot Habracha'
};

function articleSeoSlug(a) {
  const year = a.date ? a.date.split('.').pop().trim() : '';
  let rawName;
  if (a.parasha) {
    const combined = COMBINED_PARASHOT[a.parasha];
    rawName = combined ? combined.split(' ').map(p => PARASHA_DISPLAY[p] || p).join(' ') : (PARASHA_DISPLAY[a.parasha] || a.parasha);
  } else {
    rawName = a.hag || '';
  }
  if (!rawName || !year) return null;
  const name = rawName.toLowerCase()
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
    .replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  return `${name}-${year}`;
}

function stripHtml(html) {
  return html ? html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}
function esc(str) {
  return str ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';
}
function resolveArticleImage(article) {
  const img = article.image;
  if (!img) return SITE_URL + '/logo.png';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/')) return SITE_URL + img;
  if (img.startsWith('data:')) {
    const match = img.match(/^data:image\/(\w+);base64,(.+)$/s);
    if (!match) return SITE_URL + '/logo.png';
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const filename = article.id + '.' + ext;
    const imgDir = path.join(__dirname, 'articles', 'images');
    const imgPath = path.join(imgDir, filename);
    if (!fs.existsSync(imgPath)) {
      fs.mkdirSync(imgDir, { recursive: true });
      fs.writeFileSync(imgPath, Buffer.from(match[2], 'base64'));
    }
    return SITE_URL + '/articles/images/' + filename;
  }
  return SITE_URL + '/logo.png';
}
function isoDate(createdAt) {
  if (!createdAt) return '';
  const s = createdAt.seconds || createdAt._seconds;
  return s ? new Date(s * 1000).toISOString().slice(0,10) : '';
}
function displayDate(createdAt) {
  if (!createdAt) return '';
  const s = createdAt.seconds || createdAt._seconds;
  if (!s) return '';
  const d = new Date(s * 1000);
  return d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear();
}

function _remToHebrew(n) {
  const H = ['','ק','ר','ש','ת','תק','תר','תש','תת','תתק'];
  const T = ['','י','כ','ל','מ','נ','ס','ע','פ','צ'];
  const O = ['','א','ב','ג','ד','ה','ו','ז','ח','ט'];
  const h = Math.floor(n/100), t = Math.floor((n%100)/10), o = n%10;
  let r = (H[h]||'');
  if (t===1 && o===5) r += 'טו';
  else if (t===1 && o===6) r += 'טז';
  else r += (T[t]||'') + (O[o]||'');
  if (r.length > 1) r = r.slice(0,-1) + '״' + r.slice(-1);
  else if (r.length === 1) r += '׳';
  return r;
}
function hebrewYear(createdAt) {
  if (!createdAt) return '';
  const s = createdAt.seconds || createdAt._seconds;
  if (!s) return '';
  const d = new Date(s * 1000);
  const m = d.getMonth() + 1;
  const hy = (m >= 10 || (m === 9 && d.getDate() >= 10)) ? d.getFullYear() + 3761 : d.getFullYear() + 3760;
  const mil = Math.floor(hy / 1000);
  return ('אבגדהוזחט'[mil-1]||'') + '׳' + _remToHebrew(hy % 1000);
}
function hebrewYearNumeric(createdAt) {
  if (!createdAt) return '';
  const s = createdAt.seconds || createdAt._seconds;
  if (!s) return '';
  const d = new Date(s * 1000);
  const m = d.getMonth() + 1;
  return String((m >= 10 || (m === 9 && d.getDate() >= 10)) ? d.getFullYear() + 3761 : d.getFullYear() + 3760);
}

const COMBINED_PARASHOT = {
  'Tazria':'Tazria Metzora','Metzora':'Tazria Metzora',
  'Acharei Mot':'Acharei Kedoshim','Kedoshim':'Acharei Kedoshim',
  'Behar':'Behar Bechukotai','Bechukotai':'Behar Bechukotai',
  'Vayakhel':'Vayakhel Pekudei','Pekudei':'Vayakhel Pekudei',
  'Matot':'Matot Masei','Masei':'Matot Masei',
  'Nitzavim':'Nitzavim Vayeilech','Vayeilech':'Nitzavim Vayeilech'
};

function sanitizeContent(html) {
  if (!html) return '';
  return html
    .replace(/ style=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/[​‌‍‎‏­﻿⁠⁦⁧⁨⁩]/g, '');
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
  const date    = displayDate(article.createdAt) || isoDate(article.createdAt);
  const cat     = (article.parasha ? (COMBINED_PARASHOT[article.parasha] || article.parasha) : '') || article.hag || '';

  const titleBlocks = langs.map(l =>
    `<h1 id="ap-title" data-lang="${l}" style="display:${l===def?'block':'none'};${l==='he'?'direction:rtl;text-align:right;':''}">${esc(tr[l].title)}</h1>`
  ).join('\n    ');

  const textBlocks = langs.map(l => {
    const rtl = l === 'he';
    return `<div id="ap-text" class="${rtl?'ap-rtl':''}" data-lang="${l}" style="display:${l===def?'block':'none'};direction:${rtl?'rtl':'ltr'}">${sanitizeContent(tr[l].text)||''}</div>`;
  }).join('\n    ');

  const langBtns = langs.map(l => {
    const lbl = {de:'DE',en:'EN',he:'עב'}[l];
    return `<button class="ap-lang-btn${l===def?' active':''}" onclick="switchLang('${l}')">${lbl}</button>`;
  }).join('');

  const mhLangs = ['de','en','he'].filter(l => langs.includes(l)).map(l => {
    const lbl = {de:'DE',en:'EN',he:'עב'}[l];
    return `<button class="lang-btn${l===def?' active':''}" id="lb-${l}" onclick="switchLang('${l}')">${lbl}</button>`;
  }).join('');

  const hmenuLangs = langs.map(l => {
    const lbl = {de:'DE',en:'EN',he:'עב'}[l];
    return `<button class="hmenu-lang${l===def?' active':''}" id="hm-${l}" onclick="switchLang('${l}')">${lbl}</button>`;
  }).join('');

  const imgHtml = article.image
    ? `<div class="ap-img-wrap"><img id="ap-img" src="${esc(article.image)}" alt="${esc(title)}" loading="lazy"></div>`
    : '';

  const hyStr   = hebrewYear(article.createdAt);
  const hyNum   = hebrewYearNumeric(article.createdAt);
  const isRtl   = def === 'he';
  const wordCount = stripHtml(tr[def].text || '').split(/\s+/).filter(Boolean).length;
  const readMins  = Math.max(1, Math.ceil(wordCount / 200));

  // Share URLs (computed at build time) — use clean SEO slug URL when available
  const seoSlug   = articleSeoSlug(article);
  const shareUrl  = seoSlug ? `${SITE_URL}/${seoSlug}/` : url;
  const safeShareUrl = shareUrl.replace(/'/g, "\\'");
  const safeUrl = url.replace(/'/g, "\\'");
  const waUrl  = 'https://wa.me/?text=' + encodeURIComponent(title + '\n\n' + shareUrl);
  const fbUrl  = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl);
  const thrUrl = 'https://www.threads.net/intent/post?text=' + encodeURIComponent(title + '\n\n' + shareUrl);
  const xUrl   = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(shareUrl) + '&text=' + encodeURIComponent(title);

  // SVG icons
  const icWA  = '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378L.057 22l1.649-6.079a9.925 9.925 0 0 1-1.334-4.93c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>';
  const icFB  = '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>';
  const icThr = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>';
  const icX   = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
  const icLnk = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  const icPrt = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>';
  const icPdf = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>';

  return `<!DOCTYPE html>
<html lang="${def}" translate="no" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google" content="notranslate">
<title>${esc(title)} — Rabbiner Elishai Zizov</title>
<meta name="description" content="${esc(excerpt)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(excerpt)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${shareUrl}">
<meta property="og:image" content="${resolveArticleImage(article)}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#1a2b4a">
<link rel="canonical" href="${shareUrl}">
${langs.map(l=>`<link rel="alternate" hreflang="${l}" href="${url}${l!=='de'?'?lang='+l:''}">` ).join('\n')}
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="icon" type="image/png" href="/logo.png">
<link rel="apple-touch-icon" href="/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<link rel="stylesheet" href="/css/global.css?v=${CSS_VER}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BlogPosting","@id":"${shareUrl}#article","headline":${JSON.stringify(title)},"description":${JSON.stringify(excerpt)},"image":"${resolveArticleImage(article)}","datePublished":"${isoDate(article.createdAt)}","dateModified":"${isoDate(article.createdAt)}","author":{"@type":"Person","@id":"${SITE_URL}/#person","name":"Rabbiner Elishai Zizov","url":"${SITE_URL}"},"publisher":{"@type":"Person","@id":"${SITE_URL}/#person","name":"Rabbiner Elishai Zizov","url":"${SITE_URL}"},"url":"${shareUrl}","mainEntityOfPage":{"@type":"WebPage","@id":"${shareUrl}"},"breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"${SITE_URL}"},{"@type":"ListItem","position":2,"name":"Beiträge","item":"${SITE_URL}/articles.html"},{"@type":"ListItem","position":3,"name":${JSON.stringify(title)},"item":"${shareUrl}"}]}}
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
    <div class="mh-langs" style="margin-right:0">${mhLangs}</div>
    <a href="/" class="mh-back-btn" style="display:inline-flex;margin-left:auto;flex-shrink:0;" aria-label="Startseite">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </a>
  </div>
</header>

<div id="ap-progress"></div>
<div id="article-page" style="display:block; padding-top:56px;">
    ${cat?`<div id="ap-parasha" style="font-family:Raleway,sans-serif;font-size:13px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#b8952a;margin-bottom:6px;text-align:${isRtl?'right':'left'};">${esc(cat)}</div>`:''}
    <div class="ap-topbar">
      <div class="ap-topbar-meta" style="display:flex;flex-direction:column;align-items:${isRtl?'flex-end':'flex-start'};gap:3px;width:100%;">
        ${(hyStr||hyNum)?`<span class="ap-hebrew-year" data-letters="${esc(hyStr)}" data-numeric="${hyNum}" style="font-family:'Frank Ruhl Libre',serif;font-size:15px;font-weight:700;color:#b8952a;letter-spacing:.05em;">${isRtl?hyStr:hyNum}</span>`:''}
        ${date?`<span id="ap-date" style="font-family:Raleway,sans-serif;font-size:11px;font-weight:600;color:#b8952a;letter-spacing:.05em;">${date}</span>`:''}
        <span class="ap-reading-time" data-mins="${readMins}" style="font-family:Raleway,sans-serif;font-size:10px;color:#888;letter-spacing:.04em;">~ ${readMins} Min. Lesezeit</span>
      </div>
    </div>
    ${titleBlocks}
    ${imgHtml}
    ${textBlocks}
    <div id="ap-share" style="margin-top:40px;padding-top:32px;border-top:1px solid #e0ddd6;">
      <div class="ap-share-header"><div class="ap-share-label">Teilen</div></div>
      <div class="ap-share-row">
        <a class="share-icon-btn" href="${waUrl}" target="_blank" rel="noopener" title="WhatsApp">${icWA}</a>
        <a class="share-icon-btn" href="${fbUrl}" target="_blank" rel="noopener" title="Facebook">${icFB}</a>
        <a class="share-icon-btn" href="${thrUrl}" target="_blank" rel="noopener" title="Threads">${icThr}</a>
        <a class="share-icon-btn" href="${xUrl}" target="_blank" rel="noopener" title="X">${icX}</a>
        <button class="share-icon-btn" id="copy-link-btn" title="Link kopieren" onclick="copyShareLink('${safeShareUrl}')">${icLnk}</button>
        <button class="share-icon-btn" onclick="window.print()" title="Drucken">${icPrt}</button>
        <button class="share-icon-btn" onclick="window.print()" title="PDF">${icPdf}</button>
      </div>
    </div>
    <div style="margin-top:48px;padding-top:24px;border-top:1px solid #e0ddd6;">
      <a id="ap-back-link" href="/articles.html" style="font-family:Raleway,sans-serif;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#b8952a;text-decoration:none;">← Alle Beiträge</a>
    </div>
</div>

<footer class="main-footer site-footer">
  <div class="mf-inner">
    <div class="mf-brand">
      <img src="/logo.png" alt="Rabbiner Elishai Zizov" class="mf-brand-logo">
      <p class="mf-brand-name">Rabbiner Elishai Zizov</p>
      <p class="mf-brand-tagline">Rabbiner · Vortragsredner</p>
      <div class="mf-brand-socials">
        <a href="https://www.instagram.com/elishaizizov" class="mf-social-icon" target="_blank" rel="noopener" title="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
        <a href="https://www.facebook.com/share/1AdfNooWwL/?mibextid=wwXIfr" class="mf-social-icon" target="_blank" rel="noopener" title="Facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      </div>
    </div>
    <div class="mf-col">
      <span class="mf-col-title">Navigation</span>
      <nav>
        <a class="mf-nav-link" href="/">Biografie</a>
        <a class="mf-nav-link" href="/articles.html">Beiträge</a>
        <a class="mf-nav-link" href="/contact.html">Anfragen</a>
      </nav>
    </div>
    <div class="mf-col">
      <span class="mf-col-title">Folgen</span>
      <nav>
        <a class="mf-nav-link" href="https://www.instagram.com/elishaizizov" target="_blank" rel="noopener">Instagram</a>
        <a class="mf-nav-link" href="https://www.facebook.com/share/1AdfNooWwL/?mibextid=wwXIfr" target="_blank" rel="noopener">Facebook</a>
        <a class="mf-nav-link" href="/contact.html">Anfragen</a>
      </nav>
    </div>
    <div class="mf-col">
      <span class="mf-col-title">Newsletter</span>
      <p class="mf-col-text">Erhalte Updates direkt in dein Postfach.</p>
      <form class="mf-nl-form" id="nl-form" onsubmit="nlSubscribe(event)">
        <input type="email" class="mf-nl-input" placeholder="E-Mail-Adresse" required>
        <button type="submit" class="btn secondary-btn" style="font-size:9px;padding:10px 16px;">Anmelden</button>
      </form>
      <p class="mf-nl-msg" id="nl-msg"></p>
    </div>
  </div>
  <div class="mf-bottom">
    <p class="mf-copy">Frankfurt am Main &nbsp;·&nbsp; © ${new Date().getFullYear()} &nbsp;·&nbsp; Alle Rechte vorbehalten</p>
  </div>
</footer>

<button id="back-to-top" onclick="window.scrollTo({top:0,behavior:'smooth'})" title="Nach oben">↑</button>

<div class="hmenu-overlay" id="hmenu-overlay" onclick="closeMenu()"></div>
<nav class="hmenu" id="hmenu">
  <button class="hmenu-close" onclick="closeMenu()">×</button>
  <div class="hmenu-section">
    <a class="hmenu-item" href="/" style="display:block;text-decoration:none;">Biografie</a>
    <a class="hmenu-item" href="/articles.html" style="display:block;text-decoration:none;">Beiträge</a>
    <a class="hmenu-item" href="/contact.html" style="display:block;text-decoration:none;">Anfragen</a>
  </div>
  <div class="hmenu-divider"></div>
  <div class="hmenu-section hmenu-langs">${hmenuLangs}</div>
  <div class="hmenu-divider"></div>
  <a class="hmenu-admin-btn" href="/articles.html?admin=1" style="text-decoration:none;">&#9881; Admin</a>
  <div class="hmenu-divider"></div>
  <a href="https://www.instagram.com/elishaizizov" class="hmenu-ig" target="_blank" rel="noopener">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
    @elishaizizov
  </a>
  <a href="https://www.facebook.com/share/1AdfNooWwL/?mibextid=wwXIfr" class="hmenu-ig" target="_blank" rel="noopener" style="margin-top:10px">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    Facebook
  </a>
</nav>

<script src="/js/shared.js?v=29"></script>
<script>
var _langs = ${JSON.stringify(langs)};
var _cur = '${def}';

var _parashaHe = {
  'Bereshit':'בראשית','Noach':'נח','Lech Lecha':'לך לך','Vayera':'וירא','Chayei Sara':'חיי שרה',
  'Toldot':'תולדות','Vayetze':'ויצא','Vayishlach':'וישלח','Vayeshev':'וישב',
  'Miketz':'מקץ','Vayigash':'ויגש','Vayechi':'ויחי',
  'Shemot':'שמות','Vaera':'וארא','Bo':'בא','Beshalach':'בשלח','Yitro':'יתרו',
  'Mishpatim':'משפטים','Terumah':'תרומה','Tetzaveh':'תצוה','Ki Tissa':'כי תשא',
  'Vayakhel':'ויקהל','Pekudei':'פקודי',
  'Vayikra':'ויקרא','Tzav':'צו','Shemini':'שמיני','Tazria':'תזריע','Metzora':'מצרע',
  'Acharei Mot':'אחרי מות','Kedoshim':'קדושים','Emor':'אמור','Behar':'בהר','Bechukotai':'בחקתי',
  'Bamidbar':'במדבר','Nasso':'נשא','Behaalotecha':'בהעלתך','Shelach':'שלח','Korach':'קרח',
  'Chukat':'חקת','Balak':'בלק','Pinchas':'פינחס','Matot':'מטות','Masei':'מסעי',
  'Devarim':'דברים','Vaetchanan':'ואתחנן','Ekev':'עקב','Reeh':'ראה','Shoftim':'שופטים',
  'Ki Teitzei':'כי תצא','Ki Tavo':'כי תבוא','Nitzavim':'ניצבים','Vayeilech':'וילך',
  'Haazinu':'האזינו','Vezot Haberacha':'וזאת הברכה',
  'Pesach':'פסח','Sukkot':'סוכות','Shavuot':'שבועות','Rosh Hashana':'ראש השנה',
  'Yom Kippur':'יום כיפור','Purim':'פורים','Chanukah':'חנוכה','Tisha BeAv':'תשעה באב',
  'Behar Bechukotai':'בהר בחקתי','Tazria Metzora':'תזריע מצרע',
  'Acharei Kedoshim':'אחרי מות קדושים','Vayakhel Pekudei':'ויקהל פקודי',
  'Matot Masei':'מטות מסעי','Nitzavim Vayeilech':'ניצבים וילך'
};
var _shareLabels = {de:'Teilen', en:'Share', he:'שיתוף'};

function switchLang(lang) {
  if (!_langs.includes(lang)) return;
  _cur = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach(function(el) {
    el.style.display = el.dataset.lang === lang ? 'block' : 'none';
  });
  document.querySelectorAll('.lang-btn,.ap-lang-btn,.hmenu-lang').forEach(function(btn) {
    var map = {DE:'de',EN:'en','עב':'he'};
    btn.classList.toggle('active', map[btn.textContent.trim()] === lang);
  });
  var isHe = lang === 'he';
  document.documentElement.dir = isHe ? 'rtl' : 'ltr';
  var parashaEl = document.getElementById('ap-parasha');
  if (parashaEl) {
    if (!parashaEl._orig) parashaEl._orig = parashaEl.textContent.trim();
    parashaEl.textContent = (isHe && _parashaHe[parashaEl._orig]) ? _parashaHe[parashaEl._orig] : parashaEl._orig;
    parashaEl.style.direction = isHe ? 'rtl' : 'ltr';
    parashaEl.style.textAlign = isHe ? 'right' : 'left';
  }
  var meta = document.querySelector('.ap-topbar-meta');
  if (meta) meta.style.alignItems = isHe ? 'flex-end' : 'flex-start';
  var dateEl = document.getElementById('ap-date');
  if (dateEl) {
    dateEl.style.textAlign = isHe ? 'right' : 'left';
    dateEl.style.alignSelf = isHe ? 'flex-end' : 'flex-start';
  }
  var backLink = document.getElementById('ap-back-link');
  if (backLink) {
    var backLabels = {de:'← Alle Beiträge', en:'← All Articles', he:'כל הכתבות →'};
    backLink.textContent = backLabels[lang] || backLabels.de;
    backLink.style.direction = isHe ? 'rtl' : 'ltr';
  }
  var hyEl = document.querySelector('.ap-hebrew-year');
  if (hyEl) hyEl.textContent = isHe ? (hyEl.dataset.letters || '') : (hyEl.dataset.numeric || '');
  var shareLabel = document.querySelector('.ap-share-label');
  if (shareLabel) shareLabel.textContent = _shareLabels[lang] || 'Teilen';
  var rtEl = document.querySelector('.ap-reading-time');
  if (rtEl) {
    var m = rtEl.getAttribute('data-mins') || '?';
    var rtL = {de:'~ '+m+' Min. Lesezeit', en:'~ '+m+' min. read', he:'כ-'+m+' דק׳ קריאה'};
    rtEl.textContent = rtL[lang] || rtL.de;
  }
  history.replaceState({}, '', lang !== 'de' ? '?lang=' + lang : window.location.pathname);
}

(function() {
  var p = new URLSearchParams(window.location.search).get('lang');
  if (p && p !== _cur) switchLang(p);
})();

function copyShareLink(url) {
  var btn = document.getElementById('copy-link-btn');
  if (!btn) return;
  var orig = btn.innerHTML;
  navigator.clipboard.writeText(url).then(function() {
    btn.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    btn.classList.add('btn-copied');
    setTimeout(function() { btn.innerHTML = orig; btn.classList.remove('btn-copied'); }, 2200);
  });
}

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

// ── Main ──────────────────────────────────────────────────────────────────────────────
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
