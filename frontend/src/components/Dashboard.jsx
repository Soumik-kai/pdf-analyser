import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import {
  FileText, Calendar, BookOpen, Layers, CheckCircle2, ChevronRight, Eye, X,
  LayoutDashboard, FileSearch, Maximize2, Minimize2, BarChart3, Search,
  Hash, Type, Clock, AlignLeft, Sparkles, Gauge
} from 'lucide-react';
import UploadZone from './UploadZone';
import ChatInterface from './ChatInterface';

const useStyles = createUseStyles((theme) => ({
  dashboardContainer: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: theme.colors.bgPrimary,
  },
  blankState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
    overflowY: 'auto',
  },
  heroTitle: {
    fontSize: '2.75rem',
    fontWeight: 800,
    fontFamily: theme.fontFamily.display,
    marginBottom: '12px',
    textAlign: 'center',
    letterSpacing: '-0.5px',
    background: `linear-gradient(90deg, ${theme.colors.accentIndigo}, ${theme.colors.accentCyan}, ${theme.colors.accentPurple}, ${theme.colors.accentPink}, ${theme.colors.accentTeal}, ${theme.colors.accentIndigo})`,
    backgroundSize: '400% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: '$heroFlow 7s linear infinite, $heroPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
  },
  '@keyframes heroFlow': {
    to: { backgroundPosition: '400% center' },
  },
  '@keyframes heroPopIn': {
    '0%': { opacity: 0, transform: 'scale(0.85) translateY(-10px)' },
    '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
  },
  heroSubtitle: {
    fontSize: '1.05rem',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: '40px',
    maxWidth: '520px',
    lineHeight: 1.5,
  },
  gridSteps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    width: '100%',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    }
  },
  stepCard: {
    background: theme.colors.bgCard,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: '20px',
    backdropFilter: theme.glass.backdropFilter,
    transition: theme.transitions.default,
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.12)',
      transform: 'translateY(-2px)',
    }
  },
  stepIcon: {
    color: theme.colors.accentCyan,
    marginBottom: '12px',
  },
  stepTitle: {
    fontFamily: theme.fontFamily.display,
    fontSize: '0.95rem',
    fontWeight: 600,
    color: theme.colors.textPrimary,
    marginBottom: '6px',
  },
  stepDesc: {
    fontSize: '0.8rem',
    color: theme.colors.textSecondary,
    lineHeight: 1.4,
  },
  workspace: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    padding: '24px',
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
      overflowY: 'auto',
      height: 'auto',
    }
  },
  insightsPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
    overflowY: 'auto',
    minHeight: 0,
    '@media (max-width: 1024px)': {
      height: 'auto',
      overflowY: 'visible',
    }
  },
  chatPanel: {
    height: '100%',
    minHeight: 0,
    '@media (max-width: 1024px)': {
      height: 'auto',
      minHeight: 'auto',
    }
  },
  card: {
    background: theme.colors.bgCard,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    padding: '24px',
    backdropFilter: theme.glass.backdropFilter,
    boxShadow: theme.glass.boxShadow,
    animation: '$cardPopIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both',
  },
  '@keyframes cardPopIn': {
    '0%': { opacity: 0, transform: 'scale(0.92) translateY(16px)' },
    '60%': { opacity: 1, transform: 'scale(1.015) translateY(0)' },
    '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
  },
  docHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  docTitleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  docIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: theme.borderRadius.md,
    background: `linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(217, 70, 239, 0.15))`,
    color: theme.colors.accentIndigo,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 18px rgba(139, 92, 246, 0.25)',
  },
  docTitle: {
    fontFamily: theme.fontFamily.display,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.colors.textPrimary,
    marginBottom: '4px',
  },
  docSub: {
    fontSize: '0.8rem',
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  // ---- AI Toolbar (Overview / Text Explorer / Full Screen / Data Stats) ----
  toolbar: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '9px 15px',
    borderRadius: theme.borderRadius.round,
    border: `1px solid ${theme.colors.border}`,
    background: 'rgba(255, 255, 255, 0.04)',
    color: theme.colors.textSecondary,
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: theme.transitions.bounce,
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.04)',
      color: theme.colors.textPrimary,
    },
    '&:active': {
      transform: 'translateY(0) scale(0.97)',
    }
  },
  toolBtnOverview: {
    '&:hover': {
      borderColor: theme.colors.accentIndigo,
      background: `linear-gradient(135deg, ${theme.colors.accentIndigo}, ${theme.colors.accentPurple})`,
      boxShadow: '0 8px 22px rgba(139, 92, 246, 0.45)',
      color: '#fff',
    }
  },
  toolBtnOverviewActive: {
    borderColor: theme.colors.accentIndigo,
    background: `linear-gradient(135deg, ${theme.colors.accentIndigo}, ${theme.colors.accentPurple})`,
    boxShadow: '0 8px 22px rgba(139, 92, 246, 0.45)',
    color: '#fff',
  },
  toolBtnExplorer: {
    '&:hover': {
      borderColor: theme.colors.accentCyan,
      background: `linear-gradient(135deg, ${theme.colors.accentCyan}, ${theme.colors.accentPink})`,
      boxShadow: '0 8px 22px rgba(245, 158, 11, 0.45)',
      color: '#fff',
    }
  },
  toolBtnFullscreen: {
    '&:hover': {
      borderColor: theme.colors.accentGreen,
      background: `linear-gradient(135deg, ${theme.colors.accentGreen}, ${theme.colors.accentTeal})`,
      boxShadow: '0 8px 22px rgba(16, 185, 129, 0.45)',
      color: '#fff',
    }
  },
  toolBtnFullscreenActive: {
    borderColor: theme.colors.accentGreen,
    background: `linear-gradient(135deg, ${theme.colors.accentGreen}, ${theme.colors.accentTeal})`,
    boxShadow: '0 8px 22px rgba(16, 185, 129, 0.45)',
    color: '#fff',
  },
  toolBtnStats: {
    '&:hover': {
      borderColor: theme.colors.accentPurple,
      background: `linear-gradient(135deg, ${theme.colors.accentPurple}, ${theme.colors.accentBlue}, ${theme.colors.accentPink})`,
      backgroundSize: '200% auto',
      boxShadow: '0 8px 22px rgba(217, 70, 239, 0.45)',
      color: '#fff',
    }
  },
  toolBtnStatsActive: {
    borderColor: theme.colors.accentPurple,
    background: `linear-gradient(135deg, ${theme.colors.accentPurple}, ${theme.colors.accentBlue}, ${theme.colors.accentPink})`,
    backgroundSize: '200% auto',
    boxShadow: '0 8px 22px rgba(217, 70, 239, 0.45)',
    color: '#fff',
    animation: '$toolActiveGlow 2.4s ease-in-out infinite',
  },
  '@keyframes toolActiveGlow': {
    '0%, 100%': { boxShadow: '0 8px 22px rgba(217, 70, 239, 0.45)' },
    '50%': { boxShadow: '0 8px 30px rgba(56, 189, 248, 0.55)' },
  },

  sectionTitle: {
    fontFamily: theme.fontFamily.display,
    fontSize: '1rem',
    fontWeight: 700,
    color: theme.colors.textPrimary,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  divider: {
    height: '1px',
    background: theme.colors.border,
    margin: '20px 0',
  },
  summaryText: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: theme.colors.textSecondary,
  },
  takeawayList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  takeawayItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.875rem',
    lineHeight: 1.4,
    color: theme.colors.textSecondary,
  },
  takeawayIcon: {
    color: theme.colors.accentCyan,
    flexShrink: 0,
    marginTop: '2px',
  },

  // ---- Data Stats grid ----
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: theme.transitions.default,
    '&:hover': {
      transform: 'translateY(-3px)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
    }
  },
  statIconWrap: {
    width: '34px',
    height: '34px',
    borderRadius: theme.borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  statValue: {
    fontFamily: theme.fontFamily.display,
    fontSize: '1.6rem',
    fontWeight: 800,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: '0.72rem',
    color: theme.colors.textMuted,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 8, 16, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px',
    animation: '$overlayFadeIn 0.25s ease-out both',
  },
  '@keyframes overlayFadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  modalContent: {
    background: '#150c22',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: '800px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 60px rgba(139, 92, 246, 0.15)',
    overflow: 'hidden',
    animation: '$modalPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
  },
  '@keyframes modalPopIn': {
    '0%': { opacity: 0, transform: 'scale(0.85)' },
    '70%': { opacity: 1, transform: 'scale(1.03)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
  modalHeader: {
    padding: '16px 24px',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  modalTitle: {
    fontFamily: theme.fontFamily.display,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: theme.colors.textPrimary,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    padding: '4px',
    borderRadius: theme.borderRadius.xs,
    transition: theme.transitions.default,
    '&:hover': {
      color: theme.colors.textPrimary,
      background: 'rgba(239, 68, 68, 0.15)',
      transform: 'rotate(90deg)',
    }
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  rawTextPre: {
    whiteSpace: 'pre-wrap',
    fontFamily: theme.fontFamily.sans,
    fontSize: '0.85rem',
    lineHeight: 1.6,
    color: theme.colors.textSecondary,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.sm,
    background: theme.colors.bgInput,
    margin: '0 24px 16px 24px',
    transition: theme.transitions.default,
    '&:focus-within': {
      borderColor: theme.colors.accentCyan,
      boxShadow: '0 0 12px rgba(245, 158, 11, 0.25)',
    }
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: theme.colors.textPrimary,
    fontSize: '0.85rem',
  },
  matchBadge: {
    fontSize: '0.7rem',
    padding: '3px 10px',
    borderRadius: theme.borderRadius.round,
    background: `linear-gradient(135deg, ${theme.colors.accentIndigo}, ${theme.colors.accentPurple})`,
    color: '#fff',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  }
}));

const STAT_COLORS = [
  ['#8b5cf6', '#d946ef'],
  ['#f59e0b', '#fb7185'],
  ['#10b981', '#2dd4bf'],
  ['#38bdf8', '#8b5cf6'],
  ['#d946ef', '#38bdf8'],
];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function Dashboard({ activePdf, chats, onSendMessage, onUploadSuccess, loadingChat }) {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState('overview');
  const [showTextModal, setShowTextModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dashboardRef = useRef(null);

  const activeKey = activePdf ? (activePdf.id || activePdf._id) : null;
  useEffect(() => {
    setActiveTab('overview');
    setSearchTerm('');
  }, [activeKey]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      dashboardRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const stats = useMemo(() => {
    if (!activePdf) return null;
    const text = activePdf.extractedText || '';
    const trimmed = text.trim();
    const words = trimmed.length ? trimmed.split(/\s+/) : [];
    const wordCount = words.length;
    const charCount = text.length;
    const sentenceCount = (text.match(/[.!?]+(\s|$)/g) || []).length;
    const avgWordLength = wordCount ? (words.join('').length / wordCount).toFixed(1) : '0';
    const readingTimeMin = Math.max(1, Math.round(wordCount / 200));
    return [
      { label: 'Word Count', value: wordCount.toLocaleString(), icon: Type },
      { label: 'Character Count', value: charCount.toLocaleString(), icon: Hash },
      { label: 'Reading Time', value: `${readingTimeMin} min`, icon: Clock },
      { label: 'Sentences', value: sentenceCount.toLocaleString(), icon: AlignLeft },
      { label: 'Avg Word Length', value: `${avgWordLength} chars`, icon: Gauge },
      { label: 'Pages', value: activePdf.pageCount || 0, icon: FileText },
    ];
  }, [activePdf]);

  const matchCount = useMemo(() => {
    if (!activePdf || !searchTerm.trim()) return 0;
    const text = activePdf.extractedText || '';
    try {
      const re = new RegExp(escapeRegExp(searchTerm), 'gi');
      return (text.match(re) || []).length;
    } catch {
      return 0;
    }
  }, [activePdf, searchTerm]);

  const renderHighlightedText = (text, term) => {
    if (!term.trim()) return text;
    try {
      const re = new RegExp(`(${escapeRegExp(term)})`, 'gi');
      const parts = text.split(re);
      return parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark
            key={i}
            style={{
              background: 'linear-gradient(90deg, #f59e0b, #d946ef)',
              color: '#fff',
              borderRadius: '3px',
              padding: '0 3px',
              fontWeight: 700,
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  if (!activePdf) {
    return (
      <div className={classes.dashboardContainer}>
        <div className={classes.blankState}>
          <h2 className={classes.heroTitle}>Intelligent PDF Analytics</h2>
          <p className={classes.heroSubtitle}>
            Unlock instantaneous summaries, key findings, and interact directly with any document using Gen AI.
          </p>

          <div className={classes.gridSteps}>
            <div className={`${classes.stepCard} sheen`}>
              <FileText className={classes.stepIcon} size={24} />
              <div className={classes.stepTitle}>1. Upload PDF</div>
              <div className={classes.stepDesc}>Drag and drop your document. We extract the raw text content safely.</div>
            </div>
            <div className={`${classes.stepCard} sheen`}>
              <Layers className={classes.stepIcon} size={24} />
              <div className={classes.stepTitle}>2. Instant Insights</div>
              <div className={classes.stepDesc}>Gemini instantly highlights a concise summary and 3 core takeaways.</div>
            </div>
            <div className={`${classes.stepCard} sheen`}>
              <BookOpen className={classes.stepIcon} size={24} />
              <div className={classes.stepTitle}>3. Contextual Chat</div>
              <div className={classes.stepDesc}>Ask deep questions, draft study notes, or extract structured items.</div>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '500px' }}>
            <UploadZone onUploadSuccess={onUploadSuccess} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.dashboardContainer} ref={dashboardRef}>
      <div className={classes.workspace}>
        {/* Left Column: Analysis Insights */}
        <div className={classes.insightsPanel}>
          <div className={classes.card} style={{ animationDelay: '0s' }}>
            <div className={classes.docHeader}>
              <div className={classes.docTitleSection}>
                <div className={classes.docIconWrapper}>
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className={classes.docTitle}>{activePdf.filename}</h3>
                  <div className={classes.docSub}>
                    <span>{activePdf.pageCount} page{activePdf.pageCount > 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>Uploaded recently</span>
                  </div>
                </div>
              </div>

              {/* AI Section toolbar: Overview / Text Explorer / Full Screen / Data Stats */}
              <div className={classes.toolbar}>
                <button
                  className={`${classes.toolBtn} ${classes.toolBtnOverview} ${activeTab === 'overview' ? `${classes.toolBtnOverviewActive} glow-pop` : ''}`}
                  onClick={() => setActiveTab('overview')}
                  title="Project overview"
                >
                  <LayoutDashboard size={14} />
                  <span>Overview</span>
                </button>
                <button
                  className={`${classes.toolBtn} ${classes.toolBtnExplorer}`}
                  onClick={() => setShowTextModal(true)}
                  title="Explore raw extracted text"
                >
                  <FileSearch size={14} />
                  <span>Text Explorer</span>
                </button>
                <button
                  className={`${classes.toolBtn} ${classes.toolBtnFullscreen} ${isFullscreen ? `${classes.toolBtnFullscreenActive} glow-pop` : ''}`}
                  onClick={toggleFullscreen}
                  title="Toggle full screen mode"
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  <span>Full Screen</span>
                </button>
                <button
                  className={`${classes.toolBtn} ${classes.toolBtnStats} ${activeTab === 'stats' ? `${classes.toolBtnStatsActive}` : ''}`}
                  onClick={() => setActiveTab(activeTab === 'stats' ? 'overview' : 'stats')}
                  title="Show document data stats"
                >
                  <BarChart3 size={14} />
                  <span>Data Stats</span>
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'stats' ? (
            <div className={classes.card} style={{ flex: '1 1 auto', animationDelay: '0.08s' }}>
              <h4 className={classes.sectionTitle}>
                <Gauge size={16} style={{ color: '#38bdf8' }} />
                <span className="gradient-text">Document Data Stats</span>
              </h4>
              <div className={classes.statsGrid}>
                {stats.map((s, idx) => {
                  const [c1, c2] = STAT_COLORS[idx % STAT_COLORS.length];
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className={`${classes.statCard} pop-burst`}
                      style={{ animationDelay: `${idx * 0.07}s` }}
                    >
                      <div
                        className={classes.statIconWrap}
                        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, boxShadow: `0 0 16px ${c1}55` }}
                      >
                        <Icon size={18} />
                      </div>
                      <div className={classes.statValue}>{s.value}</div>
                      <div className={classes.statLabel}>{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* AI Summary Card */}
              <div className={classes.card} style={{ flex: '0 0 auto', animationDelay: '0.08s' }}>
                <h4 className={classes.sectionTitle}>
                  <Layers size={16} style={{ color: '#8b5cf6' }} />
                  <span>AI Document Summary</span>
                </h4>
                <p className={classes.summaryText}>{activePdf.summary}</p>
              </div>

              {/* Key Takeaways Card */}
              <div className={classes.card} style={{ flex: '1 1 auto', animationDelay: '0.16s' }}>
                <h4 className={classes.sectionTitle}>
                  <CheckCircle2 size={16} style={{ color: '#f59e0b' }} />
                  <span>Key Takeaways</span>
                </h4>
                <div className={classes.takeawayList}>
                  {activePdf.keyTakeaways && activePdf.keyTakeaways.length > 0 ? (
                    activePdf.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className={classes.takeawayItem}>
                        <ChevronRight className={classes.takeawayIcon} size={15} />
                        <span>{takeaway}</span>
                      </div>
                    ))
                  ) : (
                    <div className={classes.takeawayItem}>No key takeaways generated.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Q&A Chat */}
        <div className={classes.chatPanel}>
          <ChatInterface
            chats={chats}
            onSendMessage={onSendMessage}
            loading={loadingChat}
          />
        </div>
      </div>

      {/* Text Explorer Modal */}
      {showTextModal && (
        <div className={classes.modalOverlay} onClick={() => setShowTextModal(false)}>
          <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <h3 className={classes.modalTitle}>
                <FileSearch size={18} style={{ color: '#f59e0b' }} />
                <span>Text Explorer — {activePdf.filename}</span>
              </h3>
              <button className={classes.closeBtn} onClick={() => setShowTextModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className={classes.searchBox}>
              <Search size={15} style={{ color: '#8a7ca3' }} />
              <input
                className={classes.searchInput}
                placeholder="Search inside the extracted text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm.trim() && (
                <span className={`${classes.matchBadge} badge-pop`}>{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>
              )}
            </div>
            <div className={classes.modalBody}>
              <pre className={classes.rawTextPre}>
                {renderHighlightedText(activePdf.extractedText || '', searchTerm)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
