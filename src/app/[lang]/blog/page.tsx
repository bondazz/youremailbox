import { getDictionary } from '@/get-dictionary';
import AppLayout from '@/components/AppLayout';
import { Metadata } from 'next';
import { BlogListing } from '@/components/BlogListing';
import fs from 'fs';
import path from 'path';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/blog`;

    return {
        title: `Security Insights Blog | ${dict.title}`,
        description: 'Stay ahead of cyber threats. Read the latest updates, security protocols, and privacy tips about disposable temporary email services.',
        alternates: {
            canonical: currentUrl,
        },
        openGraph: {
            title: `Security Insights Blog | ${dict.title}`,
            description: 'Stay ahead of cyber threats. Read the latest updates, security protocols, and privacy tips.',
            url: currentUrl,
            type: 'website',
            images: [{ url: '/blog-og.png', width: 1200, height: 630 }]
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function BlogPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

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

    const baseUrl = 'https://youremailbox.com';

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
        'name': 'YourEmailBox Security Blog',
        'url': `${baseUrl}/${lang}/blog`,
        'description': dictionary.blog?.subtitle || 'Latest updates, security tips, and news about temporary email services.',
        'publisher': {
            '@type': 'Organization',
            'name': 'YourEmailBox',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://youremailbox.com/logo.png'
            }
        },
        'blogPost': posts.map((post: any) => ({
            '@type': 'BlogPosting',
            'headline': post.title,
            'image': post.image,
            'url': `${baseUrl}/${lang}/blog/${post.slug}`,
            'description': post.description || post.seoDescription,
            'datePublished': post.date ? new Date(post.date).toISOString() : undefined,
            'author': { '@type': 'Person', 'name': post.author || 'YourEmailBox Team' }
        }))
    };

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
            <BlogListing dictionary={dictionary} lang={lang} posts={posts} />
        </AppLayout>
    );
}
