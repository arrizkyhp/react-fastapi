import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea";
import useRoleCreate from "./RoleCreate.hooks.tsx";

const RoleCreate = () => {
    const {
        isLoadingAllPermissions,
        isErrorAllPermissions,
        errorAllPermissions,
        roleName,
        setRoleName,
        roleDescription,
        setRoleDescription,
        allGroupedPermissions,
        selectedPermissionIds,
        togglePermission
    } = useRoleCreate();

    if (isLoadingAllPermissions) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading permissions...</span>
            </div>
        );
    }

    if (isErrorAllPermissions) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load permissions:{" "}
                    {errorAllPermissions?.response?.data?.message ||
                        errorAllPermissions?.message ||
                        "Unknown error"}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex flex-col mt-2 w-full">
            <Card className="mt-6">
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                        <div>
                            <Label htmlFor="roleName">Name<span className="text-red-500">*</span></Label>
                            <Input
                                id="roleName"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                className="mt-1"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="roleDescription">Description</Label>
                            <Textarea
                                id="roleDescription"
                                value={roleDescription}
                                onChange={(e) => setRoleDescription(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="flex mt-6">
                        <h2 className="text-lg font-medium">Permissions</h2>
                    </div>

                    <div className="flex flex-col gap-6 pt-4">
                        {Object.keys(allGroupedPermissions).length > 0 ? (
                            Object.keys(allGroupedPermissions)
                                .sort()
                                .map((categoryName) => (
                                    <div key={categoryName}>
                                        <h4 className="text-lg font-semibold mb-3">{categoryName}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
                                            {allGroupedPermissions[categoryName].map((permission) => (
                                                <div
                                                    key={permission.id}
                                                    className="flex items-start space-x-2"
                                                >
                                                    <Checkbox
                                                        id={`permission-${permission.id}`}
                                                        checked={selectedPermissionIds.includes(
                                                            permission.id,
                                                        )}
                                                        onCheckedChange={() =>
                                                            togglePermission(permission.id)
                                                        }
                                                    />
                                                    <div className="grid gap-1.5">
                                                        <Label
                                                            htmlFor={`permission-${permission.id}`}
                                                            className="font-medium"
                                                        >
                                                            {permission.name}
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            {permission.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p className="text-gray-500 pl-4">No permissions available.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoleCreate;
