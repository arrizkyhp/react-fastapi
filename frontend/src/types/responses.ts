export type BaseQueryParams = {
    search?: string;
    page?: number;
    size?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
    action_type?: string;
    from_date?: string;
    to_date?: string;
    status?: string;
    get_all?: boolean;
    include_usage?: boolean;
    include_category_details?: boolean;
    entity_type?: string;
    user_id?: string;
};

export interface PaginationInfo {
    current_page: number;
    has_next: boolean;
    has_prev: boolean;
    next_num: number | null;
    per_page: number;
    prev_num: number | null;
    total_items: number;
    total_pages: number;
}

export interface BaseError {
    message?: string;
    errors?: Record<string, string[]>;
    code?: string;
    status?: number;
}

export interface ListResponse<T> {
    items: T[];
    pagination: PaginationInfo;
}
