import { useState } from "react";
import { useShipping } from "@/hooks/useShipping.js";
import { SHIPMENT_STATUS_COLORS } from "@/utils/constants.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { Plus, Truck, Loader2 } from "lucide-react";


function CreateShipmentDialog({ onCreate, couriers }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ 
    orderNumber: "", customerName: "", customerPhone: "", 
    customerCity: "", courier: couriers[0] || "Amana" 
  });
  const { toast } = useToast();

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try {
      await onCreate(form);
      setOpen(false);
      setForm({ orderNumber: "", customerName: "", customerPhone: "", customerCity: "", courier: couriers[0] || "Amana" });
      toast({ title: "Shipment created!" });
    } catch (err) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />New Shipment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Shipment</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Order Number *</Label>
            <Input 
              placeholder="ORD-..." 
              value={form.orderNumber} 
              onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))} 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input 
                placeholder="Ahmed Benali" 
                value={form.customerName} 
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input 
                placeholder="+212 6..." 
                value={form.customerPhone} 
                onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))} 
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>City</Label>
              <Input 
                placeholder="Casablanca" 
                value={form.customerCity} 
                onChange={(e) => setForm((f) => ({ ...f, customerCity: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label>Courier</Label>
              <Select value={form.courier} onValueChange={(v) => setForm((f) => ({ ...f, courier: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {couriers.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">Create Shipment</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
        {stats && (
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
        )}

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

