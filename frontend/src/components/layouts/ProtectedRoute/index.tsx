import { Navigate } from 'react-router-dom';
import {useAuthStatus} from "@/hooks/useAuthStatus.ts";
import {ReactNode} from "react";

// This component will check if the user is authenticated
// If they are, it renders the child routes (Outlet)
// If not, it redirects to the login page
export const ProtectedRoute = (props: { children: ReactNode }) => {
    const {children} = props;
    const accessToken = localStorage.getItem('access_token');
    const { isLoading } = useAuthStatus();

    // Show loading state while checking authentication
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>;
    }

    // If no token at all, redirect immediately
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to login if not authenticated
    // if (!data?.logged_in) {
    //     return <Navigate to="/login" replace />;
    // }

    // Render child routes if authenticated
    return (
        <>
            {children}
        </>
    );
};

// Redirect already authenticated users away from login page
export const RedirectIfAuthenticated = ({ children }: { children: ReactNode }) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
