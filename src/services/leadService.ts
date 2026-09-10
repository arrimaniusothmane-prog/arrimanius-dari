import {
  Lead,
  LeadStatus,
  Visit,
  Offer,
  OfferStatus,
} from "../types";
import {
  mockLeads,
  mockVisits,
  mockOffers,
} from "../data/properties";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let leads = [...mockLeads];
let visits = [...mockVisits];
let offers = [...mockOffers];

const DEFAULT_BUYER_ID = "buyer-1";
let favoritesByUser: Record<string, string[]> = {
  [DEFAULT_BUYER_ID]: ["prop-1", "prop-3", "prop-5"],
};

export async function getLeads(): Promise<Lead[]> {
  await delay(300);
  return [...leads];
}

export async function createLead(
  lead: Omit<Lead, "id" | "createdAt" | "updatedAt">
): Promise<Lead> {
  await delay(300);
  const now = new Date().toISOString();
  const newLead: Lead = {
    ...lead,
    id: `lead-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  leads = [...leads, newLead];
  return newLead;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead | null> {
  await delay(300);
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  const updated: Lead = {
    ...leads[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  leads = [
    ...leads.slice(0, index),
    updated,
    ...leads.slice(index + 1),
  ];
  return updated;
}

export async function getVisits(): Promise<Visit[]> {
  await delay(300);
  return [...visits];
}

export async function createVisit(
  visit: Omit<Visit, "id" | "createdAt">
): Promise<Visit> {
  await delay(300);
  const newVisit: Visit = {
    ...visit,
    id: `visit-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  visits = [...visits, newVisit];
  return newVisit;
}

export async function getOffers(): Promise<Offer[]> {
  await delay(300);
  return [...offers];
}

export async function createOffer(
  offer: Omit<Offer, "id" | "createdAt" | "updatedAt">
): Promise<Offer> {
  await delay(300);
  const now = new Date().toISOString();
  const newOffer: Offer = {
    ...offer,
    id: `offer-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  offers = [...offers, newOffer];
  return newOffer;
}

export async function updateOfferStatus(
  id: string,
  status: OfferStatus
): Promise<Offer | null> {
  await delay(300);
  const index = offers.findIndex((o) => o.id === id);
  if (index === -1) return null;
  const updated: Offer = {
    ...offers[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  offers = [
    ...offers.slice(0, index),
    updated,
    ...offers.slice(index + 1),
  ];
  return updated;
}

export interface CounterOfferInput {
  price?: number;
  message?: string;
}

export async function sendCounterOffer(
  id: string,
  input: CounterOfferInput
): Promise<Offer | null> {
  await delay(300);
  const index = offers.findIndex((o) => o.id === id);
  if (index === -1) return null;
  const updated: Offer = {
    ...offers[index],
    status: OfferStatus.COUNTER_OFFER,
    counterPrice: input.price ?? offers[index].price,
    counterMessage: input.message,
    updatedAt: new Date().toISOString(),
  };
  offers = [
    ...offers.slice(0, index),
    updated,
    ...offers.slice(index + 1),
  ];
  return updated;
}

export async function getFavorites(userId = DEFAULT_BUYER_ID): Promise<string[]> {
  await delay(300);
  return [...(favoritesByUser[userId] ?? [])];
}

export async function toggleFavorite(
  userId: string,
  propertyId: string
): Promise<string[]> {
  await delay(300);
  const current = favoritesByUser[userId] ?? [];
  const next = current.includes(propertyId)
    ? current.filter((id) => id !== propertyId)
    : [...current, propertyId];
  favoritesByUser = { ...favoritesByUser, [userId]: next };
  return [...next];
}
