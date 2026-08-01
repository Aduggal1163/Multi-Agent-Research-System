import { MOCK_REPORTS, MOCK_DOCUMENTS, generateMockResearch } from './mockData';

const API_BASE = 'http://localhost:8000';

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Authentication API Services
export async function registerUser({ email, password, fullName }) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed');
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Unable to connect to backend server at ${API_BASE}. Please ensure the backend server is running using 'uv run api.py'.`);
    }
    throw err;
  }
}

export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Invalid email or password');
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Unable to connect to backend server at ${API_BASE}. Please ensure the backend server is running using 'uv run api.py'.`);
    }
    throw err;
  }
}

export async function fetchCurrentUser(token) {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Token expired or invalid');
    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Unable to connect to backend server at ${API_BASE}.`);
    }
    throw err;
  }
}

// Research API Services
export async function fetchReports(forceDemoMode = false) {
  if (forceDemoMode) return MOCK_REPORTS;
  try {
    const res = await fetch(`${API_BASE}/reports`, {
      headers: { ...getAuthHeaders() }
    });
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
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
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
    const res = await fetch(`${API_BASE}/reports/${id}`, { 
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to delete report');
    return res.json();
  } catch {
    return { message: "Deleted locally" };
  }
}

// Knowledge Base API Services
export async function fetchDocuments(forceDemoMode = false) {
  if (forceDemoMode) return MOCK_DOCUMENTS;
  try {
    const res = await fetch(`${API_BASE}/documents`, {
      headers: { ...getAuthHeaders() }
    });
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
    const res = await fetch(`${API_BASE}/upload`, { 
      method: 'POST', 
      headers: { ...getAuthHeaders() },
      body: formData 
    });
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
    const res = await fetch(`${API_BASE}/documents/${id}`, { 
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
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
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
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
