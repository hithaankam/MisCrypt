import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Terminal, Upload, Play, Loader2, GitBranch } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function CryptoScanner() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [language, setLanguage] = useState("python");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleCodeScan = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to scan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await api.staticScan({ code, language });
      
      sessionStorage.setItem('scanResults', JSON.stringify({
        type: 'static',
        data: result
      }));
      
      toast({
        title: "Scan Complete",
        description: `Found ${result.total_issues} potential issues`,
      });
      setLocation("/results");
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRepoScan = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Git repository URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await api.staticScan({ repo_url: repoUrl });
      
      sessionStorage.setItem('scanResults', JSON.stringify({
        type: 'static',
        data: result
      }));
      
      toast({
        title: "Scan Complete",
        description: `Found ${result.total_issues} potential issues in repository`,
      });
      setLocation("/results");
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <CardDescription>Scan code directly or analyze a Git repository.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="code">
                <Terminal className="mr-2 h-4 w-4" />
                Code Input
              </TabsTrigger>
              <TabsTrigger value="repo">
                <GitBranch className="mr-2 h-4 w-4" />
                Git Repository
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="space-y-6">
              <div className="space-y-2">
                <Label>Target Language</Label>
                <Select value={language} onValueChange={setLanguage}>
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
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste code here..." 
                  className="min-h-[300px] font-mono text-sm bg-black/40 border-white/10 resize-none focus-visible:ring-primary" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-dashed border-white/20 hover:border-primary/50 hover:text-primary">
                  <Upload className="mr-2 h-4 w-4" /> Upload File
                </Button>
                <Button onClick={handleCodeScan} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
            </TabsContent>

            <TabsContent value="repo" className="space-y-6">
              <div className="space-y-2">
                <Label>Git Repository URL</Label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository" 
                    className="pl-9 bg-background/50 border-white/10 font-mono" 
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  The scanner will clone and analyze all Python, Java, JavaScript, TypeScript, and Go files.
                </p>
              </div>

              <Button onClick={handleRepoScan} disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning Repository...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Scan Repository
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
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
                MD5/SHA1 hashing, ECB mode usage, hardcoded keys, weak RSA keys, insecure random number generation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
