import { useState, useEffect } from "react";
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
import { useOrders } from "@/hooks/useOrders.js";
import { ORDER_COLUMNS } from "@/utils/constants.js";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Loader2, ShoppingBag } from "lucide-react";

import OrderCard from "@/components/kanban/OrderCard.jsx";
import CaptureOrderDialog from "@/components/kanban/CaptureOrderDialog.jsx";
import StrictModeDroppable from "@/components/kanban/StrictModeDroppable.jsx";

export default function KanbanPage() {
  const [search, setSearch] = useState("");
  const { 
    orders, isLoading, updateStatus, isUpdating, 
    createOrder, parseOrder, isParsing, isCreating 
  } = useOrders();

  const [localOrders, setLocalOrders] = useState([]);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const filteredOrders = localOrders.filter(o => 
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.product.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = ORDER_COLUMNS.reduce((acc, col) => {
    acc[col.id] = filteredOrders.filter((o) => o.status === col.id);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const orderId = draggableId;
    const newStatus = destination.droppableId;

    setLocalOrders(prevOrders => 
      prevOrders.map(order => 
        order.id.toString() === orderId ? { ...order, status: newStatus } : order
      )
    );

    updateStatus({ id: orderId, status: newStatus });
  };

  const handleStatusChange = (id, status) => {
    setLocalOrders(prev => prev.map(o => o.id.toString() === id.toString() ? { ...o, status } : o));
    updateStatus({ id, status });
  };

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
      
      {isLoading && localOrders.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
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
                  
                  <StrictModeDroppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto pr-1 min-h-32 rounded-lg p-2 ${
                          snapshot.isDraggingOver ? "bg-muted/50" : "bg-muted/30"
                        }`}
                      >
                        {grouped[col.id].length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
                            <ShoppingBag className="w-6 h-6 mb-1 opacity-40" />
                            <span className="text-xs">No orders</span>
                          </div>
                        )}
                        
                        {grouped[col.id].map((order, index) => (
                          <Draggable 
                            key={order.id.toString()} 
                            draggableId={order.id.toString()} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <OrderCard
                                order={order}
                                provided={provided}
                                isDragging={snapshot.isDragging}
                                onStatusChange={handleStatusChange}
                                isUpdating={isUpdating}
                              />
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </StrictModeDroppable>
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
