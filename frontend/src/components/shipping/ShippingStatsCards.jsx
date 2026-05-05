import { Card, CardContent } from "@/components/ui/card.jsx";

export default function ShippingStatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold">{stats.total || 0}</p>
          <p className="text-sm text-muted-foreground mt-1">Total</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.delivered || 0}</p>
          <p className="text-sm text-muted-foreground mt-1">Delivered</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-orange-500">{stats.inTransit || 0}</p>
          <p className="text-sm text-muted-foreground mt-1">In Transit</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-primary">{stats.successRate || 0}%</p>
          <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
        </CardContent>
      </Card>
    </div>
  );
}
