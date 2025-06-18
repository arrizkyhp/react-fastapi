import {ColumnDef} from "@tanstack/react-table";
import {User} from "@/types/user.ts";
import {Role} from "@/types/role.ts";
import {Badge} from "@/components/ui/badge.tsx";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "username",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: () => <div className="text-left">Email</div>,
    },
    {
        accessorKey: "roles",
        header: () => <div className="text-left">Roles</div>,
        cell: ({ row }) => {
            const roles: Role[] = row.getValue("roles");
            return (
                <div className="flex flex-wrap gap-1">
                    {roles.map((role: Role) => (
                        <Badge key={role.id} variant="secondary">
                            {role.name}
                        </Badge>
                    ))}
                </div>
            );
        },
    }
]
