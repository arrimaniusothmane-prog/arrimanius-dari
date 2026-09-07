"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Heart,
  Inbox,
  CalendarCheck2,
  FileCheck,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell";

const items: NavItem[] = [
  { label: "Vue d'ensemble", href: "/buyer", icon: LayoutDashboard },
  { label: "Mes favoris", href: "/buyer/favorites", icon: Heart },
  { label: "Mes demandes", href: "/buyer/requests", icon: Inbox },
  { label: "Mes visites", href: "/buyer/visits", icon: CalendarCheck2 },
  { label: "Mes offres", href: "/buyer/offers", icon: FileCheck },
  { label: "Messages", href: "/buyer/messages", icon: MessageSquare },
  { label: "Profil", href: "/buyer/profile", icon: UserRound },
];

export default function BuyerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell items={items} badge={items.length ? "2" : undefined}>
      {children}
    </DashboardShell>
  );
}