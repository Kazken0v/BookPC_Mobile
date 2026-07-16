import React, { useState, useMemo } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search, MapPin, Star, Clock, Zap, ChevronRight, Wifi, Trophy } from "lucide-react-native";
import { mockClubs, Club, Zone } from "../data/mockClubs";
import { useAuth } from "../context/AuthContext";
import { StarRating } from "../components/shared/StarRating";
import { BadgeChip } from "../components/shared/BadgeChip";
import { GlowCard } from "../components/shared/GlowCard";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { colors } from "../theme";

type SortOption = "rating" | "distance" | "price" | "seats";
type ZoneFilter = Zone | "All";

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "rgba(26, 26, 46, 0.9)",
        borderWidth: 1,
        borderColor: "rgba(124, 58, 237, 0.2)",
      }}
    >
      <Search size={18} color="#8888AA" />
      <TextInput
        style={{ flex: 1, color: colors.text, fontSize: 14 }}
        placeholder="Search clubs, zones, locations..."
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

function FilterBar({
  sort,
  setSort,
  zone,
  setZone,
}: {
  sort: SortOption;
  setSort: (s: SortOption) => void;
  zone: ZoneFilter;
  setZone: (z: ZoneFilter) => void;
}) {
  const sorts: { key: SortOption; label: string }[] = [
    { key: "rating", label: "Top Rated" },
    { key: "distance", label: "Nearby" },
    { key: "price", label: "Cheapest" },
    { key: "seats", label: "Available" },
  ];
  const zones: ZoneFilter[] = ["All", "VIP", "Pro", "Standard"];

  return (
    <View style={{ gap: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {sorts.map((s) => (
            <TouchableOpacity
              key={s.key}
              onPress={() => setSort(s.key)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                backgroundColor: sort === s.key ? "rgba(124, 58, 237, 0.25)" : "rgba(26,26,46,0.8)",
                borderWidth: 1,
                borderColor: sort === s.key ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: sort === s.key ? colors.purpleLight : colors.textMuted, whiteSpace: "nowrap" } as any}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {zones.map((z) => {
            const active = zone === z;
            const bg = active
              ? z === "VIP" ? "rgba(124,58,237,0.25)" : z === "Pro" ? "rgba(6,182,212,0.2)" : z === "Standard" ? "rgba(255,255,255,0.1)" : "rgba(124,58,237,0.15)"
              : "rgba(26,26,46,0.8)";
            const fg = active
              ? z === "VIP" ? colors.purpleLight : z === "Pro" ? colors.cyanLight : z === "Standard" ? "#D0D0E8" : colors.purpleLight
              : colors.textMuted;
            return (
              <TouchableOpacity
                key={z}
                onPress={() => setZone(z)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: bg,
                  borderWidth: 1,
                  borderColor: active ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: fg, whiteSpace: "nowrap" } as any}>{z}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function FeaturedBanner() {
  return (
    <View style={{ height: 140, borderRadius: 16, overflow: "hidden" }}>
      <ImageWithFallback source={{ uri: "https://images.unsplash.com/photo-1701281941392-fd6c2d8d652b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800" }} style={{ width: "100%", height: "100%" }} />
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(124,58,237,0.85)" }} />
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "flex-end", padding: 16 }}>
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.2)", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>🔥 WEEKEND DEAL</Text>
          </View>
        </View>
        <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 18 }}>30% OFF VIP seats</Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>
          This weekend only · Use code <Text style={{ color: colors.cyanLight, fontWeight: "700" }}>LEVEL30</Text>
        </Text>
      </View>
    </View>
  );
}

function ClubCard({ club, index, onPress }: { club: Club; index: number; onPress: () => void }) {
  const availColor =
    club.availableSeats > 10 ? "rgba(16,185,129,0.85)" : club.availableSeats > 3 ? "rgba(245,158,11,0.85)" : "rgba(239,68,68,0.85)";

  return (
    <TouchableOpacity activeOpacity={0.97} onPress={onPress}>
      <GlowCard padding="p-0" style={{ overflow: "hidden" }}>
        <View style={{ height: 140, position: "relative" }}>
          <ImageWithFallback source={{ uri: club.photos[0] }} style={{ width: "100%", height: "100%" }} />
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(13,13,26,0.5)" }} />
          <View style={{ position: "absolute", top: 12, right: 12 }}>
            <Text style={{ fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontWeight: "600", color: "#FFFFFF", backgroundColor: availColor }}>
              {club.availableSeats} seats
            </Text>
          </View>
          <View style={{ position: "absolute", bottom: 12, left: 12, flexDirection: "row", gap: 6 }}>
            {club.zones.map((z) => (
              <BadgeChip key={z} variant={z} size="sm" />
            ))}
          </View>
        </View>

        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>{club.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <MapPin size={11} color={colors.textMuted} />
                <Text style={{ fontSize: 12, color: colors.textMuted }}>{club.address}</Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end", gap: 2 }}>
              <StarRating rating={club.rating} size={11} showValue />
              <Text style={{ fontSize: 12, color: colors.textMuted }}>{club.reviewCount} reviews</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <MapPin size={11} color={colors.cyan} />
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.cyan }}>{club.distance}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Clock size={11} color={colors.textMuted} />
                <Text style={{ fontSize: 12, color: colors.textMuted }}>{club.openingHours[0].hours}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>from</Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.purpleLight }}>${club.minPricePerHour}/hr</Text>
              <ChevronRight size={14} color={colors.purple} />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {club.tags.slice(0, 3).map((tag) => (
              <View
                key={tag}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <Text style={{ fontSize: 10, color: colors.textMuted }}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </GlowCard>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("rating");
  const [zone, setZone] = useState<ZoneFilter>("All");

  const filtered = useMemo(() => {
    let clubs = [...mockClubs];
    if (search) clubs = clubs.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase()));
    if (zone !== "All") clubs = clubs.filter((c) => c.zones.includes(zone as Zone));
    if (sort === "rating") clubs.sort((a, b) => b.rating - a.rating);
    else if (sort === "price") clubs.sort((a, b) => a.minPricePerHour - b.minPricePerHour);
    else if (sort === "seats") clubs.sort((a, b) => b.availableSeats - a.availableSeats);
    else clubs.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    return clubs;
  }, [search, sort, zone]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 16, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 14, color: colors.textMuted }}>Good gaming, {user?.name.split(" ")[0] ?? "Player"} 👾</Text>
            <Text style={{ fontSize: 22, fontWeight: "700", color: colors.text }}>Find Your Arena</Text>
          </View>
          <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(124, 58, 237, 0.15)", borderWidth: 1, borderColor: "rgba(124, 58, 237, 0.3)" }}>
            <Trophy size={20} color={colors.purpleLight} />
          </View>
        </View>

        <FeaturedBanner />
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar sort={sort} setSort={setSort} zone={zone} setZone={setZone} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{filtered.length} clubs found</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Wifi size={12} color={colors.green} />
            <Text style={{ fontSize: 12, color: colors.green }}>Live availability</Text>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          {filtered.map((club, i) => (
            <ClubCard
              key={club.id}
              club={club}
              index={i}
              onPress={() => navigation.navigate("ClubProfile", { clubId: club.id })}
            />
          ))}
          {filtered.length === 0 && (
            <View style={{ alignItems: "center", paddingVertical: 48, gap: 12 }}>
              <Zap size={40} color="#2A2A3E" />
              <Text style={{ fontSize: 14, textAlign: "center", color: colors.textMuted }}>
                No clubs match your filters.{"\n"}Try adjusting the search.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
