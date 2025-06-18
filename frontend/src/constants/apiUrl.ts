export const ENDPOINTS = {
    AUTHENTICATION: {
        STATUS: '/auth/status',
        LOGIN: '/auth/login',
    },
    USERS: {
        GET: '/app/users',
    },
    ROLES: {
        GET: '/app/roles',
        GET_BY_ID: (id: string) => `/app/roles/${id}`,
    },
    PERMISSIONS: {
        GET: '/app/permissions',
        GET_BY_ID: (id: string) => `/app/permissions/${id}`,
        CREATE: '/app/permissions',
        UPDATE: (id: string) => `/app/permissions/${id}`,
    },
    CATEGORIES: {
        GET: '/app/categories',
        CREATE: '/app/categories',
        UPDATE: (id: string) => `/app/categories/${id}`,
    },
    CONTACTS: {
        GET: '/app/contacts',
        GET_BY_ID: (id: string) => `/app/contacts/${id}`,
        CREATE: '/app/contacts',
        UPDATE: (id: string) => `/app/contacts/${id}`,
        DELETE: (id: string) => `/app/contacts/${id}`,
    },
    AUDIT_TRAIL: {
        GET: '/app/audit-logs',
    }
}
