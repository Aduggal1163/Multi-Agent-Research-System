import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { NavbarDock } from './components/layout/NavbarDock';
import { Toast } from './components/layout/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { FeaturesPage } from './components/landing/FeaturesPage';
import { SecurityPage } from './components/landing/SecurityPage';
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

const PUBLIC_TABS = ['landing', 'features', 'pricing', 'docs', 'security'];

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('landing');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { isAuthenticated, openLoginModal } = useAuth();

  // Automatically redirect unauthenticated users to landing page if on a protected tab
  useEffect(() => {
    if (!isAuthenticated && !PUBLIC_TABS.includes(activeTab)) {
      setActiveTab('landing');
    }
  }, [isAuthenticated, activeTab]);

  // Modal States
  const [exportingReport, setExportingReport] = useState(null);
  const [editingDiagram, setEditingDiagram] = useState(null);

  const { toast, showToast } = useToast();
  
  const {
    history,
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
    selectedDoc,
    setSelectedDoc,
    isUploading,
    handleUpload,
    removeDocument
  } = useKnowledgeBase(showToast, isDemoMode);

  const handleProtectedAction = (action) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    action();
  };

  const handleStartResearch = (topicQuery) => {
    setActiveTab('workspace');
    startResearch(topicQuery);
  };

  const handleNewResearchClick = () => {
    setActiveTab('workspace');
    setActiveReport(null);
  };

  return (
    <div className="app-shell" style={{ flexDirection: 'column' }}>
      {/* Top Floating Glass Navigation Dock */}
      <NavbarDock 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentsCount={documents.length}
        reportsCount={history.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onUploadClick={() => handleProtectedAction(() => setActiveTab('knowledge'))}
        onNewResearch={() => handleProtectedAction(handleNewResearchClick)}
      />

      {/* Main Page Viewport */}
      <main className="app-main">
        <div className="app-content">
          {activeTab === 'landing' && (
            <LandingPage 
              onLaunchWorkspace={() => handleProtectedAction(() => setActiveTab('workspace'))}
              onLaunchKnowledge={() => handleProtectedAction(() => setActiveTab('knowledge'))}
              onStartSampleTopic={(topic) => handleProtectedAction(() => handleStartResearch(topic))}
              reports={history}
              documents={documents}
            />
          )}

          {activeTab === 'features' && (
            <FeaturesPage 
              onLaunchWorkspace={() => handleProtectedAction(() => setActiveTab('workspace'))} 
            />
          )}

          {activeTab === 'security' && <SecurityPage />}

          {activeTab === 'workspace' && (
            <div>
              <ResearchInput 
                onStartResearch={(query) => handleProtectedAction(() => startResearch(query))}
                isGenerating={isGenerating}
              />

              {!isGenerating && !activeReport && (
                <TemplateGallery 
                  onSelectTemplate={(tmplTitle) => handleProtectedAction(() => startResearch(tmplTitle))} 
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
      <AuthModal showToast={showToast} />

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

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
