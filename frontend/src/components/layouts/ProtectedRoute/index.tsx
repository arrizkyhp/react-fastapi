import { Navigate } from 'react-router-dom';
import {useAuthStatus} from "@/hooks/useAuthStatus.ts";
import {ReactNode} from "react";

// This component will check if the user is authenticated
// If they are, it renders the child routes (Outlet)
// If not, it redirects to the login page
export const ProtectedRoute = (props: { children: ReactNode }) => {
    const {children} = props;
    const { authStatusData, isLoading } = useAuthStatus();

    // Show loading state while checking authentication
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>;
    }

    if (!authStatusData?.is_active) {
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
export const RedirectIfAuthenticated = ({ children }: { children: ReactNode }) => {
    const { authStatusData, isLoading } = useAuthStatus();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // If user is authenticated and active, redirect to home
    if (authStatusData?.is_active) {
        return <Navigate to="/" replace />;
    }

    // If not authenticated, show the children (login page)
    return <>{children}</>;
};
