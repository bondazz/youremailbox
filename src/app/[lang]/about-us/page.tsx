import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import AboutUsClient from './AboutUsClient';
import { headers } from 'next/headers';
import { getDomainConfig, translateBranding } from '@/lib/domain';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const currentUrl = `${baseUrl}/${lang}/about-us`;
    const seo = dict.about_us?.seo || {};

    const t = (text: string) => translateBranding(text, siteName, domainName);

    return {
        title: t(seo.title || `${dict.about_us?.title} | YourEmailBox`),
        description: t(seo.description || dict.about_us?.seo_intro || `Learn about the mission and technical standards of YourEmailBox.`),
        keywords: t(seo.keywords || 'about us, mission'),
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/about-us`,
                'tr': `${baseUrl}/tr/about-us`,
                'ru': `${baseUrl}/ru/about-us`,
                'ar': `${baseUrl}/ar/about-us`,
                'fr': `${baseUrl}/fr/about-us`,
                'de': `${baseUrl}/de/about-us`,
                'es': `${baseUrl}/es/about-us`,
                'zh': `${baseUrl}/zh/about-us`,
                'it': `${baseUrl}/it/about-us`,
                'uk': `${baseUrl}/uk/about-us`,
                'fa': `${baseUrl}/fa/about-us`,
                'hi': `${baseUrl}/hi/about-us`,
                'hu': `${baseUrl}/hu/about-us`,
                'az': `${baseUrl}/az/about-us`,
                'x-default': `${baseUrl}/en/about-us`,
            },
        },
        openGraph: {
            title: t(seo.og_title || seo.title || `${dict.about_us?.title} | YourEmailBox`),
            description: t(seo.og_description || seo.description || dict.about_us?.seo_intro),
            url: currentUrl,
            siteName: siteName,
            type: 'website',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t(seo.twitter_title || seo.title || dict.about_us?.title),
            description: t(seo.twitter_description || seo.description || dict.about_us?.seo_intro),
            images: ['/open-graph.png'],
        },
    };
}

export default async function AboutUsPage({ params }: { params: Params }) {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    const t = (text: string) => translateBranding(text, siteName, domainName);

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': t(`About YourEmailBox`),
        'description': t(`Mission and values of YourEmailBox.`),
        'url': `${baseUrl}/${lang}/about-us`,
        'mainEntity': {
            '@type': 'Organization',
            'name': siteName,
            'url': baseUrl,
            'logo': `${baseUrl}/logo.png`,
            'foundingDate': '2023',
            'founders': [
                {
                    '@type': 'Person',
                    'name': `${siteName} Team`
                }
            ],
            'description': t(`Leading provider of secure, disposable temporary email services.`)
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <AboutUsClient dictionary={dictionary} lang={lang} />
        </>
    );
}
