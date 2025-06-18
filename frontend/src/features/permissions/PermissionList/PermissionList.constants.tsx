import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {Category, Permission} from "@/types/permission.ts";
import { Users} from "lucide-react";

export const columns: ColumnDef<Permission>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.getValue("name");
            return (
                <p className="font-fira-code">{name as string}</p>
            )
        }
    },
    {
        accessorKey: "category",
        header: () => <div className="text-left">Category</div>,
        cell: ({ row }) => {
            const category = row.getValue("category") as Category;
            return <p className="font-fira-code">{category.name || ""}</p>;
        }
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "usage",
        header: "Usage",
        cell: ({ row }) => {
            const usage = row.getValue("usage");
            return (
                <div className="flex items-center gap-1">
                    <span>{usage as number}</span>
                    <Users className="h-4 w-4 text-gray-500" /> {/* Add User Icon */}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            const isActive = status === "active";

            return (
                <Badge variant={isActive ? "default" : "destructive"} className="capitalize">
                    {status as string}
                </Badge>
            );
        },
    },
]
