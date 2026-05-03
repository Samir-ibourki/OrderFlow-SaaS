import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getShipmentsApi, createShipmentApi, getCouriersApi, getShippingStatsApi } from "../api/shippingApi.js";
import { toast } from "sonner";

export const useShipping = () => {
  const queryClient = useQueryClient();

  const shipmentsQuery = useQuery({
    queryKey: ["shipments"],
    queryFn: getShipmentsApi,
  });

  const couriersQuery = useQuery({
    queryKey: ["couriers"],
    queryFn: getCouriersApi,
  });

  const statsQuery = useQuery({
    queryKey: ["shipping-stats"],
    queryFn: getShippingStatsApi,
  });

  const createShipmentMutation = useMutation({
    mutationFn: createShipmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["shipping-stats"] });
      toast.success("Expédition créée avec succès");
    },
  });

  return {
    shipments: shipmentsQuery.data || [],
    couriers: couriersQuery.data || [],
    stats: statsQuery.data,
    isLoading: shipmentsQuery.isLoading || couriersQuery.isLoading || statsQuery.isLoading,
    createShipment: createShipmentMutation.mutateAsync,
    isCreating: createShipmentMutation.isPending,
  };
};
