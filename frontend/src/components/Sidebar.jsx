import React from 'react';
import { createUseStyles } from 'react-jss';
import { Trash2, FileText, Database, ShieldAlert, Sparkles, AlertCircle, Atom, Server, Boxes, Zap, Wind } from 'lucide-react';

const useStyles = createUseStyles((theme) => ({
  sidebar: {
    width: '320px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.bgPanel,
    borderRight: `1px solid ${theme.colors.border}`,
    backdropFilter: theme.glass.backdropFilter,
    overflow: 'hidden',
  },
  header: {
    padding: '24px 20px',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 800,
    fontFamily: theme.fontFamily.display,
    letterSpacing: '-0.5px',
  },
  logoIcon: {
    color: theme.colors.accentCyan,
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: theme.borderRadius.sm,
    background: 'rgba(20, 12, 32, 0.4)',
    border: `1px solid ${theme.colors.border}`,
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statusGreen: {
    background: theme.colors.accentGreen,
    boxShadow: `0 0 8px ${theme.colors.accentGreen}`,
  },
  statusYellow: {
    background: theme.colors.accentPurple,
    boxShadow: `0 0 8px ${theme.colors.accentPurple}`,
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  listTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: theme.colors.textMuted,
    fontWeight: 700,
    paddingLeft: '8px',
    marginBottom: '4px',
  },
  pdfItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    background: 'rgba(42, 24, 61, 0.2)',
    cursor: 'pointer',
    transition: theme.transitions.default,
    animation: '$popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
    '&:hover': {
      background: theme.colors.bgCardHover,
      borderColor: 'rgba(255,255,255,0.15)',
      transform: 'translateX(2px)',
    }
  },
  '@keyframes popIn': {
    '0%': { opacity: 0, transform: 'scale(0.85) translateX(-8px)' },
    '60%': { opacity: 1, transform: 'scale(1.02) translateX(0)' },
    '100%': { opacity: 1, transform: 'scale(1) translateX(0)' },
  },
  pdfItemActive: {
    background: 'rgba(139, 92, 246, 0.15)',
    borderColor: theme.colors.accentIndigo,
    boxShadow: 'inset 0 0 10px rgba(139, 92, 246, 0.05)',
    '&:hover': {
      background: 'rgba(139, 92, 246, 0.2)',
      borderColor: theme.colors.accentIndigo,
    }
  },
  pdfInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0, // Enables text truncation
    flex: 1,
  },
  pdfIcon: {
    color: theme.colors.accentCyan,
    flexShrink: 0,
  },
  pdfIconActive: {
    color: theme.colors.accentIndigo,
  },
  pdfMeta: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  pdfName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.textPrimary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '2px',
  },
  pdfDetails: {
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    background: 'transparent',
    border: 'none',
    color: theme.colors.textMuted,
    padding: '6px',
    borderRadius: theme.borderRadius.sm,
    cursor: 'pointer',
    transition: theme.transitions.default,
    marginLeft: '6px',
    flexShrink: 0,
    '&:hover': {
      color: theme.colors.accentRed,
      background: 'rgba(239, 68, 68, 0.1)',
    }
  },
  emptyList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 10px',
    textAlign: 'center',
    color: theme.colors.textMuted,
  },
  emptyText: {
    fontSize: '0.85rem',
    marginTop: '8px',
  },

  // ---- Framework / Tech Stack footer strip ----
  frameworkFooter: {
    padding: '16px 18px 18px 18px',
    borderTop: `1px solid ${theme.colors.border}`,
    background: 'rgba(10, 6, 20, 0.35)',
  },
  frameworkTitle: {
    fontSize: '0.68rem',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: theme.colors.textMuted,
    fontWeight: 700,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  frameworkGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  frameworkBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 11px',
    borderRadius: theme.borderRadius.round,
    border: `1px solid ${theme.colors.border}`,
    fontSize: '0.7rem',
    fontWeight: 700,
    color: theme.colors.textSecondary,
    cursor: 'default',
    transition: theme.transitions.bounce,
    animation: '$badgeFloat 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
    '&:hover': {
      transform: 'translateY(-3px) scale(1.08)',
      color: '#fff',
    }
  },
  '@keyframes badgeFloat': {
    '0%': { opacity: 0, transform: 'scale(0.6)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
  fwReact: {
    '&:hover': {
      borderColor: '#38bdf8',
      background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
      boxShadow: '0 6px 18px rgba(56, 189, 248, 0.45)',
    }
  },
  fwNode: {
    '&:hover': {
      borderColor: '#10b981',
      background: 'linear-gradient(135deg, #10b981, #2dd4bf)',
      boxShadow: '0 6px 18px rgba(16, 185, 129, 0.45)',
    }
  },
  fwExpress: {
    '&:hover': {
      borderColor: '#f59e0b',
      background: 'linear-gradient(135deg, #f59e0b, #fb7185)',
      boxShadow: '0 6px 18px rgba(245, 158, 11, 0.45)',
    }
  },
  fwGemini: {
    '&:hover': {
      borderColor: '#d946ef',
      background: 'linear-gradient(135deg, #d946ef, #8b5cf6)',
      boxShadow: '0 6px 18px rgba(217, 70, 239, 0.45)',
    }
  },
  fwVite: {
    '&:hover': {
      borderColor: '#a3e635',
      background: 'linear-gradient(135deg, #a3e635, #2dd4bf)',
      boxShadow: '0 6px 18px rgba(163, 230, 53, 0.45)',
    }
  },
}));

