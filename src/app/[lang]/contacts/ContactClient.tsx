'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Mail, Shield, MessageSquare, Send } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function ContactClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const content = dictionary.contact_us;

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <div className="main-wrapper" style={{ padding: '40px 20px 80px 20px' }}>
                <Breadcrumbs
                    items={[
                        { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                        { label: content.title }
                    ]}
                />

                <header style={{ textAlign: 'center', marginBottom: '80px', marginTop: '40px' }}>
                    <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '24px', letterSpacing: '-1.5px', fontWeight: 900 }}>{content.title}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>{content.seo_intro}</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '60px', maxWidth: '1100px', margin: '0 auto' }} className="contact-grid">
                    {/* CONTACT FORM */}
                    <div className="glass" style={{ padding: '40px', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="contact-form-row">
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '10px', letterSpacing: '1px' }}>{content.form.name.toUpperCase()}</label>
                                    <input type="text" className="contact-input" placeholder="Samir M." />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '10px', letterSpacing: '1px' }}>{content.form.email.toUpperCase()}</label>
                                    <input type="email" className="contact-input" placeholder="samir@example.com" />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '10px', letterSpacing: '1px' }}>{content.form.subject.toUpperCase()}</label>
                                <input type="text" className="contact-input" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '10px', letterSpacing: '1px' }}>{content.form.message.toUpperCase()}</label>
                                <textarea className="contact-input" rows={6} style={{ resize: 'none' }}></textarea>
                            </div>
                            <button className="contact-submit">
                                {content.form.submit}
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    {/* CONTACT INFO */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '14px', color: 'var(--accent-primary)' }}>
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)' }}>{(content.info.support_label || 'GENERAL SUPPORT').toUpperCase()}</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{content.info.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '14px', color: '#f43f5e' }}>
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)' }}>{(content.info.abuse_label || 'ABUSE REPORTS').toUpperCase()}</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{content.info.abuse}</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '12px', borderRadius: '14px', color: '#a855f7' }}>
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)' }}>{(content.info.social_label || 'SOCIAL NODES').toUpperCase()}</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>@YourEmailBox</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .contact-input {
                    width: 100%;
                    padding: 16px 20px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    color: #fff;
                    font-size: 1rem;
                    outline: none;
                    transition: 0.3s;
                }
                .contact-input:focus {
                    border-color: var(--accent-primary);
                    background: rgba(59, 130, 246, 0.02);
                }
                .contact-submit {
                    width: 100%;
                    padding: 18px;
                    background: var(--accent-primary);
                    color: #fff;
                    border: none;
                    border-radius: 14px;
                    font-size: 1rem;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    alignItems: center;
                    justify-content: center;
                    gap: 12px;
                    transition: 0.4s;
                    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
                }
                .contact-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.45);
                    filter: brightness(1.1);
                }
                @media (max-width: 900px) {
                    .contact-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 600px) {
                    .contact-form-row { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </AppLayout>
    );
}
