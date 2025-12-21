import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Lock, Play, Loader2, Globe } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function TLSScanner() {
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleScan = () => {
    setLoading(true);
    // Simulate scan delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Audit Complete",
        description: "TLS configuration analysis ready.",
      });
      setLocation("/results");
    }, 2000);
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
              <Input placeholder="example.com" className="pl-9 bg-background/50 border-white/10 font-mono" />
            </div>
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
    </div>
  );
}
