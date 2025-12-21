import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Reports() {
  const reports = [
    { id: "REP-2024-001", date: "2024-10-24", target: "auth-service", type: "Crypto Scan", status: "Critical" },
    { id: "REP-2024-002", date: "2024-10-23", target: "api.example.com", type: "TLS Audit", status: "Pass" },
    { id: "REP-2024-003", date: "2024-10-20", target: "payment-gateway", type: "Crypto Scan", status: "Medium" },
    { id: "REP-2024-004", date: "2024-10-18", target: "legacy-app", type: "Full Audit", status: "High" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono-tech tracking-tight">Audit Reports</h1>
          <p className="text-muted-foreground">Archive of past security assessments.</p>
        </div>
        <div className="w-full md:w-64 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports..." className="pl-9 bg-card border-white/10" />
        </div>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="bg-card/50 border-white/5 hover:border-primary/20 transition-all">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center text-muted-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold font-mono-tech">{report.id}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {report.date}</span>
                    <span>•</span>
                    <span>{report.target}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  report.status === 'Critical' ? 'bg-destructive/20 text-destructive' :
                  report.status === 'High' ? 'bg-orange-500/20 text-orange-500' :
                  report.status === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-green-500/20 text-green-500'
                }`}>
                  {report.status}
                </div>
                <div className="text-sm text-muted-foreground font-mono">{report.type}</div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
