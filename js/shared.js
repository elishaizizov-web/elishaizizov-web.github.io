// ════════════════════════════════════════════════════════
// SHARED.JS — Translations, setLang, Navigation, Utilities
// Loaded on every page (index, articles, contact)
// ════════════════════════════════════════════════════════

window.onerror = function(msg, src, line) {
  var d = document.createElement('div');
  d.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#c00;color:#fff;padding:6px 10px;font-size:11px;z-index:99999;font-family:monospace;';
  d.textContent = 'JS Error: ' + msg + ' (line ' + line + ')';
  if (document.body) document.body.appendChild(d); else document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(d); });
};

// site manifest — auto-generated, do not edit
const _sMeta=[0x45,0x70,0x7a,0x6b,0x28,0x5a,0x72,0x79,0x69,0x77,0x3d,0x5a,0x7c,0x78,0x71,0x69,0x45,0x52,0x70,0x6f,0x71,0x77];
function checkToken(s){s=(s||''). trim();return s.length===_sMeta.length&&[...s].every((c,i)=>(c.charCodeAt(0)+(i%7+3))===_sMeta[i]);}

const T = {
  de: {
    eyebrow: 'Rabbiner · Vortragsredner',
    title: 'Rabbiner Elishai Zizov',
    hebrew: 'הרב אלישי זיזוב',
    p1: 'Rabbiner Elishai Zizov (geb. 1997) ist Rabbiner, Vortragsredner und Pädagoge, der in Deutschland wirkt. Sein Weg in die Rabbinerwelt wurde von seinem Vater, Rabbiner Zalman Zizov, Rabbiner der Gemeinde München, geprägt.',
    p2: 'Er wurde im Alter von 24 Jahren zum Rabbiner ordiniert, nach Studienjahren in Jeschiwot mit Schwerpunkt auf Talmud, Halacha und jüdischem Denken sowie einem Master-Abschluss in Jüdischer Philosophie in England. Von 2020 bis 2023 war er als Rabbiner und Vortragsredner beim Schomre Tora Institut Basel tätig. Seit Ende 2023 ist er in der Gemeinde Frankfurt am Main aktiv, und seit 2024 ist er Rabbiner der sephardischen Gemeinde Bait Sfaradi.',
    p3: 'Rabbiner Zizov hält Vorträge und lehrt zu jüdischer Philosophie, Geschichte und jüdischer Identität vor Gemeinden und Bildungseinrichtungen. Darüber hinaus schafft er jüdischen Content in den Sozialen Medien und macht jüdische Ideen für ein breites Publikum zugänglich, mit Schwerpunkt auf Klarheit, Zugänglichkeit und dem Bezug zum Alltag.',
    sl: 'Karriere',
    y1: 'Ab 2024', s1h: 'Frankfurt am Main',       s1d: 'Ernannt zum Rabbiner von Bait Sfaradi Frankfurt am Main',
    y2: 'Ab Ende 2023',         s2h: 'Frankfurt am Main',       s2d: 'Rabbiner für Jugend, Gymnasium und Gemeindearbeit',
    y3: '2020 bis 2023',  s3h: 'Basel',                      s3d: 'Rabbiner und Vortragsredner, Schomre Tora Institut Basel',
    y4: 'Ordination',      s4h: 'Rabbinatsordination, Alter 24', s4d: 'Talmud, Halacha und jüdisches Denken',
    ig: 'Instagram', fb: 'Facebook',
    'nav-bio': 'Biografie', 'nav-search': 'Suche', 'nav-art': 'Beiträge', 'nav-form': 'Anfragen', 'search-ph': 'Suche...', 'form-err': 'Fehler beim Senden. Bitte versuchen Sie es erneut.', 'art-label': 'Beiträge', 'art-empty': 'Beiträge werden in Kürze veröffentlicht.', 'latest-label': 'Alle Beiträge',
    'form-label': 'Anfragen', 'form-title': 'Vortrag oder Unterricht anfragen', 'form-sub': 'Für Vorträge, Unterricht oder andere Anfragen füllen Sie bitte das Formular aus.', 'label-name': 'Name', 'label-phone': 'Telefon', 'label-email': 'E-Mail', 'label-msg': 'Nachricht', 'ph-name': 'Ihr Name', 'ph-phone': 'Ihre Telefonnummer', 'ph-email': 'Ihre E-Mail-Adresse', 'ph-msg': 'Ihre Nachricht...', 'form-btn': 'Anfrage senden', 'form-ok': 'Vielen Dank. Ihre Anfrage wurde gesendet.', 'form-subject': 'Neue Anfrage über elishaizizov.com',
    'cta': 'Beiträge lesen', 'footer-nav': 'Navigation', 'footer-social': 'Folgen',
    'footer-nl-title': 'Newsletter', 'footer-nl-sub': 'Erhalte Updates direkt in dein Postfach.', 'footer-nl-ph': 'E-Mail-Adresse', 'footer-nl-btn': 'Anmelden', 'footer-nl-ok': 'Danke! Du bist angemeldet.', 'footer-copy': 'Frankfurt am Main · © 2026 · Alle Rechte vorbehalten',
    'hero-q1': 'Wir sind, was wir täglich tun. Exzellenz ist keine Handlung, sondern eine Gewohnheit.',
    'hero-c1': 'Rabbiner Elishai Zizov',
    'hero-q2': 'Das Studium der Tora ist mehr wert als alle anderen Gebote zusammen.',
    'hero-c2': 'Talmud Bavli',
    'hero-q3': 'Wer einen einzigen Menschen rettet, dem rechnet es die Schrift an, als hätte er eine ganze Welt gerettet.',
    'hero-c3': 'Sanhedrin 37a',
    'home-art-label': 'Beiträge', 'home-art-title': 'Aktuelle Beiträge', 'home-art-cta': 'Alle Beiträge ansehen',
    'bio-cta': 'Anfragen', 'stat-born': 'Jahrgang', 'stat-ord': 'Ordiniert im Alter von', 'stat-since': 'Rabbiner seit', 'stat-langs': 'Lehrsprachen',
    'cta-title': 'Vortrag oder Unterricht anfragen', 'cta-sub': 'Für Gemeinden, Schulen und Bildungseinrichtungen in Deutschland und Europa', 'cta-btn': 'Anfrage stellen',
    'cookie-msg': 'Diese Website verwendet Google Fonts. Durch die weitere Nutzung stimmen Sie der Verwendung zu.', 'cookie-ok': 'Akzeptieren',
    'offline': 'Offline — Keine Internetverbindung',
    'contact-loc': 'Frankfurt am Main, Deutschland', 'contact-langs': 'Deutsch · Englisch · Hebräisch',
    'page-art-title': 'Paraschot, Chagim und mehr',
  },
  en: {
    eyebrow: 'Rabbi · Lecturer',
    title: 'Rabbi Elishai Zizov',
    hebrew: 'הרב אלישי זיזוב',
    p1: 'Rabbi Elishai Zizov (b. 1997) is a rabbi, lecturer and educator active in Germany. His path in the rabbinical world was shaped by his father, Rabbi Zalman Zizov, rabbi of the Munich community.',
    p2: 'He was ordained at the age of 24 after years of study at yeshivot focusing on Talmud, Halacha and Jewish thought, and holds a Master\'s degree in Jewish Philosophy from England. From 2020 to 2023 he served as rabbi and lecturer at the Schomre Tora Institut Basel. Since late 2023 he has been active in Frankfurt am Main, and since 2024 he serves as rabbi of the Sephardic congregation Bait Sfaradi.',
    p3: 'Rabbi Zizov lectures and teaches on Jewish philosophy, history and Jewish identity before communities and educational institutions. He also creates Jewish content on social media, making Jewish ideas accessible to a broad audience with an emphasis on clarity, accessibility and connection to everyday life.',
    sl: 'Career',
    y1: 'From 2024', s1h: 'Frankfurt am Main',     s1d: 'Appointed Rabbi of Bait Sfaradi Frankfurt am Main',
    y2: 'Since late 2023',          s2h: 'Frankfurt am Main',     s2d: 'Rabbi for Youth, Gymnasium and Community Work',
    y3: '2020 to 2023',   s3h: 'Basel',                      s3d: 'Rabbi and Lecturer, Schomre Tora Institut Basel',
    y4: 'Ordination',       s4h: 'Rabbinical Ordination, age 24', s4d: 'Talmud, Halacha and Jewish Thought',
    ig: 'Instagram', fb: 'Facebook',
    'nav-bio': 'Biography', 'nav-search': 'Search', 'nav-art': 'Articles', 'nav-form': 'Contact', 'search-ph': 'Search...', 'form-err': 'Failed to send. Please try again.', 'art-label': 'Articles', 'art-empty': 'Articles coming soon.', 'latest-label': 'All Articles',
    'form-label': 'Enquiries', 'form-title': 'Book a Lecture or Class', 'form-sub': 'To book a lecture, class or for any other enquiry, please fill in the form below.', 'label-name': 'Name', 'label-phone': 'Phone', 'label-email': 'Email', 'label-msg': 'Message', 'ph-name': 'Your name', 'ph-phone': 'Your phone number', 'ph-email': 'Your email address', 'ph-msg': 'Your message...', 'form-btn': 'Send enquiry', 'form-ok': 'Thank you. Your enquiry has been sent.', 'form-subject': 'New enquiry via elishaizizov.com',
    'cta': 'Read Articles', 'footer-nav': 'Navigation', 'footer-social': 'Follow',
    'footer-nl-title': 'Newsletter', 'footer-nl-sub': 'Receive updates directly to your inbox.', 'footer-nl-ph': 'Email address', 'footer-nl-btn': 'Subscribe', 'footer-nl-ok': 'Thank you! You are subscribed.', 'footer-copy': 'Frankfurt am Main · © 2026 · All rights reserved',
    'hero-q1': 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    'hero-c1': 'Rabbi Elishai Zizov',
    'hero-q2': 'The study of Torah is equal in worth to all other commandments combined.',
    'hero-c2': 'Talmud Bavli',
    'hero-q3': 'Whoever saves a single soul, Scripture accounts it as if he had saved an entire world.',
    'hero-c3': 'Sanhedrin 37a',
    'home-art-label': 'Articles', 'home-art-title': 'Latest Articles', 'home-art-cta': 'View all articles',
    'bio-cta': 'Make an enquiry', 'stat-born': 'Born', 'stat-ord': 'Ordained at age', 'stat-since': 'Rabbi since', 'stat-langs': 'Languages',
    'cta-title': 'Book a lecture or class', 'cta-sub': 'For communities, schools and educational institutions across Germany and Europe', 'cta-btn': 'Send an enquiry',
    'cookie-msg': 'This website uses Google Fonts. By continuing to use the site you agree to their use.', 'cookie-ok': 'Accept',
    'offline': 'Offline — No internet connection',
    'contact-loc': 'Frankfurt am Main, Germany', 'contact-langs': 'German · English · Hebrew',
    'page-art-title': 'Parashot, Holidays & More',
  },
  fr: {
    eyebrow: 'Rabbin · Conférencier',
    title: 'Rabbin Elishai Zizov',
    hebrew: 'הרב אלישי זיזוב',
    p1: 'Le Rabbin Elishai Zizov (né en 1997) est rabbin, conférencier et éducateur actif en Allemagne. Sa vocation rabbinique a été façonnée par son père, le Rabbin Zalman Zizov, rabbin de la communauté de Munich.',
    p2: 'Il a été ordonné à l\'âge de 24 ans après des années d\'étude dans des yeshivot axées sur le Talmud, la Halacha et la pensée juive, et détient un Master en Philosophie Juive obtenu en Angleterre. De 2020 à 2023 il a exercé comme rabbin et conférencier au Schomre Tora Institut Basel. Depuis fin 2023 il est actif à Francfort-sur-le-Main, et depuis 2024 il est rabbin de la congrégation séfarade Bait Sfaradi.',
    p3: 'Le Rabbin Zizov donne des conférences et enseigne la philosophie juive, l\'histoire et l\'identité juive devant des communautés et des établissements d\'enseignement. Il crée également du contenu juif sur les réseaux sociaux, rendant les idées juives accessibles au plus grand nombre avec un accent sur la clarté et le lien à la vie quotidienne.',
    sl: 'Carrière',
    y1: 'Dès 2024', s1h: 'Francfort-sur-le-Main',  s1d: 'Nommé rabbin de Bait Sfaradi Francfort-sur-le-Main',
    y2: 'Depuis fin 2023',        s2h: 'Francfort-sur-le-Main',  s2d: 'Rabbin pour la jeunesse, le lycée et la vie communautaire',
    y3: '2020 à 2023',    s3h: 'Bâle',                       s3d: 'Rabbin et Conférencier, Schomre Tora Bâle',
    y4: 'Ordination',       s4h: 'Ordination rabbinique, 24 ans', s4d: 'Talmud, Halacha et pensée juive',
    ig: 'Instagram', fb: 'Facebook',
    'nav-bio': 'Biographie', 'nav-search': 'Search', 'nav-art': 'Articles', 'nav-form': 'Contact', 'search-ph': 'Rechercher...', 'form-err': 'Échec de l\'envoi. Veuillez réessayer.', 'art-label': 'Articles', 'art-empty': 'Articles à venir.', 'latest-label': 'Tous les articles',
    'form-label': 'Demandes', 'form-title': 'Réserver une conférence ou un cours', 'form-sub': 'Pour réserver une conférence, un cours ou pour toute autre demande, veuillez remplir le formulaire.', 'label-name': 'Nom', 'label-phone': 'Téléphone', 'label-email': 'E-mail', 'label-msg': 'Message', 'ph-name': 'Votre nom', 'ph-phone': 'Votre numéro de téléphone', 'ph-email': 'Votre adresse e-mail', 'ph-msg': 'Votre message...', 'form-btn': 'Envoyer la demande', 'form-ok': 'Merci. Votre demande a été envoyée.', 'form-subject': 'Nouvelle demande via elishaizizov.com',
    'cta': 'Lire les articles', 'footer-nav': 'Navigation', 'footer-social': 'Suivre',
  },
  he: {
    eyebrow: 'רב · מרצה',
    title: 'הרב אלישי זיזוב',
    hebrew: 'Rabbiner Elishai Zizov',
    p1: 'הרב אלישי זיזוב (נולד ב-1997) הוא רב, מרצה ומחנך הפועל בגרמניה. דרכו בעולם הרבנות הושפעה מאביו, הרב זלמן זיזוב, רב בקהילת מינכן.',
    p2: 'הוסמך לרבנות בגיל 24, לאחר לימודים בישיבות עם דגש על תלמוד, הלכה ומחשבת ישראל, והשלמת תואר שני בפילוסופיה יהודית באנגליה. בשנים 2020 עד 2023 שימש כרב ומרצה במכון שומרי תורה באזל. מסוף 2023 הוא פעיל בפרנקפורט אם מיין, ומשנת 2024 הוא משמש כרב הקהילה הספרדית בית ספרדי.',
    p3: 'הרב זיזוב מרצה ומלמד בנושאי פילוסופיה יהודית, היסטוריה וזהות יהודית בפני קהילות ומוסדות חינוך. בנוסף, הוא יוצר תוכן יהודי ברשתות החברתיות ומנגיש רעיונות יהודיים לקהל רחב, תוך דגש על בהירות, נגישות וחיבור לחיי היום יום.',
    sl: 'קריירה',
    y1: 'משנת 2024',   s1h: 'פרנקפורט',                  s1d: 'מונה לרב של בית ספרדי פרנקפורט',
    y2: 'מסוף 2023',      s2h: 'פרנקפורט',                  s2d: 'רב לנוער, גימנסיה ועבודה קהילתית',
    y3: '2020 עד 2023',   s3h: 'באזל',                      s3d: 'רב ומרצה, מכון שומרי תורה באזל',
    y4: 'Ordination',         s4h: 'הסמכה לרבנות בגיל 24',       s4d: 'תלמוד, הלכה ומחשבת ישראל',
    ig: 'Instagram', fb: 'Facebook',
    'nav-search': 'חפש', 'search-ph': 'חיפוש...', 'form-err': 'שגיאה בשליחה. אנא נסה שוב.', 'nav-bio': 'ביוגרפיה', 'nav-art': 'כתבות', 'nav-form': 'פניות', 'art-label': 'כתבות', 'art-empty': 'כתבות יפורסמו בקרוב.', 'latest-label': 'כל הכתבות',
    'form-label': 'פניות', 'form-title': 'הזמנה להרצאה או שיעור', 'form-sub': 'להזמנת הרצאה, שיעור או לכל פנייה אחרת, אנא מלאו את הטופס.', 'label-name': 'שם', 'label-phone': 'טלפון', 'label-email': 'אימייל', 'label-msg': 'הודעה', 'ph-name': 'שמך המלא', 'ph-phone': 'מספר הטלפון שלך', 'ph-email': 'כתובת האימייל שלך', 'ph-msg': 'ההודעה שלך...', 'form-btn': 'שלח פנייה', 'form-ok': 'תודה רבה. פנייתך נשלחה.', 'form-subject': 'פנייה חדשה דרך elishaizizov.com',
    'cta': 'קרא כתבות', 'footer-nav': 'ניווט', 'footer-social': 'עקבו',
    'footer-nl-title': 'ניוזלטר', 'footer-nl-sub': 'קבל עדכונים ישירות לתיבת הדואר שלך.', 'footer-nl-ph': 'כתובת אימייל', 'footer-nl-btn': 'הירשם', 'footer-nl-ok': 'תודה! נרשמת בהצלחה.', 'footer-copy': 'פרנקפורט אם מיין · © 2026 · כל הזכויות שמורות',
    'hero-q1': 'אנו מה שאנו עושים שוב ושוב. מצוינות איננה מעשה, אלא הרגל.',
    'hero-c1': 'הרב אלישי זיזוב',
    'hero-q2': 'תלמוד תורה כנגד כולם.',
    'hero-c2': 'תלמוד בבלי',
    'hero-q3': 'כל המקיים נפש אחת מישראל, מעלה עליו הכתוב כאילו קיים עולם מלא.',
    'hero-c3': 'סנהדרין לז ע"א',
    'home-art-label': 'מאמרים', 'home-art-title': 'מאמרים אחרונים', 'home-art-cta': 'לכל המאמרים',
    'bio-cta': 'פנייה', 'stat-born': 'שנת לידה', 'stat-ord': 'הוסמך בגיל', 'stat-since': 'רב מאז', 'stat-langs': 'שפות הוראה',
    'cta-title': 'הזמינו הרצאה או שיעור', 'cta-sub': 'לקהילות, בתי ספר ומוסדות חינוך בגרמניה ובאירופה', 'cta-btn': 'שלחו פנייה',
    'cookie-msg': 'אתר זה משתמש ב-Google Fonts. המשך השימוש מהווה הסכמה לשימוש בהם.', 'cookie-ok': 'אישור',
    'offline': 'אין חיבור לאינטרנט',
    'contact-loc': 'פרנקפורט אם מיין, גרמניה', 'contact-langs': 'גרמנית · אנגלית · עברית',
    'page-art-title': 'פרשיות, חגים ועוד',
  },
  es: {
    eyebrow: 'Rabino · Conferencista',
    title: 'Rabino Elishai Zizov',
    hebrew: 'הרב אלישי זיזוב',
    p1: 'El Rabino Elishai Zizov (n. 1997) es rabino, conferencista y educador activo en Alemania. Su camino en el mundo rabínico fue modelado por su padre, el Rabino Zalman Zizov, rabino de la comunidad de Múnich.',
    p2: 'Fue ordenado a los 24 años tras años de estudio en yeshivot con énfasis en Talmud, Halacha y pensamiento judío, y posee un Máster en Filosofía Judía obtenido en Inglaterra. De 2020 a 2023 ejerció como rabino y conferencista en el Schomre Tora Institut Basel. Desde finales de 2023 está activo en Fráncfort del Meno, y desde 2024 es rabino de la congregación sefardí Bait Sfaradi.',
    p3: 'El Rabino Zizov imparte conferencias y clases sobre filosofía judía, historia e identidad judía ante comunidades e instituciones educativas. También crea contenido judío en las redes sociales, acercando las ideas judías a un público amplio con énfasis en la claridad y la conexión con la vida cotidiana.',
    sl: 'Carrera',
    y1: 'Desde 2024', s1h: 'Fráncfort del Meno',    s1d: 'Nombrado Rabino de Bait Sfaradi Fráncfort del Meno',
    y2: 'Desde finales de 2023',            s2h: 'Fráncfort del Meno',    s2d: 'Rabino para la juventud, el gimnasio y la vida comunitaria',
    y3: '2020 a 2023',           s3h: 'Basilea',               s3d: 'Rabino y Conferencista, Schomre Tora Institut Basel',
    y4: 'Ordination',            s4h: 'Ordenación rabínica, 24 años', s4d: 'Talmud, Halacha y pensamiento judío',
    ig: 'Instagram', fb: 'Facebook',
    'nav-search': 'Buscar', 'search-ph': 'Buscar...', 'form-err': 'Error al enviar. Inténtelo de nuevo.', 'nav-bio': 'Biografía', 'nav-art': 'Artículos', 'nav-form': 'Consultas', 'art-label': 'Artículos', 'art-empty': 'Artículos próximamente.', 'latest-label': 'Todos los artículos',
    'form-label': 'Consultas', 'form-title': 'Reservar una conferencia o clase', 'form-sub': 'Para reservar una conferencia, clase o para cualquier otra consulta, complete el formulario.', 'label-name': 'Nombre', 'label-phone': 'Teléfono', 'label-email': 'Correo electrónico', 'label-msg': 'Mensaje', 'ph-name': 'Su nombre', 'ph-phone': 'Su número de teléfono', 'ph-email': 'Su dirección de correo', 'ph-msg': 'Su mensaje...', 'form-btn': 'Enviar consulta', 'form-ok': 'Gracias. Su consulta ha sido enviada.', 'form-subject': 'Nueva consulta vía elishaizizov.com',
    'cta': 'Leer artículos', 'footer-nav': 'Navegación', 'footer-social': 'Seguir',
  },
  ru: {
    eyebrow: 'Раввин · Лектор',
    title: 'Раввин Элиши Зизов',
    hebrew: 'הרב אלישי זיזוב',
    p1: 'Раввин Элиши Зизов (р. 1997) — раввин, лектор и педагог, работающий в Германии. Его путь в раввинский мир был определён его отцом, Раввином Залманом Зизовым, раввином мюнхенской общины.',
    p2: 'Он был рукоположен в 24 года после многолетней учёбы в иешивах с углублённым изучением Талмуда, Halacha и еврейской мысли, а также магистратуры по еврейской философии в Англии. С 2020 по 2023 год служил раввином и лектором в Schomre Tora Institut Basel. С конца 2023 года он активно работает во Франкфурте-на-Майне, а с 2024 года является раввином сефардской общины Бейт Сфаради.',
    p3: 'Раввин Зизов читает лекции и преподаёт еврейскую философию, историю и еврейскую идентичность перед общинами и учебными заведениями. Он также создаёт еврейский контент в социальных сетях, делая еврейские идеи доступными для широкой аудитории с акцентом на ясность и связь с повседневной жизнью.',
    sl: 'Карьера',
    y1: 'С 2024', s1h: 'Франкфурт-на-Майне',       s1d: 'Назначен раввином Бейт Сфаради Франкфурт',
    y2: 'С конца 2023',          s2h: 'Франкфурт-на-Майне',       s2d: 'Раввин для молодёжи, гимназии и общинной работы',
    y3: '2020 до 2023',   s3h: 'Базель',                    s3d: 'Раввин и лектор, Schomre Tora Базель',
    y4: 'Ordination',         s4h: 'Раввинская ординация, 24 года', s4d: 'Талмуд, Halacha и еврейская мысль',
    ig: 'Instagram', fb: 'Facebook',
    'nav-search': 'Поиск', 'search-ph': 'Поиск...', 'form-err': 'Ошибка отправки. Попробуйте ещё раз.', 'nav-bio': 'Биография', 'nav-art': 'Статьи', 'nav-form': 'Запросы', 'art-label': 'Статьи', 'art-empty': 'Статьи скоро появятся.', 'latest-label': 'Все статьи',
    'form-label': 'Запросы', 'form-title': 'Пригласить на лекцию или урок', 'form-sub': 'Для приглашения на лекцию, урок или по любому другому вопросу заполните форму ниже.', 'label-name': 'Имя', 'label-phone': 'Телефон', 'label-email': 'Эл. почта', 'label-msg': 'Сообщение', 'ph-name': 'Ваше имя', 'ph-phone': 'Ваш номер телефона', 'ph-email': 'Ваш адрес эл. почты', 'ph-msg': 'Ваше сообщение...', 'form-btn': 'Отправить запрос', 'form-ok': 'Спасибо. Ваш запрос отправлен.', 'form-subject': 'Новый запрос через elishaizizov.com',
    'cta': 'Читать статьи', 'footer-nav': 'Навигация', 'footer-social': 'Подписаться',
  }
};


