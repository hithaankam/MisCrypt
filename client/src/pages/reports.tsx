import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, Search, AlertTriangle, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  date: string;
  target: string;
  type: string;
  status: string;
  data: any;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load reports from localStorage
    loadReports();
  }, []);

  const loadReports = () => {
    const storedReports = localStorage.getItem('scanReports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  };

  const downloadReport = (report: Report, format: 'json' | 'html' | 'txt') => {
    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      if (format === 'json') {
        content = JSON.stringify(report.data, null, 2);
        filename = `${report.id}_report.json`;
        mimeType = 'application/json';
      } else if (format === 'html') {
        content = generateHTMLReport(report);
        filename = `${report.id}_report.html`;
        mimeType = 'text/html';
      } else if (format === 'txt') {
        content = generateTextReport(report);
        filename = `${report.id}_report.txt`;
        mimeType = 'text/plain';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Downloaded",
        description: `${filename} has been downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download report",
        variant: "destructive",
      });
    }
  };

  const generateHTMLReport = (report: Report) => {
    const { data } = report;
    const findings = data.findings || data.tls_issues || data.alerts || [];
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MisCrypt Security Report - ${report.id}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .meta {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .meta-item {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .meta-label {
            font-size: 0.85em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .meta-value {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
            margin-top: 5px;
        }
        .summary {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .findings {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .finding {
            border-left: 4px solid #ddd;
            padding: 15px;
            margin-bottom: 15px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .finding.critical {
            border-left-color: #dc3545;
            background: #fff5f5;
        }
        .finding.high {
            border-left-color: #fd7e14;
            background: #fff8f0;
        }
        .finding.medium {
            border-left-color: #ffc107;
            background: #fffbf0;
        }
        .finding.low {
            border-left-color: #0dcaf0;
            background: #f0f9ff;
        }
        .severity-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .severity-critical {
            background: #dc3545;
            color: white;
        }
        .severity-high {
            background: #fd7e14;
            color: white;
        }
        .severity-medium {
            background: #ffc107;
            color: #333;
        }
        .severity-low {
            background: #0dcaf0;
            color: white;
        }
        .code-block {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
        }
        h2 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔐 MisCrypt Security Report</h1>
        <p>Cryptographic Misconfiguration & Runtime Exploitability Analysis</p>
    </div>

    <div class="meta">
        <div class="meta-grid">
            <div class="meta-item">
                <div class="meta-label">Report ID</div>
                <div class="meta-value">${report.id}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Date</div>
                <div class="meta-value">${report.date}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Target</div>
                <div class="meta-value">${report.target}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Scan Type</div>
                <div class="meta-value">${report.type}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Status</div>
                <div class="meta-value">${report.status}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Total Issues</div>
                <div class="meta-value">${findings.length}</div>
            </div>
        </div>
    </div>

    <div class="summary">
        <h2>Executive Summary</h2>
        <p>
            This security assessment identified <strong>${findings.length}</strong> potential 
            ${findings.length === 1 ? 'issue' : 'issues'} in the analyzed ${report.type.toLowerCase()}.
            ${findings.length > 0 ? 'Immediate attention is recommended for critical and high severity findings.' : 'No security issues were detected.'}
        </p>
    </div>

    <div class="findings">
        <h2>Detailed Findings</h2>
        ${findings.length === 0 ? '<p>No issues found. The scan completed successfully with no security concerns.</p>' : ''}
        ${findings.map((finding: any, index: number) => {
          const severity = (finding.severity || 'LOW').toLowerCase();
          return `
            <div class="finding ${severity}">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <h3 style="margin: 0;">${index + 1}. ${finding.issue || finding.threat_type || 'Security Issue'}</h3>
                    <span class="severity-badge severity-${severity}">${finding.severity || 'LOW'}</span>
                </div>
                <p><strong>Description:</strong> ${finding.description || 'No description available'}</p>
                ${finding.line ? `<p><strong>Line:</strong> ${finding.line}</p>` : ''}
                ${finding.file ? `<p><strong>File:</strong> ${finding.file}</p>` : ''}
                ${finding.details ? `<p><strong>Details:</strong> ${finding.details}</p>` : ''}
                ${finding.code ? `<div class="code-block">${escapeHtml(finding.code)}</div>` : ''}
                ${finding.recommendation ? `<p><strong>Recommendation:</strong> ${finding.recommendation}</p>` : ''}
                ${finding.samples ? `<p><strong>Evidence Samples:</strong> ${finding.samples.length} samples found</p>` : ''}
            </div>
          `;
        }).join('')}
    </div>

    <div class="footer">
        <p>Generated by MisCrypt - Integrated Cryptographic Misconfiguration & Runtime Exploitability Analyzer</p>
        <p>Report generated on ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
    `;
  };

  const generateTextReport = (report: Report) => {
    const { data } = report;
    const findings = data.findings || data.tls_issues || data.alerts || [];
    
    let text = `
╔════════════════════════════════════════════════════════════════╗
║           MisCrypt Security Report                             ║
║   Cryptographic Misconfiguration & Exploitability Analysis     ║
╚════════════════════════════════════════════════════════════════╝

REPORT METADATA
═══════════════
Report ID:    ${report.id}
Date:         ${report.date}
Target:       ${report.target}
Scan Type:    ${report.type}
Status:       ${report.status}
Total Issues: ${findings.length}

EXECUTIVE SUMMARY
═════════════════
This security assessment identified ${findings.length} potential ${findings.length === 1 ? 'issue' : 'issues'} 
in the analyzed ${report.type.toLowerCase()}.
${findings.length > 0 ? 'Immediate attention is recommended for critical and high severity findings.' : 'No security issues were detected.'}

DETAILED FINDINGS
═════════════════
`;

    if (findings.length === 0) {
      text += '\nNo issues found. The scan completed successfully with no security concerns.\n';
    } else {
      findings.forEach((finding: any, index: number) => {
        text += `
────────────────────────────────────────────────────────────────
Finding #${index + 1}: ${finding.issue || finding.threat_type || 'Security Issue'}
────────────────────────────────────────────────────────────────
Severity:      ${finding.severity || 'LOW'}
Description:   ${finding.description || 'No description available'}
${finding.line ? `Line:          ${finding.line}` : ''}
${finding.file ? `File:          ${finding.file}` : ''}
${finding.details ? `Details:       ${finding.details}` : ''}
${finding.code ? `Code:          ${finding.code}` : ''}
${finding.recommendation ? `Recommendation: ${finding.recommendation}` : ''}
${finding.samples ? `Evidence:      ${finding.samples.length} samples found` : ''}
`;
      });
    }

    text += `
════════════════════════════════════════════════════════════════
Generated by MisCrypt
Report generated on ${new Date().toLocaleString()}
════════════════════════════════════════════════════════════════
`;

    return text;
  };

  const escapeHtml = (text: string) => {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  const filteredReports = reports.filter(report =>
    report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono-tech tracking-tight">Audit Reports</h1>
          <p className="text-muted-foreground">Archive of past security assessments.</p>
        </div>
        <div className="w-full md:w-64 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reports..." 
            className="pl-9 bg-card border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <Card className="bg-card/50 border-white/5">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No Reports Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No reports match your search criteria.' : 'Run some scans to generate reports.'}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="bg-card/50 border-white/5 hover:border-primary/20 transition-all">
              <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold font-mono-tech">{report.id}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {report.date}</span>
                      <span>•</span>
                      <span>{report.target}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    report.status === 'Critical' ? 'bg-destructive/20 text-destructive' :
                    report.status === 'High' ? 'bg-orange-500/20 text-orange-500' :
                    report.status === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-green-500/20 text-green-500'
                  }`}>
                    {report.status}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">{report.type}</div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => downloadReport(report, 'html')}
                      className="text-muted-foreground hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-1" /> HTML
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => downloadReport(report, 'json')}
                      className="text-muted-foreground hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-1" /> JSON
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => downloadReport(report, 'txt')}
                      className="text-muted-foreground hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-1" /> TXT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
