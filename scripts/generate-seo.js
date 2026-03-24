#!/usr/bin/env node
/**
 * generate-seo.js
 * ---------------
 * Fetches all articles from Firestore (public REST API) and generates:
 *   1.  /{slug}/index.html  – full static article page (Google-indexable)
 *   2.  sitemap.xml         – updated with every article URL
 *
 * Run:  node scripts/generate-seo.js
 * Runs daily via GitHub Action (.github/workflows/seo.yml)
 */

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const PROJECT_ID = 'elishai-zizov';
const API_KEY    = 'AIzaSyDmEpaog0ZVYI4ZU87IfcjiSbRizQITn5o';
const SITE_URL   = 'https://elishaizizov.com';
const ROOT       = path.join(__dirname, '..');   // repo root = web root
const LANGS      = ['de','en','fr','es','ru','he'];

// ─── TORAH DATA (mirrors index.html) ─────────────────────────────────────────
const TORAH = {
  Bereshit: {
    de:['Bereshit','Noach','Lech Lecha','Vayera','Chayei Sara','Toldot','Vayetzei','Vayishlach','Vayeshev','Miketz','Vayigash','Vayechi'],
    de_display:['Bereschit','Noach','Lech Lecha','Wajera','Chajje Sara','Toldot','Wajeze','Wajischlach','Wajeschew','Mikez','Wajiggasch','Wajchi'],
    he:['בראשית','נח','לך לך','וירא','חיי שרה','תולדות','ויצא','וישלח','וישב','מקץ','ויגש','ויחי']
  },
  Shemot: {
    de:['Shemot','Vaera','Bo','Beshalach','Yitro','Mishpatim','Teruma','Tetzaveh','Ki Tisa','Vayakhel','Pekudei'],
    de_display:['Schemot','Waera','Bo','Beschallach','Jitro','Mischpatim','Teruma','Tezawwe','Ki Tissa','Wajakhel','Pekude'],
    he:['שמות','וארא','בא','בשלח','יתרו','משפטים','תרומה','תצוה','כי תשא','ויקהל','פקודי']
  },
  Vayikra: {
    de:['Vayikra','Tzav','Shemini','Tazria','Metzora','Acharei Mot','Kedoshim','Emor','Behar','Bechukotai'],
    de_display:['Wajikra','Zaw','Schemini','Tazria','Mezora','Achare Mot','Kedoschim','Emor','Behar','Bechukotai'],
    he:['ויקרא','צו','שמיני','תזריע','מצורע','אחרי מות','קדושים','אמור','בהר','בחוקותי']
  },
  Bamidbar: {
    de:['Bamidbar','Nasso',"Beha'alotcha",'Shelach','Korach','Chukat','Balak','Pinchas','Matot','Masei'],
    de_display:['Bamidbar','Nasso','Beaalotcha','Schelach','Korach','Chukkat','Balak','Pinchas','Mattot','Masse'],
    he:['במדבר','נשא','בהעלותך','שלח','קורח','חוקת','בלק','פינחס','מטות','מסעי']
  },
  Devarim: {
    de:['Devarim','Vaetchanan','Eikev',"Re'eh",'Shoftim','Ki Teitzei','Ki Tavo','Nitzavim','Vayeilech',"Ha'azinu",'Vezot Habracha'],
    de_display:['Dewarim','Waetchanan','Ekew','Ree','Schoftim','Ki Teze','Ki Tawo','Nizawim','Wajelech','Haasinu','Wesot Habracha'],
    he:['דברים','ואתחנן','עקב','ראה','שופטים','כי תצא','כי תבוא','נצבים','וילך','האזינו','וזאת הברכה']
  }
};

