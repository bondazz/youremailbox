import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import SpamCheckerClient from './SpamCheckerClient';
import { headers } from 'next/headers';
import { getDomainConfig, translateBranding } from '@/lib/domain';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const currentUrl = `${baseUrl}/${lang}/tools/spam-checker`;
    const seo = dict.tools?.spam_checker?.seo || {};

    const t = (text: string) => translateBranding(text, siteName, domainName);

    return {
        title: t(seo.title || `Free Spam Checker - YourEmailBox`),
        description: t(seo.description || 'Analyze email for spam.'),
        keywords: t(seo.keywords || 'spam checker'),
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
            title: t(seo.og_title || seo.title),
            description: t(seo.og_description || seo.description),
            url: currentUrl,
            siteName: siteName,
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
            type: 'website',
            locale: lang,
        },
        twitter: {
            card: 'summary_large_image',
            title: t(seo.twitter_title || seo.title),
            description: t(seo.twitter_description || seo.description),
            images: ['/open-graph.png'],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function Page({ params }: { params: Params }) {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    const t = (text: string) => translateBranding(text, siteName, domainName);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: t('Spam Checker'),
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: t('Free spam checker tool to analyze email content for spam triggers and improve deliverability'),
        url: `${baseUrl}/${lang}/tools/spam-checker`,
        publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`
            }
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: `${baseUrl}/${lang}`,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Tools',
                    item: `${baseUrl}/${lang}/tools`,
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Spam Checker',
                    item: `${baseUrl}/${lang}/tools/spam-checker`,
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
