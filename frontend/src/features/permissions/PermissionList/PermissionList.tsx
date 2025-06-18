import { useState } from "react";
import useGetData from "@/hooks/useGetData.ts";
import {BaseQueryParams} from "@/types/responses.ts";
import createQueryParams from "@/utils/createQueryParams.ts";
import {PermissionResponse} from "@/features/permissions/PermissionList/PermissionList.types.ts";
import useQueryParams from "@/hooks/useQueryParams.ts";
import { ENDPOINTS } from "@/constants/apiUrl";
import DataTable from "@/components/ui/DataTable";
import { columns } from "./PermissionList.constants";
import {Check, EyeIcon, PencilIcon, TrashIcon, X} from "lucide-react";
import {Permission} from "@/types/permission.ts";
import {Sheet, SheetContent} from "@/components/ui/sheet.tsx";
import PermissionDetail from "@/features/permissions/PermissionDetail";
import {Button} from "@/components/ui/button.tsx";
import PermissionForm from "@/features/permissions/PermissionForm";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {useDeleteData} from "@/hooks/useMutateData.ts";
import {toast} from "sonner";

interface PermissionDetailProps {
    isCreateSheetOpen: boolean
    setIsCreateSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PermissionList = (props: PermissionDetailProps) => {
    const { isCreateSheetOpen, setIsCreateSheetOpen } = props;

    const { queryParams, onPageChange, onPageSizeChange } = useQueryParams()
    const { PERMISSIONS: { GET, GET_BY_ID } } = ENDPOINTS

    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

    const [selectedPermissions, setSelectedPermissions] = useState<Permission>({
        id: 0,
        category: {
            id: 0,
            name: "",
            description: "",
        },
        category_id: 0,
        description: "",
        name: "",
        status: "",
        usage: 0,
        affected_roles: [],
    });

    const { data } = useGetData<PermissionResponse, BaseQueryParams>(
        ['permissionList', createQueryParams(queryParams || {})],
        GET,
        {
            params: {
                page: queryParams.page,
                per_page: queryParams.per_page || 10,
                status: queryParams.status,
                include_usage: queryParams.include_usage ?? true,
                include_category_details: true,
            },
        }
    )

    const {
        mutate: deletePermissionMutation,
    } = useDeleteData<void, number>(
        ['deleteContact', String(selectedPermissions.id)],
        GET_BY_ID(String(selectedPermissions.id)),
        {
            options: {
                onSuccess: () => {
                    toast('Permission deleted successfully', {
                        position: 'top-center',
                        icon: <Check />
                    });
                    setIsAlertDialogOpen(false);

                },
                onError: (err) => toast(`Delete failed: ${err.message}`, {
                    position: 'top-center',
                    icon: <X />
                }),
            },
        },
        ['permissionList'],
    );

    const handleDetailClick = (permission: Permission) => {
        setSelectedPermissions(permission)
        setIsDetailSheetOpen(true)
    }

    const handleEditClick = (permission: Permission) => {
        setSelectedPermissions(permission);
        setIsEditSheetOpen(true);
    };

    const handleDeleteClick = (permission: Permission) => {
        setSelectedPermissions(permission);
        setIsAlertDialogOpen(true);
    };

    const handleFormSuccess = () => {
        setIsEditSheetOpen(false);
        setIsCreateSheetOpen(false);
    };

    const handleDeleteRoleConfirm = () => {
        if (String(selectedPermissions.id) !== '') {
            deletePermissionMutation(Number(selectedPermissions.id));
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                    <SheetContent>
                        <PermissionDetail
                            data={selectedPermissions}
                        />

                    </SheetContent>
                </Sheet>

                <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                    <SheetContent>
                        <PermissionForm
                            mode="edit"
                            data={selectedPermissions}
                            onSuccess={handleFormSuccess}
                        />
                    </SheetContent>
                </Sheet>

                <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
                    <SheetContent>
                        <PermissionForm
                            mode="create"
                            data={selectedPermissions}
                            onSuccess={handleFormSuccess}
                        />
                    </SheetContent>
                </Sheet>
            </div>
            <DataTable
                columns={columns}
                data={data?.items || []}
                rowActions={[
                    {
                        label: "View Details",
                        color: "secondary",
                        icon: <EyeIcon className="h-4 w-4" />,
                        onClick: (permission) => handleDetailClick(permission),
                        tooltip: "View",
                    },
                    {
                        label: "Edit",
                        color: "default",
                        icon: <PencilIcon className="h-4 w-4" />,
                        onClick: (permission) => handleEditClick(permission),
                        tooltip: "Edit",
                    },
                    {
                        label: "Delete",
                        color: "destructive",
                        icon: <TrashIcon className="h-4 w-4 text-destructive" />,
                        onClick: (role) => handleDeleteClick(role),
                        tooltip: "Delete",
                    },
                ]}
                pagination={{
                    currentPage: data?.pagination.current_page || 1,
                    totalPages: data?.pagination.total_pages || 1,
                    totalItems: data?.pagination.total_items || 0,
                    onPageChange: onPageChange,
                    onPageSizeChange: onPageSizeChange
                }}
            />
            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this Permission?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the permission:
                            <br/>
                            <span className="font-bold"> {selectedPermissions.name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button variant="destructive" onClick={handleDeleteRoleConfirm} className="bg-red-600 hover:bg-red-700">Delete</Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default PermissionList;
