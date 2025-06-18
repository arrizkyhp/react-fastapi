import { LucideIcon } from "lucide-react";

export interface SubMenuItem {
    title: string;
    url: string;
    icon: LucideIcon;
}

export interface MenuItem {
    title: string;
    url?: string;
    icon: LucideIcon;
    isGroup?: boolean;
    submenu?: SubMenuItem[];
}
