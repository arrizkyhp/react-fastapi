export interface AffectedRoles {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface Permission {
    id: number;
    category: Category;
    category_id: number;
    description: string;
    name: string;
    status?: string;
    usage?: number;
    affected_roles?: AffectedRoles[];
}
