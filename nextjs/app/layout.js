import './globals.css';

export const metadata = {
  title: { default: 'Rabbiner Elishai Zizov', template: '%s — Rabbiner Elishai Zizov' },
  description: 'Rabbiner Elishai Zizov — Rabbiner, Vortragsredner und jüdischer Pädagoge in Frankfurt am Main.',
  metadataBase: new URL('https://elishaizizov.com'),
  openGraph: {
    siteName: 'Rabbiner Elishai Zizov',
    type: 'website',
    images: [{ url: '/logo.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Source+Serif+4:wght@300;400&family=Raleway:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
