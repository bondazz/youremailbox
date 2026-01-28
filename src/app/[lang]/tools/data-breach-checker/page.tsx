import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import DataBreachCheckerClient from './DataBreachCheckerClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/tools/data-breach-checker`;
    const seo = dict.tools?.breach_checker?.seo || {};

    return {
        title: seo.title || 'Free Data Breach Checker - YourEmailBox',
        description: seo.description || 'Check for data breaches.',
        keywords: seo.keywords || 'breach checker',
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/data-breach-checker`,
                'tr': `${baseUrl}/tr/tools/data-breach-checker`,
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
        name: 'Data Breach Checker',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Free tool to check if your email address has been exposed in known data breaches',
        url: `https://youremailbox.com/${lang}/tools/data-breach-checker`,
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
                    name: 'Data Breach Checker',
                    item: `https://youremailbox.com/${lang}/tools/data-breach-checker`,
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
