import {FetchQueryExtras} from "@/types/queries.ts";
import {BaseError, BaseQueryParams} from "@/types/responses.ts";
import {useQuery} from "@tanstack/react-query";
import {AxiosError} from "axios";
import api from "@/lib/axios.ts";

const useGetData = <T, TParam = BaseQueryParams>(
    key: string[],
    url: string,
    extras?: FetchQueryExtras<T, TParam>,
) => {
    const { options, params, normalizer } = extras || {};

    const {
        enabled = true,
        initialData = undefined,
        retry = 1, // Default retry behavior
    } = options || {};

    const { data, error, isError, isFetching, isLoading, refetch } = useQuery<
        T,
        AxiosError<BaseError>
    >({
        queryKey: key,
        queryFn: async () => {
            const response = await api.get<T>(url, { params: params });
            return normalizer ? normalizer(response.data) : response.data;
        },
        enabled,
        initialData,
        retry,
        refetchOnWindowFocus: false, // Often a good default for data that doesn't need constant refreshing
    });

    return {
        data,
        error,
        isError,
        isFetching,
        isLoading,
        refetch,
    };
};

export default useGetData;
