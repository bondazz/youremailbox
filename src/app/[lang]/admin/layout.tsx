'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, Settings, LogOut, Menu, X, Bell, User, Search, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as string;

    useEffect(() => {
        const session = localStorage.getItem('admin_session');
        if (!session && !pathname.includes('/login')) {
            router.push(`/${lang}/admin/login`);
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname, router, lang]);

    const handleLogout = () => {
        localStorage.removeItem('admin_session');
        router.push(`/${lang}/admin/login`);
    };

    if (pathname.includes('/login')) return <>{children}</>;
    if (isAuthenticated === null) return <div style={{ background: '#010101', minHeight: '100vh' }} />;

    const navItems = [
        { label: 'Dashboard', href: `/${lang}/admin`, icon: <LayoutDashboard size={20} /> },
        { label: 'Blog Posts', href: `/${lang}/admin/blog`, icon: <BookOpen size={20} /> },
        { label: 'Settings', href: `/${lang}/admin/settings`, icon: <Settings size={20} /> },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', display: 'flex', overflow: 'hidden' }}>
            {/* SIDEBAR */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                style={{
                    background: 'rgba(10, 10, 10, 0.8)',
                    backdropFilter: 'blur(30px)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 100,
                    position: 'relative'
                }}
            >
                <div style={{ padding: '30px 24px', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center' }}>
                    {isSidebarOpen && <div className="logo-font" style={{ fontSize: '1.2rem', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ADMIN CORE</div>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {isSidebarOpen ? <Menu size={20} /> : <Menu size={24} />}
                    </button>
                </div>

                <div style={{ flex: 1, padding: '20px 12px' }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                                    <div className={`nav-item ${isActive ? 'active' : ''}`} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                        color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                                        background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                        transition: '0.3s',
                                        justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                                    }}>
                                        <div style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }}>{item.icon}</div>
                                        {isSidebarOpen && <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.label}</span>}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={{ padding: '20px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <button onClick={handleLogout} style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        color: 'rgba(244, 63, 94, 0.6)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: '0.3s',
                        justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                    }} className="logout-btn">
                        <LogOut size={20} />
                        {isSidebarOpen && <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* MAIN CONTENT AREA */}
            <main style={{ flex: 1, height: '100vh', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* TOP BAR */}
                <header style={{
                    padding: '20px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: 'rgba(5, 5, 5, 0.5)',
                    backdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div className="search-pill">
                            <Search size={16} />
                            <input type="text" placeholder="Search data..." />
                        </div>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={20} color="rgba(255,255,255,0.4)" />
                            <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: '#f43f5e', borderRadius: '50%', border: '2px solid #050505' }} />
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <User size={20} />
                        </div>
                    </div>
                </header>

                <div style={{ padding: '40px', flex: 1 }}>
                    {children}
                </div>
            </main>

            <style jsx>{`
                .nav-item:hover {
                    color: #fff !important;
                    background: rgba(255, 255, 255, 0.03) !important;
                }
                .logout-btn:hover {
                    color: #f43f5e !important;
                    background: rgba(244, 63, 94, 0.05) !important;
                }
                .search-pill {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 100px;
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: rgba(255, 255, 255, 0.3);
                }
                .search-pill input {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 0.85rem;
                    outline: none;
                    width: 150px;
                }
            `}</style>
        </div>
    );
}
