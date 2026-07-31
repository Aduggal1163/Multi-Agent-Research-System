import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { sendDocumentChat } from '../../services/api';

export function DocumentChat({ selectedDoc }) {
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'ai', 
      text: selectedDoc 
        ? `Welcome to Document AI Chat! Ask any question regarding "${selectedDoc.title}".` 
        : `Welcome to Document AI Chat! Ask any question regarding your indexed documents.`
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatViewportRef = useRef(null);

  useEffect(() => {
    if (chatViewportRef.current) {
      chatViewportRef.current.scrollTo({
        top: chatViewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isChatLoading]);

  useEffect(() => {
    if (selectedDoc) {
      setChatMessages([
        { sender: 'ai', text: `Welcome to Document AI Chat! Ask any question regarding "${selectedDoc.title}".` }
      ]);
    }
  }, [selectedDoc?.id]);

  const handleSendChat = async () => {
    if (!chatQuestion.trim() || isChatLoading) return;
    const q = chatQuestion;
    setChatQuestion('');
    setChatMessages(prev => [...prev, { sender: 'user', text: q }]);
    setIsChatLoading(true);

    try {
      const data = await sendDocumentChat(q, selectedDoc ? selectedDoc.id : null);
      setChatMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: data.answer || "Document analysis complete.", 
          sources: data.sources || [] 
        }
      ]);
    } catch (err) {
      setChatMessages(prev => [
        ...prev, 
        { sender: 'ai', text: `Error querying document: ${err.message}` }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages-viewport" ref={chatViewportRef}>
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', fontSize: '0.78rem', opacity: 0.8 }}>
              {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
              <span>{msg.sender === 'user' ? 'You' : 'Document Assistant'}</span>
            </div>

            <div>{msg.text}</div>

            {msg.sources && msg.sources.length > 0 && (
              <div className="chat-sources-box">
                <strong>Sources from {selectedDoc ? selectedDoc.title : 'Document'}:</strong>
                {msg.sources.map((s, i) => (
                  <div key={i} style={{ fontStyle: 'italic', marginTop: '0.25rem' }}>• {s}</div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isChatLoading && (
          <div className="chat-bubble chat-bubble-ai">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Searching document RAG index...
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-bar">
        <input 
          type="text" 
          placeholder={selectedDoc ? `Ask AI a question about "${selectedDoc.title}"...` : "Ask AI a question about indexed documents..."}
          value={chatQuestion}
          onChange={(e) => setChatQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
        />
        <button 
          className="btn-primary" 
          onClick={handleSendChat} 
          disabled={!chatQuestion.trim() || isChatLoading}
          style={{ padding: '0.5rem 0.85rem', borderRadius: '10px' }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
