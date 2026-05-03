import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomersApi, getCustomerStatsApi, createCustomerApi } from "../api/customersApi.js";

export const useCustomers = () => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomersApi,
  });

  const createCustomerMutation = useMutation({
    mutationFn: createCustomerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const statsQuery = useQuery({
    queryKey: ["customer-stats"],
    queryFn: getCustomerStatsApi,
  });

  return {
    customers: customersQuery.data || [],
    stats: statsQuery.data,
    isLoading: customersQuery.isLoading || statsQuery.isLoading,
    createCustomer: createCustomerMutation.mutateAsync,
    isCreating: createCustomerMutation.isPending,
  };
};

