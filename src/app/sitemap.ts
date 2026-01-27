import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://youremailbox.com';
const languages = ['en', 'tr', 'ru', 'ar', 'fr', 'de', 'es', 'zh', 'it', 'uk', 'fa', 'hi', 'hu', 'az'];

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

export default function sitemap(): MetadataRoute.Sitemap {
    const routes: MetadataRoute.Sitemap = [];
    const now = new Date().toISOString();

    // Home pages for all languages
    languages.forEach(lang => {
        routes.push({
            url: `${baseUrl}/${lang}`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: lang === 'en' ? 1.0 : 0.9,
        });
    });

    // Static pages for all languages
    const staticPages = [
        { path: '/blog', priority: 0.8 },
        { path: '/tools', priority: 0.8 },
        { path: '/about-us', priority: 0.7 },
        { path: '/contacts', priority: 0.7 },
        { path: '/privacy-policy', priority: 0.6 },
        { path: '/terms-of-service', priority: 0.6 },
    ];

    languages.forEach(lang => {
        staticPages.forEach(page => {
            routes.push({
                url: `${baseUrl}/${lang}${page.path}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: page.priority,
            });
        });
    });

    // Tools pages for all languages
    const tools = [
        'password-generator',
        'data-breach-checker',
        'email-validator',
        'spam-checker'
    ];

    languages.forEach(lang => {
        tools.forEach(tool => {
            routes.push({
                url: `${baseUrl}/${lang}/tools/${tool}`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.8,
            });
        });
    });

    // Blog posts for all languages
    languages.forEach(lang => {
        const posts = getBlogPosts(lang);
        posts.forEach(slug => {
            routes.push({
                url: `${baseUrl}/${lang}/blog/${slug}`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    });

    return routes;
}
