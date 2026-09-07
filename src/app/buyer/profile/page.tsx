import { ProfileSettings } from "@/components/dashboard/profile-settings";

export const metadata = {
  title: "Profil acheteur",
  description:
    "Gérez vos informations personnelles, vos notifications et vos préférences sur DarEstate.",
};

export default function BuyerProfilePage() {
  return <ProfileSettings />;
}