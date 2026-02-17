import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";

import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import CryptoScanner from "@/pages/crypto-scanner";
import TLSScanner from "@/pages/tls-auditor";
import RuntimeAnalyzer from "@/pages/runtime-analyzer";
import Results from "@/pages/results";
import Reports from "@/pages/reports";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/crypto-scan" component={CryptoScanner} />
        <Route path="/tls-scan" component={TLSScanner} />
        <Route path="/runtime-scan" component={RuntimeAnalyzer} />
        <Route path="/results" component={Results} />
        <Route path="/reports" component={Reports} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
