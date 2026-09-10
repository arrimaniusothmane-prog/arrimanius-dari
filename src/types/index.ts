export enum UserRole {
  BUYER = "BUYER",
  SELLER = "SELLER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export enum PropertyCategory {
  APARTMENT = "APARTMENT",
  VILLA = "VILLA",
  HOUSE = "HOUSE",
  LAND = "LAND",
  COMMERCIAL = "COMMERCIAL",
}

export enum PropertyStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  PUBLISHED = "PUBLISHED",
  PAUSED = "PAUSED",
  SOLD = "SOLD",
  REJECTED = "REJECTED",
}

export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  VISIT_REQUESTED = "VISIT_REQUESTED",
  VISIT_CONFIRMED = "VISIT_CONFIRMED",
  VISIT_COMPLETED = "VISIT_COMPLETED",
  OFFER_MADE = "OFFER_MADE",
  NEGOTIATION = "NEGOTIATION",
  SOLD = "SOLD",
  CANCELLED = "CANCELLED",
}

export enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COUNTER_OFFER = "COUNTER_OFFER",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum CommissionStatus {
  PENDING = "PENDING",
  DUE = "DUE",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export type UserStatus = "ACTIF" | "SUSPENDU";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  createdAt: string;
  isVerified: boolean;
  status: UserStatus;
  companyName?: string;
  bio?: string;
  location?: string;
  licenseNumber?: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  category: PropertyCategory;
  status: PropertyStatus;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  latitude: number;
  longitude: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  yearBuilt: number | null;
  images: PropertyImage[];
  amenities: string[];
  features: string[];
  isVerified: boolean;
  isFurnished: boolean;
  hasParking: boolean;
  hasPool: boolean;
  hasGarden: boolean;
  hasTerrace: boolean;
  isNewConstruction: boolean;
  views: number;
  favoriteCount: number;
  sellerId: string;
  seller?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  search: string;
  category: PropertyCategory | undefined;
  city: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minSurface: number | undefined;
  maxSurface: number | undefined;
  bedrooms: number | undefined;
  bathrooms: number | undefined;
  isFurnished: boolean | undefined;
  hasParking: boolean | undefined;
  hasPool: boolean | undefined;
  hasGarden: boolean | undefined;
  hasTerrace: boolean | undefined;
  isNewConstruction: boolean | undefined;
  isVerified: boolean | undefined;
  status: PropertyStatus | undefined;
  sortBy: string | undefined;
}

export interface Lead {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  status: LeadStatus;
  message: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: string;
  propertyId: string;
  leadId: string;
  date: string;
  time: string;
  numberOfVisitors: number;
  phone: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Offer {
  id: string;
  propertyId: string;
  buyerId: string;
  price: number;
  counterPrice?: number;
  counterMessage?: string;
  message: string;
  preferredContact: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  sellerId: string;
  buyerId: string;
  salePrice: number;
  commissionPercentage: number;
  commissionAmount: number;
  status: TransactionStatus;
  createdAt: string;
}

export interface Commission {
  id: string;
  transactionId: string;
  amount: number;
  percentage: number;
  status: CommissionStatus;
  dueDate: string;
  paidDate: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export enum DemandeType {
  DEVIS = "DEVIS",
  CONTACT = "CONTACT",
  CONTACT_BIEN = "CONTACT_BIEN",
  VISITE = "VISITE",
  OFFRE = "OFFRE",
  PUBLICATION = "PUBLICATION",
}

export enum DemandeStatus {
  NOUVELLE = "NOUVELLE",
  EN_COURS = "EN_COURS",
  TRAITEE = "TRAITEE",
}

export interface Demande {
  id: string;
  type: DemandeType;
  status: DemandeStatus;
  title: string;
  message: string;
  name: string;
  email: string;
  phone: string;
  data: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewedId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeProperties: number;
  newProperties: number;
  totalLeads: number;
  visits: number;
  offers: number;
  completedTransactions: number;
  totalRevenue: number;
  commissionRevenue: number;
}

export type SearchParams = {
  search: string;
  category: string | undefined;
  city: string | undefined;
  minPrice: string | undefined;
  maxPrice: string | undefined;
  minSurface: string | undefined;
  maxSurface: string | undefined;
  bedrooms: string | undefined;
  bathrooms: string | undefined;
  isFurnished: string | undefined;
  hasParking: string | undefined;
  hasPool: string | undefined;
  hasGarden: string | undefined;
  hasTerrace: string | undefined;
  isNewConstruction: string | undefined;
  isVerified: string | undefined;
  status: string | undefined;
  sortBy: string | undefined;
};
