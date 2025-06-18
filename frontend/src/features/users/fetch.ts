import { User } from "@/types/user";
import {BaseQueryParams, PaginationInfo} from "@/types/responses.ts";
import api from "@/lib/axios.ts";

interface FetchUsersResponse {
    items: User[];
    pagination: PaginationInfo;
}

// --- GET Contacts ---
export const fetchUsers = async (params: BaseQueryParams): Promise<FetchUsersResponse> => {
    const response = await api.get<FetchUsersResponse>('/app/users', {
        params: {
            page: params.page,
            per_page: params.per_page || 10,
        },
    });
    return response.data;
};

