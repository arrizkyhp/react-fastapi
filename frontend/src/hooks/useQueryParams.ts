import {useEffect, useState} from "react";
import createQueryParams from "@/utils/createQueryParams.ts";
import {BaseQueryParams} from "@/types/responses.ts";
import {useLocation, useNavigate } from "react-router-dom";
import {SortDirection, SortFieldAudit} from "@/types/sort.ts";
import {formatDateForAPI} from "@/lib/date-utils.ts";

interface QueryParamsOptions {
    replaceURL?: boolean;
}

const useQueryParams = (options?: QueryParamsOptions,) => {
    const { replaceURL = true } = options || {};
    const navigate = useNavigate();
    const location = useLocation();

    const getInitialParams = (): BaseQueryParams => {
        const searchParams = new URLSearchParams(location.search);
        return {
            search: searchParams.get('search') || '',
            page: parseInt(searchParams.get('page') || '1'),
            per_page: parseInt(searchParams.get('per_page') || '10'),
            sort_by: searchParams.get('sort_by') as SortFieldAudit || undefined,
            sort_order: searchParams.get('sort_order') as SortDirection || undefined,
            user_id: searchParams.get('user_id') || undefined,
            action_type: searchParams.get('action_type') || undefined,
            from_date: searchParams.get("from_date") || undefined,
            to_date: searchParams.get("to_date") || undefined,
        };
    };

    const [queryParams, setQueryParams] = useState<BaseQueryParams>(getInitialParams);

    useEffect(() => {
        const newParams = getInitialParams();
        setQueryParams(newParams);
    }, [location.search]);

    const updateQueryParams = (queryObject: Partial<BaseQueryParams>) => {
        const newQueryParams = { ...queryParams, ...queryObject } as BaseQueryParams;
        setQueryParams(newQueryParams);

        if (replaceURL) {
            // Clean undefined values before creating query string
            const cleanParams = Object.fromEntries(
                Object.entries(newQueryParams).filter(([_, value]) =>
                    value !== undefined && value !== null && value !== ''
                )
            );
            navigate(`${location.pathname}?${createQueryParams(cleanParams)}`, {
                replace: true,
                state: location.state
            });
        }
    };

    const onPageChange = (val: number) => {
        updateQueryParams({ ...queryParams, page: val });
    };

    const onPageSizeChange = (val: number) => {
        updateQueryParams({ ...queryParams, per_page: val, page: 1 });
    };

    const onSearchChange = (val: string) => {
        updateQueryParams({ ...queryParams, search: val, page: 1 });
    };

    const onSortChange = (field: SortFieldAudit, direction: SortDirection) => {
        updateQueryParams({
            ...queryParams,
            page: 1,
            sort_by: field,
            sort_order: direction,
        });
    };

    const onActionTypeChange = (actionType: string) => {
        updateQueryParams({
            action_type: actionType === "all" ? undefined : actionType,
            page: 1,
        });
    };

    const onUserChange = (user: string) => {
        updateQueryParams({
            user_id: user === "all" ? undefined : user,
            page: 1,
        })
    }

    const onFromDateChange = (date: Date | undefined) => {
        // Format the date to YYYY-MM-DD for the API
        const formattedDate = formatDateForAPI(date);
        updateQueryParams({
            from_date: formattedDate,
            page: 1, // Reset page when date filter changes
        });
    };

    const onToDateChange = (date: Date | undefined) => {
        // Format the date to YYYY-MM-DD for the API
        const formattedDate = formatDateForAPI(date);
        updateQueryParams({
            to_date: formattedDate,
            page: 1,
        });
    };

    const clearAllParams = () => {
        const clearedParams: BaseQueryParams = {
            search: undefined,
            page: 1,
            per_page: 10,
            sort_by: 'timestamp',
            sort_order: 'desc',
            user_id: undefined,
            action_type: undefined,
            from_date: undefined,
            to_date: undefined,
        };
        updateQueryParams(clearedParams);
    };

    return {
        onPageChange,
        onPageSizeChange,
        onSearchChange,
        onActionTypeChange,
        queryParams,
        onSortChange,
        onUserChange,
        onToDateChange,
        onFromDateChange,
        clearAllParams
    }
}

export default useQueryParams;