const PARASHA_MAP = {
  Bereshit: ['Bereshit','Noach','Lech Lecha','Vayera','Chayei Sara','Toldot','Vayetzei','Vayishlach','Vayeshev','Miketz','Vayigash','Vayechi'],
  Shemot:   ['Shemot','Vaera','Bo','Beshalach','Yitro','Mishpatim','Teruma','Tetzaveh','Ki Tisa','Vayakhel','Pekudei'],
  Vayikra:  ['Vayikra','Tzav','Shemini','Tazria','Metzora','Acharei Mot','Kedoshim','Emor','Behar','Bechukotai'],
  Bamidbar: ['Bamidbar','Nasso',"Beha'alotcha",'Shelach','Korach','Chukat','Balak','Pinchas','Matot','Masei'],
  Devarim:  ['Devarim','Vaetchanan','Eikev',"Re'eh",'Shoftim','Ki Teitzei','Ki Tavo','Nitzavim','Vayeilech',"Ha'azinu",'Vezot Habracha']
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function parashaDisplayName(key) {
  if (!key) return '';
  for (const book of Object.keys(TORAH)) {
    const idx = (PARASHA_MAP[book] || []).indexOf(key);
    if (idx !== -1 && TORAH[book].de_display) return TORAH[book].de_display[idx] || key;
  }
  return key;
}

function parashaNameForLang(key, lang) {
  if (!key) return '';
  for (const book of Object.keys(TORAH)) {
    const idx = (PARASHA_MAP[book] || []).indexOf(key);
    if (idx !== -1) {
      if (lang === 'he' && TORAH[book].he) return TORAH[book].he[idx] || key;
      if (lang === 'de' && TORAH[book].de_display) return TORAH[book].de_display[idx] || key;
      return TORAH[book].de[idx] || key;
    }
  }
  return key;
}

function hagNameForLang(key, lang) {
  if (!key) return '';
  const idx = HAG_KEYS.indexOf(key);
  if (idx === -1) return key;
  return (HAGIM_NAMES[lang] || HAGIM_NAMES.de)[idx] || key;
}

function topicNameForLang(a, lang) {
  if (a.parasha) return parashaNameForLang(a.parasha, lang);
  if (a.hag)     return hagNameForLang(a.hag, lang);
  return '';
}

function articleSlug(a) {
  const year    = a.date ? a.date.split('.').pop().trim() : '';
  const rawName = a.parasha ? parashaDisplayName(a.parasha) : (a.hag || '');
  if (!rawName || !year) return a.id;
  const name = rawName.toLowerCase()
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
    .replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  return `${name}-${year}`;
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function escHtml(s) {
  return (s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ─── FIRESTORE REST API ───────────────────────────────────────────────────────
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('JSON parse error: ' + data.slice(0,200))); }
      });
    }).on('error', reject);
  });
}

function parseFirestoreValue(v) {
  if (!v) return null;
  if (v.stringValue    !== undefined) return v.stringValue;
  if (v.integerValue   !== undefined) return parseInt(v.integerValue, 10);
  if (v.doubleValue    !== undefined) return parseFloat(v.doubleValue);
  if (v.booleanValue   !== undefined) return v.booleanValue;
  if (v.timestampValue !== undefined) return v.timestampValue;
  if (v.nullValue      !== undefined) return null;
  if (v.arrayValue)  return (v.arrayValue.values || []).map(parseFirestoreValue);
  if (v.mapValue) {
    const obj = {};
    for (const [k, val] of Object.entries(v.mapValue.fields || {}))
      obj[k] = parseFirestoreValue(val);
    return obj;
  }
  return null;
}

function parseFirestoreDoc(doc) {
  const obj = { id: doc.name.split('/').pop() };
  for (const [k, v] of Object.entries(doc.fields || {}))
    obj[k] = parseFirestoreValue(v);
  return obj;
}

