'use client';

import { useState, useEffect } from 'react';
import { useEmail, Email } from '@/hooks/useEmail';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Copy, RefreshCw, Trash2, Edit2, CheckCircle2, QrCode, Clock, Globe, ArrowRight, Menu, X, ChevronRight, Mail, Shield, Zap, Search, Check, PlusCircle, Inbox, ArrowLeft, Dices, ChevronUp } from 'lucide-react';
import { BlogCard } from './BlogCard';
import AppLayout from './AppLayout';
import Link from 'next/link';

interface Props {
    dictionary: any;
    lang: string;
    posts?: any[];
}

export default function MainApp({ dictionary, lang, posts = [] }: Props) {
    const { alias, emails, loading, refreshAction, deleteMailbox, setCustomAlias, fetchEmails } = useEmail();
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [copied, setCopied] = useState(false);
    const [showChangeModal, setShowChangeModal] = useState(false);
    const [customPrefix, setCustomPrefix] = useState('');
    const [isSeoExpanded, setIsSeoExpanded] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showPremiumPart, setShowPremiumPart] = useState(false);

    // Delayed premium part reveal
    useEffect(() => {
        if (showChangeModal) {
            const timer = setTimeout(() => setShowPremiumPart(true), 1200);
            return () => clearTimeout(timer);
        } else {
            setShowPremiumPart(false);
        }
    }, [showChangeModal]);
    // Lock scroll when modal is open
    useEffect(() => {
        if (showChangeModal) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.paddingRight = '5px'; // Prevent layout shift from scrollbar removal
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [showChangeModal]);

    const copyToClipboard = () => {
        if (alias) {
            navigator.clipboard.writeText(alias);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleChange = () => {
        if (customPrefix.trim()) {
            setCustomAlias(customPrefix.trim());
            setShowChangeModal(false);
            setCustomPrefix('');
        }
    };

    const handleInboxRefresh = async (e?: any) => {
        if (e) e.preventDefault();
        setIsRefreshing(true);
        try {
            await fetchEmails();
        } finally {
            // Keep the success state for a bit for visual feedback
            setTimeout(() => setIsRefreshing(false), 1500);
        }
    };

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <div className="main-wrapper" style={{ padding: '0 20px' }}>

                {/* HERO */}
                <header style={{ textAlign: 'center', padding: '40px 0 40px 0' }}>
                    <h1
                        className="hero-title"
                        style={{
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            marginBottom: '12px',
                            opacity: 1, /* Critical for LCP */
                            transform: 'translateZ(0)'
                        }}
                    >
                        {dictionary.hero?.title || 'Free Temporary Email'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', maxWidth: '600px', margin: '0 auto', fontWeight: 500 }}>
                        {dictionary.hero?.subtitle || 'Temp mail protects your privacy and keeps your inbox spam-free'}
                    </p>
                </header>

                {/* MAIN TOOL */}
                <section style={{ marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '540px', minHeight: '84px' }}> {/* CLS Fix: min-height */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            padding: '14px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(10px)',
                            height: '72px' /* Strict height for CLS zero */
                        }}>
                            <code style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.25rem)', color: '#fff', fontWeight: 600, opacity: 0.9, letterSpacing: '0.5px' }}>
                                {alias || '••••••••@••••.•••'}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                aria-label={dictionary.buttons?.copy || "Copy email address"}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: copied ? '#10b981' : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 'clamp(10px, 3vw, 24px)',
                            flexWrap: 'wrap'
                        }}>
                            <SmallActionButton icon={<Copy size={16} />} label={dictionary.buttons?.copy?.toLowerCase() || "copy"} onClick={copyToClipboard} color={copied ? '#10b981' : undefined} />
                            <SmallActionButton icon={<RefreshCw size={16} />} label={dictionary.buttons?.random?.toLowerCase() || "random"} onClick={refreshAction} />
                            <SmallActionButton icon={<PlusCircle size={16} />} label={dictionary.buttons?.change?.toLowerCase() || "change"} onClick={(e: any) => { e?.preventDefault(); setShowChangeModal(true); }} />
                            <SmallActionButton icon={<Trash2 size={16} />} label={dictionary.buttons?.delete?.toLowerCase() || "delete"} onClick={deleteMailbox} color="#f43f5e" />
                        </div>
                    </div>
                </section>

                {/* INBOX SECTION */}
                <section style={{ marginBottom: '80px' }}>
                    <AnimatePresence mode="wait">
                        {!selectedEmail ? (
                            <div className="glass" style={{ borderRadius: '28px', overflow: 'hidden' }}>
                                <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                                    <h2 className="section-title" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Inbox size={20} color="var(--accent-primary)" /> {dictionary.inbox?.messages || 'Messages'}
                                    </h2>
                                    <button
                                        onClick={handleInboxRefresh}
                                        disabled={loading}
                                        aria-label={dictionary.inbox?.refresh || "Refresh inbox"}
                                        style={{
                                            minWidth: isRefreshing ? '110px' : '40px',
                                            height: '40px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            borderRadius: '12px',
                                            background: isRefreshing ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                            border: `1px solid ${isRefreshing ? 'rgba(59, 130, 246, 0.3)' : 'var(--glass-border)'}`,
                                            color: isRefreshing ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.6)',
                                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            padding: isRefreshing ? '0 16px' : '0',
                                            gap: '8px',
                                            fontSize: '0.8rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        <AnimatePresence mode="wait">
                                            {isRefreshing ? (
                                                <motion.div
                                                    key="success"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                                >
                                                    <CheckCircle2 size={16} />
                                                    <span>{dictionary.inbox?.refresh_status_updated || 'Updated'}</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="refresh"
                                                    initial={{ opacity: 0, rotate: -180 }}
                                                    animate={{ opacity: 1, rotate: 0 }}
                                                    exit={{ opacity: 0, rotate: 180 }}
                                                >
                                                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </div>
                                <div style={{
                                    minHeight: '350px',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: emails.length === 0 ? 'center' : 'stretch',
                                    justifyContent: emails.length === 0 ? 'center' : 'flex-start'
                                }}>
                                    {emails.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px 0', zIndex: 10 }}>
                                            <ModernMailboxLoader />
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                style={{
                                                    fontWeight: 800,
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(255,255,255,0.7)',
                                                    letterSpacing: '2px',
                                                    marginTop: '20px',
                                                    fontFamily: 'var(--font-outfit)'
                                                }}
                                            >
                                                {dictionary.inbox?.waiting?.toUpperCase() || 'WAITING FOR INCOMING MESSAGES...'}
                                            </motion.p>
                                        </div>
                                    ) : (
                                        <div style={{ width: '100%' }}>
                                            {emails.map((email, idx) => (
                                                <motion.div
                                                    key={email.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    onClick={() => setSelectedEmail(email)}
                                                    style={{
                                                        padding: '24px 28px',
                                                        borderBottom: idx === emails.length - 1 ? 'none' : '1px solid var(--glass-border)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                                        position: 'relative',
                                                        zIndex: 20
                                                    }}
                                                    className="email-item-row"
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }} />
                                                            <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem', letterSpacing: '0.3px' }}>
                                                                {email.from.split('<')[0].trim()}
                                                            </span>
                                                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 600 }}>
                                                                {email.from.match(/<(.+)>/)?.[1] || ''}
                                                            </span>
                                                        </div>
                                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 800 }}>
                                                            {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px', fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.3px' }}>{email.subject}</h4>
                                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '800px' }}>{email.text.slice(0, 140)}...</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* BACKGROUND DECO FOR EMPTY STATE */}
                                    {emails.length === 0 && (
                                        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                                            <div className="scanning-line" />
                                            <div className="floating-particles" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ padding: '32px', borderRadius: '32px' }}>
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    aria-label="Back to inbox"
                                    style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', background: 'none', border: 'none' }}
                                >
                                    <ArrowLeft size={16} /> {dictionary.inbox?.return_to_inbox || 'RETURN TO INBOX'}
                                </button>
                                <div style={{ marginBottom: '28px' }}>
                                    <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '12px', lineHeight: 1.3 }}>{selectedEmail.subject}</h2>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {dictionary.inbox?.from_label || 'FROM:'} <strong style={{ color: '#fff' }}>{selectedEmail.from}</strong>
                                    </div>
                                </div>
                                <div className="glass" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(255,255,255,0.01)', overflowWrap: 'break-word', position: 'relative' }}>
                                    <div className="email-inner-glow" />
                                    {selectedEmail.html ? (
                                        <div className="email-content-wrapper">
                                            <div className="email-content" dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                                        </div>
                                    ) : (
                                        <div
                                            className="email-content-wrapper"
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'Inter, sans-serif',
                                                fontSize: '1rem',
                                                lineHeight: 1.7,
                                                color: 'rgba(255,255,255,0.85)',
                                                position: 'relative',
                                                zIndex: 2
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: selectedEmail.text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
                                            }}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* EXPLANATION SECTION (DYNAMIC SEO) */}
                <section style={{ marginBottom: '100px' }}>
                    <h2 className="section-title" style={{ fontSize: '2.4rem', textAlign: 'center', marginBottom: '40px' }}>{dictionary.seo_content?.h1 || 'What is disposable temporary email?'}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '40px', alignItems: 'center' }} className="explanation-grid">
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                            <p style={{ marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: dictionary.seo_content?.intro_p }} />
                            {dictionary.seo_content?.section1_h2 && (
                                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '12px', fontWeight: 800 }}>{dictionary.seo_content?.section1_h2}</h3>
                            )}
                            <p style={{ marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: dictionary.seo_content?.section1_p1 }} />
                            <p dangerouslySetInnerHTML={{ __html: dictionary.seo_content?.section1_p2 }} />
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            style={{
                                position: 'relative',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                                background: '#000',
                                aspectRatio: '16/9'
                            }}
                        >
                            <video
                                src="https://www.w3schools.com/html/mov_bbb.mp4"
                                autoPlay loop muted playsInline
                                aria-label="Instructional video on how to use temporary email"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                            />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                    <Play fill="#fff" size={24} style={{ marginLeft: '4px' }} />
                                </div>
                                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '2px' }}>{dictionary.inbox?.video_instruction || 'Video instruction'}</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* APPS & EXTENSIONS SECTION */}
                <section style={{ marginBottom: '100px', textAlign: 'center' }}>
                    <h2 className="section-title" style={{ fontSize: '2.4rem', marginBottom: '12px' }}>{dictionary.apps_extensions?.title || 'Apps and extensions'}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 48px auto', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: dictionary.apps_extensions?.subtitle || 'Enjoy fast and convenient access to generate temporary emails from anywhere with our apps and extensions' }} />

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
                        {[
                            { name: 'App Store', img: 'https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_Logo_2017.svg' },
                            { name: 'Google Play', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg' },
                            { name: 'Chrome', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg' },
                            { name: 'Firefox', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg' },
                            { name: 'Opera', img: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Opera_2015_icon.svg' },
                            { name: 'Edge', img: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg' },
                            { name: 'Telegram', img: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg' }
                        ].map((app, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                style={{
                                    width: '140px',
                                    height: '140px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    position: 'relative',
                                    cursor: 'default'
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    filter: 'grayscale(100%) opacity(0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img src={app.img} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{app.name}</span>

                                <div className="coming-soon-badge" style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    fontSize: '0.6rem',
                                    fontWeight: 900,
                                    color: 'rgba(255,255,255,0.7)',
                                    letterSpacing: '0.5px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {dictionary.inbox?.soon || 'SOON'}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* BLOG SECTION */}
                <section style={{ marginBottom: '100px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', gap: '20px' }}>
                        <div>
                            <h2 className="section-title" style={{ fontSize: '2.4rem', marginBottom: '8px' }}>{dictionary.blog?.title || 'Latest blog posts'}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>{dictionary.blog?.subtitle || 'Stay informed, stay secure: insights and our updates'}</p>
                        </div>
                        <Link href={`/${lang}/blog`}>
                            <button className="glass" style={{ padding: '10px 24px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>{dictionary.blog?.view_all || 'Read all posts'}</button>
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }} className="blog-grid-modern">
                        {posts.slice(0, 2).map((post, idx) => (
                            <BlogCard
                                key={idx}
                                slug={post.slug}
                                lang={lang}
                                image={post.image}
                                category={post.category}
                                title={post.title}
                                description={post.description}
                                author={post.author}
                                date={post.date}
                                dictionary={dictionary}
                            />
                        ))}
                    </div>
                </section>

                {/* DEEP CONTENT SECTION (SEO MAXIMIZER) */}
                <section style={{ margin: '80px 0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '100px' }}>
                    <div style={{ textAlign: 'left', maxWidth: '850px', margin: '0 auto' }}>
                        <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '32px' }}>{dictionary.seo_content?.h2_long_form || 'Disposable email addresses'}</h2>

                        <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                            <div style={{ maxHeight: isSeoExpanded ? '10000px' : '300px', overflow: 'hidden', transition: 'max-height 1.2s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative' }}>

                                {dictionary.seo_content?.long_content_sections?.map((section: any, idx: number) => (
                                    <div key={idx} style={{ marginBottom: '40px' }}>
                                        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>{section.title}</h3>
                                        <p>{section.text}</p>
                                    </div>
                                ))}

                                {!isSeoExpanded && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(transparent, var(--bg-dark))' }} />}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                                <motion.button
                                    aria-label={isSeoExpanded ? "Collapse content" : "Expand content"}
                                    onClick={() => setIsSeoExpanded(!isSeoExpanded)}
                                    whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        cursor: 'pointer',
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <ChevronDown size={28} style={{ transform: isSeoExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.4s' }} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section style={{ marginBottom: '120px' }}>
                    <h2 className="section-title" style={{ fontSize: '2.8rem', textAlign: 'center', marginBottom: '48px' }}>{dictionary.seo_content?.h2_faq || 'Frequently asked questions'}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '850px', margin: '0 auto' }}>
                        {dictionary.seo_content?.faq_list?.map((faq: any, i: number) => (FaqItem(faq, i, expandedFaq, setExpandedFaq)))}
                    </div>
                </section>

            </div>

            {/* MODAL */}
            <AnimatePresence>
                {showChangeModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        pointerEvents: 'auto'
                    }}>
                        {/* BACKDROP */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowChangeModal(false)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.85)',
                                backdropFilter: 'blur(15px)',
                                zIndex: -1
                            }}
                        />

                        {/* MODAL CONTAINER */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: 0,
                                width: showPremiumPart ? 'min(850px, 95vw)' : 'min(500px, 95vw)'
                            }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                                width: { duration: 0.8, ease: "easeInOut" }
                            }}
                            className="premium-modal-card"
                        >
                            <div className="modal-glow-bg" />

                            {/* CLOSE BUTTON */}
                            <button
                                onClick={(e) => { e.preventDefault(); setShowChangeModal(false); }}
                                className="modal-close-btn"
                            >
                                <X size={20} />
                            </button>

                            <div style={{ position: 'relative', zIndex: 5, padding: 'clamp(20px, 5vw, 40px)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '32px' }}>
                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                        <Edit2 size={24} color="var(--accent-primary)" />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', margin: 0 }}>
                                            {dictionary.buttons?.change || 'Change Email'}
                                        </h2>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, margin: '4px 0 0 0' }}>{dictionary.common?.modal?.subtitle || 'Create your unique temporary address'}</p>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: showPremiumPart ? '40px' : '0px',
                                    overflow: 'hidden',
                                    flexWrap: 'nowrap'
                                }}>
                                    {/* FORM SECTION (LEFT) */}
                                    <div style={{ flex: '1 0 auto', width: showPremiumPart ? 'calc(100% - 340px)' : '100%', transition: 'all 0.8s ease' }}>
                                        <div style={{ marginBottom: '30px' }}>
                                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{dictionary.common?.modal?.custom_alias || 'Custom Alias'}</label>
                                            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                                                <input
                                                    type="text"
                                                    value={customPrefix}
                                                    onChange={e => setCustomPrefix(e.target.value)}
                                                    placeholder={dictionary.common?.modal?.placeholder || "e.g. user-777"}
                                                    className="premium-input"
                                                />
                                                <button
                                                    onClick={(e: any) => { e?.preventDefault(); setCustomPrefix(Math.random().toString(36).substring(2, 10)); }}
                                                    className="random-btn-inner"
                                                    aria-label="Generate random alias"
                                                >
                                                    <Dices size={18} />
                                                </button>
                                            </div>
                                            <div style={{ marginTop: '12px', padding: '10px 15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>{dictionary.common?.modal?.preview_label || 'PREVIEW ADDRESS:'}</p>
                                                <p style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.95rem', wordBreak: 'break-all', margin: '4px 0 0 0' }}>
                                                    {customPrefix.toLowerCase() || '••••••••'}@tempmaila.org
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e: any) => { e?.preventDefault(); handleChange(); }}
                                            className="main-action-btn-premium"
                                        >
                                            <span>{dictionary.common?.modal?.button_update || 'Update Address Now'}</span>
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>

                                    {/* PROMO SECTION (RIGHT) */}
                                    {showPremiumPart && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="promo-card-inline"
                                            style={{ width: '300px', flexShrink: 0 }}
                                        >
                                            <div style={{ position: 'relative', zIndex: 1 }}>
                                                <div style={{ display: 'inline-flex', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontSize: '0.65rem', fontWeight: 950, padding: '4px 10px', borderRadius: '6px', marginBottom: '15px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                                    {dictionary.common?.premium?.elite_plan || 'ELITE PLAN'}
                                                </div>
                                                <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>Custom Domains</h4>
                                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '20px' }}>
                                                    Unlock exclusive TLDs like <b>@vip.com</b>, <b>@pro.io</b> and dedicated nodes.
                                                </p>
                                                <Link href={`/${lang}/premium`} style={{ textDecoration: 'none' }}>
                                                    <button className="promo-action-btn">
                                                        {dictionary.common?.premium?.view_plans || 'View Plans'} <Zap size={14} fill="currentColor" style={{ marginLeft: '4px' }} />
                                                    </button>
                                                </Link>
                                            </div>
                                            <div className="promo-bubbles">
                                                <div className="bubble b1" style={{ transform: 'rotate(-15deg)' }}>.net</div>
                                                <div className="bubble b2" style={{ transform: 'rotate(-15deg)' }}>.com</div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.8; }
                    70%, 100% { transform: scale(3); opacity: 0; }
                }
                @media (max-width: 900px) {
                    .explanation-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .blog-grid-modern { grid-template-columns: 1fr !important; }
                    .hero-title { font-size: 2.5rem !important; }
                    header { padding: 40px 0 30px 0 !important; }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .email-content { color: rgba(255,255,255,0.9) !important; line-height: 1.7 !important; }
                .email-content a { color: var(--accent-primary) !important; font-weight: 800; text-decoration: underline; transition: all 0.2s; }
                .email-content a:hover { color: #fff !important; text-shadow: 0 0 10px var(--accent-primary); }
                .email-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.1); }
                .email-content table { width: 100% !important; border-collapse: collapse; color: inherit; }
                .email-content-wrapper { position: relative; z-index: 2; overflow-x: auto; font-family: 'Inter', sans-serif; }
                
                .email-item-row:hover {
                    background: rgba(255,255,255,0.03);
                    transform: scale(1.002);
                }
                .email-inner-glow {
                    position: absolute;
                    top: 0; left: 10%; width: 80%; height: 1px;
                    background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
                    opacity: 0.3;
                    z-index: 1;
                }
                
                .premium-modal-card {
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 40px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 50px 100px rgba(0,0,0,0.9), inset 0 0 80px rgba(59, 130, 246, 0.05);
                }
                .modal-close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.5);
                    padding: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    z-index: 10;
                    transition: 0.3s;
                }
                .modal-close-btn:hover {
                    background: rgba(244, 63, 94, 0.1);
                    color: #f43f5e;
                    border-color: rgba(244, 63, 94, 0.2);
                    transform: rotate(90deg);
                }
                .modal-glow-bg {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08), transparent 40%);
                    pointer-events: none;
                }
                .premium-input {
                    flex: 1;
                    padding: 16px 20px;
                    background: rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    color: #fff;
                    font-size: 1.1rem;
                    outline: none;
                    font-family: 'monospace';
                    transition: all 0.3s;
                    width: 100%;
                }
                .premium-input:focus {
                    border-color: var(--accent-primary);
                    background: rgba(59, 130, 246, 0.05);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
                }
                .random-btn-inner {
                    padding: 0 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    color: #fff;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .random-btn-inner:hover {
                    background: rgba(255,255,255,0.1);
                    transform: rotate(15deg);
                    color: var(--accent-primary);
                }
                .main-action-btn-premium {
                    width: 100%;
                    padding: 20px;
                    border-radius: 24px;
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    border: none;
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
                    transition: all 0.4s;
                }
                .main-action-btn-premium:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 25px 50px rgba(59, 130, 246, 0.5);
                    filter: brightness(1.1);
                }
                .promo-card-inline {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 30px;
                    padding: 25px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .promo-action-btn {
                    padding: 12px 20px;
                    background: #fff;
                    color: #000;
                    border: none;
                    border-radius: 14px;
                    font-weight: 800;
                    font-size: 0.85rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: 0.3s;
                    width: 100%;
                }
                .promo-action-btn:hover {
                    transform: scale(1.05);
                    background: var(--accent-primary);
                    color: #fff;
                }
                .promo-bubbles {
                    position: absolute;
                    bottom: -15px;
                    right: -15px;
                    opacity: 0.3;
                    pointer-events: none;
                }
                .bubble {
                    padding: 6px 12px;
                    border-radius: 10px;
                    font-size: 0.65rem;
                    font-weight: 900;
                    position: absolute;
                    transform: rotate(-15deg);
                    color: #fff;
                }
                .b1 { background: var(--accent-primary); bottom: 45px; right: 25px; z-index: 2; }
                .b2 { background: var(--accent-secondary); bottom: 15px; right: 65px; z-index: 1; }

                @media (max-width: 800px) {
                    .premium-modal-card { 
                        width: 95vw !important; 
                        max-height: 90vh !important;
                        overflow-y: auto !important;
                    }
                    div[style*="display: flex; gap: 40px"] {
                        flex-direction: column !important;
                        gap: 20px !important;
                    }
                    .promo-card-inline { 
                        width: 100% !important; 
                        order: 2;
                    }
                    div[style*="calc(100% - 340px)"] {
                        width: 100% !important;
                    }
                }

                /* LIQUID WAVE LOADER */
                /* MAIL WAVE LOADER */
                .mail-loader {
                    width: 48px;
                    height: 48px;
                    position: relative;
                    margin: 0 auto 24px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .mail-icon {
                    position: relative;
                    z-index: 5;
                    color: #fff;
                    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.6));
                }
                .liquid {
                    position: absolute;
                    width: 40px;
                    height: 32px;
                    top: 8px;
                    left: 4px;
                    z-index: 1;
                    overflow: hidden;
                    background: linear-gradient(to top, #3b82f6, #6366f1);
                    box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
                    opacity: 0.8;
                }
                .liquid::before {
                    content: "";
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    top: -60%;
                    left: -50%;
                    background: #1a1a1a;
                    border-radius: 38%;
                    animation: wave-fill 3s linear infinite;
                    opacity: 0.9;
                }
                @keyframes wave-fill {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* SCANNING LINE AND PARTICLES */
                .scanning-line {
                    position: absolute;
                    top: -100%;
                    left: 0;
                    width: 100%;
                    height: 100px;
                    background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05), transparent);
                    animation: scan 4s linear infinite;
                    z-index: 1;
                }
                @keyframes scan {
                    0% { top: -100%; }
                    100% { top: 200%; }
                }

                .floating-particles {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                    animation: particle-drift 20s linear infinite;
                    opacity: 0.3;
                }
                @keyframes particle-drift {
                    from { background-position: 0 0; }
                    to { background-position: 100px 100px; }
                }
            `}</style>
        </AppLayout>
    );
}

function ModernMailboxLoader() {
    return (
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
            {/* PULSING OUTER RINGS */}
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: [0, 0.2, 0],
                        scale: [0.8, 1.5, 2],
                    }}
                    transition={{
                        duration: 3,
                        delay: i * 0.8,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        border: '1px solid var(--accent-primary)',
                        borderRadius: '50%',
                    }}
                />
            ))}

            {/* ROTATING SCANNER ARCS */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    inset: '-10px',
                    border: '2px solid transparent',
                    borderTopColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    opacity: 0.4
                }}
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    inset: '-20px',
                    border: '1px solid transparent',
                    borderLeftColor: 'var(--accent-secondary)',
                    borderRadius: '50%',
                    opacity: 0.2
                }}
            />

            {/* CENTRAL ICON CONTAINER */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    filter: ['drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))', 'drop-shadow(0 0 25px rgba(59, 130, 246, 0.6))', 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <div style={{ position: 'relative' }}>
                    <Mail size={40} color="#fff" strokeWidth={1.5} />
                    <motion.div
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Zap size={24} color="var(--accent-primary)" fill="var(--accent-primary)" style={{ opacity: 0.5 }} />
                    </motion.div>
                </div>
            </motion.div>

            {/* ORBITING DATA BITS */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
                <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '2px',
                        transformOrigin: 'left center',
                    }}
                >
                    <motion.div
                        animate={{
                            scale: [0.5, 1, 0.5],
                            opacity: [0.2, 0.8, 0.2]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        style={{
                            width: '4px',
                            height: '4px',
                            background: 'var(--accent-primary)',
                            borderRadius: '50%',
                            position: 'absolute',
                            right: '-2px',
                            boxShadow: '0 0 10px var(--accent-primary)'
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
}


function FaqItem(faq: any, i: number, expandedFaq: any, setExpandedFaq: any) {
    const isExpanded = expandedFaq === i;
    return (
        <div key={i} className="glass" style={{ borderRadius: '24px', border: isExpanded ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--glass-border)', transition: 'all 0.5s' }}>
            <button
                onClick={() => setExpandedFaq(isExpanded ? null : i)}
                style={{ width: '100%', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', background: isExpanded ? 'rgba(59, 130, 246, 0.02)' : 'transparent', transition: 'background 0.5s', border: 'none', cursor: 'pointer' }}
            >
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isExpanded ? '#fff' : 'rgba(255,255,255,0.9)' }}>{faq.q}</span>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0, color: isExpanded ? 'var(--accent-primary)' : 'rgba(255,255,255,0.4)' }}>
                    <ChevronDown size={22} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{ padding: '0 32px 24px 32px', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                            {faq.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SmallActionButton({ icon, label, onClick, color }: any) {
    const handleClick = (e: any) => {
        if (e && e.preventDefault) e.preventDefault();
        if (onClick) onClick();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            style={{
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                background: 'none', border: 'none', color: color || 'rgba(255,255,255,0.6)',
                fontSize: '0.85rem', fontWeight: 700, transition: 'transform 0.1s, color 0.1s', padding: '8px'
            }}
            className="small-action-btn"
        >
            {icon} {label}
            <style jsx>{`
                .small-action-btn:hover {
                    color: #fff !important;
                    transform: translateY(-2px);
                }
                .small-action-btn:active {
                    transform: scale(0.95);
                }
            `}</style>
        </button>
    );
}
