'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, BarChart3, Info, RefreshCw, Loader2, AlertTriangle, CheckCircle2, TrendingUp, FileText, Zap } from 'lucide-react';

export default function SpamCheckerClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'result'>('idle');
    const [analysis, setAnalysis] = useState<any>(null);

    const performAnalysis = () => {
        const spamKeywords = ['won', 'prize', 'free', 'urgent', 'winner', 'claim', 'money', 'gift', 'congratulations', 'invest', 'crypto', 'viagra', 'lottery', 'click here', 'act now', 'limited time'];
        const lowCase = content.toLowerCase();

        let foundKeywords = spamKeywords.filter(word => lowCase.includes(word));
        let uppercasePercent = (content.replace(/[^A-Z]/g, "").length / content.length) * 100 || 0;
        let exclamationCount = (content.match(/!/g) || []).length;

        let score = (foundKeywords.length * 12) + (uppercasePercent > 30 ? 25 : 0) + (content.length < 50 ? 15 : 0) + (exclamationCount > 3 ? 10 : 0);
        score = Math.min(score, 100);

        setAnalysis({
            score,
            keywords: foundKeywords,
            uppercase: uppercasePercent.toFixed(1),
            exclamations: exclamationCount,
            verdict: score > 60 ? 'HIGH RISK' : score > 30 ? 'MODERATE RISK' : 'LOW RISK'
        });
    }

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.length < 5) return;
        setStatus('analyzing');
        setTimeout(() => {
            performAnalysis();
            setStatus('result');
        }, 2500);
    };

    const t = dictionary.tools?.spam_checker || {};

    const getScoreColor = (score: number) => {
        if (score > 60) return '#f43f5e';
        if (score > 30) return '#fbbf24';
        return '#10b981';
    };

    return (
        <AppLayout dictionary={dictionary} lang={lang}>
            <div className="main-wrapper" style={{ padding: '40px 20px 80px 20px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <Breadcrumbs
                        items={[
                            { label: dictionary.navigation?.home || 'Home', href: `/${lang}` },
                            { label: dictionary.navigation?.tools || 'Free Tools', href: `/${lang}/tools` },
                            { label: t.label || 'Spam Checker' }
                        ]}
                    />

                    <header style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            color: '#8b5cf6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto'
                        }}>
                            <Filter size={36} />
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
                            {t.title || 'Spam Checker'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            {t.subtitle || 'Identify spam triggers before they hit the inbox.'}
                        </p>
                    </header>

                    {/* ANALYSIS FORM */}
                    <form onSubmit={handleAnalyze} style={{ marginBottom: '60px' }}>
                        <div className="glass" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(255,255,255,0.01)' }}>
                            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={18} color="rgba(255,255,255,0.5)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>{t.content_label || 'EMAIL CONTENT'}</span>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={t.placeholder || "Paste your email content here..."}
                                style={{
                                    width: '100%', minHeight: '280px', background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px',
                                    color: '#fff', fontSize: '1rem', outline: 'none', resize: 'vertical',
                                    marginBottom: '20px', lineHeight: 1.7, fontFamily: 'inherit'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 700 }}>
                                    {content.length} {t.characters || 'CHARACTERS'} • {content.split(/\s+/).filter(w => w.length > 0).length} {t.words || 'WORDS'}
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'analyzing' || content.length < 5}
                                    style={{
                                        padding: '16px 40px', borderRadius: '14px',
                                        background: status === 'analyzing' || content.length < 5 ? 'rgba(139, 92, 246, 0.3)' : '#8b5cf6',
                                        color: '#fff', fontWeight: 900, cursor: status === 'analyzing' || content.length < 5 ? 'not-allowed' : 'pointer', border: 'none',
                                        display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s', fontSize: '0.95rem'
                                    }}
                                >
                                    {status === 'analyzing' ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <BarChart3 size={20} />}
                                    {status === 'analyzing' ? t.analyzing || 'ANALYZING...' : t.button || 'ANALYZE SPAM SCORE'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* ANALYSIS RESULTS */}
                    <AnimatePresence mode="wait">
                        {status === 'result' && analysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ marginBottom: '60px' }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
                                    {/* SCORE CARD */}
                                    <div className="glass" style={{ gridColumn: 'span 12 / span 4', padding: '40px', borderRadius: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ position: 'relative', width: '140px', height: '140px', marginBottom: '24px' }}>
                                            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                                <motion.circle
                                                    cx="70" cy="70" r="60" fill="none"
                                                    stroke={getScoreColor(analysis.score)}
                                                    strokeWidth="10"
                                                    strokeDasharray="377"
                                                    initial={{ strokeDashoffset: 377 }}
                                                    animate={{ strokeDashoffset: 377 - (analysis.score / 100) * 377 }}
                                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>{analysis.score}</span>
                                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>{t.score_label || 'SPAM SCORE'}</span>
                                            </div>
                                        </div>
                                        <h3 style={{
                                            fontSize: '1.3rem', fontWeight: 900,
                                            color: getScoreColor(analysis.score),
                                            marginBottom: '8px'
                                        }}>
                                            {analysis.verdict === 'HIGH RISK' ? t.verdict_high : analysis.verdict === 'MODERATE RISK' ? t.verdict_moderate : t.verdict_low}
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                            {analysis.score > 60 ? t.msg_high : analysis.score > 30 ? t.msg_moderate : t.msg_low}
                                        </p>
                                    </div>
                                    {/* DETAILED ANALYSIS */}
                                    <div className="glass" style={{ gridColumn: 'span 12 / span 8', padding: '40px', borderRadius: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                            <Info size={20} color="#8b5cf6" />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>{t.detailed_analysis || 'DETAILED ANALYSIS'}</span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            <AnalysisRow
                                                label={t.keywords_detected || "Spam Keywords Detected"}
                                                value={
                                                    analysis.keywords.length > 0 ? (
                                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                            {analysis.keywords.map((k: string, i: number) => (
                                                                <span key={i} style={{ padding: '6px 14px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                                                                    {k.toUpperCase()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : <span style={{ color: '#10b981', fontWeight: 800 }}>{t.none_found || 'NONE FOUND ✓'}</span>
                                                }
                                            />
                                            <AnalysisRow
                                                label={t.uppercase_usage || "Uppercase Usage"}
                                                value={<span style={{ color: analysis.uppercase > 30 ? '#f43f5e' : '#10b981', fontWeight: 900 }}>{analysis.uppercase}%</span>}
                                                note={analysis.uppercase > 30 ? t.uppercase_note_high : t.uppercase_note_ok}
                                            />
                                            <AnalysisRow
                                                label={t.excl_marks || "Exclamation Marks"}
                                                value={<span style={{ color: analysis.exclamations > 3 ? '#fbbf24' : '#10b981', fontWeight: 900 }}>{analysis.exclamations}</span>}
                                                note={analysis.exclamations > 3 ? t.excl_note_high : t.excl_note_ok}
                                            />
                                            <AnalysisRow
                                                label={t.overall_risk || "Overall Deliverability Risk"}
                                                value={
                                                    <span style={{
                                                        fontWeight: 900,
                                                        color: getScoreColor(analysis.score)
                                                    }}>
                                                        {analysis.score > 60 ? t.risk_high : analysis.score > 30 ? t.risk_moderate : t.risk_low}
                                                    </span>
                                                }
                                            />
                                        </div>

                                        <button
                                            onClick={() => setStatus('idle')}
                                            style={{ marginTop: '32px', width: '100%', padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem' }}
                                        >
                                            <RefreshCw size={18} /> {t.new_analysis || 'NEW ANALYSIS'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* EDUCATIONAL CONTENT */}
                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '32px', textAlign: 'center' }}>
                            {t.why_title || 'Understanding Spam Filters'}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                            <FeatureCard
                                icon={<TrendingUp size={24} color="#8b5cf6" />}
                                title={t.feature1_title || "Keyword Analysis"}
                                description={t.feature1_desc}
                            />
                            <FeatureCard
                                icon={<Zap size={24} color="#fbbf24" />}
                                title={t.feature2_title || "Formatting Checks"}
                                description={t.feature2_desc}
                            />
                            <FeatureCard
                                icon={<CheckCircle2 size={24} color="#10b981" />}
                                title={t.feature3_title || "Instant Feedback"}
                                description={t.feature3_desc}
                            />
                        </div>

                        <div className="glass" style={{ padding: '40px', borderRadius: '24px', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Info size={24} color="#8b5cf6" />
                                {t.how_to_title || 'How to Use This Tool'}
                            </h3>
                            <ol style={{ color: 'var(--text-muted)', lineHeight: 2, paddingLeft: '20px', margin: 0 }}>
                                <li><strong style={{ color: '#fff' }}>{t.how_step1}</strong></li>
                                <li><strong style={{ color: '#fff' }}>{t.how_step2}</strong></li>
                                <li><strong style={{ color: '#fff' }}>{t.how_step3}</strong></li>
                                <li><strong style={{ color: '#fff' }}>{t.how_step4}</strong></li>
                                <li><strong style={{ color: '#fff' }}>{t.how_step5}</strong></li>
                            </ol>
                        </div>

                        <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>
                                {t.common_triggers_title || 'Common Spam Triggers to Avoid'}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                                <SpamTrigger
                                    title={t.trigger1_title}
                                    examples={['Free', 'Winner', 'Prize', 'Act Now', 'Limited Time']}
                                />
                                <SpamTrigger
                                    title={t.trigger2_title}
                                    examples={['Money', 'Cash', 'Invest', 'Profit', 'Earn $$$']}
                                />
                                <SpamTrigger
                                    title={t.trigger3_title}
                                    examples={['Urgent', 'Expires Today', 'Last Chance', 'Hurry']}
                                />
                                <SpamTrigger
                                    title={t.trigger4_title}
                                    examples={['ALL CAPS', 'Multiple!!!', 'Red text', 'Large fonts']}
                                />
                            </div>

                            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', marginTop: '32px' }}>
                                {t.best_practices_title || 'Best Practices for Email Deliverability'}
                            </h3>
                            <ul style={{ paddingLeft: '24px', marginBottom: '32px' }}>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.practice_li1}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.practice_li2}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.practice_li3}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.practice_li4}</strong></li>
                                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>{t.practice_li5}</strong></li>
                            </ul>

                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '16px', padding: '24px', marginTop: '32px' }}>
                                <h4 style={{ color: '#8b5cf6', fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={20} />
                                    {t.pro_tip_title || 'Pro Tip for Marketers'}
                                </h4>
                                <p style={{ margin: 0 }}>
                                    {t.pro_tip_p}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ SECTION */}
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '32px', textAlign: 'center' }}>
                            {t.faq_title || 'Frequently Asked Questions'}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <FAQItem question={t.faq_q1} answer={t.faq_a1} />
                            <FAQItem question={t.faq_q2} answer={t.faq_a2} />
                            <FAQItem question={t.faq_q3} answer={t.faq_a3} />
                            <FAQItem question={t.faq_q4} answer={t.faq_a4} />
                            <FAQItem question={t.faq_q5} answer={t.faq_a5} />
                            <FAQItem question={t.faq_q6} answer={t.faq_a6} />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 900px) {
                    .glass[style*="gridColumn: span 12 / span 4"],
                    .glass[style*="gridColumn: span 12 / span 8"] {
                        grid-column: span 12 !important;
                    }
                }
            `}</style>
        </AppLayout>
    );
}

function AnalysisRow({ label, value, note }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', gap: '20px', flexWrap: 'wrap' }}>
            <div>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{label}</span>
                {note && <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>{note}</span>}
            </div>
            <div style={{ textAlign: 'right' }}>{value}</div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: any) {
    return (
        <div className="glass" style={{ padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{description}</p>
        </div>
    );
}

function SpamTrigger({ title, examples }: any) {
    return (
        <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', padding: '20px' }}>
            <h5 style={{ color: '#f43f5e', fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>{title}</h5>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {examples.map((ex: string, i: number) => (
                    <li key={i} style={{ marginBottom: '6px' }}>{ex}</li>
                ))}
            </ul>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                {question}
                <span style={{ fontSize: '1.5rem', transition: '0.3s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
            </button>
            {isOpen && (
                <div style={{ padding: '0 24px 20px 24px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    {answer}
                </div>
            )}
        </div>
    );
}
