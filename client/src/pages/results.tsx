import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, Share2, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function Results() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono-tech tracking-tight">Scan Results</h1>
          <p className="text-muted-foreground">Target: <span className="font-mono text-primary">src/auth/login.py</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" className="border-white/10">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Score Card */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-card border-destructive/50 overflow-hidden relative">
          <div className="absolute inset-0 bg-destructive/5 z-0" />
          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Risk Score</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold font-mono-tech text-destructive">HIGH</span>
              <span className="text-sm text-destructive font-medium">Critical Issues Found</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline" className="border-destructive/50 text-destructive bg-destructive/10">3 Critical</Badge>
              <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/10">2 Medium</Badge>
              <Badge variant="outline" className="border-blue-500/50 text-blue-500 bg-blue-500/10">5 Low</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-card border-white/10">
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The scan identified critical cryptographic vulnerabilities in the authentication module. 
              Primary concerns include the usage of broken hashing algorithms (MD5) for password storage 
              and hardcoded API secrets. Immediate remediation is required to prevent credential theft.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vulnerability Table */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <div className="bg-card/50 p-4 border-b border-white/10 font-mono-tech text-sm font-bold flex justify-between items-center">
          <span>FINDINGS</span>
          <span className="text-xs text-muted-foreground">Total: 10 Issues</span>
        </div>
        
        <div className="divide-y divide-white/5 bg-card">
          {/* Finding 1 */}
          <div className="p-6 hover:bg-white/5 transition-colors group">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                <h3 className="font-bold text-lg">Use of Weak Hashing Algorithm (MD5)</h3>
              </div>
              <Badge className="bg-destructive hover:bg-destructive/90 text-white border-none">CRITICAL</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4 pl-8">
              MD5 is a broken cryptographic hash function and should not be used for security-critical applications, 
              especially password hashing. It is vulnerable to collision attacks.
            </p>
            <div className="pl-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-muted-foreground mb-4">
              <div>
                <span className="block text-white/50 mb-1">CWE ID</span>
                <span className="text-white">CWE-327</span>
              </div>
              <div>
                <span className="block text-white/50 mb-1">OWASP Category</span>
                <span className="text-white">A02:2021-Cryptographic Failures</span>
              </div>
              <div>
                <span className="block text-white/50 mb-1">File</span>
                <span className="text-primary underline cursor-pointer">auth/login.py:42</span>
              </div>
            </div>
            <div className="pl-8 bg-black/40 p-4 rounded border border-white/5 font-mono text-sm">
              <div className="flex gap-4">
                <div className="text-destructive">- hash = hashlib.md5(password.encode()).hexdigest()</div>
              </div>
              <div className="flex gap-4">
                <div className="text-primary">+ hash = hashlib.sha256(password.encode()).hexdigest() # Better, but use bcrypt/argon2</div>
              </div>
            </div>
          </div>

          {/* Finding 2 */}
          <div className="p-6 hover:bg-white/5 transition-colors group">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold text-lg">Hardcoded Secret Key</h3>
              </div>
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none">HIGH</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4 pl-8">
              A hardcoded secret key was detected. Secrets should be loaded from environment variables or a secure vault, 
              never committed to source control.
            </p>
            <div className="pl-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-muted-foreground mb-4">
               <div>
                <span className="block text-white/50 mb-1">CWE ID</span>
                <span className="text-white">CWE-798</span>
              </div>
               <div>
                <span className="block text-white/50 mb-1">OWASP Category</span>
                <span className="text-white">A07:2021-Identification Failures</span>
              </div>
            </div>
             <div className="pl-8 bg-black/40 p-4 rounded border border-white/5 font-mono text-sm">
              <div className="flex gap-4">
                <div className="text-destructive">- SECRET_KEY = "super_secret_key_123"</div>
              </div>
              <div className="flex gap-4">
                <div className="text-primary">+ SECRET_KEY = os.getenv("APP_SECRET")</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-muted-foreground hover:text-white">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
