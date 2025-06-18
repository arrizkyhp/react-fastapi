import {
    Calendar,
    Contact,
    FolderTree,
    Home,
    Inbox,
    KeyRound,
    Search,
    Settings,
    ShieldUser,
    UserRound,
    Users
} from "lucide-react";
import {MenuItem} from "@/types/menu.ts";

export const menu: MenuItem[] = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "User Management",
        icon: Users,
        isGroup: true,
        submenu: [
            {
                title: "Users",
                url: "/users",
                icon: UserRound,
            },
            {
                title: "Roles",
                url: "/roles",
                icon: ShieldUser,
            },
            {
                title: "Permissions",
                url: "/permissions",
                icon: KeyRound,
            },
            {
                title: "Categories",
                url: "/categories",
                icon: FolderTree,
            },
        ],
    },
    {
        title: "Contact",
        url: "/contacts",
        icon: Contact,
    },
    {
        title: "Inbox",
        url: "/Test",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];
