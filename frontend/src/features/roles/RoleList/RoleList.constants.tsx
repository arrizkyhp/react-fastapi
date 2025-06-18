import { ColumnDef } from "@tanstack/react-table";
import { Role } from "@/types/role.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Permission } from "@/types/permission";

export const columns: ColumnDef<Role>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "permissions",
        header: () => <div className="text-left">Permissions</div>,
        cell: ({ row }) => {
            const permissions: Permission[] = row.getValue("permissions");
            return (
                <div className="flex flex-wrap gap-1">
                    {permissions.map((permission) => (
                        <Badge key={permission.id} variant="secondary">
                            {permission.name}
                        </Badge>
                    ))}
                </div>
            );
        },
    }
]
