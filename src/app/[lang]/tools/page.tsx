import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import ToolsClient from './ToolsClient';

type Params = Promise<{ lang: string }>;

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/tools`;
    const seo = dict.tools_index?.seo || {};

    return {
        title: seo.title || 'Free Email Security Tools - YourEmailBox',
        description: seo.description || 'Professional privacy and security tools.',
        keywords: seo.keywords || 'email tools, security',
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

export default async function ToolsPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Free Email Security Tools',
        description: 'Collection of free email security and privacy tools',
        url: `https://youremailbox.com/${lang}/tools`,
        publisher: {
            '@type': 'Organization',
            'name': 'YourEmailBox',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://youremailbox.com/logo.png'
            }
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', 'position': 1, 'name': dictionary.navigation?.home || 'Home', 'item': `https://youremailbox.com/${lang}` },
                { '@type': 'ListItem', 'position': 2, 'name': dictionary.navigation?.tools || 'Tools', 'item': `https://youremailbox.com/${lang}/tools` }
            ]
        },
        hasPart: [
            {
                '@type': 'SoftwareApplication',
                'name': 'Spam Checker',
                'applicationCategory': 'UtilitiesApplication',
                'url': `https://youremailbox.com/${lang}/tools/spam-checker`,
                'description': 'Analyze emails for spam indicators.'
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'Password Generator',
                'applicationCategory': 'UtilitiesApplication',
                'url': `https://youremailbox.com/${lang}/tools/password-generator`,
                'description': 'Generate strong, secure passwords.'
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'Email Validator',
                'applicationCategory': 'UtilitiesApplication',
                'url': `https://youremailbox.com/${lang}/tools/email-validator`,
                'description': 'Verify if an email address exists and is valid.'
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'Data Breach Checker',
                'applicationCategory': 'SecurityApplication',
                'url': `https://youremailbox.com/${lang}/tools/data-breach-checker`,
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
