import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as Location from "expo-location";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationContextValue {
  country: string;
  city: string;
  coords: Coordinates | null;
  permissionStatus: Location.PermissionStatus | "denied_manually" | null;
  loading: boolean;
  setCityAndCountry: (city: string, country: string, coords?: Coordinates | null) => void;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export const countryCapitals: Record<string, { city: string; coords: Coordinates }> = {
  "Kazakhstan": { city: "Astana", coords: { latitude: 51.1693, longitude: 71.4490 } },
  "Russia": { city: "Moscow", coords: { latitude: 55.7558, longitude: 37.6173 } },
  "Default": { city: "Almaty", coords: { latitude: 43.2382, longitude: 76.9454 } },
};

function normalizeCity(city: string | null): string {
  if (!city) return "Almaty";
  const lower = city.toLowerCase();
  if (lower.includes("алмат") || lower.includes("almat")) return "Almaty";
  if (lower.includes("астан") || lower.includes("astand") || lower.includes("astan") || lower.includes("нур-султ") || lower.includes("nur-sult")) return "Astana";
  if (lower.includes("москв") || lower.includes("moscow")) return "Moscow";
  if (lower.includes("санкт") || lower.includes("petersburg") || lower.includes("петербург")) return "Saint Petersburg";
  return city;
}

function normalizeCountry(country: string | null): string {
  if (!country) return "Kazakhstan";
  const lower = country.toLowerCase();
  if (lower.includes("казах") || lower.includes("kazakh")) return "Kazakhstan";
  if (lower.includes("росси") || lower.includes("russi")) return "Russia";
  return country;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<string>("Kazakhstan");
  const [city, setCity] = useState<string>("Almaty");
  const [coords, setCoords] = useState<Coordinates | null>({ latitude: 43.2382, longitude: 76.9454 });
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | "denied_manually" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchIPLocationFallback = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        const ipCountry = normalizeCountry(data.country_name);
        
        // Since user denied geolocation, we MUST fallback to the CAPITAL city of their detected country
        const capitalInfo = countryCapitals[ipCountry] || countryCapitals["Default"];
        setCountry(ipCountry);
        setCity(capitalInfo.city);
        setCoords(capitalInfo.coords);
      } else {
        throw new Error("IP API failed");
      }
    } catch (e) {
      // Complete fallback to Almaty (Kazakhstan)
      const fallback = countryCapitals["Default"];
      setCountry("Kazakhstan");
      setCity(fallback.city);
      setCoords(fallback.coords);
    }
  };

  const refreshLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === Location.PermissionStatus.GRANTED) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const currentCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCoords(currentCoords);

        const geocode = await Location.reverseGeocodeAsync(currentCoords);
        if (geocode && geocode.length > 0) {
          const geo = geocode[0];
          const resolvedCity = normalizeCity(geo.city || geo.subregion || geo.district);
          const resolvedCountry = normalizeCountry(geo.country);
          
          setCity(resolvedCity);
          setCountry(resolvedCountry);
        }
      } else {
        // User denied geolocation: fallback to Capital of their IP country
        await fetchIPLocationFallback();
      }
    } catch (error) {
      await fetchIPLocationFallback();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  const setCityAndCountry = (selectedCity: string, selectedCountry: string, selectedCoords?: Coordinates | null) => {
    setCity(selectedCity);
    setCountry(selectedCountry);
    if (selectedCoords) {
      setCoords(selectedCoords);
    } else {
      // If manually selected, find mock coords or default
      const capitalInfo = countryCapitals[selectedCountry] || countryCapitals["Default"];
      setCoords(capitalInfo.coords);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        country,
        city,
        coords,
        permissionStatus,
        loading,
        setCityAndCountry,
        refreshLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useAppLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useAppLocation must be used within LocationProvider");
  return ctx;
}
