import { createContext, useContext, useState, ReactNode } from "react";
import { Zone, PCSpec } from "../data/mockClubs";

export interface SelectedSeat {
  id: string;
  seatNumber: string;
  zone: Zone;
  pricePerHour: number;
}

export interface BookingState {
  clubId: string;
  clubName: string;
  selectedDate: string;
  selectedTime: string;
  selectedSeats: SelectedSeat[];
  selectedZone: Zone | null;
  duration: number;
}

interface BookingContextValue {
  booking: BookingState;
  setClub: (id: string, name: string) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  toggleSeat: (pc: PCSpec) => void;
  setZone: (zone: Zone) => void;
  setDuration: (hours: number) => void;
  resetBooking: () => void;
  totalPrice: number;
}

const defaultBooking: BookingState = {
  clubId: "",
  clubName: "",
  selectedDate: "",
  selectedTime: "",
  selectedSeats: [],
  selectedZone: null,
  duration: 2,
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(defaultBooking);

  const setClub = (id: string, name: string) =>
    setBooking((b) => ({ ...b, clubId: id, clubName: name }));

  const setDate = (date: string) =>
    setBooking((b) => ({ ...b, selectedDate: date }));

  const setTime = (time: string) =>
    setBooking((b) => ({ ...b, selectedTime: time }));

  const toggleSeat = (pc: PCSpec) =>
    setBooking((b) => {
      const exists = b.selectedSeats.find((s) => s.id === pc.id);
      const selectedSeats = exists
        ? b.selectedSeats.filter((s) => s.id !== pc.id)
        : [
            ...b.selectedSeats,
            {
              id: pc.id,
              seatNumber: pc.seatNumber,
              zone: pc.zone,
              pricePerHour: pc.pricePerHour,
            },
          ];
      return { ...b, selectedSeats, selectedZone: pc.zone };
    });

  const setZone = (zone: Zone) =>
    setBooking((b) => ({ ...b, selectedZone: zone, selectedSeats: [] }));

  const setDuration = (hours: number) =>
    setBooking((b) => ({ ...b, duration: hours }));

  const resetBooking = () => setBooking(defaultBooking);

  const totalPrice =
    booking.selectedSeats.reduce((sum, seat) => sum + seat.pricePerHour, 0) * booking.duration;

  return (
    <BookingContext.Provider
      value={{ booking, setClub, setDate, setTime, toggleSeat, setZone, setDuration, resetBooking, totalPrice }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
