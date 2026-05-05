import { useAnalytics } from "@/hooks/useAnalytics.js";
import { CHART_COLORS } from "@/utils/constants.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Loader2, TrendingUp, ShoppingBag, Users, Percent } from "lucide-react";

import StatCard from "@/components/analytics/StatCard.jsx";

export default function AnalyticsPage() {
  const { summary, topProducts, byStatus, byChannel, isLoading } = useAnalytics();

  const statusData = byStatus.map((s) => ({ 
    name: s.status.replace(/_/g, " "), 
    value: Number(s.count) 
  }));
  
  const channelData = byChannel.map((c) => ({ 
    name: c.channel, 
    orders: Number(c.orders), 
    revenue: Number(c.revenue) 
  }));

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-6 border-b shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor your sales performance.</p>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                icon={ShoppingBag} 
                label="Orders Today" 
                value={summary?.ordersToday ?? 0} 
                sub={`${summary?.ordersThisMonth ?? 0} this month`} 
              />
              <StatCard 
                icon={TrendingUp} 
                label="Revenue Today" 
                value={`${(summary?.revenueToday ?? 0).toFixed(0)} MAD`} 
                sub={`${(summary?.revenueThisMonth ?? 0).toFixed(0)} MAD this month`} 
              />
              <StatCard 
                icon={Users} 
                label="Total Customers" 
                value={summary?.totalCustomers ?? 0} 
              />
              <StatCard 
                icon={Percent} 
                label="Conversion Rate" 
                value={`${summary?.conversionRate ?? 0}%`} 
                sub={`${summary?.deliveredCount ?? 0} delivered`} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Orders by Channel</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={channelData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle className="text-base">Orders by Status</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie 
                        data={statusData} 
                        cx="50%" cy="50%" 
                        outerRadius={80} 
                        dataKey="value" 
                        label={({ name, value }) => `${name}: ${value}`} 
                        labelLine={false}
                      >
                        {statusData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-base">Top Products</CardTitle></CardHeader>
              <CardContent>
                {topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No product data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium text-sm">{p.product}</p>
                          <p className="text-xs text-muted-foreground">{p.totalOrders} orders</p>
                        </div>
                        <span className="font-semibold text-sm">
                          {Number(p.totalRevenue).toFixed(0)} MAD
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
