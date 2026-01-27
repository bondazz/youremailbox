import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import SpamCheckerClient from './SpamCheckerClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/tools/spam-checker`;

    return {
        title: 'Free Spam Checker - Analyze Email Spam Score | YourEmailBox',
        description: 'Free spam checker tool to analyze email content. Detect spam triggers, check formatting, and improve deliverability. Get detailed spam score analysis instantly.',
        keywords: 'spam checker, spam score, email spam test, spam filter, deliverability checker, spam analysis',
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/spam-checker`,
                'tr': `${baseUrl}/tr/tools/spam-checker`,
                'ru': `${baseUrl}/ru/tools/spam-checker`,
                'ar': `${baseUrl}/ar/tools/spam-checker`,
                'x-default': `${baseUrl}/en/tools/spam-checker`,
            },
        },
        openGraph: {
            title: 'Free Spam Checker - Improve Email Deliverability',
            description: 'Analyze email content for spam triggers. Get detailed spam score and improve inbox placement.',
            url: currentUrl,
            siteName: 'YourEmailBox',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
            type: 'website',
            locale: lang,
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Spam Checker - YourEmailBox',
            description: 'Analyze email content and get spam score instantly',
            images: ['/open-graph.png'],
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

export default async function Page({ params }: { params: Params }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Spam Checker',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Free spam checker tool to analyze email content for spam triggers and improve deliverability',
        url: `https://youremailbox.com/${lang}/tools/spam-checker`,
        publisher: {
            '@type': 'Organization',
            name: 'YourEmailBox',
            logo: {
                '@type': 'ImageObject',
                url: 'https://youremailbox.com/logo.png'
            }
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: `https://youremailbox.com/${lang}`,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Tools',
                    item: `https://youremailbox.com/${lang}/tools`,
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Spam Checker',
                    item: `https://youremailbox.com/${lang}/tools/spam-checker`,
                },
            ],
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <SpamCheckerClient dictionary={dictionary} lang={lang} />
        </>
    );
}