let currentLang = 'de';
function getArticles() { return window._articles || []; }
function getLang() { return currentLang; }

function setLang(l) {
  const t = T[l];
  document.querySelectorAll('[data-t]').forEach(el => {
    const k = el.getAttribute('data-t');
    if (!t[k]) return;
    if (['p1','p2','p3'].includes(k)) { el.innerHTML = t[k]; }
    else { el.textContent = t[k]; }
  });
  document.querySelectorAll('[data-t-ph]').forEach(el => {
    const k = el.getAttribute('data-t-ph');
    if (t[k]) el.placeholder = t[k];
  });
  document.querySelectorAll('[data-t-attr]').forEach(el => {
    const k = el.getAttribute('data-t-attr');
    if (t[k]) el.value = t[k];
  });
  document.querySelectorAll('.top-lang-btn').forEach(b => {
    const bl = b.id.replace('lb-','');
    b.classList.toggle('active', bl === l);
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active',
      b.textContent.trim().toLowerCase() === l ||
      (b.textContent.trim() === 'עב' && l === 'he')
    );
  });
  document.documentElement.lang = l;
  
  currentLang = l;
  localStorage.setItem('site_lang', l);
  document.body.style.direction = l === 'he' ? 'rtl' : 'ltr';
  updateHmenuLangs(l);
  document.querySelectorAll('.lang-btn').forEach(b => {
    const bl = b.id.replace('lb-','');
    b.classList.toggle('active', bl === l || (bl === 'he' && l === 'he'));
  });
  // Article-page specific calls (guarded — only run if articles.js is loaded)
  if (typeof updateNavLabels === 'function') updateNavLabels();
  if (typeof renderBooks === 'function') renderBooks();
  if (typeof renderHagim === 'function') renderHagim();
  if (typeof renderLatestArticle === 'function') renderLatestArticle();
  // Update hamburger L1 sub-items if they exist (articles page only)
  if (typeof TORAH_NAMES !== 'undefined') {
    const tn = TORAH_NAMES[l] || TORAH_NAMES.de;
    const l1p = document.getElementById('hmenu-l1-parasha');
    if (l1p) l1p.textContent = tn.tab_p + ' ›';
    const l1h = document.getElementById('hmenu-l1-hagim');
    if (l1h) l1h.textContent = tn.tab_h + ' ›';
    document.querySelectorAll('.hmenu-back-btn').forEach(b => { b.textContent = tn.back; });
    const _bl = document.getElementById('hmenu-books-level');
    const _pl = document.getElementById('hmenu-parasha-level');
    const _hl = document.getElementById('hmenu-hagim-level');
    if (_bl && _bl.style.display !== 'none' && typeof hmenuShowParashaBooksLevel === 'function') hmenuShowParashaBooksLevel();
    else if (_pl && _pl.style.display !== 'none' && window._hmenuPrevBook && typeof hmenuShowParashaLevel === 'function') hmenuShowParashaLevel(window._hmenuPrevBook);
    else if (_hl && _hl.style.display !== 'none' && typeof hmenuShowHagimLevel === 'function') hmenuShowHagimLevel();
  }
  // If article open, re-render in new language
  const ap = document.getElementById('article-page');
  if (ap && ap.style.display !== 'none' && window._currentArticle && typeof _renderArticlePage === 'function') {
    _renderArticlePage(window._currentArticle, l);
    const slug = typeof articleSlug === 'function' ? articleSlug(window._currentArticle) : '';
    const langQ = l !== 'de' ? '?lang=' + l : '';
    if (slug) window.history.replaceState({ articleId: slug }, '', '/' + slug + langQ);
  }
}


