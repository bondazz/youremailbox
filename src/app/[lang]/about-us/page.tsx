import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import AboutUsClient from './AboutUsClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/about-us`;
    const seo = dict.about_us?.seo || {};

    return {
        title: seo.title || `${dict.about_us?.title} | YourEmailBox`,
        description: seo.description || dict.about_us?.seo_intro || `Learn about the mission and technical standards of YourEmailBox.`,
        keywords: seo.keywords || 'about us, mission',
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
            title: seo.og_title || seo.title || `${dict.about_us?.title} | YourEmailBox`,
            description: seo.og_description || seo.description || dict.about_us?.seo_intro,
            url: currentUrl,
            siteName: 'YourEmailBox',
            type: 'website',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.twitter_title || seo.title || dict.about_us?.title,
            description: seo.twitter_description || seo.description || dict.about_us?.seo_intro,
            images: ['/open-graph.png'],
        },
    };
}

export default async function AboutUsPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': 'About YourEmailBox',
        'description': 'Mission and values of YourEmailBox.',
        'url': `https://youremailbox.com/${lang}/about-us`,
        'mainEntity': {
            '@type': 'Organization',
            'name': 'YourEmailBox',
            'url': 'https://youremailbox.com',
            'logo': 'https://youremailbox.com/logo.png',
            'foundingDate': '2023',
            'founders': [
                {
                    '@type': 'Person',
                    'name': 'YourEmailBox Team'
                }
            ],
            'description': 'Leading provider of secure, disposable temporary email services.'
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
