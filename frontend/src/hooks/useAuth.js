import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginApi, registerApi, profileApi } from "../api/authApi.js";
import { useLocation } from "wouter";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["auth-profile"],
    queryFn: profileApi,
    retry: false,
    enabled: !!localStorage.getItem("token"), 
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      const token = res.data.data.token;
      localStorage.setItem("token", token);
      queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
      setLocation("/"); 
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (res) => {
      const token = res.data.data.token;
      localStorage.setItem("token", token);
      queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
      setLocation("/");
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.setQueryData(["auth-profile"], null);
    setLocation("/login");
  };

  return {
    user,
    isLoading,
    isError,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
