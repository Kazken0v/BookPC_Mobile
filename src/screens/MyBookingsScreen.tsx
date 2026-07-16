import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar, Clock, MapPin, QrCode, X, ChevronRight } from "lucide-react-native";
import { Booking, BookingStatus } from "../data/mockBookings";
import { BadgeChip } from "../components/shared/BadgeChip";
import { GlowCard } from "../components/shared/GlowCard";
import { GamingButton } from "../components/shared/GamingButton";
import { QRCodePlaceholder } from "../components/shared/QRCodePlaceholder";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { colors } from "../theme";
import { useAuth } from "../context/AuthContext";
import { getBookings, updateBooking } from "../services/bookingStore";

type Tab = "upcoming" | "active" | "past";

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: () => void }) {
  const [showQR, setShowQR] = useState(false);
  const isActive = booking.status === "active";
  const isUpcoming = booking.status === "upcoming";

  return (
    <GlowCard glow={isActive ? "cyan" : isUpcoming ? "purple" : "none"} padding="p-0" style={{ overflow: "hidden" }}>
      <View style={{ height: 90, position: "relative" }}>
        <ImageWithFallback source={{ uri: booking.clubPhoto }} style={{ width: "100%", height: "100%" }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(13,13,26,0.7)" }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
          <View>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>{booking.clubName}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
              <BadgeChip variant={booking.zone} size="sm" />
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }}>Seat {booking.seatNumber}</Text>
            </View>
          </View>
          <BadgeChip variant={booking.status} size="sm">
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </BadgeChip>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, width: "45%" }}>
            <Calendar size={14} color={colors.purple} />
            <Text style={{ fontSize: 12, color: colors.text }}>{booking.date}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, width: "45%" }}>
            <Clock size={14} color={colors.cyan} />
            <Text style={{ fontSize: 12, color: colors.text }}>{booking.startTime} – {booking.endTime}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, width: "45%" }}>
            <MapPin size={14} color={colors.textMuted} />
            <Text style={{ fontSize: 12, color: colors.textMuted }}>{booking.duration}h session</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, width: "45%", justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: colors.purpleLight }}>${booking.totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {(isActive || isUpcoming) && (
            <TouchableOpacity
              onPress={() => setShowQR(!showQR)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: "rgba(124,58,237,0.15)",
                borderWidth: 1,
                borderColor: "rgba(124,58,237,0.3)",
              }}
            >
              <QrCode size={16} color={colors.purpleLight} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.purpleLight }}>Check-in QR</Text>
            </TouchableOpacity>
          )}
          {isUpcoming && (
            <GamingButton variant="destructive" size="sm" onPress={onCancel}>
              <X size={14} color="#EF4444" />
              Cancel
            </GamingButton>
          )}
          {booking.status === "past" && (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.05)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textMuted }}>Book Again</Text>
              <ChevronRight size={14} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {showQR && (
          <View style={{ paddingTop: 16, alignItems: "center" }}>
            <QRCodePlaceholder code={booking.qrCode} />
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>
              Show this QR at the reception to check in
            </Text>
          </View>
        )}
      </View>
    </GlowCard>
  );
}

export function MyBookingsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = React.useCallback(async () => {
    if (!user) {
      setBookings([]);
      return;
    }
    setBookings(await getBookings(user.id));
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [load])
  );

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: bookings.filter((b) => b.status === "upcoming").length },
    { key: "active", label: "Active", count: bookings.filter((b) => b.status === "active").length },
    { key: "past", label: "Past", count: bookings.filter((b) => b.status === "past" || b.status === "cancelled").length },
  ];

  const filtered = bookings.filter((b) =>
    activeTab === "upcoming" ? b.status === "upcoming" :
    activeTab === "active" ? b.status === "active" :
    b.status === "past" || b.status === "cancelled"
  );

  const handleCancel = async (id: string) => {
    if (!user) return;
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b))
    );
    await updateBooking(user.id, id, { status: "cancelled" });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 16, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}>
        <View>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "700" }}>My Bookings</Text>
          <Text style={{ fontSize: 14, color: colors.textMuted }}>Track and manage your sessions</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor: active ? "rgba(124,58,237,0.2)" : "rgba(26,26,46,0.8)",
                  borderWidth: 1,
                  borderColor: active ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: active ? colors.purpleLight : colors.textMuted }}>{tab.label}</Text>
                {tab.count > 0 && (
                  <View style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.purple, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>{tab.count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ gap: 12 }}>
          {filtered.length > 0 ? (
            filtered.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={() => handleCancel(booking.id)} />
            ))
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 64, gap: 12 }}>
              <View style={{ width: 64, height: 64, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(124,58,237,0.1)", borderWidth: 1, borderColor: "rgba(124,58,237,0.2)" }}>
                <Calendar size={32} color="#2A2A3E" />
              </View>
              <Text style={{ fontSize: 14, textAlign: "center", color: colors.textMuted }}>
                No {activeTab} bookings yet.{"\n"}
                {activeTab === "upcoming" ? "Find a club and book a session!" : "Your sessions will appear here."}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
