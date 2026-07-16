export const colors = {
  bg: "#0F0F0F",
  bgDeep: "#0D0D1A",
  card: "#1A1A2E",
  purple: "#7C3AED",
  purpleLight: "#A78BFA",
  cyan: "#06B6D4",
  cyanLight: "#22D3EE",
  green: "#10B981",
  greenLight: "#34D399",
  yellow: "#F59E0B",
  yellowLight: "#FCD34D",
  red: "#EF4444",
  redLight: "#F87171",
  text: "#F1F1F1",
  textMuted: "#8888AA",
  textSoft: "#C0C0D8",
  textDim: "#D0D0E8",
  border: "rgba(255,255,255,0.08)",
} as const;

export const zoneColor: Record<string, string> = {
  VIP: colors.purpleLight,
  Pro: colors.cyanLight,
  Standard: colors.textMuted,
};
