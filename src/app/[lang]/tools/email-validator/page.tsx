import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import EmailValidatorClient from './EmailValidatorClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/tools/email-validator`;

    return {
        title: 'Free Email Validator - Verify Email Address Validity | YourEmailBox',
        description: 'Professional email validation tool. Check syntax, MX records, SMTP status, and disposable email detection. Free email verifier for better deliverability.',
        keywords: 'email validator, email verification, email checker, validate email, verify email address, email validation tool',
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/email-validator`,
                'tr': `${baseUrl}/tr/tools/email-validator`,
                'ru': `${baseUrl}/ru/tools/email-validator`,
                'ar': `${baseUrl}/ar/tools/email-validator`,
                'x-default': `${baseUrl}/en/tools/email-validator`,
            },
        },
        openGraph: {
            title: 'Free Email Validator - Verify Email Deliverability',
            description: 'Professional email verification with syntax, MX, and SMTP checks. Improve your email deliverability.',
            url: currentUrl,
            siteName: 'YourEmailBox',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
            type: 'website',
            locale: lang,
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Email Validator - YourEmailBox',
            description: 'Verify email addresses instantly with our free validation tool',
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
