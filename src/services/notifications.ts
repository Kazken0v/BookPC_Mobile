import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { Booking } from "../data/mockBookings";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("booking", {
      name: "Bookings",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#7C3AED",
    });
  }
}

export async function configureNotifications(): Promise<void> {
  if (!Device.isDevice) return;
  await ensureChannel();
  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
}

export async function hasNotificationPermission(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const settings = await Notifications.getPermissionsAsync();
  return settings.status === "granted";
}

export async function notifyBookingConfirmed(booking: Booking): Promise<void> {
  if (!Device.isDevice) return;
  await ensureChannel();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Бронь подтверждена 🎮",
      body: `${booking.clubName} · Место ${booking.seatNumber} · ${booking.date} в ${booking.startTime}`,
      data: { bookingId: booking.id, clubId: booking.clubId },
    },
    trigger: null,
  });

  if (booking.status === "upcoming") {
    const reminder = buildReminderDate(booking);
    if (reminder && reminder.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Скоро ваша сессия ⏰",
          body: `${booking.clubName}, место ${booking.seatNumber} через час!`,
          data: { bookingId: booking.id, clubId: booking.clubId },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder },
      });
    }
  }
}

function buildReminderDate(booking: Booking): Date | null {
  try {
    const [y, m, d] = booking.date.split("-").map(Number);
    const [hh, mm] = booking.startTime.split(":").map(Number);
    const start = new Date(y, m - 1, d, hh, mm);
    start.setHours(start.getHours() - 1);
    return start;
  } catch {
    return null;
  }
}
