import {ColumnDef} from "@tanstack/react-table";
import {Contact} from "@/types/contact.ts";

export const columns: ColumnDef<Contact>[] = [
    {
        accessorKey: "firstName",
        header: "First Name"
    },
    {
        accessorKey: "lastName",
        header: "Last Name",

    },
    {
        accessorKey: "email",
        header: () => <div className="text-center">Email</div>,
    }
]
