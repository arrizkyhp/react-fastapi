import {ENDPOINTS} from "@/constants/apiUrl.ts";
import useGetData from "@/hooks/useGetData.ts";
import {BaseQueryParams, ListResponse} from "@/types/responses.ts";
import {Category} from "@/types/category";

const useGetAllCategories = () => {
    const {
        CATEGORIES: {
            GET: GET_CATEGORIES
        }
    } = ENDPOINTS;

    const {
        data: categoriesData,
        isLoading: isLoadingAllCategories,
        isError: isErrorAllCategories,
        error: errorAllCategories,
    } = useGetData<ListResponse<Category>, BaseQueryParams>(
        ['allCategories'],
        GET_CATEGORIES,
        {
            params: {
                page: 1,
                get_all: true,
            },
        },
    );

    return {
        categoriesData,
        isLoadingAllCategories,
        isErrorAllCategories,
        errorAllCategories
    }
}

export default useGetAllCategories;
