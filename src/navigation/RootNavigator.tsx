import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/AuthContext";
import { HomeScreen } from "../screens/HomeScreen";
import { MapScreen } from "../screens/MapScreen";
import { MyBookingsScreen } from "../screens/MyBookingsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { ClubProfileScreen } from "../screens/ClubProfileScreen";
import { BookingScreen } from "../screens/BookingScreen";
import { PaymentScreen } from "../screens/PaymentScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { Home, Map as MapIcon, Calendar, User } from "lucide-react-native";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: "rgba(124, 58, 237, 0.2)",
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarIcon: ({ color, size }) => <MapIcon size={size} color={color} /> }} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} options={{ tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

function SafeScreen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgDeep }} edges={["top", "left", "right"]}>
      {children}
    </SafeAreaView>
  );
}

const AuthScreenSafe = () => (
  <SafeScreen>
    <AuthScreen />
  </SafeScreen>
);
const MainTabsSafe = () => (
  <SafeScreen>
    <MainTabs />
  </SafeScreen>
);
const ClubProfileSafe = () => (
  <SafeScreen>
    <ClubProfileScreen />
  </SafeScreen>
);
const BookingSafe = () => (
  <SafeScreen>
    <BookingScreen />
  </SafeScreen>
);
const PaymentSafe = () => (
  <SafeScreen>
    <PaymentScreen />
  </SafeScreen>
);

export function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgDeep }} />
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreenSafe} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabsSafe} />
          <Stack.Screen name="ClubProfile" component={ClubProfileSafe} />
          <Stack.Screen name="Booking" component={BookingSafe} />
          <Stack.Screen name="Payment" component={PaymentSafe} />
        </>
      )}
    </Stack.Navigator>
  );
}
