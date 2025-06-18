import {User} from "@/types/user.ts";
import useGetData from "./useGetData";
import {ENDPOINTS} from "@/constants/apiUrl.ts";
import {usePostData} from "@/hooks/useMutateData.ts";

interface AuthStatusResponse {
  logged_in: boolean;
  user?: User;
}

export const useAuthStatus = () => {
  const {
    AUTHENTICATION: {
      STATUS
    }
  } = ENDPOINTS;

  const {
    data: authStatusData,
    refetch,
    isLoading
  } = useGetData<AuthStatusResponse>(
      ["authStatus"],
      STATUS,
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
      "http://127.0.0.1:5000/api/auth/logout", // Logout endpoint
      {
        options: {
          onSuccess: () => {
            refetch();
          },
        },
      }
  );

  const loggedIn = authStatusData?.logged_in || false;
  const user = authStatusData?.user || null;

  return {
    data: authStatusData,
    loggedIn,
    user,
    isLoading,
    logout,
    isLoggingOut,
  };
};