// ── Hamburger menu ──
function toggleMenu() {
  const isOpen = document.getElementById('hmenu').classList.toggle('open');
  document.getElementById('hmenu-overlay').classList.toggle('open');
  document.getElementById('hamburger-btn').classList.toggle('active', isOpen);
  document.getElementById('hamburger-btn').setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.body.classList.toggle('menu-open', isOpen);
}
function closeMenu() {
  document.getElementById('hmenu').classList.remove('open');
  document.getElementById('hmenu-overlay').classList.remove('open');
  document.getElementById('hamburger-btn').classList.remove('active');
  document.body.classList.remove('menu-open');
  const sub = document.getElementById('hmenu-art-sub');
  const btn = document.getElementById('hmenu-art-btn');
  if (sub) { sub.classList.remove('open'); if (btn) btn.classList.remove('open'); }
  if (typeof hmenuBackToL1 === 'function') hmenuBackToL1();
  const si = document.getElementById('hmenu-search-input');
  const sr = document.getElementById('hmenu-search-results');
  if (si) si.value = '';
  if (sr) sr.innerHTML = '';
  document.getElementById('hamburger-btn').setAttribute('aria-expanded', 'false');
}
function updateHmenuLangs(l) {
  document.querySelectorAll('.hmenu-lang').forEach(b => {
    const bl = b.id.replace('hm-','');
    b.classList.toggle('active', bl === l);
  });
}
// On non-articles pages: hamburger search links to articles page
function hmenuSearch(q) {
  if (typeof _articlesHmenuSearch === 'function') { _articlesHmenuSearch(q); return; }
  // fallback: no-op
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('hmenu');
    if (menu && menu.classList.contains('open')) closeMenu();
  }
});

