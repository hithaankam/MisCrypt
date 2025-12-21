import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Lock, Terminal, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import heroBg from "@assets/generated_images/dark_cybersecurity_abstract_network_background.png";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono-tech text-primary">
            <Shield className="h-6 w-6" />
            <span className="font-bold tracking-tighter text-xl">SEC_AUDIT</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <Link href="/dashboard">
              <Button size="sm" className="font-mono-tech bg-primary text-primary-foreground hover:bg-primary/90">
                Launch Platform
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background z-0" />
        
        <div className="container relative z-10 mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono-tech mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            SYSTEM V.1.0 ONLINE
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Advanced Security <br/> Audit Platform
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Perform comprehensive cryptographic misconfiguration scanning and TLS auditing with enterprise-grade precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base font-mono-tech bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(38,217,124,0.3)] transition-all">
                <Terminal className="mr-2 h-4 w-4" />
                Initialize Scan
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-card/30 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-card p-8 hover:border-primary/50 transition-colors duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Terminal className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                  <Terminal className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-mono-tech">Crypto Scanner</h3>
                <p className="text-muted-foreground mb-6">
                  Analyze source code for weak algorithms, hardcoded keys, and insecure implementations across Python, Java, and JavaScript.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Detects MD5/SHA1 usage</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Identifies hardcoded secrets</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Maps to OWASP Top 10</li>
                </ul>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-card p-8 hover:border-blue-500/50 transition-colors duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Lock className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 border border-blue-500/20">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-mono-tech">TLS Auditor</h3>
                <p className="text-muted-foreground mb-6">
                  Comprehensive assessment of Transport Layer Security configurations, certificate chains, and cipher suites.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500" /> Protocol version checking</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500" /> Cipher strength analysis</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500" /> Certificate validity check</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/20 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-mono-tech text-muted-foreground">
            <Shield className="h-5 w-5" />
            <span className="font-bold">SEC_AUDIT PLATFORM</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Security Audit Platform. Educational Purposes Only.
          </div>
        </div>
      </footer>
    </div>
  );
}
