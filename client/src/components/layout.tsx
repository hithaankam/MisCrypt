import { Link, useLocation } from "wouter";
import { Shield, Lock, FileText, Activity, LayoutDashboard, Menu, X, Terminal, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isLanding = location === "/";

  if (isLanding) {
    return <div className="min-h-screen bg-background text-foreground flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar/50 backdrop-blur-xl fixed h-full z-30">
        <div className="p-6 border-b border-border/50">
          <Link href="/">
            <div className="flex items-center gap-2 font-mono-tech text-primary cursor-pointer hover:opacity-80 transition-opacity">
              <Shield className="h-6 w-6" />
              <span className="font-bold tracking-tighter text-lg">SEC_AUDIT</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location === "/dashboard"} />
          <SidebarItem href="/crypto-scan" icon={Terminal} label="Crypto Scanner" active={location === "/crypto-scan"} />
          <SidebarItem href="/tls-scan" icon={Lock} label="TLS Auditor" active={location === "/tls-scan"} />
          <SidebarItem href="/results" icon={Activity} label="Scan Results" active={location === "/results"} />
          <SidebarItem href="/reports" icon={FileText} label="Reports" active={location === "/reports"} />
          <div className="pt-4 mt-4 border-t border-border/50">
            <SidebarItem href="/about" icon={Info} label="About" active={location === "/about"} />
          </div>
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-sm">
            <p className="text-xs text-primary font-mono-tech mb-1">SYSTEM STATUS</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Online & Secure</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-40 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono-tech text-primary">
          <Shield className="h-5 w-5" />
          <span className="font-bold">SEC_AUDIT</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-sidebar border-r border-border p-0 w-64">
             <div className="p-6 border-b border-border/50">
              <div className="flex items-center gap-2 font-mono-tech text-primary">
                <Shield className="h-6 w-6" />
                <span className="font-bold tracking-tighter text-lg">SEC_AUDIT</span>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location === "/dashboard"} />
              <SidebarItem href="/crypto-scan" icon={Terminal} label="Crypto Scanner" active={location === "/crypto-scan"} />
              <SidebarItem href="/tls-scan" icon={Lock} label="TLS Auditor" active={location === "/tls-scan"} />
              <SidebarItem href="/results" icon={Activity} label="Scan Results" active={location === "/results"} />
              <SidebarItem href="/reports" icon={FileText} label="Reports" active={location === "/reports"} />
              <SidebarItem href="/about" icon={Info} label="About" active={location === "/about"} />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6 min-h-screen overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 cursor-pointer group",
        active 
          ? "bg-primary/10 text-primary border-l-2 border-primary pl-[10px]" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent"
      )}>
        <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        <span className="font-mono-tech">{label}</span>
      </div>
    </Link>
  );
}
