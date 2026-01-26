'use client';

import { Search, ChevronRight } from 'lucide-react';
import { BlogCard } from './BlogCard';
import Link from 'next/link';
import { Breadcrumbs } from './Breadcrumbs';

interface BlogListingProps {
    dictionary: any;
    lang: string;
    posts: any[];
}

export function BlogListing({ dictionary, lang, posts }: BlogListingProps) {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 60px 24px' }}>

            <Breadcrumbs
                items={[
                    { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                    { label: dictionary.navigation?.blog || 'Blog' }
                ]}
            />

            {/* HERO SECTION */}
            <div style={{ textAlign: 'left', marginBottom: '60px' }}>
                <h1 className="section-title" style={{ fontSize: '3.5rem', marginBottom: '20px', letterSpacing: '-1.5px' }}>{dictionary.blog?.title || 'Our Blog'}</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '32px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: 1.5, margin: 0 }}>
                        {dictionary.blog?.subtitle || 'Explore our insights on digital privacy.'}
                    </p>

                    {/* SEARCH BAR (INTEGRATED) */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                        <input
                            type="text"
                            placeholder={dictionary.blog?.search_placeholder || "Search articles..."}
                            className="glass"
                            style={{
                                width: '100%',
                                padding: '16px 20px 16px 52px',
                                borderRadius: '16px',
                                border: '1px solid var(--glass-border)',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '0.95rem',
                                background: 'rgba(255,255,255,0.02)'
                            }}
                        />
                        <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                </div>
            </div>

            {/* BLOG GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px' }} className="blog-grid">
                {posts.map((post, i) => (
                    <BlogCard key={i} {...post} lang={lang} dictionary={dictionary} />
                ))}
            </div>

            {/* NEWSLETTER SECTION */}
            <section className="glass" style={{ marginTop: '100px', padding: '60px', borderRadius: '40px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.15)', position: 'relative', overflow: 'hidden' }}>
                <div className="mesh-blob" style={{ position: 'absolute', top: '-150px', right: '-100px', width: '400px', height: '400px', opacity: 0.15 }} />

                <h2 style={{ fontSize: '2.4rem', color: '#fff', fontWeight: 900, marginBottom: '12px', letterSpacing: '-1px' }}>{dictionary.blog?.newsletter?.title || 'Stay in the loop'}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>{dictionary.blog?.newsletter?.subtitle || 'Get the latest privacy protocols delivered directly to your inbox.'}</p>

                <div style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap' }}>
                    <input
                        type="email"
                        placeholder={dictionary.blog?.newsletter?.placeholder || "your@email.com"}
                        className="glass"
                        style={{
                            flex: 1,
                            minWidth: '240px',
                            padding: '16px 24px',
                            borderRadius: '16px',
                            border: '1px solid var(--glass-border)',
                            color: '#fff',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                    <button className="premium-btn" style={{ padding: '16px 32px', fontSize: '0.95rem', borderRadius: '16px' }}>{dictionary.blog?.newsletter?.button || 'Subscribe'}</button>
                </div>
            </section>

            <style jsx>{`
                .breadcrumb-clean {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .bc-link, .bc-link:link, .bc-link:visited {
                    text-decoration: none !important;
                    color: #fff !important;
                    font-size: 0.85rem;
                    font-weight: 700;
                    transition: opacity 0.2s;
                }
                .bc-link:hover { opacity: 0.7; color: #fff !important; }
                .bc-sep { color: rgba(255,255,255,0.2); font-size: 0.8rem; }
                .bc-current { color: #fff !important; font-size: 0.85rem; font-weight: 700; }

                @media (max-width: 768px) {
                    h1 { font-size: 2.8rem !important; }
                    .glass { padding: 40px 24px !important; }
                    .blog-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
