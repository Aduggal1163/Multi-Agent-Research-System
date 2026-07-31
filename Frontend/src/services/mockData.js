// Mock & Demo Data Provider for Standalone Offline Operation

export const MOCK_REPORTS = [
  {
    id: 101,
    query: "Commercial Fusion Energy & Post-Quantum Cryptography",
    score: 0.92,
    iterations: 2,
    created_at: new Date().toISOString(),
    synthesis: "Synthesized findings from 4 parallel agents (Market Analyst, Competitor Analyst, Innovation Analyst, Quality Checker). Fusion energy venture capital has surged to $6.2B in 2026 led by Commonwealth Fusion and Helion Energy. Post-Quantum Cryptography (PQC) standards (NIST FIPS 203/204) are accelerating enterprise adoption across defense and financial sectors.",
    report: `# Commercial Fusion Energy & Post-Quantum Cryptography

## Executive Summary
This report analyzes the intersection of commercial fusion energy deployment and post-quantum cryptographic security. As magnetic confinement and field-reversed configuration fusion reactors approach net electricity generation, the critical telemetry and grid control infrastructures must transition to lattice-based post-quantum cryptography (PQC) to resist quantum decryption threats.

## Key Findings
- **Fusion Commercialization Timeline**: Commonwealth Fusion Systems (SPARC) and Helion Energy (Polaris) target pilot grid delivery by 2028-2030.
- **PQC Standardization**: NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) have become mandatory security mandates for energy control grids.
- **Market Investment**: Global venture capital commitment to fusion tech reached **$6.2 Billion**, up 34% year-over-year.

## Strategic Recommendations
1. **PQC Infrastructure Audit**: Energy operators must audit existing SCADA and telemetry protocols for post-quantum readiness.
2. **Hybrid Cryptography Deployment**: Implement dual-signature algorithms combining classical RSA/ECC with lattice-based ML-DSA algorithms.
3. **Public-Private Partnerships**: Collaborate with federal regulatory bodies to standardize quantum-safe smart grid communications.
`
  },
  {
    id: 102,
    query: "LangGraph Multi-Agent Orchestration Frameworks",
    score: 0.88,
    iterations: 1,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    synthesis: "Stateful agentic AI workflows powered by LangGraph, AutoGen, and CrewAI account for 42% of enterprise AI engineering job requirements. LangGraph's cyclic graph compilation and human-in-the-loop state persistence offer superior control for complex multi-agent reasoning.",
    report: `# LangGraph Multi-Agent Orchestration Frameworks

## Executive Summary
Agentic AI architectures have shifted from simple linear chains to cyclic, stateful graph workflows. LangGraph leads enterprise adoption by providing explicit state management, fine-grained control over parallel agent fan-out/fan-in joins, and deterministic human-in-the-loop review routing.

## Key Findings
- **Cyclic Reasoning Graphs**: Cyclic graph execution allows reviewer agents to route low-scoring reports back to generator agents iteratively.
- **Stateful Memory**: LangGraph's checkpointer mechanism enables time-travel debugging and persistent state persistence across agent interactions.
- **Enterprise Market Share**: LangGraph and AutoGen comprise nearly 40% of production multi-agent installations.

## Recommendations
1. **Standardize Graph Schemas**: Define strict Pydantic schemas for agent state passing.
2. **Implement Quality Gate Routers**: Add automated reviewer nodes that score outputs against predefined target confidence scores before exiting.
`
  }
];

