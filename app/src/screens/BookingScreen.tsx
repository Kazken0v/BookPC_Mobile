import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Calendar, Clock, Minus, Plus, Zap, ChevronLeft, ChevronRight } from "lucide-react-native";
import { format, addDays, startOfDay } from "date-fns";
import { Zone } from "../data/mockClubs";
import { useClubs } from "../context/ClubContext";
import { useBooking } from "../context/BookingContext";
import { ScreenHeader } from "../components/shared/ScreenHeader";
import { GlowCard } from "../components/shared/GlowCard";
import { GamingButton } from "../components/shared/GamingButton";
import { BadgeChip } from "../components/shared/BadgeChip";
import { SeatGrid } from "../components/shared/SeatGrid";
import { colors, zoneColor } from "../theme";

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
  "21:00", "22:00", "23:00",
];

export function BookingScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { clubId } = route.params;
  const { getClubById } = useClubs();
  const { booking, setDate, setTime, toggleSeat, setZone, setDuration, totalPrice } = useBooking();

  const club = getClubById(clubId);

  const today = startOfDay(new Date());
  const dateOptions = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  const [dateScroll, setDateScroll] = useState(0);

  useEffect(() => {
    if (!booking.selectedDate) setDate(format(today, "yyyy-MM-dd"));
    if (!booking.selectedTime) setTime("18:00");
    if (!booking.selectedZone && club) setZone(club.zones[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!club) return null;

  const availableZones = club.zones;
  const endTime = booking.selectedTime
    ? (() => {
        const [h] = booking.selectedTime.split(":").map(Number);
        const endH = (h + booking.duration) % 24;
        return `${String(endH).padStart(2, "0")}:00`;
      })()
    : "";

  const canProceed =
    booking.selectedDate && booking.selectedTime && booking.selectedSeats.length > 0 && booking.selectedZone;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Book a Seat" />
        <View style={{ gap: 20, paddingHorizontal: 16, paddingTop: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(124,58,237,0.1)", borderWidth: 1, borderColor: "rgba(124,58,237,0.2)" }}>
            <Zap size={14} color={colors.purpleLight} />
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.purpleLight }}>{club.name}</Text>
          </View>

          <GlowCard glow="purple">
            <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 12, fontSize: 14 }}>Select Zone</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {availableZones.map((z) => {
                const active = booking.selectedZone === z;
                const color = zoneColor[z];
                return (
                  <TouchableOpacity
                    key={z}
                    onPress={() => setZone(z)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: active
                        ? z === "VIP" ? "rgba(124,58,237,0.3)" : z === "Pro" ? "rgba(6,182,212,0.25)" : "rgba(255,255,255,0.1)"
                        : "rgba(15,15,15,0.6)",
                      borderWidth: 1,
                      borderColor: active ? color : "rgba(255,255,255,0.08)",
                      shadowColor: active ? color : undefined,
                      shadowOpacity: active ? 0.25 : 0,
                      shadowRadius: 8,
                    }}
                  >
                    <BadgeChip variant={z} />
                    <Text style={{ fontSize: 12, color, opacity: 0.8 }}>
                      ${club.pcs.find((p) => p.zone === z)?.pricePerHour ?? "—"}/hr
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlowCard>

          <GlowCard glow="none">
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Calendar size={16} color={colors.purple} />
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Select Date</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <TouchableOpacity onPress={() => setDateScroll(Math.max(0, dateScroll - 3))} style={{ padding: 4, borderRadius: 8, backgroundColor: "rgba(124,58,237,0.1)" }}>
                  <ChevronLeft size={14} color={colors.purple} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDateScroll(Math.min(7, dateScroll + 3))} style={{ padding: 4, borderRadius: 8, backgroundColor: "rgba(124,58,237,0.1)" }}>
                  <ChevronRight size={14} color={colors.purple} />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {dateOptions.slice(dateScroll, dateScroll + 7).map((date) => {
                  const key = format(date, "yyyy-MM-dd");
                  const isSelected = booking.selectedDate === key;
                  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setDate(key)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        minWidth: 50,
                        backgroundColor: isSelected ? colors.purple : "rgba(15,15,15,0.6)",
                        borderWidth: 1,
                        borderColor: isSelected ? colors.purple : "rgba(255,255,255,0.08)",
                        shadowColor: isSelected ? colors.purple : undefined,
                        shadowOpacity: isSelected ? 0.4 : 0,
                        shadowRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 10, textTransform: "uppercase", fontWeight: "600", color: isSelected ? "rgba(255,255,255,0.8)" : colors.textMuted }}>{format(date, "EEE")}</Text>
                      <Text style={{ fontSize: 16, fontWeight: "700", color: isSelected ? "#FFFFFF" : colors.textDim }}>{format(date, "d")}</Text>
                      <Text style={{ fontSize: 10, color: isSelected ? "rgba(255,255,255,0.7)" : colors.textMuted }}>{isToday ? "Today" : format(date, "MMM")}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </GlowCard>

          <GlowCard glow="none">
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Clock size={16} color={colors.cyan} />
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Select Time</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = booking.selectedTime === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => setTime(slot)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 4,
                      width: "18%",
                      borderRadius: 12,
                      alignItems: "center",
                      backgroundColor: isSelected ? "rgba(6,182,212,0.25)" : "rgba(15,15,15,0.6)",
                      borderWidth: 1,
                      borderColor: isSelected ? colors.cyan : "rgba(255,255,255,0.08)",
                      shadowColor: isSelected ? colors.cyan : undefined,
                      shadowOpacity: isSelected ? 0.3 : 0,
                      shadowRadius: 6,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "600", color: isSelected ? colors.cyanLight : colors.textMuted }}>{slot}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlowCard>

          <GlowCard glow="none">
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>Duration</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <TouchableOpacity
                  onPress={() => setDuration(Math.max(1, booking.duration - 1))}
                  style={{ width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(124,58,237,0.15)", borderWidth: 1, borderColor: "rgba(124,58,237,0.3)" }}
                >
                  <Minus size={16} color={colors.purpleLight} />
                </TouchableOpacity>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>{booking.duration}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>hours</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setDuration(Math.min(8, booking.duration + 1))}
                  style={{ width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(124,58,237,0.15)", borderWidth: 1, borderColor: "rgba(124,58,237,0.3)" }}
                >
                  <Plus size={16} color={colors.purpleLight} />
                </TouchableOpacity>
              </View>
              {booking.selectedTime && (
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>Session time</Text>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.text }}>
                    {booking.selectedTime} – {endTime}
                  </Text>
                </View>
              )}
            </View>
          </GlowCard>

          <GlowCard glow="purple">
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>Select Seat</Text>
            <SeatGrid
              pcs={club.pcs}
              selectedZone={booking.selectedZone}
              selectedSeatIds={booking.selectedSeats.map((s) => s.id)}
              onSelectSeat={(pc) => toggleSeat(pc)}
            />
          </GlowCard>

          {booking.selectedSeats.length > 0 && (
            <GlowCard glow="cyan">
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
                Price Summary {booking.selectedSeats.length > 1 ? `· ${booking.selectedSeats.length} seats` : ""}
              </Text>
              <View style={{ gap: 8 }}>
                {booking.selectedSeats.map((seat) => (
                  <View key={seat.id} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 14, color: colors.textMuted }}>Seat {seat.seatNumber}</Text>
                    <Text style={{ fontSize: 14, color: colors.textDim }}>${seat.pricePerHour}/hr</Text>
                  </View>
                ))}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, color: colors.textMuted }}>Duration</Text>
                  <Text style={{ fontSize: 14, color: colors.textDim }}>{booking.duration} hours</Text>
                </View>
                <View style={{ height: 1, marginVertical: 4, backgroundColor: "rgba(255,255,255,0.08)" }} />
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontWeight: "700", color: colors.text }}>Total</Text>
                  <Text style={{ fontWeight: "700", color: colors.cyanLight, fontSize: 18 }}>${totalPrice.toFixed(2)}</Text>
                </View>
              </View>
            </GlowCard>
          )}

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
        {totalPrice > 0 && (
          <Text style={{ textAlign: "center", fontSize: 12, marginBottom: 8, color: colors.textMuted }}>
            Total: <Text style={{ fontWeight: "700", color: colors.cyanLight }}>${totalPrice.toFixed(2)}</Text>
          </Text>
        )}
        <GamingButton
          variant="purple"
          size="lg"
          fullWidth
          disabled={!canProceed}
          onPress={() => navigation.navigate("Payment", { clubId })}
        >
          <Zap size={18} color="#FFFFFF" />
          Proceed to Payment
        </GamingButton>
      </View>
    </View>
  );
}
