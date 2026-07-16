import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from "react-native-maps";
import { Search, MapPin, Star, Clock, ChevronRight, SlidersHorizontal, X, Navigation } from "lucide-react-native";
import { Club } from "../data/mockClubs";
import { BadgeChip } from "../components/shared/BadgeChip";
import { CityPicker } from "../components/shared/CityPicker";
import { useAppLocation } from "../context/LocationContext";
import { useClubs } from "../context/ClubContext";
import { colors } from "../theme";

function ClubMarker({ selected, onPress }: { selected: boolean; onPress: () => void }) {
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: selected ? colors.purple : colors.card,
          borderWidth: 2,
          borderColor: selected ? colors.yellow : colors.purple,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.purple,
          shadowOpacity: selected ? 0.8 : 0.5,
          shadowRadius: selected ? 8 : 4,
        }}
      >
        <Text style={{ fontSize: 14 }}>🎮</Text>
      </View>
    </View>
  );
}

export function MapScreen() {
  const navigation = useNavigation<any>();
  const { city, country, coords } = useAppLocation();
  const { clubs: allClubs, loading } = useClubs();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRadius, setSearchRadius] = useState(5);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  const currentLat = coords?.latitude ?? 43.2382;
  const currentLng = coords?.longitude ?? 76.9454;

  const filteredClubs = useMemo(() => {
    return allClubs.filter((club) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !club.name.toLowerCase().includes(q) &&
          !club.address.toLowerCase().includes(q) &&
          !club.tags.some((t) => t.toLowerCase().includes(q))
        )
          return false;
      }
      if (parseFloat(club.distance) > searchRadius) return false;
      if (activeFilters.includes("Open Now") && (club.id === "club-3" || club.id === "club-6")) return false;
      if (activeFilters.includes("Free Seats") && club.availableSeats < 10) return false;
      if (activeFilters.includes("VIP Zone") && !club.zones.includes("VIP")) return false;
      return true;
    });
  }, [searchQuery, searchRadius, activeFilters, allClubs]);

  const toggleFilter = (f: string) =>
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgDeep }}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: currentLat,
          longitude: currentLng,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        customMapStyle={darkMapStyle}
      >
        <Circle
          center={{ latitude: currentLat, longitude: currentLng }}
          radius={searchRadius * 1000}
          strokeColor={colors.purple}
          fillColor="rgba(124,58,237,0.05)"
          strokeWidth={1.5}
        />
        <Marker coordinate={{ latitude: currentLat, longitude: currentLng }} title="You are here">
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bgDeep, borderWidth: 2, borderColor: colors.cyan, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 13 }}>📍</Text>
          </View>
        </Marker>
        {filteredClubs.map((club) => (
          <Marker
            key={club.id}
            coordinate={{ latitude: club.lat ?? currentLat, longitude: club.lng ?? currentLng }}
            onPress={() => setSelectedClub(club)}
          >
            <ClubMarker selected={selectedClub?.id === club.id} onPress={() => setSelectedClub(club)} />
          </Marker>
        ))}
      </MapView>

      {/* Top overlay */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, padding: 16, backgroundColor: "rgba(13,17,23,0.85)", gap: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "900", color: colors.text, textTransform: "uppercase" }}>Cyber Map</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>Find nearest gaming arenas & reserves</Text>
          </View>
          <TouchableOpacity
            onPress={() => setCityPickerVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: "rgba(26,26,46,0.9)",
              borderWidth: 1,
              borderColor: "rgba(124,58,237,0.3)",
            }}
          >
            <MapPin size={12} color={colors.cyan} />
            <Text style={{ fontSize: 12, color: colors.purpleLight, fontWeight: "600" }}>{city}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(26,26,46,0.95)", borderWidth: 1, borderColor: "rgba(124,58,237,0.2)", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 }}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={{ flex: 1, color: colors.text, fontSize: 14, marginLeft: 8 }}
            placeholder="Search arenas, specs or gaming tags..."
            placeholderTextColor="rgba(136,136,170,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{ gap: 8 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <View style={{ width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(26,26,46,0.9)", borderWidth: 1, borderColor: "rgba(136,136,170,0.2)" }}>
              <SlidersHorizontal size={12} color={colors.textMuted} />
            </View>
            {["Open Now", "Free Seats", "VIP Zone"].map((filter) => {
              const active = activeFilters.includes(filter);
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => toggleFilter(filter)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                    borderWidth: 1,
                    backgroundColor: active ? "rgba(124, 58, 237, 0.25)" : "rgba(26, 26, 46, 0.85)",
                    borderColor: active ? "rgba(124, 58, 237, 0.6)" : "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "700", color: active ? "#C084FC" : colors.textMuted }}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <Text style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", fontWeight: "800", alignSelf: "center", marginRight: 4 }}>Radius:</Text>
            {[1, 5, 10, 20].map((r) => {
              const active = searchRadius === r;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setSearchRadius(r)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    borderWidth: 1,
                    backgroundColor: active ? "rgba(6, 182, 212, 0.2)" : "rgba(20, 20, 35, 0.8)",
                    borderColor: active ? "rgba(6, 182, 212, 0.5)" : "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "800", color: active ? colors.cyanLight : colors.textMuted }}>{r} KM</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Found badge */}
      <View style={{ position: "absolute", top: 300, left: 16 }}>
        <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: "rgba(26,26,46,0.8)", borderWidth: 1, borderColor: "rgba(124,58,237,0.2)" }}>
          <Text style={{ fontSize: 10, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase" }}>
            Found: <Text style={{ color: colors.cyan }}>{filteredClubs.length} Arenas</Text>
          </Text>
        </View>
      </View>

      {/* Club drawer */}
      {selectedClub && (
        <View style={{ position: "absolute", bottom: 16, left: 16, right: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: "rgba(124,58,237,0.4)", borderRadius: 24, padding: 16, gap: 14, shadowColor: colors.purple, shadowOpacity: 0.25, shadowRadius: 18 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 10, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Selected Gaming Venue</Text>
            <TouchableOpacity style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center" }} onPress={() => setSelectedClub(null)}>
              <X size={14} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ width: 80, height: 80, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "rgba(124,58,237,0.2)" }}>
              <Image source={{ uri: selectedClub.photos[0] }} style={{ width: "100%", height: "100%" }} />
            </View>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View>
                <Text style={{ fontWeight: "700", fontSize: 16, color: colors.text }}>{selectedClub.name}</Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>{selectedClub.address}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Star size={13} fill={colors.yellow} color={colors.yellow} />
                  <Text style={{ fontWeight: "800", color: colors.text }}>{selectedClub.rating}</Text>
                  <Text style={{ fontSize: 10, color: colors.textMuted }}>({selectedClub.reviewCount})</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>|</Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>From <Text style={{ fontWeight: "800", color: colors.purpleLight }}>${selectedClub.minPricePerHour}/hr</Text></Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <BadgeChip variant="cyan">{selectedClub.availableSeats}/{selectedClub.totalSeats} Free PCs</BadgeChip>
            {selectedClub.zones.map((zone) => (
              <BadgeChip key={zone} variant={zone === "VIP" ? "purple" : zone === "Pro" ? "cyan" : "Standard"}>{zone} Zone</BadgeChip>
            ))}
            <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "700", marginLeft: "auto" }}>OPEN NOW</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("ClubProfile", { clubId: selectedClub.id })}
            style={{
              width: "100%",
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              backgroundColor: colors.purple,
              borderWidth: 1,
              borderColor: "rgba(167, 139, 250, 0.4)",
              shadowColor: colors.purple,
              shadowOpacity: 0.35,
              shadowRadius: 8,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>Book PC in Arena</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
      <CityPicker visible={cityPickerVisible} onClose={() => setCityPickerVisible(false)} />
    </View>
  );
}

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0D1117" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0D1117" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1A1A2E" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0a14" }] },
];
