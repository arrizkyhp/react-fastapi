import useGetData from "./useGetData";
import {ENDPOINTS} from "@/constants/apiUrl.ts";
import {usePostData} from "@/hooks/useMutateData.ts";


interface AuthStatusResponse {
  email: string
  username: string
  full_name: string
  is_active: boolean
  id: number
  created_at: string
  updated_at: string
}

export const useAuthStatus = () => {
  const {
    USERS: {
      ME
    },
    AUTHENTICATION: {
      LOGOUT
    }
  } = ENDPOINTS;

  const {
    data: authStatusData,
    refetch,
    isLoading
  } = useGetData<AuthStatusResponse>(
      ["authStatus"],
      ME,
      {
        options: {
          refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
          refetchOnWindowFocus: true, // When the window regains focus
        },
      },
  );

  const {
    mutate: logout,
    isLoading: isLoggingOut,
  } = usePostData(
      // Use `any` for response if not strictly typed, or create LogoutResponse
      ["logout"], // Key for the logout mutation
      LOGOUT, // Logout endpoint
      {
        options: {
          onSuccess: () => {
            refetch();
          },
        },
      },
      ['authStatus']
  );

  return {
    authStatusData,
    isLoading,
    logout,
    isLoggingOut,
  };
};
