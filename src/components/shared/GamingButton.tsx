import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../theme";

type Variant = "purple" | "cyan" | "outline-purple" | "outline-cyan" | "ghost" | "destructive";

interface GamingButtonProps {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const variantStyles: Record<Variant, ViewStyle> = {
  purple: {
    backgroundColor: colors.purple,
    borderColor: "rgba(124, 58, 237, 0.6)",
    shadowColor: colors.purple,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  cyan: {
    backgroundColor: colors.cyan,
    borderColor: "rgba(6, 182, 212, 0.6)",
    shadowColor: colors.cyan,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  "outline-purple": {
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    borderColor: "rgba(124, 58, 237, 0.5)",
  },
  "outline-cyan": {
    backgroundColor: "rgba(6, 182, 212, 0.1)",
    borderColor: "rgba(6, 182, 212, 0.5)",
  },
  ghost: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  destructive: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
};

const variantTextColor: Record<Variant, string> = {
  purple: "#FFFFFF",
  cyan: "#0F0F0F",
  "outline-purple": "#7C3AED",
  "outline-cyan": "#06B6D4",
  ghost: "#F1F1F1",
  destructive: "#EF4444",
};

const sizeStyles: Record<string, { paddingV: number; paddingH: number; fontSize: number; borderRadius: number }> = {
  sm: { paddingV: 6, paddingH: 14, fontSize: 13, borderRadius: 10 },
  md: { paddingV: 10, paddingH: 20, fontSize: 15, borderRadius: 12 },
  lg: { paddingV: 14, paddingH: 28, fontSize: 16, borderRadius: 14 },
};

export function GamingButton({
  variant = "purple",
  size = "md",
  children,
  fullWidth,
  onPress,
  disabled,
  loading,
  style,
}: GamingButtonProps) {
  const s = sizeStyles[size];
  return (
    <TouchableOpacity
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        {
          ...variantStyles[variant],
          borderWidth: 1,
          paddingVertical: s.paddingV,
          paddingHorizontal: s.paddingH,
          borderRadius: s.borderRadius,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? "100%" : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantTextColor[variant]} />
      ) : (
        <Text style={{ color: variantTextColor[variant], fontSize: s.fontSize, fontWeight: "600" }}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
