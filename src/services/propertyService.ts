import {
  Property,
  PropertyCategory,
  PropertyFilters,
  PropertyStatus,
  User,
} from "../types";
import {
  mockProperties,
  mockUsers,
  filterProperties,
  getFeaturedProperties as _getFeaturedProperties,
  getPropertyBySlug as _getPropertyBySlug,
  getPropertiesByCategory as _getPropertiesByCategory,
} from "../data/properties";
import { slugify } from "../lib/utils";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withSellers(props: Property[]): Property[] {
  return props.map((p) => ({
    ...p,
    seller: mockUsers.find((u: User) => u.id === p.sellerId),
  }));
}

let properties = withSellers([...mockProperties]);

export async function getProperties(): Promise<Property[]> {
  await delay(300);
  return withSellers([...properties]);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  await delay(300);
  return withSellers(_getFeaturedProperties());
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  await delay(300);
  const found = _getPropertyBySlug(slug);
  if (!found) return null;
  return withSellers([found])[0];
}

export async function getPropertiesByCategory(
  category: PropertyCategory
): Promise<Property[]> {
  await delay(300);
  return withSellers(_getPropertiesByCategory(category));
}

export async function searchProperties(
  filters: PropertyFilters
): Promise<Property[]> {
  await delay(300);
  return withSellers(filterProperties(filters));
}

export async function addProperty(
  property: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt">
): Promise<Property> {
  await delay(300);
  const now = new Date().toISOString();
  const newProperty: Property = {
    ...property,
    id: `prop-${Date.now()}`,
    slug: slugify(property.title),
    createdAt: now,
    updatedAt: now,
  };
  properties = [...properties, withSellers([newProperty])[0]];
  return newProperty;
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<Property | null> {
  await delay(300);
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updated: Property = {
    ...properties[index],
    ...updates,
    id: properties[index].id,
    slug: updates.title ? slugify(updates.title) : properties[index].slug,
    updatedAt: new Date().toISOString(),
  };
  properties = [
    ...properties.slice(0, index),
    updated,
    ...properties.slice(index + 1),
  ];
  return updated;
}

export async function deleteProperty(id: string): Promise<void> {
  await delay(300);
  properties = properties.filter((p) => p.id !== id);
}

export async function togglePauseProperty(
  id: string
): Promise<Property | null> {
  await delay(300);
  const prop = properties.find((p) => p.id === id);
  if (!prop) return null;
  const newStatus =
    prop.status === PropertyStatus.PAUSED
      ? PropertyStatus.PUBLISHED
      : PropertyStatus.PAUSED;
  return updateProperty(id, { status: newStatus });
}

export async function markAsSold(id: string): Promise<Property | null> {
  await delay(300);
  return updateProperty(id, { status: PropertyStatus.SOLD });
}
