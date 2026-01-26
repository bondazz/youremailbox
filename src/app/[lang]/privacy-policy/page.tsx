import { getDictionary } from '@/get-dictionary';
import AppLayout from '@/components/AppLayout';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';

type Params = Promise<{ lang: string }>;

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = 'https://youremailbox.com';
    const currentUrl = `${baseUrl}/${lang}/privacy-policy`;

    return {
        title: `${dict.privacy_policy?.title} - YourEmailBox Security Protocol`,
        description: dict.meta_description,
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/privacy-policy`,
                'tr': `${baseUrl}/tr/privacy-policy`,
                'ru': `${baseUrl}/ru/privacy-policy`,
                'ar': `${baseUrl}/ar/privacy-policy`,
                'fr': `${baseUrl}/fr/privacy-policy`,
                'de': `${baseUrl}/de/privacy-policy`,
                'es': `${baseUrl}/es/privacy-policy`,
                'it': `${baseUrl}/it/privacy-policy`,
                'x-default': `${baseUrl}/en/privacy-policy`,
            },
        },
        openGraph: {
            title: `${dict.privacy_policy?.title} | YourEmailBox`,
            description: dict.meta_description,
            url: currentUrl,
            siteName: 'YourEmailBox',
            type: 'website',
            images: [{ url: '/open-graph.png' }],
        },
        twitter: {
            card: 'summary_large_image',
            title: dict.privacy_policy?.title,
            description: dict.meta_description,
            images: ['/open-graph.png'],
        },
    };
}

export default async function PrivacyPolicyPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const content = dictionary.privacy_policy;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': content.title,
        'description': dictionary.meta_description,
        'url': `https://youremailbox.com/${lang}/privacy-policy`,
        'lastReviewed': '2026-01-24',
        'publisher': {
            '@type': 'Organization',
            'name': 'YourEmailBox',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://youremailbox.com/logo.png'
            }
        }
    };

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="main-wrapper" style={{ padding: '40px 20px 80px 20px' }}>
                <Breadcrumbs
                    items={[
                        { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                        { label: dictionary.navigation?.privacy || 'Privacy Policy' }
                    ]}
                />

                <header style={{ textAlign: 'center', marginBottom: '80px', marginTop: '40px' }}>
                    <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '24px' }}>{content.title}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: content.seo_intro }} />
                    <div style={{ marginTop: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: 600 }}>{content.last_updated}</div>
                </header>

                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    {content.sections.map((section: any, idx: number) => (
                        <div key={idx} style={{ marginBottom: '64px', borderLeft: '2px solid var(--accent-primary)', paddingLeft: '32px' }}>
                            <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px', fontWeight: 800 }}>{section.title}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.9 }} dangerouslySetInnerHTML={{ __html: section.content }} />
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
