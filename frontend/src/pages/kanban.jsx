import { useState } from "react";
import { useOrders } from "@/hooks/useOrders.js";
import { ORDER_COLUMNS, SOURCE_COLORS, ORDER_SOURCES } from "@/utils/constants.js";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { Plus, Sparkles, Loader2, Phone, MapPin, Package, ShoppingBag } from "lucide-react";


function OrderCard({ order, onStatusChange, isUpdating }) {
  const sourceClass = SOURCE_COLORS[order.source] || "bg-gray-100 text-gray-800";
  return (
    <Card className="mb-3 shadow-sm cursor-default hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">{order.orderNumber}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceClass}`}>{order.source}</span>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-2">
        <div className="font-semibold text-sm">{order.customerName}</div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="w-3 h-3" />{order.customerPhone}
        </div>
        {order.customerCity && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />{order.customerCity}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs">
          <Package className="w-3 h-3" />
          <span className="truncate">{order.product} × {order.quantity}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-sm">{Number(order.price).toFixed(2)} MAD</span>
          <Select 
            value={order.status} 
            onValueChange={(val) => onStatusChange(order.id, val)} 
            disabled={isUpdating}
          >
            <SelectTrigger className="h-6 text-xs w-auto px-2 border-0 shadow-none bg-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_COLUMNS.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function CaptureOrderDialog({ onCreate, onParse, isParsing, isCreating }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ 
    customerName: "", customerPhone: "", customerCity: "", 
    product: "", quantity: 1, price: "", source: "manual", notes: "" 
  });
  const { toast } = useToast();

  const handleAIParse = async () => {
    try {
      const data = await onParse(message);
      setForm((f) => ({ 
        ...f, 
        ...Object.fromEntries(Object.entries(data).filter(([, v]) => v != null && v !== "")) 
      }));
      toast({ title: "Message parsed", description: "Fields filled automatically — review before saving." });
    } catch (err) {
      toast({ title: "Parse failed", description: "Could not extract order data from message.", variant: "destructive" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreate({ ...form, quantity: Number(form.quantity), price: Number(form.price) });
      setOpen(false);
      setMessage("");
      setForm({ 
        customerName: "", customerPhone: "", customerCity: "", 
        product: "", quantity: 1, price: "", source: "manual", notes: "" 
      });
    } catch (err) {
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />New Order</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Capture Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <Label className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />AI Parse from WhatsApp/Instagram message
            </Label>
            <Textarea 
              placeholder="Paste customer message here... (Darija, French, Arabic, English)" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              rows={3} 
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={handleAIParse} 
              disabled={!message.trim() || isParsing}
            >
              {isParsing ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Parsing…</> : <><Sparkles className="w-3 h-3 mr-2" />Auto-fill with AI</>}
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Customer Name *</Label>
                <Input 
                  placeholder="Ahmed Benali" 
                  value={form.customerName} 
                  onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} 
                  required 
                />
              </div>
              <div className="space-y-1">
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
              <div className="space-y-1">
                <Label>City</Label>
                <Input 
                  placeholder="Casablanca" 
                  value={form.customerCity} 
                  onChange={(e) => setForm((f) => ({ ...f, customerCity: e.target.value }))} 
                />
              </div>
              <div className="space-y-1">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ORDER_SOURCES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Product *</Label>
              <Input 
                placeholder="Djellaba taille M..." 
                value={form.product} 
                onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))} 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Quantity</Label>
                <Input 
                  type="number" 
                  min={1} 
                  value={form.quantity} 
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} 
                />
              </div>
              <div className="space-y-1">
                <Label>Price (MAD) *</Label>
                <Input 
                  type="number" 
                  min={0} 
                  step="0.01" 
                  placeholder="150.00" 
                  value={form.price} 
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea 
                placeholder="Any special notes…" 
                value={form.notes} 
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} 
                rows={2} 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</> : "Create Order"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function KanbanPage() {
  const [search, setSearch] = useState("");
  const { 
    orders, isLoading, updateStatus, isUpdating, 
    createOrder, parseOrder, isParsing, isCreating 
  } = useOrders();

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.product.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = ORDER_COLUMNS.reduce((acc, col) => {
    acc[col.id] = filteredOrders.filter((o) => o.status === col.id);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-4 border-b flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Order Kanban</h1>
          <p className="text-xs text-muted-foreground">{filteredOrders.length} total orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Input 
            placeholder="Search orders…" 
            className="w-56 h-8 text-sm" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <CaptureOrderDialog 
            onCreate={createOrder} 
            onParse={parseOrder} 
            isParsing={isParsing} 
            isCreating={isCreating} 
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 p-6 h-full min-w-max">
            {ORDER_COLUMNS.map((col) => (
              <div key={col.id} className="w-72 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="font-semibold text-sm">{col.label}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {grouped[col.id].length}
                  </Badge>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 min-h-32 bg-muted/30 rounded-lg p-2">
                  {grouped[col.id].length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-20 text-muted-foreground">
                      <ShoppingBag className="w-6 h-6 mb-1 opacity-40" />
                      <span className="text-xs">No orders</span>
                    </div>
                  ) : (
                    grouped[col.id].map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={(id, status) => updateStatus({ id, status })}
                        isUpdating={isUpdating}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