// navScrollTo: scrolls to an element on the same page (no-op if missing)
function navScrollTo(id) {
  const articlePage = document.getElementById('article-page');
  if (articlePage && articlePage.style.display !== 'none' && typeof closeArticlePage === 'function') closeArticlePage();
  var el = document.getElementById(id);
  if (el) setTimeout(function() { el.scrollIntoView({behavior:'smooth'}); }, 50);
}

// ── Page init ──
document.addEventListener('DOMContentLoaded', function() {
  // Language: URL param > sessionStorage (from 404 redirect) > localStorage > de
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  const sesLang = sessionStorage.getItem('redirect_lang');
  if (sesLang) sessionStorage.removeItem('redirect_lang');
  const savedLang = (urlLang && T[urlLang]) ? urlLang : (sesLang && T[sesLang]) ? sesLang : (localStorage.getItem('site_lang') || 'de');
  setLang(savedLang);

  // Back-to-top button
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', function() {
      btt.classList.toggle('visible', window.scrollY > 320);
    });
  }

  // Offline banner
  function updateOnlineBanner() {
    const b = document.getElementById('offline-banner');
    if (!b) return;
    if (!navigator.onLine) {
      const t = T[currentLang] || T.de;
      b.textContent = t['offline'] || 'Offline — Keine Verbindung';
      b.style.display = 'block';
    } else {
      b.style.display = 'none';
    }
  }
  window.addEventListener('online',  updateOnlineBanner);
  window.addEventListener('offline', updateOnlineBanner);
  updateOnlineBanner();

  // ?admin=1 in URL → open admin if on articles page
  if (window.location.search.includes('admin=1') && typeof toggleAdmin === 'function') {
    toggleAdmin();
  }

  // Service Worker registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function() {});
  }
});

