"use client";

import { useState, useEffect } from "react";
import { Property, PropertyFilters, UserRole } from "../types";
import {
  getProperties as fetchProperties,
  getPropertyBySlug,
  searchProperties as fetchSearchProperties,
} from "../services/propertyService";
import { getFavorites as fetchFavorites, toggleFavorite as toggleFav } from "../services/leadService";
import { useAuth } from "@/components/providers/auth-provider";

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

export function useFavorites(userIdArg?: string) {
  const { user } = useAuth();
  const userId =
    userIdArg ?? (user?.role === UserRole.BUYER ? user.id : "buyer-1");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetchFavorites(userId)
      .then((list) => {
        if (!ignore) setFavorites(list);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [userId]);

  const toggleFavorite = async (propertyId: string) => {
    const updated = await toggleFav(userId, propertyId);
    setFavorites(updated);
  };

  return { favorites, toggleFavorite, loading };
}
