import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import ContactClient from './ContactClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: `Contact Us | YourEmailBox Security Protocol`,
        description: `Get in touch with the YourEmailBox technical team for support, security reports, or business inquiries.`,
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
