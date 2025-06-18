import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {Loader2} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {Input} from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea";
import useRoleDetail from "@/features/roles/RoleDetail/RoleDetail.hooks.tsx";

const RoleDetail = () => {
   const {
       id,
       isLoading,
       isLoadingAllPermissions,
       isError,
       isErrorAllPermissions,
       roleData,
       error,
       errorAllPermissions,
       isEditing,
       roleName,
       setRoleName,
       roleDescription,
       setRoleDescription,
       allGroupedPermissions,
       selectedPermissionIds,
       togglePermission
   } = useRoleDetail()

    console.log({allGroupedPermissions})

    if (!id) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>No role ID provided in the URL.</AlertDescription>
            </Alert>
        );
    }

    if (isLoading || isLoadingAllPermissions) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading role details...</span>
            </div>
        );
    }

    if (isError || isErrorAllPermissions) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load data: {error?.response?.data?.message || error?.message || errorAllPermissions?.response?.data?.message || errorAllPermissions?.message || "Unknown error"}
                </AlertDescription>
            </Alert>
        );
    }

    if (!roleData) {
        return (
            <Alert variant="default">
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>Role with ID "{id}" not found.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex flex-col mt-2 w-full">
            <Card className="mt-6">
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                            {isEditing ? (
                                <Input
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-base font-medium">{roleName}</p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                            {isEditing ? (
                                <Textarea
                                    value={roleDescription}
                                    onChange={(e) => setRoleDescription(e.target.value)}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="text-base font-medium">{roleDescription}</p>
                            )}
                        </div>
                    </div>
                    <Separator />
                    <div className="flex mt-6">
                        <h2 className="text-lg font-medium">Permissions</h2>
                    </div>

                    <div className="flex flex-col gap-6 pt-4">
                        {Object.keys(allGroupedPermissions).length > 0 ? (
                            Object.keys(allGroupedPermissions).sort().map((categoryName) => (
                                <div key={categoryName}>
                                    <h4 className="text-lg font-semibold mb-3">{categoryName}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
                                        {allGroupedPermissions[categoryName].map((permission) => (
                                            <div key={permission.id} className="flex items-start space-x-2">
                                                <Checkbox
                                                    id={`permission-${permission.id}`}
                                                    checked={selectedPermissionIds.includes(permission.id)}
                                                    onCheckedChange={() => isEditing && togglePermission(permission.id)}
                                                    disabled={!isEditing}
                                                />
                                                <div className="grid gap-1.5">
                                                    <Label htmlFor={`permission-${permission.id}`} className="font-medium">
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
    )
}

export default RoleDetail;
