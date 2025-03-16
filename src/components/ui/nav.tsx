"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, Trophy, Settings } from "lucide-react";

export function MainNav() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Home",
            href: "/",
            icon: Home,
        },
        {
            name: "Group Phase",
            href: "/group",
            icon: Users,
        },
        {
            name: "Knockout",
            href: "/knockout",
            icon: Trophy,
        },
        {
            name: "Admin",
            href: "/admin",
            icon: Settings,
        },
    ];

    return (
        <nav className="flex items-center">
            <ul className="flex items-center gap-1 md:gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "nav-item",
                                    isActive ? "active" : ""
                                )}
                            >
                                <Icon size={18} />
                                <span className="hidden md:inline">{item.name}</span>
                                {isActive && <span className="absolute bottom-0 left-0 h-1 w-full bg-primary md:hidden"></span>}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
} 