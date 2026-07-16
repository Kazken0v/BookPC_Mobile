import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Club } from "../data/mockClubs";
import { fetchClubsNearby } from "../services/clubService";
import { useAppLocation } from "./LocationContext";

interface ClubContextValue {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  getClubById: (id: string) => Club | undefined;
  refresh: () => Promise<void>;
}

const ClubContext = createContext<ClubContextValue | null>(null);

export function ClubProvider({ children }: { children: ReactNode }) {
  const { coords, city, country } = useAppLocation();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClubs = useCallback(async () => {
    if (!coords) return;
    setLoading(true);
    setError(null);
    try {
      const nearby = await fetchClubsNearby(coords.latitude, coords.longitude, city, country);
      setClubs(nearby.length > 0 ? nearby : []);
    } catch (e) {
      setClubs([]);
      setError("Could not load clubs");
    } finally {
      setLoading(false);
    }
  }, [coords, city, country]);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  const getClubById = useCallback(
    (id: string) => clubs.find(c => c.id === id),
    [clubs]
  );

  return (
    <ClubContext.Provider value={{ clubs, loading, error, getClubById, refresh: loadClubs }}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClubs() {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClubs must be used within ClubProvider");
  return ctx;
}
