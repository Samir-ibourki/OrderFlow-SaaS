import { useShipping } from "@/hooks/useShipping.js";
import { SHIPMENT_STATUS_COLORS } from "@/utils/constants.js";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Truck, Loader2 } from "lucide-react";

import CreateShipmentDialog from "@/components/shipping/CreateShipmentDialog.jsx";
import ShippingStatsCards from "@/components/shipping/ShippingStatsCards.jsx";

export default function ShippingPage() {
  const { shipments, isLoading, stats, couriers, createShipment } = useShipping();

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-6 border-b flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipping</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage deliveries and couriers.</p>
        </div>
        <CreateShipmentDialog onCreate={createShipment} couriers={couriers} />
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <ShippingStatsCards stats={stats} />

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !shipments || shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Truck className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">No shipments yet</p>
            <p className="text-sm">Create your first shipment to get started.</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Est. Delivery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.orderNumber}</TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{s.customerName}</div>
                        <div className="text-xs text-muted-foreground">{s.customerCity || "—"}</div>
                      </TableCell>
                      <TableCell>{s.courier || "—"}</TableCell>
                      <TableCell className="font-mono text-xs">{s.trackingNumber || "—"}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={SHIPMENT_STATUS_COLORS[s.status] || "bg-gray-100 text-gray-800"}
                        >
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
