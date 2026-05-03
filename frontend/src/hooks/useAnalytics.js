import { useQuery } from "@tanstack/react-query";
import { getSummaryApi, getTopProductsApi, getByStatusApi, getByChannelApi } from "../api/analyticsApi.js";

export const useAnalytics = () => {
  const summaryQuery = useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: getSummaryApi,
  });

  const topProductsQuery = useQuery({
    queryKey: ["analytics", "topProducts"],
    queryFn: () => getTopProductsApi(5),
  });

  const byStatusQuery = useQuery({
    queryKey: ["analytics", "byStatus"],
    queryFn: getByStatusApi,
  });

  const byChannelQuery = useQuery({
    queryKey: ["analytics", "byChannel"],
    queryFn: getByChannelApi,
  });

  return {
    summary: summaryQuery.data,
    topProducts: topProductsQuery.data || [],
    byStatus: byStatusQuery.data || [],
    byChannel: byChannelQuery.data || [],
    isLoading: summaryQuery.isLoading || topProductsQuery.isLoading || byStatusQuery.isLoading || byChannelQuery.isLoading,
  };
};

