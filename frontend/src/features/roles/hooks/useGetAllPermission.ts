import useGetData from "@/hooks/useGetData";
import { Permission } from "@/types/permission";
import {BaseQueryParams, ListResponse} from "@/types/responses";
import {ENDPOINTS} from "@/constants/apiUrl.ts";

const useGetAllPermission = () => {
    const {
        PERMISSIONS: {
            GET: GET_PERMISSIONS,
        },
    } = ENDPOINTS;

    const {
        data: permissionsData,
        isLoading: isLoadingAllPermissions,
        isError: isErrorAllPermissions,
        error: errorAllPermissions,
    } = useGetData<ListResponse<Permission>, BaseQueryParams>(
        ['allPermission'],
        GET_PERMISSIONS,
        {
            params: {
                page: 1,
                get_all: true,
                include_category_details: true,
            },
        },
    );

    return {
        permissionsData,
        isLoadingAllPermissions,
        isErrorAllPermissions,
        errorAllPermissions,
    };
}

export default useGetAllPermission;
