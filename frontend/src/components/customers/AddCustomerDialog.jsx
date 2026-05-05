import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { Plus } from "lucide-react";

export default function AddCustomerDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const { toast } = useToast();

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try {
      await onCreate(form);
      setOpen(false);
      setForm({ name: "", phone: "", city: "" });
      toast({ title: "Customer added!" });
    } catch (err) {
      toast({ 
        title: "Failed", 
        description: err.response?.data?.message || err.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Customer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Customer</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input 
              placeholder="Ahmed Benali" 
              value={form.name} 
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>Phone *</Label>
            <Input 
              placeholder="+212 6..." 
              value={form.phone} 
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input 
              placeholder="Casablanca" 
              value={form.city} 
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} 
            />
          </div>
          <Button type="submit" className="w-full">Add Customer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
