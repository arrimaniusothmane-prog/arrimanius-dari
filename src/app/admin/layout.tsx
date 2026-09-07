"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  Inbox,
  CalendarCheck2,
  FileCheck,
  ArrowLeftRight,
  HandCoins,
  BarChart3,
  UserRound,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell";

const items: NavItem[] = [
  { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
  { label: "Biens", href: "/admin/properties", icon: Building2 },
  { label: "Annuaires", href: "/admin/listings", icon: ClipboardList },
  { label: "Leads", href: "/admin/leads", icon: Inbox },
  { label: "Visites", href: "/admin/visits", icon: CalendarCheck2 },
  { label: "Offres", href: "/admin/offers", icon: FileCheck },
  { label: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { label: "Commissions", href: "/admin/commissions", icon: HandCoins },
  { label: "Rapports", href: "/admin/reports", icon: BarChart3 },
  { label: "Profil", href: "/admin/profile", icon: UserRound },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardShell items={items}>{children}</DashboardShell>;
}
