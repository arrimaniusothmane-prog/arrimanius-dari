"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Inbox,
  CalendarCheck2,
  FileCheck,
  ArrowLeftRight,
  HandCoins,
  BarChart3,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell";
import { AdminGuard } from "./admin-guard";

const items: NavItem[] = [
  { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { label: "Vendeurs", href: "/admin/sellers", icon: Building2 },
  { label: "Acheteurs", href: "/admin/buyers", icon: UserRound },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
  { label: "Annuaires", href: "/admin/listings", icon: ClipboardList },
  { label: "Leads", href: "/admin/leads", icon: Inbox },
  { label: "Visites", href: "/admin/visits", icon: CalendarCheck2 },
  { label: "Offres", href: "/admin/offers", icon: FileCheck },
  { label: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { label: "Commissions", href: "/admin/commissions", icon: HandCoins },
  { label: "Rapports", href: "/admin/reports", icon: BarChart3 },
  { label: "Sécurité", href: "/admin/security", icon: ShieldCheck },
  { label: "Profil", href: "/admin/profile", icon: UserRound },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <DashboardShell items={items}>{children}</DashboardShell>
    </AdminGuard>
  );
}
