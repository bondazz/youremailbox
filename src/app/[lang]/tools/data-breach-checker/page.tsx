import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import DataBreachCheckerClient from './DataBreachCheckerClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/tools/data-breach-checker`;

    return {
        title: 'Free Data Breach Checker - Check if Your Email Was Leaked | YourEmailBox',
        description: 'Scan 500+ breach databases instantly to see if your email was exposed in data leaks. Free breach checker tool with comprehensive security analysis.',
        keywords: 'data breach checker, email breach, password leak, security scan, breach database, email security',
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/tools/data-breach-checker`,
                'tr': `${baseUrl}/tr/tools/data-breach-checker`,
                'ru': `${baseUrl}/ru/tools/data-breach-checker`,
                'ar': `${baseUrl}/ar/tools/data-breach-checker`,
                'x-default': `${baseUrl}/en/tools/data-breach-checker`,
            },
        },
        openGraph: {
            title: 'Free Data Breach Checker - Protect Your Identity',
            description: 'Check if your email was exposed in data breaches. Scan 500+ databases instantly.',
            url: currentUrl,
            siteName: 'YourEmailBox',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
            type: 'website',
            locale: lang,
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Data Breach Checker - YourEmailBox',
            description: 'Scan global breach databases to protect your identity',
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
