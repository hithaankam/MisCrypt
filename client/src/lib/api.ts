// API client for MisCrypt backend

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export interface StaticScanRequest {
  code?: string;
  repo_url?: string;
  language?: string;
}

export interface StaticScanResponse {
  module: string;
  status: string;
  language: string;
  findings: Array<{
    line: number;
    code: string;
    issue: string;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  total_issues: number;
}

export interface TLSScanRequest {
  domain: string;
  port?: number;
}

export interface TLSScanResponse {
  module: string;
  status: string;
  domain: string;
  port: number;
  tls_issues: Array<{
    issue: string;
    severity: string;
    details: string;
    description: string;
    recommendation: string;
  }>;
  total_issues: number;
}

export interface RuntimeScanRequest {
  log_source: string;
}

export interface RuntimeScanResponse {
  module: string;
  status: string;
  log_source: string;
  alert_count: number;
  alerts: Array<{
    threat_type: string;
    detected: boolean;
    evidence_count: number;
    samples: string[];
  }>;
}

export const api = {
  async staticScan(request: StaticScanRequest): Promise<StaticScanResponse> {
    const response = await fetch(`${BACKEND_URL}/api/static/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Static scan failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  async tlsScan(request: TLSScanRequest): Promise<TLSScanResponse> {
    const response = await fetch(`${BACKEND_URL}/api/tls/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`TLS scan failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  async runtimeScan(request: RuntimeScanRequest): Promise<RuntimeScanResponse> {
    const response = await fetch(`${BACKEND_URL}/api/runtime/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Runtime scan failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  async healthCheck(): Promise<{ status: string; modules: string[] }> {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error('Backend health check failed');
    }
    
    return response.json();
  },
};
