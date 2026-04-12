import { fetchAllArticles } from '../lib/firestore';
import { buildSlugMap, topicName, articleTitle, stripHtml, LANGS, LANG_LABELS, langSlug } from '../lib/articles';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 3600;

const BIO = {
  de: [
    'Rabbiner Elishai Zizov ist Rabbiner, Vortragsredner und jüdischer Pädagoge in Frankfurt am Main.',
    'Er leitet die <strong>Bait Sfaradi Gemeinde</strong> in Frankfurt und engagiert sich in der jüdischen Bildung und Erwachsenenbildung.',
    'Seine Vorträge und Beiträge verbinden tiefe Torah-Gelehrsamkeit mit zeitgemäßen Fragestellungen.',
  ],
};

function ArticleCard({ article, slug }) {
  const title   = articleTitle(article, 'de');
  const topic   = topicName(article, 'de');
  const excerpt = stripHtml(article.text || '').substring(0, 160);

  return (
    <Link href={`/${slug}`} className="article-card">
      {article.image ? (
        <img src={article.image} alt={title} className="article-card-img" loading="lazy" />
      ) : (
        <div className="article-card-placeholder">✡</div>
      )}
      <div className="article-card-body">
        {topic  && <span className="article-card-topic">{topic}</span>}
        {article.date && <span className="article-card-date">{article.date}</span>}
        <h2 className="article-card-title">{title}</h2>
        {excerpt && <p className="article-card-excerpt">{excerpt}</p>}
        <span className="article-card-readmore">Weiterlesen →</span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const articles = await fetchAllArticles();
  const slugMap  = buildSlugMap(articles);
  const latest   = articles.slice(0, 8);

  return (
    <>
      {/* Lang bar */}
      <div className="lang-bar">
        {LANGS.map(l => (
          <Link key={l} href={l === 'de' ? '/' : `/?lang=${l}`} className="lang-btn">
            {LANG_LABELS[l]}
          </Link>
        ))}
      </div>

      {/* Logo band */}
      <div className="logo-band">
        <span />
        <Link href="/">
          <img src="/logo.png" alt="Rabbiner Elishai Zizov" />
        </Link>
        <span style={{ width: 40 }} />
      </div>

      {/* Hero header */}
      <header className="page-header">
        <div className="header-inner">
          <p className="header-eyebrow">Rabbiner · Frankfurt am Main</p>
          <h1 className="header-name">Elishai Zizov</h1>
          <p className="header-hebrew">הרב אלישי זיזוב</p>
        </div>
      </header>
      <div className="gold-bar" />

      {/* Body */}
      <main className="page-body">
        {/* Bio */}
        <section className="bio-section">
          <span className="section-label">Biografie</span>
          {BIO.de.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </section>

        {/* Latest articles */}
        <section className="articles-section">
          <h2 className="articles-title">Aktuelle Beiträge</h2>
          <div className="articles-grid">
            {latest.map(a => {
              const slug = Object.entries(slugMap).find(([, v]) => v.id === a.id)?.[0] || a.id;
              return <ArticleCard key={a.id} article={a} slug={slug} />;
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-social">
          <a href="https://www.instagram.com/elishaizizov" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/share/1AdfNooWwL/" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </div>
        <p className="footer-name">Rabbiner Elishai Zizov</p>
        <p className="footer-copy">Frankfurt am Main · © 2025 · Alle Rechte vorbehalten</p>
      </footer>
    </>
  );
}
