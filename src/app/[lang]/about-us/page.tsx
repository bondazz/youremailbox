import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import AboutUsClient from './AboutUsClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: `About Us | YourEmailBox Security Protocol`,
        description: `Learn about the mission and technical standards of YourEmailBox, the leading provider of high-speed temporary email services.`,
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
