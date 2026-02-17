import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Terminal, Lock, Activity, AlertTriangle, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-mono-tech tracking-tight mb-2">Security Dashboard</h1>
        <p className="text-muted-foreground">Overview of your security posture and active scanners.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono-tech">128</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono-tech text-destructive">24</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secure Systems</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono-tech text-primary">94%</div>
            <p className="text-xs text-muted-foreground">+2% improvement</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono-tech">2h ago</div>
            <p className="text-xs text-muted-foreground">Automated check</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Launch */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group border-white/10 bg-card hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <div className="mb-4 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Terminal className="h-5 w-5" />
            </div>
            <CardTitle className="font-mono-tech text-xl">Cryptographic Scanner</CardTitle>
            <CardDescription>
              Analyze source code for weak encryption, hashing algorithms, and key management issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/crypto-scan">
              <Button className="w-full font-mono-tech group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Launch Scanner <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-card hover:border-blue-500/50 transition-all duration-300">
          <CardHeader>
            <div className="mb-4 h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <CardTitle className="font-mono-tech text-xl">TLS Auditor</CardTitle>
            <CardDescription>
              Check server endpoints for SSL/TLS configuration weakness, certificate validity, and protocol support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tls-scan">
              <Button variant="outline" className="w-full font-mono-tech border-white/10 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors">
                Start Audit <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-card hover:border-orange-500/50 transition-all duration-300">
          <CardHeader>
            <div className="mb-4 h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <CardTitle className="font-mono-tech text-xl">Runtime Analyzer</CardTitle>
            <CardDescription>
              Detect exploitation attempts and attack patterns in server logs for real-time threat assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/runtime-scan">
              <Button variant="outline" className="w-full font-mono-tech border-white/10 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors">
                Analyze Logs <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Mockup */}
      <Card className="border-white/5 bg-card/50">
        <CardHeader>
          <CardTitle className="font-mono-tech">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-destructive' : 'bg-primary'}`} />
                  <div>
                    <p className="text-sm font-medium">Scan #{2048 + i}</p>
                    <p className="text-xs text-muted-foreground">Target: production-api-v{i}</p>
                  </div>
                </div>
                <div className="text-xs font-mono-tech text-muted-foreground">
                  {i * 15} mins ago
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
