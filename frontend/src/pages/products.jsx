import { useState } from "react";
import { useProducts } from "@/hooks/useProducts.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { Plus, Trash2, Loader2, Package } from "lucide-react";

function AddProductDialog({ onCreate }) {
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

export default function ProductsPage() {
  const { products, isLoading, createProduct, deleteProduct } = useProducts();

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-6 border-b flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products?.length || 0} products in catalog
          </p>
        </div>
        <AddProductDialog onCreate={createProduct} />
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Package className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">No products yet</p>
            <p className="text-sm">Add your first product to get started.</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-right font-mono">
                        {Number(p.price).toFixed(2)} MAD
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={p.stock > 5 ? "secondary" : p.stock > 0 ? "outline" : "destructive"} 
                          className="ml-auto"
                        >
                          {p.stock > 0 ? p.stock : "Out of stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-destructive" 
                          onClick={() => deleteProduct(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

