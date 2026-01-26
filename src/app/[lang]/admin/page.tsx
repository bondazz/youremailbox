'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, BookOpen, Activity, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* WELCOME SECTION */}
            <header>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-1px' }}>Xoş gəldiniz, Samir</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', fontWeight: 500 }}>Sistem bu gün rəvan işləyir. Bütün qovşaqlar aktivdir.</p>
            </header>

            {/* STATS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                <StatCard title="Ümumi Maillər" value="1.2M+" change="+12%" icon={<Mail size={24} color="#3b82f6" />} isPositive />
                <StatCard title="Aktiv İstifadəçilər" value="84.2K" change="+5.4%" icon={<Users size={24} color="#8b5cf6" />} isPositive />
                <StatCard title="Blog Yazıları" value="24" change="0%" icon={<BookOpen size={24} color="#f59e0b" />} isPositive />
                <StatCard title="Sistem Yükü" value="12%" change="-2%" icon={<Activity size={24} color="#10b981" />} isPositive={false} />
            </div>

            {/* CHARTS / CONTENT PREVIEW */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="glass" style={{ padding: '32px', borderRadius: '24px', minHeight: '400px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Həftəlik Trafik</h3>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>İstifadəçi aktivliyinin analizi</p>
                        </div>
                        <button className="period-btn">Bu Həftə</button>
                    </div>

                    {/* MOCK CHART BARS */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '250px', padding: '0 20px' }}>
                        {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                style={{
                                    width: '32px',
                                    background: i === 3 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                    borderRadius: '8px 8px 4px 4px',
                                    position: 'relative'
                                }}
                            >
                                {i === 3 && <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>92K</div>}
                            </motion.div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '0 20px', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: 600 }}>
                        <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                    </div>
                </div>

                <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '24px' }}>Son Aktivlik</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <ActivityItem user="A. Troynin" action="Yazı paylaşdı" time="2 dəq əvvəl" />
                        <ActivityItem user="Sistem" action="Domain yeniləndi" time="15 dəq əvvəl" />
                        <ActivityItem user="Təhlükəsizlik" action="Bloklama uğurlu" time="1 saat əvvəl" />
                        <ActivityItem user="Samir M." action="Parametrləri dəyişdi" time="3 saat əvvəl" />
                    </div>
                    <button style={{ width: '100%', marginTop: '30px', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                        Hamısına bax
                    </button>
                </div>
            </div>

            <style jsx>{`
                .period-btn {
                    padding: 8px 16px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: #fff;
                    font-size: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}

function StatCard({ title, value, change, icon, isPositive }: any) {
    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>{icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isPositive ? '#10b981' : '#f43f5e', fontSize: '0.75rem', fontWeight: 800 }}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {change}
                </div>
            </div>
            <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>{value}</div>
            </div>
        </div>
    );
}

function ActivityItem({ user, action, time }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{action}</span></div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{time}</div>
            </div>
        </div>
    );
}
