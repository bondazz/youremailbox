import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import ToolsClient from './ToolsClient';

type Params = Promise<{ lang: string }>;

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/tools`;

    return {
        title: 'Free Email Security Tools - Password Generator, Breach Checker & More | YourEmailBox',
        description: 'Free online email security tools. Generate secure passwords, check data breaches, validate emails, and analyze spam. Professional privacy utilities with no sign-up required.',
        keywords: 'email tools, password generator, breach checker, email validator, spam checker, security tools, privacy tools',
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
            title: 'Free Email Tools | Privacy & Security Utilities',
            description: 'Professional email security tools: Password Generator, Data Breach Checker, Email Validator, and Spam Checker. All free, no sign-up required.',
            url: currentUrl,
            siteName: 'YourEmailBox',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
            type: 'website',
            locale: lang,
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Free Email Security Tools - YourEmailBox',
            description: 'Professional privacy and security tools for email protection',
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
