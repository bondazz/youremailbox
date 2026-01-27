import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import PasswordGeneratorClient from './PasswordGeneratorClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/tools/password-generator`;

    return {
        title: 'Free Password Generator - Create Strong & Secure Passwords | YourEmailBox',
        description: 'Generate cryptographically secure passwords instantly. Customize length, use uppercase, lowercase, numbers & symbols. 100% client-side, no data stored. Free password generator tool.',
        keywords: 'password generator, secure password, random password, strong password, password creator, free password tool',
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/password-generator`,
                'tr': `${baseUrl}/tr/tools/password-generator`,
                'ru': `${baseUrl}/ru/tools/password-generator`,
                'ar': `${baseUrl}/ar/tools/password-generator`,
                'x-default': `${baseUrl}/en/tools/password-generator`,
            },
        },
        openGraph: {
            title: 'Free Password Generator - Create Strong & Secure Passwords',
            description: 'Generate military-grade passwords with our free tool. Fully customizable and 100% secure.',
            url: currentUrl,
            siteName: 'YourEmailBox',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
            type: 'website',
            locale: lang,
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Free Password Generator - YourEmailBox',
            description: 'Create cryptographically secure passwords instantly',
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

    // Structured Data for SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Password Generator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Free online password generator tool that creates cryptographically secure passwords',
        url: `https://youremailbox.com/${lang}/tools/password-generator`,
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
                    name: 'Password Generator',
                    item: `https://youremailbox.com/${lang}/tools/password-generator`,
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
