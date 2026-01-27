import { MetadataRoute } from 'next';

const baseUrl = 'https://youremailbox.com';
const languages = ['en', 'tr', 'ru', 'ar', 'fr', 'de', 'es', 'zh', 'it', 'uk', 'fa', 'hi', 'hu', 'az'];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date().toISOString();

    // Return sitemap index pointing to language-specific sitemaps
    return languages.map(lang => ({
        url: `${baseUrl}/sitemap-${lang}.xml`,
        lastModified: now,
    }));
}
