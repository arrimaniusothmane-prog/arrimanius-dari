import { ProfileSettings } from "@/components/dashboard/profile-settings";

export const metadata = {
  title: "Profil vendeur",
  description:
    "Gérez vos informations personnelles, votre agence, vos notifications et vos préférences sur DarEstate.",
};

export default function SellerProfilePage() {
  return <ProfileSettings />;
}