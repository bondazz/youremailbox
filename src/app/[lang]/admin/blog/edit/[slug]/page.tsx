'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, Layout, Type, User, Link as LinkIcon, CheckCircle2, Globe, Search, Settings, Edit3, Eye, Bold, Italic, List, Heading1, Heading2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function EditBlogPostPage() {
    const [activeTab, setActiveTab] = useState('editor');
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('Security');
    const [author, setAuthor] = useState('Samir M.');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [canonicalUrl, setCanonicalUrl] = useState('');
    const [robots, setRobots] = useState('index, follow');

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const params = useParams();
    const lang = params.lang as string;
    const postSlug = params.slug as string;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (postSlug) {
            fetch(`/api/admin/blog?slug=${postSlug}`)
                .then(res => res.json())
                .then(data => {
                    setTitle(data.title || '');
                    setSlug(data.slug || '');
                    setCategory(data.category || 'Security');
                    setAuthor(data.author || 'Samir M.');
                    setImageUrl(data.image || '');
                    setDescription(data.description || '');
                    setContent(data.content || '');
                    setSeoTitle(data.seoTitle || '');
                    setSeoDescription(data.seoDescription || '');
                    setCanonicalUrl(data.canonicalUrl || '');
                    setRobots(data.robots || 'index, follow');
                })
                .finally(() => setFetching(false));
        }
    }, [postSlug]);

    const injectTag = (tag: string, endTag?: string, attributes: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        let replacement = '';
        if (tag === 'a') {
            const url = prompt('URL:', 'https://');
            if (!url) return;
            const rel = confirm('Nofollow?') ? 'nofollow' : 'dofollow';
            replacement = `<a href="${url}" rel="${rel}" target="_blank">${selectedText || 'link'}</a>`;
        } else if (endTag) {
            replacement = `<${tag}${attributes}>${selectedText}</${endTag}>`;
        } else {
            replacement = `<${tag}${attributes}>${selectedText}</${tag}>`;
        }
        setContent(text.substring(0, start) + replacement + text.substring(end));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const updatedPost = {
            title, slug, category, author, image: imageUrl, description, content,
            seoTitle, seoDescription, canonicalUrl, robots,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        try {
            const res = await fetch('/api/admin/blog', {
                method: 'POST',
                body: JSON.stringify(updatedPost),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push(`/${lang}/admin/blog`), 1500);
            }
        } catch (err) { alert('Səhv oldu'); } finally { setLoading(false); }
    };

    if (fetching) return <div style={{ color: '#fff', padding: '100px', textAlign: 'center' }}>Yüklənir...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '1600px', margin: '0 auto' }}>
            {/* STICKY HEADER REUSED FROM NEW PAGE */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '100px', zIndex: 100, background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href={`/${lang}/admin/blog`} style={{ textDecoration: 'none' }}><button className="back-btn"><ArrowLeft size={20} /></button></Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Məqalə Redaktəsi</h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.85rem' }}>"{title}" yazısını təkmilləşdirin</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="tab-switcher">
                        <button className={activeTab === 'editor' ? 'active' : ''} onClick={() => setActiveTab('editor')}><Edit3 size={16} /> Məzmun</button>
                        <button className={activeTab === 'seo' ? 'active' : ''} onClick={() => setActiveTab('seo')}><Globe size={16} /> SEO & Meta</button>
                        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><Settings size={16} /> Tənzimləmələr</button>
                    </div>
                    <button onClick={handleSubmit} disabled={loading || success} className="save-btn">
                        {success ? <CheckCircle2 size={20} /> : <Save size={20} />}
                        {success ? 'Yeniləndi!' : (loading ? 'Yadda saxlanılır...' : 'Dəyişikliyi Saxla')}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '40px' }}>
                <div className="editor-main-panel">
                    <AnimatePresence mode="wait">
                        {activeTab === 'editor' && (
                            <motion.div key="editor" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: '40px', borderRadius: '32px' }}>
                                <input value={title} onChange={e => setTitle(e.target.value)} className="admin-h1-input" style={{ marginBottom: '24px' }} />
                                <div className="rich-toolbar">
                                    <button onClick={() => injectTag('h2')}><Heading1 size={18} /></button>
                                    <button onClick={() => injectTag('b')}><Bold size={18} /></button>
                                    <button onClick={() => injectTag('a')}><LinkIcon size={18} /></button>
                                    <button onClick={() => injectTag('img', 'img', ' src="..."')}><ImageIcon size={18} /></button>
                                </div>
                                <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} className="admin-rich-textarea" />
                            </motion.div>
                        )}

                        {activeTab === 'seo' && (
                            <motion.div key="seo" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: '40px', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="google-preview">
                                    <div style={{ color: '#8ab4f8', fontSize: '18px' }}>{seoTitle || title}</div>
                                    <div style={{ color: '#bdc1c6', fontSize: '14px' }}>{seoDescription || description}</div>
                                </div>
                                <label className="input-label">SEO TITLE</label>
                                <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="admin-input-premium" />
                                <label className="input-label">META DESCRIPTION</label>
                                <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)} className="admin-textarea-premium" rows={4} />
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: '40px', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <label className="input-label">MÜƏLLİF</label>
                                <input value={author} onChange={e => setAuthor(e.target.value)} className="admin-input-premium" />
                                <label className="input-label">IMAGE URL</label>
                                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="admin-input-premium" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ position: 'sticky', top: '200px' }}>
                    <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                        <img src={imageUrl} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                        <div style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.2rem', color: '#fff' }}>{title}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .back-btn { width: 44px; height: 44px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.4); display: flex; alignItems: center; justifyContent: center; cursor: pointer; }
                .tab-switcher { display: flex; background: rgba(255,255,255,0.03); padding: 5px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); gap: 5px; }
                .tab-switcher button { padding: 10px 18px; border-radius: 8px; border: none; background: transparent; color: rgba(255,255,255,0.4); font-size: 0.85rem; font-weight: 700; cursor: pointer; }
                .tab-switcher button.active { background: rgba(255,255,255,0.05); color: #fff; }
                .save-btn { padding: 0 24px; height: 48px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: none; border-radius: 14px; color: #fff; font-weight: 800; display: flex; alignItems: center; gap: 10px; cursor: pointer; }
                .admin-h1-input { width: 100%; background: none; border: none; color: #fff; font-size: 2rem; font-weight: 900; outline: none; }
                .rich-toolbar { display: flex; gap: 10px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 20px; }
                .rich-toolbar button { background: none; border: none; color: #888; cursor: pointer; }
                .admin-rich-textarea { width: 100%; min-height: 400px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); padding: 20px; color: #fff; font-family: monospace; outline: none; resize: vertical; }
                .input-label { display: block; color: rgba(255,255,255,0.3); font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; }
                .google-preview { background: #202124; padding: 20px; border-radius: 12px; margin-bottom: 10px; }
                .admin-input-premium { width: 100%; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #fff; outline: none; }
                .admin-textarea-premium { width: 100%; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #fff; outline: none; }
            `}</style>
        </div>
    );
}
