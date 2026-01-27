'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
];

export default function LanguageSelector({ currentLang, dictionary }: { currentLang: string, dictionary?: any }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLangChange = (code: string) => {
        const newPath = pathname.replace(`/${currentLang}`, `/${code}`);
        router.push(newPath);
        setIsOpen(false);
    };

    const current = languages.find(l => l.code === currentLang) || languages[2];

    return (
        <div style={{ position: 'relative', zIndex: 4000, overflow: 'visible' }} ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={dictionary?.common?.select_language || "Select Language"}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1rem' }}>{current.flag}</span>
                    <span className="hide-on-mobile" style={{ opacity: 0.9 }}>{current.name}</span>
                </div>
                <ChevronDown size={10} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', opacity: 0.5 }} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        className="glass thin-scrollbar"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            width: '180px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            zIndex: 3000,
                            padding: '6px',
                            borderRadius: '16px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(10, 10, 10, 0.95)',
                            backdropFilter: 'blur(30px)'
                        }}
                    >
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, letterSpacing: '1px', marginBottom: '8px', marginLeft: '10px', paddingTop: '4px' }}>{dictionary?.common?.settings || 'LOCALE SETTINGS'}</div>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLangChange(lang.code)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    background: currentLang === lang.code ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    borderRadius: '8px',
                                    color: currentLang === lang.code ? 'var(--accent-primary)' : 'rgba(255,255,255,0.8)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '0.85rem',
                                    fontWeight: currentLang === lang.code ? 800 : 500,
                                    border: 'none',
                                    transition: 'all 0.2s ease',
                                    marginBottom: '1px'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentLang !== lang.code) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                }}
                                onMouseLeave={(e) => {
                                    if (currentLang !== lang.code) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <span style={{ fontSize: '1rem' }}>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
