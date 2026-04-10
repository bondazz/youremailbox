import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import DataBreachCheckerClient from './DataBreachCheckerClient';
import { headers } from 'next/headers';
import { getDomainConfig, translateBranding } from '@/lib/domain';

type Params = Promise<{ lang: string }>;

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const currentUrl = `${baseUrl}/${lang}/tools/data-breach-checker`;
    const seo = dict.tools?.breach_checker?.seo || {};

    const t = (text: string) => translateBranding(text, siteName, domainName);

    return {
        title: t(seo.title || `Free Data Breach Checker - YourEmailBox`),
        description: t(seo.description || 'Check for data breaches.'),
        keywords: t(seo.keywords || 'breach checker'),
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/data-breach-checker`,
                'tr': `${baseUrl}/tr/data-breach-checker`,
                'ru': `${baseUrl}/ru/tools/data-breach-checker`,
                'ar': `${baseUrl}/ar/tools/data-breach-checker`,
                'fr': `${baseUrl}/fr/tools/data-breach-checker`,
                'de': `${baseUrl}/de/tools/data-breach-checker`,
                'es': `${baseUrl}/es/tools/data-breach-checker`,
                'zh': `${baseUrl}/zh/tools/data-breach-checker`,
                'it': `${baseUrl}/it/tools/data-breach-checker`,
                'uk': `${baseUrl}/uk/tools/data-breach-checker`,
                'fa': `${baseUrl}/fa/tools/data-breach-checker`,
                'hi': `${baseUrl}/hi/tools/data-breach-checker`,
                'hu': `${baseUrl}/hu/tools/data-breach-checker`,
                'az': `${baseUrl}/az/tools/data-breach-checker`,
                'x-default': `${baseUrl}/en/tools/data-breach-checker`,
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
        name: t('Data Breach Checker'),
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: t('Free tool to check if your email address has been exposed in known data breaches'),
        url: `${baseUrl}/${lang}/tools/data-breach-checker`,
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
                    name: 'Data Breach Checker',
                    item: `${baseUrl}/${lang}/tools/data-breach-checker`,
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
            <DataBreachCheckerClient dictionary={dictionary} lang={lang} />
        </>
    );
}
