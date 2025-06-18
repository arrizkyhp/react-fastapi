import useQueryParams from "@/hooks/useQueryParams.ts";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import useGetData from "@/hooks/useGetData.ts";
import {BaseQueryParams, ListResponse} from "@/types/responses.ts";
import {Role} from "@/types/role.ts";
import createQueryParams from "@/utils/createQueryParams.ts";
import {useDeleteData} from "@/hooks/useMutateData.ts";
import {toast} from "sonner";
import {Check} from "lucide-react";
import { ENDPOINTS } from "@/constants/apiUrl";

const useRoleList = () => {
    const { queryParams, onPageChange, onPageSizeChange } = useQueryParams()
    const navigate = useNavigate();
    const {
        ROLES: {
            GET: GET_ROLES,
            GET_BY_ID: GET_ROLE_BY_ID,
        }
    } = ENDPOINTS

    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [deleteRoleId, setDeleteRoleId] = useState('');
    const [deleteRoleName, setDeleteRoleName] = useState('');

    const { data } = useGetData<ListResponse<Role>, BaseQueryParams>(
        ['roleList', createQueryParams(queryParams || {})],
        GET_ROLES,
        {
            params: {
                page: queryParams.page,
                per_page: queryParams.per_page || 10,
            },
        }
    )

    const {
        mutate: deleteRoleMutation,
    } = useDeleteData<void, number>(
        ['deleteContact', String(deleteRoleId)],
        GET_ROLE_BY_ID(deleteRoleId),
        {
            options: {
                onSuccess: () => {
                    toast('Role deleted successfully', {
                        position: 'top-center',
                        icon: <Check />
                    });
                    setIsAlertDialogOpen(false);
                    setDeleteRoleId('');
                    setDeleteRoleName('');

                },
                onError: (err) => toast(`Delete failed: ${err.message}`),
            },
        },
        ['roleList'], // Invalidate the contacts list after deletion
    );

    const onDetailClick = (role: Role) => {
        navigate(`${role.id}`);
    }

    const onEditClick = (role: Role) => {
        navigate(`${role.id}/edit`); // Navigate directly to the edit URL
    }

    const onDeleteClick = (role: Role) => {
        setDeleteRoleId(String(role.id))
        setIsAlertDialogOpen(true)
        setDeleteRoleName(role.name)
    }

    const handleDeleteRoleConfirm = () => {
        if (deleteRoleId !== '') {
            deleteRoleMutation(Number(deleteRoleId));
        }
    }

    return {
        data,
        onDetailClick,
        onEditClick,
        onDeleteClick,
        onPageChange,
        onPageSizeChange,
        isAlertDialogOpen,
        setIsAlertDialogOpen,
        deleteRoleName,
        handleDeleteRoleConfirm,
    }
}

export default useRoleList
