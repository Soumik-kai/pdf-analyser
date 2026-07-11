import React, { useState, useEffect } from 'react';
import { createUseStyles, ThemeProvider } from 'react-jss';
import theme from './styles/theme';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const useStyles = createUseStyles((theme) => ({
  appContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    background: 'transparent',
    overflow: 'hidden',
    fontFamily: theme.fontFamily.sans,
  },
  mainContent: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '16px 24px',
    borderBottom: `1px solid ${theme.colors.border}`,
    background: 'rgba(15, 23, 42, 0.2)',
  },
  headerText: {
    fontSize: '0.75rem',
    color: theme.colors.textMuted,
    fontWeight: 500,
  }
}));

function AppContent() {
  const classes = useStyles();
  
  const [pdfs, setPdfs] = useState([]);
  const [status, setStatus] = useState(null);
  
  const [selectedId, setSelectedId] = useState(null);
  const [activePdfDetail, setActivePdfDetail] = useState(null);
  const [chats, setChats] = useState([]);
  
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // Fetch status and list of PDFs on mount
  useEffect(() => {
    fetchStatus();
    fetchPdfs();
  }, []);

  // Fetch full details whenever the selected PDF changes
  useEffect(() => {
    if (selectedId) {
      fetchPdfDetail(selectedId);
    } else {
      setActivePdfDetail(null);
      setChats([]);
    }
  }, [selectedId]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Error fetching backend status:', err);
    }
  };

  const fetchPdfs = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/pdfs');
      if (res.ok) {
        const data = await res.json();
        setPdfs(data);
      }
    } catch (err) {
      console.error('Error fetching PDFs:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchPdfDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/pdfs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActivePdfDetail(data.pdf);
        setChats(data.chats || []);
      }
    } catch (err) {
      console.error('Error fetching PDF details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUploadSuccess = (newPdf) => {
    setPdfs((prev) => [newPdf, ...prev]);
    setSelectedId(newPdf.id || newPdf._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this PDF and its chat history?')) {
      try {
        const res = await fetch(`/api/pdfs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setPdfs((prev) => prev.filter((p) => (p.id || p._id) !== id));
          if (selectedId === id) {
            setSelectedId(null);
          }
        }
      } catch (err) {
        console.error('Error deleting PDF:', err);
      }
    }
  };

  const handleSendMessage = async (message) => {
    if (!selectedId || !message.trim() || loadingChat) return;

    // Add user message locally first
    const userChat = {
      _id: 'temp-' + Date.now(),
      role: 'user',
      message: message,
      timestamp: new Date()
    };
    
    setChats((prev) => [...prev, userChat]);
    setLoadingChat(true);

    try {
      const res = await fetch(`/api/pdfs/${selectedId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer from AI.');
      }

      setChats((prev) => [...prev, data.chat]);
    } catch (err) {
      console.error('Error sending message:', err);
      // Append an error message block from AI
      setChats((prev) => [
        ...prev,
        {
          _id: 'err-' + Date.now(),
          role: 'model',
          message: `Error: ${err.message || 'Failed to connect to assistant.'}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className={classes.appContainer}>
      <Sidebar 
        pdfs={pdfs}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onDelete={handleDelete}
        status={status}
      />
      <main className={classes.mainContent}>
        <header className={classes.header}>
          <div className={classes.headerText}>
            AuraPDF AI Console v1.0.0
          </div>
        </header>
        
        <Dashboard 
          activePdf={activePdfDetail}
          chats={chats}
          onSendMessage={handleSendMessage}
          onUploadSuccess={handleUploadSuccess}
          loadingChat={loadingChat}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContent />
    </ThemeProvider>
  );
}
