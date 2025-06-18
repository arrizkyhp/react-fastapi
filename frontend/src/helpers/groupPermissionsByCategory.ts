import { Permission } from "@/types/permission";

export const groupPermissionsByCategory = (
    permissions: Permission[],
): Record<string, Permission[]> => {
    const grouped: Record<string, Permission[]> = {};

    permissions.forEach((permission) => {
        const categoryName = permission.category?.name || "Uncategorized";

        if (!grouped[categoryName]) {
            grouped[categoryName] = [];
        }
        grouped[categoryName].push(permission);
    });

    for (const category in grouped) {
        grouped[category].sort((a, b) => a.name.localeCompare(b.name));
    }

    return grouped;
};
