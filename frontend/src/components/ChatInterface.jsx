import React, { useState, useRef, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Send, Sparkles, MessageSquare, RefreshCw } from 'lucide-react';

const useStyles = createUseStyles((theme) => ({
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'rgba(20, 12, 32, 0.3)',
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    backdropFilter: theme.glass.backdropFilter,
    overflow: 'hidden',
  },
  header: {
    padding: '16px 20px',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: theme.fontFamily.display,
    color: theme.colors.textPrimary,
  },
  headerIcon: {
    color: theme.colors.accentIndigo,
  },
  messagesList: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messageRow: {
    display: 'flex',
    width: '100%',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  modelRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: theme.borderRadius.md,
    fontSize: '0.9rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    animation: '$bubblePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
  },
  '@keyframes bubblePop': {
    '0%': { opacity: 0, transform: 'scale(0.8) translateY(8px)' },
    '60%': { opacity: 1, transform: 'scale(1.03) translateY(0)' },
    '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
  },
  userBubble: {
    background: `linear-gradient(135deg, ${theme.colors.accentIndigo} 0%, ${theme.colors.accentPurple} 60%, ${theme.colors.accentCyan} 100%)`,
    color: theme.colors.textWhite,
    borderTopRightRadius: '2px',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.15)',
  },
  modelBubble: {
    background: 'rgba(42, 24, 61, 0.55)',
    color: theme.colors.textPrimary,
    borderTopLeftRadius: '2px',
    border: `1px solid ${theme.colors.border}`,
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  emptyIcon: {
    color: theme.colors.accentIndigo,
    marginBottom: '16px',
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.textPrimary,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '0.85rem',
    maxWidth: '280px',
    lineHeight: 1.4,
  },
  suggestionsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '0 20px 12px 20px',
  },
  suggestionChip: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    padding: '6px 12px',
    borderRadius: theme.borderRadius.round,
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: theme.transitions.default,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      borderColor: theme.colors.accentCyan,
      color: theme.colors.textPrimary,
      transform: 'translateY(-1px)',
    }
  },
  inputArea: {
    padding: '16px',
    borderTop: `1px solid ${theme.colors.border}`,
    background: 'rgba(20, 12, 32, 0.4)',
  },
  inputForm: {
    display: 'flex',
    gap: '8px',
    position: 'relative',
  },
  textInput: {
    flex: 1,
    background: theme.colors.bgInput,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.sm,
    padding: '12px 16px',
    paddingRight: '50px',
    fontSize: '0.875rem',
    color: theme.colors.textPrimary,
    outline: 'none',
    transition: theme.transitions.default,
    '&:focus': {
      borderColor: theme.colors.accentIndigo,
      boxShadow: `0 0 10px rgba(139, 92, 246, 0.2)`,
    },
    '&::placeholder': {
      color: theme.colors.textMuted,
    }
  },
  sendButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: theme.colors.accentCyan,
    padding: '8px',
    borderRadius: theme.borderRadius.sm,
    cursor: 'pointer',
    transition: theme.transitions.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      color: theme.colors.accentIndigo,
      transform: 'translateY(-50%) scale(1.05)',
    },
    '&:disabled': {
      color: theme.colors.textMuted,
      cursor: 'not-allowed',
    }
  },
  typingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: theme.borderRadius.md,
    background: 'rgba(42, 24, 61, 0.3)',
    border: `1px solid ${theme.colors.border}`,
    fontSize: '0.85rem',
    color: theme.colors.textSecondary,
    alignSelf: 'flex-start',
  },
  typingSpinner: {
    animation: '$spin 1.5s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
}));

const SUGGESTIONS = [
  'Summarize the core argument',
  'What are the main takeaways?',
  'List all methodologies or processes mentioned',
  'Generate 3 study review questions'
];

export default function ChatInterface({ chats, onSendMessage, loading }) {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    if (loading) return;
    onSendMessage(suggestion);
  };

  return (
    <div className={classes.chatContainer}>
      <div className={classes.header}>
        <MessageSquare className={classes.headerIcon} size={18} />
        <div className={classes.headerTitle}>AI Assistant Q&A</div>
      </div>

      {chats.length === 0 ? (
        <div className={classes.emptyState}>
          <span className="halo-wrap">
            <Sparkles className={classes.emptyIcon} size={36} />
          </span>
          <div className={classes.emptyTitle}>Ask Anything</div>
          <div className={classes.emptyText}>
            Ask questions, request summaries, or clarify concepts from this document.
          </div>
        </div>
      ) : (
        <div className={classes.messagesList}>
          {chats.map((chat, idx) => {
            const isUser = chat.role === 'user';
            return (
              <div 
                key={chat.id || chat._id || idx} 
                className={`${classes.messageRow} ${isUser ? classes.userRow : classes.modelRow}`}
              >
                <div className={`${classes.bubble} ${isUser ? classes.userBubble : classes.modelBubble}`}>
                  {chat.message}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className={classes.typingRow}>
              <RefreshCw className={classes.typingSpinner} size={14} />
              <span>Analyzing context and thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {chats.length === 0 && (
        <div className={classes.suggestionsList}>
          {SUGGESTIONS.map((s, idx) => (
            <button 
              key={idx} 
              className={`${classes.suggestionChip} badge-pop`}
              style={{ animationDelay: `${idx * 0.08}s` }}
              onClick={() => handleSuggestionClick(s)}
              disabled={loading}
            >
              <Sparkles size={11} />
              <span>{s}</span>
            </button>
          ))}
        </div>
      )}

      <div className={classes.inputArea}>
        <form onSubmit={handleSubmit} className={classes.inputForm}>
          <input 
            type="text" 
            className={classes.textInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the document..."
            disabled={loading}
          />
          <button 
            type="submit" 
            className={classes.sendButton}
            disabled={loading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
