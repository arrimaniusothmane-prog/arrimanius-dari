"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Building2,
  Plus,
  Inbox,
  CalendarCheck2,
  FileCheck,
  ArrowLeftRight,
  HandCoins,
  UserRound,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell";

const items: NavItem[] = [
  { label: "Vue d'ensemble", href: "/seller", icon: LayoutDashboard },
  { label: "Mes biens", href: "/seller/properties", icon: Building2 },
  { label: "Ajouter un bien", href: "/seller/add", icon: Plus },
  { label: "Leads", href: "/seller/leads", icon: Inbox },
  { label: "Visites", href: "/seller/visits", icon: CalendarCheck2 },
  { label: "Offres", href: "/seller/offers", icon: FileCheck },
  { label: "Transactions", href: "/seller/transactions", icon: ArrowLeftRight },
  { label: "Commissions", href: "/seller/commission", icon: HandCoins },
  { label: "Profil", href: "/seller/profile", icon: UserRound },
];

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell items={items}>{children}</DashboardShell>
  );
}