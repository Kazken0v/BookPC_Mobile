import React from "react";
import { Text, View } from "react-native";
import { colors } from "../../theme";

type ChipVariant =
  | "VIP"
  | "Pro"
  | "Standard"
  | "upcoming"
  | "active"
  | "past"
  | "cancelled"
  | "purple"
  | "cyan"
  | "green"
  | "yellow";

interface BadgeChipProps {
  variant: ChipVariant;
  children?: React.ReactNode;
  size?: "sm" | "md";
}

const variantMap: Record<ChipVariant, { bg: string; color: string; border: string }> = {
  VIP: { bg: "rgba(124, 58, 237, 0.2)", color: colors.purpleLight, border: "rgba(124, 58, 237, 0.4)" },
  Pro: { bg: "rgba(6, 182, 212, 0.15)", color: colors.cyanLight, border: "rgba(6, 182, 212, 0.4)" },
  Standard: { bg: "rgba(255,255,255,0.08)", color: "#A0A0B8", border: "rgba(255,255,255,0.15)" },
  upcoming: { bg: "rgba(124, 58, 237, 0.15)", color: colors.purpleLight, border: "rgba(124, 58, 237, 0.3)" },
  active: { bg: "rgba(16, 185, 129, 0.15)", color: colors.greenLight, border: "rgba(16, 185, 129, 0.3)" },
  past: { bg: "rgba(255,255,255,0.06)", color: colors.textMuted, border: "rgba(255,255,255,0.1)" },
  cancelled: { bg: "rgba(239, 68, 68, 0.12)", color: colors.redLight, border: "rgba(239, 68, 68, 0.3)" },
  purple: { bg: "rgba(124, 58, 237, 0.15)", color: colors.purpleLight, border: "rgba(124, 58, 237, 0.3)" },
  cyan: { bg: "rgba(6, 182, 212, 0.15)", color: colors.cyanLight, border: "rgba(6, 182, 212, 0.3)" },
  green: { bg: "rgba(16, 185, 129, 0.15)", color: colors.greenLight, border: "rgba(16, 185, 129, 0.3)" },
  yellow: { bg: "rgba(245, 158, 11, 0.15)", color: colors.yellowLight, border: "rgba(245, 158, 11, 0.3)" },
};

export function BadgeChip({ variant, children, size = "sm" }: BadgeChipProps) {
  const style = variantMap[variant];
  const label = children ?? variant;
  const fontSize = size === "sm" ? 11 : 13;
  const paddingV = size === "sm" ? 2 : 4;
  const paddingH = size === "sm" ? 8 : 12;

  return (
    <View
      style={{
        backgroundColor: style.bg,
        borderWidth: 1,
        borderColor: style.border,
        borderRadius: 8,
        paddingVertical: paddingV,
        paddingHorizontal: paddingH,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: style.color, fontSize, fontWeight: "600", letterSpacing: 0.3 }}>
        {label}
      </Text>
    </View>
  );
}
