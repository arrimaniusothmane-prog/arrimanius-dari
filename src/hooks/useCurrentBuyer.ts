import { useAuth } from "@/components/providers/auth-provider";
import { UserRole } from "@/types";

export function useCurrentBuyerId(fallback = "buyer-1"): string {
  const { user } = useAuth();
  return user?.role === UserRole.BUYER ? user.id : fallback;
}