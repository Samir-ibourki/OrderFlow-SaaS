import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { Plus } from "lucide-react";

export default function CreateShipmentDialog({ onCreate, couriers }) {
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
