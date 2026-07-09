import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import {
  User, Mail, Phone, Edit2, Bell, Shield, HelpCircle,
  LogOut, ChevronRight, Zap, Trophy, Clock, Star, Crown,
} from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { GlowCard } from "../components/shared/GlowCard";
import { BadgeChip } from "../components/shared/BadgeChip";
import { GamingButton } from "../components/shared/GamingButton";
import { colors } from "../theme";

function LoyaltyWidget({ points, nextLevel }: { points: number; nextLevel: number }) {
  const pct = Math.round((points / nextLevel) * 100);
  return (
    <GlowCard glow="cyan" padding="p-4">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(6,182,212,0.15)" }}>
          <Zap size={20} color={colors.cyanLight} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>{points.toLocaleString()} pts</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>BookPC Loyalty Points</Text>
        </View>
        <BadgeChip variant="cyan">Diamond</BadgeChip>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ fontSize: 12, color: colors.textMuted }}>{points.toLocaleString()} pts</Text>
        <Text style={{ fontSize: 12, color: colors.textMuted }}>{nextLevel.toLocaleString()} pts to Legend</Text>
      </View>
      <View style={{ width: "100%", height: 8, borderRadius: 4, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.08)" }}>
        <View style={{ width: `${pct}%`, height: "100%", borderRadius: 4, backgroundColor: colors.cyan }} />
      </View>
      <Text style={{ fontSize: 12, marginTop: 8, textAlign: "center", color: colors.textMuted }}>
        {nextLevel - points} points away from <Text style={{ color: colors.purpleLight }}>Legend</Text> rank
      </Text>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        {[
          { pts: 500, label: "Free 1hr" },
          { pts: 1000, label: "VIP Access" },
          { pts: 2500, label: "Free Day" },
        ].map((reward) => {
          const unlocked = points >= reward.pts;
          return (
            <TouchableOpacity
              key={reward.pts}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: unlocked ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.04)",
                borderWidth: 1,
                borderColor: unlocked ? "rgba(6,182,212,0.3)" : "rgba(255,255,255,0.08)",
                opacity: unlocked ? 1 : 0.5,
              }}
            >
              <Zap size={12} color={unlocked ? colors.cyanLight : colors.textMuted} />
              <Text style={{ fontSize: 10, fontWeight: "700", marginTop: 2, color: unlocked ? colors.cyanLight : colors.textMuted }}>{reward.pts}p</Text>
              <Text style={{ fontSize: 9, color: colors.textMuted }}>{reward.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </GlowCard>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: React.ComponentType<{ size: number; color: string }>; value: string | number; label: string; color: string }) {
  return (
    <GlowCard glow="none" padding="p-3" style={{ alignItems: "center", gap: 4 }}>
      <Icon size={18} color={color} />
      <Text style={{ fontWeight: "700", color: colors.text, fontSize: 18 }}>{value}</Text>
      <Text style={{ fontSize: 10, textAlign: "center", color: colors.textMuted }}>{label}</Text>
    </GlowCard>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    booking: true,
    promotions: true,
    reminders: true,
    news: false,
  });

  const items = [
    { key: "booking" as const, label: "Booking updates", sub: "Confirmations, changes, check-in" },
    { key: "promotions" as const, label: "Promotions & deals", sub: "Weekend offers, discount codes" },
    { key: "reminders" as const, label: "Session reminders", sub: "30 min before your booking" },
    { key: "news" as const, label: "News & events", sub: "Tournaments, new clubs, features" },
  ];

  return (
    <View style={{ gap: 8 }}>
      {items.map((item) => (
        <View key={item.key} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{item.label}</Text>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>{item.sub}</Text>
          </View>
          <Switch
            value={settings[item.key]}
            onValueChange={(v) => setSettings((s) => ({ ...s, [item.key]: v }))}
            trackColor={{ false: "rgba(255,255,255,0.1)", true: colors.purple }}
            thumbColor="#FFFFFF"
          />
        </View>
      ))}
    </View>
  );
}

