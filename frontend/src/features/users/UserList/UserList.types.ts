import {PaginationInfo} from "@/types/responses.ts";
import { User } from "@/types/user";

export interface FetchUsersResponse {
    items: User[];
    pagination: PaginationInfo;
}
