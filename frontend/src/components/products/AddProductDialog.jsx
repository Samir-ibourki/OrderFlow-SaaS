import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Plus } from "lucide-react";

export default function AddProductDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", stock: 0 });
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try {
      await onCreate({ 
        ...form, 
        price: Number(form.price), 
        stock: Number(form.stock) 
      }); 
      setOpen(false);
      setForm({ name: "", price: "", stock: 0 });
    } catch (err) {
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input 
              placeholder="Djellaba Bleu" 
              value={form.name} 
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input 
                type="number" 
                min={0} 
                value={form.stock} 
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} 
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Add Product</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
