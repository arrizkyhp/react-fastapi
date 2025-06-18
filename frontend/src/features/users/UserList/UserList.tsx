import DataTable from "@/components/ui/DataTable";
import {columns} from "@/features/users/UserList/UserList.constants.tsx";
import { UserCog} from "lucide-react";
import {Sheet, SheetContent} from "@/components/ui/sheet.tsx";
import UserAssignForm from "@/features/users/UserAssignForm.tsx";
import useUserList from "@/features/users/UserList/UserList.hooks.ts";

const UserList = () => {
    const {
        isSheetOpen,
        setIsSheetOpen,
        selectedUser,
        data,
        handleOpenAssignUser,
        onPageChange,
        onPageSizeChange
    } = useUserList()

    return (
        <>
            <div className="flex flex-col gap-4">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent>
                        <UserAssignForm
                            userData={selectedUser}
                            setIsSheetOpen={setIsSheetOpen}
                        />
                    </SheetContent>

                </Sheet>
            </div>

            <DataTable
                columns={columns}
                data={data?.items || []}
                rowActions={[
                    {
                        label: "Assign Role", // Added label
                        color: "secondary",
                        icon: <UserCog className="h-4 w-4" />,
                        onClick: (user) => handleOpenAssignUser(user),
                        tooltip: "Assign Role",
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
        </>
    )
}

export default UserList
