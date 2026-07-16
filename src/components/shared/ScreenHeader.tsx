import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  transparent?: boolean;
}

export function ScreenHeader({ title, onBack, rightSlot, transparent }: ScreenHeaderProps) {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: transparent ? "transparent" : "rgba(13, 17, 23, 0.85)",
        borderBottomWidth: transparent ? 0 : 1,
        borderBottomColor: "rgba(124, 58, 237, 0.15)",
      }}
    >
      <TouchableOpacity
        onPress={handleBack}
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(124, 58, 237, 0.15)",
          borderWidth: 1,
          borderColor: "rgba(124, 58, 237, 0.3)",
        }}
      >
        <ChevronLeft size={20} color={colors.purple} />
      </TouchableOpacity>

      <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>{title}</Text>

      <View style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
        {rightSlot}
      </View>
    </View>
  );
}
