export async function GET() {
    const baseUrl = 'https://youremailbox.com';
    const languages = ['en', 'tr', 'ru', 'ar', 'fr', 'de', 'es', 'zh', 'it', 'uk', 'fa', 'hi', 'hu', 'az'];
    const now = new Date().toISOString();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${languages.map(lang => `  <sitemap>
    <loc>${baseUrl}/sitemap_${lang}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new Response(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
