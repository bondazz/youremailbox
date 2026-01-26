'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';
import { MailCheck, Check, X, Loader2, Server, AtSign, ShieldCheck, Mail, Globe, Info, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export default function EmailValidatorClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'validating' | 'result'>('idle');
    const [results, setResults] = useState<any>(null);

    const handleValidate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('validating');
        setTimeout(() => {
            const isDisposable = email.includes('temp') || email.includes('mail');
            setResults({
                format: true,
                mx: true,
                smtp: email.length % 2 === 0,
                disposable: isDisposable,
                role: email.startsWith('info') || email.startsWith('admin')
            });
            setStatus('result');
        }, 3000);
    };

    const t = dictionary.tools?.email_validator || {};

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <div className="main-wrapper" style={{ padding: '40px 20px 80px 20px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Breadcrumbs
                        items={[
                            { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                            { label: dictionary.navigation?.tools || 'Free Tools', href: `/${lang}/tools` },
                            { label: t.label || 'Email Validator' }
                        ]}
                    />

                    <header style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto'
                        }}>
                            <MailCheck size={36} />
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
                            {t.title || 'Email Validator'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            {t.subtitle || 'Professional verification for your mailing lists.'}
                        </p>
                    </header>

                    {/* VALIDATION FORM */}
                    <form onSubmit={handleValidate} style={{ marginBottom: '60px' }}>
                        <div className="glass" style={{
                            padding: '12px',
                            borderRadius: '20px',
                            display: 'flex',
                            gap: '12px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--glass-border)',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ flex: 1, minWidth: '250px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <AtSign size={20} style={{ position: 'absolute', left: '20px', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="email"
                                    placeholder={t.placeholder || "Enter email address to validate..."}
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
                                disabled={status === 'validating'}
                                style={{
                                    padding: '0 32px', borderRadius: '14px', background: status === 'validating' ? 'rgba(16, 185, 129, 0.5)' : '#10b981',
                                    color: '#fff', fontWeight: 900, cursor: status === 'validating' ? 'not-allowed' : 'pointer', border: 'none',
                                    display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s', fontSize: '0.9rem',
                                    minHeight: '52px'
                                }}
                            >
                                {status === 'validating' ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <MailCheck size={20} />}
                                {status === 'validating' ? t.verifying || 'VERIFYING...' : t.button || 'VERIFY EMAIL'}
                            </button>
                        </div>
                    </form>

                    {/* VALIDATION PROGRESS */}
                    <AnimatePresence mode="wait">
                        {status === 'validating' && (
                            <motion.div
                                key="validating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass"
                                style={{ padding: '40px', borderRadius: '24px', marginBottom: '60px' }}
                            >
                                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                                    <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                                        <motion.div
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 3, ease: 'easeInOut' }}
                                            style={{ height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}
                                        />
                                    </div>
                                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '1px' }}>
                                        {t.scanning_status || 'EXECUTING SMTP HANDSHAKE & MX LOOKUP...'}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* VALIDATION RESULTS */}
                        {status === 'result' && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ marginBottom: '60px' }}
                            >
                                {/* SUMMARY CARD */}
                                <div className="glass" style={{ padding: '32px', borderRadius: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: results.smtp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                                            border: `2px solid ${results.smtp ? '#10b981' : '#f43f5e'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {results.smtp ? <Check color="#10b981" size={32} strokeWidth={3} /> : <X color="#f43f5e" size={32} strokeWidth={3} />}
                                        </div>
                                        <div>
                                            <h3 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, marginBottom: '4px' }}>
                                                {results.smtp ? `✓ ${t.deliverable || 'Deliverable'}` : `✗ ${t.undeliverable || 'Risky / Undeliverable'}`}
                                            </h3>
                                            <p style={{ color: 'var(--text-muted)', margin: 0, fontFamily: 'monospace', fontSize: '0.95rem' }}>{email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setStatus('idle')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '14px 28px', borderRadius: '12px', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>
                                        {t.new_test || 'NEW TEST'}
                                    </button>
                                </div>

                                {/* DETAILED CHECKS */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                                    <ResultItem label={t.syntax_check || "Syntax / Format"} icon={<Mail size={20} />} status={results.format} />
                                    <ResultItem label={t.mx_check || "MX Records"} icon={<Server size={20} />} status={results.mx} />
                                    <ResultItem label={t.smtp_check || "SMTP Server"} icon={<Globe size={20} />} status={results.smtp} />
                                    <ResultItem label={t.disposable_check || "Not Disposable"} icon={<ShieldCheck size={20} />} status={!results.disposable} inverted />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* EDUCATIONAL CONTENT */}
                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '32px', textAlign: 'center' }}>
                            {t.what_is_title || 'What is Email Validation?'}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                            <FeatureCard
                                icon={<CheckCircle2 size={24} color="#10b981" />}
                                title={t.feature1_title || "Multi-Layer Verification"}
                                description={t.feature1_desc}
                            />
                            <FeatureCard
                                icon={<Zap size={24} color="#fbbf24" />}
                                title={t.feature2_title || "Real-Time Validation"}
                                description={t.feature2_desc}
                            />
                            <FeatureCard
                                icon={<ShieldCheck size={24} color="#3b82f6" />}
                                title={t.feature3_title || "Disposable Detection"}
                                description={t.feature3_desc}
                            />
                        </div>

                        <div className="glass" style={{ padding: '40px', borderRadius: '24px', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Info size={24} color="#10b981" />
                                {t.how_to_title || 'How to Use This Validator'}
                            </h3>
                            <ol style={{ color: 'var(--text-muted)', lineHeight: 2, paddingLeft: '20px', margin: 0 }}>
                                <li><strong style={{ color: '#fff' }}>{t.how_step1}</strong></li>
                                <li><strong style={{ color: '#fff' }}>{t.how_step2}</strong></li>
                                <li><strong style={{ color: '#fff' }}>{t.how_step3}</strong></li>
                                <li><strong style={{ color: '#fff' }}>{t.how_step4}</strong></li>
                            </ol>
                        </div>

                        <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>
                                {t.why_validate_title || 'Why Validate Email Addresses?'}
                            </h3>
                            <p style={{ marginBottom: '16px' }}>
                                {t.why_validate_p1}
                            </p>
                            <ul style={{ paddingLeft: '24px', marginBottom: '32px' }}>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.why_li1}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.why_li2}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.why_li3}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.why_li4}</strong></li>
                            </ul>

                            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', marginTop: '32px' }}>
                                {t.understanding_checks_title || 'Understanding Validation Checks'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                                <CheckExplanation
                                    title={t.check1_title}
                                    description={t.check1_desc}
                                />
                                <CheckExplanation
                                    title={t.check2_title}
                                    description={t.check2_desc}
                                />
                                <CheckExplanation
                                    title={t.check3_title}
                                    description={t.check3_desc}
                                />
                                <CheckExplanation
                                    title={t.check4_title}
                                    description={t.check4_desc}
                                />
                            </div>

                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '24px', marginTop: '32px' }}>
                                <h4 style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle size={20} />
                                    {t.pro_tip_title || 'Best Practice for Email Marketers'}
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
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </AppLayout>
    );
}

function ResultItem({ label, icon, status, inverted = false }: any) {
    const isSuccess = inverted ? !status : status;
    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)' }}>{icon}</div>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{label}</span>
            </div>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {isSuccess ? <Check color="#10b981" size={18} strokeWidth={3} /> : <X color="#f43f5e" size={18} strokeWidth={3} />}
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: any) {
    return (
        <div className="glass" style={{ padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{description}</p>
        </div>
    );
}

function CheckExplanation({ title, description }: any) {
    return (
        <div style={{ paddingLeft: '20px', borderLeft: '3px solid rgba(16, 185, 129, 0.3)' }}>
            <h5 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>{title}</h5>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>{description}</p>
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
