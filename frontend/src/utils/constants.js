export const ORDER_COLUMNS = [
  { id: "new_order",            label: "New Orders",       color: "bg-blue-500" },
  { id: "pending_confirmation", label: "Pending",          color: "bg-yellow-500" },
  { id: "ready_to_ship",        label: "Ready to Ship",    color: "bg-purple-500" },
  { id: "in_delivery",          label: "In Delivery",      color: "bg-orange-500" },
  { id: "delivered",            label: "Delivered",        color: "bg-green-500" },
  { id: "cancelled",            label: "Cancelled",        color: "bg-red-500" },
];

export const SOURCE_COLORS = {
  whatsapp: "bg-green-100 text-green-800",
  instagram: "bg-pink-100 text-pink-800",
  tiktok: "bg-black text-white text-[10px]",
  facebook: "bg-blue-100 text-blue-800",
  website: "bg-indigo-100 text-indigo-800",
  manual: "bg-gray-100 text-gray-800",
};

export const SHIPMENT_STATUS_COLORS = {
  pending:    "bg-yellow-100 text-yellow-800",
  assigned:   "bg-blue-100 text-blue-800",
  in_transit: "bg-orange-100 text-orange-800",
  delivered:  "bg-green-100 text-green-800",
  returned:   "bg-red-100 text-red-800",
};

export const ORDER_SOURCES = ["whatsapp", "instagram", "tiktok", "facebook", "website", "manual"];

export const CHART_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#06b6d4"];
