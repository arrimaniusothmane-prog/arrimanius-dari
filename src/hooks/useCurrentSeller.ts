import { useAuth } from "@/components/providers/auth-provider";
import { UserRole } from "@/types";

export function useCurrentSellerId(fallback = "seller-1"): string {
  const { user } = useAuth();
  return user?.role === UserRole.SELLER || user?.role === UserRole.AGENT
    ? user.id
    : fallback;
}