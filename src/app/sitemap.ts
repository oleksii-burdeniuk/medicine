const root = 'https://medicine-sand.vercel.app';

const locales = ['en', 'uk']; // без defaultLocale

const paths = [
  '',
  '/colors',
  '/hours',
  '/work-break-time',
  '/share',
  '/contact',
  '/about',
  '/pwa', // якщо існує саме так
];

export default function sitemap() {
  const lastModified = new Date();

  const routes = [];

  // Default locale (без префікса)
  for (const path of paths) {
    routes.push({
      url: `${root}${path}`,
      lastModified,
      priority: path === '' ? 1.0 : 0.7,
      changeFrequency: path === '' ? 'weekly' : 'monthly',
    });
  }

  // Інші локалі з префіксами
  for (const locale of locales) {
    for (const path of paths) {
      routes.push({
        url: `${root}/${locale}${path}`,
        lastModified,
        priority: 0.6,
        changeFrequency: 'monthly',
      });
    }
  }

  return routes;
}
