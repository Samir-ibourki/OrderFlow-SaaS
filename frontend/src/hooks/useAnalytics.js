import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsApi, getSalesOverviewApi, getTopProductsApi } from "../api/analyticsApi.js";

export const useAnalytics = (range = "7d") => {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStatsApi,
  });

  const salesQuery = useQuery({
    queryKey: ["sales-overview", range],
    queryFn: () => getSalesOverviewApi(range),
  });

  const topProductsQuery = useQuery({
    queryKey: ["top-products"],
    queryFn: getTopProductsApi,
  });

  return {
    stats: dashboardQuery.data,
    salesData: salesQuery.data || [],
    topProducts: topProductsQuery.data || [],
    isLoading: dashboardQuery.isLoading || salesQuery.isLoading || topProductsQuery.isLoading,
  };
};
