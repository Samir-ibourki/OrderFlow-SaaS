import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import NotFound from "@/pages/not-found.jsx";
import { AppLayout } from "@/components/layout/app-layout.jsx";
import KanbanPage from "@/pages/kanban.jsx";
import AnalyticsPage from "@/pages/analytics.jsx";
import CustomersPage from "@/pages/customers.jsx";
import ProductsPage from "@/pages/products.jsx";
import SettingsPage from "@/pages/settings.jsx";
import ShippingPage from "@/pages/shipping.jsx";
import LoginPage from "@/pages/login.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRouter() {

  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && location !== "/login") {
        setLocation("/login");
      } else if (isAuthenticated && location === "/login") {
        setLocation("/");
      }
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }


  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={KanbanPage} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route path="/customers" component={CustomersPage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/shipping" component={ShippingPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <ProtectedRouter />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
