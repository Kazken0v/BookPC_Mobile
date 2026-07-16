import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CreditCard, Wallet, Smartphone, CircleCheckBig, Zap, Shield } from "lucide-react-native";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import { ScreenHeader } from "../components/shared/ScreenHeader";
import { GlowCard } from "../components/shared/GlowCard";
import { GamingButton } from "../components/shared/GamingButton";
import { BadgeChip } from "../components/shared/BadgeChip";
import { showToast } from "../services/toast";
import { colors } from "../theme";
import { Booking } from "../data/mockBookings";
import { mockClubs } from "../data/mockClubs";
import { addBooking } from "../services/bookingStore";
import { notifyBookingConfirmed, hasNotificationPermission } from "../services/notifications";

type PaymentMethod = "card" | "applepay" | "googlepay" | "wallet";

interface Method {
  id: PaymentMethod;
  label: string;
  sub: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
}

const METHODS: Method[] = [
  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex", icon: CreditCard, color: colors.purpleLight },
  { id: "googlepay", label: "Google Pay", sub: "Pay with Google account", icon: Smartphone, color: colors.cyanLight },
  { id: "applepay", label: "Apple Pay", sub: "Pay with Face ID / Touch ID", icon: Smartphone, color: colors.text },
  { id: "wallet", label: "BookPC Wallet", sub: "Balance: $45.00 · 320 pts", icon: Wallet, color: colors.greenLight },
];

export function PaymentScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { clubId } = route.params;
  const { user } = useAuth();
  const { booking, totalPrice, resetBooking } = useBooking();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      if (user) {
        const club = mockClubs.find((c) => c.id === clubId);
        const start = booking.selectedTime || "18:00";
        const [h, m] = start.split(":").map(Number);
        const endH = (h + booking.duration) % 24;
        const endTime = `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const baseDate = booking.selectedDate || new Date().toISOString().slice(0, 10);
        const seats = booking.selectedSeats;
        const newBookings: Booking[] = seats.map((seat, i) => ({
          id: `bk-${Date.now()}-${i}`,
          clubId,
          clubName: booking.clubName,
          clubPhoto: club?.photos?.[0] ?? "",
          date: baseDate,
          startTime: start,
          endTime,
          seatId: seat.id,
          seatNumber: seat.seatNumber,
          zone: seat.zone,
          totalPrice: seat.pricePerHour * booking.duration,
          status: "upcoming",
          qrCode: `BK-${user.id}-${seat.seatNumber}`,
          duration: booking.duration,
        }));
        for (const b of newBookings) {
          await addBooking(user.id, b);
        }
        await notifyBookingConfirmed(newBookings[0]);
      }
      resetBooking();
      if (!(await hasNotificationPermission())) {
        const seatCount = booking.selectedSeats.length;
        showToast({
          type: "success",
          text1: "Booking confirmed! 🎮",
          text2:
            seatCount > 1
              ? `${seatCount} seats at ${booking.clubName} are all yours.`
              : `Seat ${booking.selectedSeats[0]?.seatNumber} at ${booking.clubName} is all yours.`,
          position: "top",
        });
      }
      navigation.navigate("Main", { screen: "Bookings" });
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Payment" />
        <View style={{ gap: 20, paddingHorizontal: 16, paddingTop: 16 }}>
          <GlowCard glow="purple">
            <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 12, fontSize: 14 }}>Order Summary</Text>
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={{ fontSize: 14, color: colors.textMuted }}>Club</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, textAlign: "right", maxWidth: 180 }}>{booking.clubName}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: colors.textMuted }}>Zone</Text>
                {booking.selectedSeats.length === 1 ? (
                  <BadgeChip variant={booking.selectedSeats[0].zone} />
                ) : (
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Multiple</Text>
                )}
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: colors.textMuted }}>Seats</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, textAlign: "right", maxWidth: 200 }}>
                  {booking.selectedSeats.map((s) => s.seatNumber).join(", ")}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: colors.textMuted }}>Date</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{booking.selectedDate}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: colors.textMuted }}>Time</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{booking.selectedTime} ({booking.duration}h)</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: colors.textMuted }}>Rate</Text>
                <Text style={{ fontSize: 14, color: colors.textDim }}>
                  {booking.selectedSeats.length} × ${booking.selectedSeats[0]?.pricePerHour ?? 0}/hr × {booking.duration}h
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontWeight: "700", color: colors.text }}>Total</Text>
                <Text style={{ fontWeight: "700", color: colors.cyanLight, fontSize: 20 }}>${totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </GlowCard>

          <View>
            <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 12, fontSize: 14 }}>Payment Method</Text>
            <View style={{ gap: 10 }}>
              {METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => setSelectedMethod(method.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      padding: 16,
                      borderRadius: 16,
                      backgroundColor: isSelected ? "rgba(124,58,237,0.12)" : "rgba(26,26,46,0.7)",
                      borderWidth: 1,
                      borderColor: isSelected ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)",
                      shadowColor: isSelected ? colors.purple : undefined,
                      shadowOpacity: isSelected ? 0.15 : 0,
                      shadowRadius: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isSelected ? `${method.color}22` : "rgba(255,255,255,0.06)",
                        borderWidth: 1,
                        borderColor: isSelected ? `${method.color}50` : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <Icon size={20} color={isSelected ? method.color : colors.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: isSelected ? colors.text : colors.textSoft }}>{method.label}</Text>
                      <Text style={{ fontSize: 12, color: colors.textMuted }}>{method.sub}</Text>
                    </View>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: isSelected ? colors.purple : "rgba(255,255,255,0.2)",
                        backgroundColor: isSelected ? colors.purple : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFFFFF" }} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(16,185,129,0.08)", borderWidth: 1, borderColor: "rgba(16,185,129,0.2)" }}>
            <Shield size={14} color={colors.greenLight} />
            <Text style={{ fontSize: 12, color: colors.greenLight }}>256-bit SSL encrypted · Your payment is secure</Text>
          </View>

          <GlowCard glow="cyan">
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(6,182,212,0.15)" }}>
                <Zap size={18} color={colors.cyanLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Earn Bonus Points</Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>
                  You'll earn <Text style={{ color: colors.cyanLight, fontWeight: "600" }}>+{Math.round(totalPrice * 10)} pts</Text> for this booking
                </Text>
              </View>
            </View>
          </GlowCard>

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
        <GamingButton variant="purple" size="lg" fullWidth onPress={handleConfirm} loading={loading}>
          <CircleCheckBig size={18} color="#FFFFFF" />
          Confirm Booking · ${totalPrice.toFixed(2)}
        </GamingButton>
      </View>
    </View>
  );
}