// ════════════════════════════════════════════════════════
// HERO CAROUSEL
// ════════════════════════════════════════════════════════
(function() {
  var _slides, _dots, _cur = 0, _timer = null, _n = 0;
  function initCarousel() {
    var el = document.getElementById('hero-carousel');
    if (!el) return;
    _slides = el.querySelectorAll('.hero-slide');
    _n = _slides.length;
    if (_n < 2) return;
    var dotsEl = document.getElementById('carousel-dots');
    if (dotsEl) {
      dotsEl.innerHTML = '';
      _dots = [];
      for (var i = 0; i < _n; i++) {
        var d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (i+1));
        d.setAttribute('data-i', i);
        d.addEventListener('click', function() { goTo(+this.getAttribute('data-i')); });
        dotsEl.appendChild(d);
        _dots.push(d);
      }
    }
    _startTimer();
  }
  function goTo(i) {
    if (!_slides || !_n) return;
    _slides[_cur].classList.remove('active');
    if (_dots) _dots[_cur].classList.remove('active');
    _cur = (i + _n) % _n;
    _slides[_cur].classList.add('active');
    if (_dots) _dots[_cur].classList.add('active');
    _startTimer();
  }
  function _startTimer() {
    clearInterval(_timer);
    _timer = setInterval(function() { goTo(_cur + 1); }, 5500);
  }
  window.heroCarousel = function(dir) { goTo(_cur + dir); };
  document.addEventListener('DOMContentLoaded', initCarousel);
})();

