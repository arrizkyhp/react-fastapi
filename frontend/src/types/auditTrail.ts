import {User} from "@/types/user.ts";

export interface UserDetails extends Pick<User, "id" | "username"> {}

export interface AuditTrail {
    action_type: "DELETE" | "CREATE" | "UPDATE";
    description: string;
    entity_id: number;
    entity_type: string;
    field_name: string | null;
    id: number;
    ip_address: string;
    new_value: any;
    old_value: any;
    timestamp: string;
    user_agent: string;
    user_details: UserDetails;
    user_id: number;
}
