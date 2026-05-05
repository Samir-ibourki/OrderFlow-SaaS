import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { ORDER_SOURCES } from "@/utils/constants.js";
import { Plus, Sparkles, Loader2 } from "lucide-react";

export default function CaptureOrderDialog({ onCreate, onParse, isParsing, isCreating }) {
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
