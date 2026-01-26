'use client';

import AppLayout from '@/components/AppLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import { KeyRound, Search, MailCheck, Filter, Globe, Zap, ArrowRight, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function ToolsClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const t = dictionary.tools_index || {};
    const dt = dictionary.tools || {};

    const tools = [
        {
            title: dt.password_generator?.label || 'Password Generator',
            description: dt.password_generator?.subtitle || 'Create truly random, cryptographically secure passwords.',
            href: `/${lang}/tools/password-generator`,
            icon: <KeyRound size={32} />,
            color: '#3b82f6',
            features: [
                dt.password_generator?.why_feature1_title || 'Cryptographically Secure',
                dt.password_generator?.length || '8-64 Characters',
                dt.password_generator?.why_feature2_title || 'Client-Side Only'
            ]
        },
        {
            title: dt.breach_checker?.label || 'Data Breach Checker',
            description: dt.breach_checker?.subtitle || 'Check if your personal email has appeared in known leaks.',
            href: `/${lang}/tools/data-breach-checker`,
            icon: <Search size={32} />,
            color: '#f43f5e',
            features: [
                dt.breach_checker?.feature1_title || '500+ Databases',
                dt.breach_checker?.feature2_title || 'Privacy-First',
                dt.breach_checker?.feature3_title || 'Real-Time Scan'
            ]
        },
        {
            title: dt.email_validator?.label || 'Email Validator',
            description: dt.email_validator?.subtitle || 'Verify if an email address is real and safe to send to.',
            href: `/${lang}/tools/email-validator`,
            icon: <MailCheck size={32} />,
            color: '#10b981',
            features: [
                dt.email_validator?.smtp_check || 'SMTP Verification',
                dt.email_validator?.mx_check || 'MX Lookup',
                dt.email_validator?.disposable_check || 'Disposable Detection'
            ]
        },
        {
            title: dt.spam_checker?.label || 'Spam Checker',
            description: dt.spam_checker?.subtitle || 'Identify potential spam triggers in email content.',
            href: `/${lang}/tools/spam-checker`,
            icon: <Filter size={32} />,
            color: '#8b5cf6',
            features: [
                dt.spam_checker?.feature1_title || 'Keyword Analysis',
                dt.spam_checker?.feature2_title || 'Format Check',
                dt.spam_checker?.feature3_title || 'Instant Results'
            ]
        }
    ];

    const apps = [
        {
            title: dictionary.footer?.categories?.features?.links?.[1]?.label || 'Free Email Aliases',
            description: 'Create permanent email aliases for professional privacy.',
            href: '#',
            icon: <Globe size={24} />,
            external: true
        },
        {
            title: 'Gmail Plus Trick',
            description: 'Master the plus-addressing technique for infinite tracking aliases.',
            href: '#',
            icon: <Zap size={24} />,
            external: true
        }
    ];

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <div className="main-wrapper" style={{ padding: '40px 20px 80px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Breadcrumbs
                        items={[
                            { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                            { label: dictionary.navigation?.tools || 'Free Tools' }
                        ]}
                    />

                    <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '24px',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px auto'
                        }}>
                            <ShieldCheck size={40} />
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, color: '#fff', marginBottom: '24px', lineHeight: 1.1 }}>
                            {t.title || 'Free Email Security Tools'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                            {t.subtitle || 'Professional privacy and security utilities to protect your digital identity.'}
                        </p>
                    </header>

                    {/* TOOLS GRID */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '28px',
                        marginBottom: '80px'
                    }}>
                        {tools.map((tool, idx) => (
                            <Link href={tool.href} key={idx} style={{ textDecoration: 'none' }}>
                                <div className="glass tool-card" style={{
                                    padding: '36px',
                                    borderRadius: '28px',
                                    minHeight: '400px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{
                                        width: '68px',
                                        height: '68px',
                                        borderRadius: '18px',
                                        background: `linear-gradient(135deg, ${tool.color}20 0%, ${tool.color}10 100%)`,
                                        border: `1px solid ${tool.color}30`,
                                        color: tool.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '24px'
                                    }}>
                                        {tool.icon}
                                    </div>
                                    <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, marginBottom: '12px' }}>{tool.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>{tool.description}</p>

                                    <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {tool.features.map((feature, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                                                <CheckCircle2 size={14} color={tool.color} />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: tool.color, fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                                        {t.launch_tool || 'LAUNCH TOOL'} <ArrowRight size={16} />
                                    </div>

                                    <div className="card-accent" style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '4px',
                                        background: `linear-gradient(90deg, ${tool.color} 0%, transparent 100%)`,
                                        opacity: 0,
                                        transition: '0.4s'
                                    }} />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* WHY USE OUR TOOLS */}
                    <section style={{ marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '48px', textAlign: 'center' }}>
                            {t.why_title || 'Why Choose Our Security Tools?'}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                            <BenefitCard
                                icon={<Lock size={28} color="#3b82f6" />}
                                title={t.benefit1_title || "100% Privacy-First"}
                                description={t.benefit1_desc}
                            />
                            <BenefitCard
                                icon={<Zap size={28} color="#fbbf24" />}
                                title={t.benefit2_title || "Instant Results"}
                                description={t.benefit2_desc}
                            />
                            <BenefitCard
                                icon={<ShieldCheck size={28} color="#10b981" />}
                                title={t.benefit3_title || "Enterprise-Grade Security"}
                                description={t.benefit3_desc}
                            />
                        </div>
                    </section>

                    {/* COMPLEMENTARY APPS */}
                    <section style={{ marginBottom: '80px' }}>
                        <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '40px', textAlign: 'center' }}>
                            {t.complementary_title || 'Complementary Privacy Apps'}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            {apps.map((app, idx) => (
                                <div key={idx} className="glass" style={{ padding: '32px', borderRadius: '24px', display: 'flex', gap: '24px', alignItems: 'start', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--accent-primary)',
                                        flexShrink: 0
                                    }}>
                                        {app.icon}
                                    </div>
                                    <div>
                                        <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>{app.title}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '16px' }}>{app.description}</p>
                                        <a href={app.href} style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            VISIT PROJECT <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA SECTION */}
                    <section style={{
                        background: 'linear-gradient(135deg, rgba(77,47,151,0.2) 0%, rgba(59,130,246,0.15) 100%)',
                        borderRadius: '32px',
                        padding: '60px 40px',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.08)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(77,47,151,0.15) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
                                {t.premium_cta_title || 'Need More Advanced Features?'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
                                {t.premium_cta_desc || 'Upgrade to premium for unlimited email aliases and advanced monitoring.'}
                            </p>
                            <button className="premium-btn" style={{ padding: '18px 48px', fontSize: '1.05rem', fontWeight: 900, borderRadius: '100px' }}>
                                {t.premium_cta_button || 'EXPLORE PREMIUM'}
                            </button>
                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '32px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 700, flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={16} /> 30-DAY GUARANTEE</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={16} /> INSTANT SETUP</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .tool-card:hover {
                    background: rgba(255,255,255,0.06) !important;
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }
                .tool-card:hover .card-accent {
                    opacity: 1 !important;
                }
                @media (max-width: 640px) {
                    .hero-title { font-size: 2.2rem !important; }
                }
            `}</style>
        </AppLayout>
    );
}

function BenefitCard({ icon, title, description }: any) {
    return (
        <div className="glass" style={{
            padding: '36px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            border: '1px solid rgba(255,255,255,0.05)',
            transition: '0.3s'
        }}>
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>{title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>{description}</p>
        </div>
    );
}
