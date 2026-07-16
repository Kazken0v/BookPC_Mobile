import React from "react";
import { View, Text } from "react-native";
import { Star } from "lucide-react-native";
import { colors } from "../../theme";

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

export function StarRating({ rating, size = 14, showValue = true }: StarRatingProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      <View style={{ flexDirection: "row", gap: 1 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            fill={i <= Math.round(rating) ? colors.yellow : "transparent"}
            color={i <= Math.round(rating) ? colors.yellow : colors.textMuted}
          />
        ))}
      </View>
      {showValue && (
        <Text style={{ color: colors.yellow, fontSize: 12, fontWeight: "600", marginLeft: 4 }}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}
