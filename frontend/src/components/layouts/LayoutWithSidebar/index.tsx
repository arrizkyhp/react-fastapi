import App from "@/App.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {ProtectedRoute} from "@/components/layouts/ProtectedRoute"; // Adjust path as necessary

const LayoutWithSidebar = () => {
    return (
        <ProtectedRoute>
            <SidebarProvider>
                <App />
            </SidebarProvider>
        </ProtectedRoute>
    );
};

export default LayoutWithSidebar;
