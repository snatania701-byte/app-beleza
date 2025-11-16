"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Undo, Check, Sparkles } from 'lucide-react';

interface AcneRemovalToolProps {
  photoUrl: string;
  onClose: () => void;
  onSave: (editedImageUrl: string) => void;
}

interface SpotMark {
  x: number;
  y: number;
  id: number;
}

export default function AcneRemovalTool({ photoUrl, onClose, onSave }: AcneRemovalToolProps) {
  const [spots, setSpots] = useState<SpotMark[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageLoaded && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
    }
  }, [imageLoaded]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Converter coordenadas relativas para absolutas da imagem
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;

    const newSpot: SpotMark = {
      x: x * scaleX,
      y: y * scaleY,
      id: Date.now()
    };

    setSpots([...spots, newSpot]);
  };

  const handleUndo = () => {
    if (spots.length > 0) {
      setSpots(spots.slice(0, -1));
    }
  };

  const handleApply = async () => {
    if (spots.length === 0) {
      onClose();
      return;
    }

    setIsProcessing(true);

    // Simular processamento de IA
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Desenhar imagem original
        ctx.drawImage(imageRef.current, 0, 0);

        // Aplicar efeito de remoção em cada spot
        spots.forEach(spot => {
          const radius = 15;
          
          // Criar gradiente radial para suavizar
          const gradient = ctx.createRadialGradient(
            spot.x, spot.y, 0,
            spot.x, spot.y, radius
          );
          
          // Pegar cor da pele ao redor (simplificado)
          const imageData = ctx.getImageData(spot.x - 1, spot.y - 1, 3, 3);
          const pixels = imageData.data;
          let r = 0, g = 0, b = 0;
          
          for (let i = 0; i < pixels.length; i += 4) {
            r += pixels[i];
            g += pixels[i + 1];
            b += pixels[i + 2];
          }
          
          const count = pixels.length / 4;
          r = Math.floor(r / count);
          g = Math.floor(g / count);
          b = Math.floor(b / count);

          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.5)`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(spot.x, spot.y, radius, 0, Math.PI * 2);
          ctx.fill();

          // Aplicar blur suave
          ctx.filter = 'blur(2px)';
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = 'none';
        });

        // Converter canvas para URL
        const editedImageUrl = canvas.toDataURL('image/jpeg', 0.95);
        onSave(editedImageUrl);
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Remover Acne</h2>
              <p className="text-sm text-white/80">Toque nas manchas para remover</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Image Editor */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div 
          ref={containerRef}
          className="relative max-w-4xl w-full cursor-crosshair"
          onClick={handleImageClick}
        >
          <img
            ref={imageRef}
            src={photoUrl}
            alt="Editing"
            className="w-full h-auto rounded-lg shadow-2xl"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Marcadores de spots */}
          {spots.map((spot) => {
            if (!containerRef.current || !imageRef.current) return null;
            
            const rect = containerRef.current.getBoundingClientRect();
            const scaleX = rect.width / imageRef.current.naturalWidth;
            const scaleY = rect.height / imageRef.current.naturalHeight;
            
            return (
              <div
                key={spot.id}
                className="absolute w-8 h-8 -ml-4 -mt-4 pointer-events-none"
                style={{
                  left: `${spot.x * scaleX}px`,
                  top: `${spot.y * scaleY}px`
                }}
              >
                <div className="w-full h-full rounded-full border-2 border-red-500 bg-red-500/20 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-white animate-ping" />
              </div>
            );
          })}

          {/* Canvas oculto para processamento */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="text-white">
            <p className="text-sm text-gray-400">Manchas marcadas</p>
            <p className="text-2xl font-bold">{spots.length}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUndo}
              disabled={spots.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Undo className="w-5 h-5" />
              Desfazer
            </button>

            <button
              onClick={handleApply}
              disabled={isProcessing}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Aplicar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
