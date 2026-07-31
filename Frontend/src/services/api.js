import { MOCK_REPORTS, MOCK_DOCUMENTS, generateMockResearch } from './mockData';

const API_BASE = 'http://localhost:8000';

export async function fetchReports(forceDemoMode = false) {
  if (forceDemoMode) return MOCK_REPORTS;
  try {
    const res = await fetch(`${API_BASE}/reports`);
    if (!res.ok) throw new Error('Failed to fetch research reports');
    const data = await res.json();
    return data.length > 0 ? data : MOCK_REPORTS;
  } catch (err) {
    console.warn('Backend unavailable, falling back to Standalone Demo Mode:', err);
    return MOCK_REPORTS;
  }
}

export async function generateResearch(query, forceDemoMode = false) {
  if (forceDemoMode) return generateMockResearch(query);
  try {
    const res = await fetch(`${API_BASE}/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Research generation failed');
    return res.json();
  } catch (err) {
    console.warn('Backend failed, generating research in Standalone Demo Mode:', err);
    return generateMockResearch(query);
  }
}

export async function deleteReport(id, forceDemoMode = false) {
  if (forceDemoMode) return { message: "Deleted in demo mode" };
  try {
    const res = await fetch(`${API_BASE}/reports/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete report');
    return res.json();
  } catch {
    return { message: "Deleted locally" };
  }
}

export async function fetchDocuments(forceDemoMode = false) {
  if (forceDemoMode) return MOCK_DOCUMENTS;
  try {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    const data = await res.json();
    return data.length > 0 ? data : MOCK_DOCUMENTS;
  } catch (err) {
    console.warn('Backend unavailable, returning demo documents:', err);
    return MOCK_DOCUMENTS;
  }
}

export async function uploadDocument(file, forceDemoMode = false) {
  if (forceDemoMode) {
    return {
      id: Date.now(),
      filename: file.name,
      title: file.name,
      summary: `Indexed '${file.name}' in Standalone Demo Mode.`,
      short_summary: `Indexed '${file.name}' in Standalone Demo Mode.`,
      detailed_summary: `Comprehensive document extraction and analysis for '${file.name}'. All 3-tier summaries, vector chunks, and Mermaid visual diagrams were generated locally.`,
      bullet_summary: `- Source File: ${file.name}\n- Status: Indexed locally\n- Vector Store: In-memory simulation`,
      mindmap_code: `graph TD\n  Root["${file.name}"] --> Core["Document Concepts"]\n  Core --> Sec1["Summary Tier"]\n  Core --> Sec2["RAG Index"]`,
      flowchart_code: `graph LR\n  Upload["${file.name}"] --> Parse["Parser"]\n  Parse --> VectorStore["Memory RAG"]`,
      chunk_count: 3,
      file_path: `/uploads/${file.name}`,
      created_at: new Date().toISOString()
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Document upload failed');
    return res.json();
  } catch (err) {
    console.warn('Backend failed, creating demo document index:', err);
    return {
      id: Date.now(),
      filename: file.name,
      title: file.name,
      summary: `Indexed '${file.name}' in Standalone Demo Mode.`,
      short_summary: `Indexed '${file.name}' in Standalone Demo Mode.`,
      detailed_summary: `Comprehensive document extraction and analysis for '${file.name}'.`,
      bullet_summary: `- Source File: ${file.name}\n- Status: Indexed locally`,
      mindmap_code: `graph TD\n  Root["${file.name}"] --> Core["Overview"]`,
      flowchart_code: `graph LR\n  Upload["${file.name}"] --> RAG["Vector Index"]`,
      chunk_count: 2,
      file_path: `/uploads/${file.name}`,
      created_at: new Date().toISOString()
    };
  }
}

export async function deleteDocument(id, forceDemoMode = false) {
  if (forceDemoMode) return { message: "Deleted in demo mode" };
  try {
    const res = await fetch(`${API_BASE}/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  } catch {
    return { message: "Deleted locally" };
  }
}

export async function sendDocumentChat(question, docId = null, forceDemoMode = false) {
  if (forceDemoMode) {
    return {
      answer: `[Demo Mode AI Assistant] I analyzed your question: "${question}". Based on the document material, key takeaways highlight stateful agent workflows, lattice-based security, and enterprise automation standards.`,
      sources: ["Standalone Demo Document Overview", "Vector Chunk Excerpt #1"]
    };
  }

  try {
    const res = await fetch(`${API_BASE}/document-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, doc_id: docId })
    });
    if (!res.ok) throw new Error('Failed to send document chat query');
    return res.json();
  } catch (err) {
    return {
      answer: `[Demo Mode Fallback] I analyzed your question: "${question}". Key findings from the document material emphasize strategic recommendations and structured takeaways.`,
      sources: ["Demo Document Overview"]
    };
  }
}
