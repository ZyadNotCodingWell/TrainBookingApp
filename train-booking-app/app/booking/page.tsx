"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

interface Station {
  id: string;
  name: string;
  city: string;
}

interface BookingForm {
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailConfirm: string;
  memberId: string;
  comfortSeat: boolean;
  electricPlug: boolean;
  extraLuggage: boolean;
  smsBriefing: boolean;
  travelInsurance: boolean;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeId = searchParams.get('routeId');
	const [price, setPrice] = useState(45);
  const [route, setRoute] = useState<Route | null>(null);
  const [form, setForm] = useState<BookingForm>({
    title: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    emailConfirm: '',
    memberId: '',
    comfortSeat: false,
    electricPlug: false,
    extraLuggage: false,
    smsBriefing: false,
    travelInsurance: false,
  });

  useEffect(() => {
    if (!routeId) {
      router.push('/');
      return;
    }

    // Mock route data - in real app, fetch from API
    const mockRoute: Route = {
      id: routeId,
      departureTime: "2024-01-15T08:00:00Z",
      arrivalTime: "2024-01-15T10:30:00Z",
      price: price,
      train: { id: "t1", name: "Express 101", capacity: 200 },
      departureStation: { id: "s1", name: "Gare du Nord", city: "Paris" },
      arrivalStation: { id: "s2", name: "Gare de Lyon", city: "Lyon" },
    };
    setRoute(mockRoute);
  }, [routeId, router]);

  const calculateTotal = () => {
    let total = route?.price || 0;
    let breakdown = [`Prix de base: ${route?.price || 0}€`];

    if (form.comfortSeat) {
      total += 2.99;
      breakdown.push(`Siège confort: +2.99€`);
    }
    if (form.electricPlug) {
      total += 1.99;
      breakdown.push(`Prise électrique: +1.99€`);
    }
    if (form.extraLuggage) {
      total += 4.99;
      breakdown.push(`Bagage supplémentaire: +4.99€`);
    }
    if (form.smsBriefing) {
      total += 0.99;
      breakdown.push(`Briefing SMS: +0.99€`);
    }
    if (form.travelInsurance) {
      total += 2.99;
      breakdown.push(`Assurance voyage: +2.99€`);
    }

    // Member discount
    if (form.memberId) {
      total -= 9.99;
      breakdown.push(`Réduction membre: -9.99€`);
    }

    return { total: total.toFixed(2), breakdown };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.email !== form.emailConfirm) {
      alert('Les emails ne correspondent pas');
      return;
    }

    // Generate PDF-like output
    const { total, breakdown } = calculateTotal();
    const bookingDetails = {
      ...form,
      route,
      total,
      breakdown,
      bookingDate: new Date().toISOString(),
    };

    // Mock PDF generation - in real app, use a PDF library
    const pdfContent = `
TRAIN BOOKING CONFIRMATION

Route: ${route?.departureStation.city} → ${route?.arrivalStation.city}
Train: ${route?.train.name}
Departure: ${new Date(route?.departureTime || '').toLocaleString()}
Arrival: ${new Date(route?.arrivalTime || '').toLocaleString()}

Passenger Information:
Title: ${form.title}
Name: ${form.firstName} ${form.lastName}
Phone: ${form.phone}
Email: ${form.email}

Price Breakdown:
${breakdown.join('\n')}

Total Price: ${total}€

Booking Date: ${new Date().toLocaleString()}

Thank you for your booking!
    `;

    // Display PDF content in alert (mock)
    alert('PDF généré:\n\n' + pdfContent);

    // In real app, redirect to confirmation page
    router.push('/bookings');
  };

  if (!route) {
    return <div className="container mx-auto p-4 text-center">Chargement...</div>;
  }

  return (
    <div className=" mx-auto p-4 overflow-y-scroll h-screen py-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Réservation de billet</h1>

      <div className="bg-black/75 backdrop-blur-lg p-6 rounded shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Détails du trajet</h2>
        <p><strong>De:</strong> {route.departureStation.city} ({route.departureStation.name})</p>
        <p><strong>À:</strong> {route.arrivalStation.city} ({route.arrivalStation.name})</p>
        <p><strong>Train:</strong> {route.train.name}</p>
        <p><strong>Départ:</strong> {new Date(route.departureTime).toLocaleString()}</p>
        <p><strong>Arrivée:</strong> {new Date(route.arrivalTime).toLocaleString()}</p>
        <p><strong>Prix de base:</strong> {route.price}€</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-black/75 backdrop-blur-lg p-6 rounded shadow-md space-y-6">
        <h2 className="text-xl font-bold">Informations personnelles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre</label>
            <select
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez</option>
              <option value="Mr">Monsieur</option>
              <option value="Ms">Madame</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prénom</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({...form, firstName: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({...form, lastName: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Téléphone mobile</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirmer Email</label>
            <input
              type="email"
              value={form.emailConfirm}
              onChange={(e) => setForm({...form, emailConfirm: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Numéro de membre (optionnel - 9.99€ de réduction)</label>
          <input
            type="text"
            value={form.memberId}
            onChange={(e) => setForm({...form, memberId: e.target.value})}
            placeholder="Entrez votre numéro de membre"
            className="w-full p-2 border rounded"
          />
        </div>

        <h2 className="text-xl font-bold">Options supplémentaires</h2>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.comfortSeat}
              onChange={(e) => setForm({...form, comfortSeat: e.target.checked})}
              className="mr-2"
            />
            Siège confort (+2.99€)
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.electricPlug}
              onChange={(e) => setForm({...form, electricPlug: e.target.checked})}
              className="mr-2"
            />
            Prise électrique (+1.99€)
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.extraLuggage}
              onChange={(e) => setForm({...form, extraLuggage: e.target.checked})}
              className="mr-2"
            />
            Bagage supplémentaire (+4.99€)
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.smsBriefing}
              onChange={(e) => setForm({...form, smsBriefing: e.target.checked})}
              className="mr-2"
            />
            Briefing SMS (+0.99€)
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.travelInsurance}
              onChange={(e) => setForm({...form, travelInsurance: e.target.checked})}
              className="mr-2"
            />
            Assurance voyage (annulation ou perturbations) (+2.99€)
          </label>
        </div>
        <div className="bg-yellow-100 p-4 rounded border-l-4 border-yellow-500">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Attention:</strong> Les informations bancaires sont désactivées dans cette démonstration.
            Aucun paiement réel n'est traité. Ne saisissez jamais d'informations bancaires sensibles dans une application de démonstration.
          </p>
        </div>

        <div className="  rounded">
          <h3 className="text-lg font-bold mb-4">Informations bancaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Numéro de carte</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 rounded bg-gray-500 text-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date d'expiration</label>
              <input
                type="text"
                placeholder="MM/AA"
                className="w-full p-2 rounded bg-gray-500 text-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full p-2 rounded bg-gray-500 text-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nom du titulaire</label>
              <input
                type="text"
                placeholder="JOHN DOE"
                className="w-full p-2 rounded bg-gray-500 text-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-700/60 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Récapitulatif du prix</h3>
          {calculateTotal().breakdown.map((item, index) => (
            <p key={index} className="text-sm">{item}</p>
          ))}
          <hr className="my-2" />
          <p className="text-lg font-bold">Total: {calculateTotal().total}€</p>
        </div>

        

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded text-lg"
        >
          Confirmer la réservation
        </button>
      </form>
    </div>
  );
}
