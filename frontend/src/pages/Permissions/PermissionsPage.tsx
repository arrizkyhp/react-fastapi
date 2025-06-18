import PermissionList from "@/features/permissions/PermissionList";
import {useMemo, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {usePageHeader} from "@/contexts/PageHeaderContext.tsx";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import PermissionAuditTrail from "@/features/permissions/PermissionAuditTrail";

const PermissionsPage = () => {
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

    const userHeaderConfig = useMemo(() => ({
        title: "Permissions",
        breadcrumbs: [{ label: "Permissions" }],
        showBackButton: false,
        actions: (
            <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsCreateSheetOpen(true)}
            >
                Create Permission
            </Button>
        )
    }), []);

    usePageHeader(userHeaderConfig);

  return (
    <div className="flex flex-col gap-4 mt-2">
        <Card className="mt-4">
            <Tabs defaultValue="list">
                <CardHeader>
                    <TabsList>
                        <TabsTrigger value="list">Permission List</TabsTrigger>
                        <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                    </TabsList>
                </CardHeader>

                <CardContent>
                    <TabsContent value="list">
                        <PermissionList
                            isCreateSheetOpen={isCreateSheetOpen}
                            setIsCreateSheetOpen={setIsCreateSheetOpen}
                        />
                    </TabsContent>
                    <TabsContent value="audit">
                        <PermissionAuditTrail />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>

    </div>
  );
};

export default PermissionsPage;
