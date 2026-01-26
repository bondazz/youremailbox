import { getDictionary } from '@/get-dictionary';
import MainApp from '@/components/MainApp';
import { Metadata, Viewport } from 'next';
import blogEn from '@/lib/data/blog_en.json';
import blogRu from '@/lib/data/blog_ru.json';

type Params = Promise<{ lang: string }>;

export const viewport: Viewport = {
    themeColor: '#4D2F97',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}`;

    return {
        title: dict.title || "Free Temporary Email - Unlimited Disposable Mail | YourEmailBox",
        description: dict.meta_description || "Get a free temporary email address in seconds. Protect your identity, avoid spam, and keep your inbox clean with our high-speed disposable mail service.",
        applicationName: 'YourEmailBox',
        authors: [{ name: 'YourEmailBox Security Team' }],
        generator: 'Next.js',
        keywords: ['free temporary email', 'disposable email', 'temp mail', 'burner email', 'fake email', 'anonymous email', 'temporary mailbox', '10 minute mail'],
        referrer: 'origin-when-cross-origin',
        creator: 'YourEmailBox Team',
        publisher: 'YourEmailBox',

        // Open Graph
        openGraph: {
            title: dict.title,
            description: dict.meta_description,
            url: currentUrl,
            siteName: 'YourEmailBox',
            images: [
                {
                    url: '/open-graph.png',
                    width: 1200,
                    height: 630,
                    alt: 'YourEmailBox - Free Temporary Email Service',
                },
            ],
            locale: lang,
            type: 'website',
        },

        // Twitter
        twitter: {
            card: 'summary_large_image',
            title: dict.title,
            description: dict.meta_description,
            creator: '@youremailbox',
            site: '@youremailbox',
            images: ['/open-graph.png'],
        },

        // Verification & Other
        other: {
            'google-adsense-account': 'ca-pub-2757499834056766',
            'mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'black-translucent',
            'apple-mobile-web-app-title': 'YourEmailBox',
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
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const posts = lang === 'ru' ? blogRu : blogEn;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'YourEmailBox - Free Temporary Email Service',
        'url': `https://youremailbox.com/${lang}`,
        'description': dictionary.meta_description,
        'applicationCategory': 'CommunicationApplication',
        'operatingSystem': 'Any',
        'keywords': 'free temporary email, disposable mail, anonymous email, temp mail',
        'author': {
            '@type': 'Organization',
            'name': 'YourEmailBox Security Team',
            'url': 'https://youremailbox.com'
        },
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'reviewCount': '12500'
        }
    };

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
