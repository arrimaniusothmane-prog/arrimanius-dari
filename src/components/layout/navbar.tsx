"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChevronDown, Globe, LogOut, Plus, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/types";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();

  const onHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/buy", label: t("nav.acheter") },
    { href: "/sell", label: t("nav.vendre") },
    { href: "/invest", label: t("nav.investir") },
    { href: "/properties", label: t("nav.nosBiens") },
    { href: "/about", label: t("nav.apropos") },
  ];

  const dashboardHref =
    user?.role === UserRole.ADMIN
      ? "/admin"
      : user?.role === UserRole.SELLER || user?.role === UserRole.AGENT
      ? "/seller"
      : "/buyer";

  const langOptions: { code: Locale; label: string }[] = [
    { code: "fr", label: "FR" },
    { code: "ar", label: "عر" },
    { code: "en", label: "EN" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-sm" : "bg-transparent"
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-14" : "h-16",
          onHero && !scrolled && "text-white"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-xl text-white transition-colors",
              onHero && !scrolled ? "bg-white/15 backdrop-blur" : "bg-primary"
            )}
          >
            <Building2 className="size-5 text-gold" />
          </span>
          <span
            className={cn(
              "font-display text-xl font-semibold tracking-tight transition-colors",
              onHero && !scrolled && "text-white"
            )}
          >
            Dar<span className="text-gold">Estate</span>
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                onHero && !scrolled
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                pathname === link.href && "font-semibold text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1",
                    onHero && !scrolled && "text-white hover:bg-white/10 hover:text-white"
                  )}
                />
              }
            >
              <Globe className="size-4" />
              {langOptions.find((l) => l.code === locale)?.label}
              <ChevronDown className="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[9rem]">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Langue</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {langOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={cn(locale === lang.code && "font-semibold text-gold")}
                  >
                    {lang.label} — {lang.code === "fr" ? "Français" : lang.code === "ar" ? "العربية" : "English"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    className={cn(
                      "flex size-9 items-center justify-center overflow-hidden rounded-full border transition-colors",
                      onHero && !scrolled
                        ? "border-white/30 bg-white/10"
                        : "border-border bg-card"
                    )}
                  />
                }
              >
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="size-full object-cover" />
                ) : (
                  <UserIcon className="size-4 text-muted-foreground" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href={dashboardHref} />}>
                    Tableau de bord
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/favorites" />}>
                    Mes favoris
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                    <LogOut className="mr-2 size-4" />
                    {t("nav.deconnexion")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "hidden rounded-full px-4 py-2 text-sm font-medium transition-colors sm:block",
                  onHero && !scrolled
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t("nav.connexion")}
              </Link>
              <Link href="/publish" className="hidden sm:block">
                <Button size="sm" className="gap-1.5 rounded-full shadow-sm shadow-gold/20">
                  <Plus className="size-4" />
                  {t("nav.publier")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
