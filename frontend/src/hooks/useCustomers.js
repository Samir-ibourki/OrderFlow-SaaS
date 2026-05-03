import { useQuery } from "@tanstack/react-query";
import { getCustomersApi, getCustomerStatsApi } from "../api/customersApi.js";

export const useCustomers = () => {
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomersApi,
  });

  const statsQuery = useQuery({
    queryKey: ["customer-stats"],
    queryFn: getCustomerStatsApi,
  });

  return {
    customers: customersQuery.data || [],
    stats: statsQuery.data,
    isLoading: customersQuery.isLoading || statsQuery.isLoading,
  };
};
