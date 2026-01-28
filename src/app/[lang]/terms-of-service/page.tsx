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
    const currentUrl = `${baseUrl}/${lang}/terms-of-service`;
    const seo = dict.terms_of_service?.seo || {};

    return {
        title: seo.title || `${dict.terms_of_service?.title} - YourEmailBox`,
        description: seo.description || dict.meta_description,
        keywords: seo.keywords || 'terms of service, user agreement',
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en/terms-of-service`,
                'tr': `${baseUrl}/tr/terms-of-service`,
                'ru': `${baseUrl}/ru/terms-of-service`,
                'ar': `${baseUrl}/ar/terms-of-service`,
                'fr': `${baseUrl}/fr/terms-of-service`,
                'de': `${baseUrl}/de/terms-of-service`,
                'es': `${baseUrl}/es/terms-of-service`,
                'zh': `${baseUrl}/zh/terms-of-service`,
                'it': `${baseUrl}/it/terms-of-service`,
                'uk': `${baseUrl}/uk/terms-of-service`,
                'fa': `${baseUrl}/fa/terms-of-service`,
                'hi': `${baseUrl}/hi/terms-of-service`,
                'hu': `${baseUrl}/hu/terms-of-service`,
                'az': `${baseUrl}/az/terms-of-service`,
                'x-default': `${baseUrl}/en/terms-of-service`,
            },
        },
        openGraph: {
            title: seo.og_title || seo.title || `${dict.terms_of_service?.title} | YourEmailBox`,
            description: seo.og_description || seo.description || dict.meta_description,
            url: currentUrl,
            siteName: 'YourEmailBox',
            type: 'website',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.twitter_title || seo.title || dict.terms_of_service?.title,
            description: seo.twitter_description || seo.description || dict.meta_description,
            images: ['/open-graph.png'],
        },
    };
}

export default async function TermsOfServicePage({ params }: { params: Params }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const content = dictionary.terms_of_service;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': content.title,
        'description': dictionary.meta_description,
        'url': `https://youremailbox.com/${lang}/terms-of-service`,
        'lastReviewed': '2026-01-24',
        'publisher': {
            '@type': 'Organization',
            'name': 'YourEmailBox',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://youremailbox.com/logo.png'
            }
        },
        'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': dictionary.navigation?.home || 'Home', 'item': `https://youremailbox.com/${lang}` },
                { '@type': 'ListItem', 'position': 2, 'name': content.title, 'item': `https://youremailbox.com/${lang}/terms-of-service` }
            ]
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
                        { label: dictionary.navigation?.privacy || 'Terms of Service' }
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
