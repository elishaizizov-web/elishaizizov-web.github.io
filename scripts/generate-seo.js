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
  // Try without API key first (works if Firestore rules allow public read)
  // Fall back to with API key if needed
  const baseNoKey = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/articles?pageSize=300`;
  const baseWithKey = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/articles?key=${API_KEY}&pageSize=300`;

  // Determine which base URL works
  let base = baseNoKey;
  try {
    const test = await httpsGet(baseNoKey + '&pageSize=1');
    if (test.error) base = baseWithKey;
  } catch(e) {
    base = baseWithKey;
  }

  do {
    const url  = token ? `${base}&pageToken=${token}` : base;
    const data = await httpsGet(url);
    if (data.error) throw new Error('Firestore error: ' + JSON.stringify(data.error));
    if (data.documents) docs.push(...data.documents.map(parseFirestoreDoc));
    token = data.nextPageToken || null;
  } while (token);
  return docs;
}

// ─── HTML GENERATION ─────────────────────────────────────────────────────────
// Generates a thin redirect page: meta/SEO tags visible to Google in <head>,
// JS redirect sends real users straight to the SPA.
// lang: 'de' | 'en' | 'fr' | 'es' | 'ru' | 'he'
// German uses /{slug}/, all others use /{slug}-{lang}/
function articleHtmlForLang(a, lang) {
  const slug     = articleSlug(a);
  const langSlug = lang === 'de' ? slug : (slug + '-' + lang);
  const pageUrl  = SITE_URL + '/' + langSlug;
  const deUrl    = SITE_URL + '/' + slug;

  const title = (lang !== 'de' && a['title_' + lang]) ? a['title_' + lang] : (a.title || '');
  const text  = (lang !== 'de' && a['text_'  + lang]) ? a['text_'  + lang] : (a.text  || '');
  const topic = topicNameForLang(a, lang);

  const seoTitle   = escHtml(title);
  const seoTopic   = escHtml(topic);
  const seoExcerpt = escHtml(stripHtml(text).substring(0, 220));
  const seoImg     = a.image ? escHtml(a.image) : (SITE_URL + '/logo.png');
  const htmlDir    = lang === 'he' ? 'rtl' : 'ltr';
  const isRTL      = lang === 'he';
  const siteName   = lang === 'he' ? '\u05d4\u05e8\u05d1 \u05d0\u05dc\u05d9\u05e9\u05d9 \u05d6\u05d9\u05d6\u05d5\u05d1' : 'Rabbiner Elishai Zizov';

  const backLabels = { de:'← Zur\u00fcck', en:'← Back', fr:'← Retour', es:'← Volver', ru:'\u2190 \u041d\u0430\u0437\u0430\u0434', he:'\u2190 \u05d7\u05d6\u05e8\u05d4' };
  const backLabel  = backLabels[lang] || backLabels.de;

  const hreflangs = LANGS.map(function(l) {
    const u = l === 'de' ? (SITE_URL + '/' + slug) : (SITE_URL + '/' + slug + '-' + l);
    return '  <link rel="alternate" hreflang="' + l + '" href="' + escHtml(u) + '">';
  }).join('\n') + '\n  <link rel="alternate" hreflang="x-default" href="' + escHtml(deUrl) + '">';

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": stripHtml(text).substring(0, 220),
    "datePublished": a.date || '',
    "author": { "@type":"Person","name":siteName,"url":SITE_URL },
    "publisher": { "@type":"Person","name":siteName,"url":SITE_URL },
    "url": pageUrl,
    "mainEntityOfPage": { "@type":"WebPage","@id":pageUrl },
    "inLanguage": lang
  };
  if (a.image) jsonld.image = a.image;
  if (topic) jsonld.about = { "@type":"Thing","name":topic };

  const safeSlug = slug.replace(/'/g, "\\'");

  // Full article text for Google to index (preserve HTML but sanitise)
  const bodyText = text ? text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'') : '';
  const articleAlign = isRTL ? 'right' : 'left';

  return '<!DOCTYPE html>\n' +
    '<html lang="' + lang + '" dir="' + htmlDir + '">\n' +
    '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '<title>' + seoTitle + (seoTopic ? ' \u2014 ' + seoTopic : '') + ' \u2014 ' + siteName + '</title>\n' +
    '<meta name="description" content="' + seoExcerpt + '">\n' +
    '<link rel="canonical" href="' + escHtml(pageUrl) + '">\n' +
    '<meta property="og:title" content="' + seoTitle + '">\n' +
    '<meta property="og:description" content="' + seoExcerpt + '">\n' +
    '<meta property="og:type" content="article">\n' +
    '<meta property="og:url" content="' + escHtml(pageUrl) + '">\n' +
    '<meta property="og:image" content="' + seoImg + '">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    hreflangs + '\n' +
    '<script type="application/ld+json">\n' + JSON.stringify(jsonld) + '\n</script>\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">\n' +
    '<style>\n' +
    '*{box-sizing:border-box;margin:0;padding:0}\n' +
    'body{font-family:Georgia,serif;background:#f7f4ee;color:#1a1a1a;line-height:1.8}\n' +
    '.seo-header{background:#1b2a3b;padding:14px 24px;display:flex;align-items:center;justify-content:space-between}\n' +
    '.seo-header a{color:#d4aa40;font-family:Raleway,sans-serif;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;text-decoration:none}\n' +
    '.seo-header .site-name{color:#fff;font-family:Raleway,sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em}\n' +
    '.seo-wrap{max-width:740px;margin:0 auto;padding:40px 24px 80px}\n' +
    '.seo-topic{font-family:Raleway,sans-serif;font-size:10px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#b8952a;margin-bottom:16px}\n' +
    '.seo-title{font-family:"Playfair Display",Georgia,serif;font-size:clamp(26px,5vw,42px);font-weight:700;line-height:1.2;color:#1b2a3b;margin-bottom:18px;text-align:' + articleAlign + '}\n' +
    '.seo-date{font-family:Raleway,sans-serif;font-size:11px;color:#888;margin-bottom:28px}\n' +
    '.seo-img{width:100%;max-height:420px;object-fit:cover;border-radius:4px;margin-bottom:32px;display:block}\n' +
    '.seo-body{font-size:' + (isRTL ? '17px' : '16px') + ';line-height:' + (isRTL ? '2.0' : '1.85') + ';text-align:' + articleAlign + ';direction:' + htmlDir + '}\n' +
    '.seo-body p{margin-bottom:1.4em}\n' +
    '.seo-body h2,.seo-body h3{font-family:"Playfair Display",serif;color:#1b2a3b;margin:1.6em 0 .6em}\n' +
    '.seo-footer{margin-top:48px;padding-top:24px;border-top:1px solid #ddd;text-align:center}\n' +
    '.seo-footer a{font-family:Raleway,sans-serif;font-size:12px;color:#b8952a;font-weight:700;letter-spacing:.15em;text-transform:uppercase;text-decoration:none}\n' +
    '</style>\n' +
    '<script>\n' +
    '(function(){\n' +
    "  // Only redirect if user navigated here from within the SPA\n" +
    "  var ref = document.referrer;\n" +
    "  if (ref && ref.indexOf(window.location.origin) === 0 && ref.indexOf('/' + '" + safeSlug + "') === -1) {\n" +
    "    sessionStorage.setItem('redirect_lang', '" + lang + "');\n" +
    "    sessionStorage.setItem('redirect_article', '" + safeSlug + "');\n" +
    "    window.location.replace('/');\n" +
    '  }\n' +
    '})();\n' +
    '</script>\n' +
    '</head>\n' +
    '<body>\n' +
    '<header class="seo-header">\n' +
    '  <a href="/">' + escHtml(backLabel) + '</a>\n' +
    '  <span class="site-name">' + escHtml(siteName) + '</span>\n' +
    '</header>\n' +
    '<main class="seo-wrap">\n' +
    (seoTopic ? '  <p class="seo-topic">' + seoTopic + '</p>\n' : '') +
    '  <h1 class="seo-title">' + seoTitle + '</h1>\n' +
    (a.date ? '  <p class="seo-date">' + escHtml(a.date) + '</p>\n' : '') +
    (a.image ? '  <img class="seo-img" src="' + seoImg + '" alt="' + seoTitle + '" loading="eager">\n' : '') +
    '  <div class="seo-body">' + bodyText + '</div>\n' +
    '  <div class="seo-footer"><a href="/">' + escHtml(siteName) + '</a></div>\n' +
    '</main>\n' +
    '</body>\n' +
    '</html>';
}

