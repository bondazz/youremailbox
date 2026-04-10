import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import ToolsClient from './ToolsClient';
import { headers } from 'next/headers';
import { getDomainConfig, translateBranding } from '@/lib/domain';

type Params = Promise<{ lang: string }>;

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const currentUrl = `${baseUrl}/${lang}/tools`;
    const seo = dict.tools_index?.seo || {};

    const t = (text: string) => translateBranding(text, siteName, domainName);

    return {
        title: t(seo.title || `Free Email Security Tools - YourEmailBox`),
        description: t(seo.description || 'Professional privacy and security tools.'),
        keywords: t(seo.keywords || 'email tools, security'),
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools`,
                'tr': `${baseUrl}/tr/tools`,
                'ru': `${baseUrl}/ru/tools`,
                'ar': `${baseUrl}/ar/tools`,
                'fr': `${baseUrl}/fr/tools`,
                'de': `${baseUrl}/de/tools`,
                'es': `${baseUrl}/es/tools`,
                'zh': `${baseUrl}/zh/tools`,
                'it': `${baseUrl}/it/tools`,
                'uk': `${baseUrl}/uk/tools`,
                'fa': `${baseUrl}/fa/tools`,
                'hi': `${baseUrl}/hi/tools`,
                'hu': `${baseUrl}/hu/tools`,
                'az': `${baseUrl}/az/tools`,
                'x-default': `${baseUrl}/en/tools`,
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

export default async function ToolsPage({ params }: { params: Params }) {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    const t = (text: string) => translateBranding(text, siteName, domainName);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: t(`Free Email Security Tools`),
        description: t(`Collection of free email security and privacy tools`),
        url: `${baseUrl}/${lang}/tools`,
        publisher: {
            '@type': 'Organization',
            'name': siteName,
            'logo': {
                '@type': 'ImageObject',
                'url': `${baseUrl}/logo.png`
            }
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', 'position': 1, 'name': dictionary.navigation?.home || 'Home', 'item': `${baseUrl}/${lang}` },
                { '@type': 'ListItem', 'position': 2, 'name': dictionary.navigation?.tools || 'Tools', 'item': `${baseUrl}/${lang}/tools` }
            ]
        },
        hasPart: [
            {
                '@type': 'SoftwareApplication',
                'name': 'Spam Checker',
                'applicationCategory': 'UtilitiesApplication',
                'url': `${baseUrl}/${lang}/tools/spam-checker`,
                'description': 'Analyze emails for spam indicators.'
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'Password Generator',
                'applicationCategory': 'UtilitiesApplication',
                'url': `${baseUrl}/${lang}/tools/password-generator`,
                'description': 'Generate strong, secure passwords.'
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'Email Validator',
                'applicationCategory': 'UtilitiesApplication',
                'url': `${baseUrl}/${lang}/tools/email-validator`,
                'description': 'Verify if an email address exists and is valid.'
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'Data Breach Checker',
                'applicationCategory': 'SecurityApplication',
                'url': `${baseUrl}/${lang}/tools/data-breach-checker`,
                'description': 'Check if your email has been compromised in a data breach.'
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <ToolsClient dictionary={dictionary} lang={lang} />
        </>
    );
}