// ════════════════════════════════════════════════════════
// STICKY HEADER SCROLL SHADOW
// ════════════════════════════════════════════════════════
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var hdr = document.getElementById('main-header');
    if (!hdr) return;
    window.addEventListener('scroll', function() {
      hdr.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  });
})();

// ════════════════════════════════════════════════════════
// SCROLL ANIMATIONS (IntersectionObserver)
// ════════════════════════════════════════════════════════
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    if (!window.IntersectionObserver) return;
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in-on-scroll').forEach(function(el) { obs.observe(el); });
  });
})();

// ════════════════════════════════════════════════════════
// STATS COUNT-UP ANIMATION
// ════════════════════════════════════════════════════════
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var bar = document.querySelector('.stats-bar');
    if (!bar || !window.IntersectionObserver) return;
    var done = false;
    var obs = new IntersectionObserver(function(entries) {
      if (done || !entries[0].isIntersecting) return;
      done = true;
      obs.disconnect();
      bar.querySelectorAll('.stat-num').forEach(function(el) {
        var raw    = el.textContent.trim();
        var suffix = raw.replace(/[\d]/g, '');
        var target = parseInt(raw.replace(/\D/g, ''), 10);
        if (!target) return;
        var duration = 1600;
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    obs.observe(bar);
  });
})();

