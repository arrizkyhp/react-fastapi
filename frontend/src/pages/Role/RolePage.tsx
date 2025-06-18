import RoleList from "@/features/roles/RoleList";
import {useMemo} from "react";
import {Button} from "@/components/ui/button.tsx";
import {usePageHeader} from "@/contexts/PageHeaderContext.tsx";
import {useNavigate} from "react-router-dom";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import RoleAuditTrail from "@/features/roles/RoleAuditTrail";

const RolePage = () => {
    const navigate = useNavigate();

    const handleCreateRole = () => {
        navigate("/roles/create");
    }

    const userHeaderConfig = useMemo(() => ({
        title: "Role",
        breadcrumbs: [{ label: "Role" }],
        showBackButton: false,
        actions: (
            <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleCreateRole}
            >
                Create Role
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
                            <TabsTrigger value="list">Role List</TabsTrigger>
                            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <CardContent>
                        <TabsContent value="list">
                            <RoleList />
                        </TabsContent>
                        <TabsContent value="audit">
                            <RoleAuditTrail />
                        </TabsContent>
                    </CardContent>
                </Tabs>
            </Card>
        </div>
    )
}

export default RolePage;