function MenuRow({ icon: Icon, label, sub, color = colors.textMuted, onPress, danger }: { icon: React.ComponentType<{ size: number; color: string }>; label: string; sub?: string; color?: string; onPress?: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "rgba(26,26,46,0.6)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: danger ? "rgba(239,68,68,0.12)" : "rgba(124,58,237,0.1)", borderWidth: 1, borderColor: danger ? "rgba(239,68,68,0.25)" : "rgba(124,58,237,0.2)" }}>
        <Icon size={18} color={danger ? colors.redLight : color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: danger ? colors.redLight : colors.text }}>{label}</Text>
        {sub && <Text style={{ fontSize: 12, color: colors.textMuted }}>{sub}</Text>}
      </View>
      <ChevronRight size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.purple,
                shadowColor: colors.purple,
                shadowOpacity: 0.4,
                shadowRadius: 10,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "700", color: "#FFFFFF" }}>{user.name[0]}</Text>
            </View>
            <View style={{ position: "absolute", bottom: -4, right: -4, width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.yellow, borderWidth: 2, borderColor: colors.bg }}>
              <Crown size={10} color="#FFFFFF" />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>{user.name}</Text>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>{user.email}</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
              <BadgeChip variant="yellow" size="sm">Level {user.level}</BadgeChip>
              <BadgeChip variant="purple" size="sm">{user.rank}</BadgeChip>
            </View>
          </View>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(124,58,237,0.15)", borderWidth: 1, borderColor: "rgba(124,58,237,0.3)" }}>
            <Edit2 size={16} color={colors.purpleLight} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}><StatCard icon={Trophy} value={user.totalBookings} label="Bookings" color={colors.purpleLight} /></View>
          <View style={{ flex: 1 }}><StatCard icon={Clock} value={`${user.totalHours}h`} label="Hours played" color={colors.cyanLight} /></View>
          <View style={{ flex: 1 }}><StatCard icon={Star} value={user.rank} label="Rank" color={colors.yellow} /></View>
        </View>

        <LoyaltyWidget points={user.bonusPoints} nextLevel={user.pointsToNextLevel} />

        <GlowCard glow="none">
          <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>Account Info</Text>
          <View style={{ gap: 10 }}>
            {[
              { icon: User, label: user.name, sub: "Display name" },
              { icon: Mail, label: user.email, sub: "Email address" },
              { icon: Phone, label: user.phone, sub: "Phone number" },
            ].map((item) => (
              <View key={item.sub} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <item.icon size={16} color={colors.textMuted} />
                <View>
                  <Text style={{ fontSize: 14, color: colors.text }}>{item.label}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{item.sub}</Text>
                </View>
              </View>
            ))}
            <Text style={{ fontSize: 12, color: colors.textMuted }}>Member since {user.memberSince}</Text>
          </View>
        </GlowCard>

        <GlowCard glow="none">
          <TouchableOpacity style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={() => setNotifOpen(!notifOpen)}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Bell size={16} color={colors.purple} />
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Notifications</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} style={{ transform: [{ rotate: notifOpen ? "90deg" : "0deg" }] } as any} />
          </TouchableOpacity>
          {notifOpen && (
            <View style={{ marginTop: 16 }}>
              <NotificationSettings />
            </View>
          )}
        </GlowCard>

        <View style={{ gap: 8 }}>
          <MenuRow icon={Shield} label="Privacy & Security" sub="Password, 2FA, data" color={colors.purpleLight} />
          <MenuRow icon={HelpCircle} label="Help & Support" sub="FAQ, contact, feedback" color={colors.cyanLight} />
          <MenuRow icon={LogOut} label="Log Out" danger onPress={handleLogout} />
        </View>

        <Text style={{ textAlign: "center", fontSize: 12, color: "#555570" }}>BookPC v1.0.0 · Made for gamers</Text>
      </View>
    </ScrollView>
  );
}
