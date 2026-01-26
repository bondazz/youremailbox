'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    lang: string;
    dictionary: any;
}

export default function Breadcrumb({ items, lang, dictionary }: BreadcrumbProps) {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': dictionary.navigation?.home || 'Home',
                'item': `https://youremailbox.com/${lang}`
            },
            ...items.map((item, index) => ({
                '@type': 'ListItem',
                'position': index + 2,
                'name': item.label,
                'item': item.href ? `https://youremailbox.com${item.href}` : undefined
            })).filter(i => i.item)
        ]
    };

    return (
        <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ol style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                listStyle: 'none',
                padding: 0,
                margin: 0
            }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                        href={`/${lang}`}
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    >
                        <Home size={16} />
                        {dictionary.navigation?.home || 'Home'}
                    </Link>
                    <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                </li>

                {items.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.href ? (
                            <>
                                <Link
                                    href={item.href}
                                    style={{
                                        color: 'rgba(255,255,255,0.5)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                                >
                                    {item.label}
                                </Link>
                                {index < items.length - 1 && <ChevronRight size={14} color="rgba(255,255,255,0.3)" />}
                            </>
                        ) : (
                            <span style={{
                                color: '#fff',
                                fontSize: '0.9rem',
                                fontWeight: 700
                            }}>
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