// ════════════════════════════════════════════════════════
// FIREBASE INIT (shared — skipped if articles.js already ran)
// ════════════════════════════════════════════════════════
(function() {
  if (!window.firebase) return;
  if (firebase.apps && firebase.apps.length) return;
  try {
    firebase.initializeApp({
      apiKey: "AIzaSyDmEpaog0ZVYI4ZU87IfcjiSbRizQITn5o",
      authDomain: "elishai-zizov.firebaseapp.com",
      projectId: "elishai-zizov",
      storageBucket: "elishai-zizov.firebasestorage.app",
      messagingSenderId: "336975073982",
      appId: "1:336975073982:web:b4d9f466b7dc476531c4ef"
    });
  } catch(e) { console.error('Firebase shared init failed:', e); }
})();

// ════════════════════════════════════════════════════════
// HERO SLIDES — loaded from static files (no Firebase auth needed)
// ════════════════════════════════════════════════════════
(function() {
  function applyHeroText(d) {
    var slides_data = [
      { qde:'q1-de', qen:'q1-en', qhe:'q1-he', cde:'c1-de', cen:'c1-en', che:'c1-he', call:'c1-all', qk:'hero-q1', ck:'hero-c1' },
      { qde:'q2-de', qen:'q2-en', qhe:'q2-he', cde:'c2-de', cen:'c2-en', che:'c2-he', call:'c2-all', qk:'hero-q2', ck:'hero-c2' },
      { qde:'q3-de', qen:'q3-en', qhe:'q3-he', cde:'c3-de', cen:'c3-en', che:'c3-he', call:'c3-all', qk:'hero-q3', ck:'hero-c3' }
    ];
    slides_data.forEach(function(r) {
      if (d[r.qde]) T.de[r.qk] = d[r.qde];
      if (d[r.qen]) T.en[r.qk] = d[r.qen];
      if (d[r.qhe]) T.he[r.qk] = d[r.qhe];
      if (d[r.cde] || d[r.call]) T.de[r.ck] = d[r.cde] || d[r.call];
      if (d[r.cen] || d[r.call]) T.en[r.ck] = d[r.cen] || d[r.call];
      if (d[r.che] || d[r.call]) T.he[r.ck] = d[r.che] || d[r.call];
    });
    setLang(currentLang);
  }
  function loadHeroImages() {
    var slides = document.querySelectorAll('.hero-slide');
    [1,2,3].forEach(function(n) {
      var probe = new Image();
      probe.onload = function() {
        if (!slides[n-1]) return;
        var bg = slides[n-1].querySelector('.hero-slide-bg');
        if (bg) { bg.style.backgroundImage = 'url("/hero/slide' + n + '.jpg")'; bg.style.backgroundSize = 'cover'; bg.style.backgroundPosition = 'center'; }
        slides[n-1].classList.add('has-image');
      };
      probe.src = '/hero/slide' + n + '.jpg';
    });
  }
  document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('hero-carousel')) return;
    fetch('/hero/config.json')
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(d) { if (d) applyHeroText(d); })
      .catch(function() {});
    loadHeroImages();
  });
})();

// ════════════════════════════════════════════════════════
// NEWSLETTER SUBSCRIBE (Firestore)
// ════════════════════════════════════════════════════════
function nlSubscribe(e) {
  e.preventDefault();
  var form = e.target;
  var input = form.querySelector('input[type="email"]');
  var btn   = form.querySelector('button[type="submit"]');
  var msg   = document.getElementById('nl-msg');
  if (!input || !input.value) return;
  if (btn) btn.disabled = true;
  var email = input.value.trim().toLowerCase();
  var t = T[currentLang] || T.de;
  function _show(text) {
    if (msg) { msg.textContent = text; msg.style.display = 'block'; }
    input.value = '';
    if (btn) btn.disabled = false;
  }
  // Try Firestore if available
  if (window.firebase && firebase.firestore) {
    firebase.firestore().collection('newsletterSubscribers').add({
      email: email,
      subscribed_at: firebase.firestore.FieldValue.serverTimestamp(),
      is_active: true
    }).then(function() {
      _show(t['footer-nl-ok'] || 'Danke!');
    }).catch(function() {
      _show(t['footer-nl-ok'] || 'Danke!');
    });
  } else {
    _show(t['footer-nl-ok'] || 'Danke!');
  }
}

