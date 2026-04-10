import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import EmailValidatorClient from './EmailValidatorClient';
import { headers } from 'next/headers';
import { getDomainConfig, translateBranding } from '@/lib/domain';

type Params = Promise<{ lang: string }>;

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const currentUrl = `${baseUrl}/${lang}/tools/email-validator`;
    const seo = dict.tools?.email_validator?.seo || {};

    const t = (text: string) => translateBranding(text, siteName, domainName);

    return {
        title: t(seo.title || `Free Email Validator - YourEmailBox`),
        description: t(seo.description || 'Verify email addresses.'),
        keywords: t(seo.keywords || 'email validator'),
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/email-validator`,
                'tr': `${baseUrl}/tr/email-validator`,
                'ru': `${baseUrl}/ru/tools/email-validator`,
                'ar': `${baseUrl}/ar/tools/email-validator`,
                'fr': `${baseUrl}/fr/tools/email-validator`,
                'de': `${baseUrl}/de/tools/email-validator`,
                'es': `${baseUrl}/es/tools/email-validator`,
                'zh': `${baseUrl}/zh/tools/email-validator`,
                'it': `${baseUrl}/it/tools/email-validator`,
                'uk': `${baseUrl}/uk/tools/email-validator`,
                'fa': `${baseUrl}/fa/tools/email-validator`,
                'hi': `${baseUrl}/hi/tools/email-validator`,
                'hu': `${baseUrl}/hu/tools/email-validator`,
                'az': `${baseUrl}/az/tools/email-validator`,
                'x-default': `${baseUrl}/en/tools/email-validator`,
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
        name: t('Email Validator'),
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: t('Free email validation tool that checks syntax, MX records, and SMTP server status'),
        url: `${baseUrl}/${lang}/tools/email-validator`,
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
                    name: 'Email Validator',
                    item: `${baseUrl}/${lang}/tools/email-validator`,
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
            <EmailValidatorClient dictionary={dictionary} lang={lang} />
        </>
    );
}
