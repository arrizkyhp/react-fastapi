export interface AuditTrailProps {
    title: string;
    entityType: string;
    searchPlaceholder?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export interface AuditTrailHooksProps {
    entityType: string;
}

export interface AuditTrailFilters {
    actionFilter: string;
    userFilter: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    searchQuery: string;
}

export interface AuditTrailState {
    filters: AuditTrailFilters;
    hasActiveFilters: boolean;
}

export const formatMonthDay = (date: Date | undefined): string => {
    if (!date) {
        return "";
    }
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};
