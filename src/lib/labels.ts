import {
  CommissionStatus,
  DemandeStatus,
  DemandeType,
  LeadStatus,
  OfferStatus,
  PropertyCategory,
  PropertyStatus,
  TransactionStatus,
} from "@/types";
import { mockProperties, mockUsers } from "@/data/properties";

export const categoryLabel: Record<PropertyCategory, string> = {
  [PropertyCategory.APARTMENT]: "Appartement",
  [PropertyCategory.VILLA]: "Villa",
  [PropertyCategory.HOUSE]: "Maison",
  [PropertyCategory.LAND]: "Terrain",
  [PropertyCategory.COMMERCIAL]: "Commercial",
};

export const propertyStatusLabel: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: "Brouillon",
  [PropertyStatus.PENDING_REVIEW]: "En attente de vérification",
  [PropertyStatus.PUBLISHED]: "Publié",
  [PropertyStatus.PAUSED]: "En pause",
  [PropertyStatus.SOLD]: "Vendu",
  [PropertyStatus.REJECTED]: "Rejeté",
};

export const leadStatusOrder: LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.VISIT_REQUESTED,
  LeadStatus.VISIT_CONFIRMED,
  LeadStatus.VISIT_COMPLETED,
  LeadStatus.OFFER_MADE,
  LeadStatus.NEGOTIATION,
  LeadStatus.SOLD,
  LeadStatus.CANCELLED,
];

export const leadStatusLabel: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "Nouveau",
  [LeadStatus.CONTACTED]: "Contacté",
  [LeadStatus.VISIT_REQUESTED]: "Visite demandée",
  [LeadStatus.VISIT_CONFIRMED]: "Visite confirmée",
  [LeadStatus.VISIT_COMPLETED]: "Visite effectuée",
  [LeadStatus.OFFER_MADE]: "Offre faite",
  [LeadStatus.NEGOTIATION]: "Négociation",
  [LeadStatus.SOLD]: "Vendu",
  [LeadStatus.CANCELLED]: "Annulé",
};

export const leadStatusBadge: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [LeadStatus.CONTACTED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  [LeadStatus.VISIT_REQUESTED]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [LeadStatus.VISIT_CONFIRMED]: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  [LeadStatus.VISIT_COMPLETED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [LeadStatus.OFFER_MADE]: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  [LeadStatus.NEGOTIATION]: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  [LeadStatus.SOLD]: "bg-gold/20 text-gold dark:bg-gold/15",
  [LeadStatus.CANCELLED]: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export const visitStatusLabel: Partial<Record<LeadStatus, string>> = {
  [LeadStatus.VISIT_REQUESTED]: "À confirmer",
  [LeadStatus.VISIT_CONFIRMED]: "Confirmée",
  [LeadStatus.VISIT_COMPLETED]: "Effectuée",
  [LeadStatus.CANCELLED]: "Annulée",
};

export const visitStatusBadge: Partial<Record<LeadStatus, string>> = {
  [LeadStatus.VISIT_REQUESTED]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [LeadStatus.VISIT_CONFIRMED]: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  [LeadStatus.VISIT_COMPLETED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [LeadStatus.CANCELLED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

export const offerStatusLabel: Record<OfferStatus, string> = {
  [OfferStatus.PENDING]: "En attente",
  [OfferStatus.ACCEPTED]: "Acceptée",
  [OfferStatus.REJECTED]: "Refusée",
  [OfferStatus.COUNTER_OFFER]: "Contre-offre",
};

export const offerStatusBadge: Record<OfferStatus, string> = {
  [OfferStatus.PENDING]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [OfferStatus.ACCEPTED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [OfferStatus.REJECTED]: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  [OfferStatus.COUNTER_OFFER]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
};

export const transactionStatusLabel: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: "En attente",
  [TransactionStatus.COMPLETED]: "Finalisée",
  [TransactionStatus.CANCELLED]: "Annulée",
};

export const transactionStatusBadge: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [TransactionStatus.COMPLETED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [TransactionStatus.CANCELLED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

export const commissionStatusLabel: Record<CommissionStatus, string> = {
  [CommissionStatus.PENDING]: "En attente",
  [CommissionStatus.DUE]: "À payer",
  [CommissionStatus.PAID]: "Payée",
  [CommissionStatus.CANCELLED]: "Annulée",
};

export const commissionStatusBadge: Record<CommissionStatus, string> = {
  [CommissionStatus.PENDING]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [CommissionStatus.DUE]: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  [CommissionStatus.PAID]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [CommissionStatus.CANCELLED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

export function propertyById(id: string) {
  return mockProperties.find((p) => p.id === id);
}

export function userById(id: string) {
  return mockUsers.find((u) => u.id === id);
}

export const demandeTypeLabel: Record<DemandeType, string> = {
  [DemandeType.DEVIS]: "Demande de devis",
  [DemandeType.CONTACT]: "Contact général",
  [DemandeType.CONTACT_BIEN]: "Contact vendeur",
  [DemandeType.VISITE]: "Demande de visite",
  [DemandeType.OFFRE]: "Offre d'achat",
  [DemandeType.PUBLICATION]: "Publication de bien",
};

export const demandeTypeBadge: Record<DemandeType, string> = {
  [DemandeType.DEVIS]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [DemandeType.CONTACT]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [DemandeType.CONTACT_BIEN]: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  [DemandeType.VISITE]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [DemandeType.OFFRE]: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  [DemandeType.PUBLICATION]: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
};

export const demandeStatusLabel: Record<DemandeStatus, string> = {
  [DemandeStatus.NOUVELLE]: "Nouvelle",
  [DemandeStatus.EN_COURS]: "En cours",
  [DemandeStatus.TRAITEE]: "Traitée",
};

export const demandeStatusBadge: Record<DemandeStatus, string> = {
  [DemandeStatus.NOUVELLE]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [DemandeStatus.EN_COURS]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [DemandeStatus.TRAITEE]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};