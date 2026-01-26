'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface BlogCardProps {
    slug: string;
    lang: string;
    image: string;
    category: string;
    title: string;
    description: string;
    author: string;
    date: string;
    dictionary: any;
}

export function BlogCard({ slug, lang, image, category, title, description, author, date, dictionary }: BlogCardProps) {
    return (
        <Link href={`/${lang}/blog/${slug}`} style={{ textDecoration: 'none' }}>
            <motion.div
                whileHover={{ y: -8 }}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
                <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/10', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                    <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{category}</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-primary)', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>AT</div>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{author} • {date}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
