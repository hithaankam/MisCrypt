import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Terminal, Upload, Play, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CryptoScanner() {
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleScan = () => {
    setLoading(true);
    // Simulate scan delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Scan Complete",
        description: "Redirecting to analysis results...",
      });
      setLocation("/results");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Terminal className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-mono-tech tracking-tight">Crypto Scanner</h1>
          <p className="text-muted-foreground">Detect insecure cryptographic primitives and implementations.</p>
        </div>
      </div>

      <Card className="border-white/10 bg-card">
        <CardHeader>
          <CardTitle>Source Code Analysis</CardTitle>
          <CardDescription>Paste your source code or upload a file to begin the audit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Target Language</Label>
            <Select defaultValue="python">
              <SelectTrigger className="w-full bg-background/50 border-white/10">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="javascript">JavaScript / TypeScript</SelectItem>
                <SelectItem value="go">Go</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Source Code</Label>
            <Textarea 
              placeholder="Paste code here..." 
              className="min-h-[300px] font-mono text-sm bg-black/40 border-white/10 resize-none focus-visible:ring-primary" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-dashed border-white/20 hover:border-primary/50 hover:text-primary">
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </Button>
            <Button onClick={handleScan} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start Analysis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/5 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-primary/10 text-primary">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium font-mono-tech text-sm text-primary mb-1">Supported Checks</h4>
              <p className="text-xs text-muted-foreground">
                MD5/SHA1 hashing, ECB mode usage, hardcoded keys, weak random number generation, insecure padding, known CVEs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
