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

    // Fetch train data from API
    const fetchTrain = async () => {
      try {
        const response = await fetch(`/api/trains/${routeId}`);
        if (!response.ok) {
          throw new Error('Train not found');
        }
        const train = await response.json();

        // Transform to route format
        const routeData: Route = {
          id: train.id.toString(),
          departureTime: new Date(`${train.departureDate.split('T')[0]}T${train.departureHour}`).toISOString(),
          arrivalTime: new Date(`${train.departureDate.split('T')[0]}T${train.departureHour}`).toISOString(), // Simplified
          price: train.price,
          train: { id: train.id.toString(), name: `Train ${train.id}`, capacity: train.remainingPlaces + 10 },
          departureStation: { id: `dep-${train.id}`, name: `Gare ${train.departureCity}`, city: train.departureCity },
          arrivalStation: { id: `arr-${train.id}`, name: `Gare ${train.arrivalCity}`, city: train.arrivalCity },
        };
        setRoute(routeData);
      } catch (error) {
        console.error('Error fetching train:', error);
        router.push('/');
      }
    };

    fetchTrain();
  }, [routeId, router]);

  const calculateTotal = () => {
    let total = route?.price || 0;
    const breakdown = [`Prix de base: ${route?.price || 0}€`];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.email !== form.emailConfirm) {
      alert('Les emails ne correspondent pas');
      return;
    }

    try {
      const { total } = calculateTotal();
      const bookingData = {
        trainId: parseInt(route!.id),
        seats: 1, // Simplified, assuming 1 seat per booking
        totalPrice: parseFloat(total),
        passengerInfo: {
          title: form.title,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
        },
        options: {
          comfortSeat: form.comfortSeat,
          electricPlug: form.electricPlug,
          extraLuggage: form.extraLuggage,
          smsBriefing: form.smsBriefing,
          travelInsurance: form.travelInsurance,
        },
        memberId: form.memberId || null,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const booking = await response.json();

      // Generate PDF-like output
      const { breakdown } = calculateTotal();
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

      // Redirect to bookings page
      router.push('/bookings');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    }
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
            Aucun paiement réel n&apos;est traité. Ne saisissez jamais d&apos;informations bancaires sensibles dans une application de démonstration.
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
              <label className="block text-sm font-medium mb-2">Date d&apos;expiration</label>
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
