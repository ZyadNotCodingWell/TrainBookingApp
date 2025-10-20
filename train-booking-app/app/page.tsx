"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Station {
  id: string;
  name: string;
  city: string;
}

interface Route {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  train: {
    id: string;
    name: string;
    capacity: number;
  };
  departureStation: Station;
  arrivalStation: Station;
}

export default function HomePage() {
  const router = useRouter();
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/trains?departureCity=${encodeURIComponent(departure)}&arrivalCity=${encodeURIComponent(arrival)}${date ? `&date=${date}` : ''}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const trains = await response.json();

      // Transform trains to routes format for display
      const transformedRoutes: Route[] = trains.map((train: {
        id: number;
        departureCity: string;
        arrivalCity: string;
        departureDate: string;
        departureHour: string;
        price: number;
        remainingPlaces: number;
      }) => ({
        id: train.id.toString(),
        departureTime: new Date(`${train.departureDate.split('T')[0]}T${train.departureHour}`).toISOString(),
        arrivalTime: new Date(`${train.departureDate.split('T')[0]}T${train.departureHour}`).toISOString(), // Simplified, would need actual arrival calculation
        price: train.price,
        train: { id: train.id.toString(), name: `Train ${train.id}`, capacity: train.remainingPlaces + 10 }, // Simplified
        departureStation: { id: `dep-${train.id}`, name: `Gare ${train.departureCity}`, city: train.departureCity },
        arrivalStation: { id: `arr-${train.id}`, name: `Gare ${train.arrivalCity}`, city: train.arrivalCity },
      }));

      setRoutes(transformedRoutes);
    } catch (error) {
      console.error('Search error:', error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (routeId: string) => {
    // Redirect to booking page with route details
    router.push(`/booking?routeId=${routeId}`);
  };

  return (
    <div className="container mx-auto p-4 pb-0 h-screen overflow-hidden ">
      <h1 className="text-5xl font-bold mb-8 text-center text-gray-800 mt-24">Réservez votre train</h1>

      <form onSubmit={handleSearch} className="bg-black/75 backdrop-blur-xl p-6 rounded-xl shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block  font-medium mb-2 text-blue-600">Départ</label>
            <input
              type="text"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              placeholder="Ville de départ"
              className="w-full p-2 border rounded bg-white placeholder:text-black/60 text-black"
              required
            />
          </div>
          <div>
            <label className="block  font-medium mb-2 text-blue-600">Arrivée</label>
            <input
              type="text"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              placeholder="Ville d'arrivée"
              className="w-full p-2 border rounded bg-white placeholder:text-black/60 text-black"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-blue-600">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded bg-white placeholder:text-black/60 text-black"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Recherche..." : "Rechercher"}
            </button>
          </div>
        </div>
      </form>

      {routes.length > 0 && (
        <div className="mt-24 ">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Résultats de recherche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
          3+. gap-4">
            {routes.map((route) => (
              <div key={route.id} className="bg-black/75 backdrop-blur-lg p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">
                  {route.departureStation.city} → {route.arrivalStation.city}
                </h3>
                <p>Train: {route.train.name}</p>
                <p>Départ: {new Date(route.departureTime).toLocaleString()}</p>
                <p>Arrivée: {new Date(route.arrivalTime).toLocaleString()}</p>
                <p>Prix: {route.price} €</p>
                <button
                  onClick={() => handleBook(route.id)}
                  className="mt-4 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Réserver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
