import fs from 'fs';
import path from 'path';

const baseUrl = 'https://youremailbox.com';

function getBlogPosts(lang: string): string[] {
    const postsFilePath = path.join(process.cwd(), `src/lib/data/blog_${lang}.json`);
    const fallbackPath = path.join(process.cwd(), 'src/lib/data/blog_en.json');

    try {
        const filePath = fs.existsSync(postsFilePath) ? postsFilePath : fallbackPath;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const posts = JSON.parse(fileContent);
        return posts.map((post: any) => post.slug);
    } catch (e) {
        return [];
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ lang: string }> }
) {
    const { lang } = await params;
    const now = new Date().toISOString();

    // Static pages for this language
    const staticPages = [
        { path: '', priority: '1.0', changefreq: 'daily' },
        { path: '/blog', priority: '0.8', changefreq: 'daily' },
        { path: '/tools', priority: '0.8', changefreq: 'weekly' },
        { path: '/about-us', priority: '0.7', changefreq: 'monthly' },
        { path: '/contacts', priority: '0.7', changefreq: 'monthly' },
        { path: '/privacy-policy', priority: '0.6', changefreq: 'yearly' },
        { path: '/terms-of-service', priority: '0.6', changefreq: 'yearly' },
    ];

    // Tools pages
    const tools = [
        'password-generator',
        'data-breach-checker',
        'email-validator',
        'spam-checker'
    ];

    // Blog posts for this language
    const posts = getBlogPosts(lang);

    const urls: string[] = [];

    // Add static pages
    staticPages.forEach(page => {
        urls.push(`  <url>
    <loc>${baseUrl}/${lang}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    });

    // Add tools
    tools.forEach(tool => {
        urls.push(`  <url>
    <loc>${baseUrl}/${lang}/tools/${tool}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
    });

    // Add blog posts
    posts.forEach(slug => {
        urls.push(`  <url>
    <loc>${baseUrl}/${lang}/blog/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