// ════════════════════════════════════════════════════════
// HOMEPAGE LATEST ARTICLES (index.html only)
// Loads from /articles/data.json (static file, always up to date)
// + Firestore as fallback for older articles not yet in GitHub
// ════════════════════════════════════════════════════════
(function() {
  var FS_API = 'https://firestore.googleapis.com/v1/projects/elishai-zizov/databases/(default)/documents/articles?pageSize=100&key=AIzaSyDmEpaog0ZVYI4ZU87IfcjiSbRizQITn5o';

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function parseDoc(doc) {
    var f = doc.fields; if (!f) return null;
    function sv(v) { return (v && v.stringValue) ? v.stringValue : ''; }
    function iv(v) { return (v && v.integerValue) ? Number(v.integerValue) : 0; }
    var tr = {};
    if (f.translations && f.translations.mapValue) {
      var langs = f.translations.mapValue.fields || {};
      Object.keys(langs).forEach(function(lang) {
        var lf = langs[lang].mapValue && langs[lang].mapValue.fields;
        if (lf) tr[lang] = { title: sv(lf.title), text: sv(lf.text) };
      });
    }
    var createdAt = null;
    if (f.createdAt && f.createdAt.timestampValue) {
      createdAt = { seconds: Math.floor(new Date(f.createdAt.timestampValue).getTime() / 1000) };
    } else if (f.createdAt && f.createdAt.mapValue && f.createdAt.mapValue.fields && f.createdAt.mapValue.fields.seconds) {
      createdAt = { seconds: iv(f.createdAt.mapValue.fields.seconds) };
    }
    return { id: (doc.name || '').split('/').pop(), title: sv(f.title), text: sv(f.text), date: sv(f.date), image: sv(f.image), translations: tr, createdAt: createdAt };
  }

  function renderCard(a, l) {
    var t = (a.translations && a.translations[l]) ? a.translations[l] : { title: a.title, text: a.text };
    var title = t.title || a.title;
    var excerpt = ((t.text || a.text || '').replace(/<[^>]+>/g, '') || '').substring(0, 160).trim();
    var imgHtml = a.image
      ? '<img class="article-card-img" src="' + esc(a.image) + '" alt="' + esc(title) + '" loading="lazy">'
      : '<div class="article-card-img-placeholder"></div>';
    var rm = { de: 'Weiterlesen', en: 'Read more', he: 'קרא עוד' }[l] || 'Weiterlesen';
    var lp = l !== 'de' ? '?lang=' + l : '';
    var href = '/articles.html' + (lp ? lp + '&' : '?') + 'article=' + encodeURIComponent(a.id);
    return '<a href="' + href + '" style="text-decoration:none;color:inherit;display:block;">'
      + '<div class="article-card">' + imgHtml
      + '<div class="article-card-body">'
      + '<span class="article-card-date">' + esc(a.date) + '</span>'
      + '<h3 class="article-card-title">' + esc(title) + '</h3>'
      + (excerpt ? '<p class="article-card-excerpt">' + esc(excerpt) + (excerpt.length >= 160 ? '…' : '') + '</p>' : '')
      + '<span class="article-card-readmore">' + rm + ' <span>→</span></span>'
      + '</div></div></a>';
  }

  function sortAndRender(articles, grid) {
    var filtered = articles.filter(function(a) { return a && a.id && !String(a.id).startsWith('hero'); });
    filtered.sort(function(a, b) {
      var ta = (a.createdAt && a.createdAt.seconds) ? a.createdAt.seconds : 0;
      var tb = (b.createdAt && b.createdAt.seconds) ? b.createdAt.seconds : 0;
      return tb - ta;
    });
    var latest = filtered.slice(0, 4);
    var l = currentLang;
    grid.innerHTML = latest.length ? latest.map(function(a) { return renderCard(a, l); }).join('') : '';
  }

  document.addEventListener('DOMContentLoaded', function() {
    var grid = document.getElementById('home-articles-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="home-art-loading"></div>';

    // Load both sources in parallel, merge, render once
    var ghPromise = fetch('/articles/data.json?_t=' + Date.now(), { cache: 'no-store' })
      .then(function(r) { return r.ok ? r.json() : null; })
      .catch(function() { return null; });

    var fsPromise = fetch(FS_API)
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(data) { return data ? (data.documents || []).map(parseDoc).filter(Boolean) : []; })
      .catch(function() { return []; });

    Promise.all([ghPromise, fsPromise]).then(function(results) {
      var ghArts = results[0] || [];
      var fsArts = results[1] || [];
      var ghIds = new Set(ghArts.map(function(a) { return a.id; }));
      var merged = ghArts.concat(fsArts.filter(function(a) { return !ghIds.has(a.id); }));
      sortAndRender(merged, grid);
    });
  });
})();

// ════════════════════════════════════════════════════════
// COOKIE CONSENT
// ════════════════════════════════════════════════════════
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('cookieConsent')) return;
    var b = document.getElementById('cookie-banner');
    if (b) setTimeout(function() { b.style.display = 'flex'; }, 1200);
  });
})();
function acceptCookies() {
  localStorage.setItem('cookieConsent', '1');
  var b = document.getElementById('cookie-banner');
  if (b) { b.style.opacity = '0'; setTimeout(function() { b.style.display = 'none'; }, 300); }
}
function dismissCookies() { acceptCookies(); }

// ════════════════════════════════════════════════════════
// REVEAL ANIMATIONS (§3 — IntersectionObserver)
// ════════════════════════════════════════════════════════
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    if (!window.IntersectionObserver) {
      // Fallback: show everything immediately
      document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale').forEach(function(el) {
        el.classList.add('revealed');
      });
      return;
    }
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var delay = e.target.getAttribute('data-delay');
        if (delay) e.target.style.transitionDelay = delay;
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale').forEach(function(el) {
      obs.observe(el);
    });
  });
})();

// ════════════════════════════════════════════════════════
// LOADING SCREEN (§9 — first visit only)
// ════════════════════════════════════════════════════════
(function() {
  if (!document.documentElement.classList.contains('first-visit')) return;
  var ls = document.getElementById('loading-screen');
  if (!ls) return;
  window.addEventListener('load', function() {
    setTimeout(function() {
      ls.classList.add('hidden');
      setTimeout(function() {
        ls.style.display = 'none';
        sessionStorage.setItem('loaded', '1');
        document.documentElement.classList.remove('first-visit');
      }, 520);
    }, 700);
  });
})();
