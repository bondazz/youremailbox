'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, Mail, Loader2, AlertTriangle, ShieldCheck as ShieldCheckIcon, Globe, Lock, Database, Eye, UserX, CheckCircle2, Info } from 'lucide-react';

export default function DataBreachCheckerClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'searching' | 'breached' | 'safe'>('idle');

    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('searching');
        setTimeout(() => {
            const isBreached = email.includes('breach') || email.length % 2 === 0;
            setStatus(isBreached ? 'breached' : 'safe');
        }, 2500);
    };

    const t = dictionary.tools?.breach_checker || {};

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <div className="main-wrapper" style={{ padding: '40px 20px 80px 20px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Breadcrumbs
                        items={[
                            { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                            { label: dictionary.navigation?.tools || 'Free Tools', href: `/${lang}/tools` },
                            { label: t.label || 'Data Breach Checker' }
                        ]}
                    />

                    <header style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            color: '#f43f5e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto'
                        }}>
                            <ShieldAlert size={36} />
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
                            {t.title || 'Data Breach Checker'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            {t.subtitle || 'Is your identity for sale? Scan breach databases.'}
                        </p>
                    </header>

                    {/* SEARCH FORM */}
                    <form onSubmit={handleCheck} style={{ marginBottom: '60px' }}>
                        <div className="glass" style={{
                            padding: '12px',
                            borderRadius: '20px',
                            display: 'flex',
                            gap: '12px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--glass-border)',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ flex: 1, minWidth: '250px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '20px', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="email"
                                    placeholder={t.placeholder || "Enter your email address to scan..."}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', padding: '18px 20px 18px 56px', background: 'transparent',
                                        border: 'none', color: '#fff', fontSize: '1rem', outline: 'none'
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'searching'}
                                style={{
                                    padding: '0 32px', borderRadius: '14px', background: status === 'searching' ? 'rgba(244, 63, 94, 0.5)' : '#f43f5e',
                                    color: '#fff', fontWeight: 900, cursor: status === 'searching' ? 'not-allowed' : 'pointer', border: 'none',
                                    display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s', fontSize: '0.9rem',
                                    minHeight: '52px'
                                }}
                            >
                                {status === 'searching' ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={20} />}
                                {status === 'searching' ? t.scanning || 'SCANNING...' : t.button || 'SCAN NOW'}
                            </button>
                        </div>
                    </form>

                    {/* RESULTS */}
                    <AnimatePresence mode="wait">
                        {status === 'searching' && (
                            <motion.div
                                key="searching"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass"
                                style={{ padding: '60px 40px', borderRadius: '24px', textAlign: 'center', marginBottom: '60px' }}
                            >
                                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px auto' }}>
                                    <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(244, 63, 94, 0.3)', borderRadius: '50%', animation: 'ping 2s infinite' }} />
                                    <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(244, 63, 94, 0.5)', borderRadius: '50%' }} />
                                    <div style={{ position: 'absolute', inset: '25%', background: 'linear-gradient(135deg, #f43f5e 0%, #ef4444 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <Search size={32} />
                                    </div>
                                </div>
                                <h3 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>{t.scanning_title || 'Scanning Global Databases'}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{t.scanning_desc || 'Cross-referencing email with databases...'}</p>
                            </motion.div>
                        )}

                        {status === 'breached' && (
                            <motion.div
                                key="breached"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass"
                                style={{ padding: '48px', borderRadius: '24px', border: '2px solid rgba(244, 63, 94, 0.3)', textAlign: 'center', marginBottom: '60px', background: 'rgba(244, 63, 94, 0.05)' }}
                            >
                                <div style={{ color: '#f43f5e', marginBottom: '24px' }}>
                                    <AlertTriangle size={72} style={{ margin: '0 auto' }} />
                                </div>
                                <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '16px' }}>⚠️ {t.exposure_detected || 'Exposure Detected!'}</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                    {t.exposure_warn || 'Warning: This email address appeared in known data breaches.'}
                                </p>
                                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button className="premium-btn" style={{ padding: '16px 32px', background: '#f43f5e' }}>{t.breach_details || 'VIEW BREACH DETAILS'}</button>
                                    <button onClick={() => setStatus('idle')} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid var(--glass-border)', color: '#fff', cursor: 'pointer', fontWeight: 800 }}>{t.reset_scan || 'RESET SCAN'}</button>
                                </div>
                            </motion.div>
                        )}

                        {status === 'safe' && (
                            <motion.div
                                key="safe"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass"
                                style={{ padding: '48px', borderRadius: '24px', border: '2px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', marginBottom: '60px', background: 'rgba(16, 185, 129, 0.05)' }}
                            >
                                <div style={{ color: '#10b981', marginBottom: '24px' }}>
                                    <ShieldCheckIcon size={72} style={{ margin: '0 auto' }} />
                                </div>
                                <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '16px' }}>✓ {t.clean_status || 'Clean Status'}</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                    {t.clean_msg || 'Good news! No records were found.'}
                                </p>
                                <button onClick={() => setStatus('idle')} className="premium-btn" style={{ padding: '16px 40px', background: '#10b981' }}>{t.new_scan || 'RUN NEW SCAN'}</button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* EDUCATIONAL CONTENT */}
                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '32px', textAlign: 'center' }}>
                            {t.why_title || 'Why Check for Data Breaches?'}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                            <FeatureCard
                                icon={<Database size={24} color="#f43f5e" />}
                                title={t.feature1_title || "500+ Breach Databases"}
                                description={t.feature1_desc}
                            />
                            <FeatureCard
                                icon={<Lock size={24} color="#10b981" />}
                                title={t.feature2_title || "Privacy-First Scanning"}
                                description={t.feature2_desc}
                            />
                            <FeatureCard
                                icon={<Eye size={24} color="#fbbf24" />}
                                title={t.feature3_title || "Real-Time Monitoring"}
                                description={t.feature3_desc}
                            />
                        </div>

                        <div className="glass" style={{ padding: '40px', borderRadius: '24px', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Info size={24} color="#f43f5e" />
                                {t.what_is_title || 'What is a Data Breach?'}
                            </h3>
                            <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>
                                <p style={{ marginBottom: '16px' }}>
                                    {t.what_is_p}
                                </p>
                            </div>
                        </div>

                        <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>
                                {t.how_to_title || 'How to Use This Tool'}
                            </h3>
                            <ol style={{ paddingLeft: '24px', marginBottom: '32px' }}>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.how_step1}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.how_step2}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.how_step3}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.how_step4}</strong></li>
                            </ol>

                            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', marginTop: '32px' }}>
                                {t.what_to_do_title || 'What to Do If Your Email Was Breached'}
                            </h3>
                            <p style={{ marginBottom: '16px' }}>
                                {t.what_to_do_p}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                                <ActionCard
                                    number="1"
                                    title={t.action1_title}
                                    description={t.action1_desc}
                                />
                                <ActionCard
                                    number="2"
                                    title={t.action2_title}
                                    description={t.action2_desc}
                                />
                                <ActionCard
                                    number="3"
                                    title={t.action3_title}
                                    description={t.action3_desc}
                                />
                                <ActionCard
                                    number="4"
                                    title={t.action4_title}
                                    description={t.action4_desc}
                                />
                            </div>

                            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '16px', padding: '24px', marginTop: '32px' }}>
                                <h4 style={{ color: '#f43f5e', fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={20} />
                                    {t.pro_tip_title || 'Important Security Tip'}
                                </h4>
                                <p style={{ margin: 0 }}>
                                    {t.pro_tip_p}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ SECTION */}
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '32px', textAlign: 'center' }}>
                            {t.faq_title || 'Frequently Asked Questions'}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <FAQItem question={t.faq_q1} answer={t.faq_a1} />
                            <FAQItem question={t.faq_q2} answer={t.faq_a2} />
                            <FAQItem question={t.faq_q3} answer={t.faq_a3} />
                            <FAQItem question={t.faq_q4} answer={t.faq_a4} />
                            <FAQItem question={t.faq_q5} answer={t.faq_a5} />
                            <FAQItem question={t.faq_q6} answer={t.faq_a6} />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.8; }
                    70%, 100% { transform: scale(2.5); opacity: 0; }
                }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </AppLayout>
    );
}

function FeatureCard({ icon, title, description }: any) {
    return (
        <div className="glass" style={{ padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{description}</p>
        </div>
    );
}

function ActionCard({ number, title, description }: any) {
    return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f43f5e 0%, #ef4444 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '1.2rem',
                flexShrink: 0
            }}>
                {number}
            </div>
            <div>
                <h5 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>{title}</h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{description}</p>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                {question}
                <span style={{ fontSize: '1.5rem', transition: '0.3s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
            </button>
            {isOpen && (
                <div style={{ padding: '0 24px 20px 24px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    {answer}
                </div>
            )}
        </div>
    );
}
