import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import useGetData from "@/hooks/useGetData.ts";
import {BaseQueryParams} from "@/types/responses.ts";
import {Role} from "@/types/role.ts";
import {usePatchData} from "@/hooks/useMutateData.ts";
import {toast} from "sonner";
import {Check, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {usePageHeader} from "@/contexts/PageHeaderContext.tsx";
import {groupPermissionsByCategory} from "@/helpers/groupPermissionsByCategory.ts";
import useGetAllPermission from "@/features/roles/hooks/useGetAllPermission.ts";

const useRoleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        permissionsData,
        isLoadingAllPermissions,
        isErrorAllPermissions,
        errorAllPermissions,
    } = useGetAllPermission();

    const initialIsEditingFromPath = location.pathname.endsWith('/edit');

    const [isEditing, setIsEditing] = useState(initialIsEditingFromPath);
    const [roleName, setRoleName] = useState("");
    const [roleDescription, setRoleDescription] = useState("");
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

    const { data: roleData, isLoading, isError, error, refetch: refetchRoleData } = useGetData< // Add refetch
        Role,
        BaseQueryParams
    >(
        ["role", String(id)],
        `/app/roles/${id}`,
        {
            options: {
                enabled: !!id,
            },
        },
    );

    // useCallback to memoize the reset function
    const resetFormFields = useCallback(() => {
        if (roleData) {
            setRoleName(roleData.name);
            setRoleDescription(roleData.description || "");
            setSelectedPermissionIds(roleData.permissions?.map(p => p.id) || []);
        }
    }, [roleData]); // Dependency on roleData

    // Effect to initialize form fields when roleData loads
    useEffect(() => {
        if (roleData) {
            // Only set form fields if not already editing, or if editing and it's the initial load
            // Otherwise, keep the user's edits.
            if (!isEditing || (isEditing && initialIsEditingFromPath)) {
                resetFormFields();
            }
        }
    }, [roleData, isEditing, initialIsEditingFromPath, resetFormFields]);

    // Effect to react to URL path changes (e.g., manual URL change, back/forward button)
    useEffect(() => {
        const currentIsEditingFromPath = location.pathname.endsWith('/edit');
        if (currentIsEditingFromPath !== isEditing) {
            setIsEditing(currentIsEditingFromPath);
            // If we're transitioning from edit to view, reset the form fields to original data
            if (!currentIsEditingFromPath) {
                resetFormFields();
            }
        }
    }, [location.pathname, isEditing, resetFormFields]); // Added resetFormFields to dependencies

    const {
        mutate: updateRoleMutation,
        isLoading: isUpdating
    } = usePatchData(
        ['updateRole', String(id)],
        `/app/roles/${id}`,
        {
            options: {
                onSuccess: () => {
                    toast('Role updated successfully!', {
                        position: 'top-center',
                        icon: <Check />
                    });
                    refetchRoleData(); // Refetch to ensure latest data is displayed
                    navigate(`/roles/${id}`, { replace: true }); // Navigate back to detail view
                },
                onError: (err: any) => {
                    const errorMessage = err?.response?.data?.message || err?.message || "Unknown error";
                    toast(`Update failed: ${errorMessage}`, {
                        position: 'top-center',
                        icon: <Check className="text-red-500" />
                    });
                },
            },
        },
    );



    const handleBack = () => {
        if (isEditing) {
            if (window.confirm("You have unsaved changes. Are you sure you want to go back?")) {
                navigate(`/roles/${id}`, { replace: true }); // Go to detail view URL
                // The useEffect for location.pathname will handle setIsEditing(false)
                // and resetFormFields for you.
            }
        } else {
            navigate("/roles");
        }
    }

    const handleEditClick = () => {
        // Navigate to the edit URL. The useEffect will pick this up and set isEditing to true.
        navigate(`/roles/${id}/edit`);
    }

    const handleCancelClick = () => {
        if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
            // Navigate back to the detail URL. The useEffect will pick this up.
            navigate(`/roles/${id}`, { replace: true });
        }
    }

    const handleSaveClick = useCallback(() => {
        const payload = {
            name: roleName,
            description: roleDescription,
            permission_ids: selectedPermissionIds,
        };
        updateRoleMutation(payload);
    }, [roleName, roleDescription, selectedPermissionIds, updateRoleMutation])

    const togglePermission = (permissionId: number) => {
        setSelectedPermissionIds(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const userHeaderConfig = useMemo(() => ({
        title: isEditing ? "Edit Role" : "Role Detail",
        breadcrumbs: [{ label: "Role", href: "/roles" },
            { label: isEditing ? "Edit" : "Detail" },],
        onBack: handleBack,
        actions: (
            isEditing ? (
                <>
                    <Button
                        variant="outline"
                        onClick={handleCancelClick}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleSaveClick}
                        disabled={isUpdating}
                    >
                        {isUpdating && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                    </Button>
                </>
            ) : (
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleEditClick}>
                    Edit Role
                </Button>
            )
        )
    }), [handleSaveClick, isEditing]);

    usePageHeader(userHeaderConfig);

    const allGroupedPermissions = permissionsData?.items ? groupPermissionsByCategory(permissionsData.items) : {};

    return {
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
    }
}

export default useRoleDetail;
