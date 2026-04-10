import { getDictionary } from '@/get-dictionary';
import AppLayout from '@/components/AppLayout';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { headers } from 'next/headers';
import { getDomainConfig, translateBranding } from '@/lib/domain';

type Params = Promise<{ lang: string }>;

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const currentUrl = `${baseUrl}/${lang}/terms-of-service`;
    const seo = dict.terms_of_service?.seo || {};

    const t = (text: string) => translateBranding(text, siteName, domainName);

    return {
        title: t(seo.title || `${dict.terms_of_service?.title} - YourEmailBox`),
        description: t(seo.description || dict.meta_description),
        keywords: t(seo.keywords || 'terms of service, user agreement'),
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
            title: t(seo.og_title || seo.title || `${dict.terms_of_service?.title} | YourEmailBox`),
            description: t(seo.og_description || seo.description || dict.meta_description),
            url: currentUrl,
            siteName: siteName,
            type: 'website',
            images: [{ url: '/open-graph.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t(seo.twitter_title || seo.title || dict.terms_of_service?.title),
            description: t(seo.twitter_description || seo.description || dict.meta_description),
            images: ['/open-graph.png'],
        },
    };
}

export default async function TermsOfServicePage({ params }: { params: Params }) {
    const host = (await headers()).get('host');
    const { siteName, baseUrl, domain: domainName } = getDomainConfig(host);
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const content = dictionary.terms_of_service;

    const t = (text: string) => translateBranding(text, siteName, domainName);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': t(content.title),
        'description': t(dictionary.meta_description),
        'url': `${baseUrl}/${lang}/terms-of-service`,
        'lastReviewed': '2026-01-24',
        'publisher': {
            '@type': 'Organization',
            'name': siteName,
            'logo': {
                '@type': 'ImageObject',
                'url': `${baseUrl}/logo.png`
            }
        },
        'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': dictionary.navigation?.home || 'Home', 'item': `${baseUrl}/${lang}` },
                { '@type': 'ListItem', 'position': 2, 'name': t(content.title), 'item': `${baseUrl}/${lang}/terms-of-service` }
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
                    <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '24px' }}>{t(content.title)}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: t(content.seo_intro) }} />
                    <div style={{ marginTop: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: 600 }}>{content.last_updated}</div>
                </header>

                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    {content.sections.map((section: any, idx: number) => (
                        <div key={idx} style={{ marginBottom: '64px', borderLeft: '2px solid var(--accent-primary)', paddingLeft: '32px' }}>
                            <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px', fontWeight: 800 }}>{t(section.title)}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.9 }} dangerouslySetInnerHTML={{ __html: t(section.content) }} />
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
