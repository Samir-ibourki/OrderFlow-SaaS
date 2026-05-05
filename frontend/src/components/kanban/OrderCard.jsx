import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { ORDER_COLUMNS, SOURCE_COLORS } from "@/utils/constants.js";
import { Phone, MapPin, Package, Trash2 } from "lucide-react";

export default function OrderCard({ order, onStatusChange, onDelete, isUpdating, provided, isDragging }) {
  const sourceClass = SOURCE_COLORS[order.source] || "bg-gray-100 text-gray-800";
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="mb-3"
      style={provided.draggableProps.style}
    >
      <Card className={`shadow-sm border ${isDragging ? "border-primary/50 shadow-md" : "border-transparent"} cursor-grab active:cursor-grabbing bg-card`}>
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">{order.orderNumber}</span>
            <div className="flex items-center gap-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceClass}`}>{order.source}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(order.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
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
              <SelectTrigger className="h-6 text-xs w-auto px-2 border-0 shadow-none bg-muted hover:bg-muted/80">
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
    </div>
  );
}
