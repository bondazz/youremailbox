import { getDictionary } from '@/get-dictionary';
import AppLayout from '@/components/AppLayout';
import { Metadata } from 'next';
import { BlogListing } from '@/components/BlogListing';
import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';
import { getDomainConfig, translateBranding } from '@/lib/domain';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const currentUrl = `${baseUrl}/${lang}/blog`;
    const seo = dict.blog?.seo || {};

    const t = (text: string) => translateBranding(text, siteName, domainName);

    return {
        title: t(seo.title || `Security Insights Blog | ${dict.title}`),
        description: t(seo.description || 'Stay ahead of cyber threats.'),
        keywords: t(seo.keywords || 'security blog, privacy tips'),
        alternates: {
            canonical: currentUrl,
        },
        openGraph: {
            title: t(seo.og_title || seo.title),
            description: t(seo.og_description || seo.description),
            url: currentUrl,
            type: 'website',
            images: [{ url: '/blog-og.png', width: 1200, height: 630 }]
        },
        twitter: {
            card: 'summary_large_image',
            title: t(seo.twitter_title || seo.title),
            description: t(seo.twitter_description || seo.description),
            images: ['/blog-og.png'],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function BlogPage({ params }: { params: Params }) {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    const t = (text: string) => translateBranding(text, siteName, domainName);

    // Dynamic posts from our localized JSON store
    const postsFilePath = path.join(process.cwd(), `src/lib/data/blog_${lang}.json`);
    let posts = [];
    try {
        if (fs.existsSync(postsFilePath)) {
            const fileContent = fs.readFileSync(postsFilePath, 'utf8');
            posts = JSON.parse(fileContent);
        } else {
            // Fallback to default blog.json if localized doesn't exist
            const fallbackPath = path.join(process.cwd(), 'src/lib/data/blog.json');
            const fileContent = fs.readFileSync(fallbackPath, 'utf8');
            posts = JSON.parse(fileContent);
        }
    } catch (e) {
        console.error("Failed to load posts", e);
    }

    // SCHEMAS
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': dictionary.navigation?.home || 'Home', 'item': `${baseUrl}/${lang}` },
            { '@type': 'ListItem', 'position': 2, 'name': dictionary.navigation?.blog || 'Blog', 'item': `${baseUrl}/${lang}/blog` }
        ]
    };

    const blogSchema = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': `${siteName} Security Blog`,
        'url': `${baseUrl}/${lang}/blog`,
        'description': t(dictionary.blog?.subtitle || 'Latest updates, security tips, and news about temporary email services.'),
        'publisher': {
            '@type': 'Organization',
            'name': siteName,
            'logo': {
                '@type': 'ImageObject',
                'url': `${baseUrl}/logo.png`
            }
        },
        'blogPost': posts.map((post: any) => {
            const dateObj = post.date ? new Date(post.date) : null;
            const isoDate = (dateObj && !isNaN(dateObj.getTime())) ? dateObj.toISOString() : undefined;

            return {
                '@type': 'BlogPosting',
                'headline': post.title,
                'image': post.image,
                'url': `${baseUrl}/${lang}/blog/${post.slug}`,
                'description': post.description || post.seoDescription,
                'datePublished': isoDate,
                'author': { '@type': 'Person', 'name': post.author || `${siteName} Team` }
            };
        })
    };

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
            <BlogListing dictionary={dictionary} lang={lang} posts={posts} />
        </AppLayout>
    );
}
