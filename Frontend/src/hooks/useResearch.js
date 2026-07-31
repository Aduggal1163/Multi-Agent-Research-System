import { useState, useEffect, useCallback } from 'react';
import { fetchReports, generateResearch, deleteReport } from '../services/api';

const WORKFLOW_STEPS = [
  { label: "Deconstructing topic & extracting Document/Web research vectors", agent: "LangGraph Supervisor" },
  { label: "Executing parallel sweeps: Market, Competitor, Tech & Document QA", agent: "4-Agent Swarm" },
  { label: "Synthesizing cross-vector findings & analyst metrics", agent: "Synthesis Agent" },
  { label: "Drafting structured executive intelligence report", agent: "Report Writer Agent" },
  { label: "Executing QA review audit & refining data consistency", agent: "Quality Reviewer Agent" }
];

export function useResearch(showToast, isDemoMode = false) {
  const [history, setHistory] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('pinned_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchReports(isDemoMode);
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  }, [isDemoMode]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    localStorage.setItem('pinned_reports', JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  const togglePin = (id, e) => {
    if (e) e.stopPropagation();
    setPinnedIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    if (showToast) showToast(pinnedIds.includes(id) ? 'Report unpinned' : 'Report pinned to top');
  };

  const startResearch = async (query) => {
    if (!query.trim() || isGenerating) return;
    setIsGenerating(true);
    setCurrentStepIndex(0);
    setActiveReport(null);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < WORKFLOW_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const newReport = await generateResearch(query, isDemoMode);
      clearInterval(stepInterval);
      setHistory(prev => [newReport, ...prev]);
      setActiveReport(newReport);
      if (showToast) showToast('Deep Research complete!');
    } catch (err) {
      clearInterval(stepInterval);
      if (showToast) showToast(err.message || 'Research execution failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const removeReport = async (id) => {
    try {
      await deleteReport(id, isDemoMode);
      setHistory(prev => prev.filter(r => r.id !== id));
      setPinnedIds(prev => prev.filter(pId => pId !== id));
      if (activeReport?.id === id) setActiveReport(null);
      if (showToast) showToast('Research report deleted');
    } catch (err) {
      if (showToast) showToast(err.message || 'Delete failed', 'error');
    }
  };

  return {
    history,
    setHistory,
    activeReport,
    setActiveReport,
    isGenerating,
    currentStepIndex,
    pinnedIds,
    togglePin,
    startResearch,
    removeReport,
    WORKFLOW_STEPS,
  };
}
