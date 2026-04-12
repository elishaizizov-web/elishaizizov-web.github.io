export const LANGS = ['de', 'en', 'fr', 'es', 'ru', 'he'];

export const LANG_LABELS = { de: 'DE', en: 'EN', fr: 'FR', es: 'ES', ru: 'RU', he: 'עב' };

const TORAH = {
  Bereshit: {
    de: ['Bereshit','Noach','Lech Lecha','Vayera','Chayei Sara','Toldot','Vayetzei','Vayishlach','Vayeshev','Miketz','Vayigash','Vayechi'],
    de_display: ['Bereschit','Noach','Lech Lecha','Wajera','Chajje Sara','Toldot','Wajeze','Wajischlach','Wajeschew','Mikez','Wajiggasch','Wajchi'],
    he: ['בראשית','נח','לך לך','וירא','חיי שרה','תולדות','ויצא','וישלח','וישב','מקץ','ויגש','ויחי'],
  },
  Shemot: {
    de: ['Shemot','Vaera','Bo','Beshalach','Yitro','Mishpatim','Teruma','Tetzaveh','Ki Tisa','Vayakhel','Pekudei'],
    de_display: ['Schemot','Waera','Bo','Beschallach','Jitro','Mischpatim','Teruma','Tezawwe','Ki Tissa','Wajakhel','Pekude'],
    he: ['שמות','וארא','בא','בשלח','יתרו','משפטים','תרומה','תצוה','כי תשא','ויקהל','פקודי'],
  },
  Vayikra: {
    de: ['Vayikra','Tzav','Shemini','Tazria','Metzora','Acharei Mot','Kedoshim','Emor','Behar','Bechukotai'],
    de_display: ['Wajikra','Zaw','Schemini','Tazria','Mezora','Achare Mot','Kedoschim','Emor','Behar','Bechukotai'],
    he: ['ויקרא','צו','שמיני','תזריע','מצורע','אחרי מות','קדושים','אמור','בהר','בחוקותי'],
  },
  Bamidbar: {
    de: ['Bamidbar','Nasso',"Beha'alotcha",'Shelach','Korach','Chukat','Balak','Pinchas','Matot','Masei'],
    de_display: ['Bamidbar','Nasso','Beaalotcha','Schelach','Korach','Chukkat','Balak','Pinchas','Mattot','Masse'],
    he: ['במדבר','נשא','בהעלותך','שלח','קורח','חוקת','בלק','פינחס','מטות','מסעי'],
  },
  Devarim: {
    de: ['Devarim','Vaetchanan','Eikev',"Re'eh",'Shoftim','Ki Teitzei','Ki Tavo','Nitzavim','Vayeilech',"Ha'azinu",'Vezot Habracha'],
    de_display: ['Dewarim','Waetchanan','Ekew','Ree','Schoftim','Ki Teze','Ki Tawo','Nizawim','Wajelech','Haasinu','Wesot Habracha'],
    he: ['דברים','ואתחנן','עקב','ראה','שופטים','כי תצא','כי תבוא','נצבים','וילך','האזינו','וזאת הברכה'],
  },
};

const PARASHA_MAP = {
  Bereshit: ['Bereshit','Noach','Lech Lecha','Vayera','Chayei Sara','Toldot','Vayetzei','Vayishlach','Vayeshev','Miketz','Vayigash','Vayechi'],
  Shemot:   ['Shemot','Vaera','Bo','Beshalach','Yitro','Mishpatim','Teruma','Tetzaveh','Ki Tisa','Vayakhel','Pekudei'],
  Vayikra:  ['Vayikra','Tzav','Shemini','Tazria','Metzora','Acharei Mot','Kedoshim','Emor','Behar','Bechukotai'],
  Bamidbar: ['Bamidbar','Nasso',"Beha'alotcha",'Shelach','Korach','Chukat','Balak','Pinchas','Matot','Masei'],
  Devarim:  ['Devarim','Vaetchanan','Eikev',"Re'eh",'Shoftim','Ki Teitzei','Ki Tavo','Nitzavim','Vayeilech',"Ha'azinu",'Vezot Habracha'],
};

export const HAG_KEYS = ['Rosh Hashanah','Yom Kippur','Sukkot','Shemini Atzeret','Chanukah','Asarah BeTevet','Tu BiShvat','Purim','Pesach','Sefirat HaOmer','Yom HaShoah','Yom HaZikaron','Yom HaAtzmaut','Lag BaOmer','Yom Yerushalayim','Shavuot','Shiva Asar BeTammuz','Tisha BAv'];

