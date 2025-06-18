import {ENDPOINTS} from "@/constants/apiUrl.ts";
import useGetData from "@/hooks/useGetData.ts";
import {BaseQueryParams, ListResponse} from "@/types/responses.ts";
import { User } from "@/types/user";

const useGetAllUser = () => {
    const {
        USERS: {
            GET: GET_USERS
        }
    } = ENDPOINTS;

    const {
        data: usersData,
        isLoading: isLoadingAllUser,
        isError: isErrorAllUser,
        error: errorAllUser,
    } = useGetData<ListResponse<User>, BaseQueryParams>(
        ['allUser'],
        GET_USERS,
        {
            params: {
                page: 1,
                get_all: true,
            },
        },
    );

    return {
        usersData,
        isLoadingAllUser,
        isErrorAllUser,
        errorAllUser
    }
}

export default useGetAllUser;
