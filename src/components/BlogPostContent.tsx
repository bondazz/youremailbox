'use client';

import { ChevronLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, ChevronRight, List } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { BlogCard } from './BlogCard';
import { Breadcrumbs } from './Breadcrumbs';

interface BlogPostContentProps {
    lang: string;
    post: any;
    allPosts: any[];
    dictionary: any;
}

export function BlogPostContent({ lang, post, allPosts, dictionary }: BlogPostContentProps) {
    const [activeSection, setActiveSection] = useState('');
    const [headings, setHeadings] = useState<{ id: string; title: string }[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    // Dynamic Header Detection
    useEffect(() => {
        if (contentRef.current) {
            const headingElements = contentRef.current.querySelectorAll('h2');
            const detectedHeadings = Array.from(headingElements).map((el, index) => {
                const id = el.id || `section-${index}`;
                el.id = id;
                return { id, title: el.innerText };
            });
            setHeadings(detectedHeadings);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) setActiveSection(entry.target.id);
                    });
                },
                { rootMargin: '0px 0px -70% 0px', threshold: 0.1 }
            );

            headingElements.forEach((el) => observer.observe(el));
            return () => observer.disconnect();
        }
    }, [post.content]);

    // Random Related Posts Selection
    useEffect(() => {
        const filtered = allPosts.filter(p => p.slug !== post.slug);
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        setRelatedPosts(shuffled.slice(0, 3));
    }, [allPosts, post.slug]);

    const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            window.history.pushState(null, '', `#${id}`);
        }
    };

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 60px 24px' }}>

            <Breadcrumbs
                items={[
                    { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                    { label: dictionary.navigation?.blog || 'Blog', href: `/${lang}/blog` },
                    { label: post.title }
                ]}
            />

            {/* HEADER */}
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-1.2px' }}>{post.title}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent-primary)' }}>
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" alt={post.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{post.author}</span>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', gap: '8px' }}>
                            <span>{post.date}</span>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} /> {post.readTime} {dictionary.blog?.read_time || 'min read'}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* FEATURED IMAGE */}
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', aspectRatio: '16/9' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* ARTICLE AREA */}
            <div style={{ position: 'relative' }}>

                {/* TABLE OF CONTENTS - COMPACT STACKED */}
                <aside className="inline-toc">
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '16px' }}>{dictionary.blog?.toc_title || 'TABLE OF CONTENTS'}</div>
                    <nav className="toc-nav">
                        {headings.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) => handleTocClick(e, item.id)}
                                className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
                            >
                                {activeSection === item.id && <div className="active-dot" />}
                                {item.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                <article
                    className="article-body"
                    ref={contentRef}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>

            {/* RELATED ARTICLES SECTION */}
            {relatedPosts.length > 0 && (
                <section style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '32px' }}>{dictionary.blog?.related_title || 'Related articles'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {relatedPosts.map((p, i) => (
                            <BlogCard key={i} {...p} lang={lang} dictionary={dictionary} />
                        ))}
                    </div>
                </section>
            )}

            <style jsx>{`
                .breadcrumb-clean {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 32px;
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
                .bc-current { color: #fff !important; font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }

                .inline-toc {
                    float: right;
                    width: 260px;
                    margin: 0 0 32px 32px;
                    padding: 24px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.015);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    position: sticky;
                    top: 100px;
                }
                .toc-nav { display: flex; flex-direction: column; gap: 6px; }
                .toc-link {
                    position: relative;
                    display: block;
                    color: rgba(255,255,255,0.4);
                    text-decoration: none;
                    font-size: 0.85rem;
                    line-height: 1.4;
                    padding: 4px 0;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .toc-link:hover { color: #fff; }
                .toc-link.active { color: #fff; }
                .active-dot {
                    position: absolute;
                    left: -12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 4px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    box-shadow: 0 0 8px var(--accent-primary);
                }

                .article-body {
                    color: rgba(255,255,255,0.8);
                    font-size: 1.1rem;
                    line-height: 1.7;
                }
                .article-body :global(h2) {
                    color: #fff;
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin: 40px 0 20px 0;
                    letter-spacing: -0.6px;
                    scroll-margin-top: 100px;
                    clear: both;
                }
                .article-body :global(p) { margin-bottom: 24px; }
                .callout {
                    padding: 20px 24px;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    margin: 32px 0;
                }

                .mini-card {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    transition: transform 0.3s ease;
                }
                .mini-card:hover { transform: translateY(-5px); }
                .mini-card-img {
                    border-radius: 16px;
                    overflow: hidden;
                    aspect-ratio: 16/10;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .mini-card-img img { width: 100%; height: 100%; object-fit: cover; }
                .mini-card-content { display: flex; flex-direction: column; gap: 8px; }
                .mini-card-cat { color: var(--text-muted); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
                .mini-card-title { color: #fff; font-size: 1.1rem; font-weight: 800; line-height: 1.3; margin: 0; }
                .mini-card-desc { color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .mini-card-meta { display: flex; alignItems: center; gap: 8px; margin-top: 4px; }
                .mini-avatar { width: 20px; height: 20px; border-radius: 50%; background: var(--accent-primary); color: #fff; font-size: 0.6rem; display: flex; align-items: center; justifyContent: center; font-weight: 900; }
                .mini-card-meta span { color: rgba(255,255,255,0.4); font-size: 0.75rem; font-weight: 600; }

                @media (max-width: 768px) {
                    .inline-toc { float: none; width: 100%; margin: 0 0 32px 0; }
                    .bc-current { max-width: 120px; }
                    h1 { font-size: 2.2rem !important; }
                }
            `}</style>
        </div>
    );
}
