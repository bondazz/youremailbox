import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import ContactClient from './ContactClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/contacts`;

    return {
        title: `${dict.contact_us?.title} | YourEmailBox Security Protocol`,
        description: dict.contact_us?.seo_intro || `Get in touch with the YourEmailBox technical team for support, security reports, or business inquiries.`,
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/contacts`,
                'tr': `${baseUrl}/tr/contacts`,
                'ru': `${baseUrl}/ru/contacts`,
                'ar': `${baseUrl}/ar/contacts`,
                'fr': `${baseUrl}/fr/contacts`,
                'de': `${baseUrl}/de/contacts`,
                'es': `${baseUrl}/es/contacts`,
                'zh': `${baseUrl}/zh/contacts`,
                'it': `${baseUrl}/it/contacts`,
                'uk': `${baseUrl}/uk/contacts`,
                'fa': `${baseUrl}/fa/contacts`,
                'hi': `${baseUrl}/hi/contacts`,
                'hu': `${baseUrl}/hu/contacts`,
                'az': `${baseUrl}/az/contacts`,
                'x-default': `${baseUrl}/en/contacts`,
            },
        },
        openGraph: {
            title: `${dict.contact_us?.title} | YourEmailBox`,
            description: dict.contact_us?.seo_intro,
            url: currentUrl,
            siteName: 'YourEmailBox',
            type: 'website',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: dict.contact_us?.title,
            description: dict.contact_us?.seo_intro,
            images: ['/open-graph.png'],
        },
    };
}

export default async function ContactPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        'name': 'Contact YourEmailBox',
        'description': 'Get support or report security issues.',
        'url': `https://youremailbox.com/${lang}/contacts`,
        'mainEntity': {
            '@type': 'Organization',
            'name': 'YourEmailBox',
            'email': 'support@youremailbox.com',
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+1-555-012-3456',
                'contactType': 'customer service',
                'areaServed': 'US',
                'availableLanguage': ['en', 'ru', 'tr']
            }
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <ContactClient dictionary={dictionary} lang={lang} />
        </>
    );
}
