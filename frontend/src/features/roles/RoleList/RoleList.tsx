import DataTable from "@/components/ui/DataTable";
import { columns } from "./RoleList.constants";
import {EyeIcon, PencilIcon, TrashIcon} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import useRoleList from "@/features/roles/RoleList/RoleList.hooks.tsx";

const RoleList = () => {
    const {
        data,
        onDetailClick,
        onEditClick,
        onDeleteClick,
        onPageChange,
        onPageSizeChange,
        isAlertDialogOpen,
        setIsAlertDialogOpen,
        deleteRoleName,
        handleDeleteRoleConfirm,
    } = useRoleList()

    return (
        <div className="mt-2">
            <DataTable
                columns={columns}
                data={data?.items || []}
                rowActions={[
                    {
                        label: "View Details",
                        color: "secondary",
                        icon: <EyeIcon className="h-4 w-4" />,
                        onClick: (role) => onDetailClick(role),
                        tooltip: "View",
                    },
                    {
                        label: "Edit",
                        color: "default",
                        icon: <PencilIcon className="h-4 w-4" />,
                        onClick: (role) => onEditClick(role),
                        tooltip: "Edit",
                    },
                    {
                        label: "Delete",
                        color: "destructive",
                        icon: <TrashIcon className="h-4 w-4 text-destructive" />,
                        onClick: (role) => onDeleteClick(role),
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
                        <AlertDialogTitle>Are you sure you want to delete this contact?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the contact:
                            <br/>
                            <span className="font-bold"> {deleteRoleName}</span>.
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
        </div>
    )
}

export default RoleList
