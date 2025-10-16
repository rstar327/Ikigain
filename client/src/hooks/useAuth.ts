import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user && !isError,
  };
}
