"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Station {
  id: string;
  name: string;
  city: string;
}

interface Train {
  id: string;
  name: string;
  capacity: number;
}

interface Route {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  train: Train;
  departureStation: Station;
  arrivalStation: Station;
}

interface Ticket {
  id: string;
  seatNumber: number;
  route: Route;
}

interface Booking {
  id: string;
  bookingDate: string;
  status: string;
  ticket: Ticket;
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings", {
          headers: {
            'Authorization': `Bearer ${session.user?.email}`, // Simplified auth, should use proper JWT
          },
        });
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération de vos réservations.");
        }
        const data: Booking[] = await res.json();
        setBookings(data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "Une erreur inattendue est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, status, router]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Chargement de vos réservations...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500 text-center">Erreur: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 overflow-y-scroll h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Mes Réservations</h1>
      {bookings.length === 0 ? (
        <p className="text-center">Vous n&apos;avez pas encore de réservations.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded shadow-md">
              <h2 className="text-xl font-bold mb-2">Billet pour {booking.ticket.route.departureStation.city} à {booking.ticket.route.arrivalStation.city}</h2>
              <p>Train: {booking.ticket.route.train.name}</p>
              <p>Siège: {booking.ticket.seatNumber}</p>
              <p>Départ: {new Date(booking.ticket.route.departureTime).toLocaleString()}</p>
              <p>Arrivée: {new Date(booking.ticket.route.arrivalTime).toLocaleString()}</p>
              <p>Prix: {booking.ticket.route.price} €</p>
              <p>Réservé le: {new Date(booking.bookingDate).toLocaleString()}</p>
              <p>Statut: {booking.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
