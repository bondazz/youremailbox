import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import SpamCheckerClient from './SpamCheckerClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/tools/spam-checker`;
    const seo = dict.tools?.spam_checker?.seo || {};

    return {
        title: seo.title || 'Free Spam Checker - YourEmailBox',
        description: seo.description || 'Analyze email for spam.',
        keywords: seo.keywords || 'spam checker',
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/spam-checker`,
                'tr': `${baseUrl}/tr/tools/spam-checker`,
                'ru': `${baseUrl}/ru/tools/spam-checker`,
                'ar': `${baseUrl}/ar/tools/spam-checker`,
                'fr': `${baseUrl}/fr/tools/spam-checker`,
                'de': `${baseUrl}/de/tools/spam-checker`,
                'es': `${baseUrl}/es/tools/spam-checker`,
                'zh': `${baseUrl}/zh/tools/spam-checker`,
                'it': `${baseUrl}/it/tools/spam-checker`,
                'uk': `${baseUrl}/uk/tools/spam-checker`,
                'fa': `${baseUrl}/fa/tools/spam-checker`,
                'hi': `${baseUrl}/hi/tools/spam-checker`,
                'hu': `${baseUrl}/hu/tools/spam-checker`,
                'az': `${baseUrl}/az/tools/spam-checker`,
                'x-default': `${baseUrl}/en/tools/spam-checker`,
            },
        },
        openGraph: {
            title: seo.og_title || seo.title,
            description: seo.og_description || seo.description,
            url: currentUrl,
            siteName: 'YourEmailBox',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
            type: 'website',
            locale: lang,
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.twitter_title || seo.title,
            description: seo.twitter_description || seo.description,
            images: ['/open-graph.png'],
        },
        robots: {
            index: true,
            follow: true,
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