async function fetchAllArticles() {
  const docs = [];
  let token = null;
  const base = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/articles?key=${API_KEY}&pageSize=300`;
  do {
    const url  = token ? `${base}&pageToken=${token}` : base;
    const data = await httpsGet(url);
    if (data.documents) docs.push(...data.documents.map(parseFirestoreDoc));
    token = data.nextPageToken || null;
  } while (token);
  return docs;
}

// ─── HTML GENERATION ─────────────────────────────────────────────────────────
function articleHtml(a) {
  const slug    = articleSlug(a);
  const pageUrl = `${SITE_URL}/${slug}`;

  // Default-language content (de)
  const defTitle = a.title || '';
  const defText  = a.text  || '';

  // Build per-language data
  const langs = {};
  for (const l of LANGS) {
    const tr = (a.translations && a.translations[l]) || {};
    langs[l] = {
      title:   tr.title || defTitle,
      text:    tr.text  || defText,
      topic:   topicNameForLang(a, l),
      isRtl:   l === 'he',
      langUrl: l === 'de' ? pageUrl : `${pageUrl}?lang=${l}`
    };
  }

  // SEO values (de default)
  const seoTitle   = escHtml(langs.de.title);
  const seoTopic   = escHtml(langs.de.topic);
  const seoExcerpt = escHtml(stripHtml(langs.de.text).substring(0, 220));
  const seoImg     = a.image ? escHtml(a.image) : `${SITE_URL}/logo.png`;

  // hreflang
  const hreflangs = LANGS.map(l =>
    `  <link rel="alternate" hreflang="${l}" href="${escHtml(langs[l].langUrl)}">`
  ).join('\n') +
  `\n  <link rel="alternate" hreflang="x-default" href="${escHtml(pageUrl)}">`;

  // JSON-LD
  const jsonld = {
    "@context":        "https://schema.org",
    "@type":           "Article",
    "headline":        langs.de.title,
    "description":     stripHtml(langs.de.text).substring(0, 220),
    "datePublished":   a.date || '',
    "author":          { "@type":"Person","name":"Rabbi Elishai Zizov","url":SITE_URL },
    "publisher":       { "@type":"Person","name":"Rabbi Elishai Zizov","url":SITE_URL },
    "url":             pageUrl,
    "mainEntityOfPage":{ "@type":"WebPage","@id":pageUrl },
    "inLanguage":      "de",
    "about":           langs.de.topic ? { "@type":"Thing","name":langs.de.topic } : undefined
  };
  if (a.image) jsonld.image = a.image;
  const jsonldStr = JSON.stringify(jsonld, null, 2);

  // Language-version blocks for multilingual SEO
  const langBlocks = LANGS.filter(l => l !== 'de').map(l => {
    const d = langs[l];
    if (!d.title && !d.text) return '';
    const titleText = escHtml(d.title);
    const excerpt   = escHtml(stripHtml(d.text).substring(0, 300));
    return `
    <div class="lang-variant" lang="${l}" dir="${d.isRtl ? 'rtl' : 'ltr'}" aria-hidden="true">
      <h2 class="lv-title">${titleText}</h2>
      <p class="lv-excerpt">${excerpt}${stripHtml(d.text).length > 300 ? '…' : ''}</p>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${seoTitle}${seoTopic ? ' — ' + seoTopic : ''} — Rabbiner Elishai Zizov</title>
<meta name="description" content="${seoExcerpt}">
<link rel="canonical" href="${escHtml(pageUrl)}">
<meta property="og:title" content="${seoTitle}">
<meta property="og:description" content="${seoExcerpt}">
<meta property="og:type" content="article">
<meta property="og:url" content="${escHtml(pageUrl)}">
<meta property="og:image" content="${seoImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${seoTitle}">
<meta name="twitter:description" content="${seoExcerpt}">
<meta name="twitter:image" content="${seoImg}">
${hreflangs}
<script type="application/ld+json">
${jsonldStr}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Source+Serif+4:wght@300;400&family=Raleway:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--navy:#1b2a3b;--gold:#b8952a;--gold-l:#d4aa40;--text:#2a2420;--soft:#4a4440;--rule:#dcd8d0;--bg:#f8f6f2}
body{font-family:'Source Serif 4',Georgia,serif;background:#fff;color:var(--text);-webkit-font-smoothing:antialiased;max-width:780px;margin:0 auto;padding:0 24px 64px}
a{color:inherit;text-decoration:none}
.site-header{border-bottom:1px solid var(--rule);padding:18px 0;display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:40px}
.site-name{font-family:'Playfair Display',serif;font-size:16px;font-weight:400;color:var(--navy);letter-spacing:.02em}
.site-name a:hover{color:var(--gold)}
.lang-nav{display:flex;gap:0}
.lang-nav a{font-family:'Raleway',sans-serif;font-size:9px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--soft);padding:6px 10px;border:1px solid var(--rule);border-left:none;transition:color .2s,background .2s}
.lang-nav a:first-child{border-left:1px solid var(--rule)}
.lang-nav a:hover{color:var(--navy);background:var(--bg)}
.art-meta{font-family:'Raleway',sans-serif;font-size:9px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--soft);margin-bottom:12px}
.art-meta .sep{margin:0 8px;opacity:.4}
.art-title{font-family:'Playfair Display',serif;font-size:clamp(26px,4vw,40px);font-weight:500;line-height:1.2;color:var(--navy);margin-bottom:28px;letter-spacing:-.01em}
.art-divider{border:none;border-top:1px solid var(--rule);margin:24px 0}
.art-body{font-size:17px;line-height:1.8;color:var(--text)}
.art-body p{margin-bottom:1em}
.art-body strong{font-weight:600}
.art-body em{font-style:italic}
.art-body h1,.art-body h2,.art-body h3{font-family:'Playfair Display',serif;color:var(--navy);margin:1.4em 0 .6em}
.art-body ul,.art-body ol{padding-left:1.5em;margin-bottom:1em}
.art-body li{margin-bottom:.3em}
.art-body blockquote{border-left:3px solid var(--gold);padding-left:16px;color:var(--soft);margin:1em 0}
.open-spa{display:inline-flex;align-items:center;gap:8px;margin-top:36px;padding:11px 22px;background:var(--navy);color:#fff;font-family:'Raleway',sans-serif;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;border:none;transition:background .2s}
.open-spa:hover{background:var(--gold)}
.lang-variants{margin-top:48px;border-top:2px solid var(--rule);padding-top:32px}
.lang-variant{margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid var(--rule)}
.lang-variant:last-child{border-bottom:none}
.lv-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:400;color:var(--navy);margin-bottom:10px}
.lv-excerpt{font-size:14px;line-height:1.7;color:var(--soft)}
.site-footer{margin-top:56px;padding-top:24px;border-top:1px solid var(--rule);font-family:'Raleway',sans-serif;font-size:9px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--soft);text-align:center}
@media(max-width:540px){.lang-nav{display:none}.site-header{justify-content:center}}
</style>
</head>
<body>

