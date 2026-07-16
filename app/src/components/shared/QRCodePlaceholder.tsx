import React from "react";
import { View, Text } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface QRCodePlaceholderProps {
  code: string;
  size?: number;
}

export function QRCodePlaceholder({ code, size = 140 }: QRCodePlaceholderProps) {
  const cellSize = 6;
  const grid = 19;
  const seed = code.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const cells: boolean[][] = Array.from({ length: grid }, (_, r) =>
    Array.from({ length: grid }, (_, c) => {
      if ((r < 7 && c < 7) || (r < 7 && c >= grid - 7) || (r >= grid - 7 && c < 7)) {
        const isOuterBorder =
          (r === 0 || r === 6 || c === 0 || c === 6) ||
          (r >= grid - 7 && (r === grid - 7 || r === grid - 1 || c === 0 || c === 6));
        const isInnerBox =
          (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
          (r >= 2 && r <= 4 && c >= grid - 5 && c <= grid - 3) ||
          (r >= grid - 5 && r <= grid - 3 && c >= 2 && c <= 4);
        return isOuterBorder || isInnerBox;
      }
      return ((seed * (r + 1) * (c + 1) * 7 + r * 13 + c * 17) % 11) > 4;
    })
  );

  return (
    <View style={{ alignItems: "center", gap: 12 }}>
      <View
        style={{
          borderRadius: 16,
          padding: 12,
          backgroundColor: "#FFFFFF",
          borderWidth: 2,
          borderColor: "rgba(124, 58, 237, 0.4)",
        }}
      >
        <Svg width={grid * cellSize} height={grid * cellSize}>
          {cells.map((row, r) =>
            row.map((filled, c) =>
              filled ? (
                <Rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize - 1}
                  height={cellSize - 1}
                  fill="#0F0F0F"
                  rx={1}
                />
              ) : null
            )
          )}
        </Svg>
      </View>
      <Text style={{ fontSize: 12, fontFamily: "monospace", color: colors_textMuted }}>{code}</Text>
    </View>
  );
}

const colors_textMuted = "#8888AA";
