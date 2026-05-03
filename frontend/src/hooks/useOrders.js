import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersApi, updateOrderStatusApi, createOrderApi, parseOrderApi } from "../api/ordersApi.js";
import { toast } from "sonner";

export const useOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersApi,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Commande créée avec succès");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Statut de la commande mis à jour");
    },
  });

  const parseOrderMutation = useMutation({
    mutationFn: parseOrderApi,
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    createOrder: createOrderMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    parseOrder: parseOrderMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending,
    isParsing: parseOrderMutation.isPending,
    isCreating: createOrderMutation.isPending,
  };
};

