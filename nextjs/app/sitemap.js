import { fetchAllArticles } from '../lib/firestore';
import { buildSlugMap, LANGS, langSlug } from '../lib/articles';

const SITE_URL = 'https://elishaizizov.com';

export default async function sitemap() {
  const articles = await fetchAllArticles();
  const slugMap  = buildSlugMap(articles);
  const entries  = [{ url: SITE_URL, lastModified: new Date(), priority: 1 }];

  for (const [slug, a] of Object.entries(slugMap)) {
    let lastMod = new Date();
    if (a.date) {
      const [d, m, y] = a.date.split('.');
      if (y && m && d) lastMod = new Date(`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`);
    }
    entries.push({ url: `${SITE_URL}/${slug}`, lastModified: lastMod, priority: 0.8 });
    for (const l of LANGS.filter(l => l !== 'de')) {
      entries.push({ url: `${SITE_URL}/${langSlug(slug, l)}`, lastModified: lastMod, priority: 0.7 });
    }
  }
  return entries;
}
