import { Permission } from "@/types/permission";
import { PaginationInfo } from "@/types/responses";

export interface PermissionResponse {
    items: Permission[];
    pagination: PaginationInfo
}
