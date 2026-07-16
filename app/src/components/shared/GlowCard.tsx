import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../theme";

interface GlowCardProps {
  children: React.ReactNode;
  glow?: "purple" | "cyan" | "none";
  padding?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const paddingMap: Record<string, number> = {
  "p-0": 0,
  "p-3": 12,
  "p-4": 16,
};

const glowMap = {
  purple: {
    borderColor: "rgba(124, 58, 237, 0.3)",
    shadowColor: colors.purple,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  cyan: {
    borderColor: "rgba(6, 182, 212, 0.3)",
    shadowColor: colors.cyan,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  none: {
    borderColor: "rgba(255,255,255,0.08)",
  },
};

export function GlowCard({
  children,
  glow = "purple",
  padding = "16px",
  className = "",
  style,
}: GlowCardProps) {
  const glowStyle = glowMap[glow];
  return (
    <View
      className={`rounded-2xl ${className}`}
      style={[
        {
          backgroundColor: colors.card,
          borderWidth: 1,
          padding: paddingMap[padding] ?? 16,
          ...glowStyle,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
