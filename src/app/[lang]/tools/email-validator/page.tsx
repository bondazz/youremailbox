import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import EmailValidatorClient from './EmailValidatorClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/tools/email-validator`;
    const seo = dict.tools?.email_validator?.seo || {};

    return {
        title: seo.title || 'Free Email Validator - YourEmailBox',
        description: seo.description || 'Verify email addresses.',
        keywords: seo.keywords || 'email validator',
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/email-validator`,
                'tr': `${baseUrl}/tr/tools/email-validator`,
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
        name: 'Email Validator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Free email validation tool that checks syntax, MX records, and SMTP server status',
        url: `https://youremailbox.com/${lang}/tools/email-validator`,
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
                    name: 'Email Validator',
                    item: `https://youremailbox.com/${lang}/tools/email-validator`,
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
