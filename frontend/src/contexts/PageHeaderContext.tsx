import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Define the types for breadcrumbs
interface Breadcrumb {
    label: string;
    href?: string;
}

// Define the interface for the PageHeader configuration
interface PageHeaderConfig {
    title?: string;
    breadcrumbs?: Breadcrumb[];
    showBackButton?: boolean;
    onBack?: () => void;
    actions?: ReactNode; // To pass buttons or other elements
}

// Define the type for the context's value
interface PageHeaderContextType {
    setHeaderConfig: (config: PageHeaderConfig | null) => void;
    config: PageHeaderConfig | null; // This will be consumed by MainContentLayout
}

// Create the context with an initial undefined value
const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

// ----------------------------------------------------------------------
// PageHeaderProvider Component
// This component will wrap the part of your application where headers are managed.
// It holds the state for the current PageHeaderConfig.
// ----------------------------------------------------------------------
export const PageHeaderProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<PageHeaderConfig | null>(null);

    // Memoize setHeaderConfig to prevent unnecessary re-renders of consumers
    const setHeaderConfig = useCallback((newConfig: PageHeaderConfig | null) => {
        setConfig(newConfig);
    }, []);

    const value = { config, setHeaderConfig };

    return (
        <PageHeaderContext.Provider value={value}>
            {children}
        </PageHeaderContext.Provider>
    );
};

// ----------------------------------------------------------------------
// usePageHeader Hook
// This hook is used by individual page components to declare their header configuration.
// It automatically sets the config when the component mounts and clears it when it unmounts.
// ----------------------------------------------------------------------
export const usePageHeader = (config: PageHeaderConfig) => {
    const context = useContext(PageHeaderContext);
    if (context === undefined) {
        throw new Error('usePageHeader must be used within a PageHeaderProvider');
    }

    // Set the header config when the component mounts or config changes
    // and clean up when the component unmounts
    useEffect(() => {
        context.setHeaderConfig(config);
        return () => {
            // Clean up by setting config to null when component unmounts
            // This prevents headers from lingering if the component unmounts
            // and no other component immediately replaces its header.
            context.setHeaderConfig(null);
        };
    }, [config, context]); // Depend on config to update when it changes, and context for stability
};

// ----------------------------------------------------------------------
// usePageHeaderConfig Hook
// This hook is primarily used by MainContentLayout to read the current header configuration
// from the context and render the PageHeader accordingly.
// ----------------------------------------------------------------------
export const usePageHeaderConfig = () => {
    const context = useContext(PageHeaderContext);
    if (context === undefined) {
        throw new Error('usePageHeaderConfig must be used within a PageHeaderProvider');
    }
    return context.config;
};
