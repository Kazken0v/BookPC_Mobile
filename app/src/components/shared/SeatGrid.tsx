import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Monitor, Lock } from "lucide-react-native";
import { PCSpec, Zone } from "../../data/mockClubs";
import { colors, zoneColor } from "../../theme";

interface SeatGridProps {
  pcs: PCSpec[];
  selectedZone: Zone | null;
  selectedSeatIds: string[];
  onSelectSeat: (pc: PCSpec) => void;
}

export function SeatGrid({ pcs, selectedZone, selectedSeatIds, onSelectSeat }: SeatGridProps) {
  const filtered = selectedZone ? pcs.filter((p) => p.zone === selectedZone) : pcs;

  const grouped: Record<number, PCSpec[]> = {};
  filtered.forEach((pc) => {
    if (!grouped[pc.row]) grouped[pc.row] = [];
    grouped[pc.row].push(pc);
  });

  const legend = [
    { label: "Available", bg: "rgba(124,58,237,0.1)", border: `1px solid ${colors.purple}40`, color: colors.purple },
    { label: "Selected", bg: "rgba(124,58,237,0.3)", border: `2px solid ${colors.purple}`, color: colors.purple, selected: true },
    { label: "Occupied", bg: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: colors.red },
  ];

  return (
    <View style={{ gap: 16 }}>
      {Object.entries(grouped).map(([row, seats]) => {
        const zone = seats[0].zone;
        const color = zoneColor[zone];
        return (
          <View key={row}>
            <Text
              style={{
                color,
                fontSize: 12,
                fontWeight: "600",
                opacity: 0.8,
                marginBottom: 8,
              }}
            >
              {zone} Zone — Row {parseInt(row) + 1}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {seats.map((pc) => {
                const isSelected = selectedSeatIds.includes(pc.id);
                const isOccupied = pc.status === "occupied" || pc.status === "maintenance";
                const baseColor =
                  zone === "VIP" ? "124, 58, 237" : zone === "Pro" ? "6, 182, 212" : "136, 136, 170";

                return (
                  <TouchableOpacity
                    key={pc.id}
                    onPress={() => !isOccupied && onSelectSeat(pc)}
                    disabled={isOccupied}
                    activeOpacity={0.8}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isSelected
                        ? "rgba(124, 58, 237, 0.3)"
                        : isOccupied
                        ? "rgba(239, 68, 68, 0.1)"
                        : `rgba(${baseColor}, 0.1)`,
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected
                        ? colors.purple
                        : isOccupied
                        ? "rgba(239,68,68,0.3)"
                        : `${color}40`,
                      shadowColor: isSelected ? colors.purple : undefined,
                      shadowOpacity: isSelected ? 0.5 : 0,
                      shadowRadius: 6,
                    }}
                  >
                    {isOccupied ? (
                      <Lock size={16} color="rgba(239,68,68,0.7)" />
                    ) : (
                      <Monitor size={16} color={isSelected ? colors.purpleLight : color} />
                    )}
                    <Text
                      style={{
                        fontSize: 10,
                        marginTop: 2,
                        fontWeight: "600",
                        color: isSelected ? colors.purpleLight : isOccupied ? colors.redLight : color,
                        opacity: 0.9,
                      }}
                    >
                      {pc.seatNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}

      <View style={{ flexDirection: "row", gap: 16, marginTop: 4 }}>
        {legend.map((l) => (
          <View key={l.label} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                backgroundColor: l.bg as string,
                borderWidth: l.selected ? 2 : 1,
                borderColor: l.border as string,
              }}
            />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>{l.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
