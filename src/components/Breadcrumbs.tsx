'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="breadcrumb-clean" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>/</span>}
                    {item.href ? (
                        <Link
                            href={item.href}
                            style={{
                                color: 'rgba(255,255,255,0.5)',
                                textDecoration: 'none',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span style={{
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '200px'
                        }}>
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}
