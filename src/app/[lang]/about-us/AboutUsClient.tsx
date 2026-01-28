'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function AboutUsClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const content = dictionary.about_us;

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <div className="main-wrapper" style={{ padding: '40px 20px 80px 20px' }}>
                <Breadcrumbs
                    items={[
                        { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                        { label: content.title }
                    ]}
                />

                <header style={{ textAlign: 'center', marginBottom: '80px', marginTop: '40px' }}>
                    <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '24px', letterSpacing: '-1.5px', fontWeight: 900 }}>{content.title}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: content.seo_intro }} />
                </header>

                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    {content.sections.map((section: any, idx: number) => (
                        <div key={idx} style={{ marginBottom: '64px', borderLeft: '2px solid var(--accent-primary)', paddingLeft: '32px' }}>
                            <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>{section.title}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.9 }}>{section.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
