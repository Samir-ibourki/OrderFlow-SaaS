import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginApi, registerApi, profileApi } from "../api/authApi.js";
import { useLocation } from "wouter";
import { useAuthStore } from "../store/authStore.js";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { user, token, isAuthenticated, setAuth, logoutStore, setUser } = useAuthStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["auth-profile"],
    queryFn: profileApi,
    retry: false,
    enabled: !!token && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });


  useEffect(() => {
    if (data) {
      setUser(data);
    }
    if (isError) {
      console.error("Auth Error:", error);
      logoutStore();
    }
  }, [data, isError, error, setUser, logoutStore]);

  const loginMutation = useMutation({
    mutationFn: (credentials) => loginApi(credentials),
    onSuccess: (res) => {
      const { user: userData, token: userToken } = res.data.data;
      setAuth(userData, userToken);
      queryClient.setQueryData(["auth-profile"], userData);
      setLocation("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData) => registerApi(userData),
    onSuccess: (res) => {
      const { user: userData, token: userToken } = res.data.data;
      setAuth(userData, userToken);
      queryClient.setQueryData(["auth-profile"], userData);
      setLocation("/");
    },
  });

  const logout = () => {
    logoutStore();
    queryClient.clear();
    setLocation("/login");
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isError,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
