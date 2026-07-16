import * as SecureStore from "expo-secure-store";
import { Booking } from "../data/mockBookings";

const key = (userId: string) => `cofou.bookings.${userId}`;

export async function getBookings(userId: string): Promise<Booking[]> {
  const raw = await SecureStore.getItemAsync(key(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveBookings(userId: string, bookings: Booking[]): Promise<void> {
  await SecureStore.setItemAsync(key(userId), JSON.stringify(bookings));
}

export async function addBooking(userId: string, booking: Booking): Promise<Booking[]> {
  const bookings = await getBookings(userId);
  const next = [booking, ...bookings];
  await saveBookings(userId, next);
  return next;
}

export async function updateBooking(
  userId: string,
  id: string,
  patch: Partial<Booking>
): Promise<Booking[]> {
  const bookings = await getBookings(userId);
  const next = bookings.map((b) => (b.id === id ? { ...b, ...patch } : b));
  await saveBookings(userId, next);
  return next;
}
