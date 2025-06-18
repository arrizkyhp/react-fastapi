import { Label } from "@/components/ui/label";
import {SheetHeader} from "@/components/ui/sheet.tsx";
import {EyeIcon, ShieldUser } from "lucide-react"
import {Permission} from "@/types/permission.ts";
import {Badge} from "@/components/ui/badge.tsx";
import { Link } from "react-router-dom";

interface PermissionDetailProps {
    data: Permission
}

const PermissionDetail = (props: PermissionDetailProps) => {
    const {
        data
    } = props
    const {
        name,
        category,
        description,
        status,
        usage,
        affected_roles = []
    } = data || {}

    const { name: categoryName } = category || {}
    const isActive = status === "active";

    const statusRender = (
        <Badge variant={isActive ? "default" : "destructive"}>
            {status as string}
        </Badge>
    )
    return (
        <div>
            <SheetHeader>
               <div className="flex gap-2 items-center">
                   <EyeIcon className="h-5 w-5"/> Permission Details
               </div>
            </SheetHeader>
            <div className="flex flex-col px-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="roleName">Permission Name</Label>
                        <p className="text-sm font-fira-code">{name}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="roleName">Category</Label>
                        <p className="text-sm">{categoryName}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="roleName">Status</Label>
                        <p className="text-sm capitalize">{statusRender}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="roleName">Description</Label>
                        <p className="text-sm">{description}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="roleName">Usage ({usage} roles)</Label>
                        <div className="flex flex-col gap-2 mt-4">
                            {affected_roles.map((role) => (
                                <div key={role.id} className="flex gap-2 items-center justify-between w-full bg-neutral-100 py-2 px-3">
                                   <div className="flex gap-2 items-center">
                                       <ShieldUser className="h-4 w-4"/> <p className="text-sm">{role.name}</p>
                                   </div>
                                    <Link
                                        to={`/roles/${role.id}`}
                                        className="text-sm text-blue-600 hover:underline cursor-pointer" // Add styling to make it look like a link
                                    >
                                        View Role
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PermissionDetail;
