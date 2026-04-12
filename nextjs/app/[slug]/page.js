import { fetchAllArticles } from '../../lib/firestore';
import {
  buildSlugMap, topicName, articleTitle, articleText,
  stripHtml, LANGS, LANG_LABELS, langSlug
} from '../../lib/articles';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

const SITE_URL = 'https://elishaizizov.com';

// Detect language from slug suffix
function parseLangFromSlug(slug) {
  for (const l of LANGS) {
    if (l !== 'de' && slug.endsWith('-' + l)) {
      return { lang: l, base: slug.slice(0, -(l.length + 1)) };
    }
  }
  return { lang: 'de', base: slug };
}

export async function generateStaticParams() {
  const articles = await fetchAllArticles();
  const slugMap  = buildSlugMap(articles);
  const params   = [];
  for (const slug of Object.keys(slugMap)) {
    for (const l of LANGS) {
      params.push({ slug: langSlug(slug, l) });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const articles = await fetchAllArticles();
  const slugMap  = buildSlugMap(articles);
  const { lang, base } = parseLangFromSlug(params.slug);
  const article = slugMap[base];
  if (!article) return {};

  const title   = articleTitle(article, lang);
  const text    = articleText(article, lang);
  const topic   = topicName(article, lang);
  const excerpt = stripHtml(text).substring(0, 220);
  const image   = article.image || `${SITE_URL}/logo.png`;
  const pageUrl = `${SITE_URL}/${params.slug}`;
  const siteN   = lang === 'he' ? 'הרב אלישי זיזוב' : 'Rabbiner Elishai Zizov';

  return {
    title: `${title}${topic ? ` — ${topic}` : ''}`,
    description: excerpt,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(
        LANGS.map(l => [l, `${SITE_URL}/${langSlug(base, l)}`])
      ),
    },
    openGraph: {
      title,
      description: excerpt,
      url: pageUrl,
      type: 'article',
      images: [{ url: image }],
      siteName: siteN,
    },
  };
}

export default async function ArticlePage({ params }) {
  const articles = await fetchAllArticles();
  const slugMap  = buildSlugMap(articles);
  const { lang, base } = parseLangFromSlug(params.slug);
  const article = slugMap[base];
  if (!article) notFound();

  const title   = articleTitle(article, lang);
  const text    = articleText(article, lang);
  const topic   = topicName(article, lang);
  const isRTL   = lang === 'he';
  const siteN   = isRTL ? 'הרב אלישי זיזוב' : 'Rabbiner Elishai Zizov';

  const bodyHtml = (text || '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // JSON-LD
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: stripHtml(text).substring(0, 220),
    datePublished: article.date || '',
    author: { '@type': 'Person', name: siteN, url: SITE_URL },
    publisher: { '@type': 'Person', name: siteN, url: SITE_URL },
    url: `${SITE_URL}/${params.slug}`,
    inLanguage: lang,
    ...(article.image && { image: article.image }),
    ...(topic && { about: { '@type': 'Thing', name: topic } }),
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
      />

      {/* Logo band */}
      <div className="logo-band">
        <Link
          href="/"
          style={{
            fontFamily: 'Raleway, sans-serif', fontSize: 10,
            fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--gold)', textDecoration: 'none'
          }}
        >
          ← {isRTL ? 'חזרה' : lang === 'en' ? 'Back' : lang === 'fr' ? 'Retour' : lang === 'es' ? 'Volver' : lang === 'ru' ? 'Назад' : 'Zurück'}
        </Link>
        <Link href="/">
          <img src="/logo.png" alt={siteN} />
        </Link>
        <span style={{ width: 80 }} />
      </div>

      <div className="gold-bar" />

      {/* Article */}
      <main>
        <article
          className="article-wrap"
          dir={isRTL ? 'rtl' : 'ltr'}
          lang={lang}
        >
          {topic  && <p className="article-topic">{topic}</p>}
          <h1 className="article-title">{title}</h1>
          {article.date && <p className="article-date">{article.date}</p>}
          {article.image && (
            <img
              src={article.image}
              alt={title}
              className="article-img"
              loading="eager"
            />
          )}
          <div
            className="article-body"
            style={{ textAlign: isRTL ? 'right' : 'left' }}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* Footer: back + lang switcher */}
          <div className="article-footer">
            <Link href="/">← {siteN}</Link>
            <div className="lang-switcher">
              {LANGS.map(l => (
                <Link
                  key={l}
                  href={`/${langSlug(base, l)}`}
                  className={`lang-switch-btn${l === lang ? ' active' : ''}`}
                >
                  {LANG_LABELS[l]}
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <p className="footer-name">{siteN}</p>
        <p className="footer-copy">Frankfurt am Main · © 2025 · Alle Rechte vorbehalten</p>
      </footer>
    </>
  );
}
