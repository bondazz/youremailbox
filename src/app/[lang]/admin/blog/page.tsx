'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ExternalLink, Search, Filter, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const lang = params.lang as string;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/blog');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Bu yazını silmək istədiyinizə əminsiniz?')) return;

        try {
            const res = await fetch('/api/admin/blog', {
                method: 'DELETE',
                body: JSON.stringify({ slug }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                setPosts(posts.filter(p => p.slug !== slug));
            }
        } catch (err) {
            alert('Silinmə zamanı xəta baş verdi');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px' }}>Blog Yazıları</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Bütün məqalələri buradan idarə edin</p>
                </div>
                <Link href={`/${lang}/admin/blog/new`} style={{ textDecoration: 'none' }}>
                    <button className="create-post-btn">
                        <Plus size={20} />
                        Yeni Yazı Yarat
                    </button>
                </Link>
            </div>

            <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
                <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                    <div className="table-filter-pill">
                        <Search size={16} />
                        <input type="text" placeholder="Başlığa görə axtar..." />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="icon-action-btn"><Filter size={18} /></button>
                        <button className="icon-action-btn"><MoreHorizontal size={18} /></button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <tr>
                                <th className="th-cell">MƏQALƏ</th>
                                <th className="th-cell">KATEQORİYA</th>
                                <th className="th-cell">TARİX</th>
                                <th className="th-cell">MÜƏLLİF</th>
                                <th className="th-cell" style={{ textAlign: 'right' }}>HƏRƏKƏTLƏR</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {posts.map((post, idx) => (
                                    <motion.tr
                                        key={post.slug}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="table-row"
                                    >
                                        <td className="td-cell">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <img src={post.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{post.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>/{post.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="td-cell">
                                            <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800 }}>
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="td-cell" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.85rem' }}>{post.date}</td>
                                        <td className="td-cell" style={{ fontWeight: 600 }}>{post.author}</td>
                                        <td className="td-cell">
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <Link href={`/${lang}/admin/blog/edit/${post.slug}`}>
                                                    <button className="action-circle-btn edit" title="Redaktə et"><Edit2 size={16} /></button>
                                                </Link>
                                                <button className="action-circle-btn delete" onClick={() => handleDelete(post.slug)} title="Sil"><Trash2 size={16} /></button>
                                                <Link href={`/${lang}/blog/${post.slug}`} target="_blank">
                                                    <button className="action-circle-btn view" title="Bax"><ExternalLink size={16} /></button>
                                                </Link>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {loading && <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Yüklənir...</div>}
                    {!loading && posts.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Yazı tapılmadı.</div>}
                </div>
            </div>

            <style jsx>{`
                .create-post-btn {
                    padding: 14px 24px;
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    border: none;
                    border-radius: 14px;
                    color: #fff;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
                    transition: all 0.3s;
                }
                .create-post-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
                }
                .th-cell {
                    text-align: left;
                    padding: 20px 32px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: rgba(255,255,255,0.3);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .td-cell {
                    padding: 24px 32px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                }
                .table-row {
                    transition: 0.3s;
                }
                .table-row:hover {
                    background: rgba(255,255,255,0.02);
                }
                .table-filter-pill {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: rgba(255, 255, 255, 0.2);
                }
                .table-filter-pill input {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 0.85rem;
                    outline: none;
                    width: 250px;
                }
                .action-circle-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.5);
                    cursor: pointer;
                    transition: 0.2s;
                }
                .action-circle-btn:hover {
                    color: #fff;
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(255,255,255,0.2);
                }
                .action-circle-btn.delete:hover {
                    color: #f43f5e;
                    background: rgba(244, 63, 94, 0.1);
                    border-color: rgba(244, 63, 94, 0.2);
                }
            `}</style>
        </div>
    );
}
