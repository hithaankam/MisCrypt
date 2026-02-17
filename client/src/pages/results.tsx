import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, Share2, ShieldAlert, CheckCircle, XCircle, Activity } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

interface ScanResult {
  type: 'static' | 'tls' | 'runtime';
  data: any;
}

export default function Results() {
  const [results, setResults] = useState<ScanResult | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const storedResults = sessionStorage.getItem('scanResults');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);
      
      // Save to reports history
      saveToReports(parsedResults);
    }
  }, []);

  const saveToReports = (scanResult: ScanResult) => {
    const { type, data } = scanResult;
    
    // Generate report metadata
    const reportId = `REP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const date = new Date().toISOString().split('T')[0];
    
    let target = 'Unknown';
    let scanType = 'Unknown';
    let status = 'Pass';
    
    if (type === 'static') {
      target = data.repo_url || 'Code Snippet';
      scanType = 'Static Analysis';
      const findings = data.findings || [];
      const hasCritical = findings.some((f: any) => f.severity === 'CRITICAL');
      const hasHigh = findings.some((f: any) => f.severity === 'HIGH');
      const hasMedium = findings.some((f: any) => f.severity === 'MEDIUM');
      
      if (hasCritical) status = 'Critical';
      else if (hasHigh) status = 'High';
      else if (hasMedium) status = 'Medium';
      else if (findings.length > 0) status = 'Low';
    } else if (type === 'tls') {
      target = data.domain || 'Unknown Domain';
      scanType = 'TLS Audit';
      const issues = data.tls_issues || [];
      const hasCritical = issues.some((i: any) => i.severity === 'CRITICAL');
      const hasHigh = issues.some((i: any) => i.severity === 'HIGH');
      const hasMedium = issues.some((i: any) => i.severity === 'MEDIUM');
      
      if (hasCritical) status = 'Critical';
      else if (hasHigh) status = 'High';
      else if (hasMedium) status = 'Medium';
      else if (issues.length > 0) status = 'Low';
    } else if (type === 'runtime') {
      target = data.log_source || 'Log File';
      scanType = 'Runtime Analysis';
      const alerts = data.alerts || [];
      if (alerts.some((a: any) => a.detected)) status = 'High';
    }
    
    const report = {
      id: reportId,
      date,
      target,
      type: scanType,
      status,
      data
    };
    
    // Load existing reports
    const existingReports = localStorage.getItem('scanReports');
    const reports = existingReports ? JSON.parse(existingReports) : [];
    
    // Add new report at the beginning
    reports.unshift(report);
    
    // Keep only last 50 reports
    const limitedReports = reports.slice(0, 50);
    
    // Save back to localStorage
    localStorage.setItem('scanReports', JSON.stringify(limitedReports));
  };

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XCircle className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No Scan Results</h2>
        <p className="text-muted-foreground">Please run a scan first</p>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-destructive hover:bg-destructive/90 text-white';
      case 'HIGH':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'MEDIUM':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'LOW':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return <ShieldAlert className="h-5 w-5 text-destructive" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
    }
  };

  const renderStaticResults = () => {
    // Handle both array format and object format
    const findings = Array.isArray(results.data) ? results.data : (results.data.findings || []);
    const total_issues = findings.length;
    const language = results.data.language || "unknown";
    
    const severityCounts = findings.reduce((acc: any, f: any) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    }, {});

    const overallRisk = severityCounts.CRITICAL > 0 ? 'CRITICAL' : 
                        severityCounts.HIGH > 0 ? 'HIGH' : 
                        severityCounts.MEDIUM > 0 ? 'MEDIUM' : 'LOW';

    return (
      <>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-mono-tech tracking-tight">Static Code Analysis Results</h1>
            <p className="text-muted-foreground">Language: <span className="font-mono text-primary">{language}</span></p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className={`md:col-span-1 bg-card ${overallRisk === 'CRITICAL' || overallRisk === 'HIGH' ? 'border-destructive/50' : 'border-white/10'} overflow-hidden relative`}>
            <div className={`absolute inset-0 ${overallRisk === 'CRITICAL' || overallRisk === 'HIGH' ? 'bg-destructive/5' : 'bg-primary/5'} z-0`} />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Risk Score</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold font-mono-tech ${overallRisk === 'CRITICAL' || overallRisk === 'HIGH' ? 'text-destructive' : 'text-primary'}`}>{overallRisk}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {severityCounts.CRITICAL && <Badge variant="outline" className="border-destructive/50 text-destructive bg-destructive/10">{severityCounts.CRITICAL} Critical</Badge>}
                {severityCounts.HIGH && <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/10">{severityCounts.HIGH} High</Badge>}
                {severityCounts.MEDIUM && <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 bg-yellow-500/10">{severityCounts.MEDIUM} Medium</Badge>}
                {severityCounts.LOW && <Badge variant="outline" className="border-blue-500/50 text-blue-500 bg-blue-500/10">{severityCounts.LOW} Low</Badge>}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-card border-white/10">
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {total_issues === 0 
                  ? "No cryptographic issues detected in the scanned code."
                  : `The scan identified ${total_issues} cryptographic ${total_issues === 1 ? 'issue' : 'issues'} in the provided ${language} code. ${severityCounts.CRITICAL ? 'Critical vulnerabilities require immediate attention.' : ''}`
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {findings.length > 0 && (
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <div className="bg-card/50 p-4 border-b border-white/10 font-mono-tech text-sm font-bold flex justify-between items-center">
              <span>FINDINGS</span>
              <span className="text-xs text-muted-foreground">Total: {total_issues} Issues</span>
            </div>
            
            <div className="divide-y divide-white/5 bg-card">
              {findings.map((finding: any, idx: number) => (
                <div key={idx} className="p-6 hover:bg-white/5 transition-colors group">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(finding.severity)}
                      <h3 className="font-bold text-lg">{finding.issue}</h3>
                    </div>
                    <Badge className={getSeverityColor(finding.severity) + ' border-none'}>{finding.severity}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 pl-8">
                    {finding.description}
                  </p>
                  <div className="pl-8 grid grid-cols-2 gap-4 text-xs font-mono text-muted-foreground mb-4">
                    <div>
                      <span className="block text-white/50 mb-1">Line Number</span>
                      <span className="text-white">{finding.line}</span>
                    </div>
                    <div>
                      <span className="block text-white/50 mb-1">Recommendation</span>
                      <span className="text-primary">{finding.recommendation}</span>
                    </div>
                  </div>
                  <div className="pl-8 bg-black/40 p-4 rounded border border-white/5 font-mono text-sm">
                    <div className="text-destructive">{finding.code}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderTLSResults = () => {
    const { tls_issues, total_issues, domain, port } = results.data;
    
    const severityCounts = tls_issues.reduce((acc: any, issue: any) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {});

    const overallRisk = severityCounts.CRITICAL > 0 ? 'CRITICAL' : 
                        severityCounts.HIGH > 0 ? 'HIGH' : 
                        severityCounts.MEDIUM > 0 ? 'MEDIUM' : 'LOW';

    return (
      <>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-mono-tech tracking-tight">TLS Audit Results</h1>
            <p className="text-muted-foreground">Target: <span className="font-mono text-primary">{domain}:{port}</span></p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className={`md:col-span-1 bg-card ${overallRisk === 'CRITICAL' || overallRisk === 'HIGH' ? 'border-destructive/50' : 'border-white/10'} overflow-hidden relative`}>
            <div className={`absolute inset-0 ${overallRisk === 'CRITICAL' || overallRisk === 'HIGH' ? 'bg-destructive/5' : 'bg-primary/5'} z-0`} />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">TLS Security Score</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold font-mono-tech ${overallRisk === 'CRITICAL' || overallRisk === 'HIGH' ? 'text-destructive' : 'text-primary'}`}>{overallRisk}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {severityCounts.CRITICAL && <Badge variant="outline" className="border-destructive/50 text-destructive bg-destructive/10">{severityCounts.CRITICAL} Critical</Badge>}
                {severityCounts.HIGH && <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/10">{severityCounts.HIGH} High</Badge>}
                {severityCounts.MEDIUM && <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 bg-yellow-500/10">{severityCounts.MEDIUM} Medium</Badge>}
                {severityCounts.LOW && <Badge variant="outline" className="border-blue-500/50 text-blue-500 bg-blue-500/10">{severityCounts.LOW} Low</Badge>}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-card border-white/10">
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {total_issues === 0 
                  ? "No TLS configuration issues detected. The server appears to be properly configured."
                  : `The TLS audit identified ${total_issues} configuration ${total_issues === 1 ? 'issue' : 'issues'} on ${domain}:${port}. ${severityCounts.CRITICAL ? 'Critical issues require immediate remediation.' : ''}`
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {tls_issues.length > 0 && (
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <div className="bg-card/50 p-4 border-b border-white/10 font-mono-tech text-sm font-bold flex justify-between items-center">
              <span>TLS ISSUES</span>
              <span className="text-xs text-muted-foreground">Total: {total_issues} Issues</span>
            </div>
            
            <div className="divide-y divide-white/5 bg-card">
              {tls_issues.map((issue: any, idx: number) => (
                <div key={idx} className="p-6 hover:bg-white/5 transition-colors group">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(issue.severity)}
                      <h3 className="font-bold text-lg">{issue.issue}</h3>
                    </div>
                    <Badge className={getSeverityColor(issue.severity) + ' border-none'}>{issue.severity}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 pl-8">
                    {issue.description}
                  </p>
                  <div className="pl-8 grid grid-cols-2 gap-4 text-xs font-mono text-muted-foreground mb-4">
                    <div>
                      <span className="block text-white/50 mb-1">Details</span>
                      <span className="text-white">{issue.details}</span>
                    </div>
                    <div>
                      <span className="block text-white/50 mb-1">Recommendation</span>
                      <span className="text-primary">{issue.recommendation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderRuntimeResults = () => {
    const { alerts, alert_count, log_source } = results.data;
    
    const detectedThreats = alerts.filter((a: any) => a.detected);
    const overallRisk = detectedThreats.length > 3 ? 'HIGH' : 
                        detectedThreats.length > 1 ? 'MEDIUM' : 
                        detectedThreats.length > 0 ? 'LOW' : 'NONE';

    return (
      <>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-mono-tech tracking-tight">Runtime Log Analysis Results</h1>
            <p className="text-muted-foreground">Log Source: <span className="font-mono text-primary">{log_source}</span></p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className={`md:col-span-1 bg-card ${overallRisk === 'HIGH' ? 'border-destructive/50' : 'border-white/10'} overflow-hidden relative`}>
            <div className={`absolute inset-0 ${overallRisk === 'HIGH' ? 'bg-destructive/5' : 'bg-orange-500/5'} z-0`} />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Threat Level</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold font-mono-tech ${overallRisk === 'HIGH' ? 'text-destructive' : 'text-orange-500'}`}>{overallRisk}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/10">{detectedThreats.length} Threats Detected</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-card border-white/10">
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {detectedThreats.length === 0 
                  ? "No active exploitation attempts detected in the analyzed logs. The server appears to be operating normally."
                  : `Runtime analysis detected ${detectedThreats.length} potential ${detectedThreats.length === 1 ? 'threat' : 'threats'} in the server logs. ${overallRisk === 'HIGH' ? 'Multiple attack indicators suggest active exploitation attempts.' : 'Monitor these patterns for potential security incidents.'}`
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {alerts.length > 0 && (
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <div className="bg-card/50 p-4 border-b border-white/10 font-mono-tech text-sm font-bold flex justify-between items-center">
              <span>THREAT INDICATORS</span>
              <span className="text-xs text-muted-foreground">Total: {alert_count} Alerts</span>
            </div>
            
            <div className="divide-y divide-white/5 bg-card">
              {alerts.map((alert: any, idx: number) => (
                <div key={idx} className="p-6 hover:bg-white/5 transition-colors group">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <Activity className={`h-5 w-5 ${alert.detected ? 'text-orange-500' : 'text-muted-foreground'}`} />
                      <h3 className="font-bold text-lg capitalize">{alert.threat_type.replace(/_/g, ' ')}</h3>
                    </div>
                    <Badge className={alert.detected ? 'bg-orange-500 hover:bg-orange-600 text-white border-none' : 'bg-gray-500 hover:bg-gray-600 text-white border-none'}>
                      {alert.detected ? 'DETECTED' : 'NOT DETECTED'}
                    </Badge>
                  </div>
                  {alert.detected && (
                    <>
                      <p className="text-muted-foreground text-sm mb-4 pl-8">
                        {alert.evidence_count} {alert.evidence_count === 1 ? 'instance' : 'instances'} of this threat pattern detected in the logs.
                      </p>
                      <div className="pl-8 grid grid-cols-2 gap-4 text-xs font-mono text-muted-foreground mb-4">
                        <div>
                          <span className="block text-white/50 mb-1">Evidence Count</span>
                          <span className="text-white">{alert.evidence_count}</span>
                        </div>
                        <div>
                          <span className="block text-white/50 mb-1">Threat Type</span>
                          <span className="text-orange-500">{alert.threat_type}</span>
                        </div>
                      </div>
                      {alert.samples && alert.samples.length > 0 && (
                        <div className="pl-8">
                          <span className="block text-white/50 mb-2 text-xs">Sample Evidence:</span>
                          <div className="bg-black/40 p-4 rounded border border-white/5 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
                            {alert.samples.map((sample: string, sIdx: number) => (
                              <div key={sIdx} className="text-orange-400/80">{sample}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {results.type === 'static' && renderStaticResults()}
      {results.type === 'tls' && renderTLSResults()}
      {results.type === 'runtime' && renderRuntimeResults()}
      
      <div className="flex justify-center pt-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-muted-foreground hover:text-white">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
