import { Role } from "@/types/role.ts";

export interface User {
    id: number;
    username: string;
    email: string;
    roles: Role[]
}
