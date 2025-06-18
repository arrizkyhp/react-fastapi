import {UseMutationOptions, UseQueryOptions} from "@tanstack/react-query";
import {BaseError} from "@/types/responses.ts";
import {AxiosRequestHeaders} from "axios";

export type FetchQueryExtras<T, TParam> = {
    options?: Omit<
        UseQueryOptions<T, BaseError, T, any[]>,
        "queryKey" | "queryFn"
    > & {
        enabled?: boolean;
        initialData?: T;
        retry?: number | boolean;
        // You can add more specific overrides here if needed
    };
    params?: TParam;
    normalizer?: (data: any) => T; // Optional function to transform data
};

export type MutateQueryExtras<TData, TVariables = unknown> = {
    options?: Omit<
        UseMutationOptions<TData, BaseError, TVariables>,
        'mutationFn'
    > & {
        headers?: AxiosRequestHeaders; // Allow custom headers for the specific mutation
        onUploadProgress?: (progressEvent: any) => void;
    };
    normalizer?: (data: any) => TData; // Optional function to transform data
};
