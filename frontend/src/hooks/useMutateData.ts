import {MutateQueryExtras} from "@/types/queries.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {BaseError} from "@/types/responses.ts";
import noop from "@/utils/noop.ts";
import api from "@/lib/axios.ts";

// --- Main useMutateData Hook ---
export const useMutateData = <TData = void, TVariables = unknown>(
    key: string[], // React Query mutation key
    url: string, // API endpoint URL
    method: 'post' | 'put' | 'patch' | 'delete', // HTTP method
    extras?: MutateQueryExtras<TData, TVariables>,
    queryInvalidateKeys: string[] = [], // Optional: Keys to invalidate after success
) => {
    const queryClient = useQueryClient();
    const { normalizer, options } = extras || {};
    const {
        headers,
        onSuccess,
        onError,
        onMutate,
        onSettled = noop,
        onUploadProgress = noop,
        ...restOptions
    } = options || {};

    const {
        mutate,
        mutateAsync,
        data,
        isSuccess,
        isError,
        isPending: isLoading,
        error,
    } = useMutation<TData, AxiosError<BaseError>, TVariables>({
        mutationKey: key, // Use the provided key for the mutation
        mutationFn: async (body: TVariables) => {
            let response;
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...headers, // Merge custom headers
                },
                onUploadProgress, // Pass upload progress handler to axios
            };

            // Perform the Axios request based on the method
            switch (method) {
                case 'post':
                    response = await api.post<TData>(url, body, config);
                    break;
                case 'put':
                    response = await api.put<TData>(url, body, config);
                    break;
                case 'patch':
                    response = await api.patch<TData>(url, body, config);
                    break;
                case 'delete':
                    // For DELETE, body might be optional or just a single ID
                    // Axios delete method takes data as the second argument if needed,
                    // otherwise it's just the URL.
                    // Assuming `body` here could be a config object or simply `undefined` for typical DELETE.
                    // If you always send a body for DELETE, adjust this.
                    // For simplicity, typically DELETE doesn't send a body in most REST APIs.
                    // If TVariables is just an ID for delete, it's not passed as body to axios.delete directly
                    // We'll adjust the specific delete hook to handle this.
                    response = await api.delete<TData>(url, config);
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }

            // Apply normalizer if provided
            return normalizer ? normalizer(response.data) : response.data;
        },
        onSuccess: (data, variables, context) => {
            // Invalidate relevant queries after a successful mutation
            if (queryInvalidateKeys.length > 0) {
                queryClient.invalidateQueries({ queryKey: queryInvalidateKeys });
            }
            onSuccess?.(data, variables, context); // Call original onSuccess if provided
        },
        onError: onError,
        onMutate: onMutate,
        onSettled: onSettled,
        ...restOptions, // Spread any other react-query options
    });

    return {
        data,
        mutate,
        mutateAsync,
        isError,
        isLoading,
        isSuccess,
        error,
    };
};

// --- Specialized Hooks for specific HTTP methods ---

// Use for POST requests
export const usePostData = <TData = void, TVariables = unknown>(
    key: string[],
    url: string,
    extras?: MutateQueryExtras<TData, TVariables>,
    queryInvalidateKeys?: string[],
) =>
    useMutateData<TData, TVariables>(
        key,
        url,
        'post',
        extras,
        queryInvalidateKeys,
    );

// Use for PUT requests
export const usePutData = <TData = void, TVariables = unknown>(
    key: string[],
    url: string,
    extras?: MutateQueryExtras<TData, TVariables>,
    queryInvalidateKeys?: string[],
) =>
    useMutateData<TData, TVariables>(
        key,
        url,
        'put',
        extras,
        queryInvalidateKeys,
    );

// Use for PATCH requests
export const usePatchData = <TData = void, TVariables = unknown>(
    key: string[],
    url: string,
    extras?: MutateQueryExtras<TData, TVariables>,
    queryInvalidateKeys?: string[],
) =>
    useMutateData<TData, TVariables>(
        key,
        url,
        'patch',
        extras,
        queryInvalidateKeys,
    );

// Use for DELETE requests
// For DELETE, TVariables is often an ID, not a request body.
// The `body` parameter to mutateFn is usually the ID.
export const useDeleteData = <TData = void, TVariables = unknown>(
    key: string[],
    url: string,
    extras?: MutateQueryExtras<TData, TVariables>,
    queryInvalidateKeys?: string[],
) =>
    useMutateData<TData, TVariables>(
        key,
        url,
        'delete',
        extras,
        queryInvalidateKeys,
    );
