import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold font-mono-tech tracking-tight">About Security Audit Platform</h1>
        <p className="text-xl text-muted-foreground">
          A specialized tool for identifying cryptographic failures and transport layer security weaknesses.
        </p>
      </div>

      <Card className="border-white/10 bg-card">
        <CardHeader>
          <CardTitle className="font-mono-tech">Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Cryptographic failures remain the #2 vulnerability in the OWASP Top 10 (A02:2021). 
            Many applications unknowingly use broken algorithms, hardcoded secrets, or weak TLS configurations 
            that expose sensitive data to interception.
          </p>
          <p>
            This platform empowers developers to proactively scan their codebases and infrastructure 
            for these specific issues before they reach production.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-card">
          <CardHeader>
            <CardTitle className="font-mono-tech text-primary">OWASP Alignment</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li><strong className="text-white">A02:2021</strong> - Cryptographic Failures</li>
              <li><strong className="text-white">A07:2021</strong> - Identification and Authentication Failures</li>
              <li><strong className="text-white">A05:2021</strong> - Security Misconfiguration</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card">
          <CardHeader>
            <CardTitle className="font-mono-tech text-blue-500">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This tool is for educational and defensive purposes only. 
              Ensure you have authorization before scanning any external IP addresses or domains.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
