import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MapPin, Clock, Star, Monitor, Cpu, Zap, ChevronDown, ChevronUp, CircleCheckBig } from "lucide-react-native";
import { mockClubs, Zone, PCSpec, Review } from "../data/mockClubs";
import { ScreenHeader } from "../components/shared/ScreenHeader";
import { StarRating } from "../components/shared/StarRating";
import { BadgeChip } from "../components/shared/BadgeChip";
import { GlowCard } from "../components/shared/GlowCard";
import { GamingButton } from "../components/shared/GamingButton";
import { useBooking } from "../context/BookingContext";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { colors, zoneColor } from "../theme";

function PhotoGallery({ photos }: { photos: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <View style={{ gap: 8 }}>
      <View style={{ height: 220, borderRadius: 0, overflow: "hidden" }}>
        <ImageWithFallback source={{ uri: photos[active] }} style={{ width: "100%", height: "100%" }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(13,13,26,0.3)" }} />
        <View style={{ position: "absolute", bottom: 12, left: "50%", marginLeft: -40, flexDirection: "row", gap: 6 }}>
          {photos.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActive(i)}
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === active ? colors.purple : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {photos.map((photo, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActive(i)}
            style={{
              width: 60,
              height: 44,
              borderRadius: 12,
              overflow: "hidden",
              borderWidth: 2,
              borderColor: i === active ? colors.purple : "transparent",
              opacity: i === active ? 1 : 0.6,
            }}
          >
            <ImageWithFallback source={{ uri: photo }} style={{ width: "100%", height: "100%" }} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function PCSpecCard({ pc }: { pc: PCSpec }) {
  const [expanded, setExpanded] = useState(false);
  const color = zoneColor[pc.zone];
  const isAvail = pc.status === "available";

  return (
    <GlowCard glow={pc.zone === "VIP" ? "purple" : pc.zone === "Pro" ? "cyan" : "none"} padding="p-3">
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Monitor size={16} color={color} />
          <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>{pc.seatNumber}</Text>
          <BadgeChip variant={pc.zone} size="sm" />
        </View>
        <Text style={{ fontSize: 12, fontWeight: "700", color: isAvail ? colors.green : colors.red }}>
          {isAvail ? "● Available" : "● Occupied"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, width: "48%" }}>
          <Zap size={12} color={colors.purpleLight} />
          <Text style={{ fontSize: 12, color: colors.textDim }}>{pc.gpu}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, width: "48%" }}>
          <Monitor size={12} color={colors.cyanLight} />
          <Text style={{ fontSize: 12, color: colors.textDim }}>{pc.hz}Hz</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, width: "48%" }}>
          <Cpu size={12} color={colors.yellowLight} />
          <Text style={{ fontSize: 12, color: colors.textDim }}>{pc.ram}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, width: "48%" }}>
          <Cpu size={12} color={colors.redLight} />
          <Text style={{ fontSize: 12, color: colors.textDim }}>{pc.cpu}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color }}>${pc.pricePerHour}/hr</Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>Peripherals</Text>
          {expanded ? <ChevronUp size={12} color={colors.textMuted} /> : <ChevronDown size={12} color={colors.textMuted} />}
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={{ paddingTop: 8, marginTop: 8, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)", gap: 4 }}>
          {pc.peripherals.map((p) => (
            <View key={p} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <CircleCheckBig size={11} color={colors.green} />
              <Text style={{ fontSize: 12, color: colors.textMuted }}>{p}</Text>
            </View>
          ))}
        </View>
      )}
    </GlowCard>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.purple,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>{review.userName[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{review.userName}</Text>
            <BadgeChip variant="purple" size="sm">Lvl {review.userLevel}</BadgeChip>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <StarRating rating={review.rating} size={11} showValue={false} />
            <Text style={{ fontSize: 12, color: colors.textMuted }}>{review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 14, color: colors.textSoft, lineHeight: 20 }}>{review.text}</Text>
      <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
    </View>
  );
}

