import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Toaster} from "sonner";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import UserPage from "@/pages/User/UserPage.tsx";
import ContactPage from "@/pages/Contact/ContactPage.tsx";
import LayoutWithSidebar from "@/components/layouts/LayoutWithSidebar";
import LoginPage from "@/pages/Login/LoginPage.tsx";
import {RedirectIfAuthenticated} from "@/components/layouts/ProtectedRoute";
import RolePage from "@/pages/Role/RolePage.tsx";
import RoleDetailPage from "@/pages/Role/RoleDetailPage.tsx";
import MainContentLayout from '@/components/layouts/MainContentLayout';
import PermissionsPage from "@/pages/Permissions/PermissionsPage.tsx";
import RoleCreatePage from "@/features/roles/RoleCreate";
import CategoryPage from "@/pages/Category/CategoryPage.tsx";

const queryClient = new QueryClient();
const router = createBrowserRouter([
    {
        // This is your authenticated route branch.
        // LayoutWithSidebar provides ProtectedRoute and SidebarProvider.
        // It renders <App />, which then renders its own <Outlet /> for MainContentLayout.
        element: <LayoutWithSidebar />,
        // errorElement: <ErrorPage />, // Optional error page
        children: [
            {
                // This wraps all routes that will use the MainContentLayout
                // and thus the PageHeaderContext.
                element: <MainContentLayout />,
                children: [
                    // --- Authenticated App Routes (with dynamic PageHeader) ---
                    {
                        index: true, // This makes ContactPage the default route within the authenticated section
                        element: <ContactPage />,
                    },
                    {
                        path: "Users",
                        element: <UserPage />,
                    },
                    {
                        path: "Roles",
                        children: [
                            {
                                index: true,
                                element: <RolePage />,
                            },
                            {
                                path: "create",
                                element: <RoleCreatePage />,
                            },
                            {
                                path: ":id",
                                element: <RoleDetailPage />,
                            },
                            {
                                path: ":id/edit", // You might use this or handle edit state within :id
                                element: <RoleDetailPage />,
                            },
                        ],
                    },
                    {
                        path: "Permissions",
                        element: <PermissionsPage />,
                    },
                    {
                        path: "Categories",
                        element: <CategoryPage />,
                    },
                    {
                        path: "Contacts",
                        element: <ContactPage />,
                    },
                ],
            },
        ],
    },
    // --- Public Routes (no sidebar, no PageHeaderContext) ---
    {
        path: '/', // This handles your public routes (like login)
        element: <RedirectIfAuthenticated />,
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            // Add more public routes here that should redirect if logged in
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient} >
            <RouterProvider router={router} />
            <Toaster />
    </QueryClientProvider>
  </StrictMode>,
)