const formatBytes = (bytes, decimals = 1) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function Sidebar({ pdfs, selectedId, onSelect, onDelete, status }) {
  const classes = useStyles();

  return (
    <aside className={classes.sidebar}>
      <div className={classes.header}>
        <div className={classes.logoContainer}>
          <span className="halo-wrap">
            <Sparkles className={classes.logoIcon} size={26} />
          </span>
          <h1 className={`${classes.logoText} holo-text`} data-text="AuraPDF">AuraPDF</h1>
        </div>

        {status && (
          <div className={classes.statusSection}>
            <div className={classes.statusItem}>
              <Database size={13} />
              <span>Storage: In-Memory Only</span>
              <div className={`${classes.statusDot} ${classes.statusGreen}`} />
            </div>
            <div className={classes.statusItem}>
              <Sparkles size={13} />
              <span>AI Mode: {status.geminiApi === 'connected' ? 'Gemini 2.5 Flash' : 'Demo Mock Mode'}</span>
              <span className={status.geminiApi === 'connected' ? 'halo-wrap' : ''} style={{ borderRadius: '50%' }}>
                <div className={`${classes.statusDot} ${status.geminiApi === 'connected' ? classes.statusGreen : classes.statusYellow}`} />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={classes.listContainer}>
        <div className={classes.listTitle}>Document History</div>

        {pdfs.length === 0 ? (
          <div className={classes.emptyList}>
            <FileText size={32} />
            <div className={classes.emptyText}>No documents analyzed yet. Upload a PDF to begin.</div>
          </div>
        ) : (
          pdfs.map((pdf, idx) => {
            const isActive = pdf.id === selectedId || pdf._id === selectedId;
            const id = pdf.id || pdf._id;
            return (
              <div 
                key={id}
                className={`${classes.pdfItem} ${isActive ? classes.pdfItemActive : ''}`}
                style={{ animationDelay: `${Math.min(idx, 8) * 0.05}s` }}
                onClick={() => onSelect(id)}
              >
                <div className={classes.pdfInfo}>
                  <FileText className={`${classes.pdfIcon} ${isActive ? classes.pdfIconActive : ''}`} size={18} />
                  <div className={classes.pdfMeta}>
                    <div className={classes.pdfName}>{pdf.filename}</div>
                    <div className={classes.pdfDetails}>
                      {pdf.pageCount} pg • {formatBytes(pdf.fileSize)}
                    </div>
                  </div>
                </div>
                <button 
                  className={classes.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                  title="Delete document"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className={classes.frameworkFooter}>
        <div className={classes.frameworkTitle}>
          <Boxes size={12} />
          <span>Powered By / Framework</span>
        </div>
        <div className={classes.frameworkGrid}>
          <div className={`${classes.frameworkBadge} ${classes.fwReact}`} style={{ animationDelay: '0s' }} title="React frontend">
            <Atom size={12} />
            <span>React</span>
          </div>
          <div className={`${classes.frameworkBadge} ${classes.fwVite}`} style={{ animationDelay: '0.05s' }} title="Vite build tool">
            <Zap size={12} />
            <span>Vite</span>
          </div>
          <div className={`${classes.frameworkBadge} ${classes.fwNode}`} style={{ animationDelay: '0.1s' }} title="Node.js runtime">
            <Server size={12} />
            <span>Node.js</span>
          </div>
          <div className={`${classes.frameworkBadge} ${classes.fwExpress}`} style={{ animationDelay: '0.15s' }} title="Express backend">
            <Wind size={12} />
            <span>Express</span>
          </div>
          <div className={`${classes.frameworkBadge} ${classes.fwGemini}`} style={{ animationDelay: '0.2s' }} title="Gemini AI">
            <Sparkles size={12} />
            <span>Gemini AI</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
