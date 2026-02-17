import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Activity, Play, Loader2, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function RuntimeAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [logPath, setLogPath] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleScan = async () => {
    if (!logPath.trim()) {
      toast({
        title: "Error",
        description: "Please enter a log file path",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await api.runtimeScan({ log_source: logPath });
      
      // Store results in sessionStorage for results page
      sessionStorage.setItem('scanResults', JSON.stringify({
        type: 'runtime',
        data: result
      }));
      
      toast({
        title: "Analysis Complete",
        description: `Found ${result.alert_count} security alerts`,
      });
      setLocation("/results");
    } catch (error) {
      toast({
        title: "Analysis Failed",
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
        <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-mono-tech tracking-tight">Runtime Log Analyzer</h1>
          <p className="text-muted-foreground">Detect exploitation attempts and attack patterns in server logs.</p>
        </div>
      </div>

      <Card className="border-white/10 bg-card">
        <CardHeader>
          <CardTitle>Log Source Configuration</CardTitle>
          <CardDescription>Provide the path to your Nginx or Apache log files for analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Log File Path</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                value={logPath}
                onChange={(e) => setLogPath(e.target.value)}
                placeholder="/var/log/nginx/error.log" 
                className="pl-9 bg-background/50 border-white/10 font-mono" 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the full path to your server log file (error.log or access.log)
            </p>
          </div>

          <div className="space-y-4">
            <Label>Detection Parameters</Label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="tls-handshake" defaultChecked />
                <Label htmlFor="tls-handshake" className="font-normal text-sm cursor-pointer">TLS Handshake Failures</Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="cipher-enum" defaultChecked />
                <Label htmlFor="cipher-enum" className="font-normal text-sm cursor-pointer">Cipher Enumeration</Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="protocol-downgrade" defaultChecked />
                <Label htmlFor="protocol-downgrade" className="font-normal text-sm cursor-pointer">Protocol Downgrade Attempts</Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="cert-probing" defaultChecked />
                <Label htmlFor="cert-probing" className="font-normal text-sm cursor-pointer">Certificate Probing</Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="ssl-stripping" defaultChecked />
                <Label htmlFor="ssl-stripping" className="font-normal text-sm cursor-pointer">SSL Stripping Indicators</Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/5 p-3 rounded bg-white/5">
                <Checkbox id="abnormal-conn" defaultChecked />
                <Label htmlFor="abnormal-conn" className="font-normal text-sm cursor-pointer">Abnormal Connections</Label>
              </div>
            </div>
          </div>

          <Button onClick={handleScan} disabled={loading} className="w-full bg-orange-600 text-white hover:bg-orange-700">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Logs...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start Runtime Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/5 bg-orange-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-orange-500/10 text-orange-500">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium font-mono-tech text-sm text-orange-500 mb-1">Supported Log Formats</h4>
              <p className="text-xs text-muted-foreground">
                Nginx error/access logs, Apache error/access logs. Detects TLS attacks, protocol downgrades, and exploitation attempts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-yellow-500/10 text-yellow-500">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium font-mono-tech text-sm text-yellow-500 mb-1">Example Log Paths</h4>
              <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                <li className="font-mono">• /var/log/nginx/error.log</li>
                <li className="font-mono">• /var/log/nginx/access.log</li>
                <li className="font-mono">• /var/log/apache2/error.log</li>
                <li className="font-mono">• miscrypt-lab/logs/error.log (for testing)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
