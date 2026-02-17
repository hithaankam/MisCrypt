import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Lock, Play, Loader2, Globe } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function TLSScanner() {
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleScan = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain or IP address",
        variant: "destructive",
      });
      return;
    }

    // Parse domain to extract hostname (remove protocol, port, path)
    let cleanDomain = domain.trim();
    
    // Remove protocol if present
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    
    // Remove port if present
    cleanDomain = cleanDomain.replace(/:\d+/, '');
    
    // Remove path if present
    cleanDomain = cleanDomain.replace(/\/.*$/, '');
    
    if (!cleanDomain) {
      toast({
        title: "Error",
        description: "Invalid domain format",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await api.tlsScan({ domain: cleanDomain, port: 443 });
      
      // Store results in sessionStorage for results page
      sessionStorage.setItem('scanResults', JSON.stringify({
        type: 'tls',
        data: result
      }));
      
      toast({
        title: "Audit Complete",
        description: `Found ${result.total_issues} TLS configuration issues`,
      });
      setLocation("/results");
    } catch (error) {
      toast({
        title: "Audit Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
          <Lock className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-mono-tech tracking-tight">TLS Auditor</h1>
          <p className="text-muted-foreground">Inspect server TLS configurations and certificate chains.</p>
        </div>
      </div>

      <Card className="border-white/10 bg-card">
        <CardHeader>
          <CardTitle>Target Configuration</CardTitle>
          <CardDescription>Enter the domain or IP address you wish to audit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
            <Label>Target Domain / IP</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com or expired.badssl.com" 
                className="pl-9 bg-background/50 border-white/10 font-mono" 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter just the domain name (e.g., example.com). Protocol and port will be handled automatically.
            </p>
          </div>

          <div className="space-y-4">
            <Label>Audit Parameters</Label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="missing-tls" defaultChecked />
                <Label htmlFor="missing-tls" className="font-normal text-sm cursor-pointer">Missing TLS Enforcment</Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="weak-versions" defaultChecked />
                <Label htmlFor="weak-versions" className="font-normal text-sm cursor-pointer">Weak TLS Versions (1.0/1.1)</Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="weak-cipher" defaultChecked />
                <Label htmlFor="weak-cipher" className="font-normal text-sm cursor-pointer">Weak Cipher Suites</Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="cert-chain" defaultChecked />
                <Label htmlFor="cert-chain" className="font-normal text-sm cursor-pointer">Invalid Certificate Chain</Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="hsts" defaultChecked />
                <Label htmlFor="hsts" className="font-normal text-sm cursor-pointer">Missing HSTS Headers</Label>
              </div>
            </div>
          </div>

          <Button onClick={handleScan} disabled={loading} className="w-full bg-blue-600 text-white hover:bg-blue-700">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Auditing Network...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start TLS Audit
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/5 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-blue-500/10 text-blue-500">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium font-mono-tech text-sm text-blue-500 mb-1">Test Domains</h4>
              <p className="text-xs text-muted-foreground">
                Try these BadSSL test domains:<br/>
                • expired.badssl.com (Expired Certificate)<br/>
                • self-signed.badssl.com (Self-Signed Certificate)<br/>
                • wrong.host.badssl.com (Wrong Hostname)<br/>
                • untrusted-root.badssl.com (Untrusted Root)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
