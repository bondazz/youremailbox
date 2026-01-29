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

    // Dynamic Header Detection & ID Generation
    useEffect(() => {
        if (contentRef.current) {
            const slugify = (text: string) => {
                return text
                    .toLowerCase()
                    .trim()
                    .replace(/[əƏ]/g, 'e')
                    .replace(/[öÖ]/g, 'o')
                    .replace(/[ğĞ]/g, 'g')
                    .replace(/[üÜ]/g, 'u')
                    .replace(/[şŞ]/g, 's')
                    .replace(/[ıİiI]/g, 'i')
                    .replace(/[çÇ]/g, 'c')
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '')
                    .replace(/-+/g, '-');
            };

            const headingElements = contentRef.current.querySelectorAll('h2');
            const detectedHeadings = Array.from(headingElements).map((el, index) => {
                const generatedId = slugify(el.innerText) || `section-${index}`;
                // Use existing ID if present, otherwise set generated one
                const id = el.id || generatedId;
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 60px 24px' }}>

            <Breadcrumbs
                items={[
                    { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                    { label: dictionary.navigation?.blog || 'Blog', href: `/${lang}/blog` },
                    { label: post.title }
                ]}
            />

            {/* HEADER */}
            <header style={{ marginBottom: '40px', maxWidth: '960px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px' }}>{post.title}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-primary)', color: '#fff', fontWeight: 900, fontSize: '0.9rem' }}>
                        {post.authorImage ? (
                            <img src={post.authorImage} alt={post.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            post.author?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'A'
                        )}
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
            <div style={{ borderRadius: '24px', overflow: 'hidden', marginBottom: '48px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', aspectRatio: '21/9', maxWidth: '100%' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* CONTENT LAYOUT */}
            <div className="blog-layout">
                {/* ARTICLE CONTENT */}
                <article
                    className="article-body"
                    ref={contentRef}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* STICKY TABLE OF CONTENTS */}
                <aside className="blog-sidebar">
                    <div className="toc-container">
                        <div className="toc-header">
                            <List size={14} className="toc-icon" />
                            <span>{dictionary.blog?.toc_title || 'TABLE OF CONTENTS'}</span>
                        </div>
                        <nav className="toc-nav">
                            {headings.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => handleTocClick(e, item.id)}
                                    className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
                                >
                                    <span className="toc-link-text">{item.title}</span>
                                    {activeSection === item.id && <div className="active-indicator" />}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>
            </div>

            {/* RELATED ARTICLES SECTION */}
            {relatedPosts.length > 0 && (
                <section style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '40px', letterSpacing: '-0.5px' }}>{dictionary.blog?.related_title || 'Related articles'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {relatedPosts.map((p, i) => (
                            <BlogCard key={i} {...p} lang={lang} dictionary={dictionary} />
                        ))}
                    </div>
                </section>
            )}

            <style jsx>{`
                .blog-layout {
                    display: flex;
                    gap: 60px;
                    align-items: start;
                    position: relative;
                }

                .article-body {
                    flex: 1;
                    min-width: 0;
                    color: rgba(255,255,255,0.85);
                    font-size: 1.15rem;
                    line-height: 1.8;
                }

                .article-body :global(h2) {
                    color: #fff;
                    font-size: 2rem;
                    font-weight: 800;
                    margin: 48px 0 24px 0;
                    letter-spacing: -0.8px;
                    scroll-margin-top: 120px;
                }

                .article-body :global(p) {
                    margin-bottom: 28px;
                }

                .article-body :global(b), .article-body :global(strong) {
                    color: #fff;
                    font-weight: 700;
                }

                .article-body :global(ul), .article-body :global(ol) {
                    margin-bottom: 32px;
                    padding-left: 20px;
                }

                .article-body :global(li) {
                    margin-bottom: 12px;
                }

                .blog-sidebar {
                    width: 300px;
                    position: sticky;
                    top: 100px;
                    z-index: 10;
                }

                .toc-container {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 20px;
                    padding: 24px;
                    backdrop-filter: blur(10px);
                }

                .toc-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.75rem;
                    font-weight: 900;
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 20px;
                }

                .toc-icon {
                    color: var(--accent-primary);
                }

                .toc-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .toc-link {
                    position: relative;
                    padding: 8px 12px;
                    border-radius: 8px;
                    text-decoration: none;
                    color: rgba(255,255,255,0.4);
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .toc-link:hover {
                    background: rgba(255,255,255,0.03);
                    color: rgba(255,255,255,0.8);
                }

                .toc-link.active {
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                }

                .active-indicator {
                    width: 6px;
                    height: 6px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--accent-primary);
                }

                @media (max-width: 1100px) {
                    .blog-layout {
                        flex-direction: column-reverse;
                        gap: 40px;
                    }

                    .blog-sidebar {
                        width: 100%;
                        position: static;
                    }

                    .toc-container {
                        position: static;
                    }
                }

                @media (max-width: 768px) {
                    h1 { font-size: 2.5rem !important; }
                    .article-body { font-size: 1.05rem; }
                }
            `}</style>
        </div>
    );
}
