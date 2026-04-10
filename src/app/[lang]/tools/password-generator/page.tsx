import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import PasswordGeneratorClient from './PasswordGeneratorClient';
import { headers } from 'next/headers';
import { getDomainConfig, translateBranding } from '@/lib/domain';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const currentUrl = `${baseUrl}/${lang}/tools/password-generator`;
    const seo = dict.tools?.password_generator?.seo || {};

    const t = (text: string) => translateBranding(text, siteName, domainName);

    return {
        title: seo.title || 'Free Password Generator - YourEmailBox',
        description: seo.description || 'Generate secure passwords.',
        keywords: seo.keywords || 'password generator',
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/password-generator`,
                'tr': `${baseUrl}/tr/tools/password-generator`,
                'ru': `${baseUrl}/ru/tools/password-generator`,
                'ar': `${baseUrl}/ar/tools/password-generator`,
                'fr': `${baseUrl}/fr/tools/password-generator`,
                'de': `${baseUrl}/de/tools/password-generator`,
                'es': `${baseUrl}/es/tools/password-generator`,
                'zh': `${baseUrl}/zh/tools/password-generator`,
                'it': `${baseUrl}/it/tools/password-generator`,
                'uk': `${baseUrl}/uk/tools/password-generator`,
                'fa': `${baseUrl}/fa/tools/password-generator`,
                'hi': `${baseUrl}/hi/tools/password-generator`,
                'hu': `${baseUrl}/hu/tools/password-generator`,
                'az': `${baseUrl}/az/tools/password-generator`,
                'x-default': `${baseUrl}/en/tools/password-generator`,
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

    // Structured Data for SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: t('Password Generator'),
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: t('Free online password generator tool that creates cryptographically secure passwords'),
        url: `${baseUrl}/${lang}/tools/password-generator`,
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
                    name: 'Password Generator',
                    item: `${baseUrl}/${lang}/tools/password-generator`,
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
            <PasswordGeneratorClient dictionary={dictionary} lang={lang} />
        </>
    );
}
