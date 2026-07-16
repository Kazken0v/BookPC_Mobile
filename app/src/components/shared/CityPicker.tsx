import React, { useState, useMemo } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from "react-native";
import { MapPin, Search, X, Navigation, ChevronRight } from "lucide-react-native";
import { colors } from "../../theme";
import { useClubs } from "../../context/ClubContext";
import { useAppLocation, countryCapitals } from "../../context/LocationContext";

interface CityPickerProps {
  visible: boolean;
  onClose: () => void;
}

interface CityEntry {
  city: string;
  country: string;
}

export function CityPicker({ visible, onClose }: CityPickerProps) {
  const { city: currentCity, country: currentCountry, setCityAndCountry, refreshLocation } = useAppLocation();
  const { clubs: allClubs } = useClubs();
  const [search, setSearch] = useState("");

  const availableCities = useMemo<CityEntry[]>(() => {
    const seen = new Map<string, CityEntry>();
    allClubs.forEach((club) => {
      const key = `${club.city}|${club.country}`;
      if (!seen.has(key)) {
        seen.set(key, { city: club.city, country: club.country });
      }
    });
    return Array.from(seen.values());
  }, [allClubs]);

  const filtered = useMemo(() => {
    if (!search.trim()) return availableCities;
    const q = search.toLowerCase();
    return availableCities.filter(
      (c) => c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }, [search, availableCities]);

  const handleSelect = (entry: CityEntry) => {
    const capitalInfo = countryCapitals[entry.country];
    const coords = capitalInfo?.coords || null;
    setCityAndCountry(entry.city, entry.country, coords);
    onClose();
  };

  const handleCurrentLocation = async () => {
    onClose();
    await refreshLocation();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" }} behavior="padding">
        <View
          style={{
            backgroundColor: "#0F0F1F",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 16,
            paddingBottom: 40,
            maxHeight: "80%",
            borderTopWidth: 1,
            borderColor: "rgba(124, 58, 237, 0.3)",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
              Select City
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.06)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Current location button */}
          <TouchableOpacity
            onPress={handleCurrentLocation}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginHorizontal: 20,
              marginBottom: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 16,
              backgroundColor: "rgba(124, 58, 237, 0.12)",
              borderWidth: 1,
              borderColor: "rgba(124, 58, 237, 0.3)",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "rgba(124, 58, 237, 0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Navigation size={20} color={colors.purpleLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
                Use my location
              </Text>
              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                Auto-detect city & country
              </Text>
            </View>
            <ChevronRight size={18} color={colors.purpleLight} />
          </TouchableOpacity>

          {/* Search */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginHorizontal: 20,
              marginBottom: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: "rgba(26, 26, 46, 0.9)",
              borderWidth: 1,
              borderColor: "rgba(124, 58, 237, 0.15)",
            }}
          >
            <Search size={16} color={colors.textMuted} />
            <TextInput
              style={{ flex: 1, color: colors.text, fontSize: 14 }}
              placeholder="Search city or country..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <X size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* City list */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => `${item.city}|${item.country}`}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 4 }}
            ListEmptyComponent={
              <View style={{ paddingVertical: 40, alignItems: "center", gap: 8 }}>
                <MapPin size={32} color="#2A2A3E" />
                <Text style={{ fontSize: 13, color: colors.textMuted, textAlign: "center" }}>
                  No cities found
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const isActive = item.city === currentCity && item.country === currentCountry;
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    borderRadius: 14,
                    backgroundColor: isActive
                      ? "rgba(124, 58, 237, 0.15)"
                      : "rgba(255, 255, 255, 0.03)",
                    borderWidth: 1,
                    borderColor: isActive
                      ? "rgba(124, 58, 237, 0.4)"
                      : "transparent",
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: isActive
                        ? "rgba(124, 58, 237, 0.25)"
                        : "rgba(255, 255, 255, 0.05)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MapPin size={18} color={isActive ? colors.purpleLight : colors.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: isActive ? colors.purpleLight : colors.text,
                      }}
                    >
                      {item.city}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                      {item.country}
                    </Text>
                  </View>
                  {isActive && (
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                        backgroundColor: "rgba(124, 58, 237, 0.2)",
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: "700", color: colors.purpleLight }}>
                        ACTIVE
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
