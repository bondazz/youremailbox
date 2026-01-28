import { getDictionary } from '@/get-dictionary';
import AppLayout from '@/components/AppLayout';
import { Metadata } from 'next';
import { BlogPostContent } from '@/components/BlogPostContent';
import fs from 'fs';
import path from 'path';

type Params = Promise<{ lang: string; slug: string }>;

function getPost(slug: string, lang: string) {
    const postsFilePath = path.join(process.cwd(), `src/lib/data/blog_${lang}.json`);
    const fallbackPath = path.join(process.cwd(), 'src/lib/data/blog.json');

    try {
        const filePath = fs.existsSync(postsFilePath) ? postsFilePath : fallbackPath;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const posts = JSON.parse(fileContent);
        return posts.find((p: any) => p.slug === slug);
    } catch (e) {
        return null;
    }
}

function getAllPosts(lang: string) {
    const postsFilePath = path.join(process.cwd(), `src/lib/data/blog_${lang}.json`);
    const fallbackPath = path.join(process.cwd(), 'src/lib/data/blog.json');

    try {
        const filePath = fs.existsSync(postsFilePath) ? postsFilePath : fallbackPath;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang, slug } = await params;
    const post = getPost(slug, lang);

    if (!post) return { title: 'Post Not Found' };

    const baseUrl = 'https://youremailbox.com';
    const postUrl = `${baseUrl}/${lang}/blog/${slug}`;

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.description,
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.description,
            url: postUrl,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
        },
        alternates: {
            canonical: post.canonicalUrl || postUrl,
        },
        robots: post.robots || 'index, follow',
    };
}

export default async function BlogPostPage({ params }: { params: Params }) {
    const { lang, slug } = await params;
    const dictionary = await getDictionary(lang);
    const post = getPost(slug, lang);
    const allPosts = getAllPosts(lang);

    if (!post) return <div>Post not found</div>;

    const baseUrl = 'https://youremailbox.com';
    const postUrl = `${baseUrl}/${lang}/blog/${slug}`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': dictionary.navigation?.home || 'Home', 'item': `${baseUrl}/${lang}` },
            { '@type': 'ListItem', 'position': 2, 'name': dictionary.navigation?.blog || 'Blog', 'item': `${baseUrl}/${lang}/blog` },
            { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': postUrl }
        ]
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'name': post.title,
        'description': post.description || post.seoDescription,
        'image': post.image,
        'author': { '@type': 'Person', 'name': post.author || 'YourEmailBox Team' },
        'publisher': {
            '@type': 'Organization',
            'name': 'YourEmailBox',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://youremailbox.com/logo.png'
            }
        },
        'datePublished': (() => {
            const d = post.date ? new Date(post.date) : null;
            return (d && !isNaN(d.getTime())) ? d.toISOString() : undefined;
        })(),
        'dateModified': (() => {
            const d = post.date ? new Date(post.date) : null;
            return (d && !isNaN(d.getTime())) ? d.toISOString() : undefined;
        })(),
        'mainEntityOfPage': { '@type': 'WebPage', '@id': postUrl }
    };

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <BlogPostContent lang={lang} post={post} allPosts={allPosts} dictionary={dictionary} />
        </AppLayout>
    );
}