export function ClubProfileScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { clubId } = route.params;
  const { setClub, setZone } = useBooking();
  const [activeZone, setActiveZone] = useState<Zone | "All">("All");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const club = mockClubs.find((c) => c.id === clubId);

  if (!club) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.textMuted }}>Club not found</Text>
      </View>
    );
  }

  const filteredPCs = activeZone === "All" ? club.pcs : club.pcs.filter((p) => p.zone === activeZone);
  const displayedReviews = showAllReviews ? club.reviews : club.reviews.slice(0, 3);

  const handleBookNow = () => {
    setClub(club.id, club.name);
    if (activeZone !== "All") setZone(activeZone);
    navigation.navigate("Booking", { clubId: club.id });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ position: "relative" }}>
          <PhotoGallery photos={club.photos} />
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
            <ScreenHeader title={club.name} transparent />
          </View>
        </View>

        <View style={{ gap: 20, paddingHorizontal: 16, paddingTop: 16 }}>
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>{club.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <MapPin size={13} color={colors.textMuted} />
                  <Text style={{ fontSize: 14, color: colors.textMuted }}>{club.address}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <StarRating rating={club.rating} size={14} />
                <Text style={{ fontSize: 12, marginTop: 2, color: colors.textMuted }}>{club.reviewCount} reviews</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {club.tags.map((tag) => (
                <View
                  key={tag}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#A0A0B8" }}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <GlowCard glow="none">
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Clock size={16} color={colors.purple} />
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Opening Hours</Text>
            </View>
            <View style={{ gap: 6 }}>
              {club.openingHours.map((h) => (
                <View key={h.day} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 14, color: colors.textMuted }}>{h.day}</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{h.hours}</Text>
                </View>
              ))}
            </View>
          </GlowCard>

          <View>
            <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 12, fontSize: 16 }}>Available PCs</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 4, paddingRight: 16 }}>
              <View style={{ flexDirection: "row", gap: 4, backgroundColor: "rgba(13,13,26,0.8)", borderRadius: 12, padding: 4 }}>
                {(["All", ...club.zones] as const).map((z) => {
                  const active = activeZone === z;
                  const bg = active ? (z === "VIP" ? colors.purple : z === "Pro" ? colors.cyan : "#2A2A3E") : "transparent";
                  const fg = active ? (z === "Standard" ? colors.textDim : "#FFFFFF") : colors.textMuted;
                  return (
                    <TouchableOpacity
                      key={z}
                      onPress={() => setActiveZone(z as Zone | "All")}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: bg,
                        shadowColor: active ? colors.purple : undefined,
                        shadowOpacity: active ? 0.3 : 0,
                        shadowRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "600", color: fg, whiteSpace: "nowrap" } as any}>{z}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={{ gap: 12, marginTop: 16 }}>
              {filteredPCs.slice(0, 6).map((pc) => (
                <PCSpecCard key={pc.id} pc={pc} />
              ))}
            </View>
          </View>

          <GlowCard glow="cyan">
            <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 12, fontSize: 14 }}>Pricing Overview</Text>
            <View style={{ gap: 8 }}>
              {club.zones.map((zone) => {
                const pc = club.pcs.find((p) => p.zone === zone);
                const color = zoneColor[zone];
                return (
                  <View key={zone} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <BadgeChip variant={zone} />
                      <Text style={{ fontSize: 14, color: colors.textSoft }}>{zone} seats</Text>
                    </View>
                    <Text style={{ fontWeight: "700", fontSize: 14, color }}>${pc?.pricePerHour ?? "—"}/hr</Text>
                  </View>
                );
              })}
            </View>
          </GlowCard>

          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>Reviews</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Star size={14} fill={colors.yellow} color={colors.yellow} />
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.text }}>{club.rating}</Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>({club.reviewCount})</Text>
              </View>
            </View>
            <View style={{ gap: 12 }}>
              {displayedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </View>
            {club.reviews.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowAllReviews(!showAllReviews)}
                style={{
                  width: "100%",
                  marginTop: 12,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: "rgba(124,58,237,0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(124,58,237,0.2)",
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "600", color: colors.purpleLight }}>
                  {showAllReviews ? "Show less" : `See all ${club.reviews.length} reviews`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: "rgba(13,13,26,0.98)",
        }}
      >
        <GamingButton variant="purple" size="lg" fullWidth onPress={handleBookNow}>
          <Zap size={18} color="#FFFFFF" />
          Book Now — from ${club.minPricePerHour}/hr
        </GamingButton>
      </View>
    </View>
  );
}
