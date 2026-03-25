import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Play, Loader2, Upload, FlaskConical } from "lucide-react";
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const SAMPLE_LOG = `07/Jan/2026:06:50:41  [error] 1234#0: *1 SSL_do_handshake() failed (SSL: error:1408F10B:SSL routines:ssl3_get_record:wrong version number), client: 10.0.0.50, server: example.com
07/Jan/2026:06:55:41  [error] 1234#0: *2 SSL handshake failed: unsupported protocol, client: 203.0.113.15, server: example.com
07/Jan/2026:07:00:41  [error] 1234#0: *3 SSL_accept() failed (SSL: error:14094410:SSL routines:ssl3_read_bytes:sslv3 alert handshake failure), client: 10.0.0.50, server: example.com
07/Jan/2026:07:05:41  [error] 1234#0: *4 SSL_do_handshake() failed (SSL: error:140943FC:SSL routines:ssl3_read_bytes:sslv3 alert bad record mac), client: 10.0.0.50, server: example.com
07/Jan/2026:07:10:41  [error] 1234#0: *5 SSL certificate verify failed: certificate has expired, client: 192.168.1.100, server: example.com
07/Jan/2026:07:15:41  [error] 1234#0: *6 SSL certificate verify failed: unknown ca, client: 198.51.100.42, server: example.com
07/Jan/2026:07:20:41  [error] 1234#0: *7 SSL_do_handshake() failed (SSL: error:1408F10B:SSL routines:ssl3_get_record:wrong version number), client: 192.168.1.100, server: example.com
07/Jan/2026:07:25:41  [error] 1234#0: *8 SSL handshake failed: unsupported protocol, client: 198.51.100.42, server: example.com
07/Jan/2026:07:30:41  [error] 1234#0: *9 SSL_do_handshake() failed (SSL: error:1408F10B), client: 10.0.0.50, server: example.com
07/Jan/2026:07:35:41  [error] 1234#0: *10 SSL_do_handshake() failed (SSL: error:140943FC), client: 10.0.0.50, server: example.com
07/Jan/2026:07:40:41  [error] 1234#0: *11 SSL certificate verify failed: bad certificate, client: 198.51.100.42, server: example.com
07/Jan/2026:07:45:41  [error] 1234#0: *12 SSL_do_handshake() failed (SSL: error:1408F10B), client: 198.51.100.42, server: example.com
07/Jan/2026:07:50:41  [error] 1234#0: *13 SSL handshake failed: unsupported protocol, client: 172.16.0.25, server: example.com
07/Jan/2026:07:55:41  [error] 1234#0: *14 SSL_do_handshake() failed (SSL: error:1408F10B), client: 172.16.0.25, server: example.com`;

export default function RuntimeAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleResult = (result: any) => {
    sessionStorage.setItem('scanResults', JSON.stringify({ type: 'runtime', data: result }));
    toast({
      title: "Analysis Complete",
      description: `Found ${result.alert_count} security alert${result.alert_count !== 1 ? 's' : ''}`,
    });
    setLocation("/results");
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({ title: "Error", description: "Please select a log file", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await api.runtimeScanUpload(selectedFile);
      handleResult(result);
    } catch (error) {
      toast({ title: "Analysis Failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSampleScan = async () => {
    setLoading(true);
    try {
      const blob = new Blob([SAMPLE_LOG], { type: 'text/plain' });
      const file = new File([blob], 'sample_nginx_error.log', { type: 'text/plain' });
      const result = await api.runtimeScanUpload(file);
      handleResult(result);
    } catch (error) {
      toast({ title: "Analysis Failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
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
          <CardTitle>Log Source</CardTitle>
          <CardDescription>Upload a log file or run with the built-in sample to test the analyzer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" /> Upload Log File
              </TabsTrigger>
              <TabsTrigger value="sample">
                <FlaskConical className="mr-2 h-4 w-4" /> Use Sample Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                  ${dragOver ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-orange-500/50 hover:bg-white/5'}`}
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                {selectedFile ? (
                  <div>
                    <p className="font-mono text-sm text-orange-400">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024).toFixed(1)} KB — click to change</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium">Drop your log file here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports Nginx / Apache error.log and access.log</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept=".log,.txt" className="hidden"
                  onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])} />
              </div>
              <Button onClick={handleFileUpload} disabled={loading || !selectedFile} className="w-full bg-orange-600 text-white hover:bg-orange-700">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Play className="mr-2 h-4 w-4" /> Analyze Log File</>}
              </Button>
            </TabsContent>

            <TabsContent value="sample" className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-black/30 p-4 max-h-64 overflow-y-auto">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">{SAMPLE_LOG}</pre>
              </div>
              <p className="text-xs text-muted-foreground">
                This sample contains TLS handshake failures, certificate probing, and cipher enumeration — all the attack indicators MisCrypt detects.
              </p>
              <Button onClick={handleSampleScan} disabled={loading} className="w-full bg-orange-600 text-white hover:bg-orange-700">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><FlaskConical className="mr-2 h-4 w-4" /> Run Sample Analysis</>}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-white/5 bg-orange-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-orange-500/10 text-orange-500">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium font-mono-tech text-sm text-orange-500 mb-1">What Gets Detected</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                TLS handshake failures · Cipher enumeration attempts · Protocol downgrade indicators · Certificate probing · SSL stripping patterns · Abnormal connection volumes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
