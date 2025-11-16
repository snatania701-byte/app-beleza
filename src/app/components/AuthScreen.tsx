"use client";

import { useState } from 'react';
import { Mail, Phone, Sparkles } from 'lucide-react';
import { User } from '@/lib/types';

interface AuthScreenProps {
  onAuthComplete: (user: User) => void;
}

export default function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleAuth = (method: 'email' | 'phone' | 'google' | 'apple') => {
    // Simulação de autenticação
    const user: User = {
      id: Date.now().toString(),
      name: name || 'Usuário',
      email: method === 'email' ? email : undefined,
      phone: method === 'phone' ? phone : undefined,
      isPremium: false,
    };

    // Salvar no localStorage
    localStorage.setItem('auraUser', JSON.stringify(user));
    onAuthComplete(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-16 h-16 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo ao Aura BeautyIA
          </h1>
          <p className="text-gray-600">
            Crie sua conta para começar sua transformação
          </p>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seu Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
          />
        </div>

        {/* Auth Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
              authMethod === 'email'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mail className="w-5 h-5" />
            Email
          </button>
          <button
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
              authMethod === 'phone'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Phone className="w-5 h-5" />
            Telefone
          </button>
        </div>

        {/* Email/Phone Input */}
        {authMethod === 'email' ? (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={() => handleAuth(authMethod)}
          disabled={!name || (authMethod === 'email' ? !email : !phone)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-6"
        >
          Continuar
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">ou continue com</span>
          </div>
        </div>

        {/* Social Auth Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleAuth('google')}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-semibold text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          <button
            onClick={() => handleAuth('apple')}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition-all font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continuar com Apple
          </button>
        </div>
      </div>
    </div>
  );
}
