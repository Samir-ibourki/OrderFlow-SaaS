import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { Plus, Search, Loader2, Users } from "lucide-react";

function AddCustomerDialog({ onCreate }) {
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

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const { customers, isLoading, createCustomer } = useCustomers();

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-6 border-b flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredCustomers.length} total customers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input 
              className="pl-8 w-48 h-8 text-sm" 
              placeholder="Search…" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <AddCustomerDialog onCreate={createCustomer} />
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Users className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">No customers yet</p>
            <p className="text-sm">Add your first customer or import from orders.</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{c.phone}</TableCell>
                      <TableCell>{c.city || "—"}</TableCell>
                      <TableCell className="text-right">{c.ordersCount ?? 0}</TableCell>
                      <TableCell className="text-right font-medium">
                        {Number(c.totalSpent ?? 0).toFixed(2)} MAD
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

