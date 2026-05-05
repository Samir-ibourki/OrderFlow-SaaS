import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersApi, updateOrderStatusApi, createOrderApi, parseOrderApi, deleteOrderApi } from "../api/ordersApi.js";
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Commande créée avec succès");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrderApi,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previousOrders = queryClient.getQueryData(["orders"]);
      queryClient.setQueryData(["orders"], (old) => {
        if (!old) return [];
        return old.filter((order) => order.id.toString() !== id.toString());
      });
      return { previousOrders };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["orders"], context.previousOrders);
      toast.error("Échec de la suppression");
    },
    onSuccess: () => {
      toast.success("Commande supprimée");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatusApi,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previousOrders = queryClient.getQueryData(["orders"]);
      queryClient.setQueryData(["orders"], (old) => {
        if (!old) return [];
        return old.map((order) =>
          order.id.toString() === id.toString() ? { ...order, status } : order
        );
      });
      return { previousOrders };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["orders"], context.previousOrders);
      toast.error("Échec de la mise à jour du statut");
    },
    onSuccess: () => {
      toast.success("Statut de la commande mis à jour");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
    deleteOrder: deleteOrderMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending,
    isParsing: parseOrderMutation.isPending,
    isCreating: createOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
  };
};
