'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as string;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Mock Auth Logic - Match the credentials provided by user
        if (email === 'info@youremailbox.com' && password === 'Samir_1155!') {
            localStorage.setItem('admin_session', 'active');
            router.push(`/${lang}/admin`);
        } else {
            setError('Geçersiz e-posta veya şifre.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#010101',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* MESH BACKGROUND */}
            <div className="mesh-container" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div className="mesh-blob blob-1" style={{ opacity: 0.15 }}></div>
                <div className="mesh-blob blob-2" style={{ opacity: 0.15 }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    position: 'relative',
                    zIndex: 10,
                    padding: '0 24px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px auto',
                        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)'
                    }}>
                        <ShieldCheck color="#fff" size={32} />
                    </div>
                    <h1 className="logo-font" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Admin Panel</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Poçt sistemini idarə edin</p>
                </div>

                <div className="glass" style={{ padding: '40px', borderRadius: '32px', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>E-poçt Ünvanı</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="info@youremailbox.com"
                                    required
                                    className="premium-input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Şifrə</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="premium-input-field"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ color: '#f43f5e', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="admin-login-btn"
                        >
                            {loading ? 'Giriş edilir...' : 'Panelə Daxil Ol'}
                            <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                        </button>
                    </form>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <Link href={`/${lang}`} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: '0.3s' }}>
                        ← Əsas səhifəyə qayıt
                    </Link>
                </div>
            </motion.div>

            <style jsx>{`
                .premium-input-field {
                    width: 100%;
                    padding: 16px 16px 16px 52px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    color: #fff;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.3s;
                }
                .premium-input-field:focus {
                    border-color: var(--accent-primary);
                    background: rgba(255, 255, 255, 0.06);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
                }
                .admin-login-btn {
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    border: none;
                    border-radius: 16px;
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.4s;
                    box-shadow: 0 15px 30px rgba(59, 130, 246, 0.3);
                }
                .admin-login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.45);
                }
                .admin-login-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

import Link from 'next/link';