export const HAGIM_NAMES = {
  de: ['Rosch Haschana','Jom Kipur','Sukkot','Schemini Azeret','Chanukka','Asara beTebet','Tu biSchewat','Purim','Pessach','Sefirat HaOmer','Jom HaSchoah','Jom HaZikaron','Jom HaAzmaut','Lag baOmer','Jom Jeruschalajim','Schawuot','17. Tammus','Tischa beAw'],
  en: ['Rosh Hashanah','Yom Kippur','Sukkot','Shemini Atzeret','Hanukkah','Asarah BeTevet','Tu BiShvat','Purim','Passover','Sefirat HaOmer','Yom HaShoah','Yom HaZikaron','Yom HaAtzmaut','Lag BaOmer','Yom Yerushalayim','Shavuot','17th of Tammuz',"Tisha B'Av"],
  fr: ['Roch Hachana','Yom Kippour','Souccot','Chemini Atseret','Hanoukka','Assara BéTévet','Tou BiChvat','Pourim',"Pessa'h",'Sefirat HaOmer','Yom HaShoah','Yom HaZikaron','Yom HaAtzmaut','Lag BaOmer','Yom Yérouchalayim','Chavouot','17 Tamouz','Tisha BeAv'],
  es: ['Rosh Hashaná','Yom Kipur','Sucot','Shemini Atzeret','Janucá','Asará BeTevet','Tu BiShvat','Purim','Pésaj','Sefirat HaOmer','Yom HaShoá','Yom HaZikaron','Yom HaAtzmaut','Lag BaOmer','Yom Yerushalayim','Shavuot','17 de Tamuz','Tisha BeAv'],
  ru: ['Рош ха-Шана','Йом Кипур','Суккот','Шмини Ацерет','Ханука','Асара бе-Тевет','Ту би-Шват','Пурим','Песах','Счёт Омера','Йом ха-Шоа','Йом ха-Зикарон','Йом ха-Ацмаут','Лаг ба-Омер','Йом Йерушалаим','Шавуот','17 Тамуза','Тиша бе-Ав'],
  he: ['ראש השנה','יום כיפור','סוכות','שמיני עצרת','חנוכה','עשרה בטבת','ט"ו בשבט','פורים','פסח','ספירת העומר','יום השואה','יום הזיכרון','יום העצמאות','ל"ג בעומר','יום ירושלים','שבועות','שבעה עשר בתמוז','תשעה באב'],
};

export function parashaDisplayName(key) {
  if (!key) return '';
  for (const book of Object.keys(TORAH)) {
    const idx = (PARASHA_MAP[book] || []).indexOf(key);
    if (idx !== -1 && TORAH[book].de_display) return TORAH[book].de_display[idx] || key;
  }
  return key;
}

export function parashaNameForLang(key, lang) {
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

export function hagNameForLang(key, lang) {
  if (!key) return '';
  const idx = HAG_KEYS.indexOf(key);
  if (idx === -1) return key;
  return (HAGIM_NAMES[lang] || HAGIM_NAMES.de)[idx] || key;
}

export function topicName(a, lang = 'de') {
  if (a.parasha) return parashaNameForLang(a.parasha, lang);
  if (a.hag)     return hagNameForLang(a.hag, lang);
  return '';
}

export function articleTitle(a, lang = 'de') {
  if (lang !== 'de' && a['title_' + lang]) return a['title_' + lang];
  return a.title || '';
}

export function articleText(a, lang = 'de') {
  if (lang !== 'de' && a['text_' + lang]) return a['text_' + lang];
  return a.text || '';
}

function baseSlug(a) {
  const year = a.date ? a.date.split('.').pop().trim() : '';
  const raw  = a.parasha ? parashaDisplayName(a.parasha) : (a.hag || '');
  if (!raw || !year) return a.id;
  return raw.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + year;
}

// Build slug map with deduplication: second article with same base gets -2, etc.
export function buildSlugMap(articles) {
  const map = {};        // slug → article
  const counts = {};     // baseSlug → count
  for (const a of articles) {
    const base = baseSlug(a);
    if (counts[base] === undefined) {
      counts[base] = 1;
      map[base] = a;
    } else {
      counts[base]++;
      map[base + '-' + counts[base]] = a;
    }
  }
  return map;
}

// Get slug for a specific article (using the same deduplication logic)
export function getSlug(article, allArticles) {
  const map = buildSlugMap(allArticles);
  for (const [slug, a] of Object.entries(map)) {
    if (a.id === article.id) return slug;
  }
  return article.id;
}

export function langSlug(slug, lang) {
  return lang === 'de' ? slug : slug + '-' + lang;
}

export function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
