'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import Link from 'next/link';
import { Home, Mail, Shield, LayoutGrid, Globe, HelpCircle, FileText, X, BookOpen, Zap, ArrowUpRight, Github, ArrowRight } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    dictionary: any;
    lang: string;
}

export default function AppLayout({ children, dictionary, lang }: LayoutProps) {
    const { scrollY } = useScroll();
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const headerShadow = useTransform(scrollY, [0, 80], ['0 0 0 rgba(0,0,0,0)', '0 15px 40px -10px rgba(0,0,0,0.4)']);

    return (
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* MINIMALIST MESH BACKGROUND */}
            <div className="mesh-container">
                <div className="mesh-blob blob-1" />
                <div className="mesh-blob blob-2" />
            </div>

            {/* HEADER */}
            <motion.header
                className="header-morph"
                initial={false}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    height: 'var(--header-height)',
                    zIndex: 2000,
                    background: 'rgba(5, 5, 5, 0.5)',
                    backdropFilter: 'blur(30px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(150%)',
                    borderBottom: '1px solid var(--glass-border)',
                    borderRadius: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    justifyContent: 'space-between',
                    boxShadow: headerShadow,
                    // contain: 'paint' - Disabled to allow dropdowns to overflow
                }}
            >
                <Link href={`/${lang}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', minWidth: '180px' }}>
                    <div className="logo-font" style={{ fontSize: '1.4rem' }}>YourEmailBox</div>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', minHeight: '40px' }}>
                    <nav style={{ display: 'flex', gap: '2px', marginRight: '12px' }}>
                        <HeaderLink label={dictionary.navigation?.home} href={`/${lang}`} active />
                        <HeaderLink label={dictionary.navigation?.security} href="#" />
                        <HeaderLink label={dictionary.navigation?.blog} href={`/${lang}/blog`} />
                        <HeaderLink label={dictionary.navigation?.protocol} href="#" />
                    </nav>
                    <div className="desktop-nav-sep" style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 12px' }} />
                    <div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center' }}>
                        <LanguageSelector currentLang={lang} dictionary={dictionary} />
                    </div>
                </div>

                {/* MOBILE HAMBURGER BUTTON */}
                <button
                    className="hamburger-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
                >
                    <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                </button>
            </motion.header>

            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            className="mobile-menu-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.nav
                            className="mobile-menu-panel"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                        >
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="logo-font" style={{ fontSize: '1.3rem', color: '#fff' }}>{dictionary.common?.menu || 'Menu'}</div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close mobile menu"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <MobileMenuLink href={`/${lang}`} label={dictionary.navigation?.home} onClick={() => setIsMobileMenuOpen(false)} />
                                    <MobileMenuLink href={`/${lang}/blog`} label={dictionary.navigation?.blog} onClick={() => setIsMobileMenuOpen(false)} />
                                    <MobileMenuLink href={`/${lang}/tools`} label={dictionary.navigation?.tools} onClick={() => setIsMobileMenuOpen(false)} />
                                    <MobileMenuLink href={`/${lang}/about-us`} label={dictionary.navigation?.about} onClick={() => setIsMobileMenuOpen(false)} />
                                    <MobileMenuLink href={`/${lang}/contacts`} label={dictionary.navigation?.contacts} onClick={() => setIsMobileMenuOpen(false)} />
                                </div>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            <main className="main-content" style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
                {children}
            </main>

            {/* FOOTER */}
            <footer style={{ padding: '80px 24px 100px 24px', marginTop: '60px', position: 'relative', background: 'rgba(2, 2, 2, 0.4)', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }} className="footer-grid-complex">
                    <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <div className="logo-font" style={{ fontSize: '1.8rem', color: '#fff' }}>YourEmailBox</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px' }}>{dictionary.footer?.brand_tagline}</p>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '4px' }}>© 2026 youremailbox.com</p>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: 'fit-content'
                        }}>
                            <Zap size={20} color="#ff9c07" fill="#ff9c07" />
                            <div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>{dictionary.footer?.featured_on}</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff' }}>{dictionary.footer?.startup_found}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <h4 className="footer-title">{dictionary.footer?.categories?.features?.title}</h4>
                        <ul className="footer-ul">
                            {dictionary.footer?.categories?.features?.links?.map((link: any, i: number) => (
                                <li key={i}><FooterLink href={link.href.startsWith('/') ? `/${lang}${link.href}` : link.href}>{link.label}</FooterLink></li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <h4 className="footer-title">{dictionary.footer?.categories?.links?.title}</h4>
                        <ul className="footer-ul">
                            {dictionary.footer?.categories?.links?.links?.map((link: any, i: number) => (
                                <li key={i}><FooterLink href={link.href.startsWith('/') ? `/${lang}${link.href}` : link.href}>{link.label}</FooterLink></li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ gridColumn: 'span 3' }}>
                        <h4 className="footer-title">{dictionary.footer?.categories?.free_tools?.title}</h4>
                        <ul className="footer-ul">
                            {dictionary.footer?.categories?.free_tools?.links?.map((link: any, i: number) => (
                                <li key={i}><FooterLink href={link.href.startsWith('/') ? `/${lang}${link.href}` : link.href}>{link.label}</FooterLink></li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <h4 className="footer-title">{dictionary.footer?.categories?.company?.title}</h4>
                        <ul className="footer-ul">
                            {dictionary.footer?.categories?.company?.links?.map((link: any, i: number) => (
                                <li key={i}><FooterLink href={`/${lang}${link.href}`}>{link.label}</FooterLink></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </footer>

            {/* COOKIE CONSENT */}
            <CookieConsent dictionary={dictionary} lang={lang} />

            <style jsx>{`
                .footer-title { color: #fff; font-size: 0.95rem; font-weight: 800; margin-bottom: 24px; }
                .footer-ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; }
                
                .hamburger-btn { display: none !important; }

                @media (max-width: 991px) {
                    .desktop-nav { display: none !important; }
                    .hamburger-btn { display: flex !important; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; z-index: 2001; }
                }

                .hamburger-line { width: 24px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.3s ease; }
                .hamburger-line.open:nth-child(1) { transform: rotate(45deg) translateY(7px); }
                .hamburger-line.open:nth-child(2) { opacity: 0; }
                .hamburger-line.open:nth-child(3) { transform: rotate(-45deg) translateY(-7px); }
                .mobile-menu-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); z-index: 1998; }
                .mobile-menu-panel { position: fixed; top: 0; right: 0; bottom: 0; width: min(320px, 80vw); background: rgba(8, 8, 8, 0.98); backdrop-filter: blur(40px); border-left: 1px solid var(--glass-border); overflow-y: auto; z-index: 1999; }
                @media (max-width: 1024px) {
                    .footer-grid-complex { grid-template-columns: 1fr 1fr !important; }
                    .footer-grid-complex > div:first-child { grid-column: span 2 !important; }
                }
                @media (max-width: 640px) {
                    .footer-grid-complex { grid-template-columns: 1fr !important; }
                    .footer-grid-complex > div { grid-column: span 1 !important; }
                }
            `}</style>
        </div>
    );
}

function HeaderLink({ label, href, active = false }: { label: string, href: string, active?: boolean }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0.5)', transition: '0.1s', cursor: 'pointer' }}>
                {label}
            </div>
        </Link>
    );
}

function FooterLink({ children, href = "#" }: { children: React.ReactNode, href?: string }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', transition: '0.15s', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                {children}
            </div>
        </Link>
    );
}

function MobileMenuLink({ href, label, onClick }: { href: string, label: string, onClick: () => void }) {
    return (
        <Link href={href} onClick={onClick} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontWeight: 600, transition: '0.2s', cursor: 'pointer', borderRadius: '8px' }}>
                {label}
            </div>
        </Link>
    );
}

function CookieConsent({ dictionary, lang }: { dictionary: any, lang: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const content = dictionary.cookie_consent || {
        title: "Privacy Protocol",
        message: "We use cookies to optimize the security protocol and deliver insights. By continuing, you agree to our privacy standards.",
        accept: "Accept",
        details: "Details"
    };

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2400);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        left: '30px',
                        right: '30px',
                        maxWidth: '420px',
                        background: 'rgba(12, 12, 12, 0.85)',
                        backdropFilter: 'blur(30px) saturate(160%)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '24px',
                        padding: '24px',
                        zIndex: 10000,
                        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}
                >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                            padding: '10px',
                            borderRadius: '12px',
                            color: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Shield size={20} />
                        </div>
                        <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 900, margin: 0 }}>{content.title}</h4>
                    </div>

                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                        {content.message}
                    </p>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleAccept}
                            style={{
                                flex: 1,
                                background: 'var(--accent-primary)',
                                color: '#fff',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '14px',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: '0.3s',
                                boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.5)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                        >
                            {content.accept}
                        </button>
                        <Link href={`/${lang}/privacy-policy`} style={{ textDecoration: 'none', flex: 0.6 }}>
                            <button style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.7)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px',
                                borderRadius: '14px',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                {content.details}
                            </button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
