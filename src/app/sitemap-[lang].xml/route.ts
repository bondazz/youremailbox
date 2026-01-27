import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://youremailbox.com';

type Params = {
    params: Promise<{ lang: string }>;
};

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

export async function generateSitemaps() {
    const languages = ['en', 'tr', 'ru', 'ar', 'fr', 'de', 'es', 'zh', 'it', 'uk', 'fa', 'hi', 'hu', 'az'];
    return languages.map(lang => ({ lang }));
}

export default async function sitemap({ params }: Params): Promise<MetadataRoute.Sitemap> {
    const { lang } = await params;
    const routes: MetadataRoute.Sitemap = [];
    const now = new Date().toISOString();

    // Home page for this language
    routes.push({
        url: `${baseUrl}/${lang}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
    });

    // Static pages for this language
    const staticPages = [
        { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/tools', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/about-us', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/contacts', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/privacy-policy', priority: 0.6, changeFrequency: 'yearly' as const },
        { path: '/terms-of-service', priority: 0.6, changeFrequency: 'yearly' as const },
    ];

    staticPages.forEach(page => {
        routes.push({
            url: `${baseUrl}/${lang}${page.path}`,
            lastModified: now,
            changeFrequency: page.changeFrequency,
            priority: page.priority,
        });
    });

    // Tools pages for this language
    const tools = [
        'password-generator',
        'data-breach-checker',
        'email-validator',
        'spam-checker'
    ];

    tools.forEach(tool => {
        routes.push({
            url: `${baseUrl}/${lang}/tools/${tool}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        });
    });

    // Blog posts for this language only
    const posts = getBlogPosts(lang);
    posts.forEach(slug => {
        routes.push({
            url: `${baseUrl}/${lang}/blog/${slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    return routes;
}
