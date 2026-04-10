import { getDictionary } from '@/get-dictionary';
import MainApp from '@/components/MainApp';
import { Metadata, Viewport } from 'next';
import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';
import { getDomainConfig } from '@/lib/domain';

type Params = Promise<{ lang: string }>;

export const viewport: Viewport = {
    themeColor: '#4D2F97',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain } = getDomainConfig(host);
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const seo = dict.home?.seo || {};

    const currentUrl = `${baseUrl}/${lang}`;

    const translate = (text: string) => text?.replace(/YourEmailBox/g, siteName).replace(/youremailbox\.com/g, domain);

    return {
        title: translate(seo.title || dict.title || `Free Temporary Email - ${siteName}`),
        description: translate(seo.description || dict.meta_description || "Get a free temporary email address."),
        applicationName: siteName,
        authors: [{ name: `${siteName} Security Team` }],
        generator: 'Next.js',
        keywords: seo.keywords ? seo.keywords.split(', ') : ['free temporary email', 'disposable email', 'temp mail'],
        referrer: 'origin-when-cross-origin',
        creator: `${siteName} Team`,
        publisher: siteName,

        // Open Graph
        openGraph: {
            title: translate(seo.og_title || seo.title || dict.title),
            description: translate(seo.og_description || seo.description || dict.meta_description),
            url: currentUrl,
            siteName: siteName,
            images: [
                {
                    url: '/open-graph.png',
                    width: 1200,
                    height: 630,
                    alt: `${siteName} - Free Temporary Email Service`,
                },
            ],
            locale: lang,
            type: 'website',
        },

        // Twitter
        twitter: {
            card: 'summary_large_image',
            title: translate(seo.twitter_title || seo.title || dict.title),
            description: translate(seo.twitter_description || seo.description || dict.meta_description),
            creator: `@${siteName.toLowerCase()}`,
            site: `@${siteName.toLowerCase()}`,
            images: ['/open-graph.png'],
        },

        // Verification & Other
        other: {
            'google-adsense-account': 'ca-pub-2757499834056766',
            'mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'black-translucent',
            'apple-mobile-web-app-title': siteName,
        },

        // Alternates
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en`,
                'tr': `${baseUrl}/tr`,
                'ru': `${baseUrl}/ru`,
                'ar': `${baseUrl}/ar`,
                'fr': `${baseUrl}/fr`,
                'de': `${baseUrl}/de`,
                'es': `${baseUrl}/es`,
                'zh': `${baseUrl}/zh`,
                'it': `${baseUrl}/it`,
                'uk': `${baseUrl}/uk`,
                'fa': `${baseUrl}/fa`,
                'hi': `${baseUrl}/hi`,
                'hu': `${baseUrl}/hu`,
                'az': `${baseUrl}/az`,
                'x-default': `${baseUrl}/en`,
            },
        },

        // Robots
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

        // Icons
        icons: {
            icon: [
                { url: '/favicon.ico' },
                { url: '/favicon.svg', type: 'image/svg+xml' }
            ],
            apple: [
                { url: '/apple-touch-icon.png' }
            ],
            other: [
                { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#4d2f97' }
            ],
        },

        // Manifest
        manifest: '/manifest.webmanifest',
    };
}

export default async function Page({ params }: { params: Params }) {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain } = getDomainConfig(host);
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    // Dynamic post loading for all languages
    let posts = [];
    try {
        const postsFilePath = path.join(process.cwd(), `src/lib/data/blog_${lang}.json`);
        const fallbackPath = path.join(process.cwd(), 'src/lib/data/blog_en.json');
        const filePath = fs.existsSync(postsFilePath) ? postsFilePath : fallbackPath;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        posts = JSON.parse(fileContent);
    } catch (e) {
        posts = [];
    }

    const faqSchema = dictionary.seo_content?.faq_list?.map((faq: any) => ({
        '@type': 'Question',
        'name': faq.q.replace(/YourEmailBox/g, siteName),
        'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.a.replace(/YourEmailBox/g, siteName)
        }
    })) || [];

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': siteName,
            'url': baseUrl,
            'logo': `${baseUrl}/logo.png`,
            'sameAs': [
                `https://twitter.com/${siteName.toLowerCase()}`,
                `https://github.com/${siteName.toLowerCase()}`
            ],
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+1-555-012-3456',
                'contactType': 'customer service',
                'areaServed': 'US',
                'availableLanguage': ['en', 'ru', 'tr', 'az']
            }
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': siteName,
            'url': baseUrl,
            'potentialAction': {
                '@type': 'SearchAction',
                'target': `${baseUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string'
            }
        },
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': siteName,
            'applicationCategory': 'CommunicationApplication',
            'operatingSystem': 'Any',
            'description': dictionary.meta_description?.replace(/YourEmailBox/g, siteName).replace(/youremailbox\.com/g, domain),
            'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'USD'
            },
            'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingValue': '4.9',
                'ratingCount': '12500'
            }
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqSchema
        },
        {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            'name': `How to use ${siteName}`,
            'description': `Learn how to protect your privacy with instant temporary email addresses.`,
            'thumbnailUrl': `${baseUrl}/og-image-global.png`,
            'uploadDate': '2024-01-01T08:00:00+08:00',
            'contentUrl': 'https://www.w3schools.com/html/mov_bbb.mp4'
        }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MainApp dictionary={dictionary} lang={lang} posts={posts} />
        </>
    );
}
