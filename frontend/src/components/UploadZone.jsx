import React, { useState, useRef } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Upload, FileText, AlertCircle, RefreshCw } from 'lucide-react';

const useStyles = createUseStyles((theme) => ({
  uploadContainer: {
    border: `2px dashed ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: '40px 20px',
    textAlign: 'center',
    background: theme.colors.bgCard,
    backdropFilter: theme.glass.backdropFilter,
    boxShadow: theme.glass.boxShadow,
    transition: theme.transitions.default,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '220px',
    animation: '$zonePopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
    '&:hover': {
      borderColor: theme.colors.accentCyan,
      background: theme.colors.bgCardHover,
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 30px rgba(245, 158, 11, 0.15), ${theme.glass.boxShadow}`,
    },
  },
  '@keyframes zonePopIn': {
    '0%': { opacity: 0, transform: 'scale(0.9) translateY(14px)' },
    '60%': { opacity: 1, transform: 'scale(1.02) translateY(0)' },
    '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
  },
  active: {
    borderColor: theme.colors.accentIndigo,
    background: 'rgba(139, 92, 246, 0.1)',
    boxShadow: `0 0 25px rgba(139, 92, 246, 0.25), ${theme.glass.boxShadow}`,
    animation: '$dragPulse 0.6s ease-in-out infinite',
  },
  '@keyframes dragPulse': {
    '0%, 100%': { transform: 'scale(1.02)' },
    '50%': { transform: 'scale(1.05)' },
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  iconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: theme.borderRadius.round,
    background: 'rgba(245, 158, 11, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    color: theme.colors.accentCyan,
    transition: theme.transitions.default,
    '$uploadContainer:hover &': {
      background: 'rgba(245, 158, 11, 0.2)',
      transform: 'scale(1.1) rotate(5deg)',
    }
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 600,
    fontFamily: theme.fontFamily.display,
    color: theme.colors.textPrimary,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    marginBottom: '16px',
  },
  fileInput: {
    display: 'none',
  },
  button: {
    background: `linear-gradient(135deg, ${theme.colors.accentCyan} 0%, ${theme.colors.accentIndigo} 100%)`,
    color: theme.colors.textWhite,
    border: 'none',
    borderRadius: theme.borderRadius.sm,
    padding: '8px 20px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: theme.transitions.default,
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 16px rgba(245, 158, 11, 0.5)',
    }
  },
  loadingSpinner: {
    animation: '$spin 1.5s linear infinite',
    color: theme.colors.accentCyan,
    marginBottom: '12px',
  },
  errorText: {
    color: theme.colors.accentRed,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    marginTop: '12px',
    background: 'rgba(239, 68, 68, 0.1)',
    padding: '6px 12px',
    borderRadius: theme.borderRadius.xs,
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
}));

export default function UploadZone({ onUploadSuccess, disabled }) {
  const classes = useStyles();
  const theme = useTheme();
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Please select a valid PDF document.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/pdfs/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload PDF.');
      }

      if (onUploadSuccess) {
        onUploadSuccess(data.pdf);
      }
    } catch (err) {
      setError(err.message || 'Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!loading && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`${classes.uploadContainer} ${isDragActive ? classes.active : ''} ${disabled || loading ? classes.disabled : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        className={classes.fileInput} 
        accept=".pdf,application/pdf"
        onChange={handleChange}
        disabled={loading || disabled}
      />
      
      {loading ? (
        <>
          <RefreshCw className={classes.loadingSpinner} size={40} />
          <div className={classes.title}>Analyzing Document...</div>
          <div className={classes.subtitle}>Extracting text and generating Gen AI summary</div>
        </>
      ) : (
        <>
          <div className={classes.iconWrapper}>
            <Upload size={28} />
          </div>
          <div className={classes.title}>Upload your PDF</div>
          <div className={classes.subtitle}>Drag and drop your file here, or click to browse</div>
          <button className={`${classes.button} sheen`} type="button" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
            Select PDF
          </button>
        </>
      )}

      {error && (
        <div className={classes.errorText} onClick={(e) => e.stopPropagation()}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
