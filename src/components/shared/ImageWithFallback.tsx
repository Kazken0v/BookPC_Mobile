import React, { useState } from "react";
import { View, Image, ImageProps } from "react-native";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(props: ImageProps) {
  const [didError, setDidError] = useState(false);
  const { source, style, ...rest } = props;

  if (didError) {
    return (
      <View
        style={[
          { backgroundColor: "#1A1A2E", alignItems: "center", justifyContent: "center" },
          style as any,
        ]}
      >
        <Image source={{ uri: ERROR_IMG_SRC }} style={{ width: 44, height: 44 }} {...(rest as any)} />
      </View>
    );
  }

  return (
    <Image
      source={source as any}
      style={style}
      onError={() => setDidError(true)}
      {...(rest as any)}
    />
  );
}
