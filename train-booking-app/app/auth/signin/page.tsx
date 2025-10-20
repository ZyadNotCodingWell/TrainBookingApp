"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mock authentication - in real app, this would call your auth API
    if (email && password) {
      // For demo purposes, simulate successful login
      alert(`${isSignUp ? 'Inscription' : 'Connexion'} réussie!`);
      // In real app: signIn('credentials', { email, password, callbackUrl: '/' });
    }
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <div className="bg-black/75 backdrop-blur-lg p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isSignUp ? 'Inscription' : 'Connexion'}
        </h1>
        <p className="text-center mb-6">
          {isSignUp ? 'Créez un compte pour réserver vos trains' : 'Connectez-vous pour réserver vos trains'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isSignUp ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:text-blue-700"
          >
            {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 mt-4">
          <p>Ceci est un formulaire de démonstration.</p>
          <p>Dans une vraie application, l'authentification serait gérée par NextAuth.</p>
        </div>
      </div>
    </div>
  );
}
