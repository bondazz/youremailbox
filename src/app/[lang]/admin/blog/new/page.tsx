'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, Image as ImageIcon, Layout, Type, User, Link as LinkIcon, CheckCircle2, Globe, Search, Settings, Edit3, Eye, Bold, Italic, List, Heading1, Heading2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function AdvancedBlogPostPage() {
    const [activeTab, setActiveTab] = useState('editor'); // editor, seo, settings
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('Security');
    const [author, setAuthor] = useState('Samir M.');
    const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    // SEO Fields
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [canonicalUrl, setCanonicalUrl] = useState('');
    const [robots, setRobots] = useState('index, follow');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const params = useParams();
    const lang = params.lang as string;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-generate slug from title
    useEffect(() => {
        if (!slug && title) {
            setSlug(title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
        }
    }, [title]);

    const injectTag = (tag: string, endTag?: string, attributes: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        let replacement = '';
        if (tag === 'a') {
            const url = prompt('URL daxil edin:', 'https://');
            if (!url) return;
            const rel = confirm('Nofollow olsun? (OK = Nofollow, Cancel = Dofollow)') ? 'nofollow' : 'dofollow';
            replacement = `<a href="${url}" rel="${rel}" target="_blank">${selectedText || 'link'}</a>`;
        } else if (endTag) {
            replacement = `<${tag}${attributes}>${selectedText}</${endTag}>`;
        } else {
            replacement = `<${tag}${attributes}>${selectedText}</${tag}>`;
        }

        const newValue = text.substring(0, start) + replacement + text.substring(end);
        setContent(newValue);

        // Refocus and set cursor
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + replacement.length, start + replacement.length);
        }, 10);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newPost = {
            title,
            slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            category,
            author,
            image: imageUrl,
            description,
            content,
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || description,
            canonicalUrl,
            robots,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        try {
            const res = await fetch('/api/admin/blog', {
                method: 'POST',
                body: JSON.stringify(newPost),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push(`/${lang}/admin/blog`), 2000);
            }
        } catch (err) {
            alert('Xəta baş verdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '1600px', margin: '0 auto' }}>
            {/* STICKY HEADER */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: '100px',
                zIndex: 100,
                background: 'rgba(5,5,5,0.8)',
                backdropFilter: 'blur(20px)',
                padding: '20px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href={`/${lang}/admin/blog`} style={{ textDecoration: 'none' }}>
                        <button className="back-btn"><ArrowLeft size={20} /></button>
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>Rich Article Editor</h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>SEO-Optimized Content Creation</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="tab-switcher">
                        <button className={activeTab === 'editor' ? 'active' : ''} onClick={() => setActiveTab('editor')}><Edit3 size={16} /> Məzmun</button>
                        <button className={activeTab === 'seo' ? 'active' : ''} onClick={() => setActiveTab('seo')}><Globe size={16} /> SEO & Meta</button>
                        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><Settings size={16} /> Tənzimləmələr</button>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || success}
                        className="save-btn"
                    >
                        {success ? <CheckCircle2 size={20} /> : <Save size={20} />}
                        {success ? 'Uğurlu!' : (loading ? 'Yadda saxlanılır...' : 'Dərc Et')}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '40px' }}>
                <div className="editor-main-panel">
                    <AnimatePresence mode="wait">
                        {activeTab === 'editor' && (
                            <motion.div
                                key="editor"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass"
                                style={{ padding: '40px', borderRadius: '32px' }}
                            >
                                <div style={{ marginBottom: '32px' }}>
                                    <label className="input-label">MƏQALƏ BAŞLIĞI (H1)</label>
                                    <input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Gözqamaşdırıcı bir başlıq daxil edin..."
                                        className="admin-h1-input"
                                    />
                                </div>

                                <div className="rich-toolbar">
                                    <button onClick={() => injectTag('h1')} title="H1 Başlıq"><Heading1 size={18} /></button>
                                    <button onClick={() => injectTag('h2')} title="H2 Alt-başlıq"><Heading2 size={18} /></button>
                                    <div className="toolbar-sep" />
                                    <button onClick={() => injectTag('b')} title="Qalın"><Bold size={18} /></button>
                                    <button onClick={() => injectTag('i')} title="Mail"><Italic size={18} /></button>
                                    <div className="toolbar-sep" />
                                    <button onClick={() => injectTag('ul', 'ul', '>\n  <li>Item</li>\n')} title="Siyahı"><List size={18} /></button>
                                    <button onClick={() => injectTag('a')} title="Link yerləşdir (Dofollow/Nofollow)"><LinkIcon size={18} /></button>
                                    <button onClick={() => injectTag('img', 'img', ' src="https://..." style="width:100%; border-radius:15px;"')} title="Şəkil"><ImageIcon size={18} /></button>
                                </div>

                                <textarea
                                    ref={textareaRef}
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Məqalənizi yazın... HTML teqləri dəstəklənir."
                                    className="admin-rich-textarea"
                                    id="main-editor"
                                />

                                <div style={{ marginTop: '30px' }}>
                                    <label className="input-label">QISA ÖZƏT (EXCERPT)</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Axtarış nəticələrində və blog siyahısında görünəcək qısa mətn..."
                                        className="admin-excerpt-textarea"
                                        rows={3}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'seo' && (
                            <motion.div
                                key="seo"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass"
                                style={{ padding: '40px', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '30px' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--accent-primary)' }}>
                                    <Search size={24} />
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>SEO Konfiqurasiyası</h2>
                                </div>

                                <div className="google-preview">
                                    <div style={{ color: '#dadce0', fontSize: '14px', marginBottom: '4px' }}>youremailbox.com › blog › {slug || '...'}</div>
                                    <div style={{ color: '#8ab4f8', fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>{seoTitle || title || 'Postun SEO Başlığı Bura Gələcək'}</div>
                                    <div style={{ color: '#bdc1c6', fontSize: '14px', lineHeight: '1.4' }}>{seoDescription || description || 'Postun meta təsviri (description) bura gələcək. Oxunaqlı və diqqətçəkən olması vacibdir.'}</div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div>
                                        <label className="input-label">SEO TITLE (60 CHARACTER RECOMMENDED)</label>
                                        <input
                                            value={seoTitle}
                                            onChange={e => setSeoTitle(e.target.value)}
                                            className="admin-input-premium"
                                            placeholder={title}
                                        />
                                        <div className="char-count">{seoTitle.length} / 60</div>
                                    </div>
                                    <div>
                                        <label className="input-label">CANONICAL URL</label>
                                        <input
                                            value={canonicalUrl}
                                            onChange={e => setCanonicalUrl(e.target.value)}
                                            className="admin-input-premium"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">META DESCRIPTION (160 CHARACTER RECOMMENDED)</label>
                                    <textarea
                                        value={seoDescription}
                                        onChange={e => setSeoDescription(e.target.value)}
                                        className="admin-textarea-premium"
                                        rows={4}
                                        placeholder={description}
                                    />
                                    <div className="char-count">{seoDescription.length} / 160</div>
                                </div>

                                <div>
                                    <label className="input-label">ROBOTS TAGS</label>
                                    <select value={robots} onChange={e => setRobots(e.target.value)} className="admin-select-premium">
                                        <option value="index, follow">Index, Follow (Standart)</option>
                                        <option value="noindex, follow">Noindex, Follow</option>
                                        <option value="index, nofollow">Index, Nofollow</option>
                                        <option value="noindex, nofollow">Noindex, Nofollow (Hidden)</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass"
                                style={{ padding: '40px', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '30px' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <Settings size={24} color="#888" />
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Məqalə Parametrləri</h2>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div>
                                        <label className="input-label">MÜƏLLİF</label>
                                        <div className="input-with-icon-premium">
                                            <User size={18} />
                                            <input value={author} onChange={e => setAuthor(e.target.value)} className="admin-clean-input" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label">SLUG (URL PATH)</label>
                                        <div className="input-with-icon-premium">
                                            <LinkIcon size={18} />
                                            <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="post-slug" className="admin-clean-input" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">KATEQORİYA</label>
                                    <div className="input-with-icon-premium">
                                        <Layout size={18} />
                                        <select value={category} onChange={e => setCategory(e.target.value)} className="admin-clean-input" style={{ appearance: 'none' }}>
                                            <option value="Security">Security</option>
                                            <option value="Privacy">Privacy</option>
                                            <option value="Updates">Updates</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">COVER IMAGE URL</label>
                                    <div className="input-with-icon-premium">
                                        <ImageIcon size={18} />
                                        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="admin-clean-input" />
                                    </div>
                                    <img src={imageUrl} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '16px', marginTop: '16px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* LIVE PREVIEW SIDEBAR */}
                <div style={{ position: 'sticky', top: '200px', height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}><Eye size={16} /> CANLI ÖN BAXIŞ</h3>
                        <div className="seo-score-pill">SEO: 98/100</div>
                    </div>

                    <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                        <div style={{ width: '100%', height: '180px', position: 'relative' }}>
                            <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '15px', left: '15px' }}>
                                <span style={{ background: 'var(--accent-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 900, padding: '4px 10px', borderRadius: '6px' }}>{category.toUpperCase()}</span>
                            </div>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: '12px', lineHeight: 1.3 }}>{title || 'Məqalə Başlığı'}</h2>
                            <div
                                style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7 }}
                                dangerouslySetInnerHTML={{ __html: content.slice(0, 300) + '...' }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={16} color="rgba(255,255,255,0.4)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{author}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{new Date().toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="seo-checklist">
                        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', marginBottom: '15px' }}>SEO CHECKLIST</h4>
                        <CheckItem label="Focus keyword in H1" checked={title.length > 10} />
                        <CheckItem label="Meta description present" checked={!!seoDescription} />
                        <CheckItem label="H2 Subheadings used" checked={content.includes('<h2')} />
                        <CheckItem label="Internal/External links" checked={content.includes('<a')} />
                        <CheckItem label="Image ALT attributes" checked={content.includes('alt=')} />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .back-btn { width: 44px; height: 44px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.4); display: flex; alignItems: center; justifyContent: center; cursor: pointer; transition: 0.3s; }
                .tab-switcher { display: flex; background: rgba(255,255,255,0.03); padding: 5px; borderRadius: 12px; border: 1px solid rgba(255,255,255,0.08); gap: 5px; }
                .tab-switcher button { padding: 10px 18px; border-radius: 8px; border: none; background: transparent; color: rgba(255,255,255,0.4); font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; alignItems: center; gap: 8px; transition: 0.3s; }
                .tab-switcher button.active { background: rgba(255,255,255,0.05); color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                .save-btn { padding: 0 24px; height: 48px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: none; border-radius: 14px; color: #fff; font-weight: 800; display: flex; alignItems: center; gap: 10px; cursor: pointer; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2); transition: 0.4s; }
                .save-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4); }
                .admin-h1-input { width: 100%; background: none; border: none; color: #fff; font-size: 2.5rem; font-weight: 900; outline: none; letter-spacing: -1.5px; }
                .rich-toolbar { display: flex; gap: 10px; padding: 12px 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; margin-bottom: 20px; }
                .rich-toolbar button { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; transition: 0.2s; padding: 5px; display: flex; }
                .rich-toolbar button:hover { color: var(--accent-primary); }
                .toolbar-sep { width: 1px; height: 20px; background: rgba(255,255,255,0.1); margin: 0 5px; }
                .admin-rich-textarea { width: 100%; min-height: 500px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; color: #fff; font-family: 'monospace'; font-size: 1.05rem; line-height: 1.7; outline: none; transition: 0.3s; resize: vertical; }
                .admin-rich-textarea:focus { border-color: var(--accent-primary); background: rgba(0,0,0,0.3); }
                .input-label { display: block; color: rgba(255,255,255,0.3); font-size: 0.7rem; font-weight: 950; letter-spacing: 2px; margin-bottom: 12px; }
                .google-preview { background: #202124; padding: 24px; border-radius: 16px; border: 1px solid #3c4043; margin-bottom: 20px; font-family: arial, sans-serif; }
                .admin-input-premium { width: 100%; padding: 14px 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #fff; font-size: 0.95rem; outline: none; transition: 0.3s; }
                .admin-input-premium:focus { border-color: var(--accent-primary); }
                .admin-textarea-premium { width: 100%; padding: 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #fff; font-size: 0.95rem; outline: none; transition: 0.3s; resize: none; line-height: 1.6; }
                .admin-textarea-premium:focus { border-color: var(--accent-primary); }
                .admin-select-premium { width: 100%; padding: 14px 20px; background: #111; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #fff; font-size: 0.95rem; outline: none; }
                .char-count { font-size: 0.7rem; color: rgba(255,255,255,0.2); text-align: right; margin-top: 5px; font-weight: 800; }
                .input-with-icon-premium { display: flex; alignItems: center; gap: 12px; padding: 14px 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: rgba(255,255,255,0.2); }
                .admin-clean-input { flex: 1; background: none; border: none; color: #fff; outline: none; font-weight: 600; }
                .seo-score-pill { padding: 4px 12px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 100px; font-size: 0.7rem; font-weight: 900; border: 1px solid rgba(16, 185, 129, 0.2); }
                .seo-checklist { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 16px; margin-top: 24px; border: 1px solid rgba(255,255,255,0.05); }
                .admin-excerpt-textarea { width: 100%; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; color: #fff; font-size: 0.95rem; outline: none; transition: 0.3s; }
            `}</style>
        </div>
    );
}

function CheckItem({ label, checked }: { label: string, checked: boolean }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: checked ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
                {checked && <div style={{ width: '8px', height: '4px', borderLeft: '2px solid white', borderBottom: '2px solid white', transform: 'rotate(-45deg) translateY(-1px)' }} />}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: checked ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)' }}>{label}</span>
        </div>
    );
}
