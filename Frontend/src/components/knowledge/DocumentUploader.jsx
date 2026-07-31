import React, { useRef, useState } from 'react';
import { Upload, FileUp, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

export function DocumentUploader({ onUpload, isUploading }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div 
      className={`glass-panel ${isDragging ? 'glass-panel-glow' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{ 
        padding: '2.5rem', 
        textAlign: 'center', 
        borderStyle: 'dashed', 
        borderWidth: '2px',
        borderColor: isDragging ? '#a855f7' : 'var(--border-glass-glow)',
        marginBottom: '2rem',
        cursor: 'pointer'
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt,.docx,.md"
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        {isUploading ? (
          <Loader2 size={40} className="animate-spin" style={{ color: '#c084fc' }} />
        ) : (
          <FileUp size={40} style={{ color: '#38bdf8' }} />
        )}

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
          {isUploading ? 'Indexing Document & Vector Chunks...' : 'Drag & Drop Document to Index'}
        </h3>

        <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', maxWidth: '500px' }}>
          Supports PDF, DOCX, TXT, and Markdown files. Automatically extracts 3-tier summaries, generates Mermaid mindmaps/flowcharts, and builds an in-memory RAG index.
        </p>

        {!isUploading && (
          <Button variant="secondary" icon={Upload} style={{ marginTop: '0.5rem' }}>
            Select Local File
          </Button>
        )}
      </div>
    </div>
  );
}
