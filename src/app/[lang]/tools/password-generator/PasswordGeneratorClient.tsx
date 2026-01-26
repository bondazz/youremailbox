'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';
import { Copy, RefreshCw, ShieldCheck, Check, Settings2, Hash, Type, Languages, Binary, Info, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export default function PasswordGeneratorClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
    });
    const [copied, setCopied] = useState(false);
    const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('medium');

    const generatePassword = useCallback(() => {
        const charset = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
        };

        let characters = '';
        if (options.uppercase) characters += charset.uppercase;
        if (options.lowercase) characters += charset.lowercase;
        if (options.numbers) characters += charset.numbers;
        if (options.symbols) characters += charset.symbols;

        if (characters === '') return;

        let result = '';
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            result += characters.charAt(array[i] % characters.length);
        }
        setPassword(result);

        // Calculate strength
        const activeOptions = Object.values(options).filter(Boolean).length;
        if (length >= 16 && activeOptions >= 3) setStrength('strong');
        else if (length >= 12 && activeOptions >= 2) setStrength('medium');
        else setStrength('weak');
    }, [length, options]);

    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const t = dictionary.tools?.password_generator || {};

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <div className="main-wrapper" style={{ padding: '40px 20px 80px 20px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Breadcrumbs
                        items={[
                            { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                            { label: dictionary.navigation?.tools || 'Free Tools', href: `/${lang}/tools` },
                            { label: t.label || 'Password Generator' }
                        ]}
                    />

                    <header style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto'
                        }}>
                            <ShieldCheck size={36} />
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
                            {t.title || 'Free Password Generator'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            {t.subtitle || 'Create military-grade, cryptographically secure passwords instantly.'}
                        </p>
                    </header>

                    {/* PASSWORD DISPLAY */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass"
                        style={{
                            padding: '32px',
                            borderRadius: '24px',
                            marginBottom: '24px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>{t.generated_password || 'GENERATED PASSWORD'}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{t.strength || 'STRENGTH'}:</span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    color: strength === 'strong' ? '#10b981' : strength === 'medium' ? '#fbbf24' : '#f43f5e',
                                    textTransform: 'uppercase'
                                }}>
                                    {strength}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{
                                flex: 1,
                                minWidth: '200px',
                                fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
                                fontWeight: 800,
                                color: '#fff',
                                fontFamily: 'monospace',
                                letterSpacing: '1px',
                                overflowWrap: 'break-word',
                                wordBreak: 'break-all',
                                padding: '16px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                {password || 'Generating...'}
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={generatePassword}
                                    style={{
                                        width: '52px', height: '52px', borderRadius: '14px',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                        color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: '0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                    <RefreshCw size={20} />
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    style={{
                                        padding: '0 28px', height: '52px', borderRadius: '14px',
                                        background: copied ? '#10b981' : 'var(--accent-primary)', border: 'none',
                                        color: '#fff', cursor: 'pointer', fontWeight: 900,
                                        display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {copied ? <><Check size={18} /> {t.copied || 'COPIED!'}</> : <><Copy size={18} /> {t.copy || 'COPY'}</>}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* SETTINGS CARD */}
                    <div className="glass" style={{ padding: '40px', borderRadius: '24px', marginBottom: '60px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <Settings2 size={20} color="var(--accent-primary)" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff', letterSpacing: '2px' }}>{t.customization || 'CUSTOMIZATION'}</span>
                        </div>

                        {/* LENGTH SLIDER */}
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.95rem' }}>{t.length || 'Password Length'}</span>
                                <span style={{ color: 'var(--accent-primary)', fontWeight: 900, fontSize: '1.4rem' }}>{length}</span>
                            </div>
                            <input
                                type="range" min="8" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--accent-primary)', height: '8px', borderRadius: '10px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>8</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>64</span>
                            </div>
                        </div>

                        {/* CHARACTER OPTIONS */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                            <OptionToggle
                                active={options.uppercase}
                                label={t.uppercase || 'Uppercase (A-Z)'}
                                icon={<Type size={18} />}
                                onClick={() => setOptions({ ...options, uppercase: !options.uppercase })}
                            />
                            <OptionToggle
                                active={options.lowercase}
                                label={t.lowercase || 'Lowercase (a-z)'}
                                icon={<Languages size={18} />}
                                onClick={() => setOptions({ ...options, lowercase: !options.lowercase })}
                            />
                            <OptionToggle
                                active={options.numbers}
                                label={t.numbers || 'Numbers (0-9)'}
                                icon={<Binary size={18} />}
                                onClick={() => setOptions({ ...options, numbers: !options.numbers })}
                            />
                            <OptionToggle
                                active={options.symbols}
                                label={t.symbols || 'Symbols (!@#$)'}
                                icon={<Hash size={18} />}
                                onClick={() => setOptions({ ...options, symbols: !options.symbols })}
                            />
                        </div>
                    </div>

                    {/* EDUCATIONAL CONTENT */}
                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '32px', textAlign: 'center' }}>
                            {t.why_title || 'Why Use a Strong Password Generator?'}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                            <FeatureCard
                                icon={<ShieldCheck size={24} color="#3b82f6" />}
                                title={t.why_feature1_title || 'Cryptographically Secure'}
                                description={t.why_feature1_desc}
                            />
                            <FeatureCard
                                icon={<Zap size={24} color="#fbbf24" />}
                                title={t.why_feature2_title || '100% Client-Side'}
                                description={t.why_feature2_desc}
                            />
                            <FeatureCard
                                icon={<CheckCircle2 size={24} color="#10b981" />}
                                title={t.why_feature3_title || 'Fully Customizable'}
                                description={t.why_feature3_desc}
                            />
                        </div>

                        <div className="glass" style={{ padding: '40px', borderRadius: '24px', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Info size={24} color="var(--accent-primary)" />
                                {t.how_title || 'How to Use This Password Generator'}
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
                                {t.what_makes_title || 'What Makes a Password Strong?'}
                            </h3>
                            <p style={{ marginBottom: '16px' }}>
                                {t.what_makes_p1}
                            </p>
                            <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
                                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>{t.what_makes_li1}</strong></li>
                                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>{t.what_makes_li2}</strong></li>
                                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>{t.what_makes_li3}</strong></li>
                                <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>{t.what_makes_li4}</strong></li>
                            </ul>

                            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', marginTop: '32px' }}>
                                {t.how_it_works_title || 'How Our Generator Works'}
                            </h3>
                            <p style={{ marginBottom: '16px' }}>
                                {t.how_it_works_p1}
                            </p>
                            <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
                                <li style={{ marginBottom: '8px' }}>{t.how_it_works_li1}</li>
                                <li style={{ marginBottom: '8px' }}>{t.how_it_works_li2}</li>
                                <li style={{ marginBottom: '8px' }}>{t.how_it_works_li3}</li>
                            </ul>

                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', padding: '24px', marginTop: '32px' }}>
                                <h4 style={{ color: '#3b82f6', fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle size={20} />
                                    {t.pro_tip_title || 'Pro Tip: Use a Password Manager'}
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
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                input[type='range'] {
                    -webkit-appearance: none;
                    background: rgba(255,255,255,0.05);
                    cursor: pointer;
                }
                input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 12px rgba(59,130,246,0.6);
                    transition: 0.3s;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 20px rgba(59,130,246,0.8);
                }
            `}</style>
        </AppLayout>
    );
}

function OptionToggle({ active, label, icon, onClick }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%', padding: '18px', borderRadius: '14px',
                background: active ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${active ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255,255,255,0.05)'}`,
                display: 'flex', alignItems: 'center', gap: '14px',
                cursor: 'pointer', transition: '0.3s', textAlign: 'left'
            }}
            onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
        >
            <div style={{ color: active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.3)' }}>{icon}</div>
            <span style={{ flex: 1, color: active ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.95rem' }}>{label}</span>
            <div style={{
                width: '22px', height: '22px', borderRadius: '6px',
                border: `2px solid ${active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? 'var(--accent-primary)' : 'transparent',
                transition: '0.3s'
            }}>
                {active && <Check size={14} color="#fff" strokeWidth={3} />}
            </div>
        </button>
    );
}

function FeatureCard({ icon, title, description }: any) {
    return (
        <div className="glass" style={{ padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{description}</p>
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
