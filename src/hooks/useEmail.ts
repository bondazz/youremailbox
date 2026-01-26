'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface Email {
    id: string;
    from: string;
    to: string;
    subject: string;
    date: string;
    text: string;
    html: string;
}

export function useEmail() {
    const [alias, setAlias] = useState<string | null>(null);
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isTabVisible = useRef(true);

    const generateAlias = useCallback(() => {
        const random = Math.random().toString(36).substring(2, 10);
        const newAlias = `${random}@tempmaila.org`;
        localStorage.setItem('temp_mail_alias', newAlias);
        setAlias(newAlias);
        return newAlias;
    }, []);

    const setCustomAlias = useCallback((customPrefix: string) => {
        const newAlias = `${customPrefix.toLowerCase()}@tempmaila.org`;
        localStorage.setItem('temp_mail_alias', newAlias);
        setAlias(newAlias);
        setEmails([]);
    }, []);

    const deleteMailbox = useCallback(() => {
        localStorage.removeItem('temp_mail_alias');
        setEmails([]);
        return generateAlias();
    }, [generateAlias]);

    useEffect(() => {
        const saved = localStorage.getItem('temp_mail_alias');
        if (saved) {
            setAlias(saved);
        } else {
            generateAlias();
        }

        const handleVisibility = () => {
            isTabVisible.current = !document.hidden;
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [generateAlias]);

    const fetchEmails = useCallback(async (isAuto = true) => {
        if (isAuto && !isTabVisible.current) return;
        if (!alias) return;

        setLoading(true);
        try {
            // Added cache-busting timestamp to ensure fresh data on every manual refresh
            const res = await fetch(`/api/emails?alias=${encodeURIComponent(alias)}&t=${Date.now()}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setEmails((prev) => {
                if (JSON.stringify(prev) === JSON.stringify(data.emails)) return prev;
                return data.emails || [];
            });
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [alias]);

    useEffect(() => {
        if (alias) {
            fetchEmails(false);
            const interval = setInterval(() => fetchEmails(true), 20000); // 20 seconds
            return () => clearInterval(interval);
        }
    }, [alias, fetchEmails]);

    return {
        alias,
        emails,
        loading,
        error,
        refreshAction: generateAlias,
        setCustomAlias,
        deleteMailbox,
        fetchEmails: () => fetchEmails(false)
    };
}