// ─── SITEMAP ─────────────────────────────────────────────────────────────────
function buildSitemap(articles) {
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    '  <url><loc>' + SITE_URL + '/</loc><lastmod>' + today + '</lastmod><priority>1.0</priority></url>'
  ];
  for (const a of articles) {
    const slug = articleSlug(a);
    if (!slug) continue;
    const loc = SITE_URL + '/' + slug;
    // Date from "DD.MM.YYYY" → "YYYY-MM-DD"
    let lastmod = today;
    if (a.date) {
      const parts = a.date.split('.');
      if (parts.length === 3) lastmod = parts[2] + '-' + parts[1].padStart(2,'0') + '-' + parts[0].padStart(2,'0');
    }
    urls.push('  <url><loc>' + loc + '</loc><lastmod>' + lastmod + '</lastmod><priority>0.8</priority></url>');
    // Language-specific pages (/{slug}-{lang}/)
    for (const l of LANGS.filter(function(l) { return l !== 'de'; })) {
      const langLoc = SITE_URL + '/' + slug + '-' + l;
      urls.push('  <url><loc>' + langLoc + '</loc><lastmod>' + lastmod + '</lastmod><priority>0.7</priority></url>');
    }
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n';
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
    if (!slug) { console.warn('  Skipping article with no slug: ' + a.id); continue; }

    // Generate a page for each language
    for (const lang of LANGS) {
      const langSlug = lang === 'de' ? slug : (slug + '-' + lang);
      currentSlugs.push(langSlug);
      const dir  = path.join(ROOT, langSlug);
      const file = path.join(dir, 'index.html');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(file, articleHtmlForLang(a, lang), 'utf8');
    }
    console.log('  Generated: /' + slug + '/ + 5 language variants');
  }

  // Remove dirs for deleted articles
  removeOldDirs(prevSlugs, currentSlugs);
  writeGeneratedSlugs(currentSlugs);

  // Sitemap
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, buildSitemap(articles), 'utf8');
  console.log('  Updated: sitemap.xml (' + (articles.length * LANGS.length + 1) + ' entries)');

  console.log('Done.');
}

main();
