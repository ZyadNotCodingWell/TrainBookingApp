"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4 text-white sticky top-0  z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          TrainBooking
        </Link>
        <div>
          {session ? (
            <>
              <span className="mr-4">Bienvenue, {session.user?.email}</span>
              <Link href="/bookings" className="mr-4 hover:text-gray-300">
                Mes Réservations
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}