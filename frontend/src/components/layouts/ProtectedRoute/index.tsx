import { Navigate, Outlet } from 'react-router-dom';
import {useAuthStatus} from "@/hooks/useAuthStatus.ts";
import {ReactNode} from "react";

// This component will check if the user is authenticated
// If they are, it renders the child routes (Outlet)
// If not, it redirects to the login page
export const ProtectedRoute = (props: { children: ReactNode }) => {
    const {children} = props;
    const { data, isLoading } = useAuthStatus();

    // Show loading state while checking authentication
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>;
    }

    // Redirect to login if not authenticated
    if (!data?.logged_in) {
        return <Navigate to="/login" replace />;
    }

    // Render child routes if authenticated
    return (
        <>
            {children}
        </>
    );
};

// Redirect already authenticated users away from login page
export const RedirectIfAuthenticated = () => {
    const { data, isLoading } = useAuthStatus();

    // Show loading state while checking authentication
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>;
    }

    // Redirect to dashboard if already authenticated
    if (data?.logged_in) {
        return <Navigate to="/" replace />;
    }

    // Render child routes if not authenticated
    return <Outlet />;
};
