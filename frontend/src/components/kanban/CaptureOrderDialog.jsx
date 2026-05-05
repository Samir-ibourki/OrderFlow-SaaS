import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { useProducts } from "@/hooks/useProducts.js";
import { ORDER_SOURCES } from "@/utils/constants.js";
import { Plus, Sparkles, Loader2 } from "lucide-react";

export default function CaptureOrderDialog({ onCreate, onParse, isParsing, isCreating }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [form, setForm] = useState({ 
    customerName: "", customerPhone: "", customerCity: "", 
    product: "", quantity: 1, price: "", source: "manual", notes: "" 
  });
  const { toast } = useToast();
  const { products } = useProducts();

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

  const handleProductSelect = (productId) => {
    const selected = products?.find((p) => p.id.toString() === productId);
    if (selected) {
      const up = Number(selected.price);
      setUnitPrice(up);
      setForm((f) => ({ 
        ...f, 
        product: selected.name, 
        price: (up * Number(f.quantity || 1)).toString() 
      }));
    }
  };

  const handleQuantityChange = (newQty) => {
    const qty = Number(newQty) || 1;
    setForm((f) => ({ 
      ...f, 
      quantity: newQty, 
      price: unitPrice > 0 ? (unitPrice * qty).toString() : f.price 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreate({ ...form, quantity: Number(form.quantity), price: Number(form.price) });
      setOpen(false);
      setMessage("");
      setUnitPrice(0);
      setForm({ 
        customerName: "", customerPhone: "", customerCity: "", 
        product: "", quantity: 1, price: "", source: "manual", notes: "" 
      });
    } catch (err) {
    }
  };


  const hasProducts = products && products.length > 0;

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
              <Sparkles className="w-4 h-4 text-primary" />AI Parse from Message
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
              {hasProducts ? (
                <Select onValueChange={handleProductSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product…" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem 
                        key={p.id} 
                        value={p.id.toString()} 
                        disabled={p.stock === 0}
                      >
                        {p.name} — {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="No products available. Add some in Products page." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none" disabled>No products available</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Quantity</Label>
                <Input 
                  type="number" 
                  min={1} 
                  value={form.quantity} 
                  onChange={(e) => handleQuantityChange(e.target.value)} 
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
                {unitPrice > 0 && Number(form.quantity) > 1 && (
                  <p className="text-xs text-muted-foreground">{unitPrice.toFixed(2)} MAD × {form.quantity} units</p>
                )}
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
