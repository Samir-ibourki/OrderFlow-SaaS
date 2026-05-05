import { useProducts } from "@/hooks/useProducts.js";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Trash2, Loader2, Package } from "lucide-react";

import AddProductDialog from "@/components/products/AddProductDialog.jsx";

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