export const MOCK_DOCUMENTS = [
  {
    id: 201,
    filename: "AI_Research_Paper_2026.pdf",
    title: "Autonomous Agent Swarms: Architectural Standards & Security",
    summary: "This research paper explores architectural standards for deploying autonomous parallel agent swarms in high-concurrency enterprise environments.",
    short_summary: "Comprehensive guide on scaling parallel multi-agent swarms using LangGraph, Redis state persistence, and lattice-based security.",
    detailed_summary: "The paper presents a modular 4-layer architecture for multi-agent systems: Orchestration Layer, Tool Execution Engine, Shared Memory Store, and Quality Audit Gate.",
    bullet_summary: "- Proposes a 4-layer modular agent architecture.\n- Demonstrates 64% latency reduction via parallel fan-out execution.\n- Outlines zero-trust security controls.",
    mindmap_code: `graph TD\n  Root["Autonomous Agent Swarms"] --> L1["Orchestration Layer"]\n  Root --> L2["Tool Engine"]`,
    flowchart_code: `graph LR\n  Input["User Prompt"] --> Split["Splitter Agent"]\n  Split --> R1["Market Analyst"]`,
    chunk_count: 5,
    file_path: "/uploads/AI_Research_Paper_2026.pdf",
    created_at: new Date().toISOString()
  },
  {
    id: 202,
    filename: "Enterprise_Market_Strategy.docx",
    title: "Enterprise Market Strategy & Competitor Matrix 2026",
    summary: "Word document containing detailed enterprise positioning, pricing tier breakdowns, and competitor analysis.",
    short_summary: "Strategic roadmap detailing Enterprise Tier adoption, SaaS pricing models, and market penetration vectors.",
    detailed_summary: "Analyzes top market competitors across pricing, platform reliability, API rate limits, and compliance certifications (SOC2, ISO 27001).",
    bullet_summary: "- Benchmark pricing tiers across top 5 SaaS competitors.\n- Outlines SOC2 Type II compliance roadmap.\n- Recommends enterprise SLA guarantees.",
    mindmap_code: `graph TD\n  Root["Market Strategy"] --> Sec1["Competitor Matrix"]\n  Root --> Sec2["Compliance"]`,
    flowchart_code: `graph LR\n  Lead["Prospect"] --> Demo["Platform Demo"]\n  Demo --> Onboard["Enterprise Onboarding"]`,
    chunk_count: 3,
    file_path: "/uploads/Enterprise_Market_Strategy.docx",
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 203,
    filename: "Quantum_Encryption_Logs.txt",
    title: "Post-Quantum Cryptography Telemetry & Log Audit",
    summary: "Raw text log file recording telemetry metrics from lattice-based ML-KEM encryption benchmarks.",
    short_summary: "Lattice-based encryption performance logs comparing RSA-4096 against FIPS 203 ML-KEM key exchange.",
    detailed_summary: "Measures handshake latency and memory overhead across 10,000 simulated SCADA telemetry connections.",
    bullet_summary: "- ML-KEM key exchange executed in 0.42ms average latency.\n- Zero cryptographic failures recorded across 10,000 log sessions.",
    mindmap_code: `graph TD\n  Root["Quantum Telemetry"] --> Benchmark["Key Exchange Latency"]`,
    flowchart_code: `graph LR\n  Log["Log Stream"] --> Parser["Telemetry Parser"]\n  Parser --> Alert["Anomaly Alert"]`,
    chunk_count: 2,
    file_path: "/uploads/Quantum_Encryption_Logs.txt",
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 204,
    filename: "System_Architecture_Guide.md",
    title: "InsightFlow Microservices System Architecture",
    summary: "Markdown technical specification document detailing microservices API interfaces and database schemas.",
    short_summary: "System design architecture specification detailing FastAPI REST endpoints and SQLite database schemas.",
    detailed_summary: "Covers database table definitions, SQLAlchemy ORM mappings, lifespan migrations, and CORS middleware headers.",
    bullet_summary: "- Full SQLite schema mappings for reports and uploaded documents.\n- CORS security policy configuration for Vite client.",
    mindmap_code: `graph TD\n  Root["InsightFlow Specs"] --> API["FastAPI Endpoints"]\n  Root --> DB["SQLite Database"]`,
    flowchart_code: `graph LR\n  Client["React Vite"] --> API["FastAPI"]\n  API --> DB["SQLite"]`,
    chunk_count: 4,
    file_path: "/uploads/System_Architecture_Guide.md",
    created_at: new Date(Date.now() - 10800000).toISOString()
  }
];

export function generateMockResearch(query) {
  return {
    id: Date.now(),
    query,
    score: 0.91,
    iterations: 1,
    created_at: new Date().toISOString(),
    synthesis: `Comprehensive analysis generated in Standalone Demo Mode for query: '${query}'. Parallel research agents fetched market metrics, competitive positioning, and technological innovation vectors.`,
    report: `# Intelligence Report: ${query}

## Executive Summary
This report was generated in **InsightFlow Autonomous Standalone Mode** for the query: **"${query}"**. 
The parallel agent swarm analyzed current industry benchmarks, competitive dynamics, and technological breakthroughs.

## Key Findings
- **Market Growth**: Accelerated adoption with a projected 28.5% CAGR over the next 5 years.
- **Competitive Landscape**: Market leadership is consolidating around platforms offering stateful automation and end-to-end security.
- **Innovation Vectors**: Integration of generative AI, real-time analytics, and automated compliance auditing.

## Actionable Recommendations
1. **Invest in Core Infrastructure**: Upgrade legacy data pipelines to support real-time streaming analytics.
2. **Implement Automated Audit Gates**: Adopt quality assurance feedback loops to maintain enterprise governance standards.
3. **Expand Technical Training**: Upskill engineering teams on modern cloud-native and multi-agent development.
`
  };
}
