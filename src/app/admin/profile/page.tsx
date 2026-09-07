import { ProfileSettings } from "@/components/dashboard/profile-settings";

export const metadata = {
  title: "Profil administrateur",
  description:
    "Gérez votre compte d'administrateur DarEstate : informations personnelles, notifications et préférences.",
};

export default function AdminProfilePage() {
  return <ProfileSettings />;
}