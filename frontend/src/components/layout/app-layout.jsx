import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Package, Settings, KanbanSquare, Bell, Truck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils.js";
import { useAuth } from "@/hooks/useAuth.js";
import { NAV_ITEMS } from "../../utils/constants";



export function AppLayout({ children }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const displayName = user?.fullName || user?.name;
  const initials = displayName
    ? displayName.split(" ").length >= 2
      ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : displayName.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <aside className="w-64 border-r bg-card flex flex-col hidden md:flex shrink-0">
        <div className="h-14 flex items-center px-6 border-b shrink-0">
          <div className="w-6 h-6 rounded-md bg-primary mr-3 flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-xs leading-none">O</span>
          </div>
          <span className="font-bold text-lg tracking-tight">OrderFlow</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                location === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <span className="text-secondary-foreground font-medium text-xs">{initials}</span>
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName || "Merchant"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
            </div>
            <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b bg-card flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="md:hidden font-bold text-lg">OrderFlow</div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
