"use client";

import { useState, useEffect } from "react";
import { Property, PropertyFilters } from "../types";
import {
  getProperties as fetchProperties,
  getPropertyBySlug,
  searchProperties as fetchSearchProperties,
} from "../services/propertyService";
import { getFavorites as fetchFavorites, toggleFavorite as toggleFav } from "../services/leadService";

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { properties, loading, error };
}

export function useProperty(slug: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    getPropertyBySlug(slug)
      .then((p) => {
        if (ignore) return;
        setProperty(p);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        setProperty(null);
        setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [slug]);

  return { property, loading, error };
}

export function useSearchProperties(filters: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let ignore = false;
    fetchSearchProperties(filters)
      .then((p) => {
        if (ignore) return;
        setProperties(p);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return { properties, loading, error };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites()
      .then(setFavorites)
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = async (propertyId: string) => {
    const updated = await toggleFav(propertyId);
    setFavorites(updated);
  };

  return { favorites, toggleFavorite, loading };
}
