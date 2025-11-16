"use client";

import { useState, useRef } from 'react';
import { Camera, RotateCcw, Check, Sparkles } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCapture: (photoUrl: string) => void;
}

export default function CameraCapture({ onPhotoCapture }: CameraCaptureProps) {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateCapture = () => {
    setIsSimulating(true);
    // Simular captura com imagem de exemplo
    setTimeout(() => {
      const simulatedPhoto = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop";
      setCapturedPhoto(simulatedPhoto);
      setIsSimulating(false);
    }, 1500);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-16 h-16 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Capture sua Selfie
          </h1>
          <p className="text-gray-600">
            Tire uma foto do seu rosto para análise personalizada
          </p>
        </div>

        {/* Camera Preview / Captured Photo */}
        <div className="mb-8">
          {!capturedPhoto ? (
            <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl overflow-hidden flex items-center justify-center">
              {isSimulating ? (
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">Capturando...</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <Camera className="w-24 h-24 text-purple-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold mb-2">
                    Posicione seu rosto no centro
                  </p>
                  <p className="text-sm text-gray-500">
                    Certifique-se de estar em um local bem iluminado
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-square rounded-3xl overflow-hidden">
              <img
                src={capturedPhoto}
                alt="Captured selfie"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Capturada</span>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!capturedPhoto && (
          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Dicas para melhor resultado:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Remova óculos e acessórios do rosto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Mantenha expressão neutra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Olhe diretamente para a câmera</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Certifique-se de boa iluminação</span>
              </li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!capturedPhoto ? (
            <>
              <button
                onClick={handleSimulateCapture}
                disabled={isSimulating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Camera className="w-6 h-6" />
                {isSimulating ? 'Capturando...' : 'Capturar Foto'}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white border-2 border-purple-500 text-purple-500 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all"
              >
                Escolher da Galeria
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleRetake}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Refazer
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Confirmar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