<header class="site-header">
  <p class="site-name"><a href="/">Rabbiner Elishai Zizov</a></p>
  <nav class="lang-nav" aria-label="Sprachen">
    ${LANGS.map(l => `<a href="${escHtml(langs[l].langUrl)}" lang="${l}" hreflang="${l}">${l === 'he' ? 'עב' : l.toUpperCase()}</a>`).join('')}
  </nav>
</header>

<article>
  <p class="art-meta">
    ${a.date ? escHtml(a.date) : ''}${a.date && langs.de.topic ? '<span class="sep">·</span>' : ''}${langs.de.topic ? escHtml(langs.de.topic) : ''}
  </p>
  <h1 class="art-title">${escHtml(langs.de.title)}</h1>
  <hr class="art-divider">
  <div class="art-body" dir="ltr">${langs.de.text || ''}</div>

  <button class="open-spa" onclick="(function(){sessionStorage.setItem('redirect_article','${escHtml(slug)}');window.location.href='/'})()">
    ↗ Zur interaktiven Website
  </button>
</article>

${langBlocks ? `<section class="lang-variants" aria-label="Weitere Sprachen">${langBlocks}</section>` : ''}

<footer class="site-footer">
  <a href="/">Rabbiner Elishai Zizov</a> &nbsp;·&nbsp; Frankfurt am Main &nbsp;·&nbsp; © ${new Date().getFullYear()}
</footer>

</body>
</html>`;
}

// ─── SITEMAP ─────────────────────────────────────────────────────────────────
function buildSitemap(articles) {
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    `  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>`
  ];
  for (const a of articles) {
    const slug = articleSlug(a);
    if (!slug) continue;
    const loc = `${SITE_URL}/${slug}`;
    // Date from "DD.MM.YYYY" → "YYYY-MM-DD"
    let lastmod = today;
    if (a.date) {
      const parts = a.date.split('.');
      if (parts.length === 3) lastmod = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
    }
    urls.push(`  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><priority>0.8</priority></url>`);
    // Language variants
    for (const l of LANGS.filter(l => l !== 'de')) {
      urls.push(`  <url><loc>${loc}?lang=${l}</loc><lastmod>${lastmod}</lastmod><priority>0.6</priority></url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

// ─── FILE MANAGEMENT ─────────────────────────────────────────────────────────
function readGeneratedSlugs() {
  const trackFile = path.join(ROOT, 'scripts', '.generated-slugs.json');
  try { return JSON.parse(fs.readFileSync(trackFile, 'utf8')); }
  catch { return []; }
}

function writeGeneratedSlugs(slugs) {
  const trackFile = path.join(ROOT, 'scripts', '.generated-slugs.json');
  fs.writeFileSync(trackFile, JSON.stringify(slugs, null, 2));
}

function removeOldDirs(prevSlugs, currentSlugs) {
  const removed = prevSlugs.filter(s => !currentSlugs.includes(s));
  for (const slug of removed) {
    const dir = path.join(ROOT, slug);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`  Removed old: /${slug}/`);
    }
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Fetching articles from Firestore…');
  let articles;
  try {
    articles = await fetchAllArticles();
  } catch (e) {
    console.error('Failed to fetch articles:', e.message);
    process.exit(1);
  }
  console.log(`  ${articles.length} article(s) found`);

  const prevSlugs    = readGeneratedSlugs();
  const currentSlugs = [];

  for (const a of articles) {
    const slug = articleSlug(a);
    if (!slug) { console.warn(`  Skipping article with no slug: ${a.id}`); continue; }
    currentSlugs.push(slug);

    const dir  = path.join(ROOT, slug);
    const file = path.join(dir, 'index.html');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, articleHtml(a), 'utf8');
    console.log(`  Generated: /${slug}/`);
  }

  // Remove dirs for deleted articles
  removeOldDirs(prevSlugs, currentSlugs);
  writeGeneratedSlugs(currentSlugs);

  // Sitemap
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, buildSitemap(articles), 'utf8');
  console.log(`  Updated: sitemap.xml (${articles.length + 1} entries)`);

  console.log('Done.');
}

main();
