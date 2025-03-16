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
                        <li key={item.href} className="relative">
                            <Link
                                href={item.href}
                                className={cn(
                                    "nav-item flex items-center gap-2 relative",
                                    isActive
                                        ? "active text-primary-foreground"
                                        : "text-foreground/80 hover:text-foreground"
                                )}
                            >
                                <span className={cn(
                                    "flex items-center justify-center transition-all",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                )}>
                                    <Icon size={18} strokeWidth={2.5} className={cn(
                                        isActive && "animate-pulse-slow"
                                    )} />
                                </span>
                                <span className="hidden md:inline font-medium">{item.name}</span>

                                {isActive && (
                                    <span className="absolute -bottom-[17px] left-1/2 transform -translate-x-1/2 w-[5px] h-[5px] bg-primary rounded-full md:hidden"></span>
                                )}
                            </Link>

                            {/* Bottom indicator for larger screens */}
                            {isActive && (
                                <span className="absolute hidden md:block h-[3px] bottom-[-17px] left-0 right-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
} 