import { SidebarTrigger } from "@/components/ui/sidebar";
import PageHeader from "@/components/ui/PageHeader";
import {Link, Outlet } from "react-router-dom";
import {PageHeaderProvider, usePageHeaderConfig} from "@/contexts/PageHeaderContext";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";



const MainContentLayoutContent = () => { // <--- Remove children prop here
    const config = usePageHeaderConfig();
    const currentBreadcrumbs = config?.breadcrumbs || [];

    return (
        <>
            <header className="flex shrink-0 items-center mb-2 gap-2">
                <div className="flex items-center gap-2 h-full">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 !h-4" />
                    {config?.breadcrumbs && config.breadcrumbs.length > 0 && (
                        <Breadcrumb>
                            <BreadcrumbList>
                                {config.breadcrumbs.map((item, index) => (
                                    <Fragment key={item.label}>
                                        <BreadcrumbItem>
                                            {item.href ? (
                                                <BreadcrumbLink asChild>
                                                    <Link to={item.href}>{item.label}</Link>
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                            )}
                                        </BreadcrumbItem>
                                        {index < currentBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
                                    </Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    )}
                </div>
            </header>
            <div className="main-content-header">
                {config && (
                    <PageHeader
                        title={config.title || ''}
                        showBackButton={config.showBackButton}
                        onBack={config.onBack}
                        actions={config.actions}
                    />
                )}
            </div>
            <div className="main-content-body">
                <Outlet />
            </div>
        </>
    );
};

const MainContentLayout = () => {
    return (
        <PageHeaderProvider>
            <MainContentLayoutContent />
        </PageHeaderProvider>
    );
};

export default MainContentLayout;
