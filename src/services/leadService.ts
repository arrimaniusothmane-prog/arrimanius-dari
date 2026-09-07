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
let favorites: string[] = ["prop-1", "prop-3", "prop-5"];

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

export async function getFavorites(): Promise<string[]> {
  await delay(300);
  return [...favorites];
}

export async function toggleFavorite(propertyId: string): Promise<string[]> {
  await delay(300);
  if (favorites.includes(propertyId)) {
    favorites = favorites.filter((id) => id !== propertyId);
  } else {
    favorites = [...favorites, propertyId];
  }
  return [...favorites];
}
