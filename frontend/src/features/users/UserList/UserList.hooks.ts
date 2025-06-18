import useQueryParams from "@/hooks/useQueryParams.ts";
import {useMemo, useState} from "react";
import {User} from "@/types/user.ts";
import {ENDPOINTS} from "@/constants/apiUrl.ts";
import {usePageHeader} from "@/contexts/PageHeaderContext.tsx";
import useGetData from "@/hooks/useGetData.ts";
import {FetchUsersResponse} from "@/features/users/UserList/UserList.types.ts";
import {BaseQueryParams} from "@/types/responses.ts";
import createQueryParams from "@/utils/createQueryParams.ts";

const useUserList = () => {
    const { queryParams, onPageChange, onPageSizeChange } = useQueryParams()
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>({
        id: 0,
        username: '',
        email: '',
        roles: [],
    });
    const { USERS: { GET } } = ENDPOINTS

    const userHeaderConfig = useMemo(() => ({
        title: "User List",
        breadcrumbs: [{ label: "User List" }],
        showBackButton: false,
    }), []);

    usePageHeader(userHeaderConfig);

    const { data } = useGetData<FetchUsersResponse, BaseQueryParams>(
        ['userList', createQueryParams(queryParams || {})],
        GET,
        {
            params: {
                page: queryParams.page,
                per_page: queryParams.per_page || 10,
            },
        }
    )

    const handleOpenAssignUser = (user: User) => {
        setIsSheetOpen(true);
        setSelectedUser(user);
    }


    return {
        isSheetOpen,
        setIsSheetOpen,
        selectedUser,
        data,
        handleOpenAssignUser,
        onPageChange,
        onPageSizeChange
    }
}

export default useUserList
