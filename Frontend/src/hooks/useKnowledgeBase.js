import { useState, useEffect, useCallback } from 'react';
import { fetchDocuments, uploadDocument, deleteDocument } from '../services/api';

export function useKnowledgeBase(showToast, isDemoMode = false) {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      const data = await fetchDocuments(isDemoMode);
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  }, [isDemoMode]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const savedDoc = await uploadDocument(file, isDemoMode);
      setDocuments(prev => [savedDoc, ...prev.filter(d => d.id !== savedDoc.id)]);
      setSelectedDoc(savedDoc);
      if (showToast) showToast(`Document '${file.name}' indexed successfully!`);
    } catch (err) {
      if (showToast) showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = async (id) => {
    try {
      await deleteDocument(id, isDemoMode);
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (selectedDoc?.id === id) setSelectedDoc(null);
      if (showToast) showToast('Document deleted');
    } catch (err) {
      if (showToast) showToast(err.message || 'Delete failed', 'error');
    }
  };

  return {
    documents,
    setDocuments,
    selectedDoc,
    setSelectedDoc,
    isUploading,
    handleUpload,
    removeDocument,
  };
}
