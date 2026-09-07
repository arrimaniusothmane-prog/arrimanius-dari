"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/properties", label: "Recherche", icon: Search },
    { href: "/favorites", label: "Favoris", icon: Heart },
    { href: "/account", label: "Compte", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      <div className="glass border-t border-border/60 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4 h-16">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className={cn("size-5", active && "text-gold")} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
                {active && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
