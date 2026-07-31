import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Toast } from './components/layout/Toast';
import { ResearchInput } from './components/research/ResearchInput';
import { SwarmMonitor } from './components/research/SwarmMonitor';
import { ReportViewer } from './components/research/ReportViewer';
import { HistoryList } from './components/research/HistoryList';
import { TemplateGallery } from './components/research/TemplateGallery';
import { DocumentUploader } from './components/knowledge/DocumentUploader';
import { DocumentExplorer } from './components/knowledge/DocumentExplorer';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ExportModal } from './components/ui/ExportModal';
import { DiagramEditorModal } from './components/knowledge/DiagramEditorModal';

import { useToast } from './hooks/useToast';
import { useResearch } from './hooks/useResearch';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Modal States
  const [exportingReport, setExportingReport] = useState(null);
  const [editingDiagram, setEditingDiagram] = useState(null);

  const { toast, showToast } = useToast();
  
  const {
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
    WORKFLOW_STEPS
  } = useResearch(showToast, isDemoMode);

  const {
    documents,
    setDocuments,
    selectedDoc,
    setSelectedDoc,
    isUploading,
    handleUpload,
    removeDocument
  } = useKnowledgeBase(showToast, isDemoMode);

  const pinnedReports = history.filter(h => pinnedIds.includes(h.id));

  const handleNewResearchClick = () => {
    setActiveTab('workspace');
    setActiveReport(null);
  };

  const handleExportWorkspace = () => {
    const backupData = {
      app: 'InsightFlow Multi-Agent System',
      timestamp: new Date().toISOString(),
      history,
      documents,
      pinnedIds
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insightflow_workspace_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Workspace backup JSON exported!');
  };

  const handleImportWorkspace = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.history) setHistory(data.history);
        if (data.documents) setDocuments(data.documents);
        showToast('Workspace state restored from JSON backup!');
      } catch (err) {
        showToast('Invalid backup JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-shell">
      {/* Collapsible Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        pinnedReports={pinnedReports}
        setActiveReport={setActiveReport}
        documentsCount={documents.length}
        reportsCount={history.length}
        onNewResearch={handleNewResearchClick}
      />

      {/* Main Workspace Area */}
      <main className="app-main">
        <Header 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onUploadClick={() => setActiveTab('knowledge')}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
          onExportWorkspace={handleExportWorkspace}
          onImportWorkspace={handleImportWorkspace}
        />

        <div className="app-content">
          {activeTab === 'workspace' && (
            <div>
              <ResearchInput 
                onStartResearch={startResearch}
                isGenerating={isGenerating}
              />

              {!isGenerating && !activeReport && (
                <TemplateGallery 
                  onSelectTemplate={(tmplTitle) => startResearch(tmplTitle)} 
                />
              )}

              <SwarmMonitor 
                steps={WORKFLOW_STEPS}
                currentStepIndex={currentStepIndex}
                isGenerating={isGenerating}
              />

              {activeReport && (
                <ReportViewer 
                  report={activeReport}
                  isPinned={pinnedIds.includes(activeReport.id)}
                  togglePin={togglePin}
                  onDelete={removeReport}
                  showToast={showToast}
                  onExportClick={() => setExportingReport(activeReport)}
                />
              )}

              {!isGenerating && !activeReport && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Recent Intelligence Reports
                  </h3>
                  <HistoryList 
                    history={history}
                    activeReport={activeReport}
                    setActiveReport={setActiveReport}
                    pinnedIds={pinnedIds}
                    togglePin={togglePin}
                    onDelete={removeReport}
                    searchTerm={searchTerm}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              {!selectedDoc && (
                <DocumentUploader 
                  onUpload={handleUpload}
                  isUploading={isUploading}
                />
              )}

              <DocumentExplorer 
                documents={documents}
                selectedDoc={selectedDoc}
                setSelectedDoc={setSelectedDoc}
                onDeleteDocument={removeDocument}
                onOpenDiagramEditor={(code, title) => setEditingDiagram({ code, title })}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <HistoryList 
                history={history}
                activeReport={activeReport}
                setActiveReport={(report) => {
                  setActiveReport(report);
                  setActiveTab('workspace');
                }}
                pinnedIds={pinnedIds}
                togglePin={togglePin}
                onDelete={removeReport}
                searchTerm={searchTerm}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard 
              reports={history}
              documents={documents}
            />
          )}
        </div>
      </main>

      {/* Modals & Dialogs */}
      {exportingReport && (
        <ExportModal 
          report={exportingReport}
          onClose={() => setExportingReport(null)}
          showToast={showToast}
        />
      )}

      {editingDiagram && (
        <DiagramEditorModal 
          initialCode={editingDiagram.code}
          title={editingDiagram.title}
          onClose={() => setEditingDiagram(null)}
          onSave={(newCode) => {
            if (selectedDoc) {
              setSelectedDoc(prev => ({
                ...prev,
                mindmap_code: editingDiagram.title.includes('Mindmap') ? newCode : prev.mindmap_code,
                flowchart_code: editingDiagram.title.includes('Flowchart') ? newCode : prev.flowchart_code,
              }));
            }
            showToast('Diagram code updated!');
          }}
        />
      )}

      {/* Floating Toast Notification */}
      <Toast toast={toast} />
    </div>
  );
}
